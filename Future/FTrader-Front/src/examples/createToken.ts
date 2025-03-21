import axios from 'axios';

/**
 * Creates a JWT token by authenticating with the backend
 * @param username User's username
 * @param password User's password
 * @returns Object containing access and refresh tokens
 */
async function createToken(username: string, password: string) {
  try {
    const response = await axios.post('http://localhost:8000/api/auth/token/', {
      username,
      password
    });
    
    // The response will contain access and refresh tokens
    const { access, refresh } = response.data;
    
    // Store tokens in localStorage for future use
    localStorage.setItem('auth_tokens', JSON.stringify({ access, refresh }));
    
    console.log('Token created successfully!');
    return { access, refresh };
  } catch (error) {
    console.error('Failed to create token:', error);
    throw error;
  }
}

/**
 * Refreshes an expired access token using the refresh token
 * @param refreshToken The refresh token
 * @returns New access token
 */
async function refreshToken(refreshToken: string) {
  try {
    const response = await axios.post('http://localhost:8000/api/auth/token/refresh/', {
      refresh: refreshToken
    });
    
    // The response will contain a new access token
    const { access } = response.data;
    
    // Update the stored tokens
    const tokens = JSON.parse(localStorage.getItem('auth_tokens') || '{}');
    tokens.access = access;
    localStorage.setItem('auth_tokens', JSON.stringify(tokens));
    
    console.log('Token refreshed successfully!');
    return access;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    throw error;
  }
}

/**
 * Example of how to use these functions in a component
 */
async function exampleUsage() {
  // Create a new token
  const tokens = await createToken('admin', 'password123');
  
  // Use the token for authenticated requests
  const config = {
    headers: {
      'Authorization': `Bearer ${tokens.access}`
    }
  };
  
  // Make an authenticated request
  try {
    const response = await axios.get('http://localhost:8000/api/market-data/models/', config);
    console.log('Authenticated request successful:', response.data);
  } catch (error) {
    // If the error is due to an expired token
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Refresh the token
      const newToken = await refreshToken(tokens.refresh);
      
      // Retry the request with the new token
      const newConfig = {
        headers: {
          'Authorization': `Bearer ${newToken}`
        }
      };
      
      const retryResponse = await axios.get('http://localhost:8000/api/market-data/models/', newConfig);
      console.log('Retry successful:', retryResponse.data);
    } else {
      console.error('Request failed:', error);
    }
  }
}

export { createToken, refreshToken };
