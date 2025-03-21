import os
import sys
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ftrader.settings')
django.setup()

# Import necessary modules
from django.contrib.auth import get_user_model
from market_data.utils import get_ig_api_url, get_ig_api_headers, search_markets
import requests
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_ig_api_connection():
    """Test the connection to the IG API"""
    User = get_user_model()
    
    try:
        # Get the first user (admin)
        user = User.objects.first()
        if not user:
            logger.error("No users found in the database")
            return False
            
        logger.info(f"Testing IG API connection for user: {user.username}")
        
        # Get the API URL and headers
        api_url = get_ig_api_url(user)
        headers = get_ig_api_headers(user)
        
        logger.info(f"API URL: {api_url}")
        logger.info(f"Headers: {headers}")
        
        # Method 1: Test session endpoint
        logger.info("Method 1: Testing session endpoint...")
        try:
            response = requests.get(
                f"{api_url}/session",
                headers=headers
            )
            
            logger.info(f"Session endpoint response status code: {response.status_code}")
            
            if response.status_code == 200:
                logger.info("Session endpoint test successful!")
            else:
                logger.warning(f"Session endpoint test failed with status code: {response.status_code}")
        except Exception as e:
            logger.warning(f"Error testing session endpoint: {str(e)}")
        
        # Method 2: Test markets search
        logger.info("Method 2: Testing markets search...")
        try:
            success, markets, error_message = search_markets(
                user=user,
                search_term="FTSE",
                market_type=None,
                limit=5
            )
            
            if success:
                logger.info(f"Markets search successful! Found {len(markets)} markets.")
                for market in markets[:3]:  # Show first 3 markets
                    logger.info(f"Market: {market.get('name', 'Unknown')} ({market.get('epic', 'Unknown')})")
                return True
            else:
                logger.warning(f"Markets search failed: {error_message}")
        except Exception as e:
            logger.warning(f"Error testing markets search: {str(e)}")
        
        # Method 3: Test streaming API connection
        logger.info("Method 3: Testing streaming API connection...")
        try:
            from market_data.utils import get_ig_streaming_url
            streaming_url = get_ig_streaming_url(user)
            logger.info(f"Streaming URL: {streaming_url}")
            
            # We can't fully test streaming here, but we can check if the URL is valid
            if streaming_url:
                logger.info("Streaming URL is valid.")
            else:
                logger.warning("Streaming URL is invalid.")
        except Exception as e:
            logger.warning(f"Error getting streaming URL: {str(e)}")
        
        # If we reached here, all tests failed
        logger.error("All IG API connection tests failed.")
        return False
            
    except Exception as e:
        logger.exception(f"Error testing IG API connection: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_ig_api_connection()
    sys.exit(0 if success else 1)
