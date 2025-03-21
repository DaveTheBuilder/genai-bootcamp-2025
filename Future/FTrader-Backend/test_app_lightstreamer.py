"""
Test script for the Lightstreamer client in the actual application
"""
import os
import sys
import json
import time
import logging
import django
from datetime import datetime

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ftrader.settings')
django.setup()

# Import Django models
from django.contrib.auth import get_user_model
from django.utils import timezone

# Import streaming utilities
from market_data.streaming import get_streaming_client, subscribe_to_markets, subscribe_to_chart

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

User = get_user_model()

def test_app_lightstreamer():
    """Test the Lightstreamer client in the actual application"""
    try:
        # Get admin user
        admin = User.objects.filter(is_superuser=True).first()
        if not admin:
            logger.error("No admin user found")
            return
        
        logger.info(f"Testing Lightstreamer client for user: {admin.username}")
        
        # Check if user has active IG session
        if not admin.ig_active_session:
            logger.warning(f"User {admin.username} has no active IG session")
        
        # Test online mode first
        logger.info("Testing online mode...")
        test_streaming_mode(admin, offline_mode=False)
        
        # Then test offline mode
        logger.info("Testing offline mode...")
        test_streaming_mode(admin, offline_mode=True)
        
        logger.info("Test completed successfully")
        
    except Exception as e:
        logger.exception(f"Error in test: {str(e)}")

def test_streaming_mode(user, offline_mode=False):
    """Test streaming in a specific mode"""
    client = None
    
    try:
        # Get streaming client
        logger.info(f"Creating streaming client (offline_mode={offline_mode})...")
        client = get_streaming_client(user, offline_mode=offline_mode)
        
        if not client:
            logger.error("Failed to create streaming client")
            return
        
        # Set up callbacks
        def on_connection_status_change(status):
            logger.info(f"Connection status changed: {status}")
        
        def on_error(error_code, error_message):
            logger.error(f"Streaming error: {error_code} - {error_message}")
        
        def on_price_update(update_data):
            logger.info(f"Price update received: {json.dumps(update_data, indent=2)}")
        
        def on_chart_update(update_data):
            logger.info(f"Chart update received: {json.dumps(update_data, indent=2)}")
        
        client.on_connection_status_change = on_connection_status_change
        client.on_error = on_error
        
        # Connect to streaming server
        logger.info("Connecting to streaming server...")
        client.connect()
        
        # Wait for connection to be established
        logger.info("Waiting for connection (10 seconds)...")
        for i in range(10):
            time.sleep(1)
            logger.info(f"Waiting... {i+1}/10")
            
            if client.is_connected():
                logger.info("Connected to streaming server")
                break
        
        if not client.is_connected():
            logger.warning("Could not connect to streaming server")
        
        # Subscribe to markets
        markets = ['CS.D.EURUSD.MINI.IP', 'IX.D.FTSE.DAILY.IP']
        logger.info(f"Subscribing to markets: {markets}")
        
        success, subscription_id, error = subscribe_to_markets(user, markets)
        
        if success:
            logger.info(f"Subscribed to markets with ID: {subscription_id}")
        else:
            logger.error(f"Failed to subscribe to markets: {error}")
        
        # Subscribe to chart
        epic = 'CS.D.EURUSD.MINI.IP'
        logger.info(f"Subscribing to chart for {epic}")
        
        success, subscription_id, error = subscribe_to_chart(user, epic)
        
        if success:
            logger.info(f"Subscribed to chart with ID: {subscription_id}")
        else:
            logger.error(f"Failed to subscribe to chart: {error}")
        
        # Wait for updates
        logger.info("Waiting for updates (30 seconds)...")
        for i in range(30):
            time.sleep(1)
            logger.info(f"Waiting for updates... {i+1}/30 seconds")
        
        # Disconnect
        logger.info("Disconnecting from streaming server...")
        client.disconnect()
        
    except Exception as e:
        logger.exception(f"Error in test_streaming_mode: {str(e)}")
    finally:
        # Clean up
        if client:
            try:
                client.disconnect()
            except:
                pass

if __name__ == "__main__":
    test_app_lightstreamer()
