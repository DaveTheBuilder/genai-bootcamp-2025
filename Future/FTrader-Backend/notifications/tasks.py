import logging
import json
from celery import shared_task
from django.db import transaction
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Notification, NotificationPreference, NotificationTemplate
from users.models import User

logger = logging.getLogger(__name__)
channel_layer = get_channel_layer()


@shared_task
def process_notification_queue():
    """
    Process queued notifications and send them via appropriate channels
    """
    logger.info("Starting notification queue processing")
    
    try:
        # Get all unprocessed notifications
        notifications = Notification.objects.filter(
            processed=False
        ).select_related('user')
        
        if not notifications.exists():
            logger.info("No notifications to process")
            return
        
        # Process each notification
        for notification in notifications:
            try:
                user = notification.user
                
                # Get user preferences
                preferences = NotificationPreference.objects.filter(
                    user=user,
                    notification_type=notification.notification_type
                ).first()
                
                # Default to all channels if no preferences found
                if not preferences:
                    send_websocket = True
                    send_email = True
                    send_push = True
                else:
                    send_websocket = preferences.websocket_enabled
                    send_email = preferences.email_enabled
                    send_push = preferences.push_enabled
                
                # Send via WebSocket
                if send_websocket:
                    try:
                        async_to_sync(channel_layer.group_send)(
                            f"notifications_{user.id}",
                            {
                                "type": "notification.message",
                                "notification": {
                                    "id": str(notification.id),
                                    "title": notification.title,
                                    "message": notification.message,
                                    "notification_type": notification.notification_type,
                                    "data": notification.data,
                                    "created_at": notification.created_at.isoformat(),
                                    "is_read": notification.is_read
                                }
                            }
                        )
                        logger.info(f"Sent notification {notification.id} via WebSocket")
                    except Exception as e:
                        logger.exception(f"Error sending notification {notification.id} via WebSocket: {str(e)}")
                
                # Send via Email
                if send_email and user.email:
                    try:
                        # Check if this notification type should be sent via email
                        if notification.notification_type in ['MARKET_ALERT', 'POSITION_UPDATE', 'ORDER_UPDATE', 'PORTFOLIO_REPORT']:
                            send_mail(
                                subject=notification.title,
                                message=notification.message,
                                from_email=settings.DEFAULT_FROM_EMAIL,
                                recipient_list=[user.email],
                                fail_silently=False
                            )
                            logger.info(f"Sent notification {notification.id} via Email")
                    except Exception as e:
                        logger.exception(f"Error sending notification {notification.id} via Email: {str(e)}")
                
                # Send via Push Notification (placeholder for future implementation)
                if send_push and user.profile.push_token:
                    try:
                        # This would be implemented with a push notification service
                        logger.info(f"Would send notification {notification.id} via Push (not implemented)")
                    except Exception as e:
                        logger.exception(f"Error sending notification {notification.id} via Push: {str(e)}")
                
                # Mark notification as processed
                notification.processed = True
                notification.processed_at = timezone.now()
                notification.save()
            
            except Exception as e:
                logger.exception(f"Error processing notification {notification.id}: {str(e)}")
        
        logger.info(f"Completed processing {notifications.count()} notifications")
    
    except Exception as e:
        logger.exception(f"Error in notification queue processing task: {str(e)}")


@shared_task
def send_stream_error_notification(user_id, error_message, error_data=None):
    """
    Send a notification about a stream error
    
    Args:
        user_id: User ID
        error_message: Error message
        error_data: Additional error data
    """
    try:
        user = User.objects.get(id=user_id)
        
        # Default error data with retry and offline mode options
        if error_data is None:
            error_data = {
                "errorType": "connection",
                "canRetry": True,
                "canSwitchToOfflineMode": True
            }
        
        # Create notification
        notification = Notification.objects.create(
            user=user,
            title="Stream Connection Error",
            message=error_message,
            notification_type="STREAM_ERROR",
            data=error_data,
            is_error=True
        )
        
        # Process immediately
        process_notification_queue.delay()
        
        logger.info(f"Created stream error notification {notification.id} for user {user_id}")
        return str(notification.id)
    
    except User.DoesNotExist:
        logger.error(f"User {user_id} not found for stream error notification")
        return None
    
    except Exception as e:
        logger.exception(f"Error creating stream error notification for user {user_id}: {str(e)}")
        return None


@shared_task
def cleanup_old_notifications():
    """
    Clean up old notifications
    """
    try:
        # Delete read notifications older than 30 days
        read_cutoff = timezone.now() - timezone.timedelta(days=30)
        read_deleted = Notification.objects.filter(
            is_read=True,
            created_at__lt=read_cutoff
        ).delete()[0]
        
        # Delete unread notifications older than 90 days
        unread_cutoff = timezone.now() - timezone.timedelta(days=90)
        unread_deleted = Notification.objects.filter(
            is_read=False,
            created_at__lt=unread_cutoff
        ).delete()[0]
        
        # Delete error notifications older than 7 days
        error_cutoff = timezone.now() - timezone.timedelta(days=7)
        error_deleted = Notification.objects.filter(
            is_error=True,
            created_at__lt=error_cutoff
        ).delete()[0]
        
        logger.info(f"Cleaned up old notifications: "
                   f"{read_deleted} read, {unread_deleted} unread, {error_deleted} error notifications deleted")
    
    except Exception as e:
        logger.exception(f"Error in cleanup old notifications task: {str(e)}")


@shared_task
def send_digest_notifications():
    """
    Send digest notifications to users
    """
    logger.info("Starting digest notifications")
    
    try:
        # Get users with digest preferences enabled
        users = User.objects.filter(
            profile__daily_digest_enabled=True,
            is_active=True
        )
        
        # Current time
        now = timezone.now()
        today = now.date()
        yesterday = today - timezone.timedelta(days=1)
        
        # Send digest for each user
        for user in users:
            try:
                # Get notifications from the last 24 hours
                notifications = Notification.objects.filter(
                    user=user,
                    created_at__gte=yesterday,
                    created_at__lt=today,
                    is_error=False
                ).order_by('notification_type', '-created_at')
                
                if not notifications.exists():
                    continue
                
                # Group by notification type
                notification_groups = {}
                for notification in notifications:
                    if notification.notification_type not in notification_groups:
                        notification_groups[notification.notification_type] = []
                    notification_groups[notification.notification_type].append(notification)
                
                # Create digest message
                digest_message = f"Your daily digest for {yesterday.strftime('%Y-%m-%d')}:\n\n"
                
                for notification_type, notifications in notification_groups.items():
                    digest_message += f"## {notification_type.replace('_', ' ').title()} ({len(notifications)})\n"
                    
                    # Add up to 5 notifications of each type
                    for i, notification in enumerate(notifications[:5]):
                        digest_message += f"- {notification.title}: {notification.message}\n"
                    
                    if len(notifications) > 5:
                        digest_message += f"- And {len(notifications) - 5} more...\n"
                    
                    digest_message += "\n"
                
                # Create digest notification
                Notification.objects.create(
                    user=user,
                    title=f"Daily Digest: {yesterday.strftime('%Y-%m-%d')}",
                    message=digest_message,
                    notification_type="DIGEST",
                    data={
                        "date": yesterday.isoformat(),
                        "notification_count": notifications.count(),
                        "notification_types": list(notification_groups.keys())
                    }
                )
                
                logger.info(f"Created digest notification for user {user.id}")
            
            except Exception as e:
                logger.exception(f"Error creating digest for user {user.id}: {str(e)}")
        
        # Process notification queue
        process_notification_queue.delay()
        
        logger.info(f"Completed digest notifications for {users.count()} users")
    
    except Exception as e:
        logger.exception(f"Error in digest notifications task: {str(e)}")


@shared_task
def update_notification_templates():
    """
    Update notification templates from settings
    """
    logger.info("Updating notification templates from settings")
    
    try:
        # Get templates from settings
        templates = getattr(settings, 'NOTIFICATION_TEMPLATES', {})
        
        if not templates:
            logger.warning("No notification templates found in settings")
            return
        
        # Update or create templates
        with transaction.atomic():
            for template_key, template_data in templates.items():
                NotificationTemplate.objects.update_or_create(
                    key=template_key,
                    defaults={
                        'title_template': template_data.get('title', ''),
                        'body_template': template_data.get('body', ''),
                        'email_subject_template': template_data.get('email_subject', ''),
                        'email_body_template': template_data.get('email_body', ''),
                    }
                )
        
        logger.info(f"Updated {len(templates)} notification templates")
    
    except Exception as e:
        logger.error(f"Error updating notification templates: {e}")
        raise


@shared_task
def create_notification(user_id, notification_type, title, message, data=None, priority='normal'):
    """
    Create a new notification for a user
    
    Args:
        user_id: User ID
        notification_type: Type of notification
        title: Notification title
        message: Notification message
        data: Additional data for the notification
        priority: Notification priority (low, normal, high)
    """
    logger.info(f"Creating notification for user {user_id}: {title}")
    
    try:
        # Get the user
        user = User.objects.get(id=user_id)
        
        # Create the notification
        notification = Notification.objects.create(
            user=user,
            notification_type=notification_type,
            title=title,
            message=message,
            data=data or {},
            priority=priority,
            created_at=timezone.now()
        )
        
        # Process the notification immediately if it's high priority
        if priority == 'high':
            # Send via websocket immediately
            try:
                channel_name = f"notifications_{user_id}"
                async_to_sync(channel_layer.group_send)(
                    channel_name,
                    {
                        "type": "notification.message",
                        "notification": {
                            "id": str(notification.id),
                            "type": notification.notification_type,
                            "title": notification.title,
                            "message": notification.message,
                            "data": notification.data,
                            "created_at": notification.created_at.isoformat(),
                            "priority": notification.priority
                        }
                    }
                )
                logger.info(f"Sent high priority notification to websocket channel {channel_name}")
            except Exception as ws_error:
                logger.error(f"Error sending notification to websocket: {ws_error}")
        
        logger.info(f"Created notification {notification.id} for user {user_id}")
        return str(notification.id)
    
    except User.DoesNotExist:
        logger.error(f"User {user_id} not found when creating notification")
        return None
    except Exception as e:
        logger.error(f"Error creating notification for user {user_id}: {e}")
        raise
