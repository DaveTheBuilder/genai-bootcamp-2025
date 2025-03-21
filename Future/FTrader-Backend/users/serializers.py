from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserProfile

User = get_user_model()


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['bio', 'profile_picture', 'address', 'city', 'country', 'postal_code']


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(required=False)
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 'phone_number',
            'is_verified', 'date_joined', 'last_login', 'profile',
            'dark_mode', 'notification_enabled', 'offline_mode', 'use_demo_account'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login', 'is_verified']
    
    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)
        
        # Update User instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update or create UserProfile
        if profile_data:
            profile, created = UserProfile.objects.get_or_create(user=instance)
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()
        
        return instance


class UserPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['dark_mode', 'notification_enabled', 'offline_mode', 'use_demo_account']


class IGCredentialsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['ig_api_key', 'ig_identifier', 'ig_password', 'use_demo_account']
        extra_kwargs = {
            'ig_api_key': {'write_only': True},
            'ig_identifier': {'write_only': True},
            'ig_password': {'write_only': True},
        }
