import { LightstreamerClient } from 'lightstreamer-client-web';

// Lightstreamer error codes and their descriptions
export const LIGHTSTREAMER_ERRORS = {
  '1': 'Generic error',
  '2': 'Requested Adapter Set not available',
  '7': 'Licensed maximum number of sessions reached',
  '8': 'Configured maximum number of sessions reached',
  '9': 'Configured maximum server load reached',
  '10': 'New sessions temporarily blocked',
  '11': 'Streaming not available',
  '21': 'Bad credentials',
  '32': 'No such table',
  '33': 'Generic subscription error',
  '34': 'Tables overflow',
  '35': 'Bad subscription',
  '66': 'Access denied',
  '68': 'Invalid session',
  '71': 'Streaming not available for current adapter set'
} as const;

export type LightstreamerErrorCode = keyof typeof LIGHTSTREAMER_ERRORS;

export class IGStreamingConnection {
  private client: LightstreamerClient | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 3;
  private reconnectDelay: number = 5000;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private lastError: { code: string; message: string } | null = null;
  private connectionStatusCallbacks: ((status: boolean) => void)[] = [];

  onConnectionStatusChange(callback: (status: boolean) => void): void {
    this.connectionStatusCallbacks.push(callback);
    // Immediately notify of current status
    callback(this.isConnected);
  }

  initialize(cst: string, xSecurityToken: string, accountId: string, lightstreamerEndpoint: string): void {
    try {
      this.cleanup();
      this.client = new LightstreamerClient(lightstreamerEndpoint, 'DEMO');
      this.client.connectionDetails.setUser(accountId);
      this.client.connectionDetails.setPassword(`CST-${cst}|XST-${xSecurityToken}`);

      this.client.addListener({
        onStatusChange: (status: string) => {
          const newConnectionState = status === 'CONNECTED:WS-STREAMING';
          if (newConnectionState !== this.isConnected) {
            this.isConnected = newConnectionState;
            this.notifyConnectionStatusChange();
            
            if (this.isConnected) {
              console.log('Successfully connected to Lightstreamer');
              this.reconnectAttempts = 0;
              this.lastError = null;
            }
          }
        },
        onServerError: (code: number, message: string) => this.handleServerError(code, message)
      });

      this.client.connect();
    } catch (error) {
      console.error('Error initializing Lightstreamer client:', error);
      this.handleConnectionFailure();
    }
  }

  private handleServerError(code: number, message: string): void {
    const errorCode = code.toString() as LightstreamerErrorCode;
    const errorDescription = LIGHTSTREAMER_ERRORS[errorCode] || 'Unknown error';
    this.lastError = { code: errorCode, message };
    
    console.error(`Lightstreamer server error: ${code} - ${errorDescription}`);
    console.error('Error details:', message);

    switch (errorCode) {
      case '2':
      case '71':
        console.warn('Streaming service unavailable, falling back to mock data');
        this.handleConnectionFailure();
        break;
      
      case '21':
      case '66':
      case '68':
        console.error('Authentication error, please check your credentials');
        this.cleanup();
        break;
      
      default:
        if (this.shouldAttemptReconnect()) {
          this.scheduleReconnect();
        } else {
          console.warn('Max reconnection attempts reached, falling back to mock data');
          this.handleConnectionFailure();
        }
    }
  }

  private shouldAttemptReconnect(): boolean {
    return this.reconnectAttempts < this.maxReconnectAttempts && !this.reconnectTimer;
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++;
      console.log(`Attempting reconnection (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      try {
        this.client?.connect();
      } catch (error) {
        console.error('Error during reconnection attempt:', error);
        if (this.shouldAttemptReconnect()) {
          this.scheduleReconnect();
        } else {
          this.handleConnectionFailure();
        }
      }
      
      this.reconnectTimer = null;
    }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1));
  }

  private handleConnectionFailure(): void {
    this.cleanup();
    this.notifyConnectionStatusChange();
  }

  private notifyConnectionStatusChange(): void {
    this.connectionStatusCallbacks.forEach(callback => callback(this.isConnected));
  }

  cleanup(): void {
    if (this.client) {
      try {
        this.client.disconnect();
      } catch (error) {
        console.error('Error disconnecting client:', error);
      }
      this.client = null;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.reconnectAttempts = 0;
    this.isConnected = false;
    this.notifyConnectionStatusChange();
  }

  getClient(): LightstreamerClient | null {
    return this.client;
  }

  isClientConnected(): boolean {
    return this.isConnected;
  }
}
