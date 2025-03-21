from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
import requests
import json
import logging

from .serializers import (
    CustomTokenObtainPairSerializer,
    RegisterSerializer,
    LoginSerializer,
    IGLoginSerializer
)

User = get_user_model()
logger = logging.getLogger(__name__)


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom token view that uses our serializer with user data
    """
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(APIView):
    """
    API endpoint for user registration
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    API endpoint for user login
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'is_staff': user.is_staff,
                    'is_verified': user.is_verified,
                    'dark_mode': user.dark_mode,
                    'notification_enabled': user.notification_enabled,
                    'offline_mode': user.offline_mode,
                    'use_demo_account': user.use_demo_account,
                }
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class IGLoginView(APIView):
    """
    API endpoint for IG API login
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = IGLoginSerializer(data=request.data)
        if serializer.is_valid():
            identifier = serializer.validated_data['identifier']
            password = serializer.validated_data['password']
            api_key = serializer.validated_data['api_key']
            demo = serializer.validated_data.get('demo', True)
            
            # Determine the IG API URL based on demo flag
            base_url = 'https://demo-api.ig.com/gateway/deal' if demo else 'https://api.ig.com/gateway/deal'
            
            # Prepare headers and data for IG API login
            headers = {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8',
                'X-IG-API-KEY': api_key,
                'Version': '2'
            }
            
            data = {
                'identifier': identifier,
                'password': password,
                'encryptedPassword': False
            }
            
            try:
                # Make the login request to IG API
                response = requests.post(f"{base_url}/session", headers=headers, data=json.dumps(data))
                
                if response.status_code == 200:
                    # Extract tokens and account info from IG response
                    ig_response = response.json()
                    cst = response.headers.get('CST')
                    x_security_token = response.headers.get('X-SECURITY-TOKEN')
                    account_id = ig_response.get('currentAccountId')
                    
                    # Update user's IG credentials
                    user = request.user
                    user.ig_api_key = api_key
                    user.ig_identifier = identifier
                    user.ig_password = password  # Note: In production, consider encrypting this
                    user.ig_account_id = account_id
                    user.ig_cst = cst
                    user.ig_security_token = x_security_token
                    user.ig_active_session = True
                    user.use_demo_account = demo
                    user.save()
                    
                    return Response({
                        'status': 'success',
                        'message': 'Successfully logged in to IG API',
                        'account_id': account_id,
                        'demo': demo
                    })
                else:
                    # Handle error response from IG API
                    error_message = response.json().get('errorCode', 'Unknown error')
                    logger.error(f"IG API login failed: {error_message}")
                    return Response({
                        'status': 'error',
                        'message': f'IG API login failed: {error_message}'
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            except Exception as e:
                logger.exception("Error connecting to IG API")
                return Response({
                    'status': 'error',
                    'message': f'Error connecting to IG API: {str(e)}'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class IGLogoutView(APIView):
    """
    API endpoint for IG API logout
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        user = request.user
        
        if not user.ig_active_session:
            return Response({
                'status': 'error',
                'message': 'No active IG session found'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Determine the IG API URL based on user's demo flag
        base_url = 'https://demo-api.ig.com/gateway/deal' if user.use_demo_account else 'https://api.ig.com/gateway/deal'
        
        # Prepare headers for IG API logout
        headers = {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; charset=UTF-8',
            'X-IG-API-KEY': user.ig_api_key,
            'CST': user.ig_cst,
            'X-SECURITY-TOKEN': user.ig_security_token,
            'Version': '1'
        }
        
        try:
            # Make the logout request to IG API
            response = requests.delete(f"{base_url}/session", headers=headers)
            
            # Update user's IG session status regardless of IG API response
            user.ig_active_session = False
            user.ig_cst = None
            user.ig_security_token = None
            user.save()
            
            if response.status_code in [200, 204]:
                return Response({
                    'status': 'success',
                    'message': 'Successfully logged out from IG API'
                })
            else:
                # Log the error but still consider the user logged out locally
                error_message = response.json().get('errorCode', 'Unknown error') if response.content else 'No response content'
                logger.warning(f"IG API logout returned non-success status: {response.status_code}, {error_message}")
                return Response({
                    'status': 'partial_success',
                    'message': 'Logged out locally, but IG API returned an error'
                })
        
        except Exception as e:
            logger.exception("Error connecting to IG API for logout")
            # Still consider the user logged out locally
            return Response({
                'status': 'partial_success',
                'message': f'Logged out locally, but error connecting to IG API: {str(e)}'
            })
