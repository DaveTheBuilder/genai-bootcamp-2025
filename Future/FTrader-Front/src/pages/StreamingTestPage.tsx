import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import IGStreamingTest from '@/components/IGStreamingTest';
import igAuthService from '@/services/igAuthService';
import igStreamingService from '@/services/igStreamingService';

const StreamingTestPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const { toast } = useToast();

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await igAuthService.isLoggedIn();
      setIsAuthenticated(isAuth);
    };
    
    checkAuth();
  }, []);

  // Handle connect button click
  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      // Step 1: Get authentication tokens
      const authResponse = await fetch('/api/trading/test/ig/session/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!authResponse.ok) {
        throw new Error('Failed to retrieve authentication tokens');
      }
      
      const authData = await authResponse.json();
      
      // Step 2: Test streaming connection
      const streamingResponse = await fetch('/api/trading/test/ig/streaming-connection/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-IG-API-KEY': authData.apiKey || '',
          'CST': authData.cst || '',
          'X-SECURITY-TOKEN': authData.xSecurityToken || '',
        },
      });
      
      if (!streamingResponse.ok) {
        throw new Error('Failed to test streaming connection');
      }
      
      const streamingData = await streamingResponse.json();
      
      if (!streamingData.success) {
        throw new Error(streamingData.message || 'Failed to connect to streaming service');
      }
      
      // Step 3: Initialize streaming service
      await igStreamingService.initialize(
        streamingData.lightstreamerEndpoint,
        authData.cst,
        authData.xSecurityToken,
        authData.accountId,
        false // Not a test
      );
      
      setIsAuthenticated(true);
      toast({
        title: 'Connected to IG Streaming API',
        description: 'You can now subscribe to market data',
        variant: 'default',
      });
    } catch (error) {
      console.error('Failed to connect to IG API:', error);
      toast({
        title: 'Connection Failed',
        description: error instanceof Error ? error.message : 'Failed to connect to IG API',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">IG Streaming Test</h1>
        <p className="text-gray-500">Test real-time market data updates from the IG API</p>
      </div>
      
      {!isAuthenticated ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8 gap-4">
            <p className="text-lg">You need to connect to the IG API first</p>
            <Button onClick={handleConnect} disabled={isConnecting}>
              {isConnecting ? 'Connecting...' : 'Connect to IG API'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <IGStreamingTest />
      )}
    </div>
  );
};

export default StreamingTestPage;
