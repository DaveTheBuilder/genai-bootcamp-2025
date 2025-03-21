import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, BarChart3, LineChart, ArrowUpDown, Percent, DollarSign, Clock } from "lucide-react";

// Mock data for backtesting results
const mockBacktestResults = {
  totalTrades: 124,
  winRate: 68.5,
  profitFactor: 2.3,
  sharpeRatio: 1.8,
  maxDrawdown: 12.4,
  annualizedReturn: 24.7,
  averageTrade: 1.2,
  netProfit: 28.4,
  duration: "6 months",
};

const Backtesting: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(2024, 0, 1));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [hasResults, setHasResults] = useState(false);

  const runBacktest = () => {
    // In a real application, this would call an API to run the backtest
    setHasResults(true);
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Configuration Panel */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Backtest Configuration</CardTitle>
          <CardDescription>Configure your backtest parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Strategy Selection */}
          <div className="space-y-2">
            <Label htmlFor="strategy">Trading Strategy</Label>
            <Select defaultValue="moving-average-crossover">
              <SelectTrigger id="strategy">
                <SelectValue placeholder="Select strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="moving-average-crossover">Moving Average Crossover</SelectItem>
                <SelectItem value="rsi-overbought-oversold">RSI Overbought/Oversold</SelectItem>
                <SelectItem value="bollinger-bands">Bollinger Bands</SelectItem>
                <SelectItem value="macd">MACD</SelectItem>
                <SelectItem value="custom">Custom Strategy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Instrument Selection */}
          <div className="space-y-2">
            <Label htmlFor="instrument">Instrument</Label>
            <Select defaultValue="eurusd">
              <SelectTrigger id="instrument">
                <SelectValue placeholder="Select instrument" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eurusd">EUR/USD</SelectItem>
                <SelectItem value="gbpusd">GBP/USD</SelectItem>
                <SelectItem value="usdjpy">USD/JPY</SelectItem>
                <SelectItem value="btcusd">BTC/USD</SelectItem>
                <SelectItem value="aapl">AAPL</SelectItem>
                <SelectItem value="msft">MSFT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date Range</Label>
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Timeframe */}
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
              </SelectContent>
            </Select>
          </div>

          {/* Initial Capital */}
          <div className="space-y-2">
            <Label htmlFor="capital">Initial Capital</Label>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <Input id="capital" type="number" defaultValue="10000" />
            </div>
          </div>

          {/* Position Size */}
          <div className="space-y-2">
            <Label htmlFor="position-size">Position Size (%)</Label>
            <div className="flex items-center space-x-4">
              <Slider
                defaultValue={[2]}
                max={100}
                step={0.1}
                className="flex-1"
              />
              <span className="w-12 text-right">2%</span>
            </div>
          </div>

          {/* Advanced Options */}
          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label htmlFor="slippage">Include Slippage</Label>
              <Switch id="slippage" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="commission">Include Commission</Label>
              <Switch id="commission" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="overnight">Include Overnight Fees</Label>
              <Switch id="overnight" defaultChecked />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={runBacktest} className="w-full">Run Backtest</Button>
        </CardFooter>
      </Card>

      {/* Results Panel */}
      <div className="col-span-8 space-y-6">
        {hasResults ? (
          <>
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators for your strategy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-card rounded-lg p-4 border">
                    <div className="text-muted-foreground text-sm">Net Profit</div>
                    <div className="text-2xl font-bold text-green-500">{mockBacktestResults.netProfit}%</div>
                  </div>
                  <div className="bg-card rounded-lg p-4 border">
                    <div className="text-muted-foreground text-sm">Win Rate</div>
                    <div className="text-2xl font-bold">{mockBacktestResults.winRate}%</div>
                  </div>
                  <div className="bg-card rounded-lg p-4 border">
                    <div className="text-muted-foreground text-sm">Profit Factor</div>
                    <div className="text-2xl font-bold">{mockBacktestResults.profitFactor}</div>
                  </div>
                  <div className="bg-card rounded-lg p-4 border">
                    <div className="text-muted-foreground text-sm">Sharpe Ratio</div>
                    <div className="text-2xl font-bold">{mockBacktestResults.sharpeRatio}</div>
                  </div>
                  <div className="bg-card rounded-lg p-4 border">
                    <div className="text-muted-foreground text-sm">Max Drawdown</div>
                    <div className="text-2xl font-bold text-red-500">-{mockBacktestResults.maxDrawdown}%</div>
                  </div>
                  <div className="bg-card rounded-lg p-4 border">
                    <div className="text-muted-foreground text-sm">Total Trades</div>
                    <div className="text-2xl font-bold">{mockBacktestResults.totalTrades}</div>
                  </div>
                  <div className="bg-card rounded-lg p-4 border">
                    <div className="text-muted-foreground text-sm">Avg. Trade</div>
                    <div className="text-2xl font-bold">{mockBacktestResults.averageTrade}%</div>
                  </div>
                  <div className="bg-card rounded-lg p-4 border">
                    <div className="text-muted-foreground text-sm">Duration</div>
                    <div className="text-2xl font-bold">{mockBacktestResults.duration}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Equity Curve */}
            <Card>
              <CardHeader>
                <CardTitle>Equity Curve</CardTitle>
                <CardDescription>Performance over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <LineChart className="h-16 w-16 mx-auto mb-2" />
                  <p>Equity curve chart will be displayed here</p>
                  <p className="text-sm">In a real implementation, this would show a chart of account equity over time</p>
                </div>
              </CardContent>
            </Card>

            {/* Trade Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Trade Distribution</CardTitle>
                <CardDescription>Analysis of trade outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="by-outcome">
                  <TabsList className="mb-4">
                    <TabsTrigger value="by-outcome">By Outcome</TabsTrigger>
                    <TabsTrigger value="by-time">By Time</TabsTrigger>
                    <TabsTrigger value="by-size">By Size</TabsTrigger>
                  </TabsList>
                  <TabsContent value="by-outcome" className="h-64 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <BarChart3 className="h-16 w-16 mx-auto mb-2" />
                      <p>Trade outcome distribution chart will be displayed here</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="by-time" className="h-64 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Clock className="h-16 w-16 mx-auto mb-2" />
                      <p>Trade time distribution chart will be displayed here</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="by-size" className="h-64 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <ArrowUpDown className="h-16 w-16 mx-auto mb-2" />
                      <p>Trade size distribution chart will be displayed here</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-24 w-24 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No Backtest Results Yet</h3>
              <p className="max-w-md">
                Configure your backtest parameters and click "Run Backtest" to see performance metrics, equity curve, and trade analysis.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Backtesting;
