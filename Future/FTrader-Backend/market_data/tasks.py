import logging
from celery import shared_task
from django.utils import timezone
from django.db import transaction
from django.db.models import Q
from django.conf import settings
from .models import Market, PriceHistory, MarketAlert, MLModel
from .utils import get_market_details, get_price_history
from notifications.tasks import create_notification
from core.tasks import MarketDataTask
import time
import random
from django.utils import timezone
import datetime
from datetime import timedelta
from .influx_service import influx_service
import json
from pika import BlockingConnection, ConnectionParameters
from pika.exceptions import AMQPError
#from influxdb import Point
from influxdb_client import Point
from celery import Task


logger = logging.getLogger(__name__)


@shared_task(
    bind=True,
    base=MarketDataTask,
    max_retries=3,
    default_retry_delay=60,
    autoretry_for=(Exception,),
    retry_backoff=True
)
def update_market_data(self):
    """
    Update market data for all active markets
    """
    logger.info("Starting market data update")
    
    try:
        # Get all markets (removed is_active filter as it doesn't exist)
        markets = Market.objects.all()
        
        if not markets.exists():
            logger.info("No markets to update")
            return
        
        # Get a user with active IG session for API calls
        from users.models import User
        admin_user = User.objects.filter(is_staff=True, ig_active_session=True).first()
        
        if not admin_user:
            logger.error("No admin user with active IG session found")
            raise Exception("No admin user with active IG session found")
        
        updated_count = 0
        error_count = 0
        
        # Update each market
        for market in markets:
            try:
                # Get market details from IG API
                success, market_details, error = get_market_details(admin_user, market.epic)
                
                if not success:
                    logger.error(f"Failed to get market details for {market.epic}: {error}")
                    error_count += 1
                    continue
                
                # Update market data
                market.name = market_details.get('name', market.name)
                market.bid = market_details.get('bid', market.bid)
                market.offer = market_details.get('offer', market.offer)
                market.high = market_details.get('high', market.high)
                market.low = market_details.get('low', market.low)
                market.percentage_change = market_details.get('percentage_change', market.percentage_change)
                market.net_change = market_details.get('net_change', market.net_change)
                market.update_time = timezone.now()
                market.save()
                
                updated_count += 1
            
            except Exception as e:
                logger.exception(f"Error updating market {market.epic}: {str(e)}")
                error_count += 1
        
        logger.info(f"Market data update completed: {updated_count} markets updated, {error_count} errors")
        
        # Check market alerts after updating market data
        check_market_alerts.delay()
    
    except Exception as e:
        logger.exception(f"Error in market data update task: {str(e)}")
        raise self.retry(exc=e)


@shared_task(
    bind=True,
    base=MarketDataTask,
    max_retries=3,
    default_retry_delay=300,
    autoretry_for=(Exception,),
    retry_backoff=True
)
def update_price_history(self):
    """
    Update price history for all active markets
    """
    logger.info("Starting price history update")
    
    try:
        # Get all markets (removed is_active filter as it doesn't exist)
        markets = Market.objects.all()
        
        if not markets.exists():
            logger.info("No markets to update price history")
            return
        
        # Get a user with active IG session for API calls
        from users.models import User
        admin_user = User.objects.filter(is_staff=True, ig_active_session=True).first()
        
        if not admin_user:
            logger.error("No admin user with active IG session found")
            raise Exception("No admin user with active IG session found")
        
        updated_count = 0
        error_count = 0
        
        # Update price history for each market
        for market in markets:
            try:
                # Get price history from IG API (last 1 day, 1 hour resolution)
                success, price_data, error = get_price_history(
                    admin_user, 
                    market.epic, 
                    resolution='HOUR', 
                    num_points=24
                )
                
                if not success:
                    logger.error(f"Failed to get price history for {market.epic}: {error}")
                    error_count += 1
                    continue
                
                # Save price history data
                with transaction.atomic():
                    for price_point in price_data:
                        # Check if price point already exists
                        existing = PriceHistory.objects.filter(
                            market=market,
                            timestamp=price_point['timestamp']
                        ).first()
                        
                        if existing:
                            # Update existing price point
                            existing.open = price_point['open']
                            existing.close = price_point['close']
                            existing.high = price_point['high']
                            existing.low = price_point['low']
                            existing.volume = price_point.get('volume', 0)
                            existing.save()
                        else:
                            # Create new price point
                            PriceHistory.objects.create(
                                market=market,
                                timestamp=price_point['timestamp'],
                                open=price_point['open'],
                                close=price_point['close'],
                                high=price_point['high'],
                                low=price_point['low'],
                                volume=price_point.get('volume', 0)
                            )
                
                updated_count += 1
            
            except Exception as e:
                logger.exception(f"Error updating price history for {market.epic}: {str(e)}")
                error_count += 1
        
        logger.info(f"Price history update completed: {updated_count} markets updated, {error_count} errors")
    
    except Exception as e:
        logger.exception(f"Error in price history update task: {str(e)}")
        raise self.retry(exc=e)


@shared_task(
    bind=True,
    base=MarketDataTask,
    max_retries=3,
    default_retry_delay=60,
    autoretry_for=(Exception,),
    retry_backoff=True
)
def check_market_alerts(self):
    """
    Check market alerts against current market data
    """
    logger.info("Starting market alerts check")
    
    try:
        # Get all active alerts (using status field instead of non-existent is_active)
        alerts = MarketAlert.objects.filter(
            status='active'
        ).select_related('market', 'user')
        
        if not alerts.exists():
            logger.info("No active alerts to check")
            return
        
        triggered_count = 0
        
        # Check each alert
        for alert in alerts:
            try:
                market = alert.market
                
                # Skip if market is not active
                if not market.is_active:
                    continue
                
                # Check if alert conditions are met
                triggered = False
                
                if alert.price_above and market.offer is not None:
                    if float(market.offer) >= float(alert.price_above):
                        triggered = True
                        message = f"{market.name} price is above {alert.price_above}"
                
                elif alert.price_below and market.bid is not None:
                    if float(market.bid) <= float(alert.price_below):
                        triggered = True
                        message = f"{market.name} price is below {alert.price_below}"
                
                elif alert.price_change_pct and market.change_pct is not None:
                    if abs(float(market.change_pct)) >= float(alert.price_change_pct):
                        triggered = True
                        direction = "up" if market.change_pct > 0 else "down"
                        message = f"{market.name} has moved {direction} by {abs(market.change_pct)}%"
                
                # If alert is triggered, update it and create notification
                if triggered:
                    # Update alert
                    alert.triggered = True
                    alert.trigger_time = timezone.now()
                    alert.save()
                    
                    # Create notification
                    create_notification(
                        user=alert.user,
                        title="Market Alert Triggered",
                        message=message,
                        notification_type="MARKET_ALERT",
                        data={
                            "market_id": market.id,
                            "market_epic": market.epic,
                            "market_name": market.name,
                            "alert_id": alert.id,
                            "current_price": (market.bid + market.offer) / 2
                        }
                    )
                    
                    triggered_count += 1
            
            except Exception as e:
                logger.exception(f"Error checking alert {alert.id}: {str(e)}")
        
        logger.info(f"Market alerts check completed: {triggered_count} alerts triggered")
    
    except Exception as e:
        logger.exception(f"Error in market alerts check task: {str(e)}")
        raise self.retry(exc=e)


@shared_task(
    bind=True,
    base=MarketDataTask,
    max_retries=3,
    default_retry_delay=3600,
    autoretry_for=(Exception,),
    retry_backoff=True
)
def cleanup_old_price_history(self):
    """
    Clean up old price history data
    """
    logger.info("Starting cleanup of old price history data")
    
    try:
        # Define retention periods for different resolutions
        retention_periods = {
            'MINUTE': timezone.timedelta(days=1),
            'MINUTE_5': timezone.timedelta(days=7),
            'MINUTE_15': timezone.timedelta(days=14),
            'MINUTE_30': timezone.timedelta(days=30),
            'HOUR': timezone.timedelta(days=60),
            'HOUR_4': timezone.timedelta(days=90),
            'DAY': timezone.timedelta(days=365),
            'WEEK': timezone.timedelta(days=730),
            'MONTH': timezone.timedelta(days=1825),
        }
        
        # Current time
        now = timezone.now()
        
        # Delete old price history for each resolution
        for resolution, period in retention_periods.items():
            cutoff_date = now - period
            deleted_count = PriceHistory.objects.filter(
                resolution=resolution,
                timestamp__lt=cutoff_date
            ).delete()[0]
            
            logger.info(f"Deleted {deleted_count} old {resolution} price history records")
    
    except Exception as e:
        logger.exception(f"Error in cleanup old price history task: {str(e)}")
        raise self.retry(exc=e)


@shared_task(
    bind=True,
    base=MarketDataTask,
    max_retries=3,
    default_retry_delay=30,
    autoretry_for=(Exception,),
    retry_backoff=True
)
def fetch_live_market_data(self, market_id=None):
    """
    Fetch live market data for a specific market or all active markets
    and store it for immediate use by ML models.
    
    Args:
        market_id: Optional ID of a specific market to update. If None, updates all markets.
    """
    logger.info(f"Fetching live market data {'for market ' + str(market_id) if market_id else 'for all markets'}")
    
    try:
        # Get markets to update
        if market_id:
            markets = Market.objects.filter(id=market_id)
        else:
            markets = Market.objects.all()
            
        if not markets.exists():
            logger.info("No markets to update")
            return
        
        # Get a user with active IG session for API calls
        from users.models import User
        admin_user = User.objects.filter(is_staff=True, ig_active_session=True).first()
        
        if not admin_user:
            logger.warning("No admin user with active IG session found, using simulation mode")
            # Use simulation mode for development
            for market in markets:
                # Generate simulated live data
                current_time = timezone.now()
                last_price = PriceHistory.objects.filter(market=market).order_by('-timestamp').first()
                
                if last_price:
                    # Create a small random change from the last price
                    base_price = float(last_price.close_price)
                    change_pct = random.uniform(-0.005, 0.005)  # ±0.5% change
                    new_price = base_price * (1 + change_pct)
                    
                    # Create new price history entry
                    PriceHistory.objects.create(
                        market=market,
                        timestamp=current_time,
                        resolution='MINUTE',
                        open_price=new_price * (1 - random.uniform(0, 0.001)),
                        high_price=new_price * (1 + random.uniform(0, 0.002)),
                        low_price=new_price * (1 - random.uniform(0, 0.002)),
                        close_price=new_price,
                        volume=random.randint(1000, 10000)
                    )
                    logger.info(f"Created simulated live data for {market.name}")
            
            return
        
        # Real implementation with IG API
        from trading.services import IGService
        ig_service = IGService(admin_user)
        
        for market in markets:
            try:
                # Get live price data from IG API
                market_data = ig_service.get_market_details(market.epic)
                
                if not market_data:
                    logger.warning(f"No live data available for {market.name}")
                    continue
                
                # Extract price information
                bid = float(market_data.get('bid', 0))
                offer = float(market_data.get('offer', 0))
                
                # Update market with latest prices
                market.bid = bid
                market.offer = offer
                market.last_update = timezone.now()
                market.save()
                
                # Create a new price history entry
                current_time = timezone.now()
                mid_price = (bid + offer) / 2
                
                PriceHistory.objects.create(
                    market=market,
                    timestamp=current_time,
                    resolution='MINUTE',
                    open_price=mid_price,
                    high_price=offer,
                    low_price=bid,
                    close_price=mid_price,
                    volume=market_data.get('volume', 0) or 0
                )
                
                logger.info(f"Updated live data for {market.name}")
                
            except Exception as e:
                logger.error(f"Error updating live data for {market.name}: {str(e)}")
                continue
        
        return True
        
    except Exception as e:
        logger.exception(f"Error in fetch_live_market_data task: {str(e)}")
        raise self.retry(exc=e)


@shared_task
def train_model_task(model_id):
    """
    Asynchronous task to train a machine learning model.
    This uses real machine learning libraries to train models.
    """
    from .ml_utils import (
        fetch_market_data, prepare_data_for_training, 
        train_lstm_model, train_random_forest_model, 
        evaluate_model
    )
    
    try:
        # Get the model from the database
        ml_model = MLModel.objects.get(id=model_id)
        
        # Update status to training
        ml_model.status = 'training'
        ml_model.progress = 0
        ml_model.training_phase = 'Initializing'
        ml_model.save()
        
        logger.info(f"Starting training for model {model_id} ({ml_model.model_type} on {ml_model.instrument})")
        
        try:
            # Step 1: Fetch market data including live data
            ml_model.training_phase = 'Fetching market data'
            ml_model.progress = 5
            ml_model.save()
            
            # Ensure we get the latest live data before training
            from .tasks import fetch_live_market_data
            logger.info(f"Fetching latest live data for {ml_model.instrument} before training")
            
            # Get the market ID for this instrument
            market = Market.objects.get(epic=ml_model.instrument)
            fetch_live_market_data(None, market.id)
            
            # Now fetch all data including the newly fetched live data
            df = fetch_market_data(ml_model.instrument, ml_model.training_period, use_live_data=True)
            
            if df.empty:
                raise ValueError(f"No data available for {ml_model.instrument}")
            
            logger.info(f"Model {model_id}: Fetched {len(df)} data points including latest live data")
            
            # Step 2: Prepare data for training
            ml_model.training_phase = 'Preparing training data'
            ml_model.progress = 15
            ml_model.save()
            
            X_train, y_train, X_test, y_test, feature_names, scaler = prepare_data_for_training(
                df, ml_model.target, ml_model.horizon
            )
            
            logger.info(f"Model {model_id}: Prepared training data with {len(X_train)} samples")
            
            # Step 3: Train model based on model type
            ml_model.training_phase = 'Training model'
            ml_model.progress = 30
            ml_model.save()
            
            if ml_model.model_type.lower() == 'lstm':
                model, history = train_lstm_model(X_train, y_train, model_id)
                logger.info(f"Model {model_id}: LSTM model trained")
            else:  # Default to random forest
                model = train_random_forest_model(X_train, y_train, feature_names, model_id)
                logger.info(f"Model {model_id}: Random Forest model trained")
            
            # Step 4: Evaluate model
            ml_model.training_phase = 'Evaluating model'
            ml_model.progress = 90
            ml_model.save()
            
            accuracy, mse, mae = evaluate_model(
                model, X_test, y_test, model_id, ml_model.model_type.lower(), feature_names
            )
            
            logger.info(f"Model {model_id}: Evaluation complete. Accuracy: {accuracy:.4f}, MSE: {mse:.4f}")
            
            # Step 5: Finalize
            ml_model.training_phase = 'Training complete'
            ml_model.status = 'trained'
            ml_model.progress = 100
            ml_model.save()
            
            logger.info(f"Model {model_id}: Training completed successfully")
            
            # Create notification
            create_notification.delay(
                user_id=None,  # System notification
                notification_type="model_training",
                title="Model Training Complete",
                message=f"Model {ml_model.model_type} for {ml_model.instrument} has been trained successfully with accuracy {accuracy:.2%}",
                data={
                    "model_id": model_id,
                    "model_type": ml_model.model_type,
                    "instrument": ml_model.instrument,
                    "accuracy": float(accuracy)
                }
            )
            
            return {
                "status": "success",
                "model_id": model_id,
                "accuracy": accuracy
            }
            
        except Exception as e:
            logger.error(f"Error during model training: {str(e)}")
            
            # Update model status to failed
            ml_model.status = 'failed'
            ml_model.training_phase = f'Failed: {str(e)}'
            ml_model.save()
            
            # Create notification
            create_notification.delay(
                user_id=None,  # System notification
                title="Model Training Failed",
                message=f"Training for {ml_model.model_type} model on {ml_model.instrument} failed: {str(e)}",
                notification_type="model_training",
                data={
                    "model_id": model_id,
                    "model_type": ml_model.model_type,
                    "instrument": ml_model.instrument,
                    "error": str(e)
                }
            )
            
            raise
    
    except MLModel.DoesNotExist:
        logger.error(f"Model with ID {model_id} not found")
        raise
    
    except Exception as e:
        logger.error(f"Unexpected error in train_model_task: {str(e)}")
        raise


@shared_task(
    bind=True,
    base=MarketDataTask,
    max_retries=3,
    default_retry_delay=30,
    autoretry_for=(Exception,),
    retry_backoff=True
)
def run_live_predictions(self):
    """
    Run live predictions for all trained models using the latest market data
    """
    from .ml_utils import make_live_prediction
    
    logger.info("Running live predictions for all trained models")
    
    try:
        # Get all trained models
        trained_models = MLModel.objects.filter(status='trained')
        
        if not trained_models.exists():
            logger.info("No trained models available for predictions")
            return
        
        # First, ensure we have the latest market data
        fetch_live_market_data.delay()
        
        # Run predictions for each model
        results = []
        for model in trained_models:
            try:
                # Make prediction
                prediction = make_live_prediction(model.id)
                
                if prediction['status'] == 'success':
                    logger.info(f"Live prediction for model {model.id} ({model.model_type} on {model.instrument}): {prediction['recommendation']}")
                    
                    # Create notification for significant recommendations
                    if prediction['recommendation'] in ['buy', 'sell'] and prediction['confidence'] > 0.7:
                        create_notification.delay(
                            user_id=None,  # System notification
                            notification_type="trading_signal",
                            title=f"Trading Signal: {prediction['recommendation'].upper()}",
                            message=f"{prediction['explanation']} for {model.instrument}",
                            data={
                                "model_id": model.id,
                                "instrument": model.instrument,
                                "recommendation": prediction['recommendation'],
                                "confidence": prediction['confidence']
                            }
                        )
                    
                    results.append(prediction)
                else:
                    logger.warning(f"Failed to make prediction for model {model.id}: {prediction['message']}")
            
            except Exception as e:
                logger.error(f"Error making prediction for model {model.id}: {str(e)}")
                continue
        
        return {
            "status": "success",
            "predictions_count": len(results),
            "timestamp": timezone.now().isoformat()
        }
        
    except Exception as e:
        logger.exception(f"Error in run_live_predictions task: {str(e)}")
        raise self.retry(exc=e)


@shared_task(
    bind=True,
    base=MarketDataTask,
    max_retries=3,
    default_retry_delay=60,
    autoretry_for=(Exception,),
    retry_backoff=True
)
def periodic_model_retraining(self):
    """
    Periodically retrain all active ML models with the latest live market data
    to ensure they adapt to changing market conditions.
    """
    logger.info("Starting periodic model retraining with live data")
    
    try:
        # Get all trained models that are due for retraining
        # We'll retrain models that haven't been retrained in the last 24 hours
        retraining_threshold = timezone.now() - timedelta(hours=24)
        
        models_to_retrain = MLModel.objects.filter(
            Q(status='trained') | Q(status='active'),
            Q(last_retrained__lt=retraining_threshold) | Q(last_retrained__isnull=True)
        )
        
        if not models_to_retrain.exists():
            logger.info("No models due for retraining")
            return
        
        logger.info(f"Found {models_to_retrain.count()} models to retrain")
        
        # First, ensure we have the latest live data for all markets
        markets = Market.objects.all()
        for market in markets:
            try:
                # Fetch the latest live data for this market
                fetch_live_market_data(self, market.id)
                logger.info(f"Fetched latest live data for {market.name}")
            except Exception as e:
                logger.error(f"Error fetching live data for {market.name}: {str(e)}")
                # Continue with other markets even if one fails
                continue
        
        # Now retrain each model with the latest data
        for model in models_to_retrain:
            try:
                logger.info(f"Scheduling retraining for model {model.id} ({model.model_type} on {model.instrument})")
                
                # Update model status
                model.status = 'queued_for_retraining'
                model.last_retrained = timezone.now()
                model.save()
                
                # Schedule the retraining task
                train_model_task.delay(model.id)
                
            except Exception as e:
                logger.error(f"Error scheduling retraining for model {model.id}: {str(e)}")
                continue
        
        return True
        
    except Exception as e:
        logger.exception(f"Error in periodic_model_retraining task: {str(e)}")
        raise self.retry(exc=e)


@shared_task(
    bind=True,
    base=MarketDataTask,
    max_retries=3,
    default_retry_delay=60,
    autoretry_for=(Exception,),
    retry_backoff=True
)
def populate_initial_markets(self):
    """
    Populate initial market data from IG API
    """
    logger.info("Starting initial market data population")
    
    try:
        # Get admin user with active IG session
        from users.models import User
        admin_user = User.objects.filter(is_staff=True, ig_active_session=True).first()
        
        if not admin_user:
            logger.error("No admin user with active IG session found")
            raise Exception("No admin user with active IG session found")
        
        # List of market types to search for
        MARKET_TYPES = [
            'FOREX',
            'INDICES',
            'SHARES',
            'COMMODITIES',
            'BONDS',
            'ETFS'
        ]
        
        total_markets = 0
        errors = 0
        
        # Create IG API service instance
        ig_service = IGAPIService(admin_user)
        
        for market_type in MARKET_TYPES:
            logger.info(f"Searching for {market_type} markets...")
            
            # Get markets from IG API
            markets = ig_service.search_markets(market_type, market_type)
            
            for market_data in markets:
                try:
                    # Save to database
                    market, created = Market.objects.update_or_create(
                        epic=market_data['epic'],
                        defaults={
                            'name': market_data['name'],
                            'instrument_type': market_data['instrumentType'],
                            'expiry': market_data.get('expiry'),
                            'high': market_data.get('highPrice', {}).get('bid'),
                            'low': market_data.get('lowPrice', {}).get('bid'),
                            'percentage_change': market_data.get('changePct'),
                            'net_change': market_data.get('netChange'),
                            'bid': market_data.get('bidPrice', {}).get('bid'),
                            'offer': market_data.get('offerPrice', {}).get('bid'),
                            'updated_at': timezone.now()
                        }
                    )
                    
                    if created:
                        logger.info(f"Created new market: {market.name} ({market.epic})")
                    else:
                        logger.info(f"Updated market: {market.name} ({market.epic})")
                        
                    # Send to RabbitMQ
                    self.send_to_rabbitmq(market_data)
                    
                    # Write to InfluxDB
                    self.write_to_influxdb(market_data)
                    
                    total_markets += 1
                    
                except Exception as e:
                    logger.error(f"Error processing market {market_data['epic']}: {str(e)}")
                    errors += 1
                    continue
        
        logger.info(f"Market data population completed: {total_markets} markets processed, {errors} errors")
        
    except Exception as e:
        logger.exception(f"Error in market data population task: {str(e)}")
        raise self.retry(exc=e)


class MarketDataTask(Task):
    """
    Base class for market data tasks
    """
    abstract = True
    
    def send_to_rabbitmq(self, market_data):
        """
        Send market data to RabbitMQ queue
        """
        try:
            connection = BlockingConnection(
                ConnectionParameters(
                    host=settings.RABBITMQ_HOST,
                    port=settings.RABBITMQ_PORT,
                    credentials=pika.PlainCredentials(
                        settings.RABBITMQ_USER,
                        settings.RABBITMQ_PASSWORD
                    )
                )
            )
            channel = connection.channel()
            
            # Declare the queue
            channel.queue_declare(queue='market_data_queue', durable=True)
            
            # Send message
            channel.basic_publish(
                exchange='',
                routing_key='market_data_queue',
                body=json.dumps(market_data),
                properties=pika.BasicProperties(
                    delivery_mode=2,  # Make message persistent
                )
            )
            
            connection.close()
            logger.info(f"Sent market data to RabbitMQ: {market_data['epic']}")
            
        except Exception as e:
            logger.error(f"Error sending to RabbitMQ: {str(e)}")
            raise

    def write_to_influxdb(self, market_data):
        """
        Write market data to InfluxDB
        """
        try:
            point = Point("market_data")\
                .tag("epic", market_data['epic'])\
                .tag("instrument_type", market_data['instrumentType'])\
                .field("bid", float(market_data.get('bidPrice', {}).get('bid', 0)))\
                .field("offer", float(market_data.get('offerPrice', {}).get('bid', 0)))\
                .field("high", float(market_data.get('highPrice', {}).get('bid', 0)))\
                .field("low", float(market_data.get('lowPrice', {}).get('bid', 0)))\
                .field("change_pct", float(market_data.get('changePct', 0)))\
                .field("net_change", float(market_data.get('netChange', 0)))\
                .time(timezone.now())
            
            influx_service.write_point(point)
            logger.info(f"Wrote market data to InfluxDB: {market_data['epic']}")
            
        except Exception as e:
            logger.error(f"Error writing to InfluxDB: {str(e)}")
            raise


@shared_task
def process_market_data(self, market_data_str):
    """
    Process market data from RabbitMQ queue and store in InfluxDB
    
    Args:
        market_data_str (str): JSON string containing market data
    """
    try:
        market_data = json.loads(market_data_str)
        epic = market_data.get('epic')
        
        if not epic:
            raise ValueError("Market data missing required epic field")
            
        # Store in InfluxDB
        influx_service.write_market_data(
            epic=epic,
            data={
                'bid': market_data.get('bid', 0),
                'offer': market_data.get('offer', 0),
                'high': market_data.get('high', 0),
                'low': market_data.get('low', 0),
                'volume': market_data.get('volume', 0),
                'timestamp': market_data.get('timestamp')
            }
        )
        
        return f"Successfully processed market data for {epic}"
        
    except Exception as e:
        logger.error(f"Error processing market data: {str(e)}")
        # Retry the task with exponential backoff
        self.retry(countdown=2 ** self.request.retries, max_retries=5)