import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { MarketUpdate } from '../services/igStreamingTypes';
import igStreamingService from '@/services/igStreamingService';

export const IGStreamingTest = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [symbol, setSymbol] = useState<string>('AAPL');
  const [updates, setUpdates] = useState<MarketUpdate[]>([]);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [marketCallback, setMarketCallback] = useState<(update: MarketUpdate) => void | null>(null);

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
      // In a real app, we would need to implement a removeConnectionStatusChangeListener method
    };
  }, []);

  // Handle subscription to market data
  const handleSubscribe = () => {
    if (!symbol) return;

    try {
      // Create and store the callback function
      const callback = (update: MarketUpdate) => {
        console.log('Received market update:', update);
        setUpdates(prev => [update, ...prev].slice(0, 20));
      };
      setMarketCallback(callback);

      // Subscribe to market data for the specified symbol
      igStreamingService.subscribeToMarketData(symbol, callback);
      setIsSubscribed(true);
    } catch (error) {
      console.error('Failed to subscribe to market data:', error);
    }
  };

  // Handle unsubscription from market data
  const handleUnsubscribe = () => {
    if (!symbol || !marketCallback) return;

    try {
      // Unsubscribe from market data for the specified symbol
      igStreamingService.unsubscribeFromMarketData(symbol, marketCallback);
      setIsSubscribed(false);
      setUpdates([]);
      setMarketCallback(null);
    } catch (error) {
      console.error('Failed to unsubscribe from market data:', error);
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          IG Streaming Test
          {isConnected ? 
            <CheckCircle2 className="h-5 w-5 text-green-500" /> : 
            <AlertCircle className="h-5 w-5 text-red-500" />
          }
        </CardTitle>
        <CardDescription>
          Test real-time market data updates from the IG Streaming API
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-end gap-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="symbol">Symbol</Label>
              <Input 
                id="symbol" 
                value={symbol} 
                onChange={(e) => setSymbol(e.target.value.toUpperCase())} 
                placeholder="Enter symbol (e.g. AAPL)"
                disabled={isSubscribed}
              />
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
  );
};

export default IGStreamingTest;
