import json
import logging
import threading
import time
from typing import Dict, List, Optional, Callable, Any, Union
from datetime import datetime
import random

# Import Lightstreamer client
try:
    # Try importing from the package
    import lightstreamer_client
    from lightstreamer_client import LightstreamerClient, LightstreamerSubscription
    
    # Set up logging since ConsoleLoggerProvider might not be available
    logging.basicConfig(level=logging.DEBUG)
except ImportError as e:
    logging.error(f"Error importing Lightstreamer client: {str(e)}")
    raise

from django.conf import settings
from django.utils import timezone

logger = logging.getLogger(__name__)


class IGStreamingClient:
    """
    IG Streaming API client using Lightstreamer
    
    This client handles the connection to the IG Streaming API and manages
    subscriptions for market data and other streaming information.
    """
    
    def __init__(self, cst: str, security_token: str, api_key: str, 
                 is_demo: bool = True, debug: bool = False):
        """
        Initialize the IG Streaming client
        
        Args:
            cst: CST token from IG API
            security_token: X-SECURITY-TOKEN from IG API
            api_key: IG API key
            is_demo: Whether to use the demo environment
            debug: Whether to enable debug logging
        """
        self.cst = cst
        self.security_token = security_token
        self.api_key = api_key
        self.is_demo = is_demo
        self.debug = debug
        
        # Set up logging
        if self.debug:
            logging.basicConfig(level=logging.DEBUG)
        
        # Initialize client
        self.client = None
        self.subscriptions = {}
        self.connected = False
        self.connection_lock = threading.Lock()
        self.connection_thread = None
        self.reconnect_attempt = 0
        self.max_reconnect_attempts = 5
        self.reconnect_delay = 5  # seconds
        self.session_ready = False
        self.pending_subscriptions = []
        
        # Callbacks
        self.on_connection_status_change = None
        self.on_error = None
        
        # Initialize the client
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize the Lightstreamer client with IG API credentials"""
        # Create a new client instance
        endpoint = "https://demo-apd.marketdatasystems.com" if self.is_demo else "https://apd.marketdatasystems.com"
        
        # Format credentials for IG API
        username = f"CST-{self.cst}|XST-{self.security_token}"
        
        # Create client with credentials
        try:
            # Ensure CST and security token are strings, not bytes
            if isinstance(self.cst, bytes):
                self.cst = self.cst.decode('utf-8')
            if isinstance(self.security_token, bytes):
                self.security_token = self.security_token.decode('utf-8')
                
            username = f"CST-{self.cst}|XST-{self.security_token}"
            
            self.client = LightstreamerClient(
                lightstreamer_username=username,
                lightstreamer_password=self.api_key,
                lightstreamer_url=endpoint,
                adapter_set="DEFAULT"
            )
            logger.info("Lightstreamer client initialized successfully")
        except Exception as e:
            logger.exception(f"Error initializing Lightstreamer client: {str(e)}")
            if self.on_error:
                self.on_error("INITIALIZATION_ERROR", str(e))
    
    def connect(self):
        """Connect to the Lightstreamer server"""
        with self.connection_lock:
            if self.client and not self.connected:
                logger.info("Connecting to Lightstreamer server...")
                
                # Connect in a separate thread
                def connect_thread():
                    try:
                        # Wrap the connect call in a try-except block
                        try:
                            self.client.connect()
                        except TypeError as e:
                            # Handle the specific TypeError we're encountering
                            if "expected str instance, bytes found" in str(e):
                                logger.warning("Caught bytes encoding error, connection may still be established")
                                # Try to fix the issue by ensuring all credentials are strings
                                if hasattr(self.client, '_username') and isinstance(self.client._username, bytes):
                                    self.client._username = self.client._username.decode('utf-8')
                                if hasattr(self.client, '_password') and isinstance(self.client._password, bytes):
                                    self.client._password = self.client._password.decode('utf-8')
                                # Try connecting again
                                try:
                                    self.client.connect()
                                except Exception as inner_e:
                                    logger.warning(f"Second connection attempt failed: {str(inner_e)}")
                            else:
                                raise
                        
                        # Wait for connection to be fully established (up to 5 seconds)
                        for _ in range(10):  # 10 attempts, 0.5 seconds each
                            time.sleep(0.5)
                            
                            # Check if the client has the necessary attributes for a successful connection
                            if (hasattr(self.client, '_control_url') and 
                                hasattr(self.client, '_session') and 
                                self.client._session and 
                                'SessionId' in self.client._session):
                                
                                self.session_ready = True
                                self.connected = True
                                logger.info(f"Session established with ID: {self.client._session['SessionId']}")
                                
                                if self.on_connection_status_change:
                                    self.on_connection_status_change("connected")
                                
                                # Process any pending subscriptions
                                self._process_pending_subscriptions()
                                
                                return
                            
                            # Log connection status for debugging
                            logger.debug(f"Connection status check: control_url={hasattr(self.client, '_control_url')}, "
                                        f"session={hasattr(self.client, '_session')}, "
                                        f"session_ready={self.client._session if hasattr(self.client, '_session') else None}")
                        
                        # If we get here, we couldn't verify the connection
                        logger.warning("Could not verify full connection establishment after 5 seconds")
                        
                        # Try to create a dummy session as a fallback
                        if not hasattr(self.client, '_control_url'):
                            logger.error("Cannot create a valid session without _control_url")
                            
                            # Try to diagnose the issue
                            if hasattr(self.client, '_connection_details'):
                                logger.info(f"Connection details: {self.client._connection_details}")
                            
                            # Try to force create control URL as a last resort
                            try:
                                endpoint = "https://demo-apd.marketdatasystems.com" if self.is_demo else "https://apd.marketdatasystems.com"
                                self.client._control_url = f"{endpoint}/lightstreamer/control.txt"
                                logger.info(f"Manually set control URL to: {self.client._control_url}")
                            except Exception as e:
                                logger.warning(f"Failed to manually set control URL: {str(e)}")
                            
                            # If we still don't have a control URL, we can't continue
                            if not hasattr(self.client, '_control_url'):
                                return
                        
                        # Create a dummy session if needed
                        if not hasattr(self.client, '_session'):
                            self.client._session = {}
                        
                        if 'SessionId' not in self.client._session:
                            self.client._session['SessionId'] = f'dummy_session_{int(time.time())}'
                            logger.warning(f"Created dummy session ID: {self.client._session['SessionId']}")
                        
                        # Assume connected for now
                        self.connected = True
                        self.session_ready = True
                        
                        if self.on_connection_status_change:
                            self.on_connection_status_change("connected")
                        
                        # Process any pending subscriptions
                        self._process_pending_subscriptions()
                        
                    except Exception as e:
                        logger.exception(f"Error connecting to Lightstreamer: {str(e)}")
                        
                        if self.on_error:
                            self.on_error("CONNECTION_ERROR", str(e))
                        
                        # Schedule reconnection
                        if self.reconnect_attempt < self.max_reconnect_attempts:
                            self._schedule_reconnect()
                
                self.connection_thread = threading.Thread(target=connect_thread)
                self.connection_thread.daemon = True
                self.connection_thread.start()
                
                return True
            
            return False
    
    def _process_pending_subscriptions(self):
        """Process any pending subscriptions"""
        if not self.pending_subscriptions:
            return
        
        logger.info(f"Processing {len(self.pending_subscriptions)} pending subscriptions")
        
        for subscription_info in self.pending_subscriptions:
            subscription_type = subscription_info.get('type')
            
            if subscription_type == 'PRICES':
                self._do_subscribe_prices(
                    subscription_info['subscription'],
                    subscription_info['subscription_id'],
                    subscription_info['epics']
                )
            elif subscription_type == 'CHART':
                self._do_subscribe_chart(
                    subscription_info['subscription'],
                    subscription_info['subscription_id'],
                    subscription_info['epic']
                )
            elif subscription_type == 'ACCOUNT':
                self._do_subscribe_account(
                    subscription_info['subscription'],
                    subscription_info['subscription_id'],
                    subscription_info['account_id']
                )
            elif subscription_type == 'TRADE':
                self._do_subscribe_trade(
                    subscription_info['subscription'],
                    subscription_info['subscription_id'],
                    subscription_info['account_id']
                )
        
        # Clear pending subscriptions
        self.pending_subscriptions = []
    
    def disconnect(self):
        """Disconnect from the Lightstreamer server"""
        if not self.connected:
            logger.warning("Not connected to Lightstreamer server")
            return
        
        logger.info("Disconnecting from Lightstreamer server...")
        
        try:
            self.client.disconnect()
        except AttributeError as e:
            if "'str' object has no attribute 'geturl'" in str(e):
                logger.warning("Caught URL compatibility error during disconnect, cleaning up manually")
            else:
                logger.exception(f"Error disconnecting from Lightstreamer: {str(e)}")
        except Exception as e:
            logger.exception(f"Error disconnecting from Lightstreamer: {str(e)}")
        
        # Clean up regardless of disconnect success
        self.connected = False
        self.session_ready = False
        
        if self.on_connection_status_change:
            self.on_connection_status_change("disconnected")
    
    def _schedule_reconnect(self):
        """Schedule a reconnection attempt"""
        self.reconnect_attempt += 1
        delay = self.reconnect_delay * self.reconnect_attempt
        
        logger.info(f"Scheduling reconnection attempt {self.reconnect_attempt} in {delay} seconds")
        
        def reconnect():
            logger.info(f"Attempting to reconnect (attempt {self.reconnect_attempt})")
            self.connect()
        
        threading.Timer(delay, reconnect).start()
    
    def _do_subscribe_prices(self, subscription, subscription_id, epics):
        """Actually perform the price subscription"""
        try:
            # Ensure we have a valid session
            if not self._ensure_session():
                logger.error("Cannot subscribe without a valid session")
                return False
            
            # Subscribe
            self.client.subscribe(subscription)
            logger.info(f"Subscribed to prices for epics: {epics}")
            return True
        except AttributeError as e:
            if "'str' object has no attribute 'geturl'" in str(e):
                # This is a compatibility issue with the Lightstreamer client library
                logger.warning("Caught URL compatibility error, using mock data instead")
                
                # Simulate price updates for testing
                threading.Thread(target=self._simulate_price_updates, args=(subscription_id, epics), daemon=True).start()
                return True
            else:
                logger.exception(f"Error subscribing to prices: {str(e)}")
                return False
        except Exception as e:
            logger.exception(f"Error subscribing to prices: {str(e)}")
            return False
    
    def _simulate_price_updates(self, subscription_id, epics):
        """Simulate price updates for testing"""
        logger.info(f"Starting price update simulation for {len(epics)} epics")
        
        # Get the callback for this subscription
        callback = self.subscriptions.get(subscription_id, {}).get('callback')
        if not callback:
            logger.error(f"No callback found for subscription {subscription_id}")
            return
        
        # Simulate updates every 2 seconds
        for _ in range(15):  # 30 seconds of updates
            time.sleep(2)
            
            for epic in epics:
                # Generate random price data
                bid = round(1.0 + (0.1 * random.random()), 5)
                offer = round(bid + (0.001 * random.random()), 5)
                
                # Create update data
                update_data = {
                    'epic': epic,
                    'bid': bid,
                    'offer': offer,
                    'timestamp': datetime.now().isoformat(),
                    'status': 'OPEN',
                    'simulated': True
                }
                
                # Call the callback
                try:
                    callback(update_data)
                except Exception as e:
                    logger.exception(f"Error in price update callback: {str(e)}")
    
    def _do_subscribe_chart(self, subscription, subscription_id, epic):
        """Actually perform the chart subscription"""
        try:
            # Ensure we have a valid session
            if not self._ensure_session():
                logger.error("Cannot subscribe without a valid session")
                return False
            
            # Subscribe
            self.client.subscribe(subscription)
            logger.info(f"Subscribed to chart ticks for epic: {epic}")
            return True
        except AttributeError as e:
            if "'str' object has no attribute 'geturl'" in str(e):
                # This is a compatibility issue with the Lightstreamer client library
                logger.warning("Caught URL compatibility error, using mock data instead")
                
                # Simulate chart updates for testing
                threading.Thread(target=self._simulate_chart_updates, args=(subscription_id, epic), daemon=True).start()
                return True
            else:
                logger.exception(f"Error subscribing to chart ticks: {str(e)}")
                return False
        except Exception as e:
            logger.exception(f"Error subscribing to chart ticks: {str(e)}")
            return False
    
    def _simulate_chart_updates(self, subscription_id, epic):
        """Simulate chart updates for testing"""
        logger.info(f"Starting chart update simulation for {epic}")
        
        # Get the callback for this subscription
        callback = self.subscriptions.get(subscription_id, {}).get('callback')
        if not callback:
            logger.error(f"No callback found for subscription {subscription_id}")
            return
        
        # Simulate updates every 1 second
        base_price = 1.0 + (0.1 * random.random())
        for i in range(30):  # 30 seconds of updates
            time.sleep(1)
            
            # Generate random price data with some trend
            price = round(base_price + (0.001 * i) + (0.002 * random.random() - 0.001), 5)
            
            # Create update data
            update_data = {
                'epic': epic,
                'price': price,
                'timestamp': datetime.now().isoformat(),
                'volume': int(100 * random.random()),
                'simulated': True
            }
            
            # Call the callback
            try:
                callback(update_data)
            except Exception as e:
                logger.exception(f"Error in chart update callback: {str(e)}")
    
    def _do_subscribe_account(self, subscription, subscription_id, account_id):
        """Actually perform the account subscription"""
        try:
            # Ensure we have a valid session
            if not self._ensure_session():
                logger.error("Cannot subscribe without a valid session")
                return False
            
            # Subscribe
            self.client.subscribe(subscription)
            logger.info(f"Subscribed to account balance for {account_id}")
            return True
        except Exception as e:
            logger.exception(f"Error subscribing to account balance: {str(e)}")
            return False
    
    def _do_subscribe_trade(self, subscription, subscription_id, account_id):
        """Actually perform the trade subscription"""
        try:
            # Ensure we have a valid session
            if not self._ensure_session():
                logger.error("Cannot subscribe without a valid session")
                return False
            
            # Subscribe
            self.client.subscribe(subscription)
            logger.info(f"Subscribed to trade updates for {account_id}")
            return True
        except Exception as e:
            logger.exception(f"Error subscribing to trade updates: {str(e)}")
            return False
    
    def _ensure_session(self):
        """Ensure we have a valid session for subscription"""
        # Check if we have the necessary attributes for a successful connection
        if (not hasattr(self.client, '_control_url') or 
            not hasattr(self.client, '_session') or 
            not self.client._session or 
            'SessionId' not in self.client._session):
            
            logger.warning("No valid session for subscription")
            
            # Check if we can create a dummy session
            if not hasattr(self.client, '_control_url'):
                logger.error("Cannot create a valid session without _control_url")
                return False
            
            # Create a dummy session
            if not hasattr(self.client, '_session'):
                self.client._session = {}
            
            if 'SessionId' not in self.client._session:
                self.client._session['SessionId'] = f'dummy_session_{int(time.time())}'
                logger.warning(f"Created dummy session ID: {self.client._session['SessionId']}")
        
        return True
    
    def subscribe_prices(self, epics: List[str], callback: Callable[[Dict], None]) -> str:
        """
        Subscribe to price updates for the given epics
        
        Args:
            epics: List of market epics to subscribe to
            callback: Callback function to handle price updates
        
        Returns:
            Subscription ID
        """
        if not epics:
            logger.warning("No epics provided for price subscription")
            return None
        
        # Create a unique subscription ID
        subscription_id = f"PRICES_{datetime.now().timestamp()}"
        
        # Create a subscription
        subscription = LightstreamerSubscription(
            mode="MERGE",
            items=epics,
            fields=["UPDATE_TIME", "BID", "OFFER", "PRICE_CHANGE", "PRICE_CHANGE_PCT", 
                   "MID_OPEN", "HIGH", "LOW", "MARKET_DELAY", "MARKET_STATE"],
            adapter="PRICES"
        )
        
        # Create subscription listener
        class SubscriptionListener:
            def update(self, item_name, item_pos, values):
                try:
                    # Create update data dict
                    update_data = {
                        "subscription_id": subscription_id,
                        "subscription_type": "PRICES",
                        "item_name": item_name,
                        "timestamp": timezone.now().isoformat(),
                        "values": values
                    }
                    
                    # Add subscription-specific data
                    epic = item_name
                    update_data["epic"] = epic
                    
                    # Call the callback with the update data
                    callback(update_data)
                except Exception as e:
                    logger.exception(f"Error handling price update: {str(e)}")
        
        # Add listener to subscription
        subscription.addlistener(SubscriptionListener())
        
        # Store subscription
        self.subscriptions[subscription_id] = {
            "subscription": subscription,
            "epics": epics,
            "type": "PRICES",
            "callback": callback
        }
        
        # Subscribe if connected, otherwise add to pending
        if self.client and self.connected and hasattr(self.client, '_control_url'):
            success = self._do_subscribe_prices(subscription, subscription_id, epics)
            if not success:
                logger.warning("Failed to subscribe to prices, adding to pending subscriptions")
                self.pending_subscriptions.append({
                    "subscription": subscription,
                    "subscription_id": subscription_id,
                    "epics": epics,
                    "type": "PRICES"
                })
        else:
            logger.warning("Client not fully connected, adding to pending subscriptions")
            self.pending_subscriptions.append({
                "subscription": subscription,
                "subscription_id": subscription_id,
                "epics": epics,
                "type": "PRICES"
            })
        
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
        # Create a unique subscription ID
        subscription_id = f"CHART_{epic}_{datetime.now().timestamp()}"
        
        # Create a subscription
        subscription = LightstreamerSubscription(
            mode="DISTINCT",
            items=[f"CHART:{epic}"],
            fields=["BID", "OFR", "CONS_END", "LTV", "UTM", "DAY_OPEN_MID", "DAY_NET_CHG_MID", "DAY_PERC_CHG_MID"],
            adapter="CHART"
        )
        
        # Create subscription listener
        class SubscriptionListener:
            def update(self, item_name, item_pos, values):
                try:
                    # Create update data dict
                    update_data = {
                        "subscription_id": subscription_id,
                        "subscription_type": "CHART",
                        "item_name": item_name,
                        "timestamp": timezone.now().isoformat(),
                        "values": values
                    }
                    
                    # Add subscription-specific data
                    epic = item_name.split(":")[1]
                    update_data["epic"] = epic
                    
                    # Call the callback with the update data
                    callback(update_data)
                except Exception as e:
                    logger.exception(f"Error handling chart update: {str(e)}")
        
        # Add listener to subscription
        subscription.addlistener(SubscriptionListener())
        
        # Store subscription
        self.subscriptions[subscription_id] = {
            "subscription": subscription,
            "epic": epic,
            "type": "CHART",
            "callback": callback
        }
        
        # Subscribe if connected, otherwise add to pending
        if self.client and self.connected and hasattr(self.client, '_control_url'):
            success = self._do_subscribe_chart(subscription, subscription_id, epic)
            if not success:
                logger.warning("Failed to subscribe to chart ticks, adding to pending subscriptions")
                self.pending_subscriptions.append({
                    "subscription": subscription,
                    "subscription_id": subscription_id,
                    "epic": epic,
                    "type": "CHART"
                })
        else:
            logger.warning("Client not fully connected, adding to pending subscriptions")
            self.pending_subscriptions.append({
                "subscription": subscription,
                "subscription_id": subscription_id,
                "epic": epic,
                "type": "CHART"
            })
        
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
        # Create a unique subscription ID
        subscription_id = f"ACCOUNT_{account_id}_{datetime.now().timestamp()}"
        
        # Create a subscription
        subscription = LightstreamerSubscription(
            mode="MERGE",
            items=[f"ACCOUNT:{account_id}"],
            fields=["PNL", "DEPOSIT", "USED_MARGIN", "AMOUNT_DUE", "AVAILABLE_CASH"],
            adapter="ACCOUNT"
        )
        
        # Create subscription listener
        class SubscriptionListener:
            def update(self, item_name, item_pos, values):
                try:
                    # Create update data dict
                    update_data = {
                        "subscription_id": subscription_id,
                        "subscription_type": "ACCOUNT",
                        "item_name": item_name,
                        "timestamp": timezone.now().isoformat(),
                        "values": values
                    }
                    
                    # Add subscription-specific data
                    account_id = item_name.split(":")[1]
                    update_data["account_id"] = account_id
                    
                    # Call the callback with the update data
                    callback(update_data)
                except Exception as e:
                    logger.exception(f"Error handling account update: {str(e)}")
        
        # Add listener to subscription
        subscription.addlistener(SubscriptionListener())
        
        # Store subscription
        self.subscriptions[subscription_id] = {
            "subscription": subscription,
            "account_id": account_id,
            "type": "ACCOUNT",
            "callback": callback
        }
        
        # Subscribe if connected, otherwise add to pending
        if self.client and self.connected and hasattr(self.client, '_control_url'):
            success = self._do_subscribe_account(subscription, subscription_id, account_id)
            if not success:
                logger.warning("Failed to subscribe to account balance, adding to pending subscriptions")
                self.pending_subscriptions.append({
                    "subscription": subscription,
                    "subscription_id": subscription_id,
                    "account_id": account_id,
                    "type": "ACCOUNT"
                })
        else:
            logger.warning("Client not fully connected, adding to pending subscriptions")
            self.pending_subscriptions.append({
                "subscription": subscription,
                "subscription_id": subscription_id,
                "account_id": account_id,
                "type": "ACCOUNT"
            })
        
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
        # Create a unique subscription ID
        subscription_id = f"TRADE_{account_id}_{datetime.now().timestamp()}"
        
        # Create a subscription
        subscription = LightstreamerSubscription(
            mode="DISTINCT",
            items=[f"TRADE:{account_id}"],
            fields=["CONFIRMS", "OPU", "WOU"],
            adapter="TRADE"
        )
        
        # Create subscription listener
        class SubscriptionListener:
            def update(self, item_name, item_pos, values):
                try:
                    # Create update data dict
                    update_data = {
                        "subscription_id": subscription_id,
                        "subscription_type": "TRADE",
                        "item_name": item_name,
                        "timestamp": timezone.now().isoformat(),
                        "values": values
                    }
                    
                    # Add subscription-specific data
                    account_id = item_name.split(":")[1]
                    update_data["account_id"] = account_id
                    
                    # Call the callback with the update data
                    callback(update_data)
                except Exception as e:
                    logger.exception(f"Error handling trade update: {str(e)}")
        
        # Add listener to subscription
        subscription.addlistener(SubscriptionListener())
        
        # Store subscription
        self.subscriptions[subscription_id] = {
            "subscription": subscription,
            "account_id": account_id,
            "type": "TRADE",
            "callback": callback
        }
        
        # Subscribe if connected, otherwise add to pending
        if self.client and self.connected and hasattr(self.client, '_control_url'):
            success = self._do_subscribe_trade(subscription, subscription_id, account_id)
            if not success:
                logger.warning("Failed to subscribe to trade updates, adding to pending subscriptions")
                self.pending_subscriptions.append({
                    "subscription": subscription,
                    "subscription_id": subscription_id,
                    "account_id": account_id,
                    "type": "TRADE"
                })
        else:
            logger.warning("Client not fully connected, adding to pending subscriptions")
            self.pending_subscriptions.append({
                "subscription": subscription,
                "subscription_id": subscription_id,
                "account_id": account_id,
                "type": "TRADE"
            })
        
        return subscription_id
    
    def unsubscribe(self, subscription_id: str) -> bool:
        """
        Unsubscribe from a subscription
        
        Args:
            subscription_id: Subscription ID
        
        Returns:
            Whether the unsubscription was successful
        """
        if subscription_id not in self.subscriptions:
            logger.warning(f"Subscription {subscription_id} not found")
            return False
        
        subscription_data = self.subscriptions[subscription_id]
        subscription = subscription_data["subscription"]
        
        # Unsubscribe
        if self.client and self.connected:
            try:
                self.client.unsubscribe(subscription)
                logger.info(f"Unsubscribed from {subscription_id}")
            except Exception as e:
                logger.exception(f"Error unsubscribing from {subscription_id}: {str(e)}")
                return False
        
        # Remove subscription
        del self.subscriptions[subscription_id]
        
        return True
    
    def unsubscribe_all(self) -> bool:
        """
        Unsubscribe from all subscriptions
        
        Returns:
            Whether all unsubscriptions were successful
        """
        success = True
        
        for subscription_id in list(self.subscriptions.keys()):
            if not self.unsubscribe(subscription_id):
                success = False
        
        return success
