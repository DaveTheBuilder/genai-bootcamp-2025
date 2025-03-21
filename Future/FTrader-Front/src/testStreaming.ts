import igStreamingService from './services/igStreamingService';
import igAuthService from './services/igAuthService';

/**
 * Test script for the IG Streaming Service
 * This script tests the connection to the IG API and subscribes to market data
 */
async function testStreaming() {
  try {
    console.log('Starting IG Streaming test...');
    
    // Step 1: Test authentication
    console.log('Testing authentication...');
    const isAuthenticated = await igAuthService.isLoggedIn();
    console.log('Authentication status:', isAuthenticated);
    
    if (!isAuthenticated) {
      console.log('Not authenticated. Please log in first.');
      return;
    }
    
    // Step 2: Get credentials for streaming
    console.log('Getting credentials for streaming...');
    const credentials = await igAuthService.getCredentials();
    
    if (!credentials) {
      console.log('Failed to get credentials. Please check authentication.');
      return;
    }
    
    console.log('Successfully retrieved credentials');
    
    // Step 3: Initialize streaming service
    console.log('Initializing streaming service...');
    
    // Get the lightstreamer endpoint from the backend
    const response = await fetch('/api/trading/test/ig/streaming-connection/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-IG-API-KEY': 'your-api-key', // Replace with your API key
        'CST': credentials.cst,
        'X-SECURITY-TOKEN': credentials.securityToken,
      },
    });
    
    if (!response.ok) {
      console.log('Failed to get lightstreamer endpoint');
      return;
    }
    
    const data = await response.json();
    
    if (!data.success) {
      console.log('Failed to connect to streaming service:', data.message);
      return;
    }
    
    const lightstreamerEndpoint = data.lightstreamerEndpoint;
    console.log('Lightstreamer endpoint:', lightstreamerEndpoint);
    
    // Initialize the streaming service
    await igStreamingService.initialize(
      lightstreamerEndpoint,
      credentials.cst,
      credentials.securityToken,
      credentials.accountId,
      false // Not a test
    );
    
    console.log('Streaming service initialized');
    
    // Step 4: Subscribe to market data
    console.log('Subscribing to market data...');
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
    
    symbols.forEach(symbol => {
      console.log(`Subscribing to ${symbol}...`);
      igStreamingService.subscribeToMarketData(symbol, (update) => {
        console.log(`${symbol} update:`, update);
      });
    });
    
    console.log('Subscribed to market data for symbols:', symbols.join(', '));
    
    // Keep the script running for a while to receive updates
    console.log('Waiting for updates...');
    
    // We'll keep the script running for 60 seconds
    setTimeout(() => {
      console.log('Test complete. Disconnecting...');
      igStreamingService.disconnect();
      console.log('Disconnected from streaming service');
    }, 60000);
    
  } catch (error) {
    console.error('Error in test script:', error);
  }
}

// Run the test
testStreaming();
