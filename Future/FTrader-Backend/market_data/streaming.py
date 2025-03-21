"""
IG Streaming API integration utilities
"""
import json
import logging
import threading
import asyncio
from typing import Dict, List, Optional, Callable, Any, Union
from datetime import datetime

from django.utils import timezone
from django.contrib.auth import get_user_model
from asgiref.sync import async_to_sync, sync_to_async
from channels.layers import get_channel_layer

from market_data.lightstreamer_client import IGStreamingClient
from market_data.mock_streaming import MockStreamingClient
from notifications.utils import create_error_notification, create_success_notification
from .influx_service import influx_service
from .tasks import process_market_data

User = get_user_model()
logger = logging.getLogger(__name__)


# Global client registry to maintain active streaming connections
# Key: user_id, Value: IGStreamingClient or MockStreamingClient instance
streaming_clients = {}
streaming_clients_lock = threading.Lock()


def get_streaming_client(user, offline_mode=False) -> Optional[Union[IGStreamingClient, MockStreamingClient]]:
    """
    Get or create a streaming client for a user
    
    Args:
        user: User object
        offline_mode: Whether to use offline mode (mock client)
    
    Returns:
        IGStreamingClient or MockStreamingClient instance or None if client could not be created
    """
    user_id = str(user.id)
    
    with streaming_clients_lock:
        # Check if client already exists
        if user_id in streaming_clients:
            client = streaming_clients[user_id]
            # If offline mode changed, recreate the client
            if offline_mode != isinstance(client, MockStreamingClient):
                remove_streaming_client(user)
            else:
                return client
        
        # Create a new client
        try:
            if offline_mode:
                # Create mock client for offline mode
                client = MockStreamingClient(debug=True)
                logger.info(f"Created mock streaming client for user {user.username} (offline mode)")
            else:
                # Check if user has active IG session for real client
                if not user.ig_active_session:
                    logger.warning(f"User {user.username} has no active IG session")
                    return None
                
                # Create real client with IG credentials
                client = IGStreamingClient(
                    cst=user.ig_cst,
                    security_token=user.ig_security_token,
                    api_key=user.ig_api_key,
                    is_demo=user.ig_demo,
                    debug=True
                )
                logger.info(f"Created IG streaming client for user {user.username}")
            
            # Set up client callbacks
            client.on_connection_status_change = lambda status: handle_connection_status_change(user, status)
            client.on_error = lambda code, message: handle_streaming_error(user, code, message)
            client.on_market_data = lambda market_data: handle_market_data(user, market_data)
            
            # Store client
            streaming_clients[user_id] = client
            
            return client
        
        except Exception as e:
            logger.exception(f"Error creating streaming client for user {user.username}: {str(e)}")
            return None


def remove_streaming_client(user):
    """
    Remove a streaming client for a user
    
    Args:
        user: User object
    
    Returns:
        Whether the client was removed
    """
    user_id = str(user.id)
    
    with streaming_clients_lock:
        if user_id in streaming_clients:
            client = streaming_clients[user_id]
            
            # Disconnect and clean up
            try:
                client.disconnect()
                client.unsubscribe_all()
            except Exception as e:
                logger.exception(f"Error disconnecting streaming client: {str(e)}")
            
            # Remove client
            del streaming_clients[user_id]
            
            logger.info(f"Removed streaming client for user {user.username}")
            return True
        
        return False


def handle_connection_status_change(user, status):
    """
    Handle connection status changes
    
    Args:
        user: User object
        status: Connection status
    """
    logger.info(f"Connection status changed for user {user.username}: {status}")
    
    # Send connection status to WebSocket
    channel_layer = get_channel_layer()
    
    async_to_sync(channel_layer.group_send)(
        f"market_data_{user.id}",
        {
            "type": "connection_status",
            "status": status,
            "timestamp": timezone.now().isoformat()
        }
    )
    
    # Create notification for disconnection
    if status == "disconnected":
        create_error_notification(
            user=user,
            error_message="IG Streaming connection lost",
            data={
                "errorType": "connection",
                "canRetry": True,
                "canSwitchToOfflineMode": True
            }
        )
    
    # Create notification for successful connection
    elif status == "connected":
        create_success_notification(
            user=user,
            success_message="IG Streaming connection established"
        )


def handle_streaming_error(user, error_code, error_message):
    """
    Handle streaming errors
    
    Args:
        user: User object
        error_code: Error code
        error_message: Error message
    """
    logger.error(f"Streaming error for user {user.username}: {error_code} - {error_message}")
    
    # Send error to WebSocket
    channel_layer = get_channel_layer()
    
    async_to_sync(channel_layer.group_send)(
        f"market_data_{user.id}",
        {
            "type": "stream_error",
            "error": f"Streaming error: {error_message}",
            "error_code": error_code,
            "errorType": "connection",
            "canRetry": True,
            "canSwitchToOfflineMode": True,
            "timestamp": timezone.now().isoformat()
        }
    )
    
    # Create notification
    create_error_notification(
        user=user,
        error_message=f"IG Streaming error: {error_message}",
        data={
            "error_code": error_code,
            "errorType": "connection",
            "canRetry": True,
            "canSwitchToOfflineMode": True
        }
    )


def handle_market_data(user, market_data):
    """
    Handle incoming market data from the stream
    
    Args:
        user: User object
        market_data (dict): Market data containing price, volume, etc.
    """
    try:
        # Convert market data to JSON string
        market_data_str = json.dumps(market_data)
        
        # Publish to RabbitMQ queue
        process_market_data.delay(market_data_str)
        
        # Send price update to WebSocket
        channel_layer = get_channel_layer()
        
        async_to_sync(channel_layer.group_send)(
            f"market_data_{user.id}",
            {
                "type": "market_update",
                "data": market_data,
                "timestamp": timezone.now().isoformat()
            }
        )
    
    except Exception as e:
        logger.exception(f"Error handling market data: {str(e)}")
        create_error_notification(
            user=user,
            title="Market Data Error",
            message=f"Error processing market data: {str(e)}"
        )


def handle_price_update(user, update_data):
    """
    Handle price updates
    
    Args:
        user: User object
        update_data: Update data from Lightstreamer
    """
    # Send price update to WebSocket
    channel_layer = get_channel_layer()
    
    async_to_sync(channel_layer.group_send)(
        f"market_data_{user.id}",
        {
            "type": "market_update",
            "data": update_data,
            "timestamp": timezone.now().isoformat()
        }
    )


def handle_chart_update(user, update_data):
    """
    Handle chart updates
    
    Args:
        user: User object
        update_data: Update data from Lightstreamer
    """
    # Send chart update to WebSocket
    channel_layer = get_channel_layer()
    
    async_to_sync(channel_layer.group_send)(
        f"market_data_{user.id}",
        {
            "type": "chart_update",
            "data": update_data,
            "timestamp": timezone.now().isoformat()
        }
    )


def handle_account_update(user, update_data):
    """
    Handle account updates
    
    Args:
        user: User object
        update_data: Update data from Lightstreamer
    """
    # Send account update to WebSocket
    channel_layer = get_channel_layer()
    
    async_to_sync(channel_layer.group_send)(
        f"market_data_{user.id}",
        {
            "type": "account_update",
            "data": update_data,
            "timestamp": timezone.now().isoformat()
        }
    )


def handle_trade_update(user, update_data):
    """
    Handle trade updates
    
    Args:
        user: User object
        update_data: Update data from Lightstreamer
    """
    # Send trade update to WebSocket
    channel_layer = get_channel_layer()
    
    async_to_sync(channel_layer.group_send)(
        f"market_data_{user.id}",
        {
            "type": "trade_update",
            "data": update_data,
            "timestamp": timezone.now().isoformat()
        }
    )


def subscribe_to_markets(user, epics):
    """
    Subscribe to market price updates
    
    Args:
        user: User object
        epics: List of market epics
    
    Returns:
        Tuple of (success, subscription_id, error_message)
    """
    if not epics:
        return False, None, "No epics provided"
    
    # Get streaming client
    client = get_streaming_client(user)
    if not client:
        return False, None, "Could not create streaming client"
    
    # Connect if not connected
    if not client.connected:
        client.connect()
    
    # Subscribe to prices
    try:
        subscription_id = client.subscribe_prices(
            epics=epics,
            callback=lambda update_data: handle_price_update(user, update_data)
        )
        
        if subscription_id:
            logger.info(f"Subscribed to prices for {len(epics)} markets for user {user.username}")
            return True, subscription_id, None
        else:
            return False, None, "Failed to create subscription"
    
    except Exception as e:
        logger.exception(f"Error subscribing to markets: {str(e)}")
        return False, None, f"Error subscribing to markets: {str(e)}"


def subscribe_to_chart(user, epic):
    """
    Subscribe to chart tick data
    
    Args:
        user: User object
        epic: Market epic
    
    Returns:
        Tuple of (success, subscription_id, error_message)
    """
    if not epic:
        return False, None, "No epic provided"
    
    # Get streaming client
    client = get_streaming_client(user)
    if not client:
        return False, None, "Could not create streaming client"
    
    # Connect if not connected
    if not client.connected:
        client.connect()
    
    # Subscribe to chart
    try:
        subscription_id = client.subscribe_chart_ticks(
            epic=epic,
            callback=lambda update_data: handle_chart_update(user, update_data)
        )
        
        if subscription_id:
            logger.info(f"Subscribed to chart for {epic} for user {user.username}")
            return True, subscription_id, None
        else:
            return False, None, "Failed to create subscription"
    
    except Exception as e:
        logger.exception(f"Error subscribing to chart: {str(e)}")
        return False, None, f"Error subscribing to chart: {str(e)}"


def subscribe_to_account(user, account_id):
    """
    Subscribe to account balance updates
    
    Args:
        user: User object
        account_id: Account ID
    
    Returns:
        Tuple of (success, subscription_id, error_message)
    """
    if not account_id:
        return False, None, "No account ID provided"
    
    # Get streaming client
    client = get_streaming_client(user)
    if not client:
        return False, None, "Could not create streaming client"
    
    # Connect if not connected
    if not client.connected:
        client.connect()
    
    # Subscribe to account
    try:
        subscription_id = client.subscribe_account_balance(
            account_id=account_id,
            callback=lambda update_data: handle_account_update(user, update_data)
        )
        
        if subscription_id:
            logger.info(f"Subscribed to account {account_id} for user {user.username}")
            return True, subscription_id, None
        else:
            return False, None, "Failed to create subscription"
    
    except Exception as e:
        logger.exception(f"Error subscribing to account: {str(e)}")
        return False, None, f"Error subscribing to account: {str(e)}"


def subscribe_to_trades(user, account_id):
    """
    Subscribe to trade updates
    
    Args:
        user: User object
        account_id: Account ID
    
    Returns:
        Tuple of (success, subscription_id, error_message)
    """
    if not account_id:
        return False, None, "No account ID provided"
    
    # Get streaming client
    client = get_streaming_client(user)
    if not client:
        return False, None, "Could not create streaming client"
    
    # Connect if not connected
    if not client.connected:
        client.connect()
    
    # Subscribe to trades
    try:
        subscription_id = client.subscribe_trade_updates(
            account_id=account_id,
            callback=lambda update_data: handle_trade_update(user, update_data)
        )
        
        if subscription_id:
            logger.info(f"Subscribed to trades for account {account_id} for user {user.username}")
            return True, subscription_id, None
        else:
            return False, None, "Failed to create subscription"
    
    except Exception as e:
        logger.exception(f"Error subscribing to trades: {str(e)}")
        return False, None, f"Error subscribing to trades: {str(e)}"


def unsubscribe(user, subscription_id):
    """
    Unsubscribe from a subscription
    
    Args:
        user: User object
        subscription_id: Subscription ID
    
    Returns:
        Whether the unsubscription was successful
    """
    if not subscription_id:
        return False
    
    # Get streaming client
    client = get_streaming_client(user)
    if not client:
        return False
    
    # Unsubscribe
    try:
        success = client.unsubscribe(subscription_id)
        
        if success:
            logger.info(f"Unsubscribed from {subscription_id} for user {user.username}")
        else:
            logger.warning(f"Failed to unsubscribe from {subscription_id} for user {user.username}")
        
        return success
    
    except Exception as e:
        logger.exception(f"Error unsubscribing from {subscription_id}: {str(e)}")
        return False


def unsubscribe_all(user):
    """
    Unsubscribe from all subscriptions
    
    Args:
        user: User object
    
    Returns:
        Whether all unsubscriptions were successful
    """
    # Get streaming client
    client = get_streaming_client(user)
    if not client:
        return False
    
    # Unsubscribe all
    try:
        success = client.unsubscribe_all()
        
        if success:
            logger.info(f"Unsubscribed from all subscriptions for user {user.username}")
        else:
            logger.warning(f"Failed to unsubscribe from all subscriptions for user {user.username}")
        
        return success
    
    except Exception as e:
        logger.exception(f"Error unsubscribing from all subscriptions: {str(e)}")
        return False


def disconnect(user):
    """
    Disconnect from the streaming server
    
    Args:
        user: User object
    
    Returns:
        Whether the disconnection was successful
    """
    # Get streaming client
    client = get_streaming_client(user)
    if not client:
        return False
    
    # Disconnect
    try:
        success = client.disconnect()
        
        if success:
            logger.info(f"Disconnected from streaming server for user {user.username}")
        else:
            logger.warning(f"Failed to disconnect from streaming server for user {user.username}")
        
        return success
    
    except Exception as e:
        logger.exception(f"Error disconnecting from streaming server: {str(e)}")
        return False
