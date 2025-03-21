"""
WebSocket consumers for market data
"""
import json
import logging
import asyncio
import time
from typing import Dict, List, Optional, Any, Set

from asgiref.sync import async_to_sync, sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils import timezone

from market_data.streaming import get_streaming_client
from market_data.utils import handle_ig_api_error, get_ig_api_url, get_ig_api_headers
from notifications.utils import create_error_notification, create_success_notification

User = get_user_model()
logger = logging.getLogger(__name__)


class MarketDataConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer for streaming market data"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = None
        self.room_group_name = None
        self.subscribed_markets = set()
        self.streaming_task = None
        self.streaming_client = None
        self.price_subscription_id = None
        self.chart_subscriptions = {}
        self.account_subscription_id = None
        self.trade_subscription_id = None
        self.offline_mode = False
        self.connection_status = "disconnected"
    
    async def connect(self):
        """Handle WebSocket connection"""
        self.user = self.scope['user']
        
        # Check if user is authenticated
        if self.user.is_anonymous:
            await self.close(code=4001)
            return
        
        # Set up room group
        self.room_group_name = f"market_data_{self.user.id}"
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        # Accept connection
        await self.accept()
        
        # Send initial connection status
        await self.send_connection_status("disconnected")
    
    async def disconnect(self, close_code):
        """Handle WebSocket disconnection"""
        logger.info(f"WebSocket disconnect: {close_code}")
        
        # Set planned disconnect flag to avoid unnecessary error notifications
        self._planned_disconnect = True
        
        # Cancel streaming task if running
        if self.streaming_task and not self.streaming_task.done():
            self.streaming_task.cancel()
            try:
                await self.streaming_task
            except asyncio.CancelledError:
                pass
        
        # Disconnect streaming client
        if self.streaming_client:
            await self.unsubscribe_all()
            await sync_to_async(self.disconnect_streaming_client)()
            self.streaming_client = None
        
        # Remove streaming client from registry
        await sync_to_async(remove_streaming_client)(self.user)
        
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    def disconnect_streaming_client(self):
        """Disconnect streaming client"""
        if self.streaming_client:
            try:
                self.streaming_client.disconnect()
                logger.info(f"Disconnected streaming client for user {self.user.id}")
            except Exception as e:
                logger.exception(f"Error disconnecting streaming client: {str(e)}")
    
    async def receive(self, text_data):
        """Handle incoming WebSocket messages"""
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'connect':
                # Connect to streaming API
                self.offline_mode = data.get('offline_mode', False)
                
                # Cancel existing streaming task if running
                if self.streaming_task and not self.streaming_task.done():
                    self.streaming_task.cancel()
                    try:
                        await self.streaming_task
                    except asyncio.CancelledError:
                        pass
                
                # Start new streaming task
                self.streaming_task = asyncio.create_task(self.stream_market_data())
            
            elif message_type == 'disconnect':
                # Disconnect from streaming API
                if self.streaming_task and not self.streaming_task.done():
                    self.streaming_task.cancel()
                    try:
                        await self.streaming_task
                    except asyncio.CancelledError:
                        pass
                
                # Disconnect streaming client
                if self.streaming_client:
                    await self.unsubscribe_all()
                    await sync_to_async(self.disconnect_streaming_client)()
                    self.streaming_client = None
                
                # Send connection status
                await self.send_connection_status("disconnected")
            
            elif message_type == 'switch_to_offline_mode':
                # Switch to offline mode
                logger.info(f"Switching to offline mode for user {self.user.username}")
                
                # Set offline mode flag
                self.offline_mode = True
                
                # Cancel existing streaming task if running
                if self.streaming_task and not self.streaming_task.done():
                    self.streaming_task.cancel()
                    try:
                        await self.streaming_task
                    except asyncio.CancelledError:
                        pass
                
                # Disconnect existing client if any
                if self.streaming_client:
                    await self.unsubscribe_all()
                    await sync_to_async(self.disconnect_streaming_client)()
                    self.streaming_client = None
                
                # Start new streaming task in offline mode
                self.streaming_task = asyncio.create_task(self.stream_market_data())
                
                # Send confirmation to client
                await self.send_json({
                    'type': 'mode_switch',
                    'mode': 'offline',
                    'message': 'Switched to offline mode',
                    'timestamp': timezone.now().isoformat()
                })
                
                # Create notification for the user
                await sync_to_async(create_success_notification)(
                    user=self.user,
                    success_message="Switched to offline mode for market data streaming",
                    data={
                        "mode": "offline",
                        "connection_type": "streaming"
                    }
                )
            
            elif message_type == 'retry_connection':
                # Retry connection to streaming API
                logger.info(f"Retrying connection for user {self.user.username}")
                
                # Get retry parameters
                max_attempts = data.get('max_attempts', 3)
                delay_seconds = data.get('delay_seconds', 5)
                force_online = data.get('force_online', False)
                
                # If force_online is True, switch to online mode
                if force_online and self.offline_mode:
                    self.offline_mode = False
                    logger.info(f"Switching to online mode for user {self.user.username}")
                
                # Cancel existing streaming task if running
                if self.streaming_task and not self.streaming_task.done():
                    self.streaming_task.cancel()
                    try:
                        await self.streaming_task
                    except asyncio.CancelledError:
                        pass
                
                # Attempt reconnection
                reconnection_successful = await self.attempt_reconnection(
                    max_attempts=max_attempts,
                    delay_seconds=delay_seconds
                )
                
                if not reconnection_successful and not self.offline_mode:
                    # If reconnection failed and we're not in offline mode, offer to switch to offline mode
                    await self.send_error(
                        message="Failed to reconnect to streaming server after multiple attempts",
                        error_code="RECONNECTION_FAILED",
                        error_type="connection"
                    )
            
            elif message_type == 'subscribe_markets':
                # Subscribe to markets
                markets = data.get('markets', [])
                if markets:
                    # Add markets to subscribed markets
                    self.subscribed_markets.update(markets)
                    
                    # Subscribe to markets if streaming client is connected
                    if self.streaming_client and self.connection_status == "connected":
                        await self.subscribe_to_markets(markets)
                    
                    # Send confirmation
                    await self.send_json({
                        'type': 'subscription_update',
                        'status': 'subscribed',
                        'markets': list(self.subscribed_markets)
                    })
            
            elif message_type == 'unsubscribe_markets':
                # Unsubscribe from markets
                markets = data.get('markets', [])
                if markets:
                    # Remove markets from subscribed markets
                    self.subscribed_markets.difference_update(markets)
                    
                    # Unsubscribe from markets if streaming client is connected
                    if self.streaming_client and self.connection_status == "connected":
                        await self.unsubscribe_from_markets(markets)
                    
                    # Send confirmation
                    await self.send_json({
                        'type': 'subscription_update',
                        'status': 'unsubscribed',
                        'markets': list(self.subscribed_markets)
                    })
            
            elif message_type == 'subscribe_chart':
                # Subscribe to chart data
                epic = data.get('epic')
                if epic:
                    # Subscribe to chart data if streaming client is connected
                    if self.streaming_client and self.connection_status == "connected":
                        await self.subscribe_to_chart(epic)
                    
                    # Send confirmation
                    await self.send_json({
                        'type': 'chart_subscription_update',
                        'status': 'subscribed',
                        'epic': epic
                    })
            
            elif message_type == 'unsubscribe_chart':
                # Unsubscribe from chart data
                epic = data.get('epic')
                if epic:
                    # Unsubscribe from chart data if streaming client is connected
                    if self.streaming_client and self.connection_status == "connected":
                        await self.unsubscribe_from_chart(epic)
                    
                    # Send confirmation
                    await self.send_json({
                        'type': 'chart_subscription_update',
                        'status': 'unsubscribed',
                        'epic': epic
                    })
            
            elif message_type == 'get_status':
                # Send current status
                await self.send_connection_status(self.connection_status)
                
                # Send subscription status
                await self.send_json({
                    'type': 'subscription_update',
                    'status': 'current',
                    'markets': list(self.subscribed_markets)
                })
        
        except json.JSONDecodeError:
            logger.error(f"Invalid JSON received: {text_data}")
        except Exception as e:
            logger.exception(f"Error handling WebSocket message: {str(e)}")
    
    async def stream_market_data(self):
        """Stream market data from IG API"""
        try:
            # Check if user has active IG session
            if not self.offline_mode and not await self.user_has_active_ig_session():
                error_message = 'No active IG session. Please log in to IG API first.'
                await self.send_error(
                    message=error_message,
                    error_code="NO_ACTIVE_SESSION",
                    error_type="authentication"
                )
                return
            
            # Send connecting status
            await self.send_connection_status("connecting")
            
            # Get streaming client
            try:
                self.streaming_client = await sync_to_async(get_streaming_client)(
                    user=self.user,
                    offline_mode=self.offline_mode
                )
            except Exception as e:
                logger.exception(f"Error creating streaming client: {str(e)}")
                await self.send_error(
                    message=f"Error creating streaming client: {str(e)}",
                    error_code="CLIENT_CREATION_ERROR",
                    error_type="connection"
                )
                
                # Try to fall back to offline mode if we weren't already in offline mode
                if not self.offline_mode:
                    await self._fallback_to_offline_mode("Failed to create streaming client")
                return
            
            if not self.streaming_client:
                error_message = 'Failed to create streaming client.'
                await self.send_error(
                    message=error_message,
                    error_code="CLIENT_CREATION_FAILED",
                    error_type="connection"
                )
                
                # Try to fall back to offline mode if we weren't already in offline mode
                if not self.offline_mode:
                    await self._fallback_to_offline_mode("Failed to create streaming client")
                return
            
            # Update connection status
            self.handle_connection_status_change("connected")
            
            # Subscribe to markets if any
            if self.subscribed_markets:
                await self.subscribe_to_markets(list(self.subscribed_markets))
            
            # Keep connection alive
            while True:
                try:
                    # Check if client is still connected
                    if not await sync_to_async(self.streaming_client.is_connected)():
                        logger.warning("Streaming client disconnected unexpectedly")
                        
                        # Update connection status
                        self.handle_connection_status_change("disconnected")
                        
                        # Attempt to reconnect
                        reconnection_successful = await self.attempt_reconnection(max_attempts=3, delay_seconds=5)
                        
                        if not reconnection_successful:
                            if not self.offline_mode:
                                # Try to fall back to offline mode
                                await self._fallback_to_offline_mode("Failed to reconnect to streaming server")
                            else:
                                # We're already in offline mode and still couldn't reconnect
                                error_message = 'Failed to reconnect to mock streaming server.'
                                await self.send_error(
                                    message=error_message,
                                    error_code="MOCK_RECONNECTION_FAILED",
                                    error_type="connection"
                                )
                                return
                    
                    # Wait before checking again
                    await asyncio.sleep(30)
                    
                except Exception as e:
                    logger.exception(f"Error in connection monitoring: {str(e)}")
                    
                    # Update connection status
                    self.handle_connection_status_change("disconnected")
                    
                    # Attempt to reconnect
                    reconnection_successful = await self.attempt_reconnection(max_attempts=3, delay_seconds=5)
                    
                    if not reconnection_successful:
                        if not self.offline_mode:
                            # Try to fall back to offline mode
                            await self._fallback_to_offline_mode(f"Connection monitoring error: {str(e)}")
                            return
                        else:
                            # We're already in offline mode and still couldn't reconnect
                            error_message = f'Error in mock streaming client: {str(e)}'
                            await self.send_error(
                                message=error_message,
                                error_code="MOCK_CLIENT_ERROR",
                                error_type="connection"
                            )
                            return
        
        except asyncio.CancelledError:
            # Task was cancelled, clean up
            logger.info("Streaming task cancelled")
            if self.streaming_client:
                await self.unsubscribe_all()
                await sync_to_async(self.disconnect_streaming_client)()
                self.streaming_client = None
                
            # Update connection status
            self.handle_connection_status_change("disconnected")
            raise
        
        except Exception as e:
            logger.exception(f"Error in streaming task: {str(e)}")
            await self.send_error(
                message=f"Error in streaming task: {str(e)}",
                error_code="STREAMING_ERROR",
                error_type="connection"
            )
            
            # Update connection status
            self.handle_connection_status_change("disconnected")
            
            # Try to fall back to offline mode if we weren't already in offline mode
            if not self.offline_mode:
                await self._fallback_to_offline_mode(f"Streaming error: {str(e)}")
    
    async def _fallback_to_offline_mode(self, reason):
        """
        Fallback to offline mode when real connection fails
        
        Args:
            reason: Reason for fallback
        """
        logger.warning(f"Falling back to offline mode for user {self.user.username}: {reason}")
        
        # Send error with option to retry or continue in offline mode
        await self.send_json({
            'type': 'stream_error',
            'error': f"{reason}. Switching to offline mode.",
            'error_code': 'CONNECTION_FAILED',
            'errorType': 'connection',
            'canRetry': True,
            'canSwitchToOfflineMode': True,
            'timestamp': timezone.now().isoformat()
        })
        
        # Create notification for the user
        await sync_to_async(create_error_notification)(
            user=self.user,
            error_message=f"{reason}. Switching to offline mode.",
            data={
                "error_code": "CONNECTION_FAILED",
                "errorType": "connection",
                "canRetry": True,
                "canSwitchToOfflineMode": True
            }
        )
        
        # Clean up existing client if any
        if self.streaming_client:
            try:
                await self.unsubscribe_all()
                await sync_to_async(self.disconnect_streaming_client)()
            except Exception as e:
                logger.warning(f"Error cleaning up existing client during fallback: {str(e)}")
            
            self.streaming_client = None
        
        # Set offline mode flag
        self.offline_mode = True
        
        # Update connection status
        self.handle_connection_status_change("disconnected")
        
        # Create a new streaming task in offline mode
        try:
            # Create mock client for offline mode
            self.streaming_client = await sync_to_async(create_mock_streaming_client)(self.user)
            
            if self.streaming_client:
                # Update connection status
                self.handle_connection_status_change("connected")
                
                # Resubscribe to previous subscriptions
                if self.subscribed_markets:
                    await self.subscribe_to_markets(list(self.subscribed_markets))
                
                # Send confirmation to client
                await self.send_json({
                    'type': 'mode_switch',
                    'mode': 'offline',
                    'message': 'Switched to offline mode',
                    'timestamp': timezone.now().isoformat()
                })
                
                # Create success notification
                await sync_to_async(create_success_notification)(
                    user=self.user,
                    success_message="Successfully switched to offline mode for market data streaming",
                    data={
                        "mode": "offline",
                        "connection_type": "streaming",
                        "reason": reason
                    }
                )
                
                return True
            else:
                # Failed to create mock client
                logger.error("Failed to create mock streaming client")
                await self.send_error(
                    message="Failed to create mock streaming client. Unable to switch to offline mode.",
                    error_code="MOCK_CLIENT_CREATION_FAILED",
                    error_type="connection"
                )
                return False
                
        except Exception as e:
            logger.exception(f"Error creating mock streaming client: {str(e)}")
            await self.send_error(
                message=f"Error creating mock streaming client: {str(e)}",
                error_code="MOCK_CLIENT_ERROR",
                error_type="connection"
            )
            return False
    
    async def user_has_active_ig_session(self) -> bool:
        """Check if user has an active IG session"""
        try:
            # Get user profile
            profile = await sync_to_async(lambda: self.user.profile)()
            
            # Check if user has IG API credentials
            if not profile.ig_cst or not profile.ig_security_token or not profile.ig_api_key:
                return False
            
            # Check if tokens are expired
            if profile.ig_token_expiry and profile.ig_token_expiry < timezone.now():
                return False
            
            return True
        except Exception as e:
            logger.exception(f"Error checking IG session: {str(e)}")
            return False
    
    def handle_connection_status_change(self, status):
        """Handle connection status changes"""
        logger.info(f"Connection status changed for user {self.user.username}: {status}")
        
        # Update connection status
        previous_status = self.connection_status
        self.connection_status = status
        
        # Send connection status to WebSocket
        async_to_sync(self.send_connection_status)(status)
        
        # Create notifications based on status changes
        if status == "connected" and previous_status != "connected":
            # Connection established
            connection_type = "mock" if self.offline_mode else "real"
            message = f"Connected to {connection_type} streaming server"
            
            # Create success notification
            async_to_sync(sync_to_async(create_success_notification))(
                user=self.user,
                success_message=message,
                data={
                    "mode": "offline" if self.offline_mode else "online",
                    "connection_type": "streaming",
                    "previous_status": previous_status
                }
            )
        elif status == "disconnected" and previous_status == "connected":
            # Connection lost
            connection_type = "mock" if self.offline_mode else "real"
            message = f"Disconnected from {connection_type} streaming server"
            
            # Create error notification only if this wasn't a planned disconnection
            if not getattr(self, '_planned_disconnect', False):
                async_to_sync(sync_to_async(create_error_notification))(
                    user=self.user,
                    error_message=message,
                    data={
                        "error_code": "CONNECTION_LOST",
                        "errorType": "connection",
                        "canRetry": True,
                        "canSwitchToOfflineMode": not self.offline_mode
                    }
                )
    
    def handle_streaming_error(self, error_code, error_message):
        """Handle streaming errors"""
        logger.error(f"Streaming error: {error_code} - {error_message}")
        
        # Send error to WebSocket with proper error code and type
        async_to_sync(self.send_error)(
            message=error_message,
            error_code=error_code,
            error_type="connection"
        )
    
    def handle_price_update(self, update_data):
        """Handle price updates"""
        # Send update to WebSocket
        async_to_sync(self.send_price_update)(update_data)
    
    def handle_chart_update(self, update_data):
        """Handle chart updates"""
        # Send update to WebSocket
        async_to_sync(self.send_chart_update)(update_data)
    
    def handle_account_update(self, update_data):
        """Handle account updates"""
        # Send update to WebSocket
        async_to_sync(self.send_account_update)(update_data)
    
    def handle_trade_update(self, update_data):
        """Handle trade updates"""
        # Send update to WebSocket
        async_to_sync(self.send_trade_update)(update_data)
    
    async def subscribe_to_markets(self, markets):
        """Subscribe to market price updates"""
        if not self.streaming_client or not markets:
            return
        
        try:
            # Subscribe to prices
            self.price_subscription_id = await sync_to_async(self.streaming_client.subscribe_prices)(
                epics=list(markets),
                callback=self.handle_price_update
            )
            
            if not self.price_subscription_id:
                logger.error(f"Failed to subscribe to markets: {markets}")
                await self.send_error(
                    message="Failed to subscribe to markets",
                    error_code="SUBSCRIPTION_FAILED",
                    error_type="subscription"
                )
            else:
                logger.info(f"Subscribed to {len(markets)} markets")
        except Exception as e:
            logger.exception(f"Error subscribing to markets: {str(e)}")
            await self.send_error(
                message=f"Error subscribing to markets: {str(e)}",
                error_code="SUBSCRIPTION_ERROR",
                error_type="subscription"
            )
    
    async def unsubscribe_from_markets(self, markets):
        """Unsubscribe from market price updates"""
        if not self.streaming_client or not markets:
            return
        
        try:
            # For now, we need to unsubscribe from all and resubscribe to remaining
            if self.price_subscription_id:
                await sync_to_async(self.streaming_client.unsubscribe)(self.price_subscription_id)
                self.price_subscription_id = None
            
            # Resubscribe to remaining markets
            remaining_markets = self.subscribed_markets - set(markets)
            if remaining_markets:
                await self.subscribe_to_markets(remaining_markets)
        except Exception as e:
            logger.exception(f"Error unsubscribing from markets: {str(e)}")
    
    async def subscribe_to_chart(self, epic):
        """Subscribe to chart data for a market"""
        if not self.streaming_client or not epic:
            return
        
        try:
            # Subscribe to chart ticks
            subscription_id = await sync_to_async(self.streaming_client.subscribe_chart_ticks)(
                epic=epic,
                callback=self.handle_chart_update
            )
            
            if not subscription_id:
                logger.error(f"Failed to subscribe to chart for {epic}")
                await self.send_error(
                    message=f"Failed to subscribe to chart for {epic}",
                    error_code="CHART_SUBSCRIPTION_FAILED",
                    error_type="subscription"
                )
            else:
                logger.info(f"Subscribed to chart for {epic}")
                self.chart_subscriptions[epic] = subscription_id
        except Exception as e:
            logger.exception(f"Error subscribing to chart: {str(e)}")
            await self.send_error(
                message=f"Error subscribing to chart: {str(e)}",
                error_code="CHART_SUBSCRIPTION_ERROR",
                error_type="subscription"
            )
    
    async def unsubscribe_from_chart(self, epic):
        """Unsubscribe from chart data for a market"""
        if not self.streaming_client or not epic:
            return
        
        try:
            # Unsubscribe from chart ticks
            if epic in self.chart_subscriptions:
                subscription_id = self.chart_subscriptions[epic]
                await sync_to_async(self.streaming_client.unsubscribe)(subscription_id)
                del self.chart_subscriptions[epic]
                logger.info(f"Unsubscribed from chart for {epic}")
        except Exception as e:
            logger.exception(f"Error unsubscribing from chart: {str(e)}")
    
    async def subscribe_to_account(self):
        """Subscribe to account balance updates"""
        if not self.streaming_client:
            return
        
        try:
            # Get account ID
            account_id = await sync_to_async(lambda: getattr(self.user.profile, 'ig_account_id', None))()
            
            if not account_id:
                logger.warning("No account ID available for account subscription")
                return
            
            # Subscribe to account balance
            self.account_subscription_id = await sync_to_async(self.streaming_client.subscribe_account_balance)(
                account_id=account_id,
                callback=self.handle_account_update
            )
            
            if not self.account_subscription_id:
                logger.error(f"Failed to subscribe to account balance for {account_id}")
                await self.send_error(
                    message=f"Failed to subscribe to account balance for {account_id}",
                    error_code="ACCOUNT_SUBSCRIPTION_FAILED",
                    error_type="subscription"
                )
            else:
                logger.info(f"Subscribed to account balance for {account_id}")
        except Exception as e:
            logger.exception(f"Error subscribing to account balance: {str(e)}")
            await self.send_error(
                message=f"Error subscribing to account balance: {str(e)}",
                error_code="ACCOUNT_SUBSCRIPTION_ERROR",
                error_type="subscription"
            )
    
    async def subscribe_to_trades(self):
        """Subscribe to trade updates"""
        if not self.streaming_client:
            return
        
        try:
            # Get account ID
            account_id = await sync_to_async(lambda: getattr(self.user.profile, 'ig_account_id', None))()
            
            if not account_id:
                logger.warning("No account ID available for trade subscription")
                return
            
            # Subscribe to trade updates
            self.trade_subscription_id = await sync_to_async(self.streaming_client.subscribe_trade_updates)(
                account_id=account_id,
                callback=self.handle_trade_update
            )
            
            if not self.trade_subscription_id:
                logger.error(f"Failed to subscribe to trade updates for {account_id}")
                await self.send_error(
                    message=f"Failed to subscribe to trade updates for {account_id}",
                    error_code="TRADE_SUBSCRIPTION_FAILED",
                    error_type="subscription"
                )
            else:
                logger.info(f"Subscribed to trade updates for {account_id}")
        except Exception as e:
            logger.exception(f"Error subscribing to trade updates: {str(e)}")
            await self.send_error(
                message=f"Error subscribing to trade updates: {str(e)}",
                error_code="TRADE_SUBSCRIPTION_ERROR",
                error_type="subscription"
            )
    
    async def unsubscribe_all(self):
        """Unsubscribe from all subscriptions"""
        if not self.streaming_client:
            return
        
        try:
            # Unsubscribe from prices
            if self.price_subscription_id:
                await sync_to_async(self.streaming_client.unsubscribe)(self.price_subscription_id)
                self.price_subscription_id = None
            
            # Unsubscribe from charts
            for epic, subscription_id in self.chart_subscriptions.items():
                await sync_to_async(self.streaming_client.unsubscribe)(subscription_id)
            self.chart_subscriptions.clear()
            
            # Unsubscribe from account
            if self.account_subscription_id:
                await sync_to_async(self.streaming_client.unsubscribe)(self.account_subscription_id)
                self.account_subscription_id = None
            
            # Unsubscribe from trades
            if self.trade_subscription_id:
                await sync_to_async(self.streaming_client.unsubscribe)(self.trade_subscription_id)
                self.trade_subscription_id = None
            
            logger.info("Unsubscribed from all subscriptions")
        except Exception as e:
            logger.exception(f"Error unsubscribing from all: {str(e)}")
    
    async def send_connection_status(self, status):
        """Send connection status to WebSocket"""
        await self.send_json({
            'type': 'connection_status',
            'status': status,
            'timestamp': timezone.now().isoformat(),
            'offline_mode': self.offline_mode
        })
    
    async def send_error(self, message, error_code=None, error_type="connection"):
        """
        Send error message to WebSocket with options for retry and offline mode
        
        Args:
            message: Error message
            error_code: Error code (optional)
            error_type: Error type (default: connection)
                - "connection": Connection-related errors
                - "subscription": Subscription-related errors
                - "authentication": Authentication-related errors
                - "data": Data-related errors
        """
        # Log the error with appropriate level based on type
        if error_type == "connection":
            logger.error(f"Connection error: {error_code} - {message}")
        elif error_type == "subscription":
            logger.error(f"Subscription error: {error_code} - {message}")
        elif error_type == "authentication":
            logger.error(f"Authentication error: {error_code} - {message}")
        else:
            logger.error(f"Stream error ({error_type}): {error_code} - {message}")
        
        # Determine if retry and offline mode options should be available based on error type
        can_retry = True
        can_switch_to_offline_mode = not self.offline_mode
        
        # For certain error types or codes, we might want to adjust the options
        if error_type == "authentication":
            # Authentication errors typically require user action, not just retry
            can_retry = False
        elif error_code in ["SESSION_EXPIRED", "SESSION_TIMEOUT"]:
            # Session errors require re-authentication
            can_retry = False
        elif error_code in ["MOCK_CLIENT_ERROR", "MOCK_RECONNECTION_FAILED"]:
            # If mock client has issues, offline mode won't help
            can_switch_to_offline_mode = False
        
        # Send detailed error information to WebSocket
        await self.send_json({
            'type': 'stream_error',
            'error': message,
            'error_code': error_code,
            'errorType': error_type,
            'canRetry': can_retry,
            'canSwitchToOfflineMode': can_switch_to_offline_mode,
            'timestamp': timezone.now().isoformat(),
            'offline_mode': self.offline_mode
        })
        
        # Create a notification for the user with the same error details
        await sync_to_async(create_error_notification)(
            user=self.user,
            error_message=message,
            data={
                "error_code": error_code,
                "errorType": error_type,
                "canRetry": can_retry,
                "canSwitchToOfflineMode": can_switch_to_offline_mode
            }
        )
    
    async def send_price_update(self, update_data):
        """Send price update to WebSocket"""
        await self.send_json({
            'type': 'price_update',
            'data': update_data
        })
    
    async def send_chart_update(self, update_data):
        """Send chart update to WebSocket"""
        await self.send_json({
            'type': 'chart_update',
            'data': update_data
        })
    
    async def send_account_update(self, update_data):
        """Send account update to WebSocket"""
        await self.send_json({
            'type': 'account_update',
            'data': update_data
        })
    
    async def send_trade_update(self, update_data):
        """Send trade update to WebSocket"""
        await self.send_json({
            'type': 'trade_update',
            'data': update_data
        })
    
    async def send_json(self, data):
        """Send JSON data to WebSocket"""
        await self.send(text_data=json.dumps(data))
    
    async def attempt_reconnection(self, max_attempts=3, delay_seconds=5):
        """
        Attempt to reconnect to the streaming server
        
        Args:
            max_attempts: Maximum number of reconnection attempts
            delay_seconds: Delay between attempts in seconds
            
        Returns:
            bool: True if reconnection successful, False otherwise
        """
        logger.info(f"Attempting to reconnect to streaming server for user {self.user.username} (max_attempts={max_attempts}, delay={delay_seconds}s)")
        
        # Send initial reconnection status
        await self.send_json({
            'type': 'reconnection_status',
            'status': 'starting',
            'max_attempts': max_attempts,
            'delay_seconds': delay_seconds,
            'timestamp': timezone.now().isoformat()
        })
        
        # Try to reconnect multiple times
        for attempt in range(1, max_attempts + 1):
            try:
                logger.info(f"Reconnection attempt {attempt}/{max_attempts} for user {self.user.username}")
                
                # Update status
                await self.send_json({
                    'type': 'reconnection_status',
                    'status': 'in_progress',
                    'attempt': attempt,
                    'max_attempts': max_attempts,
                    'timestamp': timezone.now().isoformat()
                })
                
                # Clean up existing client if any
                if self.streaming_client:
                    try:
                        await self.unsubscribe_all()
                        await sync_to_async(self.disconnect_streaming_client)()
                    except Exception as e:
                        logger.warning(f"Error cleaning up existing client during reconnection: {str(e)}")
                    
                    self.streaming_client = None
                
                # Update connection status to connecting
                await self.send_connection_status("connecting")
                
                # Create a new streaming client
                try:
                    if self.offline_mode:
                        # Create mock client for offline mode
                        self.streaming_client = await sync_to_async(create_mock_streaming_client)(self.user)
                    else:
                        # Check if user has active IG session before attempting to create real client
                        if not await self.user_has_active_ig_session():
                            logger.warning(f"User {self.user.username} has no active IG session during reconnection attempt")
                            raise Exception("No active IG session. Please log in to IG API first.")
                        
                        # Create real client
                        self.streaming_client = await sync_to_async(get_streaming_client)(
                            user=self.user,
                            offline_mode=self.offline_mode
                        )
                except Exception as e:
                    logger.error(f"Failed to create streaming client during reconnection attempt {attempt}: {str(e)}")
                    raise Exception(f"Failed to create streaming client: {str(e)}")
                
                if not self.streaming_client:
                    raise Exception("Failed to create streaming client")
                
                # Update connection status
                self.handle_connection_status_change("connected")
                
                # Resubscribe to previous subscriptions
                if self.subscribed_markets:
                    await self.subscribe_to_markets(list(self.subscribed_markets))
                
                # Subscribe to account and trade updates if not in offline mode
                if not self.offline_mode:
                    await self.subscribe_to_account()
                    await self.subscribe_to_trades()
                
                # Success!
                await self.send_json({
                    'type': 'reconnection_status',
                    'status': 'success',
                    'attempt': attempt,
                    'max_attempts': max_attempts,
                    'mode': 'offline' if self.offline_mode else 'online',
                    'timestamp': timezone.now().isoformat()
                })
                
                # Create success notification
                await sync_to_async(create_success_notification)(
                    user=self.user,
                    success_message=f"Successfully reconnected to streaming server after {attempt} attempt(s)",
                    data={
                        "mode": "offline" if self.offline_mode else "online",
                        "connection_type": "streaming",
                        "reconnection_attempt": attempt
                    }
                )
                
                return True
                
            except Exception as e:
                logger.error(f"Reconnection attempt {attempt} failed for user {self.user.username}: {str(e)}")
                
                # Send update about failed attempt
                await self.send_json({
                    'type': 'reconnection_status',
                    'status': 'attempt_failed',
                    'attempt': attempt,
                    'max_attempts': max_attempts,
                    'error': str(e),
                    'timestamp': timezone.now().isoformat()
                })
                
                # Wait before next attempt
                if attempt < max_attempts:
                    await asyncio.sleep(delay_seconds)
        
        # All attempts failed
        await self.send_json({
            'type': 'reconnection_status',
            'status': 'failed',
            'max_attempts': max_attempts,
            'timestamp': timezone.now().isoformat()
        })
        
        # Create error notification
        await sync_to_async(create_error_notification)(
            user=self.user,
            error_message=f"Failed to reconnect to streaming server after {max_attempts} attempts",
            data={
                "error_code": "RECONNECTION_FAILED",
                "errorType": "connection",
                "canRetry": True,
                "canSwitchToOfflineMode": not self.offline_mode
            }
        )
        
        return False
