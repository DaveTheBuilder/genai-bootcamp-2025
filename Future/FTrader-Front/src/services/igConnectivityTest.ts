import axios from 'axios';
import igAuthService from './igAuthService';

/**
 * Interface for the streaming connection test response
 */
interface StreamingConnectionTestResponse {
  success: boolean;
  message?: string;
  lightstreamerEndpoint?: string;
  status?: number;
}

/**
 * Service to test connectivity to the IG API and retrieve the Lightstreamer endpoint
 */
class IGConnectivityTest {
  private cachedEndpoint: string | null = null;
  private lastTestTime: number = 0;
  private cacheDuration: number = 5 * 60 * 1000; // 5 minutes

  /**
   * Test the connection to the IG API and retrieve the Lightstreamer endpoint
   * @returns The streaming connection test response
   */
  async testConnection(): Promise<StreamingConnectionTestResponse | null> {
    try {
      // Check if we have a cached endpoint that's still valid
      const now = Date.now();
      if (this.cachedEndpoint && now - this.lastTestTime < this.cacheDuration) {
        console.log('Using cached Lightstreamer endpoint');
        return {
          success: true,
          lightstreamerEndpoint: this.cachedEndpoint
        };
      }

      console.log('Testing streaming connection...');
      
      // Get credentials for streaming
      const credentials = await igAuthService.getCredentials();
      
      if (!credentials) {
        console.error('Failed to get IG credentials for connection test');
        return {
          success: false,
          message: 'Failed to get IG credentials'
        };
      }
      
      // Test the streaming connection
      const response = await axios.get('/api/trading/test/ig/test-connection/', {
        headers: {
          'CST': credentials.cst,
          'X-SECURITY-TOKEN': credentials.securityToken,
        }
      });
      
      console.log('Streaming test response:', response.data);
      
      // Cache the endpoint if successful
      if (response.data.success && response.data.lightstreamerEndpoint) {
        this.cachedEndpoint = response.data.lightstreamerEndpoint;
        this.lastTestTime = now;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error testing streaming connection:', error);
      
      // If we have a cached endpoint, return it as a fallback
      if (this.cachedEndpoint) {
        console.log('Using cached Lightstreamer endpoint as fallback');
        return {
          success: true,
          lightstreamerEndpoint: this.cachedEndpoint,
          message: 'Using cached endpoint due to connection error'
        };
      }
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error testing connection',
        status: error.response?.status
      };
    }
  }

  /**
   * Get the Lightstreamer endpoint
   * @returns The Lightstreamer endpoint or null if not available
   */
  async getStreamingEndpoint(): Promise<string | null> {
    const testResult = await this.testConnection();
    return testResult?.success && testResult.lightstreamerEndpoint ? testResult.lightstreamerEndpoint : null;
  }

  /**
   * Clear the cached endpoint
   */
  clearCache(): void {
    this.cachedEndpoint = null;
    this.lastTestTime = 0;
  }
}

// Export a singleton instance
const igConnectivityTest = new IGConnectivityTest();
export default igConnectivityTest;
