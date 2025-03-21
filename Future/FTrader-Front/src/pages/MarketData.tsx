import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, WifiOff, Loader2 } from 'lucide-react';
import { PriceChart } from '@/components/PriceChart';
import StreamErrorBanner from '@/components/StreamErrorBanner';
import { useMarketDataStream, TimeFrame } from '@/hooks/useMarketDataStream';
import { Badge } from '@/components/ui/badge';

// Define types for market data
interface MarketTicker {
  symbol: string;
  price: number;
  change: string;
  volume?: number;
  marketCap?: number;
}

interface OrderBookEntry {
  price: number;
  quantity: number;
}

interface OrderBook {
  symbol: string;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

const MarketData: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const {
    activeTab,
    setActiveTab,
    selectedSymbol,
    setSelectedSymbol,
    timeFrame,
    setTimeFrame,
    marketTickers,
    orderBook,
    chartData,
    isLoading,
    streamError,
    isOfflineMode,
    handleRetry,
    enableOfflineMode
  } = useMarketDataStream();

  // Filter tickers based on search query
  const filteredTickers = marketTickers.filter(ticker => 
    ticker.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format large numbers with appropriate suffixes
  const formatNumber = (num: number) => {
    if (num >= 1000000000000) {
      return `$${(num / 1000000000000).toFixed(2)}T`;
    }
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(2)}B`;
    }
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    }
    return num.toLocaleString();
  };

  // Handle timeframe change from chart component
  const handleTimeFrameChange = (newTimeFrame: TimeFrame) => {
    setTimeFrame(newTimeFrame);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6 max-w-screen-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Market Data</h1>
          {isOfflineMode && (
            <Badge variant="outline" className="flex items-center gap-1">
              <WifiOff className="h-3 w-3" />
              Offline Mode
            </Badge>
          )}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search symbols..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Display stream error if any */}
      <StreamErrorBanner 
        error={streamError}
        isOfflineMode={isOfflineMode}
        onRetry={handleRetry}
        onEnableOfflineMode={enableOfflineMode}
      />

      <Tabs defaultValue="stocks" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="crypto">Crypto</TabsTrigger>
          <TabsTrigger value="forex">Forex</TabsTrigger>
        </TabsList>

        {/* Tabs content is shared since the structure is the same */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market tickers list */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Market Tickers</CardTitle>
              <CardDescription>
                {activeTab === 'stocks' ? 'Stock' : activeTab === 'crypto' ? 'Cryptocurrency' : 'Foreign Exchange'} prices
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="overflow-auto max-h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTickers.length > 0 ? (
                        filteredTickers.map((ticker) => (
                          <TableRow 
                            key={ticker.symbol}
                            className={`cursor-pointer ${selectedSymbol === ticker.symbol ? 'bg-muted' : ''}`}
                            onClick={() => setSelectedSymbol(ticker.symbol)}
                          >
                            <TableCell className="font-medium">{ticker.symbol}</TableCell>
                            <TableCell className="text-right">
                              {activeTab === 'forex' ? ticker.price.toFixed(4) : ticker.price.toLocaleString()}
                            </TableCell>
                            <TableCell className={`text-right ${ticker.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                              {ticker.change}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                            No results found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Price chart */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>{selectedSymbol} Price Chart</CardTitle>
              <CardDescription>30-day price history</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-[400px]">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="h-[400px]">
                  <PriceChart 
                    data={chartData}
                    candlestickData={chartData.map((point, index) => {
                      const basePrice = typeof point.price === 'string' ? parseFloat(point.price) : point.price;
                      const volatility = basePrice * 0.05; // Increased volatility for better visualization
                      
                      return {
                        date: point.date,
                        open: index > 0 ? (typeof chartData[index - 1].price === 'string' 
                          ? parseFloat(chartData[index - 1].price as string) 
                          : chartData[index - 1].price as number) 
                          : basePrice - volatility/2,
                        high: basePrice + volatility,
                        low: basePrice - volatility,
                        close: basePrice,
                      };
                    })}
                    symbol={selectedSymbol}
                    onTimeFrameChange={handleTimeFrameChange}
                    selectedTimeFrame={timeFrame}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order book */}
          <Card className="col-span-1 lg:col-span-3">
            <CardHeader>
              <CardTitle>{selectedSymbol} Order Book</CardTitle>
              <CardDescription>Current bids and asks</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Bids */}
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-green-500">Bids</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Price</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderBook?.bids.map((bid, index) => (
                          <TableRow key={`bid-${index}`}>
                            <TableCell className="font-medium text-green-500">
                              {activeTab === 'forex' ? bid.price.toFixed(4) : bid.price.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">{bid.quantity.toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                              {activeTab === 'forex' 
                                ? (bid.price * bid.quantity).toFixed(2) 
                                : (bid.price * bid.quantity).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Asks */}
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-red-500">Asks</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Price</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderBook?.asks.map((ask, index) => (
                          <TableRow key={`ask-${index}`}>
                            <TableCell className="font-medium text-red-500">
                              {activeTab === 'forex' ? ask.price.toFixed(4) : ask.price.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">{ask.quantity.toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                              {activeTab === 'forex' 
                                ? (ask.price * ask.quantity).toFixed(2) 
                                : (ask.price * ask.quantity).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Tabs>
    </div>
  );
};

export default MarketData;
