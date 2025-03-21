from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import UserProfile
from .serializers import (
    UserSerializer, 
    UserProfileSerializer, 
    UserPreferencesSerializer,
    IGCredentialsSerializer
)
from .permissions import IsOwnerOrAdmin

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint for users to view or edit their profile
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return User.objects.all()
        return User.objects.filter(id=user.id)
    
    def get_object(self):
        lookup_field_value = self.kwargs.get(self.lookup_field, None)
        if lookup_field_value == 'me':
            return self.request.user
        return super().get_object()
    
    @action(detail=False, methods=['get', 'put', 'patch'])
    def me(self, request):
        user = request.user
        if request.method == 'GET':
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        
        serializer = self.get_serializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get', 'put', 'patch'])
    def preferences(self, request):
        user = request.user
        if request.method == 'GET':
            serializer = UserPreferencesSerializer(user)
            return Response(serializer.data)
        
        serializer = UserPreferencesSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get', 'put'])
    def ig_credentials(self, request):
        user = request.user
        if request.method == 'GET':
            # Only return whether credentials are set, not the actual values
            data = {
                'has_credentials': bool(user.ig_api_key and user.ig_identifier and user.ig_password),
                'use_demo_account': user.use_demo_account
            }
            return Response(data)
        
        serializer = IGCredentialsSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'IG credentials updated'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
