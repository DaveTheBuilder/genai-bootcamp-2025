from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

User = get_user_model()


class Notification(models.Model):
    """
    Model for storing user notifications
    """
    NOTIFICATION_TYPES = (
        ('INFO', 'Information'),
        ('SUCCESS', 'Success'),
        ('WARNING', 'Warning'),
        ('ERROR', 'Error'),
        ('ALERT', 'Alert'),
        ('SYSTEM', 'System'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=100)
    message = models.TextField()
    notification_type = models.CharField(max_length=10, choices=NOTIFICATION_TYPES, default='INFO')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Optional link to related object (e.g., a position, order, market alert)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')
    
    # Additional data in JSON format
    data = models.JSONField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.notification_type} for {self.user.username}: {self.title}"


class NotificationPreference(models.Model):
    """
    Model for storing user notification preferences
    """
    CHANNEL_CHOICES = (
        ('EMAIL', 'Email'),
        ('PUSH', 'Push Notification'),
        ('SMS', 'SMS'),
        ('IN_APP', 'In-App Notification'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notification_preferences')
    notification_type = models.CharField(max_length=50)
    channel = models.CharField(max_length=10, choices=CHANNEL_CHOICES)
    is_enabled = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ('user', 'notification_type', 'channel')
    
    def __str__(self):
        return f"{self.user.username} - {self.notification_type} - {self.channel}"


class NotificationTemplate(models.Model):
    """
    Model for storing notification templates
    """
    name = models.CharField(max_length=100, unique=True)
    title_template = models.CharField(max_length=200)
    message_template = models.TextField()
    notification_type = models.CharField(max_length=10, choices=Notification.NOTIFICATION_TYPES, default='INFO')
    
    def __str__(self):
        return self.name
