import { LightstreamerClient } from 'lightstreamer-client-web';
import { LightstreamerErrorCode, LIGHTSTREAMER_ERRORS } from './igStreamingErrors';
import { MarketDataSubscription } from './marketDataSubscription';
import { ChartDataSubscription } from './chartDataSubscription';
import { MarketUpdateCallback, ChartUpdateCallback } from './igStreamingTypes';

export interface StreamingError {
  code: string;
  message: string;
  description: string;
  timestamp: string;
  recoverable: boolean;
  type: 'CONNECTION_ERROR' | 'AUTH_ERROR' | 'INTERNAL_ERROR' | 'UNKNOWN_ERROR';
}

class IGStreamingService {
  private client: LightstreamerClient | null = null;
  private isConnected: boolean = false;
  private connectionStatusCallbacks: ((status: boolean) => void)[] = [];
  private errorCallbacks: ((error: StreamingError) => void)[] = [];
  private marketData: MarketDataSubscription;
  private chartData: ChartDataSubscription;
  private currentError: StreamingError | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 3;
  private adapterSets = ['DEFAULT', 'DEMO', 'STREAMING'];
  private currentAdapterSetIndex = 0;
  private accountId: string | null = null;

  constructor() {
    this.marketData = new MarketDataSubscription();
    this.chartData = new ChartDataSubscription();
  }

  onConnectionStatusChange(callback: (status: boolean) => void): void {
    this.connectionStatusCallbacks.push(callback);
    callback(this.isConnected);
  }

  onError(callback: (error: StreamingError) => void): void {
    this.errorCallbacks.push(callback);
    if (this.currentError) {
      callback(this.currentError);
    }
  }

  initialize(cst: string, xSecurityToken: string, accountId: string, lightstreamerEndpoint: string): void {
    try {
      this.cleanup();
      
      // Extract base URL without any path to avoid duplicate paths
      const baseUrl = new URL(lightstreamerEndpoint);
      const endpoint = baseUrl.origin; // This will give us just protocol://host without any path
      
      // Validate account ID format
      if (!accountId || typeof accountId !== 'string' || accountId.length < 3) {
        throw new Error(`Invalid account ID format: ${accountId}. Please check your account configuration.`);
      }
      
      console.log('Streaming connection details:', {
        endpoint,
        accountId,
        tokens: {
          cst: cst ? 'Present' : 'Missing',
          xst: xSecurityToken ? 'Present' : 'Missing'
        },
        attempt: this.reconnectAttempts + 1,
        maxAttempts: this.maxReconnectAttempts
      });
      
      // Initialize with IG's adapter set
      const adapterSet = this.adapterSets[this.currentAdapterSetIndex];
      console.log('Using adapter set:', adapterSet);
      this.client = new LightstreamerClient(endpoint, adapterSet);
      
      // Format credentials exactly as in IG's example
      if (!cst || !xSecurityToken) {
        console.error('Missing authentication tokens:', {
          endpoint: lightstreamerEndpoint,
          user: accountId,
          tokens: {
            cst: cst ? 'Present' : 'Missing',
            xst: xSecurityToken ? 'Present' : 'Missing'
          },
          attempt: this.reconnectAttempts + 1,
          maxAttempts: this.maxReconnectAttempts
        });
        const error: StreamingError = {
          code: 'AUTH_ERROR',
          message: 'Authentication Failed',
          description: 'Missing authentication tokens. Please log in again.',
          timestamp: new Date().toISOString(),
          recoverable: false,
          type: 'AUTH_ERROR'
        };
        this.handleFatalError(error);
        return;
      }

      try {
        // Format credentials exactly as required by IG's Lightstreamer API
        const password = `CST-${cst}|XST-${xSecurityToken}`;
        console.log('Setting connection credentials:', {
          user: accountId,
          passwordFormat: 'CST-***|XST-***'
        });
        this.client.connectionDetails.setUser(accountId);
        this.client.connectionDetails.setPassword(password);
        this.accountId = accountId;
      } catch (error) {
        console.error('Failed to format authentication tokens:', error);
        console.error('Token details:', {
          endpoint: lightstreamerEndpoint,
          user: accountId,
          tokens: {
            cst: cst ? 'Present' : 'Missing',
            xst: xSecurityToken ? 'Present' : 'Missing'
          },
          error: error.message,
          attempt: this.reconnectAttempts + 1,
          maxAttempts: this.maxReconnectAttempts
        });
        const streamingError: StreamingError = {
          code: 'AUTH_ERROR',
          message: 'Authentication Failed',
          description: `Failed to format authentication tokens: ${error.message}. Please check your credentials and try again.`,
          timestamp: new Date().toISOString(),
          recoverable: false,
          type: 'AUTH_ERROR'
        };
        this.handleFatalError(streamingError);
        return;
      }
      
      // Configure connection options
      this.client.connectionOptions.setForcedTransport("WS");
      this.client.connectionOptions.setRequestedMaxBandwidth(40);
      
      this.client.addListener({
        onListenStart: () => {
          console.log('Lightstreamer client - start listening', {
            endpoint: this.client?.connectionDetails.getServerAddress(),
            adapterSet: this.client?.connectionDetails.getAdapterSet(),
            user: this.client?.connectionDetails.getUser(),
            attempt: this.reconnectAttempts + 1,
            maxAttempts: this.maxReconnectAttempts
          });
        },
        onStatusChange: (status: string) => {
          const connectionDetails = {
            endpoint: this.client?.connectionDetails.getServerAddress(),
            adapterSet: this.client?.connectionDetails.getAdapterSet(),
            user: this.client?.connectionDetails.getUser(),
            attempt: this.reconnectAttempts + 1,
            maxAttempts: this.maxReconnectAttempts
          };
          console.log('Lightstreamer connection status:', status, connectionDetails);
          
          const newConnectionState = status.indexOf('CONNECTED:') !== -1;
          if (newConnectionState !== this.isConnected) {
            this.isConnected = newConnectionState;
            if (newConnectionState) {
              console.log('Successfully connected to Lightstreamer', connectionDetails);
              this.currentError = null;
              this.notifyErrorState(null);
            } else {
              console.error('Lost connection to Lightstreamer:', status, connectionDetails);
              const error: StreamingError = {
                code: 'CONNECTION_LOST',
                message: 'Connection Lost',
                description: `Lost connection to streaming service: ${status}. Please check your network connection and try again.`,
                timestamp: new Date().toISOString(),
                recoverable: false,
                type: 'CONNECTION_ERROR'
              };
              this.handleFatalError(error);
            }
            this.notifyConnectionStatusChange();
          }
        },
        onServerError: (code: number, message: string) => {
          const errorCode = code.toString() as LightstreamerErrorCode;
          const connectionDetails = {
            endpoint: this.client?.connectionDetails.getServerAddress(),
            adapterSet: this.client?.connectionDetails.getAdapterSet(),
            user: this.client?.connectionDetails.getUser(),
            attempt: this.reconnectAttempts + 1,
            maxAttempts: this.maxReconnectAttempts
          };
          
          // Log detailed error information for debugging
          console.error('Lightstreamer server error:', {
            code: errorCode,
            message,
            details: connectionDetails
          });

          // Handle adapter set errors first
          if (message.includes('Adapter Set not available')) {
            // Try next adapter set
            this.currentAdapterSetIndex++;
            if (this.currentAdapterSetIndex < this.adapterSets.length) {
              const nextAdapter = this.adapterSets[this.currentAdapterSetIndex];
              console.log(`Trying next adapter set: ${nextAdapter}`, connectionDetails);
              if (this.client) {
                this.client.connectionDetails.setAdapterSet(nextAdapter);
                this.client.connect();
                return;
              }
            }
            
            // All adapter sets failed
            const error: StreamingError = {
              code: errorCode,
              message: 'Connection Failed',
              description: `Unable to connect to streaming service: No valid adapter set found (tried ${this.adapterSets.join(', ')}). Please check your account configuration.`,
              timestamp: new Date().toISOString(),
              recoverable: false,
              type: 'CONNECTION_ERROR'
            };
            this.handleFatalError(error);
            return;
          }

          // Handle other known error cases
          let error: StreamingError;
          switch (errorCode) {
            case '2': // Connection error
              error = {
                code: errorCode,
                message: 'Connection Failed',
                description: 'Unable to establish a secure connection to the streaming service. Please check your network connection and try again.',
                timestamp: new Date().toISOString(),
                recoverable: true,
                type: 'CONNECTION_ERROR'
              };
              break;

            case '71': // Streaming not available
              console.error('Streaming service unavailable:', { ...connectionDetails, message: LIGHTSTREAMER_ERRORS[errorCode] });
              error = {
                code: errorCode,
                message: 'Connection Failed',
                description: `${LIGHTSTREAMER_ERRORS[errorCode]}. Please check your network connection and try again.`,
                timestamp: new Date().toISOString(),
                recoverable: false,
                type: 'CONNECTION_ERROR'
              };
              break;

            case '21': // Bad credentials
            case '66': // Access denied
            case '68': // Invalid session
              console.error('Authentication error:', { ...connectionDetails, message: LIGHTSTREAMER_ERRORS[errorCode] });
              error = {
                code: errorCode,
                message: 'Authentication Failed',
                description: `Authentication error (${LIGHTSTREAMER_ERRORS[errorCode]}). Please check your credentials and try logging in again.`,
                timestamp: new Date().toISOString(),
                recoverable: false,
                type: 'AUTH_ERROR'
              };
              break;

            default:
              console.error('Unexpected streaming error:', {
                ...connectionDetails,
                message: LIGHTSTREAMER_ERRORS[errorCode] || 'Unknown error'
              });
              error = {
                code: errorCode,
                message: 'Connection Failed',
                description: `${LIGHTSTREAMER_ERRORS[errorCode] || 'Unexpected streaming error'}. Please check your network connection and try again.`,
                timestamp: new Date().toISOString(),
                recoverable: false,
                type: 'INTERNAL_ERROR'
              };
          }
          this.handleFatalError(error);
        }
      });

      console.log('Connecting to Lightstreamer...');
      this.client.connect();
    } catch (error) {
      console.error('Error initializing Lightstreamer client:', error);
      console.error('Connection details:', {
        endpoint: lightstreamerEndpoint,
        adapterSet: this.client?.connectionDetails.getAdapterSet(),
        user: accountId,
        attempt: this.reconnectAttempts + 1,
        maxAttempts: this.maxReconnectAttempts,
        tokens: {
          cst: cst ? 'Present' : 'Missing',
          xst: xSecurityToken ? 'Present' : 'Missing'
        }
      });
      const streamingError: StreamingError = {
        code: 'INIT_ERROR',
        message: 'Connection Failed',
        description: `Failed to initialize streaming service: ${error.message}. Please check your network connection and try again.`,
        timestamp: new Date().toISOString(),
        recoverable: false,
        type: 'INTERNAL_ERROR'
      };
      this.handleFatalError(streamingError);
    }
  }

  private handleFatalError(error: StreamingError): void {
    console.error('Fatal streaming error:', error);
    this.currentError = error;
    this.cleanup();
    this.notifyErrorState(error);
  }

  private cleanup(): void {
    if (this.client) {
      try {
        this.client.disconnect();
      } catch (error) {
        console.error('Error disconnecting client:', error);
      }
      this.client = null;
    }
    this.isConnected = false;
    this.notifyConnectionStatusChange();
    this.marketData.cleanup();
    this.chartData.cleanup();
  }

  private notifyConnectionStatusChange(): void {
    this.connectionStatusCallbacks.forEach(cb => cb(this.isConnected));
  }

  private notifyErrorState(error: StreamingError | null): void {
    if (error) {
      this.errorCallbacks.forEach(cb => cb(error));
    }
  }

  /**
   * Get the current connection status
   * @returns True if connected, false otherwise
   */
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  /**
   * Get the current error if any
   * @returns The current error or null if no error
   */
  getCurrentError(): StreamingError | null {
    return this.currentError;
  }

  subscribeToMarketData(epic: string, callback: MarketUpdateCallback): void {
    this.marketData.subscribe(epic, callback, this.client, this.accountId || '');
  }

  unsubscribeFromMarketData(epic: string, callback: MarketUpdateCallback): void {
    this.marketData.unsubscribe(epic, callback, this.client);
  }

  /**
   * Subscribe to chart data for a specific epic and resolution
   * @param epic The epic to subscribe to
   * @param resolution The chart resolution (e.g., 'MINUTE', 'HOUR', 'DAY')
   * @param callback The callback to call when an update is received
   */
  subscribeToChartData(epic: string, resolution: string, callback: ChartUpdateCallback): void {
    try {
      if (!epic) {
        console.error('Cannot subscribe to chart data: Missing epic');
        return;
      }
      
      if (!resolution) {
        console.error('Cannot subscribe to chart data: Missing resolution');
        return;
      }
      
      console.log(`Subscribing to chart data for ${epic} with resolution ${resolution}`);
      
      // Check if client is initialized
      if (!this.client || !this.isConnected) {
        console.warn(`Lightstreamer client not initialized or not connected for chart data subscription: ${epic}:${resolution}, using mock data`);
        // Still subscribe, which will trigger mock data generation in the ChartDataSubscription class
      }
      
      this.chartData.subscribe(epic, resolution, callback, this.client);
    } catch (error) {
      console.error(`Error subscribing to chart data for ${epic}:${resolution}:`, error);
      // Still try to subscribe, which will trigger mock data generation in case of error
      this.chartData.subscribe(epic, resolution, callback, null);
    }
  }

  /**
   * Unsubscribe from chart data for a specific epic and resolution
   * @param epic The epic to unsubscribe from
   * @param resolution The chart resolution (e.g., 'MINUTE', 'HOUR', 'DAY')
   * @param callback The callback to remove
   */
  unsubscribeFromChartData(epic: string, resolution: string, callback: ChartUpdateCallback): void {
    try {
      if (!epic || !resolution) {
        console.error('Cannot unsubscribe from chart data: Missing epic or resolution');
        return;
      }
      
      console.log(`Unsubscribing from chart data for ${epic} with resolution ${resolution}`);
      
      // Check if client is initialized
      if (!this.client) {
        console.warn(`Lightstreamer client not initialized for chart data unsubscription: ${epic}:${resolution}`);
        // Still try to unsubscribe to clean up any mock data intervals
      }
      
      this.chartData.unsubscribe(epic, resolution, callback, this.client);
    } catch (error) {
      console.error(`Error unsubscribing from chart data for ${epic}:${resolution}:`, error);
      // Still try to unsubscribe with null client to clean up resources
      this.chartData.unsubscribe(epic, resolution, callback, null);
    }
  }

  /**
   * Subscribe to order book data for a specific epic
   * @param epic The epic to subscribe to
   * @param callback The callback to call when an update is received
   */
  subscribeToOrderBook(epic: string, callback: any): void {
    try {
      if (!epic) {
        console.error('Cannot subscribe to order book: Missing epic');
        return;
      }
      
      console.log(`Order book subscription for ${epic}`);
      
      // Check if client is initialized
      if (!this.client || !this.isConnected) {
        console.warn(`Lightstreamer client not initialized or not connected for order book subscription: ${epic}, using mock data`);
      }
      
      // For now, we'll simulate order book data with market data
      // This is a temporary solution until we implement a proper OrderBookSubscription class
      console.log(`Using market data as fallback for order book data: ${epic}`);
      this.marketData.subscribe(epic, (marketUpdate) => {
        try {
          // Convert market update to a simple order book update
          const orderBookUpdate = {
            epic: marketUpdate.epic,
            timestamp: marketUpdate.timestamp || new Date().toISOString(),
            level: 1,
            bidPrice: marketUpdate.bid,
            bidSize: Math.floor(Math.random() * 100) + 1, // Random size between 1-100
            offerPrice: marketUpdate.offer,
            offerSize: Math.floor(Math.random() * 100) + 1 // Random size between 1-100
          };
          callback(orderBookUpdate);
        } catch (error) {
          console.error(`Error processing order book update for ${epic}:`, error);
        }
      }, this.client, this.accountId || '');
    } catch (error) {
      console.error(`Error subscribing to order book for ${epic}:`, error);
    }
  }

  /**
   * Unsubscribe from order book data for a specific epic
   * @param epic The epic to unsubscribe from
   */
  unsubscribeFromOrderBook(epic: string): void {
    try {
      if (!epic) {
        console.error('Cannot unsubscribe from order book: Missing epic');
        return;
      }
      
      console.log(`Order book unsubscription for ${epic}`);
      
      // Since we're using market data as a fallback, we don't need to do anything special here
      // The actual unsubscription will happen when the component unmounts and calls unsubscribeFromMarketData
      console.log(`No specific action needed for order book unsubscription: ${epic}`);
    } catch (error) {
      console.error(`Error unsubscribing from order book for ${epic}:`, error);
    }
  }
}

const igStreamingService = new IGStreamingService();
export default igStreamingService;
