import axios from 'axios';

// Define types for IG API responses
export interface AuthResponse {
  accountId: string;
  clientId: string;
  lightstreamerEndpoint: string;
  cst: string;
  xSecurityToken: string;
  oauthToken: string;
}

export interface AccountDetails {
  accountId: string;
  accountName: string;
  accountType: string;
  balance: number;
  available: number;
  deposit: number;
  profitLoss: number;
}

// Define credentials interface for streaming
export interface IGCredentials {
  cst: string;
  securityToken: string;
  accountId: string;
}

class IGAuthService {
  private baseUrl: string = 'https://demo-api.ig.com/gateway/deal';
  private apiKey: string = '55fbe8c5d57b0e642ddf6b4b34cc5414dc55c952'; // Using your actual API key from .env
  private isAuthenticated: boolean = false;
  private authData: AuthResponse | null = null;
  private accountDetails: AccountDetails | null = null;
  private connectionAttempts: number = 0;
  private maxConnectionAttempts: number = 3;
  private useProxy: boolean = true; // Default to using proxy in containerized environment
  private storageKey: string = 'ig_auth_data';

  constructor() {
    // Try to restore auth data from localStorage on initialization
    this.restoreAuthData();
  }

  // Save auth data to localStorage
  private saveAuthData(): void {
    if (this.authData) {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify({
          authData: this.authData,
          isAuthenticated: this.isAuthenticated
        }));
        console.log('Auth data saved to localStorage');
      } catch (error) {
        console.error('Failed to save auth data to localStorage:', error);
      }
    }
  }

  // Restore auth data from localStorage
  private restoreAuthData(): void {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        this.authData = parsedData.authData;
        this.isAuthenticated = parsedData.isAuthenticated;
        console.log('Auth data restored from localStorage');
      }
    } catch (error) {
      console.error('Failed to restore auth data from localStorage:', error);
      // Clear potentially corrupted data
      localStorage.removeItem(this.storageKey);
    }
  }

  // Clear auth data from localStorage
  private clearAuthData(): void {
    try {
      localStorage.removeItem(this.storageKey);
      console.log('Auth data cleared from localStorage');
    } catch (error) {
      console.error('Failed to clear auth data from localStorage:', error);
    }
  }

  // Check if user is authenticated
  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  // Get authentication data
  getAuthData(): AuthResponse | null {
    return this.authData;
  }

  // Get account details
  getAccountDetails(): AccountDetails | null {
    return this.accountDetails;
  }

  // Reset connection attempts counter
  resetConnectionAttempts(): void {
    this.connectionAttempts = 0;
  }

  // Check authentication status - returns a promise
  async checkAuthStatus(): Promise<boolean> {
    // If we already know we're authenticated, return true
    if (this.isAuthenticated && this.authData) {
      return true;
    }

    // Try to validate the session
    try {
      // If we have auth data, try to fetch account details to verify the session is still valid
      if (this.authData) {
        await this.fetchAccountDetails();
        this.isAuthenticated = true;
        this.resetConnectionAttempts();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Session validation failed:', error);
      this.isAuthenticated = false;
      this.authData = null;
      return false;
    }
  }

  // Get credentials for streaming service
  async getCredentials(): Promise<IGCredentials | null> {
    if (!this.authData) {
      return null;
    }

    return {
      cst: this.authData.cst,
      securityToken: this.authData.xSecurityToken,
      accountId: this.authData.accountId
    };
  }

  // Login to IG API
  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      // Increment connection attempts
      this.connectionAttempts++;
      
      let response;
      
      if (this.useProxy) {
        // Use the proxy endpoint when in containerized environment
        response = await axios.post(
          '/api/trading/test/ig/session/',
          {
            identifier: username,
            password: password,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          }
        );
        
        // Extract data from the proxy response
        const responseData = response.data.data;
        const cst = response.headers['cst'];
        const securityToken = response.headers['x-security-token'];
        
        if (!cst || !securityToken) {
          throw new Error('Authentication successful but missing security tokens in response');
        }
        
        // Create auth data from the response
        this.authData = {
          accountId: responseData.accountId || responseData.accounts?.[0]?.accountId || '',
          clientId: responseData.clientId || '',
          lightstreamerEndpoint: responseData.lightstreamerEndpoint || '',
          cst: cst,
          xSecurityToken: securityToken,
          oauthToken: responseData.oauthToken || '',
        };
      } else {
        // Direct connection to IG API (original code)
        response = await axios.post(
          `${this.baseUrl}/session`,
          {
            identifier: username,
            password: password,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'X-IG-API-KEY': this.apiKey,
              'Version': '2',
            },
          }
        );
        
        // Extract security tokens from response headers
        const cst = response.headers['cst'];
        const securityToken = response.headers['x-security-token'];
        
        if (!cst || !securityToken) {
          throw new Error('Authentication successful but missing security tokens in response');
        }
        
        // Create auth data from the response
        this.authData = {
          accountId: response.data.accountId || response.data.accounts?.[0]?.accountId || '',
          clientId: response.data.clientId || '',
          lightstreamerEndpoint: response.data.lightstreamerEndpoint || '',
          cst: cst,
          xSecurityToken: securityToken,
          oauthToken: response.data.oauthToken || '',
        };
      }
      
      this.isAuthenticated = true;
      this.resetConnectionAttempts();
      this.saveAuthData();
      
      return this.authData;
    } catch (error: any) {
      // Check for CORS-related errors
      if (error.message && (
          error.message.includes('Network Error') || 
          error.message.includes('CORS') || 
          error.response?.status === 403
        )) {
        console.error('Possible CORS issue detected:', error);
        error.corsIssue = true;
        error.message = `${error.message}\n\nThis may be due to CORS restrictions. Consider using a server-side proxy for API requests.`;
      }
      
      console.error('Login failed:', error);
      throw error;
    }
  }

  // Fetch account details
  async fetchAccountDetails(): Promise<AccountDetails> {
    if (!this.authData) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await axios.get(`${this.baseUrl}/accounts`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-IG-API-KEY': this.apiKey,
          'CST': this.authData.cst,
          'X-SECURITY-TOKEN': this.authData.xSecurityToken,
          'Version': '1',
        },
      });

      const account = response.data.accounts[0];
      this.accountDetails = {
        accountId: account.accountId,
        accountName: account.accountName,
        accountType: account.accountType,
        balance: account.balance,
        available: account.available,
        deposit: account.deposit,
        profitLoss: account.profitLoss,
      };

      return this.accountDetails;
    } catch (error) {
      console.error('Failed to fetch account details:', error);
      throw error;
    }
  }

  // Logout from IG API
  async logout(): Promise<void> {
    if (!this.authData) {
      return;
    }

    try {
      await axios.delete(`${this.baseUrl}/session`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-IG-API-KEY': this.apiKey,
          'CST': this.authData.cst,
          'X-SECURITY-TOKEN': this.authData.xSecurityToken,
          'Version': '1',
        },
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      this.isAuthenticated = false;
      this.authData = null;
      this.accountDetails = null;
      this.clearAuthData();
    }
  }

  // Set whether to use proxy for IG API connections
  setUseProxy(useProxy: boolean): void {
    this.useProxy = useProxy;
  }

  // Initialize with credentials from a successful connection test
  initializeWithCredentials(cst: string, securityToken: string, accountId: string): void {
    this.authData = {
      accountId: accountId,
      clientId: '',
      lightstreamerEndpoint: '',
      cst: cst,
      xSecurityToken: securityToken,
      oauthToken: '',
    };
    this.isAuthenticated = true;
    this.resetConnectionAttempts();
    this.saveAuthData();
  }
}

// Create a singleton instance
const igAuthService = new IGAuthService();
export default igAuthService;
