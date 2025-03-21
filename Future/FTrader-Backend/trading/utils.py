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
                data={"error_code": error_code, "context": error_context}
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
            data={"error_message": str(e), "context": error_context}
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


def create_position(user, epic, direction, size, limit_level=None, stop_level=None, 
                   guaranteed_stop=False, trailing_stop=False):
    """
    Create a position using IG API
    
    Args:
        user: User object
        epic: Market epic
        direction: BUY or SELL
        size: Position size
        limit_level: Optional limit level
        stop_level: Optional stop level
        guaranteed_stop: Whether to use guaranteed stop
        trailing_stop: Whether to use trailing stop
    
    Returns:
        Tuple of (success, result_data, error_message)
    """
    try:
        # Check if user has active IG session
        if not user.ig_active_session:
            error_message = "No active IG session. Please log in to IG API first."
            create_error_notification(user=user, error_message=error_message)
            return False, None, error_message
        
        # Get API URL and headers
        base_url = get_ig_api_url(user)
        headers = get_ig_api_headers(user, version="2")
        
        # Prepare data for IG API
        data = {
            'epic': epic,
            'direction': direction,
            'size': str(size),
            'orderType': 'MARKET',
            'timeInForce': 'FILL_OR_KILL',
            'guaranteedStop': guaranteed_stop,
            'trailingStop': trailing_stop,
        }
        
        if limit_level is not None:
            data['limitLevel'] = str(limit_level)
        
        if stop_level is not None:
            data['stopLevel'] = str(stop_level)
        
        # Make the position creation request to IG API
        response = requests.post(
            f"{base_url}/positions/otc",
            headers=headers,
            data=json.dumps(data)
        )
        
        # Handle API errors
        success, error_message = handle_ig_api_error(response, user, "position creation")
        if not success:
            return False, None, error_message
        
        # Parse response
        result_data = response.json()
        
        # Create success notification
        create_success_notification(
            user=user,
            success_message=f"Successfully created {direction} position for {epic}",
            data={"deal_reference": result_data.get('dealReference')}
        )
        
        return True, result_data, None
    
    except Exception as e:
        error_message = f"Error creating position: {str(e)}"
        logger.exception(error_message)
        create_error_notification(user=user, error_message=error_message)
        return False, None, error_message


def close_position(user, deal_id, direction, size):
    """
    Close a position using IG API
    
    Args:
        user: User object
        deal_id: Deal ID
        direction: BUY or SELL (opposite of the original position)
        size: Position size to close
    
    Returns:
        Tuple of (success, result_data, error_message)
    """
    try:
        # Check if user has active IG session
        if not user.ig_active_session:
            error_message = "No active IG session. Please log in to IG API first."
            create_error_notification(user=user, error_message=error_message)
            return False, None, error_message
        
        # Get API URL and headers
        base_url = get_ig_api_url(user)
        headers = get_ig_api_headers(user, version="1")
        
        # Prepare data for IG API
        data = {
            'dealId': deal_id,
            'direction': direction,
            'size': str(size),
            'orderType': 'MARKET'
        }
        
        # Make the position closure request to IG API
        response = requests.post(
            f"{base_url}/positions/otc",
            headers=headers,
            data=json.dumps(data)
        )
        
        # Handle API errors
        success, error_message = handle_ig_api_error(response, user, "position closure")
        if not success:
            return False, None, error_message
        
        # Parse response
        result_data = response.json()
        
        # Create success notification
        create_success_notification(
            user=user,
            success_message=f"Successfully closed position {deal_id}",
            data={"deal_reference": result_data.get('dealReference')}
        )
        
        return True, result_data, None
    
    except Exception as e:
        error_message = f"Error closing position: {str(e)}"
        logger.exception(error_message)
        create_error_notification(user=user, error_message=error_message)
        return False, None, error_message


def create_order(user, epic, order_type, direction, size, level, limit_distance=None, 
                stop_distance=None, good_till_date=None, guaranteed_stop=False, trailing_stop=False):
    """
    Create an order using IG API
    
    Args:
        user: User object
        epic: Market epic
        order_type: LIMIT, MARKET, or STOP
        direction: BUY or SELL
        size: Order size
        level: Order level
        limit_distance: Optional limit distance
        stop_distance: Optional stop distance
        good_till_date: Optional good till date
        guaranteed_stop: Whether to use guaranteed stop
        trailing_stop: Whether to use trailing stop
    
    Returns:
        Tuple of (success, result_data, error_message)
    """
    try:
        # Check if user has active IG session
        if not user.ig_active_session:
            error_message = "No active IG session. Please log in to IG API first."
            create_error_notification(user=user, error_message=error_message)
            return False, None, error_message
        
        # Get API URL and headers
        base_url = get_ig_api_url(user)
        headers = get_ig_api_headers(user, version="2")
        
        # Prepare data for IG API
        data = {
            'epic': epic,
            'direction': direction,
            'size': str(size),
            'level': str(level),
            'type': order_type,
            'timeInForce': 'GOOD_TILL_CANCELLED',
            'guaranteedStop': guaranteed_stop,
            'trailingStop': trailing_stop,
        }
        
        if limit_distance is not None:
            data['limitDistance'] = str(limit_distance)
        
        if stop_distance is not None:
            data['stopDistance'] = str(stop_distance)
        
        if good_till_date is not None:
            data['goodTillDate'] = good_till_date.isoformat()
            data['timeInForce'] = 'GOOD_TILL_DATE'
        
        # Make the order creation request to IG API
        response = requests.post(
            f"{base_url}/workingorders/otc",
            headers=headers,
            data=json.dumps(data)
        )
        
        # Handle API errors
        success, error_message = handle_ig_api_error(response, user, "order creation")
        if not success:
            return False, None, error_message
        
        # Parse response
        result_data = response.json()
        
        # Create success notification
        create_success_notification(
            user=user,
            success_message=f"Successfully created {order_type} {direction} order for {epic}",
            data={"deal_reference": result_data.get('dealReference')}
        )
        
        return True, result_data, None
    
    except Exception as e:
        error_message = f"Error creating order: {str(e)}"
        logger.exception(error_message)
        create_error_notification(user=user, error_message=error_message)
        return False, None, error_message


def cancel_order(user, deal_id):
    """
    Cancel an order using IG API
    
    Args:
        user: User object
        deal_id: Deal ID
    
    Returns:
        Tuple of (success, result_data, error_message)
    """
    try:
        # Check if user has active IG session
        if not user.ig_active_session:
            error_message = "No active IG session. Please log in to IG API first."
            create_error_notification(user=user, error_message=error_message)
            return False, None, error_message
        
        # Get API URL and headers
        base_url = get_ig_api_url(user)
        headers = get_ig_api_headers(user, version="1")
        
        # Make the order cancellation request to IG API
        response = requests.delete(
            f"{base_url}/workingorders/otc/{deal_id}",
            headers=headers
        )
        
        # Handle API errors
        success, error_message = handle_ig_api_error(response, user, "order cancellation")
        if not success:
            return False, None, error_message
        
        # Create success notification
        create_success_notification(
            user=user,
            success_message=f"Successfully cancelled order {deal_id}"
        )
        
        return True, {}, None
    
    except Exception as e:
        error_message = f"Error cancelling order: {str(e)}"
        logger.exception(error_message)
        create_error_notification(user=user, error_message=error_message)
        return False, None, error_message
