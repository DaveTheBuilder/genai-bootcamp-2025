import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, WifiOff } from 'lucide-react';
import StreamErrorBanner from '@/components/StreamErrorBanner';
import { useMarketDataStream, TimeFrame } from '@/hooks/useMarketDataStream';
import { Badge } from '@/components/ui/badge';
import { PriceChart } from '@/components/PriceChart';

const MarketDataWithStreaming: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('1h');
  
  const {
    activeTab,
    setActiveTab,
    selectedSymbol,
    setSelectedSymbol,
    marketTickers,
    orderBook,
    chartData,
    isLoading,
    streamError,
    isOfflineMode,
    handleRetry
  } = useMarketDataStream();

  // Filter tickers based on search query
  const filteredTickers = marketTickers.filter(ticker => 
    ticker.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    ticker.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Market Data</h1>
      
      {streamError && (
        <StreamErrorBanner 
          error={streamError} 
          isOfflineMode={isOfflineMode}
          onRetry={handleRetry}
        />
      )}

      <div className="mb-6">
        <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="mb-4">
            <TabsTrigger value="stocks">Stocks & Indices</TabsTrigger>
            <TabsTrigger value="crypto">Cryptocurrencies</TabsTrigger>
            <TabsTrigger value="forex">Forex</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center mb-4">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            {isOfflineMode && (
              <Badge variant="outline" className="ml-4 bg-yellow-100">
                <WifiOff className="h-3 w-3 mr-1" />
                Offline Mode
              </Badge>
            )}
          </div>

          <TabsContent value="stocks" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Market tickers */}
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Stocks & Indices</CardTitle>
                  <CardDescription>Major global markets</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-16">
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
                                <TableCell className="font-medium">{ticker.displayName || ticker.symbol}</TableCell>
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
                  <CardTitle>
                    {filteredTickers.find(t => t.symbol === selectedSymbol)?.displayName || selectedSymbol} Price Chart
                  </CardTitle>
                  <CardDescription>30-day price history</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-16">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="h-[400px]">
                      <PriceChart 
                        data={chartData}
                        candlestickData={[]} // Provide empty array for candlestick data
                        isLoading={isLoading}
                        symbol={filteredTickers.find(t => t.symbol === selectedSymbol)?.displayName || selectedSymbol}
                        selectedTimeFrame={timeFrame}
                        onTimeFrameChange={setTimeFrame}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order book */}
              <Card className="col-span-1 lg:col-span-3">
                <CardHeader>
                  <CardTitle>
                    {filteredTickers.find(t => t.symbol === selectedSymbol)?.displayName || selectedSymbol} Order Book
                  </CardTitle>
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
          </TabsContent>
          
          <TabsContent value="crypto" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Same structure as stocks tab, but with crypto data */}
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Cryptocurrencies</CardTitle>
                  <CardDescription>Major digital assets</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Same content as stocks tab */}
                  {isLoading ? (
                    <div className="flex justify-center py-16">
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
                                <TableCell className="font-medium">{ticker.displayName || ticker.symbol}</TableCell>
                                <TableCell className="text-right">${ticker.price.toLocaleString()}</TableCell>
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
                  <CardTitle>
                    {filteredTickers.find(t => t.symbol === selectedSymbol)?.displayName || selectedSymbol} Price Chart
                  </CardTitle>
                  <CardDescription>30-day price history</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-16">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="h-[400px]">
                      <PriceChart 
                        data={chartData}
                        candlestickData={[]} // Provide empty array for candlestick data
                        isLoading={isLoading}
                        symbol={filteredTickers.find(t => t.symbol === selectedSymbol)?.displayName || selectedSymbol}
                        selectedTimeFrame={timeFrame}
                        onTimeFrameChange={setTimeFrame}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order book */}
              <Card className="col-span-1 lg:col-span-3">
                <CardHeader>
                  <CardTitle>
                    {filteredTickers.find(t => t.symbol === selectedSymbol)?.displayName || selectedSymbol} Order Book
                  </CardTitle>
                  <CardDescription>Current bids and asks</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Same content as stocks tab */}
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
                                  ${bid.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right">{bid.quantity.toLocaleString()}</TableCell>
                                <TableCell className="text-right">
                                  ${(bid.price * bid.quantity).toLocaleString()}
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
                                  ${ask.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right">{ask.quantity.toLocaleString()}</TableCell>
                                <TableCell className="text-right">
                                  ${(ask.price * ask.quantity).toLocaleString()}
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
          </TabsContent>
          
          <TabsContent value="forex" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Same structure as stocks tab, but with forex data */}
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Forex</CardTitle>
                  <CardDescription>Major currency pairs</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Same content as stocks tab */}
                  {isLoading ? (
                    <div className="flex justify-center py-16">
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
                                <TableCell className="font-medium">{ticker.displayName || ticker.symbol}</TableCell>
                                <TableCell className="text-right">{ticker.price.toFixed(4)}</TableCell>
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
                  <CardTitle>
                    {filteredTickers.find(t => t.symbol === selectedSymbol)?.displayName || selectedSymbol} Price Chart
                  </CardTitle>
                  <CardDescription>30-day price history</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-16">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="h-[400px]">
                      <PriceChart 
                        data={chartData}
                        candlestickData={[]} // Provide empty array for candlestick data
                        isLoading={isLoading}
                        symbol={filteredTickers.find(t => t.symbol === selectedSymbol)?.displayName || selectedSymbol}
                        selectedTimeFrame={timeFrame}
                        onTimeFrameChange={setTimeFrame}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order book */}
              <Card className="col-span-1 lg:col-span-3">
                <CardHeader>
                  <CardTitle>
                    {filteredTickers.find(t => t.symbol === selectedSymbol)?.displayName || selectedSymbol} Order Book
                  </CardTitle>
                  <CardDescription>Current bids and asks</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Same content as stocks tab */}
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
                                  {bid.price.toFixed(4)}
                                </TableCell>
                                <TableCell className="text-right">{bid.quantity.toLocaleString()}</TableCell>
                                <TableCell className="text-right">
                                  {(bid.price * bid.quantity).toFixed(2)}
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
                                  {ask.price.toFixed(4)}
                                </TableCell>
                                <TableCell className="text-right">{ask.quantity.toLocaleString()}</TableCell>
                                <TableCell className="text-right">
                                  {(ask.price * ask.quantity).toFixed(2)}
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketDataWithStreaming;
