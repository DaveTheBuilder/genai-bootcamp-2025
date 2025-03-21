import logging
from celery import Task
from django.conf import settings
from django.utils import timezone
from notifications.tasks import send_stream_error_notification

logger = logging.getLogger(__name__)


class BaseTask(Task):
    """
    Base task class for all Celery tasks in the application
    
    Provides consistent error handling, retry behavior, and logging
    """
    
    # Default retry settings
    max_retries = 3
    default_retry_delay = 60  # 1 minute
    
    # Error handling settings
    autoretry_for = (Exception,)  # Auto-retry for all exceptions
    retry_backoff = True  # Use exponential backoff
    retry_backoff_max = 600  # Maximum backoff of 10 minutes
    retry_jitter = True  # Add jitter to retry delays
    
    # Task tracking
    track_started = True  # Track when tasks are started
    
    def on_failure(self, exc, task_id, args, kwargs, einfo):
        """
        Handle task failure
        
        Args:
            exc: The exception raised
            task_id: The task ID
            args: Task positional arguments
            kwargs: Task keyword arguments
            einfo: Exception info
        """
        # Log the error
        logger.error(
            f"Task {self.name}[{task_id}] failed: {exc}\n"
            f"Args: {args}\n"
            f"Kwargs: {kwargs}\n"
            f"Traceback: {einfo}"
        )
        
        # Record the error in the database if possible
        self._record_task_error(task_id, exc, einfo)
        
        # Call the parent on_failure
        super().on_failure(exc, task_id, args, kwargs, einfo)
    
    def on_retry(self, exc, task_id, args, kwargs, einfo):
        """
        Handle task retry
        
        Args:
            exc: The exception raised
            task_id: The task ID
            args: Task positional arguments
            kwargs: Task keyword arguments
            einfo: Exception info
        """
        # Log the retry
        retry_count = self.request.retries
        max_retries = self.max_retries
        
        logger.warning(
            f"Task {self.name}[{task_id}] retrying ({retry_count}/{max_retries}): {exc}\n"
            f"Args: {args}\n"
            f"Kwargs: {kwargs}"
        )
        
        # Call the parent on_retry
        super().on_retry(exc, task_id, args, kwargs, einfo)
    
    def on_success(self, retval, task_id, args, kwargs):
        """
        Handle task success
        
        Args:
            retval: The return value
            task_id: The task ID
            args: Task positional arguments
            kwargs: Task keyword arguments
        """
        # Log the success
        logger.info(f"Task {self.name}[{task_id}] succeeded")
        
        # Call the parent on_success
        super().on_success(retval, task_id, args, kwargs)
    
    def _record_task_error(self, task_id, exc, einfo):
        """
        Record task error in the database
        
        Args:
            task_id: The task ID
            exc: The exception raised
            einfo: Exception info
        """
        try:
            from core.models import TaskError
            
            # Create a task error record
            TaskError.objects.create(
                task_id=task_id,
                task_name=self.name,
                error_message=str(exc),
                error_traceback=str(einfo),
                created_at=timezone.now()
            )
        except Exception as e:
            logger.error(f"Failed to record task error: {e}")
    
    def notify_admin_on_critical_error(self, exc, task_id, einfo):
        """
        Notify admin on critical error
        
        Args:
            exc: The exception raised
            task_id: The task ID
            einfo: Exception info
        """
        try:
            # Get admin users
            from django.contrib.auth import get_user_model
            User = get_user_model()
            
            admin_users = User.objects.filter(is_staff=True, is_active=True)
            
            # Send notification to each admin
            for admin in admin_users:
                send_stream_error_notification.delay(
                    admin.id,
                    f"Critical task error in {self.name}: {exc}",
                    {
                        "errorType": "task_critical",
                        "taskId": task_id,
                        "taskName": self.name,
                        "retryCount": self.request.retries,
                        "maxRetries": self.max_retries
                    }
                )
        except Exception as e:
            logger.error(f"Failed to notify admin on critical error: {e}")


class MarketDataTask(BaseTask):
    """
    Base task for market data tasks
    
    Provides specialized error handling for market data tasks
    """
    
    # Market data tasks may need more retries
    max_retries = 5
    default_retry_delay = 30  # 30 seconds
    
    def on_failure(self, exc, task_id, args, kwargs, einfo):
        """
        Handle market data task failure
        """
        # Check if this is a critical error
        is_critical = self._is_critical_error(exc)
        
        if is_critical:
            # Notify admins on critical errors
            self.notify_admin_on_critical_error(exc, task_id, einfo)
        
        # Call the parent on_failure
        super().on_failure(exc, task_id, args, kwargs, einfo)
    
    def _is_critical_error(self, exc):
        """
        Check if an error is critical
        
        Args:
            exc: The exception raised
            
        Returns:
            bool: True if the error is critical, False otherwise
        """
        # Consider API authentication errors as critical
        if "API key" in str(exc).lower() or "authentication" in str(exc).lower():
            return True
        
        # Consider rate limit errors as critical
        if "rate limit" in str(exc).lower() or "too many requests" in str(exc).lower():
            return True
        
        return False


class PortfolioTask(BaseTask):
    """
    Base task for portfolio tasks
    
    Provides specialized error handling for portfolio tasks
    """
    
    # Portfolio tasks need to be reliable
    max_retries = 4
    default_retry_delay = 45  # 45 seconds
    
    def on_failure(self, exc, task_id, args, kwargs, einfo):
        """
        Handle portfolio task failure
        """
        # Check if this is a critical error that affects user portfolios
        is_critical = self._is_critical_error(exc)
        
        if is_critical:
            # Notify admins on critical errors
            self.notify_admin_on_critical_error(exc, task_id, einfo)
        
        # Call the parent on_failure
        super().on_failure(exc, task_id, args, kwargs, einfo)
    
    def _is_critical_error(self, exc):
        """
        Check if an error is critical for portfolio tasks
        
        Args:
            exc: The exception raised
            
        Returns:
            bool: True if the error is critical, False otherwise
        """
        # Consider database errors as critical
        if "database" in str(exc).lower() or "db" in str(exc).lower():
            return True
        
        # Consider calculation errors as critical
        if "calculation" in str(exc).lower() or "math" in str(exc).lower():
            return True
        
        return False


class NotificationTask(BaseTask):
    """
    Base task for notification tasks
    
    Provides specialized error handling for notification tasks
    """
    
    # Notification tasks should retry quickly
    max_retries = 5
    default_retry_delay = 15  # 15 seconds
    
    def on_failure(self, exc, task_id, args, kwargs, einfo):
        """
        Handle notification task failure
        """
        # Call the parent class's on_failure method
        super().on_failure(exc, task_id, args, kwargs, einfo)
        
        # For notification tasks, we don't want to generate additional notifications
        # on failure as this could lead to notification storms
        logger.warning(
            f"Notification task {self.name}[{task_id}] failed without sending "
            f"error notification: {exc}"
        )


class UserTask(BaseTask):
    """
    Base task for user-related tasks
    
    Provides specialized error handling for user management tasks
    """
    
    # Default retry settings for user tasks
    max_retries = 3
    default_retry_delay = 60
    
    def on_failure(self, exc, task_id, args, kwargs, einfo):
        """
        Handle user task failure
        """
        logger.error(f"User task {self.name}[{task_id}] failed: {exc}")
        
        # Check if this is a critical error
        if self._is_critical_error(exc):
            # Send notification for critical errors
            try:
                # Create a notification for the admin
                from notifications.tasks import create_notification
                create_notification(
                    recipient_id=1,  # Admin user ID
                    title="Critical User Task Error",
                    message=f"Task {self.name} failed with error: {exc}",
                    level="error",
                    category="system"
                )
            except Exception as e:
                logger.error(f"Failed to create notification for user task error: {e}")
        
        # Call the parent on_failure
        super().on_failure(exc, task_id, args, kwargs, einfo)
    
    def _is_critical_error(self, exc):
        """
        Check if an error is critical for user tasks
        
        Args:
            exc: The exception raised
            
        Returns:
            bool: True if the error is critical, False otherwise
        """
        # Define which exceptions are considered critical for user tasks
        critical_exceptions = (
            ConnectionError,
            TimeoutError,
            PermissionError,
        )
        
        return isinstance(exc, critical_exceptions)


class TradingTask(BaseTask):
    """
    Base task for trading-related tasks
    
    Provides specialized error handling for trading operations
    """
    
    # Default retry settings for trading tasks
    max_retries = 3
    default_retry_delay = 30  # Shorter delay for trading tasks
    
    def on_failure(self, exc, task_id, args, kwargs, einfo):
        """
        Handle trading task failure
        """
        logger.error(f"Trading task {self.name}[{task_id}] failed: {exc}")
        
        # Check if this is a critical error
        if self._is_critical_error(exc):
            # Send notification for critical errors
            try:
                # Create a notification for the admin
                from notifications.tasks import create_notification
                create_notification(
                    recipient_id=1,  # Admin user ID
                    title="Critical Trading Task Error",
                    message=f"Task {self.name} failed with error: {exc}",
                    level="error",
                    category="trading"
                )
            except Exception as e:
                logger.error(f"Failed to create notification for trading task error: {e}")
        
        # Call the parent on_failure
        super().on_failure(exc, task_id, args, kwargs, einfo)
    
    def _is_critical_error(self, exc):
        """
        Check if an error is critical for trading tasks
        
        Args:
            exc: The exception raised
            
        Returns:
            bool: True if the error is critical, False otherwise
        """
        # Define which exceptions are considered critical for trading tasks
        critical_exceptions = (
            ConnectionError,
            TimeoutError,
            ValueError,  # Invalid trading parameters
            PermissionError,
        )
        
        return isinstance(exc, critical_exceptions)
