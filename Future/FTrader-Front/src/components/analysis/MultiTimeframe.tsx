import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LineChart, BarChart3, TrendingUp, TrendingDown, Clock, ArrowUpDown, Info } from "lucide-react";

// Mock data for multi-timeframe analysis
const mockTimeframes = [
  { value: "1m", label: "1 Minute" },
  { value: "5m", label: "5 Minutes" },
  { value: "15m", label: "15 Minutes" },
  { value: "1h", label: "1 Hour" },
  { value: "4h", label: "4 Hours" },
  { value: "1d", label: "Daily" },
  { value: "1w", label: "Weekly" }
];

const mockIndicators = [
  { id: "ma", name: "Moving Average", timeframes: ["1h", "4h", "1d"], signals: ["bullish", "bullish", "neutral"] },
  { id: "rsi", name: "RSI", timeframes: ["1h", "4h", "1d"], signals: ["overbought", "neutral", "neutral"] },
  { id: "macd", name: "MACD", timeframes: ["1h", "4h", "1d"], signals: ["bullish", "bullish", "bullish"] },
  { id: "bb", name: "Bollinger Bands", timeframes: ["1h", "4h", "1d"], signals: ["upper", "middle", "middle"] },
  { id: "ichimoku", name: "Ichimoku Cloud", timeframes: ["1h", "4h", "1d"], signals: ["bearish", "neutral", "bullish"] }
];

const getSignalColor = (signal: string) => {
  switch (signal) {
    case 'bullish':
      return 'text-green-500';
    case 'bearish':
      return 'text-red-500';
    case 'overbought':
      return 'text-red-400';
    case 'oversold':
      return 'text-green-400';
    case 'upper':
      return 'text-blue-500';
    case 'lower':
      return 'text-orange-500';
    default:
      return 'text-gray-500';
  }
};

const getSignalIcon = (signal: string) => {
  switch (signal) {
    case 'bullish':
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case 'bearish':
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    case 'overbought':
      return <ArrowUpDown className="h-4 w-4 text-red-400" />;
    case 'oversold':
      return <ArrowUpDown className="h-4 w-4 text-green-400" />;
    default:
      return <Info className="h-4 w-4 text-gray-500" />;
  }
};

const MultiTimeframe: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState("EURUSD");
  const [selectedTimeframes, setSelectedTimeframes] = useState(["1h", "4h", "1d"]);
  const [hasResults, setHasResults] = useState(true);

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Configuration Panel */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Multi-Timeframe Analysis</CardTitle>
          <CardDescription>Analyze market conditions across multiple timeframes</CardDescription>
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
            <Label>Timeframes</Label>
            <div className="flex flex-wrap gap-2">
              {mockTimeframes.map((tf) => (
                <Badge 
                  key={tf.value}
                  variant={selectedTimeframes.includes(tf.value) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    if (selectedTimeframes.includes(tf.value)) {
                      setSelectedTimeframes(selectedTimeframes.filter(t => t !== tf.value));
                    } else {
                      setSelectedTimeframes([...selectedTimeframes, tf.value]);
                    }
                  }}
                >
                  {tf.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Technical Indicators */}
          <div className="space-y-2">
            <Label>Technical Indicators</Label>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {mockIndicators.map((indicator) => (
                <div key={indicator.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={indicator.id}
                    defaultChecked
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor={indicator.id} className="cursor-pointer">
                    {indicator.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => setHasResults(true)}>
            Analyze
          </Button>
        </CardFooter>
      </Card>

      {/* Results Panel */}
      <div className="col-span-8 space-y-6">
        {hasResults ? (
          <>
            {/* Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle>Analysis Summary for {selectedSymbol}</CardTitle>
                <CardDescription>
                  Multi-timeframe technical analysis overview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Overall Trend Direction</h3>
                      <p className="text-muted-foreground">Based on selected timeframes</p>
                    </div>
                    <Badge variant="outline" className="text-green-500 border-green-500">
                      <TrendingUp className="mr-1 h-4 w-4" />
                      Bullish
                    </Badge>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Timeframe Alignment</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedTimeframes.map((tf, index) => (
                        <div key={tf} className="bg-card rounded-lg p-4 border">
                          <div className="text-muted-foreground text-sm mb-1">{mockTimeframes.find(t => t.value === tf)?.label}</div>
                          <div className="text-lg font-bold flex items-center">
                            <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                            Bullish
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            3/5 indicators aligned
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Indicator Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Indicator Analysis</CardTitle>
                <CardDescription>
                  Technical indicators across multiple timeframes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">Indicator</th>
                        {selectedTimeframes.map(tf => (
                          <th key={tf} className="text-center py-2 px-4">
                            {mockTimeframes.find(t => t.value === tf)?.label}
                          </th>
                        ))}
                        <th className="text-center py-2 px-4">Alignment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockIndicators.map((indicator, index) => (
                        <tr key={indicator.id} className={index % 2 === 0 ? 'bg-muted/50' : ''}>
                          <td className="py-3 px-4">{indicator.name}</td>
                          {selectedTimeframes.map((tf, tfIndex) => {
                            const signal = indicator.signals[tfIndex];
                            return (
                              <td key={`${indicator.id}-${tf}`} className="text-center py-3 px-4">
                                <div className="flex items-center justify-center">
                                  {getSignalIcon(signal)}
                                  <span className={`ml-1 ${getSignalColor(signal)}`}>
                                    {signal}
                                  </span>
                                </div>
                              </td>
                            );
                          })}
                          <td className="text-center py-3 px-4">
                            <Badge variant={
                              new Set(indicator.signals).size === 1 ? "default" : 
                              new Set(indicator.signals).size === 2 ? "secondary" : "outline"
                            }>
                              {new Set(indicator.signals).size === 1 ? "Strong" : 
                               new Set(indicator.signals).size === 2 ? "Moderate" : "Weak"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Chart Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Chart Comparison</CardTitle>
                <CardDescription>
                  Visual comparison across timeframes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="chart">
                  <TabsList className="mb-4">
                    <TabsTrigger value="chart">Price Charts</TabsTrigger>
                    <TabsTrigger value="volume">Volume Profile</TabsTrigger>
                    <TabsTrigger value="momentum">Momentum</TabsTrigger>
                  </TabsList>
                  <TabsContent value="chart" className="h-96 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <LineChart className="h-16 w-16 mx-auto mb-2" />
                      <p>Multi-timeframe price charts will be displayed here</p>
                      <p className="text-sm">In a real implementation, this would show price charts for each selected timeframe</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="volume" className="h-96 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <BarChart3 className="h-16 w-16 mx-auto mb-2" />
                      <p>Volume profile comparison will be displayed here</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="momentum" className="h-96 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <TrendingUp className="h-16 w-16 mx-auto mb-2" />
                      <p>Momentum indicator comparison will be displayed here</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Clock className="h-24 w-24 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No Analysis Results Yet</h3>
              <p className="max-w-md">
                Select an instrument and timeframes, then click "Analyze" to see multi-timeframe analysis results.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiTimeframe;
