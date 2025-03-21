from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """
    Custom User model extending Django's AbstractUser.
    """
    email = models.EmailField(_('email address'), unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # IG API related fields
    ig_api_key = models.CharField(max_length=255, blank=True, null=True)
    ig_identifier = models.CharField(max_length=255, blank=True, null=True)
    ig_password = models.CharField(max_length=255, blank=True, null=True)
    ig_account_id = models.CharField(max_length=255, blank=True, null=True)
    ig_cst = models.CharField(max_length=255, blank=True, null=True)
    ig_security_token = models.CharField(max_length=255, blank=True, null=True)
    ig_active_session = models.BooleanField(default=False)
    
    # User preferences
    use_demo_account = models.BooleanField(default=True)
    dark_mode = models.BooleanField(default=False)
    notification_enabled = models.BooleanField(default=True)
    offline_mode = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
    
    def __str__(self):
        return self.email
    
    def save(self, *args, **kwargs):
        # Ensure username is set if not provided
        if not self.username:
            self.username = self.email
        super().save(*args, **kwargs)


class UserProfile(models.Model):
    """
    Extended profile information for users.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    
    def __str__(self):
        return f"{self.user.email}'s profile"
