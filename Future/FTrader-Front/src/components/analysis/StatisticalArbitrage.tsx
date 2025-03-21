import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  LineChart, 
  BarChart3, 
  GitCompare, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpDown, 
  DollarSign,
  Clock,
  Percent,
  AlertCircle
} from "lucide-react";

// Mock data for pairs
const mockPairs = [
  { id: 1, asset1: "AAPL", asset2: "MSFT", correlation: -0.78, zScore: 2.1, halfLife: 3.5, profitPotential: "High" },
  { id: 2, asset1: "EURUSD", asset2: "GBPUSD", correlation: 0.92, zScore: 1.4, halfLife: 5.2, profitPotential: "Medium" },
  { id: 3, asset1: "GOLD", asset2: "SILVER", correlation: 0.85, zScore: 0.8, halfLife: 2.1, profitPotential: "Low" },
  { id: 4, asset1: "BTC", asset2: "ETH", correlation: 0.94, zScore: 1.9, halfLife: 1.8, profitPotential: "High" },
  { id: 5, asset1: "SPY", asset2: "QQQ", correlation: 0.89, zScore: 1.2, halfLife: 4.3, profitPotential: "Medium" },
];

const mockHistoricalTrades = [
  { id: 1, pair: "AAPL-MSFT", entryDate: "2024-01-15", exitDate: "2024-01-28", profit: 3.2, duration: "13 days" },
  { id: 2, pair: "EURUSD-GBPUSD", entryDate: "2024-02-03", exitDate: "2024-02-10", profit: 1.8, duration: "7 days" },
  { id: 3, pair: "BTC-ETH", entryDate: "2024-02-18", exitDate: "2024-02-25", profit: 4.5, duration: "7 days" },
  { id: 4, pair: "SPY-QQQ", entryDate: "2024-03-01", exitDate: "2024-03-08", profit: -1.2, duration: "7 days" },
  { id: 5, pair: "GOLD-SILVER", entryDate: "2024-03-10", exitDate: "2024-03-15", profit: 2.1, duration: "5 days" },
];

const StatisticalArbitrage: React.FC = () => {
  const [selectedPair, setSelectedPair] = useState<number | null>(null);
  const [scanResults, setScanResults] = useState(true);

  const runPairScan = () => {
    setScanResults(true);
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Configuration Panel */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Statistical Arbitrage</CardTitle>
          <CardDescription>Find and analyze correlated pairs for statistical arbitrage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Market Selection */}
          <div className="space-y-2">
            <Label htmlFor="market">Market</Label>
            <Select defaultValue="stocks">
              <SelectTrigger id="market">
                <SelectValue placeholder="Select market" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stocks">Stocks</SelectItem>
                <SelectItem value="forex">Forex</SelectItem>
                <SelectItem value="crypto">Cryptocurrencies</SelectItem>
                <SelectItem value="commodities">Commodities</SelectItem>
                <SelectItem value="indices">Indices</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Correlation Threshold */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="correlation">Correlation Threshold</Label>
              <span className="text-sm">0.7</span>
            </div>
            <Slider
              id="correlation"
              defaultValue={[0.7]}
              min={0}
              max={1}
              step={0.01}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>0.5</span>
              <span>1</span>
            </div>
          </div>

          {/* Z-Score Range */}
          <div className="space-y-2">
            <Label htmlFor="zscore">Z-Score Range</Label>
            <div className="flex items-center space-x-2">
              <Input id="zscore-min" type="number" placeholder="Min" defaultValue="1.0" className="w-20" />
              <span>to</span>
              <Input id="zscore-max" type="number" placeholder="Max" defaultValue="2.5" className="w-20" />
            </div>
          </div>

          {/* Half-Life */}
          <div className="space-y-2">
            <Label htmlFor="halflife">Maximum Half-Life (Days)</Label>
            <Input id="halflife" type="number" defaultValue="5" />
          </div>

          {/* Lookback Period */}
          <div className="space-y-2">
            <Label htmlFor="lookback">Lookback Period (Days)</Label>
            <Select defaultValue="180">
              <SelectTrigger id="lookback">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="60">60 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="180">180 days</SelectItem>
                <SelectItem value="365">365 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Advanced Options */}
          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label htmlFor="cointegration">Require Cointegration</Label>
              <Switch id="cointegration" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="liquidity">Filter by Liquidity</Label>
              <Switch id="liquidity" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="seasonality">Check for Seasonality</Label>
              <Switch id="seasonality" defaultChecked />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={runPairScan} className="w-full">Scan for Pairs</Button>
        </CardFooter>
      </Card>

      {/* Results Panel */}
      <div className="col-span-8 space-y-6">
        {scanResults ? (
          <>
            {/* Pairs Table */}
            <Card>
              <CardHeader>
                <CardTitle>Potential Pairs</CardTitle>
                <CardDescription>Pairs with statistical arbitrage potential</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Pair</th>
                        <th className="text-center py-3 px-4">Correlation</th>
                        <th className="text-center py-3 px-4">Z-Score</th>
                        <th className="text-center py-3 px-4">Half-Life</th>
                        <th className="text-center py-3 px-4">Potential</th>
                        <th className="text-center py-3 px-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockPairs.map((pair) => (
                        <tr 
                          key={pair.id} 
                          className={`border-b hover:bg-muted/50 ${selectedPair === pair.id ? 'bg-primary/10' : ''}`}
                        >
                          <td className="py-3 px-4">{pair.asset1} / {pair.asset2}</td>
                          <td className="text-center py-3 px-4">
                            <Badge variant="outline" className={pair.correlation > 0 ? 'text-green-500' : 'text-red-500'}>
                              {pair.correlation.toFixed(2)}
                            </Badge>
                          </td>
                          <td className="text-center py-3 px-4">
                            <Badge variant="outline" className={
                              pair.zScore > 2 ? 'text-red-500' : 
                              pair.zScore > 1 ? 'text-amber-500' : 'text-green-500'
                            }>
                              {pair.zScore.toFixed(1)}
                            </Badge>
                          </td>
                          <td className="text-center py-3 px-4">{pair.halfLife.toFixed(1)} days</td>
                          <td className="text-center py-3 px-4">
                            <Badge variant={
                              pair.profitPotential === 'High' ? 'default' : 
                              pair.profitPotential === 'Medium' ? 'secondary' : 'outline'
                            }>
                              {pair.profitPotential}
                            </Badge>
                          </td>
                          <td className="text-center py-3 px-4">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedPair(pair.id === selectedPair ? null : pair.id)}
                            >
                              {selectedPair === pair.id ? 'Hide Details' : 'View Details'}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Pair Details */}
            {selectedPair && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    Pair Analysis: {mockPairs.find(p => p.id === selectedPair)?.asset1} / {mockPairs.find(p => p.id === selectedPair)?.asset2}
                  </CardTitle>
                  <CardDescription>Detailed statistical analysis of the selected pair</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="spread">
                    <TabsList className="mb-4">
                      <TabsTrigger value="spread">Spread Analysis</TabsTrigger>
                      <TabsTrigger value="correlation">Correlation</TabsTrigger>
                      <TabsTrigger value="backtest">Backtest</TabsTrigger>
                    </TabsList>
                    <TabsContent value="spread" className="space-y-4">
                      <div className="h-64 flex items-center justify-center border rounded-md">
                        <div className="text-center text-muted-foreground">
                          <LineChart className="h-16 w-16 mx-auto mb-2" />
                          <p>Spread and Z-Score chart will be displayed here</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-card rounded-lg p-4 border">
                          <div className="text-muted-foreground text-sm">Current Z-Score</div>
                          <div className="text-xl font-bold text-amber-500">
                            {mockPairs.find(p => p.id === selectedPair)?.zScore.toFixed(2)}
                          </div>
                        </div>
                        <div className="bg-card rounded-lg p-4 border">
                          <div className="text-muted-foreground text-sm">Half-Life</div>
                          <div className="text-xl font-bold">
                            {mockPairs.find(p => p.id === selectedPair)?.halfLife.toFixed(1)} days
                          </div>
                        </div>
                        <div className="bg-card rounded-lg p-4 border">
                          <div className="text-muted-foreground text-sm">Trade Signal</div>
                          <div className="text-xl font-bold flex items-center">
                            <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                            Short
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-card rounded-lg p-4 border">
                        <h3 className="text-lg font-medium mb-2">Trade Recommendation</h3>
                        <div className="flex items-start space-x-4">
                          <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-2 rounded-md">
                            <TrendingDown className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm">
                              <strong>Short {mockPairs.find(p => p.id === selectedPair)?.asset1}</strong> and 
                              <strong> Long {mockPairs.find(p => p.id === selectedPair)?.asset2}</strong> with a ratio of 1:1.2
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              The spread is currently 2.1 standard deviations above the mean, suggesting a reversion opportunity.
                              Set a take profit at Z-Score of 0.5 and stop loss at Z-Score of 3.0.
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="correlation" className="space-y-4">
                      <div className="h-64 flex items-center justify-center border rounded-md">
                        <div className="text-center text-muted-foreground">
                          <LineChart className="h-16 w-16 mx-auto mb-2" />
                          <p>Correlation chart will be displayed here</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-card rounded-lg p-4 border">
                          <div className="text-muted-foreground text-sm">Correlation</div>
                          <div className="text-xl font-bold text-green-500">
                            {mockPairs.find(p => p.id === selectedPair)?.correlation.toFixed(2)}
                          </div>
                        </div>
                        <div className="bg-card rounded-lg p-4 border">
                          <div className="text-muted-foreground text-sm">Cointegration</div>
                          <div className="text-xl font-bold text-green-500">Yes (p=0.01)</div>
                        </div>
                        <div className="bg-card rounded-lg p-4 border">
                          <div className="text-muted-foreground text-sm">Stability</div>
                          <div className="text-xl font-bold">High</div>
                        </div>
                      </div>
                      
                      <div className="bg-card rounded-lg p-4 border">
                        <h3 className="text-lg font-medium mb-2">Correlation Analysis</h3>
                        <p className="text-sm">
                          The pair shows strong positive correlation (
                          {mockPairs.find(p => p.id === selectedPair)?.correlation.toFixed(2)}) over the 
                          past 180 days, with evidence of cointegration (p-value 0.01). The relationship 
                          has been stable with minimal correlation breakdown events.
                        </p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="backtest" className="space-y-4">
                      <div className="h-64 flex items-center justify-center border rounded-md">
                        <div className="text-center text-muted-foreground">
                          <BarChart3 className="h-16 w-16 mx-auto mb-2" />
                          <p>Backtest performance chart will be displayed here</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4">
                        <div className="bg-card rounded-lg p-4 border">
                          <div className="text-muted-foreground text-sm">Win Rate</div>
                          <div className="text-xl font-bold">72%</div>
                        </div>
                        <div className="bg-card rounded-lg p-4 border">
                          <div className="text-muted-foreground text-sm">Profit Factor</div>
                          <div className="text-xl font-bold">2.4</div>
                        </div>
                        <div className="bg-card rounded-lg p-4 border">
                          <div className="text-muted-foreground text-sm">Avg. Trade</div>
                          <div className="text-xl font-bold text-green-500">+1.8%</div>
                        </div>
                        <div className="bg-card rounded-lg p-4 border">
                          <div className="text-muted-foreground text-sm">Max Drawdown</div>
                          <div className="text-xl font-bold text-red-500">-8.2%</div>
                        </div>
                      </div>
                      
                      <div className="bg-card rounded-lg p-4 border">
                        <h3 className="text-lg font-medium mb-2">Historical Trades</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b text-xs">
                                <th className="text-left py-2 px-2">Entry Date</th>
                                <th className="text-left py-2 px-2">Exit Date</th>
                                <th className="text-right py-2 px-2">Profit/Loss</th>
                                <th className="text-right py-2 px-2">Duration</th>
                              </tr>
                            </thead>
                            <tbody>
                              {mockHistoricalTrades.map((trade) => (
                                <tr key={trade.id} className="border-b">
                                  <td className="py-2 px-2">{trade.entryDate}</td>
                                  <td className="py-2 px-2">{trade.exitDate}</td>
                                  <td className={`text-right py-2 px-2 ${trade.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {trade.profit >= 0 ? '+' : ''}{trade.profit}%
                                  </td>
                                  <td className="text-right py-2 px-2">{trade.duration}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <GitCompare className="h-24 w-24 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No Pairs Found Yet</h3>
              <p className="max-w-md">
                Configure your pair scanning parameters and click "Scan for Pairs" to find statistical arbitrage opportunities.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticalArbitrage;
