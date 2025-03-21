import logging
from celery import shared_task
from django.utils import timezone
from django.db import transaction
from django.conf import settings
from .models import Position, Order, Trade
from market_data.models import Market
from core.tasks import TradingTask
from notifications.tasks import create_notification

logger = logging.getLogger(__name__)


@shared_task(
    bind=True,
    base=TradingTask,
    max_retries=3,
    default_retry_delay=60,
    autoretry_for=(Exception,),
    retry_backoff=True
)
def process_pending_orders(self):
    """
    Process pending orders by checking market conditions
    """
    logger.info("Starting pending orders processing")
    
    try:
        # Get all pending orders
        pending_orders = Order.objects.filter(status='PENDING')
        
        if not pending_orders.exists():
            logger.info("No pending orders to process")
            return
        
        processed_count = 0
        error_count = 0
        
        # Process each pending order
        for order in pending_orders:
            try:
                # Get current market data
                market = order.market
                
                # Skip if market data is not available
                if not market.bid or not market.offer:
                    logger.warning(f"Market data not available for {market.epic}, skipping order {order.id}")
                    continue
                
                # Determine execution price based on direction
                if order.direction == 'BUY':
                    execution_price = float(market.offer)  # Buy at offer price
                else:
                    execution_price = float(market.bid)  # Sell at bid price
                
                # Check if limit order conditions are met
                if order.order_type == 'LIMIT':
                    if order.direction == 'BUY' and execution_price > order.limit_price:
                        # Buy limit not met (market price is higher than limit)
                        continue
                    elif order.direction == 'SELL' and execution_price < order.limit_price:
                        # Sell limit not met (market price is lower than limit)
                        continue
                
                # Check if stop order conditions are met
                if order.order_type == 'STOP':
                    if order.direction == 'BUY' and execution_price < order.stop_price:
                        # Buy stop not met (market price is lower than stop)
                        continue
                    elif order.direction == 'SELL' and execution_price > order.stop_price:
                        # Sell stop not met (market price is higher than stop)
                        continue
                
                # Execute the order
                with transaction.atomic():
                    # Create position
                    position = Position.objects.create(
                        user=order.user,
                        market=market,
                        direction=order.direction,
                        size=order.size,
                        open_level=execution_price,
                        stop_level=order.stop_loss,
                        limit_level=order.take_profit,
                        created_at=timezone.now(),
                        status='OPEN'
                    )
                    
                    # Update order status
                    order.status = 'EXECUTED'
                    order.executed_price = execution_price
                    order.executed_at = timezone.now()
                    order.position = position
                    order.save()
                    
                    # Create trade record
                    Trade.objects.create(
                        user=order.user,
                        market=market,
                        position=position,
                        order=order,
                        direction=order.direction,
                        size=order.size,
                        price=execution_price,
                        trade_type='OPEN',
                        timestamp=timezone.now()
                    )
                    
                    # Create notification
                    create_notification.delay(
                        user_id=order.user.id,
                        title=f"Order Executed: {market.name}",
                        message=f"Your {order.direction} order for {order.size} units of {market.name} "
                                f"has been executed at {execution_price}",
                        notification_type="ORDER_EXECUTED",
                        data={
                            "order_id": str(order.id),
                            "position_id": str(position.id),
                            "market_id": str(market.id),
                            "market_name": market.name,
                            "direction": order.direction,
                            "size": order.size,
                            "execution_price": execution_price
                        }
                    )
                
                processed_count += 1
                logger.info(f"Executed order {order.id} for {market.name} at {execution_price}")
            
            except Exception as e:
                logger.exception(f"Error processing order {order.id}: {str(e)}")
                error_count += 1
        
        logger.info(f"Pending orders processing completed: {processed_count} executed, {error_count} errors")
    
    except Exception as e:
        logger.exception(f"Error in pending orders processing task: {str(e)}")
        raise self.retry(exc=e)


@shared_task(
    bind=True,
    base=TradingTask,
    max_retries=3,
    default_retry_delay=60,
    autoretry_for=(Exception,),
    retry_backoff=True
)
def check_stop_and_limit_levels(self):
    """
    Check open positions for stop loss and take profit levels
    """
    logger.info("Starting stop/limit level check")
    
    try:
        # Get all open positions
        open_positions = Position.objects.filter(status='OPEN')
        
        if not open_positions.exists():
            logger.info("No open positions to check")
            return
        
        closed_count = 0
        error_count = 0
        
        # Check each position
        for position in open_positions:
            try:
                market = position.market
                
                # Skip if market data is not available
                if not market.bid or not market.offer:
                    continue
                
                # Determine current price based on direction
                if position.direction == 'BUY':
                    current_price = float(market.bid)  # Sell price for long positions
                else:
                    current_price = float(market.offer)  # Buy price for short positions
                
                # Check stop loss
                stop_triggered = False
                if position.stop_level:
                    if position.direction == 'BUY' and current_price <= position.stop_level:
                        stop_triggered = True
                    elif position.direction == 'SELL' and current_price >= position.stop_level:
                        stop_triggered = True
                
                # Check take profit
                limit_triggered = False
                if position.limit_level:
                    if position.direction == 'BUY' and current_price >= position.limit_level:
                        limit_triggered = True
                    elif position.direction == 'SELL' and current_price <= position.limit_level:
                        limit_triggered = True
                
                # Close position if stop or limit is triggered
                if stop_triggered or limit_triggered:
                    with transaction.atomic():
                        # Update position
                        position.close_level = current_price
                        position.closed_at = timezone.now()
                        position.status = 'CLOSED'
                        position.close_reason = 'STOP_LOSS' if stop_triggered else 'TAKE_PROFIT'
                        
                        # Calculate P/L
                        if position.direction == 'BUY':
                            position.profit_loss = (current_price - position.open_level) * position.size
                        else:
                            position.profit_loss = (position.open_level - current_price) * position.size
                        
                        position.save()
                        
                        # Create trade record
                        Trade.objects.create(
                            user=position.user,
                            market=market,
                            position=position,
                            direction='SELL' if position.direction == 'BUY' else 'BUY',
                            size=position.size,
                            price=current_price,
                            trade_type='CLOSE',
                            timestamp=timezone.now()
                        )
                        
                        # Create notification
                        trigger_type = "Stop Loss" if stop_triggered else "Take Profit"
                        create_notification.delay(
                            user_id=position.user.id,
                            title=f"{trigger_type} Triggered: {market.name}",
                            message=f"Your {position.direction} position for {position.size} units of {market.name} "
                                    f"has been closed at {current_price} due to {trigger_type}",
                            notification_type="POSITION_CLOSED",
                            data={
                                "position_id": str(position.id),
                                "market_id": str(market.id),
                                "market_name": market.name,
                                "direction": position.direction,
                                "size": position.size,
                                "open_level": float(position.open_level),
                                "close_level": float(current_price),
                                "profit_loss": float(position.profit_loss),
                                "close_reason": position.close_reason
                            }
                        )
                    
                    closed_count += 1
                    logger.info(f"Closed position {position.id} at {current_price} due to {trigger_type}")
            
            except Exception as e:
                logger.exception(f"Error checking position {position.id}: {str(e)}")
                error_count += 1
        
        logger.info(f"Stop/limit check completed: {closed_count} positions closed, {error_count} errors")
    
    except Exception as e:
        logger.exception(f"Error in stop/limit check task: {str(e)}")
        raise self.retry(exc=e)


@shared_task(
    bind=True,
    base=TradingTask,
    max_retries=3,
    default_retry_delay=300,
    autoretry_for=(Exception,),
    retry_backoff=True
)
def update_position_values(self):
    """
    Update current values and P/L for open positions
    """
    logger.info("Starting position values update")
    
    try:
        # Get all open positions
        open_positions = Position.objects.filter(status='OPEN')
        
        if not open_positions.exists():
            logger.info("No open positions to update")
            return
        
        updated_count = 0
        error_count = 0
        
        # Update each position
        for position in open_positions:
            try:
                market = position.market
                
                # Skip if market data is not available
                if not market.bid or not market.offer:
                    continue
                
                # Determine current price based on direction
                if position.direction == 'BUY':
                    current_price = float(market.bid)  # Sell price for long positions
                else:
                    current_price = float(market.offer)  # Buy price for short positions
                
                # Calculate current P/L
                if position.direction == 'BUY':
                    profit_loss = (current_price - position.open_level) * position.size
                else:
                    profit_loss = (position.open_level - current_price) * position.size
                
                # Update position
                position.current_price = current_price
                position.profit_loss = profit_loss
                position.updated_at = timezone.now()
                position.save()
                
                updated_count += 1
            
            except Exception as e:
                logger.exception(f"Error updating position {position.id}: {str(e)}")
                error_count += 1
        
        logger.info(f"Position values update completed: {updated_count} positions updated, {error_count} errors")
    
    except Exception as e:
        logger.exception(f"Error in position values update task: {str(e)}")
        raise self.retry(exc=e)


@shared_task(
    bind=True,
    base=TradingTask,
    max_retries=3,
    default_retry_delay=3600,
    autoretry_for=(Exception,),
    retry_backoff=True
)
def expire_pending_orders(self):
    """
    Expire pending orders that have passed their good-till date
    """
    logger.info("Starting order expiration check")
    
    try:
        # Get pending orders with good-till date in the past
        now = timezone.now()
        expired_orders = Order.objects.filter(
            status='PENDING',
            good_till_date__lt=now
        )
        
        if not expired_orders.exists():
            logger.info("No orders to expire")
            return
        
        expired_count = 0
        error_count = 0
        
        # Expire each order
        for order in expired_orders:
            try:
                # Update order status
                order.status = 'EXPIRED'
                order.save()
                
                # Create notification
                create_notification.delay(
                    user_id=order.user.id,
                    title="Order Expired",
                    message=f"Your {order.direction} order for {order.size} units of {order.market.name} "
                            f"has expired",
                    notification_type="ORDER_EXPIRED",
                    data={
                        "order_id": str(order.id),
                        "market_id": str(order.market.id),
                        "market_name": order.market.name,
                        "direction": order.direction,
                        "size": order.size
                    }
                )
                
                expired_count += 1
            
            except Exception as e:
                logger.exception(f"Error expiring order {order.id}: {str(e)}")
                error_count += 1
        
        logger.info(f"Order expiration completed: {expired_count} orders expired, {error_count} errors")
    
    except Exception as e:
        logger.exception(f"Error in order expiration task: {str(e)}")
        raise self.retry(exc=e)


@shared_task(
    bind=True,
    base=TradingTask,
    max_retries=3,
    default_retry_delay=86400,  # 24 hours
    autoretry_for=(Exception,),
    retry_backoff=True
)
def generate_trading_reports(self):
    """
    Generate trading reports and analytics
    """
    logger.info("Starting trading reports generation")
    
    try:
        # Get active users with trading activity
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        # Get users with trades in the last 30 days
        thirty_days_ago = timezone.now() - timezone.timedelta(days=30)
        active_traders = User.objects.filter(
            trades__timestamp__gte=thirty_days_ago
        ).distinct()
        
        if not active_traders.exists():
            logger.info("No active traders for reports")
            return
        
        generated_count = 0
        error_count = 0
        
        # Generate report for each user
        for user in active_traders:
            try:
                # Get user's trades
                trades = Trade.objects.filter(
                    user=user,
                    timestamp__gte=thirty_days_ago
                ).order_by('timestamp')
                
                # Get user's positions
                open_positions = Position.objects.filter(
                    user=user,
                    status='OPEN'
                ).count()
                
                closed_positions = Position.objects.filter(
                    user=user,
                    status='CLOSED',
                    closed_at__gte=thirty_days_ago
                )
                
                # Calculate metrics
                total_trades = trades.count()
                winning_trades = closed_positions.filter(profit_loss__gt=0).count()
                losing_trades = closed_positions.filter(profit_loss__lte=0).count()
                
                win_rate = (winning_trades / closed_positions.count()) * 100 if closed_positions.count() > 0 else 0
                
                total_profit = sum([p.profit_loss for p in closed_positions.filter(profit_loss__gt=0)]) or 0
                total_loss = sum([abs(p.profit_loss) for p in closed_positions.filter(profit_loss__lte=0)]) or 0
                
                profit_factor = total_profit / total_loss if total_loss > 0 else 0
                
                # Generate report data
                report_data = {
                    "period_start": thirty_days_ago.isoformat(),
                    "period_end": timezone.now().isoformat(),
                    "total_trades": total_trades,
                    "open_positions": open_positions,
                    "closed_positions": closed_positions.count(),
                    "winning_trades": winning_trades,
                    "losing_trades": losing_trades,
                    "win_rate": float(win_rate),
                    "total_profit": float(total_profit),
                    "total_loss": float(total_loss),
                    "net_pnl": float(total_profit - total_loss),
                    "profit_factor": float(profit_factor),
                    "generated_at": timezone.now().isoformat()
                }
                
                # Create notification with report
                create_notification.delay(
                    user_id=user.id,
                    title="Monthly Trading Report",
                    message=f"Your monthly trading report is ready. "
                            f"Win rate: {win_rate:.1f}%, Net P/L: {total_profit - total_loss:.2f}",
                    notification_type="TRADING_REPORT",
                    data=report_data
                )
                
                generated_count += 1
            
            except Exception as e:
                logger.exception(f"Error generating report for user {user.id}: {str(e)}")
                error_count += 1
        
        logger.info(f"Trading reports generation completed: {generated_count} reports generated, {error_count} errors")
    
    except Exception as e:
        logger.exception(f"Error in trading reports generation task: {str(e)}")
        raise self.retry(exc=e)
