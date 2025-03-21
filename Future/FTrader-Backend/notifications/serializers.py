from rest_framework import serializers
from .models import Notification, NotificationPreference, NotificationTemplate


class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer for Notification model
    """
    content_type_name = serializers.ReadOnlyField(source='content_type.model')
    
    class Meta:
        model = Notification
        fields = ['id', 'user', 'title', 'message', 'notification_type', 
                 'is_read', 'created_at', 'content_type_name', 'object_id', 'data']
        read_only_fields = ['user', 'created_at']


class NotificationPreferenceSerializer(serializers.ModelSerializer):
    """
    Serializer for NotificationPreference model
    """
    class Meta:
        model = NotificationPreference
        fields = ['id', 'user', 'notification_type', 'channel', 'is_enabled']
        read_only_fields = ['user']


class NotificationTemplateSerializer(serializers.ModelSerializer):
    """
    Serializer for NotificationTemplate model
    """
    class Meta:
        model = NotificationTemplate
        fields = ['id', 'name', 'title_template', 'message_template', 'notification_type']


class BulkNotificationPreferenceSerializer(serializers.Serializer):
    """
    Serializer for bulk updating notification preferences
    """
    preferences = serializers.ListField(
        child=serializers.DictField(
            child=serializers.BooleanField(),
            allow_empty=False
        ),
        allow_empty=False
    )
    
    def validate_preferences(self, value):
        """
        Validate the preferences format
        """
        for pref in value:
            if not all(key in pref for key in ['notification_type', 'channel', 'is_enabled']):
                raise serializers.ValidationError(
                    "Each preference must contain 'notification_type', 'channel', and 'is_enabled'"
                )
        return value


class MarkNotificationsReadSerializer(serializers.Serializer):
    """
    Serializer for marking notifications as read
    """
    notification_ids = serializers.ListField(
        child=serializers.IntegerField(),
        allow_empty=True
    )
    mark_all = serializers.BooleanField(default=False)
