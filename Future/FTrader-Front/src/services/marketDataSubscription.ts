import { Subscription, LightstreamerClient } from 'lightstreamer-client-web';
import { MarketUpdate, MarketUpdateCallback } from './igStreamingTypes';
import { generateMockMarketUpdate } from './igStreamingMocks';
import { MARKET_FIELDS } from './igStreamingFields';

export class MarketDataSubscription {
  private subscriptions: Map<string, Subscription> = new Map();
  private callbacks: Map<string, MarketUpdateCallback[]> = new Map();
  private mockIntervals: Map<string, NodeJS.Timeout> = new Map();
  private subscriptionAttempts: Map<string, number> = new Map();
  private readonly MAX_ATTEMPTS = 3;
  
  // Define different subscription format strategies based on epic type
  private readonly SUBSCRIPTION_FORMATS = {
    // Formats for indices (IX.*)
    indices: [
      (epic: string, accountId: string) => `CHART:${epic}`,                      // Format 1: CHART prefix (seems to work better for indices)
      (epic: string, accountId: string) => `MARKET:${epic}`,                     // Format 2: MARKET prefix
      (epic: string, accountId: string) => `IX:${epic.substring(3)}`,            // Format 3: IX prefix with epic suffix
      (epic: string, accountId: string) => epic                                  // Format 4: Raw epic (fallback)
    ],
    
    // Formats for standard markets
    standard: [
      (epic: string, accountId: string) => `MARKET:${epic}`,                     // Format 1: MARKET prefix
      (epic: string, accountId: string) => `MARKET_V4:${accountId}:${epic}`,     // Format 2: MARKET_V4 format with account
      (epic: string, accountId: string) => `V2-F-${MARKET_FIELDS.join(',')}|${epic}`, // Format 3: V2-F format with fields
      (epic: string, accountId: string) => epic                                  // Format 4: Raw epic (fallback)
    ]
  };

  /**
   * Subscribe to market data for a specific epic
   * @param epic The epic to subscribe to
   * @param callback The callback to call when an update is received
   * @param client The Lightstreamer client to use for the subscription
   * @param accountId The account ID to use for the subscription
   */
  public subscribe(
    epic: string,
    callback: MarketUpdateCallback,
    client: LightstreamerClient | null,
    accountId: string
  ): void {
    // Store the callback
    if (!this.callbacks.has(epic)) {
      this.callbacks.set(epic, []);
    }
    this.callbacks.get(epic)?.push(callback);

    // If we already have a subscription for this epic, no need to create another one
    if (this.subscriptions.has(epic)) {
      return;
    }

    // If we don't have a client, use mock data
    if (!client) {
      console.warn(`No Lightstreamer client available for ${epic}, using mock data`);
      const interval = setInterval(() => {
        this.callbacks.get(epic)?.forEach(cb => cb(generateMockMarketUpdate(epic)));
      }, 1000);
      this.mockIntervals.set(epic, interval);
      return;
    }

    // Initialize subscription attempts counter
    this.subscriptionAttempts.set(epic, 0);

    // Create a subscription
    this.createSubscription(epic, client, accountId);
  }

  private createSubscription(epic: string, client: LightstreamerClient, accountId: string): void {
    const attempts = this.subscriptionAttempts.get(epic) || 0;
    
    if (attempts >= this.MAX_ATTEMPTS) {
      console.warn(`Maximum subscription attempts reached for ${epic}, falling back to mock data`);
      const interval = setInterval(() => {
        this.callbacks.get(epic)?.forEach(cb => cb(generateMockMarketUpdate(epic)));
      }, 1000);
      this.mockIntervals.set(epic, interval);
      return;
    }

    // Choose the appropriate format array based on the epic type
    const formatArray = epic.startsWith('IX.') 
      ? this.SUBSCRIPTION_FORMATS.indices 
      : this.SUBSCRIPTION_FORMATS.standard;
    
    // Choose the format based on the current attempt
    let formatIndex = attempts % formatArray.length;
    const formatFn = formatArray[formatIndex];
    const itemName = formatFn(epic, accountId);
    
    console.log(`Attempt ${attempts + 1}/${this.MAX_ATTEMPTS} - Creating subscription with item name: ${itemName} for epic ${epic}`);
    
    const subscription = new Subscription(
      'MERGE',  // Use MERGE mode for market data
      itemName, // Use the formatted item name
      MARKET_FIELDS
    );

    subscription.setRequestedSnapshot('yes');
    
    subscription.addListener({
      onSubscription: () => {
        console.log(`Successfully subscribed to ${epic} with item name ${itemName}`);
        // Reset attempts on success
        this.subscriptionAttempts.set(epic, 0);
      },
      onSubscriptionError: (code: number, message: string) => {
        console.error(`Subscription error for ${epic} with item name ${itemName}: ${code} - ${message}`);
        
        // Increment attempt counter
        this.subscriptionAttempts.set(epic, attempts + 1);
        
        // Handle specific error codes
        if (code === 17 || code === 21 || code === 16 || code === 16384 || code === 2) {
          console.warn(`Data adapter or group error detected (${code} - ${message}), trying alternative format`);
          
          // Try next format
          this.createSubscription(epic, client, accountId);
        } else {
          // For other errors, fall back to mock data
          console.warn(`Unrecoverable error (${code} - ${message}), falling back to mock data`);
          const interval = setInterval(() => {
            this.callbacks.get(epic)?.forEach(cb => cb(generateMockMarketUpdate(epic)));
          }, 1000);
          this.mockIntervals.set(epic, interval);
        }
      },
      onItemUpdate: (update: any) => {
        console.log(`Received update for ${epic} with item name ${itemName}:`, update.getValue('BID'), update.getValue('OFFER'));
        this.processUpdate(update, epic);
      },
      onUnsubscription: () => {
        console.log(`Unsubscribed from ${epic} with item name ${itemName}`);
      }
    });

    // Add the subscription to the client
    try {
      client.subscribe(subscription);
      console.log(`Subscription request sent for ${epic} with item name ${itemName}`);
    } catch (error) {
      console.error(`Error subscribing to ${epic} with item name ${itemName}:`, error);
      // Increment attempt counter and try next format
      this.subscriptionAttempts.set(epic, attempts + 1);
      this.createSubscription(epic, client, accountId);
    }
    
    // Store the subscription
    this.subscriptions.set(epic, subscription);
  }

  private processUpdate(update: any, epic: string): void {
    // Log the raw update for debugging
    console.log(`Processing update for ${epic}:`, {
      bid: update.getValue('BID'),
      offer: update.getValue('OFFER'),
      change: update.getValue('CHANGE'),
      changePct: update.getValue('CHANGE_PCT')
    });
    
    // Convert the update to a MarketUpdate object
    const marketUpdate: MarketUpdate = {
      epic: epic,
      marketId: update.getValue('MARKET_ID') || epic,
      bid: parseFloat(update.getValue('BID') || '0'),
      offer: parseFloat(update.getValue('OFFER') || '0'),
      high: parseFloat(update.getValue('HIGH') || '0'),
      low: parseFloat(update.getValue('LOW') || '0'),
      change: parseFloat(update.getValue('CHANGE') || '0'),
      changePct: parseFloat(update.getValue('CHANGE_PCT') || '0'),
      updateTime: update.getValue('UPDATE_TIME') || '',
      marketState: update.getValue('MARKET_STATE') || '',
      marketDelay: parseInt(update.getValue('MARKET_DELAY') || '0'),
      midOpen: parseFloat(update.getValue('MID_OPEN') || '0'),
      timestamp: new Date().toISOString()
    };

    // Call all callbacks for this epic
    this.callbacks.get(epic)?.forEach(callback => callback(marketUpdate));
  }

  /**
   * Unsubscribe from market data for a specific epic
   * @param epic The epic to unsubscribe from
   * @param callback The callback to remove
   * @param client The Lightstreamer client to use for the unsubscription
   */
  public unsubscribe(
    epic: string,
    callback: MarketUpdateCallback,
    client: LightstreamerClient | null
  ): void {
    // Remove the callback
    const callbacks = this.callbacks.get(epic);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }

      // If there are no more callbacks for this epic, remove the subscription
      if (callbacks.length === 0) {
        this.callbacks.delete(epic);

        // Clear the mock interval if it exists
        const interval = this.mockIntervals.get(epic);
        if (interval) {
          clearInterval(interval);
          this.mockIntervals.delete(epic);
        }

        // Unsubscribe from the Lightstreamer subscription if it exists
        const subscription = this.subscriptions.get(epic);
        if (subscription && client) {
          client.unsubscribe(subscription);
          this.subscriptions.delete(epic);
        }
      }
    }
  }

  /**
   * Clean up all subscriptions
   */
  public cleanup(): void {
    // Clear all mock intervals
    this.mockIntervals.forEach(interval => clearInterval(interval));
    this.mockIntervals.clear();

    // Clear all callbacks
    this.callbacks.clear();

    // Clear all subscriptions (the client will unsubscribe from them when it's disconnected)
    this.subscriptions.clear();
  }
}
