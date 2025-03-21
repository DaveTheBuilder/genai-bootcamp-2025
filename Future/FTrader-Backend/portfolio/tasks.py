import logging
from celery import shared_task
from django.utils import timezone
from django.db import transaction
from django.db.models import Sum, F, ExpressionWrapper, DecimalField
from django.conf import settings
from .models import Portfolio, PortfolioItem, PortfolioPerformance
from trading.models import Position
from notifications.tasks import create_notification
from core.tasks import PortfolioTask

logger = logging.getLogger(__name__)


@shared_task(
    bind=True,
    base=PortfolioTask,
    max_retries=3,
    default_retry_delay=60,
    autoretry_for=(Exception,),
    retry_backoff=True
)
def update_portfolio_values(self):
    """
    Update portfolio values based on current market prices
    """
    logger.info("Starting portfolio values update")
    
    try:
        # Get all portfolios (removed is_active filter as it doesn't exist)
        portfolios = Portfolio.objects.all()
        
        if not portfolios.exists():
            logger.info("No portfolios to update")
            return
        
        updated_count = 0
        error_count = 0
        
        # Update each portfolio
        for portfolio in portfolios:
            try:
                # Get all items in the portfolio (removed is_active filter)
                items = PortfolioItem.objects.filter(portfolio=portfolio)
                
                if not items.exists():
                    continue
                
                # Calculate total value
                total_value = 0
                total_cost = 0
                
                for item in items:
                    # Skip if market data is not available
                    if not item.market.bid or not item.market.offer:
                        continue
                    
                    # Calculate current value based on position direction
                    if item.direction == 'BUY':
                        current_price = float(item.market.bid)  # Sell price for long positions
                    else:
                        current_price = float(item.market.offer)  # Buy price for short positions
                    
                    item_value = item.size * current_price
                    item_cost = item.size * float(item.open_price)
                    
                    # Update item value
                    item.current_price = current_price
                    item.current_value = item_value
                    item.profit_loss = item_value - item_cost
                    item.profit_loss_pct = (item.profit_loss / item_cost) * 100 if item_cost > 0 else 0
                    item.updated_at = timezone.now()
                    item.save()
                    
                    total_value += item_value
                    total_cost += item_cost
                
                # Update portfolio value
                portfolio.current_value = total_value
                portfolio.total_cost = total_cost
                portfolio.profit_loss = total_value - total_cost
                portfolio.profit_loss_pct = (portfolio.profit_loss / total_cost) * 100 if total_cost > 0 else 0
                portfolio.updated_at = timezone.now()
                portfolio.save()
                
                # Record portfolio performance
                PortfolioPerformance.objects.create(
                    portfolio=portfolio,
                    value=total_value,
                    profit_loss=portfolio.profit_loss,
                    profit_loss_pct=portfolio.profit_loss_pct,
                    timestamp=timezone.now()
                )
                
                updated_count += 1
            
            except Exception as e:
                logger.exception(f"Error updating portfolio {portfolio.id}: {str(e)}")
                error_count += 1
        
        logger.info(f"Portfolio values update completed: {updated_count} portfolios updated, {error_count} errors")
    
    except Exception as e:
        logger.exception(f"Error in portfolio values update task: {str(e)}")
        raise self.retry(exc=e)


@shared_task(
    bind=True,
    base=PortfolioTask,
    max_retries=3,
    default_retry_delay=60,
    autoretry_for=(Exception,),
    retry_backoff=True
)
def sync_positions_to_portfolios(self):
    """
    Sync positions from trading account to portfolios
    """
    logger.info("Starting position sync to portfolios")
    
    try:
        # Get all active positions
        positions = Position.objects.filter(status='OPEN')
        
        if not positions.exists():
            logger.info("No active positions to sync")
            return
        
        # Get default portfolios for each user
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        users = User.objects.filter(is_active=True)
        default_portfolios = {}
        
        for user in users:
            portfolio = Portfolio.objects.filter(user=user, is_default=True).first()
            if portfolio:
                default_portfolios[user.id] = portfolio
        
        synced_count = 0
        error_count = 0
        
        # Process each position
        for position in positions:
            try:
                user = position.user
                
                # Skip if user has no default portfolio
                if user.id not in default_portfolios:
                    continue
                
                portfolio = default_portfolios[user.id]
                
                # Check if position is already in portfolio
                existing_item = PortfolioItem.objects.filter(
                    portfolio=portfolio,
                    position=position
                ).first()
                
                if existing_item:
                    # Update existing item if needed
                    if (existing_item.size != position.size or 
                        existing_item.open_price != position.open_level):
                        
                        existing_item.size = position.size
                        existing_item.open_price = position.open_level
                        existing_item.save()
                else:
                    # Create new portfolio item
                    PortfolioItem.objects.create(
                        portfolio=portfolio,
                        market=position.market,
                        position=position,
                        direction=position.direction,
                        size=position.size,
                        open_price=position.open_level,
                        open_date=position.created_at
                    )
                
                synced_count += 1
            
            except Exception as e:
                logger.exception(f"Error syncing position {position.id}: {str(e)}")
                error_count += 1
        
        logger.info(f"Position sync completed: {synced_count} positions synced, {error_count} errors")
    
    except Exception as e:
        logger.exception(f"Error in position sync task: {str(e)}")
        raise self.retry(exc=e)


@shared_task(
    bind=True,
    base=PortfolioTask,
    max_retries=3,
    default_retry_delay=300,
    autoretry_for=(Exception,),
    retry_backoff=True
)
def calculate_portfolio_analytics(self):
    """
    Calculate portfolio analytics
    """
    logger.info("Starting portfolio analytics calculation")
    
    try:
        # Get all portfolios
        portfolios = Portfolio.objects.all()
        
        if not portfolios.exists():
            logger.info("No portfolios for analytics")
            return
        
        calculated_count = 0
        error_count = 0
        
        # Calculate analytics for each portfolio
        for portfolio in portfolios:
            try:
                # Get performance history
                history = PortfolioPerformance.objects.filter(
                    portfolio=portfolio
                ).order_by('timestamp')
                
                if not history.exists():
                    continue
                
                # Calculate daily returns
                daily_returns = []
                previous_value = None
                
                for record in history:
                    if previous_value:
                        daily_return = (record.value - previous_value) / previous_value
                        daily_returns.append(daily_return)
                    
                    previous_value = record.value
                
                # Skip if not enough data
                if len(daily_returns) < 2:
                    continue
                
                # Calculate metrics
                import numpy as np
                
                # Volatility (standard deviation of returns)
                volatility = np.std(daily_returns) * np.sqrt(252)  # Annualized
                
                # Sharpe ratio (assuming risk-free rate of 0 for simplicity)
                avg_return = np.mean(daily_returns)
                sharpe_ratio = (avg_return * 252) / volatility if volatility > 0 else 0
                
                # Maximum drawdown
                cumulative_returns = np.cumprod(np.array(daily_returns) + 1) - 1
                max_drawdown = np.min(np.minimum.accumulate(cumulative_returns) - cumulative_returns)
                
                # Update portfolio with analytics
                portfolio.volatility = float(volatility)
                portfolio.sharpe_ratio = float(sharpe_ratio)
                portfolio.max_drawdown = float(max_drawdown)
                portfolio.save()
                
                calculated_count += 1
            
            except Exception as e:
                logger.exception(f"Error calculating analytics for portfolio {portfolio.id}: {str(e)}")
                error_count += 1
        
        logger.info(f"Portfolio analytics calculation completed: {calculated_count} portfolios calculated, {error_count} errors")
    
    except Exception as e:
        logger.exception(f"Error in portfolio analytics calculation task: {str(e)}")
        raise self.retry(exc=e)


@shared_task(
    bind=True,
    base=PortfolioTask,
    max_retries=3,
    default_retry_delay=3600,
    autoretry_for=(Exception,),
    retry_backoff=True
)
def generate_portfolio_reports(self):
    """
    Generate portfolio reports
    """
    logger.info("Starting portfolio reports generation")
    
    try:
        # Get all portfolios
        portfolios = Portfolio.objects.all()
        
        if not portfolios.exists():
            logger.info("No portfolios for reports")
            return
        
        generated_count = 0
        error_count = 0
        
        # Generate report for each portfolio
        for portfolio in portfolios:
            try:
                user = portfolio.user
                
                # Skip if portfolio has no items
                items_count = PortfolioItem.objects.filter(portfolio=portfolio).count()
                
                if items_count == 0:
                    continue
                
                # Generate report data
                report_data = {
                    "portfolio_id": str(portfolio.id),
                    "portfolio_name": portfolio.name,
                    "current_value": float(portfolio.current_value),
                    "profit_loss": float(portfolio.profit_loss),
                    "profit_loss_pct": float(portfolio.profit_loss_pct),
                    "items_count": items_count,
                    "volatility": float(portfolio.volatility) if portfolio.volatility else None,
                    "sharpe_ratio": float(portfolio.sharpe_ratio) if portfolio.sharpe_ratio else None,
                    "max_drawdown": float(portfolio.max_drawdown) if portfolio.max_drawdown else None,
                    "generated_at": timezone.now().isoformat()
                }
                
                # Create notification with report
                create_notification.delay(
                    user_id=user.id,
                    title=f"Portfolio Report: {portfolio.name}",
                    message=f"Your weekly portfolio report for {portfolio.name} is ready. "
                            f"Current value: {portfolio.current_value}, "
                            f"Profit/Loss: {portfolio.profit_loss} ({portfolio.profit_loss_pct}%)",
                    notification_type="PORTFOLIO_REPORT",
                    data=report_data
                )
                
                generated_count += 1
            
            except Exception as e:
                logger.exception(f"Error generating report for portfolio {portfolio.id}: {str(e)}")
                error_count += 1
        
        logger.info(f"Portfolio reports generation completed: {generated_count} reports generated, {error_count} errors")
    
    except Exception as e:
        logger.exception(f"Error in portfolio reports generation task: {str(e)}")
        raise self.retry(exc=e)


@shared_task(
    bind=True,
    base=PortfolioTask,
    max_retries=3,
    default_retry_delay=3600,
    autoretry_for=(Exception,),
    retry_backoff=True
)
def cleanup_portfolio_performance_history(self):
    """
    Clean up old portfolio performance history
    """
    logger.info("Starting cleanup of portfolio performance history")
    
    try:
        # Delete performance history older than the retention period
        retention_days = getattr(settings, 'PORTFOLIO_HISTORY_RETENTION_DAYS', 365)
        cutoff_date = timezone.now() - timezone.timedelta(days=retention_days)
        
        # Delete in batches to avoid long-running transactions
        batch_size = 1000
        total_deleted = 0
        
        while True:
            deleted_count, _ = PortfolioPerformance.objects.filter(
                timestamp__lt=cutoff_date
            )[:batch_size].delete()
            
            total_deleted += deleted_count
            
            if deleted_count < batch_size:
                break
        
        logger.info(f"Cleaned up {total_deleted} old portfolio performance records")
    
    except Exception as e:
        logger.exception(f"Error in cleanup portfolio performance history task: {str(e)}")
        raise self.retry(exc=e)
