import json
import asyncio
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import Position, Order

User = get_user_model()
logger = logging.getLogger(__name__)


class TradingConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for streaming trading data
    """
    
    async def connect(self):
        """
        Connect to the WebSocket
        """
        self.user = self.scope['user']
        self.streaming_task = None
        self.streaming_positions = False
        self.streaming_orders = False
        
        # Check if user is authenticated
        if self.user.is_anonymous:
            await self.close(code=4001)
            return
        
        # Accept the connection
        await self.accept()
        logger.info(f"Trading WebSocket connection established for user {self.user.username}")
    
    async def disconnect(self, close_code):
        """
        Disconnect from the WebSocket
        """
        # Cancel any running streaming tasks
        if self.streaming_task:
            self.streaming_task.cancel()
            try:
                await self.streaming_task
            except asyncio.CancelledError:
                pass
        
        logger.info(f"Trading WebSocket connection closed for user {self.user.username} with code {close_code}")
    
    async def receive(self, text_data):
        """
        Receive message from WebSocket
        """
        try:
            data = json.loads(text_data)
            action = data.get('action')
            
            if action == 'subscribe_positions':
                await self.handle_subscribe_positions()
            
            elif action == 'subscribe_orders':
                await self.handle_subscribe_orders()
            
            elif action == 'subscribe_all':
                await self.handle_subscribe_all()
            
            elif action == 'unsubscribe_positions':
                await self.handle_unsubscribe_positions()
            
            elif action == 'unsubscribe_orders':
                await self.handle_unsubscribe_orders()
            
            elif action == 'unsubscribe_all':
                await self.handle_unsubscribe_all()
            
            else:
                await self.send(text_data=json.dumps({
                    'error': f'Unknown action: {action}'
                }))
        
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'error': 'Invalid JSON'
            }))
        except Exception as e:
            logger.exception(f"Error processing WebSocket message: {str(e)}")
            await self.send(text_data=json.dumps({
                'error': f'Error processing message: {str(e)}'
            }))
    
    async def handle_subscribe_positions(self):
        """
        Subscribe to position updates
        """
        self.streaming_positions = True
        
        await self.send(text_data=json.dumps({
            'type': 'positions_subscribed'
        }))
        
        # Start streaming if not already streaming
        if not self.streaming_task or self.streaming_task.done():
            self.streaming_task = asyncio.create_task(self.stream_trading_data())
    
    async def handle_subscribe_orders(self):
        """
        Subscribe to order updates
        """
        self.streaming_orders = True
        
        await self.send(text_data=json.dumps({
            'type': 'orders_subscribed'
        }))
        
        # Start streaming if not already streaming
        if not self.streaming_task or self.streaming_task.done():
            self.streaming_task = asyncio.create_task(self.stream_trading_data())
    
    async def handle_subscribe_all(self):
        """
        Subscribe to all trading updates
        """
        self.streaming_positions = True
        self.streaming_orders = True
        
        await self.send(text_data=json.dumps({
            'type': 'all_subscribed'
        }))
        
        # Start streaming if not already streaming
        if not self.streaming_task or self.streaming_task.done():
            self.streaming_task = asyncio.create_task(self.stream_trading_data())
    
    async def handle_unsubscribe_positions(self):
        """
        Unsubscribe from position updates
        """
        self.streaming_positions = False
        
        await self.send(text_data=json.dumps({
            'type': 'positions_unsubscribed'
        }))
        
        # Stop streaming if nothing is being streamed
        if not self.streaming_positions and not self.streaming_orders and self.streaming_task:
            self.streaming_task.cancel()
            try:
                await self.streaming_task
            except asyncio.CancelledError:
                pass
            self.streaming_task = None
    
    async def handle_unsubscribe_orders(self):
        """
        Unsubscribe from order updates
        """
        self.streaming_orders = False
        
        await self.send(text_data=json.dumps({
            'type': 'orders_unsubscribed'
        }))
        
        # Stop streaming if nothing is being streamed
        if not self.streaming_positions and not self.streaming_orders and self.streaming_task:
            self.streaming_task.cancel()
            try:
                await self.streaming_task
            except asyncio.CancelledError:
                pass
            self.streaming_task = None
    
    async def handle_unsubscribe_all(self):
        """
        Unsubscribe from all trading updates
        """
        self.streaming_positions = False
        self.streaming_orders = False
        
        await self.send(text_data=json.dumps({
            'type': 'all_unsubscribed'
        }))
        
        # Stop streaming
        if self.streaming_task:
            self.streaming_task.cancel()
            try:
                await self.streaming_task
            except asyncio.CancelledError:
                pass
            self.streaming_task = None
    
    async def stream_trading_data(self):
        """
        Stream trading data
        """
        try:
            # Check if user has active IG session
            if not await self.user_has_active_ig_session():
                await self.send(text_data=json.dumps({
                    'error': 'No active IG session. Please log in to IG API first.',
                    'errorType': 'connection',
                    'canRetry': true,
                    'canSwitchToOfflineMode': true
                }))
                return
            
            while self.streaming_positions or self.streaming_orders:
                data_to_send = {}
                
                # Get position data if subscribed
                if self.streaming_positions:
                    positions = await self.get_positions()
                    data_to_send['positions'] = positions
                
                # Get order data if subscribed
                if self.streaming_orders:
                    orders = await self.get_orders()
                    data_to_send['orders'] = orders
                
                if data_to_send:
                    # Send the data
                    await self.send(text_data=json.dumps({
                        'type': 'trading_data',
                        **data_to_send
                    }))
                
                # Wait before getting updates again
                await asyncio.sleep(1)  # Adjust as needed
        
        except asyncio.CancelledError:
            # Task was cancelled, clean up
            logger.info(f"Trading data streaming stopped for user {self.user.username}")
            raise
        except Exception as e:
            logger.exception(f"Error streaming trading data: {str(e)}")
            await self.send(text_data=json.dumps({
                'error': f'Error streaming trading data: {str(e)}',
                'errorType': 'connection',
                'canRetry': true,
                'canSwitchToOfflineMode': true
            }))
    
    @database_sync_to_async
    def get_positions(self):
        """
        Get positions for the user
        """
        positions = Position.objects.filter(user=self.user, status='OPEN')
        return [
            {
                'id': position.id,
                'deal_id': position.deal_id,
                'market_name': position.market.name,
                'epic': position.market.epic,
                'direction': position.direction,
                'size': float(position.size),
                'open_level': float(position.open_level),
                'current_level': float(position.market.bid if position.direction == 'BUY' else position.market.offer),
                'profit_loss': self.calculate_position_pl(position),
                'limit_level': float(position.limit_level) if position.limit_level else None,
                'stop_level': float(position.stop_level) if position.stop_level else None,
                'created_at': position.created_at.isoformat(),
            }
            for position in positions
        ]
    
    @database_sync_to_async
    def get_orders(self):
        """
        Get orders for the user
        """
        orders = Order.objects.filter(user=self.user, status='PENDING')
        return [
            {
                'id': order.id,
                'deal_id': order.deal_id,
                'market_name': order.market.name,
                'epic': order.market.epic,
                'order_type': order.order_type,
                'direction': order.direction,
                'size': float(order.size),
                'level': float(order.level),
                'current_level': float(order.market.bid if order.direction == 'SELL' else order.market.offer),
                'limit_distance': float(order.limit_distance) if order.limit_distance else None,
                'stop_distance': float(order.stop_distance) if order.stop_distance else None,
                'created_at': order.created_at.isoformat(),
                'good_till_date': order.good_till_date.isoformat() if order.good_till_date else None,
            }
            for order in orders
        ]
    
    def calculate_position_pl(self, position):
        """
        Calculate profit/loss for a position
        """
        if position.direction == 'BUY':
            current_level = position.market.bid
            return float((current_level - position.open_level) * position.size)
        else:
            current_level = position.market.offer
            return float((position.open_level - current_level) * position.size)
    
    @database_sync_to_async
    def user_has_active_ig_session(self):
        """
        Check if the user has an active IG session
        """
        # Refresh user from database
        user = User.objects.get(id=self.user.id)
        return user.ig_active_session
