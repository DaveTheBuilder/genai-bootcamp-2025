import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAutomation } from '../core/AutomationEngine';

const PerformanceDashboard: React.FC = () => {
  const { strategies, getStrategyPerformance } = useAutomation();
  const [selectedStrategy, setSelectedStrategy] = useState<string>('all');
  const [timeframe, setTimeframe] = useState<string>('1m');
  
  // Mock performance data - in a real implementation, this would come from the MonitoringService
  const performanceData = {
    netProfit: 2345.67,
    netProfitPercent: 12.5,
    winRate: 68,
    winRateChange: 3.2,
    profitFactor: 1.85,
    profitFactorChange: 0.12,
    maxDrawdown: 4.2,
    maxDrawdownChange: -0.8,
    totalTrades: 42,
    averageTradeLength: '2.3 days',
    sharpeRatio: 1.65,
    sortinoRatio: 2.1
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value / 100);
  };
  
  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Performance Dashboard</CardTitle>
            <CardDescription>Track strategy performance and key metrics</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Strategies</SelectItem>
                {strategies.map((strategy) => (
                  <SelectItem key={strategy.id} value={strategy.id}>
                    {strategy.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">1 Day</SelectItem>
                <SelectItem value="1w">1 Week</SelectItem>
                <SelectItem value="1m">1 Month</SelectItem>
                <SelectItem value="3m">3 Months</SelectItem>
                <SelectItem value="ytd">YTD</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground">Net Profit</h3>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(performanceData.netProfit)}</p>
                  <span className="text-xs text-green-600">+{performanceData.netProfitPercent}% this month</span>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground">Win Rate</h3>
                  <p className="text-2xl font-bold">{performanceData.winRate}%</p>
                  <span className="text-xs text-green-600">+{performanceData.winRateChange}% this month</span>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground">Profit Factor</h3>
                  <p className="text-2xl font-bold">{performanceData.profitFactor}</p>
                  <span className="text-xs text-green-600">+{performanceData.profitFactorChange} this month</span>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground">Max Drawdown</h3>
                  <p className="text-2xl font-bold">{performanceData.maxDrawdown}%</p>
                  <span className="text-xs text-green-600">{performanceData.maxDrawdownChange}% this month</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Equity Curve</h3>
                  <div className="h-40 bg-muted/30 rounded flex items-center justify-center">
                    <p className="text-muted-foreground">Equity chart will be displayed here</p>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Monthly Returns</h3>
                  <div className="h-40 bg-muted/30 rounded flex items-center justify-center">
                    <p className="text-muted-foreground">Monthly returns chart will be displayed here</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Strategy Comparison</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 border rounded-lg">
                    <h4 className="text-sm font-medium">Moving Average Crossover</h4>
                    <p className="text-lg font-bold text-green-600">+8.2%</p>
                    <div className="mt-1 h-1 bg-muted rounded overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '82%' }}></div>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <h4 className="text-sm font-medium">Sentiment-Based Reversal</h4>
                    <p className="text-lg font-bold text-green-600">+5.7%</p>
                    <div className="mt-1 h-1 bg-muted rounded overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '57%' }}></div>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <h4 className="text-sm font-medium">Order Flow Strategy</h4>
                    <p className="text-lg font-bold text-red-600">-1.3%</p>
                    <div className="mt-1 h-1 bg-muted rounded overflow-hidden">
                      <div className="h-full bg-red-500" style={{ width: '13%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="trades">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Recent Trades</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">Instrument</th>
                        <th className="text-left p-2">Direction</th>
                        <th className="text-left p-2">Entry</th>
                        <th className="text-left p-2">Exit</th>
                        <th className="text-right p-2">P&L</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">2025-03-10</td>
                        <td className="p-2">FTSE 100</td>
                        <td className="p-2">Long</td>
                        <td className="p-2">7,850.00</td>
                        <td className="p-2">7,925.50</td>
                        <td className="p-2 text-right text-green-600">+$375.50</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">2025-03-08</td>
                        <td className="p-2">EUR/USD</td>
                        <td className="p-2">Short</td>
                        <td className="p-2">1.0825</td>
                        <td className="p-2">1.0780</td>
                        <td className="p-2 text-right text-green-600">+$450.00</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">2025-03-05</td>
                        <td className="p-2">S&P 500</td>
                        <td className="p-2">Long</td>
                        <td className="p-2">5,120.25</td>
                        <td className="p-2">5,090.75</td>
                        <td className="p-2 text-right text-red-600">-$295.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Trade Distribution</h3>
                  <div className="h-40 bg-muted/30 rounded flex items-center justify-center">
                    <p className="text-muted-foreground">Trade distribution chart will be displayed here</p>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Trade Duration</h3>
                  <div className="h-40 bg-muted/30 rounded flex items-center justify-center">
                    <p className="text-muted-foreground">Trade duration chart will be displayed here</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Risk Metrics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sharpe Ratio</span>
                    <span className="font-medium">{performanceData.sharpeRatio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sortino Ratio</span>
                    <span className="font-medium">{performanceData.sortinoRatio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Drawdown</span>
                    <span className="font-medium">{performanceData.maxDrawdown}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg. Loss</span>
                    <span className="font-medium">$185.25</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Performance Metrics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Trades</span>
                    <span className="font-medium">{performanceData.totalTrades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Win Rate</span>
                    <span className="font-medium">{performanceData.winRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Profit Factor</span>
                    <span className="font-medium">{performanceData.profitFactor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg. Trade Length</span>
                    <span className="font-medium">{performanceData.averageTradeLength}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg col-span-2">
                <h3 className="font-medium mb-2">Signal Performance</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Signal Source</th>
                        <th className="text-left p-2">Win Rate</th>
                        <th className="text-left p-2">Avg. Profit</th>
                        <th className="text-left p-2">Avg. Loss</th>
                        <th className="text-right p-2">Profit Factor</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">Pattern Recognition</td>
                        <td className="p-2">72%</td>
                        <td className="p-2">$325.50</td>
                        <td className="p-2">$175.25</td>
                        <td className="p-2 text-right">1.95</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Sentiment Analysis</td>
                        <td className="p-2">65%</td>
                        <td className="p-2">$420.75</td>
                        <td className="p-2">$210.50</td>
                        <td className="p-2 text-right">1.75</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Order Flow Analysis</td>
                        <td className="p-2">58%</td>
                        <td className="p-2">$275.25</td>
                        <td className="p-2">$195.00</td>
                        <td className="p-2 text-right">1.45</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Market Regime Detection</td>
                        <td className="p-2">75%</td>
                        <td className="p-2">$350.00</td>
                        <td className="p-2">$165.75</td>
                        <td className="p-2 text-right">2.10</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PerformanceDashboard;
