import logging
import json
import requests
from django.conf import settings
from notifications.utils import create_error_notification, create_success_notification

logger = logging.getLogger(__name__)


def handle_ig_api_error(response, user, error_context="API operation"):
    """
    Handle errors from IG API
    
    Args:
        response: Response object from requests
        user: User object
        error_context: Context of the error for logging and notification
    
    Returns:
        Tuple of (success, error_message)
    """
    try:
        if response.status_code != 200:
            error_data = response.json() if response.content else {"errorCode": "NO_RESPONSE"}
            error_code = error_data.get('errorCode', 'Unknown error')
            error_message = f"IG API error: {error_code}"
            
            # Log the error
            logger.error(f"IG API error during {error_context}: {error_code}")
            
            # Create notification for user
            create_error_notification(
                user=user,
                error_message=f"Error during {error_context}: {error_code}",
                data={
                    "error_code": error_code, 
                    "context": error_context,
                    "errorType": "connection",
                    "canRetry": True,
                    "canSwitchToOfflineMode": True
                }
            )
            
            return False, error_message
        
        return True, None
    
    except Exception as e:
        error_message = f"Error processing IG API response: {str(e)}"
        logger.exception(error_message)
        
        # Create notification for user
        create_error_notification(
            user=user,
            error_message=f"Error during {error_context}: {str(e)}",
            data={
                "error_message": str(e), 
                "context": error_context,
                "errorType": "connection",
                "canRetry": True,
                "canSwitchToOfflineMode": True
            }
        )
        
        return False, error_message


def get_ig_api_headers(user, version="1"):
    """
    Get headers for IG API request
    
    Args:
        user: User object
        version: API version
    
    Returns:
        Dict of headers
    """
    return {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8',
        'X-IG-API-KEY': user.ig_api_key,
        'CST': user.ig_cst,
        'X-SECURITY-TOKEN': user.ig_security_token,
        'Version': version
    }


def get_ig_api_url(user):
    """
    Get the IG API URL based on user's demo flag
    
    Args:
        user: User object
    
    Returns:
        IG API URL
    """
    return 'https://demo-api.ig.com/gateway/deal' if user.use_demo_account else 'https://api.ig.com/gateway/deal'


def get_ig_streaming_url(user):
    """
    Get the IG Streaming URL based on user's demo flag
    
    Args:
        user: User object
    
    Returns:
        IG Streaming URL
    """
    return 'wss://demo-apd.marketdatasystems.com' if user.use_demo_account else 'wss://apd.marketdatasystems.com'


def search_markets(user, search_term, market_type=None, limit=20):
    """
    Search markets using IG API
    
    Args:
        user: User object
        search_term: Search term
        market_type: Optional market type filter
        limit: Maximum number of results
    
    Returns:
        Tuple of (success, markets, error_message)
    """
    try:
        # Check if user has active IG session
        if not user.ig_active_session:
            error_message = "No active IG session. Please log in to IG API first."
            create_error_notification(
                user=user, 
                error_message=error_message,
                data={
                    "errorType": "connection",
                    "canRetry": True,
                    "canSwitchToOfflineMode": True
                }
            )
            return False, None, error_message
        
        # Get API URL and headers
        base_url = get_ig_api_url(user)
        headers = get_ig_api_headers(user, version="1")
        
        # Prepare query parameters
        params = {
            'searchTerm': search_term,
            'maxResults': limit
        }
        
        if market_type:
            params['epicsOnly'] = 'false'
            params['instrumentType'] = market_type
        
        # Make the search request to IG API
        response = requests.get(
            f"{base_url}/markets",
            headers=headers,
            params=params
        )
        
        # Handle API errors
        success, error_message = handle_ig_api_error(response, user, "market search")
        if not success:
            return False, None, error_message
        
        # Parse response
        result_data = response.json()
        markets = result_data.get('markets', [])
        
        return True, markets, None
    
    except Exception as e:
        error_message = f"Error searching markets: {str(e)}"
        logger.exception(error_message)
        create_error_notification(
            user=user, 
            error_message=error_message,
            data={
                "errorType": "connection",
                "canRetry": True,
                "canSwitchToOfflineMode": True
            }
        )
        return False, None, error_message


def get_market_details(user, epic):
    """
    Get market details using IG API
    
    Args:
        user: User object
        epic: Market epic
    
    Returns:
        Tuple of (success, market_details, error_message)
    """
    try:
        # Check if user has active IG session
        if not user.ig_active_session:
            error_message = "No active IG session. Please log in to IG API first."
            create_error_notification(
                user=user, 
                error_message=error_message,
                data={
                    "errorType": "connection",
                    "canRetry": True,
                    "canSwitchToOfflineMode": True
                }
            )
            return False, None, error_message
        
        # Get API URL and headers
        base_url = get_ig_api_url(user)
        headers = get_ig_api_headers(user, version="3")
        
        # Make the market details request to IG API
        response = requests.get(
            f"{base_url}/markets/{epic}",
            headers=headers
        )
        
        # Handle API errors
        success, error_message = handle_ig_api_error(response, user, "market details")
        if not success:
            return False, None, error_message
        
        # Parse response
        market_details = response.json()
        
        return True, market_details, None
    
    except Exception as e:
        error_message = f"Error getting market details: {str(e)}"
        logger.exception(error_message)
        create_error_notification(
            user=user, 
            error_message=error_message,
            data={
                "errorType": "connection",
                "canRetry": True,
                "canSwitchToOfflineMode": True
            }
        )
        return False, None, error_message


def get_price_history(user, epic, resolution, from_date, to_date=None, max_data_points=None):
    """
    Get price history using IG API
    
    Args:
        user: User object
        epic: Market epic
        resolution: Time resolution (MINUTE, MINUTE_2, MINUTE_3, MINUTE_5, MINUTE_10, MINUTE_15, 
                   MINUTE_30, HOUR, HOUR_2, HOUR_3, HOUR_4, DAY, WEEK, MONTH)
        from_date: Start date
        to_date: Optional end date
        max_data_points: Optional maximum number of data points
    
    Returns:
        Tuple of (success, price_data, error_message)
    """
    try:
        # Check if user has active IG session
        if not user.ig_active_session:
            error_message = "No active IG session. Please log in to IG API first."
            create_error_notification(
                user=user, 
                error_message=error_message,
                data={
                    "errorType": "connection",
                    "canRetry": True,
                    "canSwitchToOfflineMode": True
                }
            )
            return False, None, error_message
        
        # Get API URL and headers
        base_url = get_ig_api_url(user)
        headers = get_ig_api_headers(user, version="3")
        
        # Prepare query parameters
        params = {
            'resolution': resolution,
            'from': from_date.isoformat(),
        }
        
        if to_date:
            params['to'] = to_date.isoformat()
        
        if max_data_points:
            params['max'] = max_data_points
        
        # Make the price history request to IG API
        response = requests.get(
            f"{base_url}/prices/{epic}",
            headers=headers,
            params=params
        )
        
        # Handle API errors
        success, error_message = handle_ig_api_error(response, user, "price history")
        if not success:
            return False, None, error_message
        
        # Parse response
        price_data = response.json()
        
        return True, price_data, None
    
    except Exception as e:
        error_message = f"Error getting price history: {str(e)}"
        logger.exception(error_message)
        create_error_notification(
            user=user, 
            error_message=error_message,
            data={
                "errorType": "connection",
                "canRetry": True,
                "canSwitchToOfflineMode": True
            }
        )
        return False, None, error_message


def create_watchlist(user, name, epics=None):
    """
    Create a watchlist using IG API
    
    Args:
        user: User object
        name: Watchlist name
        epics: Optional list of market epics to add
    
    Returns:
        Tuple of (success, watchlist_id, error_message)
    """
    try:
        # Check if user has active IG session
        if not user.ig_active_session:
            error_message = "No active IG session. Please log in to IG API first."
            create_error_notification(
                user=user, 
                error_message=error_message,
                data={
                    "errorType": "connection",
                    "canRetry": True,
                    "canSwitchToOfflineMode": True
                }
            )
            return False, None, error_message
        
        # Get API URL and headers
        base_url = get_ig_api_url(user)
        headers = get_ig_api_headers(user, version="1")
        
        # Prepare data for IG API
        data = {
            'name': name,
            'epics': epics or []
        }
        
        # Make the watchlist creation request to IG API
        response = requests.post(
            f"{base_url}/watchlists",
            headers=headers,
            data=json.dumps(data)
        )
        
        # Handle API errors
        success, error_message = handle_ig_api_error(response, user, "watchlist creation")
        if not success:
            return False, None, error_message
        
        # Parse response
        result_data = response.json()
        watchlist_id = result_data.get('watchlistId')
        
        # Create success notification
        create_success_notification(
            user=user,
            success_message=f"Successfully created watchlist '{name}'"
        )
        
        return True, watchlist_id, None
    
    except Exception as e:
        error_message = f"Error creating watchlist: {str(e)}"
        logger.exception(error_message)
        create_error_notification(
            user=user, 
            error_message=error_message,
            data={
                "errorType": "connection",
                "canRetry": True,
                "canSwitchToOfflineMode": True
            }
        )
        return False, None, error_message


def add_to_watchlist(user, watchlist_id, epic):
    """
    Add a market to a watchlist using IG API
    
    Args:
        user: User object
        watchlist_id: Watchlist ID
        epic: Market epic
    
    Returns:
        Tuple of (success, result_data, error_message)
    """
    try:
        # Check if user has active IG session
        if not user.ig_active_session:
            error_message = "No active IG session. Please log in to IG API first."
            create_error_notification(
                user=user, 
                error_message=error_message,
                data={
                    "errorType": "connection",
                    "canRetry": True,
                    "canSwitchToOfflineMode": True
                }
            )
            return False, None, error_message
        
        # Get API URL and headers
        base_url = get_ig_api_url(user)
        headers = get_ig_api_headers(user, version="1")
        
        # Make the add to watchlist request to IG API
        response = requests.put(
            f"{base_url}/watchlists/{watchlist_id}/{epic}",
            headers=headers
        )
        
        # Handle API errors
        success, error_message = handle_ig_api_error(response, user, "add to watchlist")
        if not success:
            return False, None, error_message
        
        # Create success notification
        create_success_notification(
            user=user,
            success_message=f"Successfully added market to watchlist"
        )
        
        return True, {}, None
    
    except Exception as e:
        error_message = f"Error adding to watchlist: {str(e)}"
        logger.exception(error_message)
        create_error_notification(
            user=user, 
            error_message=error_message,
            data={
                "errorType": "connection",
                "canRetry": True,
                "canSwitchToOfflineMode": True
            }
        )
        return False, None, error_message


def remove_from_watchlist(user, watchlist_id, epic):
    """
    Remove a market from a watchlist using IG API
    
    Args:
        user: User object
        watchlist_id: Watchlist ID
        epic: Market epic
    
    Returns:
        Tuple of (success, result_data, error_message)
    """
    try:
        # Check if user has active IG session
        if not user.ig_active_session:
            error_message = "No active IG session. Please log in to IG API first."
            create_error_notification(
                user=user, 
                error_message=error_message,
                data={
                    "errorType": "connection",
                    "canRetry": True,
                    "canSwitchToOfflineMode": True
                }
            )
            return False, None, error_message
        
        # Get API URL and headers
        base_url = get_ig_api_url(user)
        headers = get_ig_api_headers(user, version="1")
        
        # Make the remove from watchlist request to IG API
        response = requests.delete(
            f"{base_url}/watchlists/{watchlist_id}/{epic}",
            headers=headers
        )
        
        # Handle API errors
        success, error_message = handle_ig_api_error(response, user, "remove from watchlist")
        if not success:
            return False, None, error_message
        
        # Create success notification
        create_success_notification(
            user=user,
            success_message=f"Successfully removed market from watchlist"
        )
        
        return True, {}, None
    
    except Exception as e:
        error_message = f"Error removing from watchlist: {str(e)}"
        logger.exception(error_message)
        create_error_notification(
            user=user, 
            error_message=error_message,
            data={
                "errorType": "connection",
                "canRetry": True,
                "canSwitchToOfflineMode": True
            }
        )
        return False, None, error_message


def delete_watchlist(user, watchlist_id):
    """
    Delete a watchlist using IG API
    
    Args:
        user: User object
        watchlist_id: Watchlist ID
    
    Returns:
        Tuple of (success, result_data, error_message)
    """
    try:
        # Check if user has active IG session
        if not user.ig_active_session:
            error_message = "No active IG session. Please log in to IG API first."
            create_error_notification(
                user=user, 
                error_message=error_message,
                data={
                    "errorType": "connection",
                    "canRetry": True,
                    "canSwitchToOfflineMode": True
                }
            )
            return False, None, error_message
        
        # Get API URL and headers
        base_url = get_ig_api_url(user)
        headers = get_ig_api_headers(user, version="1")
        
        # Make the delete watchlist request to IG API
        response = requests.delete(
            f"{base_url}/watchlists/{watchlist_id}",
            headers=headers
        )
        
        # Handle API errors
        success, error_message = handle_ig_api_error(response, user, "delete watchlist")
        if not success:
            return False, None, error_message
        
        # Create success notification
        create_success_notification(
            user=user,
            success_message=f"Successfully deleted watchlist"
        )
        
        return True, {}, None
    
    except Exception as e:
        error_message = f"Error deleting watchlist: {str(e)}"
        logger.exception(error_message)
        create_error_notification(
            user=user, 
            error_message=error_message,
            data={
                "errorType": "connection",
                "canRetry": True,
                "canSwitchToOfflineMode": True
            }
        )
        return False, None, error_message
