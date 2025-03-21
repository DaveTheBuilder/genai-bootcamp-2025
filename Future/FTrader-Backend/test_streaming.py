"""
Test script for the streaming module with offline mode
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

# Set up Django environment first
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ftrader.settings')
import django
django.setup()

# Import after Django is set up
from django.contrib.auth import get_user_model
from market_data.streaming import get_streaming_client, remove_streaming_client

User = get_user_model()

def handle_price_update(update_data):
    """Handle price updates from streaming client"""
    epic = update_data.get('epic', '')
    values = update_data.get('values', {})
    bid = values.get('BID', 'N/A')
    offer = values.get('OFFER', 'N/A')
    logger.info(f"Price update for {epic}: Bid={bid}, Offer={offer}")

def handle_chart_update(update_data):
    """Handle chart updates from streaming client"""
    epic = update_data.get('epic', '')
    values = update_data.get('values', {})
    bid = values.get('BID', 'N/A')
    offer = values.get('OFR', 'N/A')
    logger.info(f"Chart update for {epic}: Bid={bid}, Offer={offer}")

def handle_account_update(update_data):
    """Handle account updates from streaming client"""
    account_id = update_data.get('account_id', '')
    values = update_data.get('values', {})
    balance = values.get('AVAILABLE_CASH', 'N/A')
    used_margin = values.get('USED_MARGIN', 'N/A')
    logger.info(f"Account update for {account_id}: Balance={balance}, Used Margin={used_margin}")

def handle_trade_update(update_data):
    """Handle trade updates from streaming client"""
    account_id = update_data.get('account_id', '')
    values = update_data.get('values', {})
    deal_id = values.get('DEAL_ID', 'N/A')
    status = values.get('STATUS', 'N/A')
    logger.info(f"Trade update for {account_id}: Deal={deal_id}, Status={status}")

def handle_connection_status(status):
    """Handle connection status changes"""
    logger.info(f"Connection status changed: {status}")

def handle_error(error_code, error_message):
    """Handle streaming errors"""
    logger.error(f"Streaming error: {error_code} - {error_message}")

def get_admin_user():
    """Get admin user for testing"""
    User = get_user_model()
    admin = User.objects.filter(is_superuser=True).first()
    
    if not admin:
        logger.error("No admin user found")
        return None
    
    return admin

def test_streaming_offline_mode():
    """Test streaming module with offline mode (mock client)"""
    # Get admin user
    user = get_admin_user()
    if not user:
        logger.error("Cannot test streaming without an admin user")
        return False
    
    logger.info(f"Testing streaming module with offline mode for user {user.username}")
    
    try:
        # Get streaming client with offline mode
        client = get_streaming_client(user, offline_mode=True)
        
        if not client:
            logger.error("Failed to create mock streaming client")
            return False
        
        # Connect
        logger.info("Connecting to mock streaming server...")
        client.connect()
        
        # Wait for connection
        logger.info("Waiting for connection (5 seconds)...")
        for i in range(5):
            time.sleep(1)
            logger.info(f"Waiting... {i+1}/5")
        
        if not client.connected:
            logger.error("Failed to connect to mock streaming server")
            return False
        
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
            return False
        
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
        
        # Test account subscription
        account_id = "DEMO-123456"
        logger.info(f"Subscribing to account balance for {account_id}")
        
        account_subscription_id = client.subscribe_account_balance(
            account_id=account_id,
            callback=handle_account_update
        )
        
        if not account_subscription_id:
            logger.error("Failed to subscribe to account balance")
            client.disconnect()
            return False
        
        logger.info(f"Subscribed to account balance with ID: {account_subscription_id}")
        
        # Test trade subscription
        logger.info(f"Subscribing to trade updates for {account_id}")
        
        trade_subscription_id = client.subscribe_trade_updates(
            account_id=account_id,
            callback=handle_trade_update
        )
        
        if not trade_subscription_id:
            logger.error("Failed to subscribe to trade updates")
            client.disconnect()
            return False
        
        logger.info(f"Subscribed to trade updates with ID: {trade_subscription_id}")
        
        # Wait for updates
        logger.info("Waiting for updates (30 seconds)...")
        for i in range(30):
            time.sleep(1)
            if i % 5 == 0:
                logger.info(f"Waiting... {i+1}/30")
        
        # Unsubscribe
        logger.info("Unsubscribing from all subscriptions...")
        client.unsubscribe_all()
        
        # Disconnect
        logger.info("Disconnecting from mock streaming server...")
        client.disconnect()
        
        # Clean up
        logger.info("Removing streaming client...")
        remove_streaming_client(user)
        
        logger.info("Streaming test completed successfully")
        return True
    
    except Exception as e:
        logger.exception(f"Error testing streaming: {str(e)}")
        return False

if __name__ == "__main__":
    # Run test
    success = test_streaming_offline_mode()
    sys.exit(0 if success else 1)
