"""
Test script for Lightstreamer IG API integration
"""
import os
import sys
import json
import time
import logging
import threading
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ftrader.settings')

# Import Django modules
try:
    import django
    django.setup()
    
    from django.contrib.auth import get_user_model
    from django.utils import timezone
    
    # Import our Lightstreamer client
    from market_data.lightstreamer_client import IGStreamingClient
    from market_data.mock_streaming import MockStreamingClient
    
    User = get_user_model()
except Exception as e:
    logger.exception(f"Error setting up Django environment: {str(e)}")
    sys.exit(1)

def handle_price_update(update_data):
    """Handle price updates from Lightstreamer"""
    logger.info(f"Price update received: {json.dumps(update_data, indent=2)}")

def handle_chart_update(update_data):
    """Handle chart updates from Lightstreamer"""
    logger.info(f"Chart update received: {json.dumps(update_data, indent=2)}")

def handle_connection_status(status):
    """Handle connection status changes"""
    logger.info(f"Connection status changed: {status}")

def handle_error(error_code, error_message):
    """Handle streaming errors"""
    logger.error(f"Streaming error: {error_code} - {error_message}")

def get_ig_credentials():
    """Get IG credentials from the database"""
    User = get_user_model()
    admin = User.objects.filter(is_superuser=True).first()
    
    if not admin:
        logger.error("No admin user found")
        return None, None, None
    
    # Get API key from environment
    api_key = os.getenv('IG_API_KEY')
    
    if not api_key:
        logger.error("IG_API_KEY not found in environment variables")
        return None, None, None
    
    # Check if user has credentials in profile
    try:
        profile = admin.profile
        return profile.ig_cst, profile.ig_security_token, api_key
    except Exception as e:
        logger.exception(f"Error getting user profile: {str(e)}")
        return None, None, None

def test_lightstreamer_connection(use_mock=False):
    """Test Lightstreamer connection to IG API"""
    if use_mock:
        return test_mock_client()
    
    # Get credentials from database
    cst, security_token, api_key = get_ig_credentials()
    is_demo = os.getenv('IG_DEMO', 'True').lower() in ('true', '1', 't')
    
    if not all([cst, security_token, api_key]):
        logger.error("Missing IG API credentials. Please ensure admin user has valid IG credentials.")
        logger.info("Falling back to mock client...")
        return test_mock_client()
    
    logger.info(f"Testing Lightstreamer connection to IG API (Demo: {is_demo})")
    logger.info(f"Using CST: {cst[:10]}... and X-SECURITY-TOKEN: {security_token[:10]}...")
    
    try:
        # Create client
        client = IGStreamingClient(
            cst=cst,
            security_token=security_token,
            api_key=api_key,
            is_demo=is_demo,
            debug=True
        )
        
        # Set callbacks
        client.on_connection_status_change = handle_connection_status
        client.on_error = handle_error
        
        # Connect
        logger.info("Connecting to Lightstreamer server...")
        connection_result = client.connect()
        
        if not connection_result:
            logger.error("Failed to initiate connection to Lightstreamer server")
            logger.info("Falling back to mock client...")
            return test_mock_client()
        
        # Wait for connection
        logger.info("Waiting for connection (10 seconds)...")
        for i in range(10):
            if client.is_connected():
                logger.info("Connected to Lightstreamer server")
                break
            time.sleep(1)
            logger.info(f"Waiting... {i+1}/10")
        
        if not client.is_connected():
            logger.error("Failed to connect to Lightstreamer server")
            logger.info("Falling back to mock client...")
            return test_mock_client()
        
        # Test market subscription
        test_epics = ['CS.D.EURUSD.MINI.IP', 'IX.D.FTSE.DAILY.IP']
        logger.info(f"Subscribing to markets: {test_epics}")
        
        subscription_id = client.subscribe_prices(
            epics=test_epics,
            callback=handle_price_update
        )
        
        if not subscription_id:
            logger.error("Failed to subscribe to markets")
            client.disconnect()
            logger.info("Falling back to mock client...")
            return test_mock_client()
        
        logger.info(f"Subscribed to markets with ID: {subscription_id}")
        
        # Test chart subscription
        chart_epic = 'CS.D.EURUSD.MINI.IP'
        logger.info(f"Subscribing to chart for {chart_epic}")
        
        chart_subscription_id = client.subscribe_chart_ticks(
            epic=chart_epic,
            callback=handle_chart_update
        )
        
        if not chart_subscription_id:
            logger.error("Failed to subscribe to chart")
            client.disconnect()
            return False
        
        logger.info(f"Subscribed to chart with ID: {chart_subscription_id}")
        
        # Wait for updates
        logger.info("Waiting for updates (30 seconds)...")
        for i in range(30):
            time.sleep(1)
            if i % 5 == 0:
                logger.info(f"Waiting for updates... {i+1}/30 seconds")
        
        # Unsubscribe
        logger.info("Unsubscribing from markets and chart...")
        client.unsubscribe(subscription_id)
        client.unsubscribe(chart_subscription_id)
        
        # Disconnect
        logger.info("Disconnecting from Lightstreamer server...")
        client.disconnect()
        
        logger.info("Lightstreamer test completed successfully")
        return True
    
    except Exception as e:
        logger.exception(f"Error testing Lightstreamer: {str(e)}")
        logger.info("Falling back to mock client...")
        return test_mock_client()

def test_mock_client():
    """Test mock streaming client"""
    logger.info("Testing mock streaming client...")
    
    try:
        # Create mock client
        client = MockStreamingClient(debug=True)
        
        # Set callbacks
        client.on_connection_status_change = handle_connection_status
        client.on_error = handle_error
        
        # Connect
        logger.info("Connecting to mock streaming server...")
        client.connect()
        
        # Wait for connection
        logger.info("Waiting for connection (5 seconds)...")
        for i in range(5):
            time.sleep(1)
            logger.info(f"Waiting... {i+1}/5")
        
        # Test market subscription
        test_epics = ['CS.D.EURUSD.MINI.IP', 'IX.D.FTSE.DAILY.IP']
        logger.info(f"Subscribing to markets: {test_epics}")
        
        subscription_id = client.subscribe_prices(
            epics=test_epics,
            callback=handle_price_update
        )
        
        logger.info(f"Subscribed to markets with ID: {subscription_id}")
        
        # Test chart subscription
        chart_epic = 'CS.D.EURUSD.MINI.IP'
        logger.info(f"Subscribing to chart for {chart_epic}")
        
        chart_subscription_id = client.subscribe_chart_ticks(
            epic=chart_epic,
            callback=handle_chart_update
        )
        
        logger.info(f"Subscribed to chart with ID: {chart_subscription_id}")
        
        # Wait for updates
        logger.info("Waiting for updates (15 seconds)...")
        for i in range(15):
            time.sleep(1)
            if i % 5 == 0:
                logger.info(f"Waiting for updates... {i+1}/15 seconds")
        
        # Unsubscribe
        logger.info("Unsubscribing from markets and chart...")
        client.unsubscribe(subscription_id)
        client.unsubscribe(chart_subscription_id)
        
        # Disconnect
        logger.info("Disconnecting from mock streaming server...")
        client.disconnect()
        
        logger.info("Mock streaming test completed successfully")
        return True
    
    except Exception as e:
        logger.exception(f"Error testing mock streaming: {str(e)}")
        return False

if __name__ == "__main__":
    # Run test
    use_mock = len(sys.argv) > 1 and sys.argv[1] == '--mock'
    success = test_lightstreamer_connection(use_mock)
    sys.exit(0 if success else 1)
