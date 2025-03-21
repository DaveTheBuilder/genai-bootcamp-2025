"""
Test script for the mock streaming client
"""
import logging
import time
from market_data.mock_streaming import MockStreamingClient

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

def handle_update(update_data):
    """Handle streaming updates"""
    subscription_type = update_data.get('subscription_type')
    item_name = update_data.get('item_name')
    timestamp = update_data.get('timestamp')
    values = update_data.get('values', {})
    
    if subscription_type == 'PRICES':
        epic = update_data.get('epic')
        bid = values.get('BID', 'N/A')
        offer = values.get('OFFER', 'N/A')
        logger.info(f"Price update for {epic}: Bid={bid}, Offer={offer}")
    
    elif subscription_type == 'CHART':
        epic = update_data.get('epic')
        bid = values.get('BID', 'N/A')
        offer = values.get('OFR', 'N/A')
        logger.info(f"Chart update for {epic}: Bid={bid}, Offer={offer}")
    
    elif subscription_type == 'ACCOUNT':
        account_id = update_data.get('account_id')
        balance = values.get('BALANCE', 'N/A')
        available = values.get('AVAILABLE', 'N/A')
        logger.info(f"Account update for {account_id}: Balance={balance}, Available={available}")
    
    elif subscription_type == 'TRADE':
        account_id = update_data.get('account_id')
        deal_id = values.get('DEAL_ID', 'N/A')
        status = values.get('DEAL_STATUS', 'N/A')
        logger.info(f"Trade update for {account_id}: Deal={deal_id}, Status={status}")

def handle_connection_status(status):
    """Handle connection status changes"""
    logger.info(f"Connection status changed: {status}")

def handle_error(error_code, error_message):
    """Handle streaming errors"""
    logger.error(f"Streaming error: {error_code} - {error_message}")

def main():
    """Main test function"""
    logger.info("Testing mock streaming client")
    
    # Create client
    client = MockStreamingClient(debug=True)
    
    # Set callbacks
    client.on_connection_status_change = handle_connection_status
    client.on_error = handle_error
    
    # Connect
    logger.info("Connecting to mock streaming server...")
    client.connect()
    
    # Wait for connection
    logger.info("Waiting for connection (5 seconds)...")
    time.sleep(5)
    
    # Subscribe to markets
    markets = ['CS.D.EURUSD.MINI.IP', 'IX.D.FTSE.DAILY.IP']
    logger.info(f"Subscribing to markets: {markets}")
    subscription_id = client.subscribe_prices(markets, handle_update)
    
    # Subscribe to chart ticks
    logger.info("Subscribing to chart ticks for EURUSD")
    chart_subscription_id = client.subscribe_chart_ticks('CS.D.EURUSD.MINI.IP', handle_update)
    
    # Subscribe to account balance
    logger.info("Subscribing to account balance")
    account_subscription_id = client.subscribe_account_balance('DEMO-123456', handle_update)
    
    # Subscribe to trade updates
    logger.info("Subscribing to trade updates")
    trade_subscription_id = client.subscribe_trade_updates('DEMO-123456', handle_update)
    
    # Wait for updates
    logger.info("Waiting for updates (30 seconds)...")
    try:
        for i in range(30):
            time.sleep(1)
            if (i + 1) % 5 == 0:
                logger.info(f"Waiting... {i + 1}/30")
    except KeyboardInterrupt:
        logger.info("Test interrupted by user")
    
    # Unsubscribe
    logger.info("Unsubscribing from all subscriptions")
    client.unsubscribe_all()
    
    # Disconnect
    logger.info("Disconnecting from mock streaming server...")
    client.disconnect()
    
    logger.info("Test completed successfully")

if __name__ == "__main__":
    main()
