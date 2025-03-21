import axios from 'axios';

/**
 * Interface for authentication tokens
 */
export interface AuthTokens {
  access: string;
  refresh: string;
}

/**
 * Interface for user data
 */
export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_verified: boolean;
  dark_mode: boolean;
  notification_enabled: boolean;
  offline_mode: boolean;
  use_demo_account: boolean;
}

/**
 * Interface for authentication state
 */
export interface AuthState {
  tokens: AuthTokens | null;
  user: User | null;
  isAuthenticated: boolean;
  tokenExpiration: number | null;
}

/**
 * Class for handling authentication
 */
class AuthService {
  private baseUrl: string;
  private authState: AuthState;
  private storageKey: string = 'auth_data';

  /**
   * Constructor for AuthService
   */
  constructor() {
    // Use a specific environment variable for auth URL or default to auth endpoint
    this.baseUrl = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8000/api/auth';
    this.authState = {
      tokens: null,
      user: null,
      isAuthenticated: false,
      tokenExpiration: null
    };
    
    // Try to restore auth data from localStorage on initialization
    this.restoreAuthData();
  }

  /**
   * Get current auth state
   */
  public getAuthState(): AuthState {
    return this.authState;
  }

  /**
   * Get access token
   */
  public getAccessToken(): string | null {
    return this.authState.tokens?.access || null;
  }

  /**
   * Save auth data to localStorage
   */
  private saveAuthData(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.authState));
    } catch (error) {
      console.error('Failed to save auth data:', error);
    }
  }

  /**
   * Restore auth data from localStorage
   */
  private restoreAuthData(): void {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (storedData) {
        const data: AuthState = JSON.parse(storedData);
        const tokenExpiration = data.tokens?.access ? this.getTokenExpiration(data.tokens.access) : null;

        if (tokenExpiration && tokenExpiration > Date.now()) {
          this.authState = { ...data, tokenExpiration, isAuthenticated: true };
        } else {
          this.clearAuthData();
        }
      }
    } catch (error) {
      console.error('Failed to restore auth data:', error);
      this.clearAuthData();
    }
  }

  /**
   * Clear auth data from localStorage
   */
  private clearAuthData(): void {
    try {
      localStorage.removeItem(this.storageKey);
      this.authState = {
        tokens: null,
        user: null,
        isAuthenticated: false,
        tokenExpiration: null,
      };
    } catch (error) {
      console.error('Failed to clear auth data:', error);
    }
  }

  /**
   * Get token expiration from token
   */
  public getTokenExpiration(token: string): number | null {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) throw new Error('Invalid token format');
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      return payload.exp ? payload.exp * 1000 : null;
    } catch (error) {
      console.error('Failed to get token expiration:', error);
      return null;
    }
  }

  /**
   * Get auth headers for axios requests
   */
  async getAuthHeaders(): Promise<{ [key: string]: string }> {
    if (this.authState.tokenExpiration && this.authState.tokenExpiration < Date.now()) {
      await this.refreshToken();
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authState.tokens?.access}`,
    };
  }

  /**
   * Login to the application
   */
  async login(email: string, password: string): Promise<AuthState> {
    try {
      const response = await axios.post(`${this.baseUrl}/token/`, { email, password });
      this.authState = {
        tokens: response.data,
        user: response.data.user,
        isAuthenticated: true,
        tokenExpiration: this.getTokenExpiration(response.data.access),
      };
      this.saveAuthData();
      return this.authState;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * Refresh token
   */
  async refreshToken(): Promise<void> {
    try {
      const refreshToken = this.authState.tokens?.refresh;
      if (!refreshToken) throw new Error('No refresh token available');
      const response = await axios.post(`${this.baseUrl}/token/refresh/`, { refresh: refreshToken });
      this.authState.tokens = response.data;
      this.authState.tokenExpiration = this.getTokenExpiration(response.data.access);
      this.saveAuthData();
    } catch (error) {
      console.error('Failed to refresh token:', error);
      this.clearAuthData();
      throw new Error('Token refresh failed. Please log in again.');
    }
  }

  /**
   * Logout from the application
   */
  logout(): void {
    this.clearAuthData();
  }
}

const authService = new AuthService();

// Axios interceptor for automatic token refresh
axios.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await authService.refreshToken();
        originalRequest.headers['Authorization'] = `Bearer ${authService.getAuthState().tokens?.access}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed, logging out.');
        authService.logout();
      }
    }
    return Promise.reject(error);
  }
);

export default authService;
