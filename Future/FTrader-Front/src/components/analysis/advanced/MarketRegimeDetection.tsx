import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  BarChart4,
  RefreshCw,
  Download,
  Clock,
  Zap,
  AlertTriangle,
  Shuffle,
  LineChart,
  BarChart
} from "lucide-react";

// Mock market regime data
const mockRegimeData = {
  currentRegime: "bullish_volatility",
  regimeHistory: [
    { date: "2024-09-01", regime: "bearish_volatility", duration: 45, returns: -0.12 },
    { date: "2024-10-15", regime: "bearish_trending", duration: 62, returns: -0.08 },
    { date: "2024-12-16", regime: "neutral", duration: 28, returns: 0.02 },
    { date: "2025-01-13", regime: "bullish_trending", duration: 38, returns: 0.15 },
    { date: "2025-02-20", regime: "bullish_volatility", duration: 21, returns: 0.06 }
  ],
  regimeDefinitions: {
    "bullish_trending": { 
      name: "Bullish Trending", 
      description: "Strong upward trend with low volatility",
      characteristics: ["Positive returns", "Low volatility", "Strong momentum", "Narrow trading ranges"],
      avgDuration: 42,
      avgReturns: 0.18,
      bestStrategies: ["Trend following", "Momentum", "Growth stocks"]
    },
    "bullish_volatility": { 
      name: "Bullish Volatile", 
      description: "Upward bias with high volatility",
      characteristics: ["Positive returns", "High volatility", "Frequent pullbacks", "Wide trading ranges"],
      avgDuration: 26,
      avgReturns: 0.09,
      bestStrategies: ["Mean reversion", "Volatility selling", "Quality stocks"]
    },
    "neutral": { 
      name: "Neutral/Ranging", 
      description: "Sideways movement with moderate volatility",
      characteristics: ["Flat returns", "Moderate volatility", "No clear direction", "Defined trading ranges"],
      avgDuration: 35,
      avgReturns: 0.01,
      bestStrategies: ["Range trading", "Pair trading", "Dividend stocks"]
    },
    "bearish_trending": { 
      name: "Bearish Trending", 
      description: "Strong downward trend with low volatility",
      characteristics: ["Negative returns", "Low volatility", "Strong downward momentum", "Few relief rallies"],
      avgDuration: 38,
      avgReturns: -0.15,
      bestStrategies: ["Short selling", "Defensive stocks", "Treasuries"]
    },
    "bearish_volatility": { 
      name: "Bearish Volatile", 
      description: "Downward bias with high volatility",
      characteristics: ["Negative returns", "High volatility", "Sharp rallies and selloffs", "Wide trading ranges"],
      avgDuration: 31,
      avgReturns: -0.12,
      bestStrategies: ["Volatility trading", "Hedging", "Cash"]
    }
  },
  transitionProbabilities: {
    "bullish_trending": {
      "bullish_trending": 0.70,
      "bullish_volatility": 0.15,
      "neutral": 0.10,
      "bearish_trending": 0.02,
      "bearish_volatility": 0.03
    },
    "bullish_volatility": {
      "bullish_trending": 0.25,
      "bullish_volatility": 0.45,
      "neutral": 0.20,
      "bearish_trending": 0.05,
      "bearish_volatility": 0.05
    },
    "neutral": {
      "bullish_trending": 0.20,
      "bullish_volatility": 0.15,
      "neutral": 0.35,
      "bearish_trending": 0.15,
      "bearish_volatility": 0.15
    },
    "bearish_trending": {
      "bullish_trending": 0.03,
      "bullish_volatility": 0.02,
      "neutral": 0.10,
      "bearish_trending": 0.70,
      "bearish_volatility": 0.15
    },
    "bearish_volatility": {
      "bullish_trending": 0.05,
      "bullish_volatility": 0.05,
      "neutral": 0.20,
      "bearish_trending": 0.25,
      "bearish_volatility": 0.45
    }
  },
  indicators: {
    "trend": 0.65, // -1 to 1, positive means uptrend
    "volatility": 0.72, // 0 to 1, higher means more volatile
    "momentum": 0.58, // -1 to 1, positive means positive momentum
    "breadth": 0.62, // 0 to 1, higher means broader market participation
    "sentiment": 0.55, // -1 to 1, positive means bullish sentiment
  },
  marketData: {
    index: "IX.D.FTSE.DAILY.IP",
    name: "FTSE 100",
    timeframe: "Daily",
    lookbackPeriod: 90
  }
};

// Helper function to format percentage
const formatPercent = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2 }).format(value);
};

// Helper function to get regime color
const getRegimeColor = (regime: string) => {
  switch(regime) {
    case 'bullish_trending': return 'bg-green-500';
    case 'bullish_volatility': return 'bg-emerald-400';
    case 'neutral': return 'bg-blue-400';
    case 'bearish_trending': return 'bg-red-500';
    case 'bearish_volatility': return 'bg-orange-500';
    default: return 'bg-gray-400';
  }
};

// Helper function to get regime badge variant
const getRegimeBadgeVariant = (regime: string): "default" | "secondary" | "destructive" | "outline" => {
  switch(regime) {
    case 'bullish_trending': return 'default';
    case 'bullish_volatility': return 'default';
    case 'neutral': return 'secondary';
    case 'bearish_trending': return 'destructive';
    case 'bearish_volatility': return 'destructive';
    default: return 'outline';
  }
};

// Helper function to get regime icon
const getRegimeIcon = (regime: string) => {
  switch(regime) {
    case 'bullish_trending': return <TrendingUp className="h-5 w-5 text-green-500" />;
    case 'bullish_volatility': return <Activity className="h-5 w-5 text-emerald-500" />;
    case 'neutral': return <Shuffle className="h-5 w-5 text-blue-500" />;
    case 'bearish_trending': return <TrendingDown className="h-5 w-5 text-red-500" />;
    case 'bearish_volatility': return <BarChart4 className="h-5 w-5 text-orange-500" />;
    default: return <Activity className="h-5 w-5 text-gray-500" />;
  }
};

const MarketRegimeDetection: React.FC = () => {
  const [selectedMarket, setSelectedMarket] = useState("ftse");
  const [timeframe, setTimeframe] = useState("daily");
  const [lookbackPeriod, setLookbackPeriod] = useState("90");
  const [detectionMethod, setDetectionMethod] = useState("multi_factor");
  
  // Get current regime data
  const currentRegime = mockRegimeData.regimeDefinitions[mockRegimeData.currentRegime as keyof typeof mockRegimeData.regimeDefinitions];
  const regimeHistory = mockRegimeData.regimeHistory;
  
  // Get next regime probabilities
  const nextRegimeProbabilities = mockRegimeData.transitionProbabilities[mockRegimeData.currentRegime as keyof typeof mockRegimeData.transitionProbabilities];

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Configuration Panel */}
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Market Regime Detection</CardTitle>
          <CardDescription>Identify market conditions and adapt your strategy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Market Selection */}
          <div className="space-y-2">
            <Label htmlFor="market">Market</Label>
            <Select defaultValue="ftse" onValueChange={setSelectedMarket}>
              <SelectTrigger id="market">
                <SelectValue placeholder="Select market" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ftse">FTSE 100</SelectItem>
                <SelectItem value="dax">DAX</SelectItem>
                <SelectItem value="sp500">S&P 500</SelectItem>
                <SelectItem value="nasdaq">NASDAQ</SelectItem>
                <SelectItem value="forex">EUR/USD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Timeframe Selection */}
          <div className="space-y-2">
            <Label htmlFor="timeframe">Timeframe</Label>
            <Select defaultValue="daily" onValueChange={setTimeframe}>
              <SelectTrigger id="timeframe">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lookback Period */}
          <div className="space-y-2">
            <Label htmlFor="lookback">Lookback Period (Days)</Label>
            <Select defaultValue="90" onValueChange={setLookbackPeriod}>
              <SelectTrigger id="lookback">
                <SelectValue placeholder="Select lookback period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="60">60 Days</SelectItem>
                <SelectItem value="90">90 Days</SelectItem>
                <SelectItem value="180">180 Days</SelectItem>
                <SelectItem value="365">365 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Detection Method */}
          <div className="space-y-2">
            <Label htmlFor="method">Detection Method</Label>
            <Select defaultValue="multi_factor" onValueChange={setDetectionMethod}>
              <SelectTrigger id="method">
                <SelectValue placeholder="Select detection method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trend_volatility">Trend & Volatility</SelectItem>
                <SelectItem value="multi_factor">Multi-Factor</SelectItem>
                <SelectItem value="hidden_markov">Hidden Markov Model</SelectItem>
                <SelectItem value="machine_learning">Machine Learning</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {detectionMethod === "trend_volatility" && "Classifies regimes based on trend direction and volatility levels"}
              {detectionMethod === "multi_factor" && "Uses multiple market indicators to identify complex regime patterns"}
              {detectionMethod === "hidden_markov" && "Statistical model that identifies hidden states in market behavior"}
              {detectionMethod === "machine_learning" && "Uses ML algorithms to classify market regimes from historical data"}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Update Regime Analysis
          </Button>
        </CardFooter>
      </Card>

      {/* Results Panel */}
      <div className="col-span-9 space-y-6">
        {/* Current Regime */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Current Market Regime</CardTitle>
                <CardDescription>
                  {mockRegimeData.marketData.name}, {mockRegimeData.marketData.timeframe}, {mockRegimeData.marketData.lookbackPeriod} days lookback
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`p-4 rounded-lg ${getRegimeColor(mockRegimeData.currentRegime)}`}>
                    {getRegimeIcon(mockRegimeData.currentRegime)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{currentRegime.name}</h3>
                    <p className="text-muted-foreground">{currentRegime.description}</p>
                    <div className="flex items-center mt-2">
                      <Badge variant={getRegimeBadgeVariant(mockRegimeData.currentRegime)}>
                        Active for {regimeHistory[regimeHistory.length - 1].duration} days
                      </Badge>
                      <span className="mx-2 text-muted-foreground">•</span>
                      <span className={`font-medium ${regimeHistory[regimeHistory.length - 1].returns >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {formatPercent(regimeHistory[regimeHistory.length - 1].returns)} returns
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mt-6">
                  <h4 className="font-medium">Key Characteristics</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {currentRegime.characteristics.map((characteristic, index) => (
                      <li key={index} className="text-muted-foreground">{characteristic}</li>
                    ))}
                  </ul>
                  
                  <h4 className="font-medium mt-4">Recommended Strategies</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {currentRegime.bestStrategies.map((strategy, index) => (
                      <li key={index} className="text-muted-foreground">{strategy}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Key Market Indicators</h4>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Trend Strength</span>
                      <span className="text-sm font-medium">{formatPercent(mockRegimeData.indicators.trend)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${mockRegimeData.indicators.trend >= 0 ? 'bg-green-500' : 'bg-red-500'} h-2 rounded-full`} 
                        style={{ width: `${Math.abs(mockRegimeData.indicators.trend) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Volatility</span>
                      <span className="text-sm font-medium">{formatPercent(mockRegimeData.indicators.volatility)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full" 
                        style={{ width: `${mockRegimeData.indicators.volatility * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Momentum</span>
                      <span className="text-sm font-medium">{formatPercent(mockRegimeData.indicators.momentum)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${mockRegimeData.indicators.momentum >= 0 ? 'bg-blue-500' : 'bg-purple-500'} h-2 rounded-full`} 
                        style={{ width: `${Math.abs(mockRegimeData.indicators.momentum) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Market Breadth</span>
                      <span className="text-sm font-medium">{formatPercent(mockRegimeData.indicators.breadth)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-500 h-2 rounded-full" 
                        style={{ width: `${mockRegimeData.indicators.breadth * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Sentiment</span>
                      <span className="text-sm font-medium">{formatPercent(mockRegimeData.indicators.sentiment)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${mockRegimeData.indicators.sentiment >= 0 ? 'bg-green-500' : 'bg-red-500'} h-2 rounded-full`} 
                        style={{ width: `${Math.abs(mockRegimeData.indicators.sentiment) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium mb-3">Regime Transition Probabilities</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(nextRegimeProbabilities).map(([regime, probability]) => (
                      <div key={regime} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center">
                          {getRegimeIcon(regime)}
                          <span className="ml-2 text-sm">
                            {mockRegimeData.regimeDefinitions[regime as keyof typeof mockRegimeData.regimeDefinitions].name}
                          </span>
                        </div>
                        <Badge variant="outline">
                          {formatPercent(probability)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Regime History Chart Placeholder */}
            <div className="mt-8 border rounded-md p-4">
              <h3 className="text-lg font-medium mb-4">Historical Regime Timeline</h3>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChart className="h-16 w-16 mx-auto mb-2" />
                  <p>Regime history chart would be displayed here</p>
                  <p className="text-sm">In a real implementation, this would show market regimes over time with price overlay</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Regime History */}
        <Card>
          <CardHeader>
            <CardTitle>Regime History</CardTitle>
            <CardDescription>
              Recent market regime transitions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Start Date</th>
                    <th className="text-left py-3 px-4">Regime</th>
                    <th className="text-right py-3 px-4">Duration (Days)</th>
                    <th className="text-right py-3 px-4">Returns</th>
                    <th className="text-right py-3 px-4">Avg. Volatility</th>
                    <th className="text-right py-3 px-4">Sharpe Ratio</th>
                  </tr>
                </thead>
                <tbody>
                  {regimeHistory.map((period, index) => {
                    const regimeDef = mockRegimeData.regimeDefinitions[period.regime as keyof typeof mockRegimeData.regimeDefinitions];
                    // Mock volatility and Sharpe ratio data
                    const volatility = Math.random() * 0.1 + 0.1;
                    const sharpeRatio = period.returns / volatility;
                    
                    return (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          {period.date}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${getRegimeColor(period.regime)}`}></div>
                            <div>
                              <div className="font-medium">{regimeDef.name}</div>
                              <div className="text-xs text-muted-foreground">{regimeDef.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-right py-3 px-4">
                          {period.duration}
                        </td>
                        <td className="text-right py-3 px-4">
                          <span className={period.returns >= 0 ? 'text-green-500' : 'text-red-500'}>
                            {formatPercent(period.returns)}
                          </span>
                        </td>
                        <td className="text-right py-3 px-4">
                          {formatPercent(volatility)}
                        </td>
                        <td className="text-right py-3 px-4">
                          <span className={sharpeRatio >= 0 ? 'text-green-500' : 'text-red-500'}>
                            {sharpeRatio.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Strategy Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Strategy Recommendations</CardTitle>
            <CardDescription>
              Optimized trading approaches for the current market regime
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {currentRegime.bestStrategies.map((strategy, index) => (
                <Card key={index} className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{strategy}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {index === 0 ? "Follows market momentum with trend-based entries and exits" :
                       index === 1 ? "Captures volatility through mean reversion strategies" :
                       "Focuses on high-quality assets with strong fundamentals"}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Historical Performance:</span>
                        <span className="font-medium text-green-500">
                          {formatPercent(Math.random() * 0.2 + 0.1)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Win Rate:</span>
                        <span className="font-medium">
                          {formatPercent(Math.random() * 0.3 + 0.5)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Regime Fit:</span>
                        <span className="font-medium">
                          {formatPercent(Math.random() * 0.2 + 0.7)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      View Strategy Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Strategy Performance Chart Placeholder */}
            <div className="mt-8 border rounded-md p-4">
              <h3 className="text-lg font-medium mb-4">Strategy Performance by Regime</h3>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <LineChart className="h-16 w-16 mx-auto mb-2" />
                  <p>Strategy performance chart would be displayed here</p>
                  <p className="text-sm">In a real implementation, this would show how different strategies perform across market regimes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketRegimeDetection;
