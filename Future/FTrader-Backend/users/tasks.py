import logging
from celery import shared_task
from django.utils import timezone
from django.conf import settings
from django.db import transaction
from django.contrib.auth import get_user_model
from core.tasks import UserTask
from notifications.tasks import create_notification

logger = logging.getLogger(__name__)
User = get_user_model()


@shared_task(
    bind=True,
    base=UserTask,
    max_retries=3,
    default_retry_delay=60,
    autoretry_for=(Exception,),
    retry_backoff=True
)
def cleanup_inactive_users(self):
    """
    Clean up inactive user accounts that haven't been activated
    """
    logger.info("Starting cleanup of inactive user accounts")
    
    try:
        # Get the inactivity threshold from settings or use default (30 days)
        inactivity_days = getattr(settings, 'USER_INACTIVITY_THRESHOLD_DAYS', 30)
        threshold_date = timezone.now() - timezone.timedelta(days=inactivity_days)
        
        # Find inactive and unverified users
        inactive_users = User.objects.filter(
            is_active=False,
            date_joined__lt=threshold_date,
            profile__email_verified=False
        )
        
        if not inactive_users.exists():
            logger.info("No inactive users to clean up")
            return
        
        # Delete users in batches to avoid long-running transactions
        batch_size = 100
        total_deleted = 0
        
        while True:
            batch = inactive_users[:batch_size]
            if not batch.exists():
                break
                
            # Get count before deletion for logging
            count = batch.count()
            
            # Delete the batch
            batch.delete()
            
            total_deleted += count
            
            # Break if we've deleted less than a full batch
            if count < batch_size:
                break
        
        logger.info(f"Cleaned up {total_deleted} inactive user accounts")
    
    except Exception as e:
        logger.exception(f"Error in cleanup inactive users task: {str(e)}")
        raise self.retry(exc=e)


@shared_task(
    bind=True,
    base=UserTask,
    max_retries=3,
    default_retry_delay=300,
    autoretry_for=(Exception,),
    retry_backoff=True
)
def send_inactivity_reminders(self):
    """
    Send reminders to users who haven't logged in recently
    """
    logger.info("Starting inactivity reminders")
    
    try:
        # Define inactivity thresholds
        thresholds = {
            30: "It's been a month since you last visited FTrader",
            60: "We miss you! It's been 2 months since your last login",
            90: "Your account has been inactive for 3 months"
        }
        
        sent_count = 0
        error_count = 0
        
        # Check each threshold
        for days, message in thresholds.items():
            threshold_date = timezone.now() - timezone.timedelta(days=days)
            
            # Find users who haven't logged in since the threshold
            inactive_users = User.objects.filter(
                is_active=True,
                last_login__lt=threshold_date,
                profile__receive_inactivity_notifications=True
            ).exclude(
                # Exclude users who have already received this notification
                notifications__notification_type="INACTIVITY_REMINDER",
                notifications__data__contains=f'"days": {days}',
                notifications__created_at__gt=threshold_date
            )
            
            # Send notification to each user
            for user in inactive_users:
                try:
                    create_notification.delay(
                        user_id=user.id,
                        title="We miss you!",
                        message=message,
                        notification_type="INACTIVITY_REMINDER",
                        data={
                            "days": days,
                            "last_login": user.last_login.isoformat() if user.last_login else None
                        }
                    )
                    
                    sent_count += 1
                
                except Exception as e:
                    logger.exception(f"Error sending inactivity reminder to user {user.id}: {str(e)}")
                    error_count += 1
        
        logger.info(f"Inactivity reminders completed: {sent_count} reminders sent, {error_count} errors")
    
    except Exception as e:
        logger.exception(f"Error in send inactivity reminders task: {str(e)}")
        raise self.retry(exc=e)


@shared_task(
    bind=True,
    base=UserTask,
    max_retries=3,
    default_retry_delay=3600,
    autoretry_for=(Exception,),
    retry_backoff=True
)
def update_user_statistics(self):
    """
    Update user statistics for all active users
    """
    logger.info("Starting user statistics update")
    
    try:
        # Get all active users
        active_users = User.objects.filter(is_active=True)
        
        if not active_users.exists():
            logger.info("No active users to update statistics")
            return
        
        updated_count = 0
        error_count = 0
        
        # Update statistics for each user
        for user in active_users:
            try:
                with transaction.atomic():
                    profile = user.profile
                    
                    # Count user's positions
                    from trading.models import Position
                    open_positions = Position.objects.filter(user=user, status='OPEN').count()
                    closed_positions = Position.objects.filter(user=user, status='CLOSED').count()
                    
                    # Count user's portfolios
                    from portfolio.models import Portfolio, PortfolioItem
                    portfolios = Portfolio.objects.filter(user=user, is_active=True).count()
                    
                    # Count user's watchlists
                    from market_data.models import Watchlist, WatchlistItem
                    watchlists = Watchlist.objects.filter(user=user).count()
                    watchlist_items = WatchlistItem.objects.filter(watchlist__user=user).count()
                    
                    # Count user's alerts
                    from market_data.models import Alert
                    active_alerts = Alert.objects.filter(user=user, is_active=True).count()
                    triggered_alerts = Alert.objects.filter(user=user, triggered=True).count()
                    
                    # Update profile statistics
                    profile.statistics = {
                        'open_positions': open_positions,
                        'closed_positions': closed_positions,
                        'portfolios': portfolios,
                        'watchlists': watchlists,
                        'watchlist_items': watchlist_items,
                        'active_alerts': active_alerts,
                        'triggered_alerts': triggered_alerts,
                        'last_updated': timezone.now().isoformat()
                    }
                    profile.save()
                
                updated_count += 1
            
            except Exception as e:
                logger.exception(f"Error updating statistics for user {user.id}: {str(e)}")
                error_count += 1
        
        logger.info(f"User statistics update completed: {updated_count} users updated, {error_count} errors")
    
    except Exception as e:
        logger.exception(f"Error in update user statistics task: {str(e)}")
        raise self.retry(exc=e)


@shared_task(
    bind=True,
    base=UserTask,
    max_retries=3,
    default_retry_delay=86400,  # 24 hours
    autoretry_for=(Exception,),
    retry_backoff=True
)
def generate_user_activity_reports(self):
    """
    Generate weekly activity reports for users
    """
    logger.info("Starting user activity reports generation")
    
    try:
        # Check if today is the day to send weekly reports (e.g., Monday)
        today = timezone.now().weekday()
        if today != 0:  # 0 is Monday
            logger.info("Not Monday, skipping weekly reports")
            return
        
        # Get active users who want to receive reports
        active_users = User.objects.filter(
            is_active=True,
            profile__receive_weekly_reports=True
        )
        
        if not active_users.exists():
            logger.info("No active users for activity reports")
            return
        
        # Calculate the date range for the report (past week)
        end_date = timezone.now()
        start_date = end_date - timezone.timedelta(days=7)
        
        generated_count = 0
        error_count = 0
        
        # Generate report for each user
        for user in active_users:
            try:
                # Get user activity data
                from trading.models import Trade, Position
                from notifications.models import Notification
                
                # Trading activity
                trades = Trade.objects.filter(
                    user=user,
                    timestamp__gte=start_date,
                    timestamp__lte=end_date
                ).count()
                
                positions_opened = Position.objects.filter(
                    user=user,
                    created_at__gte=start_date,
                    created_at__lte=end_date
                ).count()
                
                positions_closed = Position.objects.filter(
                    user=user,
                    status='CLOSED',
                    closed_at__gte=start_date,
                    closed_at__lte=end_date
                ).count()
                
                # Calculate P/L for closed positions
                closed_positions = Position.objects.filter(
                    user=user,
                    status='CLOSED',
                    closed_at__gte=start_date,
                    closed_at__lte=end_date
                )
                
                total_pnl = sum([p.profit_loss for p in closed_positions]) if closed_positions.exists() else 0
                
                # Notification activity
                notifications = Notification.objects.filter(
                    user=user,
                    created_at__gte=start_date,
                    created_at__lte=end_date
                ).count()
                
                # Generate report data
                report_data = {
                    "period_start": start_date.isoformat(),
                    "period_end": end_date.isoformat(),
                    "trades_count": trades,
                    "positions_opened": positions_opened,
                    "positions_closed": positions_closed,
                    "total_pnl": float(total_pnl),
                    "notifications_count": notifications,
                    "generated_at": timezone.now().isoformat()
                }
                
                # Create notification with report
                create_notification.delay(
                    user_id=user.id,
                    title="Your Weekly Activity Report",
                    message=f"Your weekly activity report is ready. "
                            f"Trades: {trades}, P/L: {total_pnl:.2f}",
                    notification_type="WEEKLY_REPORT",
                    data=report_data
                )
                
                generated_count += 1
            
            except Exception as e:
                logger.exception(f"Error generating activity report for user {user.id}: {str(e)}")
                error_count += 1
        
        logger.info(f"User activity reports completed: {generated_count} reports generated, {error_count} errors")
    
    except Exception as e:
        logger.exception(f"Error in generate user activity reports task: {str(e)}")
        raise self.retry(exc=e)
