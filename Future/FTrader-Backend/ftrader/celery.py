from __future__ import absolute_import, unicode_literals
import os
import logging
from celery import Celery
from celery.signals import task_failure, worker_ready, worker_shutdown
from django.conf import settings

# Set up logging
logger = logging.getLogger(__name__)

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ftrader.settings')

app = Celery('ftrader')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)

# Configure default task settings
app.conf.task_default_queue = 'default'
app.conf.task_default_exchange = 'default'
app.conf.task_default_routing_key = 'default'

# Configure task execution settings
app.conf.task_acks_late = True  # Tasks are acknowledged after execution
app.conf.worker_prefetch_multiplier = 1  # Prefetch one task at a time
app.conf.task_time_limit = 3600  # 1 hour time limit
app.conf.task_soft_time_limit = 3000  # 50 minutes soft time limit

# Configure broker settings
app.conf.broker_url = 'amqp://admin:admin123@rabbitmq:5672//'
app.conf.result_backend = 'redis://redis:6379/0'

# Configure broker settings to fix acknowledgement timeout issues
app.conf.broker_transport_options = {
    'confirm_publish': True,
    'max_retries': 3,
    'interval_start': 0,
    'interval_step': 0.2,
    'interval_max': 0.5,
    'hostname': 'rabbitmq',
    'port': 5672,
    'virtual_host': '/',
    'ssl': False,
    'connect_timeout': 30,
    'heartbeat': 30,  # Increased from 10 to 30 seconds
    'retry': True,
    'retry_policy': {
        'max_retries': 3,
        'interval_start': 0,
        'interval_step': 0.2,
        'interval_max': 0.5,
    },
    'socket_timeout': 30,  # Added socket timeout
    'socket_connect_timeout': 30,  # Added connection timeout
    'socket_keepalive': True,  # Enable keepalive
    'socket_keepalive_options': {
        'idle': 60,  # Start keepalive after 60 seconds
        'interval': 10,  # Send keepalive packets every 10 seconds
        'count': 3,  # Send up to 3 keepalive packets
    }
}

# Set a shorter acknowledgement timeout (5 minutes instead of 30)
app.conf.broker_connection_timeout = 300  # Connection timeout in seconds
app.conf.broker_heartbeat = 10  # Heartbeat in seconds
app.conf.broker_connection_max_retries = 5  # Maximum connection retries
app.conf.worker_cancel_long_running_tasks_on_connection_loss = True  # Cancel tasks on connection loss

# Configure task retry settings
app.conf.task_default_retry_delay = 60  # 1 minute retry delay
app.conf.task_max_retries = 3  # Maximum of 3 retries

# Add broker connection retry on startup
app.conf.broker_connection_retry_on_startup = True

# Add explicit host configuration
app.conf.broker_host = 'rabbitmq'
app.conf.broker_port = 5672
app.conf.broker_username = 'admin'
app.conf.broker_password = 'admin123'
app.conf.broker_vhost = '/'

# Add additional connection settings
app.conf.broker_connection_retry = True
app.conf.broker_connection_max_retries = 3
app.conf.broker_connection_retry_delay = 1
app.conf.broker_connection_timeout = 30
app.conf.broker_heartbeat = 10
app.conf.broker_pool_limit = 10
app.conf.broker_pool_timeout = 10
app.conf.broker_transport_options = {
    'confirm_publish': True,
    'max_retries': 3,
    'interval_start': 0,
    'interval_step': 0.2,
    'interval_max': 0.5,
    'hostname': 'rabbitmq',
    'port': 5672,
    'virtual_host': '/',
    'ssl': False,
    'connect_timeout': 30,
    'heartbeat': 10,
    'retry': True,
    'retry_policy': {
        'timeout': 5.0,
        'max_retries': 3,
        'interval_start': 0,
        'interval_step': 0.2,
        'interval_max': 0.5,
    }
}

# Configure periodic tasks
from celery.schedules import crontab

app.conf.beat_schedule = {
    # Update market data every 5 minutes during trading hours
    'update-market-data-every-5-minutes': {
        'task': 'market_data.tasks.update_market_data',
        'schedule': crontab(minute='*/5', hour='7-23', day_of_week='1-5'),  # Every 5 minutes, 7 AM to 11 PM, Monday to Friday
        'options': {'expires': 300}  # Task expires after 5 minutes
    },
    # Fetch live market data every minute
    'fetch-live-market-data-every-minute': {
        'task': 'market_data.tasks.fetch_live_market_data',
        'schedule': crontab(minute='*'),  # Every minute
        'options': {'expires': 60}  # Task expires after 1 minute
    },
    # Run live predictions every 5 minutes
    'run-live-predictions-every-5-minutes': {
        'task': 'market_data.tasks.run_live_predictions',
        'schedule': crontab(minute='*/5'),  # Every 5 minutes
        'options': {'expires': 300}  # Task expires after 5 minutes
    },
    # Check market alerts every minute
    'check-market-alerts-every-minute': {
        'task': 'market_data.tasks.check_market_alerts',
        'schedule': crontab(minute='*'),  # Every minute
        'options': {'expires': 60}  # Task expires after 1 minute
    },
    # Clean up old price history data once a day
    'cleanup-old-price-history-daily': {
        'task': 'market_data.tasks.cleanup_old_price_history',
        'schedule': crontab(hour=1, minute=0),  # 1:00 AM every day
        'options': {'expires': 3600}  # Task expires after 1 hour
    },
}

# Configure task serialization
app.conf.accept_content = ['json']
app.conf.task_serializer = 'json'
app.conf.result_serializer = 'json'

# Configure result backend settings
app.conf.result_expires = 86400  # Results expire after 1 day


@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')


@task_failure.connect
def handle_task_failure(task_id, exception, args, kwargs, traceback, einfo, **kw):
    """
    Log task failures
    """
    logger.error(
        f"Task {task_id} failed: {exception}\n"
        f"Args: {args}\n"
        f"Kwargs: {kwargs}\n"
        f"Traceback: {einfo}"
    )


@worker_ready.connect
def worker_ready_handler(**kwargs):
    """
    Log when worker is ready
    """
    logger.info("Celery worker is ready to receive tasks")


@worker_shutdown.connect
def worker_shutdown_handler(**kwargs):
    """
    Log when worker is shutting down
    """
    logger.info("Celery worker is shutting down")
