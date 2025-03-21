import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import igStreamingService from '@/services/igStreamingService';
import igAuthService from '@/services/igAuthService';
import { MarketUpdate } from '@/services/igStreamingTypes';

const StreamingSettingsPage = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  const [symbol, setSymbol] = useState<string>('IX.D.FTSE.DAILY.IP');
  const [updates, setUpdates] = useState<MarketUpdate[]>([]);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const { toast } = useToast();

  // Effect to handle connection status changes
  useEffect(() => {
    const handleConnectionChange = (connected: boolean) => {
      console.log(`Connection status changed: ${connected ? 'Connected' : 'Disconnected'}`);
      setIsConnected(connected);
    };

    // Register for connection status changes
    igStreamingService.onConnectionStatusChange(handleConnectionChange);

    // Initial connection status
    setIsConnected(igStreamingService.getConnectionStatus());

    // Cleanup
    return () => {
      // We don't have a method to remove the listener, but that's OK for this test component
    };
  }, []);

  // Initialize the streaming service
  const initializeStreaming = async () => {
    setIsInitializing(true);
    
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
        authData.cst,
        authData.xSecurityToken,
        authData.accountId,
        streamingData.lightstreamerEndpoint
      );
      
      toast({
        title: "Streaming Service Initialized",
        description: "Successfully connected to the IG Streaming API",
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to initialize streaming service:', error);
      toast({
        title: "Initialization Failed",
        description: error instanceof Error ? error.message : 'Failed to initialize streaming service',
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  // Handle subscription to market data
  const handleSubscribe = () => {
    if (!symbol) return;

    try {
      // Clear any existing updates first
      setUpdates([]);
      
      // Subscribe to market data for the specified symbol
      igStreamingService.subscribeToMarketData(symbol, (update) => {
        console.log('Received market update:', update);
        
        // Create a new array with the update at the beginning
        // This ensures React detects the state change
        setUpdates(prevUpdates => {
          const newUpdates = [update, ...prevUpdates];
          return newUpdates.slice(0, 20); // Keep only the last 20 updates
        });
      });

      setIsSubscribed(true);
      
      toast({
        title: "Subscribed",
        description: `Successfully subscribed to market data for ${symbol}`,
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to subscribe to market data:', error);
      toast({
        title: "Subscription Failed",
        description: error instanceof Error ? error.message : 'Failed to subscribe to market data',
        variant: "destructive",
      });
    }
  };

  // Handle unsubscription from market data
  const handleUnsubscribe = () => {
    if (!symbol) return;

    try {
      // Create a dummy callback to match the expected signature
      const dummyCallback = (update: MarketUpdate) => {};
      
      // Unsubscribe from market data for the specified symbol
      igStreamingService.unsubscribeFromMarketData(symbol, dummyCallback);
      setIsSubscribed(false);
      setUpdates([]);
      
      toast({
        title: "Unsubscribed",
        description: `Successfully unsubscribed from market data for ${symbol}`,
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to unsubscribe from market data:', error);
      toast({
        title: "Unsubscribe Failed",
        description: error instanceof Error ? error.message : 'Failed to unsubscribe from market data',
        variant: "destructive",
      });
    }
  };

  // Format timestamp to a readable format
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString();
    } catch (error) {
      return timestamp;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Streaming Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure and test real-time market data streaming
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Connection Status
            {isConnected ? 
              <CheckCircle2 className="h-5 w-5 text-green-500" /> : 
              <AlertCircle className="h-5 w-5 text-red-500" />
            }
          </CardTitle>
          <CardDescription>
            {isConnected 
              ? "Connected to IG Streaming API" 
              : "Not connected to IG Streaming API"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isConnected && (
            <Button 
              onClick={initializeStreaming} 
              disabled={isInitializing}
              className="mt-2"
            >
              {isInitializing ? 'Initializing...' : 'Initialize Streaming Service'}
            </Button>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Market Data Stream</CardTitle>
          <CardDescription>
            Subscribe to real-time market data for a specific IG epic
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-end gap-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="symbol">IG Epic</Label>
                <Input 
                  id="symbol" 
                  value={symbol} 
                  onChange={(e) => setSymbol(e.target.value)} 
                  placeholder="Enter IG epic (e.g. IX.D.FTSE.DAILY.IP)"
                  disabled={isSubscribed}
                />
                <p className="text-xs text-muted-foreground">
                  Use IG epics like IX.D.FTSE.DAILY.IP (FTSE 100), IX.D.DAX.DAILY.IP (DAX), or CS.D.EURUSD.TODAY.IP (EUR/USD)
                </p>
              </div>
              {!isSubscribed ? (
                <Button onClick={handleSubscribe} disabled={!isConnected || !symbol}>
                  Subscribe
                </Button>
              ) : (
                <Button onClick={handleUnsubscribe} variant="destructive">
                  Unsubscribe
                </Button>
              )}
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Bid</TableHead>
                    <TableHead>Ask</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Change %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {updates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No updates received yet. Subscribe to a symbol to see real-time updates.
                      </TableCell>
                    </TableRow>
                  ) : (
                    updates.map((update, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatTimestamp(update.updateTime)}</TableCell>
                        <TableCell>{update.epic}</TableCell>
                        <TableCell>{update.bid}</TableCell>
                        <TableCell>{update.offer}</TableCell>
                        <TableCell className={update.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                          {update.change}
                        </TableCell>
                        <TableCell className={update.changePct >= 0 ? 'text-green-500' : 'text-red-500'}>
                          {update.changePct}%
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StreamingSettingsPage;
