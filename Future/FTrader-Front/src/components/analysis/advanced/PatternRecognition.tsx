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
  TrendingUp, 
  TrendingDown, 
  ArrowUpDown,
  Waves,
  BarChart,
  Search,
  Eye
} from "lucide-react";

// Mock data for detected patterns
const mockPatterns = [
  { 
    id: "head-shoulders", 
    name: "Head and Shoulders", 
    type: "Reversal",
    confidence: 87, 
    timeframe: "4h", 
    symbol: "EURUSD",
    location: "Current",
    description: "A bearish reversal pattern that signals a market top is likely to form." 
  },
  { 
    id: "double-bottom", 
    name: "Double Bottom", 
    type: "Reversal",
    confidence: 92, 
    timeframe: "1d", 
    symbol: "GBPUSD",
    location: "Recent",
    description: "A bullish reversal pattern that signals a market bottom is likely to form." 
  },
  { 
    id: "bull-flag", 
    name: "Bull Flag", 
    type: "Continuation",
    confidence: 78, 
    timeframe: "1h", 
    symbol: "BTCUSD",
    location: "Current",
    description: "A bullish continuation pattern that signals a brief consolidation before continuing the uptrend." 
  },
  { 
    id: "triangle", 
    name: "Symmetrical Triangle", 
    type: "Continuation",
    confidence: 83, 
    timeframe: "15m", 
    symbol: "AAPL",
    location: "Recent",
    description: "A continuation pattern that can break in either direction, but usually continues the prior trend." 
  },
  { 
    id: "gartley", 
    name: "Gartley Pattern", 
    type: "Harmonic",
    confidence: 75, 
    timeframe: "4h", 
    symbol: "USDJPY",
    location: "Current",
    description: "A harmonic pattern that uses Fibonacci retracement levels to identify potential reversal points." 
  },
  { 
    id: "abcd", 
    name: "ABCD Pattern", 
    type: "Harmonic",
    confidence: 81, 
    timeframe: "1d", 
    symbol: "XAUUSD",
    location: "Recent",
    description: "A harmonic pattern where each leg is approximately equal in price and time." 
  },
  { 
    id: "three-drives", 
    name: "Three Drives Pattern", 
    type: "Harmonic",
    confidence: 68, 
    timeframe: "1w", 
    symbol: "EURUSD",
    location: "Historical",
    description: "A reversal pattern consisting of three consecutive higher highs or lower lows." 
  },
  { 
    id: "cup-handle", 
    name: "Cup and Handle", 
    type: "Continuation",
    confidence: 79, 
    timeframe: "1d", 
    symbol: "MSFT",
    location: "Current",
    description: "A bullish continuation pattern resembling a cup with a handle, signaling a potential upward breakout." 
  }
];

// Pattern types for filtering
const patternTypes = [
  { id: "all", name: "All Patterns" },
  { id: "reversal", name: "Reversal" },
  { id: "continuation", name: "Continuation" },
  { id: "harmonic", name: "Harmonic" },
  { id: "candlestick", name: "Candlestick" }
];

// Function to get confidence color
const getConfidenceColor = (confidence: number) => {
  if (confidence >= 90) {
    return "text-green-500";
  } else if (confidence >= 75) {
    return "text-blue-500";
  } else if (confidence >= 60) {
    return "text-yellow-500";
  } else {
    return "text-red-500";
  }
};

// Function to get pattern type badge color
const getPatternTypeColor = (type: string) => {
  if (type === "Reversal") {
    return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
  } else if (type === "Continuation") {
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
  } else if (type === "Harmonic") {
    return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
  } else if (type === "Candlestick") {
    return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
  } else {
    return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

const PatternRecognition: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [confidenceThreshold, setConfidenceThreshold] = useState(60);

  // Filter patterns based on selected criteria
  const filteredPatterns = mockPatterns.filter(pattern => {
    const typeMatch = selectedType === "all" || pattern.type.toLowerCase() === selectedType.toLowerCase();
    const symbolMatch = selectedSymbol === "all" || pattern.symbol === selectedSymbol;
    const confidenceMatch = pattern.confidence >= confidenceThreshold;
    return typeMatch && symbolMatch && confidenceMatch;
  });

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Configuration Panel */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Pattern Recognition</CardTitle>
          <CardDescription>Automatically detect chart patterns using AI</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Instrument Selection */}
          <div className="space-y-2">
            <Label htmlFor="instrument">Instrument</Label>
            <Select defaultValue="all" onValueChange={setSelectedSymbol}>
              <SelectTrigger id="instrument">
                <SelectValue placeholder="Select instrument" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Instruments</SelectItem>
                <SelectItem value="EURUSD">EUR/USD</SelectItem>
                <SelectItem value="GBPUSD">GBP/USD</SelectItem>
                <SelectItem value="USDJPY">USD/JPY</SelectItem>
                <SelectItem value="BTCUSD">BTC/USD</SelectItem>
                <SelectItem value="AAPL">AAPL</SelectItem>
                <SelectItem value="MSFT">MSFT</SelectItem>
                <SelectItem value="XAUUSD">Gold (XAU/USD)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Timeframe Selection */}
          <div className="space-y-2">
            <Label htmlFor="timeframe">Timeframe</Label>
            <Select defaultValue="all">
              <SelectTrigger id="timeframe">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Timeframes</SelectItem>
                <SelectItem value="15m">15 Minutes</SelectItem>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="4h">4 Hours</SelectItem>
                <SelectItem value="1d">Daily</SelectItem>
                <SelectItem value="1w">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pattern Types */}
          <div className="space-y-2">
            <Label>Pattern Types</Label>
            <div className="flex flex-wrap gap-2">
              {patternTypes.map((type) => (
                <Badge 
                  key={type.id}
                  variant={selectedType === type.id ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedType(type.id)}
                >
                  {type.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Confidence Threshold */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="confidence">Confidence Threshold</Label>
              <span className="text-sm">{confidenceThreshold}%</span>
            </div>
            <input
              type="range"
              id="confidence"
              min="50"
              max="95"
              step="5"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>50%</span>
              <span>95%</span>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-2 pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">Advanced Settings</h3>
            
            <div className="space-y-2">
              <Label htmlFor="detection-mode" className="text-xs">Detection Mode</Label>
              <Select defaultValue="balanced">
                <SelectTrigger id="detection-mode" className="h-8">
                  <SelectValue placeholder="Select detection mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservative (fewer false positives)</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="aggressive">Aggressive (more patterns)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <input type="checkbox" id="include-incomplete" className="h-4 w-4 rounded border-gray-300" defaultChecked />
              <Label htmlFor="include-incomplete" className="text-xs">Include incomplete patterns</Label>
            </div>
            
            <div className="flex items-center space-x-2 pt-1">
              <input type="checkbox" id="auto-refresh" className="h-4 w-4 rounded border-gray-300" defaultChecked />
              <Label htmlFor="auto-refresh" className="text-xs">Auto-refresh (every 5 minutes)</Label>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Scan for Patterns</Button>
        </CardFooter>
      </Card>

      {/* Results Panel */}
      <div className="col-span-8 space-y-6">
        {/* Pattern Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Pattern Detection Results</CardTitle>
            <CardDescription>
              Found {filteredPatterns.length} patterns matching your criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Pattern</th>
                    <th className="text-left py-3 px-4">Instrument</th>
                    <th className="text-left py-3 px-4">Timeframe</th>
                    <th className="text-center py-3 px-4">Confidence</th>
                    <th className="text-center py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatterns.map((pattern) => (
                    <tr 
                      key={pattern.id} 
                      className={`border-b hover:bg-muted/50 ${selectedPattern === pattern.id ? 'bg-primary/10' : ''}`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium">{pattern.name}</div>
                        <Badge className={`text-xs ${getPatternTypeColor(pattern.type)}`}>
                          {pattern.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {pattern.symbol}
                      </td>
                      <td className="py-3 px-4">
                        {pattern.timeframe}
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className={`font-medium ${getConfidenceColor(pattern.confidence)}`}>
                          {pattern.confidence}%
                        </span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <div className="flex justify-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedPattern(pattern.id === selectedPattern ? null : pattern.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pattern Details */}
        {selectedPattern && (
          <Card>
            <CardHeader>
              <CardTitle>
                {mockPatterns.find(p => p.id === selectedPattern)?.name} Pattern
              </CardTitle>
              <CardDescription>
                Detailed analysis and trading implications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Pattern Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium">{mockPatterns.find(p => p.id === selectedPattern)?.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Instrument:</span>
                        <span className="font-medium">{mockPatterns.find(p => p.id === selectedPattern)?.symbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Timeframe:</span>
                        <span className="font-medium">{mockPatterns.find(p => p.id === selectedPattern)?.timeframe}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Confidence:</span>
                        <span className={`font-medium ${getConfidenceColor(mockPatterns.find(p => p.id === selectedPattern)?.confidence || 0)}`}>
                          {mockPatterns.find(p => p.id === selectedPattern)?.confidence}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant="outline" className="text-blue-500 border-blue-500">
                          {mockPatterns.find(p => p.id === selectedPattern)?.location}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">
                      {mockPatterns.find(p => p.id === selectedPattern)?.description}
                    </p>
                    {selectedPattern === "head-shoulders" && (
                      <p className="text-sm text-muted-foreground mt-2">
                        The pattern consists of three peaks, with the middle peak (head) being the highest and the two outside peaks (shoulders) being lower and roughly equal. The pattern is complete when the price breaks below the neckline, which is drawn by connecting the lows between the peaks.
                      </p>
                    )}
                    {selectedPattern === "double-bottom" && (
                      <p className="text-sm text-muted-foreground mt-2">
                        The pattern consists of two lows at approximately the same price level, separated by a moderate peak. The pattern is confirmed when the price breaks above the resistance level formed by the peak between the two lows.
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Trading Implications</h3>
                    {selectedPattern === "head-shoulders" && (
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start">
                          <TrendingDown className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span>Bearish reversal signal, suggesting a potential downtrend</span>
                        </div>
                        <div className="flex items-start">
                          <span className="font-medium text-muted-foreground mr-2">Entry:</span>
                          <span>When price breaks below the neckline with increased volume</span>
                        </div>
                        <div className="flex items-start">
                          <span className="font-medium text-muted-foreground mr-2">Target:</span>
                          <span>Distance from head to neckline, projected downward from breakpoint</span>
                        </div>
                        <div className="flex items-start">
                          <span className="font-medium text-muted-foreground mr-2">Stop Loss:</span>
                          <span>Above the right shoulder</span>
                        </div>
                      </div>
                    )}
                    {selectedPattern === "double-bottom" && (
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start">
                          <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span>Bullish reversal signal, suggesting a potential uptrend</span>
                        </div>
                        <div className="flex items-start">
                          <span className="font-medium text-muted-foreground mr-2">Entry:</span>
                          <span>When price breaks above the resistance level with increased volume</span>
                        </div>
                        <div className="flex items-start">
                          <span className="font-medium text-muted-foreground mr-2">Target:</span>
                          <span>Distance from bottom to resistance, projected upward from breakpoint</span>
                        </div>
                        <div className="flex items-start">
                          <span className="font-medium text-muted-foreground mr-2">Stop Loss:</span>
                          <span>Below the second bottom</span>
                        </div>
                      </div>
                    )}
                    {selectedPattern !== "head-shoulders" && selectedPattern !== "double-bottom" && (
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start">
                          {mockPatterns.find(p => p.id === selectedPattern)?.type === "Reversal" ? (
                            <ArrowUpDown className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                          ) : (
                            <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          )}
                          <span>
                            {mockPatterns.find(p => p.id === selectedPattern)?.type === "Reversal" 
                              ? "Potential trend reversal signal" 
                              : "Potential trend continuation signal"}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="font-medium text-muted-foreground mr-2">Success Rate:</span>
                          <span>Historically 68% accurate when confidence is above 75%</span>
                        </div>
                        <div className="flex items-start">
                          <span className="font-medium text-muted-foreground mr-2">Recommended:</span>
                          <span>Confirm with volume and other technical indicators</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-64 border rounded-md flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <LineChart className="h-16 w-16 mx-auto mb-2" />
                      <p>Pattern visualization</p>
                      <p className="text-sm">In a real implementation, this would show the pattern on the chart</p>
                    </div>
                  </div>

                  <div className="border rounded-md p-4 space-y-4">
                    <h3 className="text-lg font-medium">Similar Patterns</h3>
                    <div className="space-y-2">
                      {selectedPattern === "head-shoulders" && (
                        <>
                          <div className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-md cursor-pointer">
                            <div>
                              <div className="font-medium">Inverse Head and Shoulders</div>
                              <div className="text-xs text-muted-foreground">Bullish reversal pattern</div>
                            </div>
                            <Button variant="ghost" size="sm">View</Button>
                          </div>
                          <div className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-md cursor-pointer">
                            <div>
                              <div className="font-medium">Double Top</div>
                              <div className="text-xs text-muted-foreground">Bearish reversal pattern</div>
                            </div>
                            <Button variant="ghost" size="sm">View</Button>
                          </div>
                        </>
                      )}
                      {selectedPattern === "double-bottom" && (
                        <>
                          <div className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-md cursor-pointer">
                            <div>
                              <div className="font-medium">Double Top</div>
                              <div className="text-xs text-muted-foreground">Bearish reversal pattern</div>
                            </div>
                            <Button variant="ghost" size="sm">View</Button>
                          </div>
                          <div className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-md cursor-pointer">
                            <div>
                              <div className="font-medium">Inverse Head and Shoulders</div>
                              <div className="text-xs text-muted-foreground">Bullish reversal pattern</div>
                            </div>
                            <Button variant="ghost" size="sm">View</Button>
                          </div>
                        </>
                      )}
                      {selectedPattern !== "head-shoulders" && selectedPattern !== "double-bottom" && (
                        <>
                          <div className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-md cursor-pointer">
                            <div>
                              <div className="font-medium">Related Pattern 1</div>
                              <div className="text-xs text-muted-foreground">Similar characteristics</div>
                            </div>
                            <Button variant="ghost" size="sm">View</Button>
                          </div>
                          <div className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-md cursor-pointer">
                            <div>
                              <div className="font-medium">Related Pattern 2</div>
                              <div className="text-xs text-muted-foreground">Similar characteristics</div>
                            </div>
                            <Button variant="ghost" size="sm">View</Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button className="flex-1">
                      <Search className="h-4 w-4 mr-2" />
                      Find Similar
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <LineChart className="h-4 w-4 mr-2" />
                      Open in Chart
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PatternRecognition;
