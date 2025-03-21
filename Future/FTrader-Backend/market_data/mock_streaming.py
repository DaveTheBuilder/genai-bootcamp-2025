"""
Mock streaming client for testing and offline mode
"""
import json
import logging
import random
import threading
import time
from datetime import datetime
from typing import Dict, List, Optional, Callable, Any, Union

logger = logging.getLogger(__name__)


class MockStreamingClient:
    """
    Mock streaming client for testing and offline mode
    
    This client simulates the behavior of the IG Streaming API for testing
    and offline mode. It generates random price updates at regular intervals.
    """
    
    def __init__(self, debug: bool = False):
        """
        Initialize the mock streaming client
        
        Args:
            debug: Whether to enable debug logging
        """
        self.debug = debug
        
        # Set up logging
        if self.debug:
            logging.basicConfig(level=logging.DEBUG)
        
        # Initialize client
        self.subscriptions = {}
        self.connected = False
        self.connection_lock = threading.Lock()
        self.update_thread = None
        self.stop_event = threading.Event()
        
        # Callbacks
        self.on_connection_status_change = None
        self.on_error = None
    
    def connect(self):
        """Connect to the mock streaming server"""
        with self.connection_lock:
            if not self.connected:
                logger.info("Connecting to mock streaming server...")
                
                # Set connected status
                self.connected = True
                
                # Start update thread
                self.stop_event.clear()
                self.update_thread = threading.Thread(target=self._update_loop)
                self.update_thread.daemon = True
                self.update_thread.start()
                
                logger.info("Connected to mock streaming server")
                
                if self.on_connection_status_change:
                    self.on_connection_status_change("connected")
                
                return True
            
            return False
    
    def disconnect(self):
        """Disconnect from the mock streaming server"""
        with self.connection_lock:
            if self.connected:
                logger.info("Disconnecting from mock streaming server...")
                
                # Stop update thread
                self.stop_event.set()
                if self.update_thread:
                    self.update_thread.join(timeout=2)
                
                # Set connected status
                self.connected = False
                
                logger.info("Disconnected from mock streaming server")
                
                if self.on_connection_status_change:
                    self.on_connection_status_change("disconnected")
                
                return True
            
            return False
    
    def _update_loop(self):
        """Update loop for generating mock updates"""
        logger.info("Starting mock update loop")
        
        while not self.stop_event.is_set():
            try:
                # Generate updates for all subscriptions
                for subscription_id, subscription in self.subscriptions.items():
                    if subscription["type"] == "PRICES":
                        self._generate_price_updates(subscription)
                    elif subscription["type"] == "CHART":
                        self._generate_chart_updates(subscription)
                    elif subscription["type"] == "ACCOUNT":
                        self._generate_account_updates(subscription)
                    elif subscription["type"] == "TRADE":
                        self._generate_trade_updates(subscription)
            except Exception as e:
                logger.exception(f"Error in mock update loop: {str(e)}")
            
            # Sleep for a random interval (0.5-2 seconds)
            time.sleep(random.uniform(0.5, 2))
    
    def _generate_price_updates(self, subscription):
        """Generate mock price updates"""
        if "callback" not in subscription or not subscription["callback"]:
            return
        
        for epic in subscription["epics"]:
            # Generate random price data
            bid = round(random.uniform(1.0, 100.0), 2)
            offer = round(bid + random.uniform(0.01, 0.5), 2)
            
            # Create values dict
            values = {
                "BID": str(bid),
                "OFFER": str(offer),
                "PRICE_CHANGE": str(round(random.uniform(-1.0, 1.0), 2)),
                "PRICE_CHANGE_PCT": str(round(random.uniform(-2.0, 2.0), 2)),
                "MID_OPEN": str(round(bid - random.uniform(0.1, 1.0), 2)),
                "HIGH": str(round(offer + random.uniform(0.1, 1.0), 2)),
                "LOW": str(round(bid - random.uniform(0.1, 1.0), 2)),
                "UPDATE_TIME": datetime.now().strftime("%H:%M:%S"),
                "MARKET_DELAY": "0",
                "MARKET_STATE": "TRADEABLE"
            }
            
            # Create update data
            update_data = {
                "subscription_id": subscription["id"],
                "subscription_type": "PRICES",
                "item_name": epic,
                "epic": epic,
                "timestamp": datetime.now().isoformat(),
                "values": values
            }
            
            # Call callback
            try:
                subscription["callback"](update_data)
            except Exception as e:
                logger.exception(f"Error in price update callback: {str(e)}")
    
    def _generate_chart_updates(self, subscription):
        """Generate mock chart updates"""
        if "callback" not in subscription or not subscription["callback"]:
            return
        
        # Generate random chart data
        bid = round(random.uniform(1.0, 100.0), 2)
        offer = round(bid + random.uniform(0.01, 0.5), 2)
        
        # Create values dict
        values = {
            "BID": str(bid),
            "OFR": str(offer),
            "CONS_END": "1",
            "LTV": str(random.randint(1000, 10000)),
            "UTM": str(int(time.time() * 1000)),
            "DAY_OPEN_MID": str(round(bid - random.uniform(0.1, 1.0), 2)),
            "DAY_NET_CHG_MID": str(round(random.uniform(-1.0, 1.0), 2)),
            "DAY_PERC_CHG_MID": str(round(random.uniform(-2.0, 2.0), 2))
        }
        
        # Create update data
        update_data = {
            "subscription_id": subscription["id"],
            "subscription_type": "CHART",
            "item_name": f"CHART:{subscription['epic']}",
            "epic": subscription["epic"],
            "timestamp": datetime.now().isoformat(),
            "values": values
        }
        
        # Call callback
        try:
            subscription["callback"](update_data)
        except Exception as e:
            logger.exception(f"Error in chart update callback: {str(e)}")
    
    def _generate_account_updates(self, subscription):
        """Generate mock account updates"""
        if "callback" not in subscription or not subscription["callback"]:
            return
        
        # Generate random account data
        available = round(random.uniform(1000.0, 10000.0), 2)
        balance = round(available + random.uniform(0.0, 1000.0), 2)
        deposit = round(balance + random.uniform(0.0, 1000.0), 2)
        
        # Create values dict
        values = {
            "AVAILABLE": str(available),
            "BALANCE": str(balance),
            "DEPOSIT": str(deposit),
            "PROFIT_LOSS": str(round(random.uniform(-100.0, 100.0), 2)),
            "AVAILABLE_CASH": str(available)
        }
        
        # Create update data
        update_data = {
            "subscription_id": subscription["id"],
            "subscription_type": "ACCOUNT",
            "item_name": f"ACCOUNT:{subscription['account_id']}",
            "account_id": subscription["account_id"],
            "timestamp": datetime.now().isoformat(),
            "values": values
        }
        
        # Call callback
        try:
            subscription["callback"](update_data)
        except Exception as e:
            logger.exception(f"Error in account update callback: {str(e)}")
    
    def _generate_trade_updates(self, subscription):
        """Generate mock trade updates"""
        if "callback" not in subscription or not subscription["callback"]:
            return
        
        # Only generate trade updates occasionally (10% chance)
        if random.random() > 0.1:
            return
        
        # Generate random trade data
        deal_id = f"DEAL{random.randint(10000, 99999)}"
        status = random.choice(["OPEN", "AMENDED", "CLOSED", "DELETED"])
        
        # Create values dict
        values = {
            "CONFIRMS": "1",
            "DEAL_ID": deal_id,
            "DEAL_STATUS": status,
            "DIRECTION": random.choice(["BUY", "SELL"]),
            "EPIC": f"CS.D.EURUSD.MINI.IP",
            "EXPIRY": "-",
            "GUARANTEED_STOP": "false",
            "LIMIT_DISTANCE": str(random.randint(10, 100)),
            "LIMIT_LEVEL": str(round(random.uniform(1.0, 2.0), 5)),
            "OPEN_LEVEL": str(round(random.uniform(1.0, 2.0), 5)),
            "ORDER_TYPE": "MARKET",
            "STOP_DISTANCE": str(random.randint(10, 100)),
            "STOP_LEVEL": str(round(random.uniform(1.0, 2.0), 5)),
            "TRAILING_STEP": "0.0",
            "TRAILING_STOP_DISTANCE": "0.0"
        }
        
        # Create update data
        update_data = {
            "subscription_id": subscription["id"],
            "subscription_type": "TRADE",
            "item_name": f"TRADE:{subscription['account_id']}",
            "account_id": subscription["account_id"],
            "timestamp": datetime.now().isoformat(),
            "values": values
        }
        
        # Call callback
        try:
            subscription["callback"](update_data)
        except Exception as e:
            logger.exception(f"Error in trade update callback: {str(e)}")
    
    def subscribe_prices(self, epics: List[str], callback: Callable[[Dict], None]) -> str:
        """
        Subscribe to price updates for the given epics
        
        Args:
            epics: List of market epics to subscribe to
            callback: Callback function to handle price updates
        
        Returns:
            Subscription ID
        """
        logging.info(f"Subscribing to price updates for epics: {epics}")
        
        # Create a unique subscription ID
        subscription_id = f"PRICES_{datetime.now().timestamp()}"
        
        # Store subscription
        self.subscriptions[subscription_id] = {
            "id": subscription_id,
            "epics": epics,
            "type": "PRICES",
            "callback": callback
        }
        
        logger.info(f"Subscribed to prices for {len(epics)} markets")
        
        return subscription_id
    
    def subscribe_chart_ticks(self, epic: str, callback: Callable[[Dict], None]) -> str:
        """
        Subscribe to chart tick data for a market
        
        Args:
            epic: Market epic
            callback: Callback function to handle tick updates
        
        Returns:
            Subscription ID
        """
        logging.info(f"Subscribing to chart ticks for epic: {epic}")
        
        # Create a unique subscription ID
        subscription_id = f"CHART_{epic}_{datetime.now().timestamp()}"
        
        # Store subscription
        self.subscriptions[subscription_id] = {
            "id": subscription_id,
            "epic": epic,
            "type": "CHART",
            "callback": callback
        }
        
        logger.info(f"Subscribed to chart ticks for {epic}")
        
        return subscription_id
    
    def subscribe_account_balance(self, account_id: str, callback: Callable[[Dict], None]) -> str:
        """
        Subscribe to account balance updates
        
        Args:
            account_id: Account ID
            callback: Callback function to handle balance updates
        
        Returns:
            Subscription ID
        """
        logging.info(f"Subscribing to account balance updates for account: {account_id}")
        
        # Create a unique subscription ID
        subscription_id = f"ACCOUNT_{account_id}_{datetime.now().timestamp()}"
        
        # Store subscription
        self.subscriptions[subscription_id] = {
            "id": subscription_id,
            "account_id": account_id,
            "type": "ACCOUNT",
            "callback": callback
        }
        
        logger.info(f"Subscribed to account balance for {account_id}")
        
        return subscription_id
    
    def subscribe_trade_updates(self, account_id: str, callback: Callable[[Dict], None]) -> str:
        """
        Subscribe to trade updates
        
        Args:
            account_id: Account ID
            callback: Callback function to handle trade updates
        
        Returns:
            Subscription ID
        """
        logging.info(f"Subscribing to trade updates for account: {account_id}")
        
        # Create a unique subscription ID
        subscription_id = f"TRADE_{account_id}_{datetime.now().timestamp()}"
        
        # Store subscription
        self.subscriptions[subscription_id] = {
            "id": subscription_id,
            "account_id": account_id,
            "type": "TRADE",
            "callback": callback
        }
        
        logger.info(f"Subscribed to trade updates for {account_id}")
        
        return subscription_id
    
    def unsubscribe(self, subscription_id: str) -> bool:
        """
        Unsubscribe from a subscription
        
        Args:
            subscription_id: Subscription ID
        
        Returns:
            Whether the unsubscription was successful
        """
        if subscription_id in self.subscriptions:
            del self.subscriptions[subscription_id]
            logger.info(f"Unsubscribed from {subscription_id}")
            return True
        
        logger.warning(f"Subscription {subscription_id} not found")
        return False
    
    def unsubscribe_all(self) -> bool:
        """
        Unsubscribe from all subscriptions
        
        Returns:
            Whether all unsubscriptions were successful
        """
        self.subscriptions.clear()
        logger.info("Unsubscribed from all subscriptions")
        return True
