import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Activity, 
  LineChart, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpDown,
  Waves,
  BarChart,
  Percent
} from "lucide-react";

// Mock data for indicators
const mockIndicators = [
  { 
    id: "rsi", 
    name: "Relative Strength Index (RSI)", 
    category: "Momentum",
    value: 68.5, 
    signal: "Overbought", 
    description: "Measures the magnitude of recent price changes to evaluate overbought or oversold conditions." 
  },
  { 
    id: "macd", 
    name: "MACD", 
    category: "Momentum",
    value: 0.0025, 
    signal: "Bullish", 
    description: "Moving Average Convergence Divergence shows the relationship between two moving averages of a security's price." 
  },
  { 
    id: "bb", 
    name: "Bollinger Bands", 
    category: "Volatility",
    value: "Upper: 1.1842, Middle: 1.1820, Lower: 1.1798", 
    signal: "Upper Band Test", 
    description: "A volatility indicator that creates a band of three lines which are calculated from the standard deviation of the price." 
  },
  { 
    id: "ma", 
    name: "Moving Averages", 
    category: "Trend",
    value: "MA50: 1.1805, MA200: 1.1780", 
    signal: "Bullish Crossover", 
    description: "Shows the average price over a specific time period, smoothing out price fluctuations." 
  },
  { 
    id: "adx", 
    name: "Average Directional Index (ADX)", 
    category: "Trend",
    value: 28.5, 
    signal: "Strong Trend", 
    description: "Measures the strength of a prevailing trend and whether price is trending or ranging." 
  },
  { 
    id: "stoch", 
    name: "Stochastic Oscillator", 
    category: "Momentum",
    value: "K: 82.5, D: 75.3", 
    signal: "Overbought", 
    description: "Compares a security's closing price to its price range over a specific period of time." 
  },
  { 
    id: "fib", 
    name: "Fibonacci Retracement", 
    category: "Retracement",
    value: "0.5 level at 1.1810", 
    signal: "Support", 
    description: "Uses horizontal lines to indicate areas of support or resistance at key Fibonacci levels." 
  },
  { 
    id: "ichimoku", 
    name: "Ichimoku Cloud", 
    category: "Multiple",
    value: "Price above cloud", 
    signal: "Bullish", 
    description: "Defines support and resistance, identifies trend direction, gauges momentum and provides trading signals." 
  },
  { 
    id: "obv", 
    name: "On-Balance Volume", 
    category: "Volume",
    value: "Increasing", 
    signal: "Confirming Uptrend", 
    description: "Uses volume flow to predict changes in stock price." 
  },
  { 
    id: "atr", 
    name: "Average True Range", 
    category: "Volatility",
    value: 0.0012, 
    signal: "Low Volatility", 
    description: "Measures market volatility by decomposing the entire range of an asset price for that period." 
  }
];

// Mock data for indicator categories
const mockCategories = [
  { id: "all", name: "All Indicators" },
  { id: "momentum", name: "Momentum" },
  { id: "trend", name: "Trend" },
  { id: "volatility", name: "Volatility" },
  { id: "volume", name: "Volume" },
  { id: "multiple", name: "Multiple" },
  { id: "retracement", name: "Retracement" }
];

// Function to get signal badge color
const getSignalColor = (signal: string) => {
  if (signal.includes("Bullish") || signal.includes("Confirming Uptrend") || signal.includes("Support")) {
    return "text-green-500 border-green-500";
  } else if (signal.includes("Bearish") || signal.includes("Confirming Downtrend") || signal.includes("Resistance")) {
    return "text-red-500 border-red-500";
  } else if (signal.includes("Overbought")) {
    return "text-red-400 border-red-400";
  } else if (signal.includes("Oversold")) {
    return "text-green-400 border-green-400";
  } else if (signal.includes("Strong Trend")) {
    return "text-blue-500 border-blue-500";
  } else {
    return "text-gray-500 border-gray-500";
  }
};

// Function to get signal icon
const getSignalIcon = (signal: string) => {
  if (signal.includes("Bullish") || signal.includes("Confirming Uptrend") || signal.includes("Support")) {
    return <TrendingUp className="h-4 w-4 text-green-500" />;
  } else if (signal.includes("Bearish") || signal.includes("Confirming Downtrend") || signal.includes("Resistance")) {
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  } else if (signal.includes("Overbought") || signal.includes("Oversold")) {
    return <ArrowUpDown className="h-4 w-4" />;
  } else if (signal.includes("Strong Trend")) {
    return <Activity className="h-4 w-4 text-blue-500" />;
  } else if (signal.includes("Low Volatility") || signal.includes("High Volatility")) {
    return <Waves className="h-4 w-4" />;
  } else {
    return <Activity className="h-4 w-4" />;
  }
};

const TechnicalIndicators: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState("EURUSD");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIndicator, setSelectedIndicator] = useState<string | null>(null);

  // Filter indicators based on selected category
  const filteredIndicators = selectedCategory === "all" 
    ? mockIndicators 
    : mockIndicators.filter(indicator => 
        indicator.category.toLowerCase() === selectedCategory.toLowerCase()
      );

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Configuration Panel */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Technical Indicators</CardTitle>
          <CardDescription>Analyze market conditions using technical indicators</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Instrument Selection */}
          <div className="space-y-2">
            <Label htmlFor="instrument">Instrument</Label>
            <Select defaultValue="EURUSD" onValueChange={setSelectedSymbol}>
              <SelectTrigger id="instrument">
                <SelectValue placeholder="Select instrument" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EURUSD">EUR/USD</SelectItem>
                <SelectItem value="GBPUSD">GBP/USD</SelectItem>
                <SelectItem value="USDJPY">USD/JPY</SelectItem>
                <SelectItem value="BTCUSD">BTC/USD</SelectItem>
                <SelectItem value="AAPL">AAPL</SelectItem>
                <SelectItem value="MSFT">MSFT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Timeframe Selection */}
          <div className="space-y-2">
            <Label htmlFor="timeframe">Timeframe</Label>
            <Select defaultValue="1h">
              <SelectTrigger id="timeframe">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1 Minute</SelectItem>
                <SelectItem value="5m">5 Minutes</SelectItem>
                <SelectItem value="15m">15 Minutes</SelectItem>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="4h">4 Hours</SelectItem>
                <SelectItem value="1d">Daily</SelectItem>
                <SelectItem value="1w">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Indicator Categories */}
          <div className="space-y-2">
            <Label>Indicator Categories</Label>
            <div className="flex flex-wrap gap-2">
              {mockCategories.map((category) => (
                <Badge 
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Custom Indicator Settings */}
          <div className="space-y-2 pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">Custom Indicator Settings</h3>
            
            {/* RSI Settings */}
            <div className="space-y-2">
              <Label htmlFor="rsi-period" className="text-xs">RSI Period</Label>
              <div className="flex items-center space-x-2">
                <Input id="rsi-period" type="number" defaultValue="14" className="h-8" />
                <span className="text-xs text-muted-foreground">days</span>
              </div>
            </div>
            
            {/* Moving Average Settings */}
            <div className="space-y-2">
              <Label htmlFor="ma-type" className="text-xs">Moving Average Type</Label>
              <Select defaultValue="ema">
                <SelectTrigger id="ma-type" className="h-8">
                  <SelectValue placeholder="Select MA type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sma">Simple (SMA)</SelectItem>
                  <SelectItem value="ema">Exponential (EMA)</SelectItem>
                  <SelectItem value="wma">Weighted (WMA)</SelectItem>
                  <SelectItem value="hull">Hull (HMA)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* MACD Settings */}
            <div className="space-y-2">
              <Label className="text-xs">MACD Parameters</Label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="macd-fast" className="text-xs">Fast</Label>
                  <Input id="macd-fast" type="number" defaultValue="12" className="h-8" />
                </div>
                <div>
                  <Label htmlFor="macd-slow" className="text-xs">Slow</Label>
                  <Input id="macd-slow" type="number" defaultValue="26" className="h-8" />
                </div>
                <div>
                  <Label htmlFor="macd-signal" className="text-xs">Signal</Label>
                  <Input id="macd-signal" type="number" defaultValue="9" className="h-8" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Apply Settings</Button>
        </CardFooter>
      </Card>

      {/* Results Panel */}
      <div className="col-span-8 space-y-6">
        {/* Indicator Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Indicator Summary for {selectedSymbol}</CardTitle>
            <CardDescription>
              Technical analysis overview based on selected indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Overall Signal</h3>
                  <p className="text-muted-foreground">Based on all indicators</p>
                </div>
                <Badge variant="outline" className="text-green-500 border-green-500">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  Moderately Bullish
                </Badge>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-3">Signal Breakdown</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-card rounded-lg p-4 border">
                    <div className="text-muted-foreground text-sm mb-1">Bullish Signals</div>
                    <div className="text-2xl font-bold text-green-500">4</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      MACD, MA, Ichimoku, OBV
                    </div>
                  </div>
                  <div className="bg-card rounded-lg p-4 border">
                    <div className="text-muted-foreground text-sm mb-1">Bearish Signals</div>
                    <div className="text-2xl font-bold text-red-500">2</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      RSI, Stochastic
                    </div>
                  </div>
                  <div className="bg-card rounded-lg p-4 border">
                    <div className="text-muted-foreground text-sm mb-1">Neutral Signals</div>
                    <div className="text-2xl font-bold text-gray-500">4</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      BB, ADX, Fib, ATR
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Indicator Table */}
        <Card>
          <CardHeader>
            <CardTitle>Indicator Analysis</CardTitle>
            <CardDescription>
              Detailed breakdown of each technical indicator
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Indicator</th>
                    <th className="text-left py-3 px-4">Value</th>
                    <th className="text-center py-3 px-4">Signal</th>
                    <th className="text-center py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIndicators.map((indicator) => (
                    <tr 
                      key={indicator.id} 
                      className={`border-b hover:bg-muted/50 ${selectedIndicator === indicator.id ? 'bg-primary/10' : ''}`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium">{indicator.name}</div>
                        <div className="text-xs text-muted-foreground">{indicator.category}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">{indicator.value}</div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <Badge variant="outline" className={getSignalColor(indicator.signal)}>
                          {getSignalIcon(indicator.signal)}
                          <span className="ml-1">{indicator.signal}</span>
                        </Badge>
                      </td>
                      <td className="text-center py-3 px-4">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedIndicator(indicator.id === selectedIndicator ? null : indicator.id)}
                        >
                          {selectedIndicator === indicator.id ? 'Hide Details' : 'View Details'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Indicator Details */}
        {selectedIndicator && (
          <Card>
            <CardHeader>
              <CardTitle>
                {mockIndicators.find(i => i.id === selectedIndicator)?.name}
              </CardTitle>
              <CardDescription>
                Detailed analysis and visualization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="chart">
                <TabsList className="mb-4">
                  <TabsTrigger value="chart">Chart</TabsTrigger>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="chart" className="space-y-4">
                  <div className="h-64 flex items-center justify-center border rounded-md">
                    <div className="text-center text-muted-foreground">
                      <LineChart className="h-16 w-16 mx-auto mb-2" />
                      <p>Indicator chart will be displayed here</p>
                      <p className="text-sm">In a real implementation, this would show the indicator visualization</p>
                    </div>
                  </div>
                  
                  <div className="bg-card rounded-lg p-4 border">
                    <h3 className="text-lg font-medium mb-2">Signal Analysis</h3>
                    <p className="text-sm">
                      {selectedIndicator === 'rsi' && (
                        <>
                          The RSI is currently at 68.5, approaching overbought territory (70+). 
                          This suggests that the market may be due for a potential pullback or consolidation.
                          However, in strong trends, RSI can remain overbought for extended periods.
                        </>
                      )}
                      {selectedIndicator === 'macd' && (
                        <>
                          The MACD line is above the signal line and the histogram is positive, 
                          indicating bullish momentum. The recent crossover suggests a potential 
                          continuation of the uptrend. Volume is confirming this signal.
                        </>
                      )}
                      {selectedIndicator === 'bb' && (
                        <>
                          Price is testing the upper Bollinger Band, indicating strong momentum.
                          This could suggest either a continuation of the trend or a potential reversal.
                          Watch for a close outside the band followed by a close inside for a potential reversal signal.
                        </>
                      )}
                      {selectedIndicator !== 'rsi' && selectedIndicator !== 'macd' && selectedIndicator !== 'bb' && (
                        <>
                          The {mockIndicators.find(i => i.id === selectedIndicator)?.name} is currently showing a 
                          {mockIndicators.find(i => i.id === selectedIndicator)?.signal} signal. 
                          This indicator is used to {mockIndicators.find(i => i.id === selectedIndicator)?.description.toLowerCase()}
                        </>
                      )}
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="description" className="space-y-4">
                  <div className="bg-card rounded-lg p-4 border">
                    <h3 className="text-lg font-medium mb-2">About this Indicator</h3>
                    <p className="text-sm">
                      {mockIndicators.find(i => i.id === selectedIndicator)?.description}
                    </p>
                    
                    <h4 className="text-md font-medium mt-4 mb-2">How to Use</h4>
                    <p className="text-sm">
                      {selectedIndicator === 'rsi' && (
                        <>
                          The RSI oscillates between 0 and 100. Traditionally, RSI readings greater than 70 indicate overbought 
                          conditions, while readings below 30 indicate oversold conditions. Traders also look for divergences 
                          between the RSI and price to identify potential reversals.
                        </>
                      )}
                      {selectedIndicator === 'macd' && (
                        <>
                          The MACD generates signals when it crosses above (bullish) or below (bearish) its signal line.
                          The histogram represents the difference between the MACD and its signal line, with increasing 
                          histogram values indicating increasing momentum.
                        </>
                      )}
                      {selectedIndicator === 'bb' && (
                        <>
                          Bollinger Bands consist of a middle band (usually a 20-period SMA) and two outer bands placed 
                          2 standard deviations away from the middle band. Price reaching the upper band indicates overbought 
                          conditions, while price reaching the lower band indicates oversold conditions.
                        </>
                      )}
                      {selectedIndicator !== 'rsi' && selectedIndicator !== 'macd' && selectedIndicator !== 'bb' && (
                        <>
                          This indicator is commonly used by traders to identify potential entry and exit points,
                          trend direction, and market conditions. It works best when combined with other indicators
                          and price action analysis for confirmation.
                        </>
                      )}
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="settings" className="space-y-4">
                  <div className="bg-card rounded-lg p-4 border">
                    <h3 className="text-lg font-medium mb-2">Indicator Settings</h3>
                    
                    {selectedIndicator === 'rsi' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="rsi-period-detail">Period</Label>
                          <Input id="rsi-period-detail" type="number" defaultValue="14" />
                          <p className="text-xs text-muted-foreground">
                            The number of periods used to calculate the RSI. Lower values make it more sensitive.
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="rsi-overbought">Overbought Level</Label>
                          <Input id="rsi-overbought" type="number" defaultValue="70" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="rsi-oversold">Oversold Level</Label>
                          <Input id="rsi-oversold" type="number" defaultValue="30" />
                        </div>
                      </div>
                    )}
                    
                    {selectedIndicator === 'macd' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="macd-fast-detail">Fast Period</Label>
                          <Input id="macd-fast-detail" type="number" defaultValue="12" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="macd-slow-detail">Slow Period</Label>
                          <Input id="macd-slow-detail" type="number" defaultValue="26" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="macd-signal-detail">Signal Period</Label>
                          <Input id="macd-signal-detail" type="number" defaultValue="9" />
                        </div>
                      </div>
                    )}
                    
                    {selectedIndicator === 'bb' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="bb-period">Period</Label>
                          <Input id="bb-period" type="number" defaultValue="20" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="bb-deviation">Standard Deviation</Label>
                          <Input id="bb-deviation" type="number" defaultValue="2" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="bb-ma-type">Moving Average Type</Label>
                          <Select defaultValue="sma">
                            <SelectTrigger id="bb-ma-type">
                              <SelectValue placeholder="Select MA type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sma">Simple (SMA)</SelectItem>
                              <SelectItem value="ema">Exponential (EMA)</SelectItem>
                              <SelectItem value="wma">Weighted (WMA)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                    
                    {selectedIndicator !== 'rsi' && selectedIndicator !== 'macd' && selectedIndicator !== 'bb' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="indicator-period">Period</Label>
                          <Input id="indicator-period" type="number" defaultValue="14" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="indicator-source">Price Source</Label>
                          <Select defaultValue="close">
                            <SelectTrigger id="indicator-source">
                              <SelectValue placeholder="Select price source" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="close">Close</SelectItem>
                              <SelectItem value="open">Open</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="hl2">HL/2</SelectItem>
                              <SelectItem value="hlc3">HLC/3</SelectItem>
                              <SelectItem value="ohlc4">OHLC/4</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                    
                    <Button className="w-full mt-4">Apply Changes</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TechnicalIndicators;
