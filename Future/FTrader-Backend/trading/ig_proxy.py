import json
import logging
import requests
from django.conf import settings
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

logger = logging.getLogger(__name__)

# IG API endpoints
IG_BASE_URL = "https://demo-api.ig.com/gateway/deal"

# Headers for IG API requests
DEFAULT_HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-IG-API-KEY": getattr(settings, "IG_API_KEY", "YOUR_IG_API_KEY"),
}

@csrf_exempt
@api_view(['POST'])
# Temporarily disable authentication for testing
# @permission_classes([IsAuthenticated])
def proxy_login(request):
    """
    Proxy endpoint for IG API login
    """
    try:
        data = json.loads(request.body)
        username = data.get('identifier')
        password = data.get('password')
        
        if not username or not password:
            return JsonResponse({"error": "Username and password are required"}, status=400)
        
        # Prepare headers for IG API
        headers = DEFAULT_HEADERS.copy()
        headers["Version"] = "2"
        
        # Make request to IG API
        response = requests.post(
            f"{IG_BASE_URL}/session",
            json={"identifier": username, "password": password},
            headers=headers,
            timeout=15
        )
        
        # Get response data
        response_data = response.json()
        
        # Create response with appropriate headers
        proxy_response = JsonResponse(response_data, status=response.status_code)
        
        # Forward important headers from IG API
        if 'CST' in response.headers:
            proxy_response['CST'] = response.headers['CST']
        
        if 'X-SECURITY-TOKEN' in response.headers:
            proxy_response['X-SECURITY-TOKEN'] = response.headers['X-SECURITY-TOKEN']
        
        return proxy_response
    
    except requests.RequestException as e:
        logger.error(f"Error connecting to IG API: {str(e)}")
        return JsonResponse({"error": f"Error connecting to IG API: {str(e)}"}, status=500)
    
    except Exception as e:
        logger.error(f"Unexpected error in proxy_login: {str(e)}")
        return JsonResponse({"error": f"Unexpected error: {str(e)}"}, status=500)

@csrf_exempt
@api_view(['GET'])
# Temporarily disable authentication for testing
# @permission_classes([IsAuthenticated])
def proxy_accounts(request):
    """
    Proxy endpoint for IG API accounts
    """
    try:
        # Get authentication tokens from request headers
        cst = request.headers.get('CST')
        security_token = request.headers.get('X-SECURITY-TOKEN')
        
        if not cst or not security_token:
            return JsonResponse({"error": "Authentication headers are required"}, status=401)
        
        # Prepare headers for IG API
        headers = DEFAULT_HEADERS.copy()
        headers["CST"] = cst
        headers["X-SECURITY-TOKEN"] = security_token
        
        # Make request to IG API
        response = requests.get(
            f"{IG_BASE_URL}/accounts",
            headers=headers,
            timeout=15
        )
        
        # Return response
        return JsonResponse(response.json(), status=response.status_code)
    
    except requests.RequestException as e:
        logger.error(f"Error connecting to IG API: {str(e)}")
        return JsonResponse({"error": f"Error connecting to IG API: {str(e)}"}, status=500)
    
    except Exception as e:
        logger.error(f"Unexpected error in proxy_accounts: {str(e)}")
        return JsonResponse({"error": f"Unexpected error: {str(e)}"}, status=500)

@csrf_exempt
@api_view(['GET'])
# Temporarily disable authentication for testing
# @permission_classes([IsAuthenticated])
def proxy_markets(request, epic):
    """
    Proxy endpoint for IG API markets
    """
    try:
        # Get authentication tokens from request headers
        cst = request.headers.get('CST')
        security_token = request.headers.get('X-SECURITY-TOKEN')
        
        if not cst or not security_token:
            return JsonResponse({"error": "Authentication headers are required"}, status=401)
        
        # Prepare headers for IG API
        headers = DEFAULT_HEADERS.copy()
        headers["CST"] = cst
        headers["X-SECURITY-TOKEN"] = security_token
        headers["Version"] = "3"
        
        # Make request to IG API
        response = requests.get(
            f"{IG_BASE_URL}/markets/{epic}",
            headers=headers,
            timeout=15
        )
        
        # Return response
        return JsonResponse(response.json(), status=response.status_code)
    
    except requests.RequestException as e:
        logger.error(f"Error connecting to IG API: {str(e)}")
        return JsonResponse({"error": f"Error connecting to IG API: {str(e)}"}, status=500)
    
    except Exception as e:
        logger.error(f"Unexpected error in proxy_markets: {str(e)}")
        return JsonResponse({"error": f"Unexpected error: {str(e)}"}, status=500)

@csrf_exempt
@api_view(['GET'])
# Temporarily disable authentication for testing
# @permission_classes([IsAuthenticated])
def proxy_prices(request, epic):
    """
    Proxy endpoint for IG API prices
    """
    try:
        # Get authentication tokens from request headers
        cst = request.headers.get('CST')
        security_token = request.headers.get('X-SECURITY-TOKEN')
        
        if not cst or not security_token:
            return JsonResponse({"error": "Authentication headers are required"}, status=401)
        
        # Get query parameters
        resolution = request.GET.get('resolution', 'MINUTE')
        num_points = request.GET.get('max', '10')
        
        # Prepare headers for IG API
        headers = DEFAULT_HEADERS.copy()
        headers["CST"] = cst
        headers["X-SECURITY-TOKEN"] = security_token
        headers["Version"] = "3"
        
        # Make request to IG API
        response = requests.get(
            f"{IG_BASE_URL}/prices/{epic}",
            params={"resolution": resolution, "max": num_points},
            headers=headers,
            timeout=15
        )
        
        # Return response
        return JsonResponse(response.json(), status=response.status_code)
    
    except requests.RequestException as e:
        logger.error(f"Error connecting to IG API: {str(e)}")
        return JsonResponse({"error": f"Error connecting to IG API: {str(e)}"}, status=500)
    
    except Exception as e:
        logger.error(f"Unexpected error in proxy_prices: {str(e)}")
        return JsonResponse({"error": f"Unexpected error: {str(e)}"}, status=500)

@csrf_exempt
@api_view(['GET'])
# Temporarily disable authentication for testing
# @permission_classes([IsAuthenticated])
def proxy_streaming_connection_test(request):
    """
    Test endpoint for IG API streaming connection
    """
    try:
        # Get authentication tokens from request headers
        cst = request.headers.get('CST')
        security_token = request.headers.get('X-SECURITY-TOKEN')
        
        if not cst or not security_token:
            return JsonResponse({"error": "Authentication headers are required"}, status=401)
        
        # Prepare headers for IG API
        headers = DEFAULT_HEADERS.copy()
        headers["CST"] = cst
        headers["X-SECURITY-TOKEN"] = security_token
        
        # Make request to IG API to test connection
        response = requests.get(
            f"{IG_BASE_URL}/session",
            headers=headers,
            timeout=15
        )
        
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
    
    except requests.RequestException as e:
        logger.error(f"Error connecting to IG API: {str(e)}")
        return JsonResponse({"error": f"Error connecting to IG API: {str(e)}"}, status=500)
    
    except Exception as e:
        logger.error(f"Unexpected error in proxy_streaming_connection_test: {str(e)}")
        return JsonResponse({"error": f"Unexpected error: {str(e)}"}, status=500)
