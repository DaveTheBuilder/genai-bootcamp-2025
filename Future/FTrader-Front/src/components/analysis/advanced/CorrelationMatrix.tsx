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
  GitMerge, 
  LineChart, 
  BarChart, 
  ArrowUpDown,
  Search,
  Download,
  Calendar,
  RefreshCw
} from "lucide-react";

// Mock correlation data
const mockCorrelationData = [
  { id: "EURUSD", name: "EUR/USD", correlations: { "EURUSD": 1.00, "GBPUSD": 0.86, "USDJPY": -0.58, "AUDUSD": 0.72, "USDCAD": -0.65, "BTCUSD": 0.12, "XAUUSD": 0.35 } },
  { id: "GBPUSD", name: "GBP/USD", correlations: { "EURUSD": 0.86, "GBPUSD": 1.00, "USDJPY": -0.42, "AUDUSD": 0.68, "USDCAD": -0.59, "BTCUSD": 0.08, "XAUUSD": 0.31 } },
  { id: "USDJPY", name: "USD/JPY", correlations: { "EURUSD": -0.58, "GBPUSD": -0.42, "USDJPY": 1.00, "AUDUSD": -0.45, "USDCAD": 0.52, "BTCUSD": -0.05, "XAUUSD": -0.38 } },
  { id: "AUDUSD", name: "AUD/USD", correlations: { "EURUSD": 0.72, "GBPUSD": 0.68, "USDJPY": -0.45, "AUDUSD": 1.00, "USDCAD": -0.71, "BTCUSD": 0.18, "XAUUSD": 0.45 } },
  { id: "USDCAD", name: "USD/CAD", correlations: { "EURUSD": -0.65, "GBPUSD": -0.59, "USDJPY": 0.52, "AUDUSD": -0.71, "USDCAD": 1.00, "BTCUSD": -0.12, "XAUUSD": -0.28 } },
  { id: "BTCUSD", name: "BTC/USD", correlations: { "EURUSD": 0.12, "GBPUSD": 0.08, "USDJPY": -0.05, "AUDUSD": 0.18, "USDCAD": -0.12, "BTCUSD": 1.00, "XAUUSD": 0.22 } },
  { id: "XAUUSD", name: "Gold", correlations: { "EURUSD": 0.35, "GBPUSD": 0.31, "USDJPY": -0.38, "AUDUSD": 0.45, "USDCAD": -0.28, "BTCUSD": 0.22, "XAUUSD": 1.00 } }
];

// Mock pairs suggestions
const mockPairSuggestions = [
  { 
    pair: ["EURUSD", "GBPUSD"], 
    correlation: 0.86, 
    strength: "Strong Positive", 
    opportunity: "Pairs Trading", 
    description: "These pairs show strong positive correlation, suggesting potential for statistical arbitrage strategies." 
  },
  { 
    pair: ["EURUSD", "USDJPY"], 
    correlation: -0.58, 
    strength: "Moderate Negative", 
    opportunity: "Diversification", 
    description: "These pairs show moderate negative correlation, offering good diversification benefits." 
  },
  { 
    pair: ["AUDUSD", "USDCAD"], 
    correlation: -0.71, 
    strength: "Strong Negative", 
    opportunity: "Hedging", 
    description: "These pairs show strong negative correlation, making them suitable for hedging strategies." 
  },
  { 
    pair: ["BTCUSD", "XAUUSD"], 
    correlation: 0.22, 
    strength: "Weak Positive", 
    opportunity: "Low Correlation", 
    description: "These pairs show weak correlation, suggesting they move somewhat independently." 
  }
];

// Function to get color based on correlation value
const getCorrelationColor = (value: number) => {
  if (value >= 0.7) return "bg-green-700 text-white";
  if (value >= 0.5) return "bg-green-500 text-white";
  if (value >= 0.3) return "bg-green-300";
  if (value >= 0.1) return "bg-green-100";
  if (value > -0.1) return "bg-gray-100";
  if (value > -0.3) return "bg-red-100";
  if (value > -0.5) return "bg-red-300";
  if (value > -0.7) return "bg-red-500 text-white";
  return "bg-red-700 text-white";
};

// Function to format correlation value
const formatCorrelation = (value: number) => {
  return value.toFixed(2);
};

const CorrelationMatrix: React.FC = () => {
  const [timeframe, setTimeframe] = useState("1d");
  const [period, setPeriod] = useState("3m");
  const [selectedPair, setSelectedPair] = useState<string[] | null>(null);
  const [assetFilter, setAssetFilter] = useState("all");

  // Filter assets based on selection
  const filteredAssets = assetFilter === "all" 
    ? mockCorrelationData 
    : mockCorrelationData.filter(asset => {
        if (assetFilter === "forex") return ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCAD"].includes(asset.id);
        if (assetFilter === "crypto") return ["BTCUSD"].includes(asset.id);
        if (assetFilter === "commodities") return ["XAUUSD"].includes(asset.id);
        return true;
      });

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Configuration Panel */}
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Correlation Analysis</CardTitle>
          <CardDescription>Analyze relationships between different assets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Asset Selection */}
          <div className="space-y-2">
            <Label htmlFor="asset-filter">Asset Class</Label>
            <Select defaultValue="all" onValueChange={setAssetFilter}>
              <SelectTrigger id="asset-filter">
                <SelectValue placeholder="Select asset class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assets</SelectItem>
                <SelectItem value="forex">Forex</SelectItem>
                <SelectItem value="crypto">Cryptocurrencies</SelectItem>
                <SelectItem value="commodities">Commodities</SelectItem>
                <SelectItem value="indices">Indices</SelectItem>
                <SelectItem value="stocks">Stocks</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Timeframe Selection */}
          <div className="space-y-2">
            <Label htmlFor="timeframe">Timeframe</Label>
            <Select defaultValue="1d" onValueChange={setTimeframe}>
              <SelectTrigger id="timeframe">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="4h">4 Hours</SelectItem>
                <SelectItem value="1d">Daily</SelectItem>
                <SelectItem value="1w">Weekly</SelectItem>
                <SelectItem value="1m">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Period Selection */}
          <div className="space-y-2">
            <Label htmlFor="period">Analysis Period</Label>
            <Select defaultValue="3m" onValueChange={setPeriod}>
              <SelectTrigger id="period">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1 Month</SelectItem>
                <SelectItem value="3m">3 Months</SelectItem>
                <SelectItem value="6m">6 Months</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
                <SelectItem value="3y">3 Years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Correlation Method */}
          <div className="space-y-2">
            <Label htmlFor="method">Correlation Method</Label>
            <Select defaultValue="pearson">
              <SelectTrigger id="method">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pearson">Pearson</SelectItem>
                <SelectItem value="spearman">Spearman</SelectItem>
                <SelectItem value="kendall">Kendall</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-2 pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">Advanced Settings</h3>
            
            <div className="space-y-2">
              <Label htmlFor="threshold" className="text-xs">Correlation Threshold</Label>
              <div className="flex items-center space-x-2">
                <Input id="threshold" type="number" defaultValue="0.7" className="h-8" />
                <span className="text-xs text-muted-foreground">min</span>
              </div>
              <p className="text-xs text-muted-foreground">Highlight correlations above this threshold</p>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <input type="checkbox" id="show-negative" className="h-4 w-4 rounded border-gray-300" defaultChecked />
              <Label htmlFor="show-negative" className="text-xs">Show negative correlations</Label>
            </div>
            
            <div className="flex items-center space-x-2 pt-1">
              <input type="checkbox" id="auto-refresh" className="h-4 w-4 rounded border-gray-300" defaultChecked />
              <Label htmlFor="auto-refresh" className="text-xs">Auto-refresh (daily)</Label>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Update Correlations
          </Button>
        </CardFooter>
      </Card>

      {/* Results Panel */}
      <div className="col-span-9 space-y-6">
        {/* Correlation Matrix */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Correlation Matrix</CardTitle>
                <CardDescription>
                  {timeframe} data over {period} period
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Change Period
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 border bg-muted/50"></th>
                    {filteredAssets.map((asset) => (
                      <th key={asset.id} className="p-2 border bg-muted/50 text-center">{asset.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map((rowAsset) => (
                    <tr key={rowAsset.id}>
                      <th className="p-2 border bg-muted/50 text-left">{rowAsset.name}</th>
                      {filteredAssets.map((colAsset) => {
                        const correlation = rowAsset.correlations[colAsset.id];
                        return (
                          <td 
                            key={`${rowAsset.id}-${colAsset.id}`} 
                            className={`p-2 border text-center ${getCorrelationColor(correlation)}`}
                            onClick={() => setSelectedPair([rowAsset.id, colAsset.id])}
                            style={{ cursor: 'pointer' }}
                          >
                            {formatCorrelation(correlation)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center mt-4 space-x-6">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-700 mr-2"></div>
                <span className="text-xs">Strong Positive (0.7-1.0)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 mr-2"></div>
                <span className="text-xs">Moderate Positive (0.5-0.7)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-100 mr-2"></div>
                <span className="text-xs">Weak/No Correlation (-0.1-0.1)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 mr-2"></div>
                <span className="text-xs">Moderate Negative (-0.7--0.5)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-700 mr-2"></div>
                <span className="text-xs">Strong Negative (-1.0--0.7)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pair Analysis */}
        {selectedPair && (
          <Card>
            <CardHeader>
              <CardTitle>
                Pair Analysis: {mockCorrelationData.find(a => a.id === selectedPair[0])?.name} & {mockCorrelationData.find(a => a.id === selectedPair[1])?.name}
              </CardTitle>
              <CardDescription>
                Detailed correlation analysis and trading opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Correlation Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current Correlation:</span>
                        <span className="font-medium">
                          {formatCorrelation(mockCorrelationData.find(a => a.id === selectedPair[0])?.correlations[selectedPair[1]] || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Correlation Strength:</span>
                        <Badge variant="outline" className={
                          Math.abs(mockCorrelationData.find(a => a.id === selectedPair[0])?.correlations[selectedPair[1]] || 0) > 0.7 
                            ? "text-green-500 border-green-500" 
                            : Math.abs(mockCorrelationData.find(a => a.id === selectedPair[0])?.correlations[selectedPair[1]] || 0) > 0.3
                              ? "text-blue-500 border-blue-500"
                              : "text-gray-500 border-gray-500"
                        }>
                          {Math.abs(mockCorrelationData.find(a => a.id === selectedPair[0])?.correlations[selectedPair[1]] || 0) > 0.7 
                            ? "Strong" 
                            : Math.abs(mockCorrelationData.find(a => a.id === selectedPair[0])?.correlations[selectedPair[1]] || 0) > 0.3
                              ? "Moderate"
                              : "Weak"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Correlation Type:</span>
                        <Badge variant="outline" className={
                          (mockCorrelationData.find(a => a.id === selectedPair[0])?.correlations[selectedPair[1]] || 0) > 0
                            ? "text-green-500 border-green-500" 
                            : "text-red-500 border-red-500"
                        }>
                          {(mockCorrelationData.find(a => a.id === selectedPair[0])?.correlations[selectedPair[1]] || 0) > 0
                            ? "Positive" 
                            : "Negative"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Period:</span>
                        <span className="font-medium">{period}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Timeframe:</span>
                        <span className="font-medium">{timeframe}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Trading Implications</h3>
                    <div className="space-y-2 text-sm">
                      {(mockCorrelationData.find(a => a.id === selectedPair[0])?.correlations[selectedPair[1]] || 0) > 0.7 && (
                        <>
                          <div className="flex items-start">
                            <GitMerge className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span>Strong positive correlation suggests these assets move together, making them suitable for pairs trading strategies.</span>
                          </div>
                          <div className="flex items-start">
                            <span className="font-medium text-muted-foreground mr-2">Strategy:</span>
                            <span>Look for divergences where the correlation temporarily breaks down, as this may indicate a reversion opportunity.</span>
                          </div>
                        </>
                      )}
                      {(mockCorrelationData.find(a => a.id === selectedPair[0])?.correlations[selectedPair[1]] || 0) < -0.7 && (
                        <>
                          <div className="flex items-start">
                            <GitMerge className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span>Strong negative correlation suggests these assets move in opposite directions, making them effective for hedging.</span>
                          </div>
                          <div className="flex items-start">
                            <span className="font-medium text-muted-foreground mr-2">Strategy:</span>
                            <span>Use one asset as a hedge against the other to reduce portfolio volatility.</span>
                          </div>
                        </>
                      )}
                      {Math.abs(mockCorrelationData.find(a => a.id === selectedPair[0])?.correlations[selectedPair[1]] || 0) <= 0.3 && (
                        <>
                          <div className="flex items-start">
                            <GitMerge className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span>Low correlation suggests these assets move independently, offering diversification benefits.</span>
                          </div>
                          <div className="flex items-start">
                            <span className="font-medium text-muted-foreground mr-2">Strategy:</span>
                            <span>Include both assets in a portfolio to reduce overall risk through diversification.</span>
                          </div>
                        </>
                      )}
                      {Math.abs(mockCorrelationData.find(a => a.id === selectedPair[0])?.correlations[selectedPair[1]] || 0) > 0.3 && 
                       Math.abs(mockCorrelationData.find(a => a.id === selectedPair[0])?.correlations[selectedPair[1]] || 0) <= 0.7 && (
                        <>
                          <div className="flex items-start">
                            <GitMerge className="h-4 w-4 text-purple-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span>Moderate correlation suggests some relationship exists, but it's not consistently strong.</span>
                          </div>
                          <div className="flex items-start">
                            <span className="font-medium text-muted-foreground mr-2">Strategy:</span>
                            <span>Monitor for changes in correlation that might indicate shifting market dynamics.</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-64 border rounded-md flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <LineChart className="h-16 w-16 mx-auto mb-2" />
                      <p>Correlation chart over time</p>
                      <p className="text-sm">In a real implementation, this would show how correlation has changed</p>
                    </div>
                  </div>

                  <div className="border rounded-md p-4 space-y-4">
                    <h3 className="text-lg font-medium">Similar Pairs</h3>
                    <div className="space-y-2">
                      {mockPairSuggestions.slice(0, 3).map((suggestion, index) => (
                        <div key={index} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-md cursor-pointer">
                          <div>
                            <div className="font-medium">
                              {mockCorrelationData.find(a => a.id === suggestion.pair[0])?.name} / {mockCorrelationData.find(a => a.id === suggestion.pair[1])?.name}
                            </div>
                            <div className="text-xs text-muted-foreground">{suggestion.strength} ({formatCorrelation(suggestion.correlation)})</div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedPair(suggestion.pair)}>View</Button>
                        </div>
                      ))}
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

        {/* Pairs Trading Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle>Trading Opportunities</CardTitle>
            <CardDescription>
              Potential pairs trading and diversification opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Pair</th>
                    <th className="text-center py-3 px-4">Correlation</th>
                    <th className="text-left py-3 px-4">Strength</th>
                    <th className="text-left py-3 px-4">Opportunity</th>
                    <th className="text-center py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPairSuggestions.map((suggestion, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="font-medium">
                          {mockCorrelationData.find(a => a.id === suggestion.pair[0])?.name} / {mockCorrelationData.find(a => a.id === suggestion.pair[1])?.name}
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <Badge variant="outline" className={
                          suggestion.correlation > 0.7 ? "text-green-500 border-green-500" : 
                          suggestion.correlation > 0.3 ? "text-blue-500 border-blue-500" :
                          suggestion.correlation > -0.3 ? "text-gray-500 border-gray-500" :
                          suggestion.correlation > -0.7 ? "text-orange-500 border-orange-500" :
                          "text-red-500 border-red-500"
                        }>
                          {formatCorrelation(suggestion.correlation)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {suggestion.strength}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">{suggestion.opportunity}</div>
                        <div className="text-xs text-muted-foreground">{suggestion.description}</div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedPair(suggestion.pair)}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CorrelationMatrix;
