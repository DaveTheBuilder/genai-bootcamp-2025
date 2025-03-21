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
  BarChart, 
  LineChart, 
  PieChart,
  RefreshCw,
  Download,
  Plus,
  Trash,
  Settings,
  Sliders,
  ArrowUpDown,
  Percent
} from "lucide-react";

// Mock portfolio data
const mockPortfolioData = {
  assets: [
    { id: 1, name: "FTSE 100", epic: "IX.D.FTSE.DAILY.IP", allocation: 0.25, expectedReturn: 0.08, risk: 0.15, sharpeRatio: 0.53 },
    { id: 2, name: "S&P 500", epic: "IX.D.SPTRD.DAILY.IP", allocation: 0.30, expectedReturn: 0.10, risk: 0.18, sharpeRatio: 0.56 },
    { id: 3, name: "Gold", epic: "CC.D.GC.UNC.IP", allocation: 0.15, expectedReturn: 0.05, risk: 0.12, sharpeRatio: 0.42 },
    { id: 4, name: "UK Gilts", epic: "IX.D.GILT.DAILY.IP", allocation: 0.20, expectedReturn: 0.03, risk: 0.05, sharpeRatio: 0.60 },
    { id: 5, name: "GBP/USD", epic: "CS.D.GBPUSD.TODAY.IP", allocation: 0.10, expectedReturn: 0.04, risk: 0.10, sharpeRatio: 0.40 }
  ],
  riskFreeRate: 0.02,
  portfolioReturn: 0.072,
  portfolioRisk: 0.11,
  sharpeRatio: 0.58,
  efficientFrontier: [
    { risk: 0.05, return: 0.03 },
    { risk: 0.08, return: 0.05 },
    { risk: 0.11, return: 0.072 },
    { risk: 0.15, return: 0.09 },
    { risk: 0.20, return: 0.11 }
  ],
  optimizedPortfolios: {
    maxSharpe: {
      allocation: [0.10, 0.35, 0.20, 0.30, 0.05],
      return: 0.082,
      risk: 0.12,
      sharpeRatio: 0.68
    },
    minRisk: {
      allocation: [0.05, 0.15, 0.25, 0.50, 0.05],
      return: 0.048,
      risk: 0.06,
      sharpeRatio: 0.47
    },
    maxReturn: {
      allocation: [0.10, 0.70, 0.10, 0.05, 0.05],
      return: 0.095,
      risk: 0.17,
      sharpeRatio: 0.56
    }
  },
  correlationMatrix: [
    [1.00, 0.75, 0.10, 0.05, 0.30],
    [0.75, 1.00, -0.15, 0.10, 0.25],
    [0.10, -0.15, 1.00, 0.30, -0.10],
    [0.05, 0.10, 0.30, 1.00, 0.05],
    [0.30, 0.25, -0.10, 0.05, 1.00]
  ]
};

// Helper function to format percentage
const formatPercent = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 1 }).format(value);
};

const PortfolioOptimization: React.FC = () => {
  const [assets, setAssets] = useState(mockPortfolioData.assets);
  const [optimizationGoal, setOptimizationGoal] = useState("maxSharpe");
  const [riskTolerance, setRiskTolerance] = useState(50);
  const [activeTab, setActiveTab] = useState("allocation");
  
  // Add a new asset to the portfolio
  const addAsset = () => {
    const newAsset = {
      id: assets.length + 1,
      name: "New Asset",
      epic: "",
      allocation: 0,
      expectedReturn: 0.05,
      risk: 0.10,
      sharpeRatio: 0.50
    };
    setAssets([...assets, newAsset]);
  };
  
  // Remove an asset from the portfolio
  const removeAsset = (id: number) => {
    setAssets(assets.filter(asset => asset.id !== id));
  };
  
  // Update asset allocation
  const updateAllocation = (id: number, allocation: number) => {
    setAssets(assets.map(asset => 
      asset.id === id ? { ...asset, allocation } : asset
    ));
  };
  
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Configuration Panel */}
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Portfolio Optimization</CardTitle>
          <CardDescription>Optimize your portfolio allocation for risk and return</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Portfolio Assets */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Portfolio Assets</Label>
              <Button variant="outline" size="sm" onClick={addAsset}>
                <Plus className="h-4 w-4 mr-1" />
                Add Asset
              </Button>
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {assets.map((asset) => (
                <div key={asset.id} className="flex items-center space-x-2">
                  <Select defaultValue={asset.name}>
                    <SelectTrigger className="flex-grow">
                      <SelectValue placeholder="Select asset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={asset.name}>{asset.name}</SelectItem>
                      <SelectItem value="dax">DAX</SelectItem>
                      <SelectItem value="nasdaq">NASDAQ</SelectItem>
                      <SelectItem value="eurusd">EUR/USD</SelectItem>
                      <SelectItem value="bitcoin">Bitcoin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={asset.allocation * 100}
                    onChange={(e) => updateAllocation(asset.id, Number(e.target.value) / 100)}
                    className="w-20"
                    min="0"
                    max="100"
                  />
                  <span className="text-sm">%</span>
                  <Button variant="ghost" size="sm" onClick={() => removeAsset(asset.id)}>
                    <Trash className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Optimization Goal */}
          <div className="space-y-2">
            <Label htmlFor="goal">Optimization Goal</Label>
            <Select defaultValue="maxSharpe" onValueChange={setOptimizationGoal}>
              <SelectTrigger id="goal">
                <SelectValue placeholder="Select goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maxSharpe">Maximize Sharpe Ratio</SelectItem>
                <SelectItem value="minRisk">Minimize Risk</SelectItem>
                <SelectItem value="maxReturn">Maximize Return</SelectItem>
                <SelectItem value="custom">Custom Risk/Return</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Risk Tolerance */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="riskTolerance">Risk Tolerance</Label>
              <span className="text-sm text-muted-foreground">{riskTolerance}%</span>
            </div>
            <Slider
              id="riskTolerance"
              defaultValue={[50]}
              max={100}
              step={1}
              onValueChange={(value) => setRiskTolerance(value[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Conservative</span>
              <span>Balanced</span>
              <span>Aggressive</span>
            </div>
          </div>

          {/* Risk-Free Rate */}
          <div className="space-y-2">
            <Label htmlFor="riskFreeRate">Risk-Free Rate (%)</Label>
            <div className="flex items-center space-x-2">
              <Input id="riskFreeRate" type="number" defaultValue={mockPortfolioData.riskFreeRate * 100} min="0" max="10" step="0.1" />
              <Percent className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Optimize Portfolio
          </Button>
        </CardFooter>
      </Card>

      {/* Results Panel */}
      <div className="col-span-9 space-y-6">
        {/* Portfolio Summary */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Portfolio Summary</CardTitle>
                <CardDescription>
                  Current portfolio metrics and optimization results
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              {/* Current Portfolio */}
              <Card className="bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Current Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Expected Return</span>
                      <span className="font-medium">{formatPercent(mockPortfolioData.portfolioReturn)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Portfolio Risk</span>
                      <span className="font-medium">{formatPercent(mockPortfolioData.portfolioRisk)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
                      <span className="font-medium">{mockPortfolioData.sharpeRatio.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-center">
                      <div className="text-center">
                        <PieChart className="h-24 w-24 mx-auto mb-2 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Current allocation</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Optimized Portfolio */}
              <Card className="bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Optimized Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Expected Return</span>
                      <span className="font-medium">{formatPercent(mockPortfolioData.optimizedPortfolios.maxSharpe.return)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Portfolio Risk</span>
                      <span className="font-medium">{formatPercent(mockPortfolioData.optimizedPortfolios.maxSharpe.risk)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
                      <span className="font-medium">{mockPortfolioData.optimizedPortfolios.maxSharpe.sharpeRatio.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-center">
                      <div className="text-center">
                        <PieChart className="h-24 w-24 mx-auto mb-2 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Optimized allocation</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Improvement */}
              <Card className="bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Potential Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Return Improvement</span>
                      <span className="font-medium text-green-500">
                        +{formatPercent(mockPortfolioData.optimizedPortfolios.maxSharpe.return - mockPortfolioData.portfolioReturn)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Risk Reduction</span>
                      <span className="font-medium text-green-500">
                        -{formatPercent(mockPortfolioData.portfolioRisk - mockPortfolioData.optimizedPortfolios.maxSharpe.risk)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Sharpe Ratio Increase</span>
                      <span className="font-medium text-green-500">
                        +{(mockPortfolioData.optimizedPortfolios.maxSharpe.sharpeRatio - mockPortfolioData.sharpeRatio).toFixed(2)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-center">
                      <div className="text-center">
                        <ArrowUpDown className="h-24 w-24 mx-auto mb-2 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Allocation changes</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Efficient Frontier Chart Placeholder */}
            <div className="mt-8 border rounded-md p-4">
              <h3 className="text-lg font-medium mb-4">Efficient Frontier</h3>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <LineChart className="h-16 w-16 mx-auto mb-2" />
                  <p>Efficient frontier chart would be displayed here</p>
                  <p className="text-sm">In a real implementation, this would show the efficient frontier curve with current and optimized portfolios</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Tabs */}
        <Tabs defaultValue="allocation" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="allocation">Asset Allocation</TabsTrigger>
            <TabsTrigger value="correlation">Correlation Matrix</TabsTrigger>
            <TabsTrigger value="scenarios">Scenario Analysis</TabsTrigger>
          </TabsList>
          
          {/* Asset Allocation Tab */}
          <TabsContent value="allocation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation Comparison</CardTitle>
                <CardDescription>
                  Compare current and optimized portfolio allocations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Asset</th>
                        <th className="text-center py-3 px-4">Current Allocation</th>
                        <th className="text-center py-3 px-4">Optimized Allocation</th>
                        <th className="text-center py-3 px-4">Change</th>
                        <th className="text-right py-3 px-4">Expected Return</th>
                        <th className="text-right py-3 px-4">Risk</th>
                        <th className="text-right py-3 px-4">Sharpe Ratio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockPortfolioData.assets.map((asset, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="font-medium">{asset.name}</div>
                            <div className="text-xs text-muted-foreground">{asset.epic}</div>
                          </td>
                          <td className="text-center py-3 px-4">
                            {formatPercent(asset.allocation)}
                          </td>
                          <td className="text-center py-3 px-4">
                            {formatPercent(mockPortfolioData.optimizedPortfolios.maxSharpe.allocation[index])}
                          </td>
                          <td className="text-center py-3 px-4">
                            <span className={mockPortfolioData.optimizedPortfolios.maxSharpe.allocation[index] > asset.allocation ? 'text-green-500' : 'text-red-500'}>
                              {mockPortfolioData.optimizedPortfolios.maxSharpe.allocation[index] > asset.allocation ? '+' : ''}
                              {formatPercent(mockPortfolioData.optimizedPortfolios.maxSharpe.allocation[index] - asset.allocation)}
                            </span>
                          </td>
                          <td className="text-right py-3 px-4">
                            {formatPercent(asset.expectedReturn)}
                          </td>
                          <td className="text-right py-3 px-4">
                            {formatPercent(asset.risk)}
                          </td>
                          <td className="text-right py-3 px-4">
                            {asset.sharpeRatio.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Allocation Chart Placeholder */}
                <div className="mt-8 border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Allocation Comparison</h3>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <BarChart className="h-16 w-16 mx-auto mb-2" />
                      <p>Allocation comparison chart would be displayed here</p>
                      <p className="text-sm">In a real implementation, this would show a bar chart comparing current and optimized allocations</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Correlation Matrix Tab */}
          <TabsContent value="correlation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Correlation Matrix</CardTitle>
                <CardDescription>
                  Correlation between assets in your portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Asset</th>
                        {mockPortfolioData.assets.map((asset, index) => (
                          <th key={index} className="text-center py-3 px-4">{asset.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mockPortfolioData.assets.map((asset, rowIndex) => (
                        <tr key={rowIndex} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{asset.name}</td>
                          {mockPortfolioData.correlationMatrix[rowIndex].map((correlation, colIndex) => (
                            <td key={colIndex} className="text-center py-3 px-4">
                              <div 
                                className={`mx-auto w-12 h-8 flex items-center justify-center rounded ${
                                  rowIndex === colIndex ? 'bg-blue-100 text-blue-700' :
                                  correlation > 0.5 ? 'bg-red-100 text-red-700' :
                                  correlation < -0.1 ? 'bg-green-100 text-green-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {correlation.toFixed(2)}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Correlation Heatmap Placeholder */}
                <div className="mt-8 border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Correlation Heatmap</h3>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <BarChart className="h-16 w-16 mx-auto mb-2" />
                      <p>Correlation heatmap would be displayed here</p>
                      <p className="text-sm">In a real implementation, this would show a heatmap visualization of the correlation matrix</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Scenario Analysis Tab */}
          <TabsContent value="scenarios" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Scenario Analysis</CardTitle>
                <CardDescription>
                  Analyze portfolio performance under different market scenarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Scenario</th>
                        <th className="text-center py-3 px-4">Current Portfolio</th>
                        <th className="text-center py-3 px-4">Optimized Portfolio</th>
                        <th className="text-center py-3 px-4">Difference</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">Bull Market (+20%)</td>
                        <td className="text-center py-3 px-4 text-green-500">+15.2%</td>
                        <td className="text-center py-3 px-4 text-green-500">+18.5%</td>
                        <td className="text-center py-3 px-4 text-green-500">+3.3%</td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">Bear Market (-20%)</td>
                        <td className="text-center py-3 px-4 text-red-500">-18.5%</td>
                        <td className="text-center py-3 px-4 text-red-500">-15.2%</td>
                        <td className="text-center py-3 px-4 text-green-500">+3.3%</td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">High Inflation</td>
                        <td className="text-center py-3 px-4 text-red-500">-5.2%</td>
                        <td className="text-center py-3 px-4 text-red-500">-2.8%</td>
                        <td className="text-center py-3 px-4 text-green-500">+2.4%</td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">Interest Rate Hike</td>
                        <td className="text-center py-3 px-4 text-red-500">-7.5%</td>
                        <td className="text-center py-3 px-4 text-red-500">-4.2%</td>
                        <td className="text-center py-3 px-4 text-green-500">+3.3%</td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">Economic Recession</td>
                        <td className="text-center py-3 px-4 text-red-500">-12.8%</td>
                        <td className="text-center py-3 px-4 text-red-500">-9.5%</td>
                        <td className="text-center py-3 px-4 text-green-500">+3.3%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Scenario Chart Placeholder */}
                <div className="mt-8 border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Scenario Performance Comparison</h3>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <BarChart className="h-16 w-16 mx-auto mb-2" />
                      <p>Scenario performance chart would be displayed here</p>
                      <p className="text-sm">In a real implementation, this would show a comparison of portfolio performance across scenarios</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PortfolioOptimization;
