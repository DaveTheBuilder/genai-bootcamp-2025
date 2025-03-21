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
  BarChart, 
  ArrowUpDown,
  Layers,
  PlusCircle,
  Trash2,
  Play,
  Save,
  Settings,
  Code,
  FileText
} from "lucide-react";

// Mock strategy components
const indicatorOptions = [
  { id: "rsi", name: "RSI", category: "Momentum" },
  { id: "macd", name: "MACD", category: "Momentum" },
  { id: "bb", name: "Bollinger Bands", category: "Volatility" },
  { id: "ma", name: "Moving Average", category: "Trend" },
  { id: "ema", name: "Exponential MA", category: "Trend" },
  { id: "atr", name: "ATR", category: "Volatility" },
  { id: "stoch", name: "Stochastic", category: "Momentum" },
  { id: "adx", name: "ADX", category: "Trend" },
  { id: "volume", name: "Volume", category: "Volume" },
  { id: "obv", name: "On-Balance Volume", category: "Volume" }
];

const entryRuleOptions = [
  { id: "cross_above", name: "Crosses Above" },
  { id: "cross_below", name: "Crosses Below" },
  { id: "greater_than", name: "Greater Than" },
  { id: "less_than", name: "Less Than" },
  { id: "equal_to", name: "Equal To" },
  { id: "inside_range", name: "Inside Range" },
  { id: "outside_range", name: "Outside Range" }
];

const exitRuleOptions = [
  { id: "take_profit", name: "Take Profit" },
  { id: "stop_loss", name: "Stop Loss" },
  { id: "trailing_stop", name: "Trailing Stop" },
  { id: "time_exit", name: "Time-Based Exit" },
  { id: "indicator_exit", name: "Indicator-Based Exit" },
  { id: "opposite_signal", name: "Opposite Signal" }
];

// Mock saved strategies
const savedStrategies = [
  { 
    id: "golden_cross", 
    name: "Golden Cross Strategy", 
    description: "MA50 crosses above MA200",
    performance: { winRate: 68, profitFactor: 1.8, sharpeRatio: 1.2 }
  },
  { 
    id: "rsi_oversold", 
    name: "RSI Oversold Bounce", 
    description: "Buy when RSI < 30, sell when RSI > 70",
    performance: { winRate: 62, profitFactor: 1.5, sharpeRatio: 0.9 }
  },
  { 
    id: "macd_trend", 
    name: "MACD Trend Follower", 
    description: "MACD line crosses signal line",
    performance: { winRate: 58, profitFactor: 1.6, sharpeRatio: 1.1 }
  }
];

// Mock backtest results
const backtestResults = {
  totalTrades: 124,
  winningTrades: 75,
  losingTrades: 49,
  winRate: 60.5,
  profitFactor: 1.72,
  sharpeRatio: 1.15,
  maxDrawdown: 12.4,
  averageWin: 2.8,
  averageLoss: 1.6,
  expectancy: 0.92,
  netProfit: 28.4,
  annualizedReturn: 18.7,
  trades: [
    { date: "2024-01-05", type: "Buy", price: 1.1245, result: "Win", profit: 1.2 },
    { date: "2024-01-12", type: "Sell", price: 1.1320, result: "Loss", profit: -0.8 },
    { date: "2024-01-18", type: "Buy", price: 1.1280, result: "Win", profit: 1.5 },
    { date: "2024-01-25", type: "Buy", price: 1.1310, result: "Win", profit: 2.1 },
    { date: "2024-02-01", type: "Sell", price: 1.1275, result: "Loss", profit: -1.2 }
  ]
};

const StrategyBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState("builder");
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [showBacktestResults, setShowBacktestResults] = useState(false);

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left Panel */}
      <div className="col-span-3 space-y-6">
        {/* Component Library */}
        <Card>
          <CardHeader>
            <CardTitle>Component Library</CardTitle>
            <CardDescription>Drag components to build your strategy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Indicators</h3>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {indicatorOptions.map((indicator) => (
                  <div 
                    key={indicator.id}
                    className="flex justify-between items-center p-2 bg-muted/50 rounded-md cursor-move hover:bg-muted"
                  >
                    <div>
                      <div className="text-sm font-medium">{indicator.name}</div>
                      <div className="text-xs text-muted-foreground">{indicator.category}</div>
                    </div>
                    <Badge variant="outline" className="text-xs">Drag</Badge>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-2">Entry Rules</h3>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {entryRuleOptions.map((rule) => (
                  <div 
                    key={rule.id}
                    className="flex justify-between items-center p-2 bg-muted/50 rounded-md cursor-move hover:bg-muted"
                  >
                    <div className="text-sm">{rule.name}</div>
                    <Badge variant="outline" className="text-xs">Drag</Badge>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-2">Exit Rules</h3>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {exitRuleOptions.map((rule) => (
                  <div 
                    key={rule.id}
                    className="flex justify-between items-center p-2 bg-muted/50 rounded-md cursor-move hover:bg-muted"
                  >
                    <div className="text-sm">{rule.name}</div>
                    <Badge variant="outline" className="text-xs">Drag</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Saved Strategies */}
        <Card>
          <CardHeader>
            <CardTitle>Saved Strategies</CardTitle>
            <CardDescription>Your custom trading strategies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {savedStrategies.map((strategy) => (
              <div 
                key={strategy.id}
                className={`p-3 rounded-md cursor-pointer hover:bg-muted/70 ${selectedStrategy === strategy.id ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30'}`}
                onClick={() => setSelectedStrategy(strategy.id)}
              >
                <div className="font-medium">{strategy.name}</div>
                <div className="text-xs text-muted-foreground mb-2">{strategy.description}</div>
                <div className="flex space-x-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Win Rate:</span>{' '}
                    <span className="font-medium">{strategy.performance.winRate}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">P/F:</span>{' '}
                    <span className="font-medium">{strategy.performance.profitFactor}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Strategy
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Main Content */}
      <div className="col-span-9 space-y-6">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Strategy Builder</CardTitle>
                <CardDescription>Create and test custom trading strategies</CardDescription>
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                <TabsList>
                  <TabsTrigger value="builder" className="flex items-center gap-1">
                    <Settings className="h-4 w-4" />
                    <span>Builder</span>
                  </TabsTrigger>
                  <TabsTrigger value="backtest" className="flex items-center gap-1">
                    <LineChart className="h-4 w-4" />
                    <span>Backtest</span>
                  </TabsTrigger>
                  <TabsTrigger value="code" className="flex items-center gap-1">
                    <Code className="h-4 w-4" />
                    <span>Code</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <TabsContent value="builder" className="mt-0">
              <div className="space-y-6">
                {/* Strategy Configuration */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="strategy-name">Strategy Name</Label>
                      <Input id="strategy-name" placeholder="My Custom Strategy" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="instrument">Instrument</Label>
                      <Select defaultValue="EURUSD">
                        <SelectTrigger id="instrument" className="mt-1">
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
                    <div>
                      <Label htmlFor="timeframe">Timeframe</Label>
                      <Select defaultValue="1h">
                        <SelectTrigger id="timeframe" className="mt-1">
                          <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5m">5 Minutes</SelectItem>
                          <SelectItem value="15m">15 Minutes</SelectItem>
                          <SelectItem value="1h">1 Hour</SelectItem>
                          <SelectItem value="4h">4 Hours</SelectItem>
                          <SelectItem value="1d">Daily</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="position-size">Position Size</Label>
                      <div className="flex mt-1">
                        <Select defaultValue="percentage">
                          <SelectTrigger className="w-[180px] rounded-r-none">
                            <SelectValue placeholder="Size type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fixed">Fixed Lots</SelectItem>
                            <SelectItem value="percentage">% of Balance</SelectItem>
                            <SelectItem value="risk">Risk-Based</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input type="number" defaultValue="2" className="rounded-l-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="take-profit">Take Profit (pips)</Label>
                        <Input id="take-profit" type="number" defaultValue="50" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="stop-loss">Stop Loss (pips)</Label>
                        <Input id="stop-loss" type="number" defaultValue="30" className="mt-1" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                      <input type="checkbox" id="trailing-stop" className="h-4 w-4 rounded border-gray-300" />
                      <Label htmlFor="trailing-stop">Use trailing stop</Label>
                    </div>
                  </div>
                </div>

                {/* Strategy Canvas */}
                <div className="border rounded-md p-4 min-h-[300px] bg-muted/30 relative">
                  <div className="text-center text-muted-foreground absolute inset-0 flex items-center justify-center">
                    <div>
                      <Settings className="h-16 w-16 mx-auto mb-2 opacity-20" />
                      <p>Drag and drop components from the library to build your strategy</p>
                      <p className="text-sm">In a real implementation, this would be an interactive canvas</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between">
                  <div className="space-x-2">
                    <Button variant="outline">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Template
                    </Button>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={() => { setActiveTab("backtest"); setShowBacktestResults(true); }}>
                      <Play className="h-4 w-4 mr-2" />
                      Backtest
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="backtest" className="mt-0">
              <div className="space-y-6">
                {/* Backtest Configuration */}
                {!showBacktestResults ? (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="date-range">Date Range</Label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <Input type="date" defaultValue="2023-01-01" />
                          <Input type="date" defaultValue="2024-01-01" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="initial-capital">Initial Capital</Label>
                        <Input id="initial-capital" type="number" defaultValue="10000" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="commission">Commission per Trade</Label>
                        <Input id="commission" type="number" defaultValue="5" className="mt-1" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="slippage">Slippage (pips)</Label>
                        <Input id="slippage" type="number" defaultValue="1" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="spread">Spread (pips)</Label>
                        <Input id="spread" type="number" defaultValue="2" className="mt-1" />
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <input type="checkbox" id="use-optimization" className="h-4 w-4 rounded border-gray-300" />
                        <Label htmlFor="use-optimization">Use parameter optimization</Label>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Backtest Results Summary */}
                    <div className="grid grid-cols-4 gap-4">
                      <Card className="bg-muted/30">
                        <CardContent className="pt-6">
                          <div className="text-sm text-muted-foreground">Net Profit</div>
                          <div className="text-2xl font-bold text-green-500">+{backtestResults.netProfit}%</div>
                          <div className="text-xs text-muted-foreground mt-1">Annualized: {backtestResults.annualizedReturn}%</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/30">
                        <CardContent className="pt-6">
                          <div className="text-sm text-muted-foreground">Win Rate</div>
                          <div className="text-2xl font-bold">{backtestResults.winRate}%</div>
                          <div className="text-xs text-muted-foreground mt-1">{backtestResults.winningTrades} / {backtestResults.totalTrades} trades</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/30">
                        <CardContent className="pt-6">
                          <div className="text-sm text-muted-foreground">Profit Factor</div>
                          <div className="text-2xl font-bold">{backtestResults.profitFactor}</div>
                          <div className="text-xs text-muted-foreground mt-1">Avg Win: {backtestResults.averageWin}%</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/30">
                        <CardContent className="pt-6">
                          <div className="text-sm text-muted-foreground">Max Drawdown</div>
                          <div className="text-2xl font-bold text-red-500">-{backtestResults.maxDrawdown}%</div>
                          <div className="text-xs text-muted-foreground mt-1">Sharpe: {backtestResults.sharpeRatio}</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Performance Chart */}
                    <div className="border rounded-md p-4 h-64 flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <LineChart className="h-16 w-16 mx-auto mb-2" />
                        <p>Equity curve and performance chart</p>
                        <p className="text-sm">In a real implementation, this would show the strategy performance</p>
                      </div>
                    </div>

                    {/* Trade List */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Trade List</h3>
                      <div className="border rounded-md overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="text-left py-2 px-4">Date</th>
                              <th className="text-left py-2 px-4">Type</th>
                              <th className="text-left py-2 px-4">Price</th>
                              <th className="text-center py-2 px-4">Result</th>
                              <th className="text-right py-2 px-4">Profit/Loss</th>
                            </tr>
                          </thead>
                          <tbody>
                            {backtestResults.trades.map((trade, index) => (
                              <tr key={index} className="border-t">
                                <td className="py-2 px-4">{trade.date}</td>
                                <td className="py-2 px-4">{trade.type}</td>
                                <td className="py-2 px-4">{trade.price}</td>
                                <td className="text-center py-2 px-4">
                                  <Badge variant="outline" className={trade.result === "Win" ? "text-green-500" : "text-red-500"}>
                                    {trade.result}
                                  </Badge>
                                </td>
                                <td className={`text-right py-2 px-4 ${trade.profit > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                  {trade.profit > 0 ? '+' : ''}{trade.profit}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setShowBacktestResults(false)}>
                        Modify Parameters
                      </Button>
                      <div className="space-x-2">
                        <Button variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          Export Report
                        </Button>
                        <Button>
                          <Settings className="h-4 w-4 mr-2" />
                          Optimize
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Run Backtest Button */}
                {!showBacktestResults && (
                  <div className="flex justify-end">
                    <Button onClick={() => setShowBacktestResults(true)}>
                      <Play className="h-4 w-4 mr-2" />
                      Run Backtest
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="code" className="mt-0">
              <div className="space-y-6">
                <div className="bg-muted p-4 rounded-md font-mono text-sm overflow-x-auto">
                  <pre>{`// Strategy: Golden Cross with RSI Filter
// Instrument: EURUSD, Timeframe: 1H

// Indicator Setup
const fastMA = SMA(close, 50);
const slowMA = SMA(close, 200);
const rsi = RSI(close, 14);

// Entry Rules
function entrySignal() {
  // Golden Cross: Fast MA crosses above Slow MA
  const goldenCross = crossOver(fastMA, slowMA);
  
  // RSI Filter: RSI must be above 40 to confirm uptrend
  const rsiFilter = rsi > 40;
  
  // Entry signal is true when both conditions are met
  return goldenCross && rsiFilter;
}

// Exit Rules
function exitSignal() {
  // Exit when Fast MA crosses below Slow MA
  return crossUnder(fastMA, slowMA);
}

// Risk Management
const positionSize = 2; // % of account balance
const stopLoss = 30; // pips
const takeProfit = 50; // pips

// Execute Strategy
if (entrySignal()) {
  buy(positionSize, stopLoss, takeProfit);
} else if (exitSignal()) {
  closePosition();
}`}</pre>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Strategy
                  </Button>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StrategyBuilder;
