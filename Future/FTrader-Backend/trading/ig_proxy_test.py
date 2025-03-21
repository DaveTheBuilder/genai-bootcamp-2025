import os
import json
import logging
import requests
from django.conf import settings
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

logger = logging.getLogger(__name__)

# IG API credentials from environment variables
IG_API_KEY = settings.IG_API_KEY
IG_IDENTIFIER = settings.IG_IDENTIFIER
IG_PASSWORD = settings.IG_PASSWORD
IG_API_URL = settings.IG_API_URL

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])  # Allow any user to access this endpoint
def test_proxy_login(request):
    """
    Test proxy endpoint for IG API login without authentication
    """
    try:
        # Extract credentials from request or use defaults
        data = json.loads(request.body)
        identifier = data.get('identifier', IG_IDENTIFIER)
        password = data.get('password', IG_PASSWORD)
        
        # Make request to IG API
        response = requests.post(
            f"{IG_API_URL}/session",
            json={
                "identifier": identifier,
                "password": password,
            },
            headers={
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-IG-API-KEY': IG_API_KEY,
                'Version': '2',
            }
        )
        
        # Log response for debugging
        logger.info(f"IG API login response status: {response.status_code}")
        
        # Extract headers from response
        cst = response.headers.get('CST')
        security_token = response.headers.get('X-SECURITY-TOKEN')
        
        # Create Django response
        django_response = JsonResponse({
            'status': response.status_code,
            'data': response.json(),
        })
        
        # Add IG API headers to Django response
        if cst:
            django_response['CST'] = cst
        if security_token:
            django_response['X-SECURITY-TOKEN'] = security_token
        
        return django_response
    except Exception as e:
        logger.error(f"Error in IG API login proxy: {str(e)}")
        return JsonResponse({
            'status': 500,
            'error': str(e),
        }, status=500)

@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])  # Allow any user to access this endpoint
def test_proxy_streaming_connection_test(request):
    """
    Test endpoint for IG API streaming connection without authentication
    """
    try:
        # Extract headers from request or use defaults
        cst = request.headers.get('CST')
        security_token = request.headers.get('X-SECURITY-TOKEN')
        
        if not cst or not security_token:
            return JsonResponse({
                'status': 400,
                'error': 'CST and X-SECURITY-TOKEN headers are required',
            }, status=400)
        
        # Make request to IG API to test session
        response = requests.get(
            f"{IG_API_URL}/session",
            headers={
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-IG-API-KEY': IG_API_KEY,
                'CST': cst,
                'X-SECURITY-TOKEN': security_token,
            }
        )
        
        # Log response for debugging
        logger.info(f"IG API streaming connection test response status: {response.status_code}")
        
        # Check if we can get the lightstreamer endpoint
        if response.status_code == 200:
            data = response.json()
            if 'lightstreamerEndpoint' in data:
                return JsonResponse({
                    "success": True,
                    "message": "Successfully connected to IG API and retrieved streaming endpoint",
                    "lightstreamerEndpoint": data['lightstreamerEndpoint']
                })
            else:
                return JsonResponse({
                    "success": False,
                    "message": "Connected to IG API but could not retrieve streaming endpoint"
                }, status=500)
        else:
            return JsonResponse({
                "success": False,
                "message": f"Failed to connect to IG API: {response.status_code} - {response.text}"
            }, status=response.status_code)
    except Exception as e:
        logger.error(f"Error in IG API streaming connection test: {str(e)}")
        return JsonResponse({
            'success': False,
            'error': str(e),
            'message': f"Error connecting to IG API: {str(e)}",
        }, status=500)
