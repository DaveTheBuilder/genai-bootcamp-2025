import logging
import json
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from .models import Notification, NotificationTemplate

logger = logging.getLogger(__name__)


def create_notification(user, title, message, notification_type='INFO', related_object=None, data=None):
    """
    Create a notification for a user
    
    Args:
        user: User object
        title: Notification title
        message: Notification message
        notification_type: Type of notification (INFO, SUCCESS, WARNING, ERROR, ALERT, SYSTEM)
        related_object: Optional related object (e.g., a position, order, market alert)
        data: Optional additional data in dict format
    
    Returns:
        The created notification object
    """
    try:
        # Create content type and object id if related object is provided
        content_type = None
        object_id = None
        
        if related_object:
            content_type = ContentType.objects.get_for_model(related_object)
            object_id = related_object.id
        
        # Create the notification
        notification = Notification.objects.create(
            user=user,
            title=title,
            message=message,
            notification_type=notification_type,
            content_type=content_type,
            object_id=object_id,
            data=data
        )
        
        # Send the notification to the WebSocket
        send_notification_to_websocket(notification)
        
        return notification
    
    except Exception as e:
        logger.exception(f"Error creating notification: {str(e)}")
        return None


def create_notification_from_template(user, template_name, context=None, related_object=None, data=None):
    """
    Create a notification for a user using a template
    
    Args:
        user: User object
        template_name: Name of the notification template
        context: Dict of context variables for the template
        related_object: Optional related object (e.g., a position, order, market alert)
        data: Optional additional data in dict format
    
    Returns:
        The created notification object or None if template not found
    """
    try:
        # Get the template
        template = NotificationTemplate.objects.get(name=template_name)
        
        # Default context
        if context is None:
            context = {}
        
        context.update({
            'user': user,
            'username': user.username,
            'timestamp': timezone.now().strftime('%Y-%m-%d %H:%M:%S'),
        })
        
        # Format the title and message
        title = template.title_template.format(**context)
        message = template.message_template.format(**context)
        
        # Create the notification
        return create_notification(
            user=user,
            title=title,
            message=message,
            notification_type=template.notification_type,
            related_object=related_object,
            data=data
        )
    
    except NotificationTemplate.DoesNotExist:
        logger.error(f"Notification template '{template_name}' not found")
        return None
    except Exception as e:
        logger.exception(f"Error creating notification from template: {str(e)}")
        return None


def send_notification_to_websocket(notification):
    """
    Send a notification to the user's WebSocket
    
    Args:
        notification: Notification object
    """
    try:
        channel_layer = get_channel_layer()
        
        # Create the notification data
        notification_data = {
            'id': notification.id,
            'title': notification.title,
            'message': notification.message,
            'notification_type': notification.notification_type,
            'created_at': notification.created_at.isoformat(),
            'content_type': notification.content_type.model if notification.content_type else None,
            'object_id': notification.object_id,
            'data': notification.data
        }
        
        # Send to the user's notification group
        async_to_sync(channel_layer.group_send)(
            f'notifications_{notification.user.id}',
            {
                'type': 'notification_message',
                'notification': notification_data
            }
        )
    
    except Exception as e:
        logger.exception(f"Error sending notification to WebSocket: {str(e)}")


def create_error_notification(user, error_message, related_object=None, data=None):
    """
    Create an error notification for a user
    
    Args:
        user: User object
        error_message: Error message
        related_object: Optional related object
        data: Optional additional data which can include:
            - error_code: Error code
            - errorType: Error type (connection, subscription, etc.)
            - canRetry: Whether the error can be retried
            - canSwitchToOfflineMode: Whether the user can switch to offline mode
    
    Returns:
        The created notification object
    """
    # Set default title based on error type if available
    title = "Error"
    if data and 'errorType' in data:
        error_type = data['errorType']
        if error_type == 'connection':
            title = "Connection Error"
        elif error_type == 'subscription':
            title = "Subscription Error"
        elif error_type == 'authentication':
            title = "Authentication Error"
    
    # Add error code to message if available
    if data and 'error_code' in data:
        error_message = f"{error_message} (Code: {data['error_code']})"
    
    # Create the notification
    notification = create_notification(
        user=user,
        title=title,
        message=error_message,
        notification_type='ERROR',
        related_object=related_object,
        data=data
    )
    
    # Log the error
    logger.error(f"Error notification for user {user.username}: {error_message}")
    
    return notification


def create_success_notification(user, success_message, related_object=None, data=None):
    """
    Create a success notification for a user
    
    Args:
        user: User object
        success_message: Success message
        related_object: Optional related object
        data: Optional additional data which can include:
            - mode: Connection mode (e.g., 'offline', 'online')
            - connection_type: Type of connection (e.g., 'streaming', 'rest')
    
    Returns:
        The created notification object
    """
    # Set default title based on data if available
    title = "Success"
    if data:
        if 'mode' in data and data['mode'] == 'offline':
            title = "Offline Mode Enabled"
        elif 'connection_type' in data:
            conn_type = data['connection_type']
            if conn_type == 'streaming':
                title = "Streaming Connection Established"
            elif conn_type == 'rest':
                title = "API Connection Established"
    
    # Create the notification
    notification = create_notification(
        user=user,
        title=title,
        message=success_message,
        notification_type='SUCCESS',
        related_object=related_object,
        data=data
    )
    
    # Log the success
    logger.info(f"Success notification for user {user.username}: {success_message}")
    
    return notification


def create_market_alert_notification(user, market_name, alert_message, related_object=None, data=None):
    """
    Create a market alert notification for a user
    
    Args:
        user: User object
        market_name: Name of the market
        alert_message: Alert message
        related_object: Optional related object
        data: Optional additional data
    
    Returns:
        The created notification object
    """
    return create_notification(
        user=user,
        title=f"Market Alert: {market_name}",
        message=alert_message,
        notification_type='ALERT',
        related_object=related_object,
        data=data
    )


def create_position_notification(user, position, message, notification_type='INFO', data=None):
    """
    Create a position-related notification for a user
    
    Args:
        user: User object
        position: Position object
        message: Notification message
        notification_type: Type of notification
        data: Optional additional data
    
    Returns:
        The created notification object
    """
    market_name = position.market.name if position.market else "Unknown Market"
    
    return create_notification(
        user=user,
        title=f"Position: {market_name}",
        message=message,
        notification_type=notification_type,
        related_object=position,
        data=data
    )


def create_order_notification(user, order, message, notification_type='INFO', data=None):
    """
    Create an order-related notification for a user
    
    Args:
        user: User object
        order: Order object
        message: Notification message
        notification_type: Type of notification
        data: Optional additional data
    
    Returns:
        The created notification object
    """
    market_name = order.market.name if order.market else "Unknown Market"
    
    return create_notification(
        user=user,
        title=f"Order: {market_name}",
        message=message,
        notification_type=notification_type,
        related_object=order,
        data=data
    )
