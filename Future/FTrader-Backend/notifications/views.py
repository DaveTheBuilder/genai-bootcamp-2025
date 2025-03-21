from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
import logging

from .models import Notification, NotificationPreference, NotificationTemplate
from .serializers import (
    NotificationSerializer,
    NotificationPreferenceSerializer,
    NotificationTemplateSerializer,
    BulkNotificationPreferenceSerializer,
    MarkNotificationsReadSerializer
)
from users.permissions import IsOwnerOrAdmin

logger = logging.getLogger(__name__)


class NotificationViewSet(viewsets.ModelViewSet):
    """
    API endpoint for notifications
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at', 'notification_type', 'is_read']
    ordering = ['-created_at']
    
    def get_queryset(self):
        # Filter by is_read if provided
        is_read = self.request.query_params.get('is_read')
        if is_read is not None:
            is_read = is_read.lower() == 'true'
            return Notification.objects.filter(user=self.request.user, is_read=is_read)
        
        # Filter by notification_type if provided
        notification_type = self.request.query_params.get('notification_type')
        if notification_type:
            return Notification.objects.filter(user=self.request.user, notification_type=notification_type)
        
        return Notification.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def mark_read(self, request):
        """
        Mark notifications as read
        """
        serializer = MarkNotificationsReadSerializer(data=request.data)
        if serializer.is_valid():
            mark_all = serializer.validated_data.get('mark_all', False)
            notification_ids = serializer.validated_data.get('notification_ids', [])
            
            if mark_all:
                # Mark all notifications as read
                count = Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
                return Response({'message': f'Marked {count} notifications as read'})
            elif notification_ids:
                # Mark specific notifications as read
                count = Notification.objects.filter(
                    user=request.user,
                    id__in=notification_ids,
                    is_read=False
                ).update(is_read=True)
                return Response({'message': f'Marked {count} notifications as read'})
            else:
                return Response(
                    {'error': 'Either mark_all must be true or notification_ids must be provided'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """
        Get the count of unread notifications
        """
        count = Notification.objects.filter(user=request.user, is_read=False).count()
        return Response({'unread_count': count})


class NotificationPreferenceViewSet(viewsets.ModelViewSet):
    """
    API endpoint for notification preferences
    """
    serializer_class = NotificationPreferenceSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    
    def get_queryset(self):
        return NotificationPreference.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def bulk_update(self, request):
        """
        Bulk update notification preferences
        """
        serializer = BulkNotificationPreferenceSerializer(data=request.data)
        if serializer.is_valid():
            preferences = serializer.validated_data['preferences']
            updated_count = 0
            
            for pref in preferences:
                notification_type = pref['notification_type']
                channel = pref['channel']
                is_enabled = pref['is_enabled']
                
                # Update or create the preference
                obj, created = NotificationPreference.objects.update_or_create(
                    user=request.user,
                    notification_type=notification_type,
                    channel=channel,
                    defaults={'is_enabled': is_enabled}
                )
                
                updated_count += 1
            
            return Response({'message': f'Updated {updated_count} notification preferences'})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NotificationTemplateViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for notification templates (read-only for regular users)
    """
    queryset = NotificationTemplate.objects.all()
    serializer_class = NotificationTemplateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        """
        Only allow admin users to create, update, or delete templates
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return super().get_permissions()
