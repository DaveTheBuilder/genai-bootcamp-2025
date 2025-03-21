from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.utils.translation import gettext_lazy as _
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom token serializer that includes user data in the response
    """
    
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add user data to response
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'username': self.user.username,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'is_staff': self.user.is_staff,
            'is_verified': self.user.is_verified,
            'dark_mode': self.user.dark_mode,
            'notification_enabled': self.user.notification_enabled,
            'offline_mode': self.user.offline_mode,
            'use_demo_account': self.user.use_demo_account,
        }
        
        return data


class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration
    """
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password2', 'first_name', 'last_name']
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True}
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login
    """
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            # Try to authenticate with email
            user = authenticate(request=self.context.get('request'), username=email, password=password)
            
            # If authentication fails, try with username
            if not user:
                try:
                    user_obj = User.objects.get(email=email)
                    user = authenticate(request=self.context.get('request'), 
                                       username=user_obj.username, 
                                       password=password)
                except User.DoesNotExist:
                    user = None
            
            if not user:
                msg = _('Unable to log in with provided credentials.')
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = _('Must include "email" and "password".')
            raise serializers.ValidationError(msg, code='authorization')
        
        attrs['user'] = user
        return attrs


class IGLoginSerializer(serializers.Serializer):
    """
    Serializer for IG API login
    """
    identifier = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    api_key = serializers.CharField(required=True)
    demo = serializers.BooleanField(required=False, default=True)
    
    def validate(self, attrs):
        # Validation will be handled in the view
        return attrs
