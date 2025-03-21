import json
import asyncio
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import Notification

User = get_user_model()
logger = logging.getLogger(__name__)


class NotificationConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for streaming notifications
    """
    
    async def connect(self):
        """
        Connect to the WebSocket
        """
        self.user = self.scope['user']
        self.streaming_task = None
        
        # Check if user is authenticated
        if self.user.is_anonymous:
            await self.close(code=4001)
            return
        
        # Create a user-specific group
        self.notification_group_name = f'notifications_{self.user.id}'
        
        # Join the group
        await self.channel_layer.group_add(
            self.notification_group_name,
            self.channel_name
        )
        
        # Accept the connection
        await self.accept()
        logger.info(f"Notification WebSocket connection established for user {self.user.username}")
        
        # Start streaming notifications
        self.streaming_task = asyncio.create_task(self.stream_notifications())
    
    async def disconnect(self, close_code):
        """
        Disconnect from the WebSocket
        """
        # Leave the group
        if hasattr(self, 'notification_group_name'):
            await self.channel_layer.group_discard(
                self.notification_group_name,
                self.channel_name
            )
        
        # Cancel any running streaming tasks
        if self.streaming_task:
            self.streaming_task.cancel()
            try:
                await self.streaming_task
            except asyncio.CancelledError:
                pass
        
        logger.info(f"Notification WebSocket connection closed for user {self.user.username} with code {close_code}")
    
    async def receive(self, text_data):
        """
        Receive message from WebSocket
        """
        try:
            data = json.loads(text_data)
            action = data.get('action')
            
            if action == 'mark_read':
                notification_id = data.get('notification_id')
                if notification_id:
                    await self.mark_notification_read(notification_id)
                    await self.send(text_data=json.dumps({
                        'type': 'notification_marked_read',
                        'notification_id': notification_id
                    }))
                else:
                    await self.send(text_data=json.dumps({
                        'error': 'Missing notification_id'
                    }))
            
            elif action == 'mark_all_read':
                count = await self.mark_all_notifications_read()
                await self.send(text_data=json.dumps({
                    'type': 'all_notifications_marked_read',
                    'count': count
                }))
            
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
    
    async def stream_notifications(self):
        """
        Stream notifications to the client
        """
        try:
            # Send initial unread notifications
            unread_notifications = await self.get_unread_notifications()
            if unread_notifications:
                await self.send(text_data=json.dumps({
                    'type': 'initial_notifications',
                    'notifications': unread_notifications
                }))
            
            # Send unread count
            unread_count = await self.get_unread_count()
            await self.send(text_data=json.dumps({
                'type': 'unread_count',
                'count': unread_count
            }))
            
            # Keep the connection alive with periodic pings
            while True:
                await asyncio.sleep(30)  # Send a ping every 30 seconds
                await self.send(text_data=json.dumps({
                    'type': 'ping'
                }))
        
        except asyncio.CancelledError:
            # Task was cancelled, clean up
            logger.info(f"Notification streaming stopped for user {self.user.username}")
            raise
        except Exception as e:
            logger.exception(f"Error streaming notifications: {str(e)}")
            await self.send(text_data=json.dumps({
                'error': f'Error streaming notifications: {str(e)}',
                'errorType': 'connection',
                'canRetry': True,
                'canSwitchToOfflineMode': True
            }))
    
    async def notification_message(self, event):
        """
        Receive notification from group and send to WebSocket
        """
        # Send notification to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'new_notification',
            'notification': event['notification']
        }))
        
        # Update unread count
        unread_count = await self.get_unread_count()
        await self.send(text_data=json.dumps({
            'type': 'unread_count',
            'count': unread_count
        }))
    
    @database_sync_to_async
    def mark_notification_read(self, notification_id):
        """
        Mark a notification as read
        """
        try:
            notification = Notification.objects.get(id=notification_id, user=self.user)
            notification.is_read = True
            notification.save()
            return True
        except Notification.DoesNotExist:
            return False
    
    @database_sync_to_async
    def mark_all_notifications_read(self):
        """
        Mark all notifications as read
        """
        return Notification.objects.filter(user=self.user, is_read=False).update(is_read=True)
    
    @database_sync_to_async
    def get_unread_notifications(self):
        """
        Get unread notifications
        """
        notifications = Notification.objects.filter(user=self.user, is_read=False).order_by('-created_at')[:10]
        return [
            {
                'id': notification.id,
                'title': notification.title,
                'message': notification.message,
                'notification_type': notification.notification_type,
                'created_at': notification.created_at.isoformat(),
                'content_type': notification.content_type.model if notification.content_type else None,
                'object_id': notification.object_id,
                'data': notification.data
            }
            for notification in notifications
        ]
    
    @database_sync_to_async
    def get_unread_count(self):
        """
        Get unread notification count
        """
        return Notification.objects.filter(user=self.user, is_read=False).count()
