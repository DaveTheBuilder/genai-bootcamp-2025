import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import PortfolioChart from '@/components/PortfolioChart';
import AssetAllocationChart from '@/components/AssetAllocationChart';

// Define types for portfolio data
interface PortfolioHolding {
  symbol: string;
  name: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  value: number;
  pnl: number;
  pnlPercentage: number;
  dayChange: number;
  dayChangePercentage: number;
}

interface AssetAllocation {
  category: string;
  value: number;
  percentage: number;
  color: string;
}

interface PerformanceDataPoint {
  date: string;
  value: number;
}

const Portfolio: React.FC = () => {
  const [activeTab, setActiveTab] = useState('holdings');
  const [isLoading, setIsLoading] = useState(true);
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [assetAllocation, setAssetAllocation] = useState<AssetAllocation[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceDataPoint[]>([]);
  const [portfolioSummary, setPortfolioSummary] = useState({
    totalValue: 0,
    totalPnL: 0,
    totalPnLPercentage: 0,
    dayChange: 0,
    dayChangePercentage: 0,
  });

  // Generate mock holdings data
  const generateMockHoldings = (): PortfolioHolding[] => {
    return [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        quantity: 50,
        averagePrice: 175.00,
        currentPrice: 180.25,
        value: 9012.50,
        pnl: 262.50,
        pnlPercentage: 3.00,
        dayChange: 45.00,
        dayChangePercentage: 0.50
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        quantity: 25,
        averagePrice: 390.00,
        currentPrice: 410.75,
        value: 10268.75,
        pnl: 518.75,
        pnlPercentage: 5.32,
        dayChange: 62.50,
        dayChangePercentage: 0.61
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        quantity: 30,
        averagePrice: 140.00,
        currentPrice: 142.30,
        value: 4269.00,
        pnl: 69.00,
        pnlPercentage: 1.64,
        dayChange: -45.00,
        dayChangePercentage: -1.04
      },
      {
        symbol: 'BTC-USD',
        name: 'Bitcoin',
        quantity: 0.5,
        averagePrice: 60000.00,
        currentPrice: 65420.50,
        value: 32710.25,
        pnl: 2710.25,
        pnlPercentage: 9.03,
        dayChange: -350.00,
        dayChangePercentage: -1.06
      },
      {
        symbol: 'ETH-USD',
        name: 'Ethereum',
        quantity: 2.5,
        averagePrice: 3500.00,
        currentPrice: 3950.25,
        value: 9875.63,
        pnl: 1125.63,
        pnlPercentage: 12.86,
        dayChange: 187.50,
        dayChangePercentage: 1.93
      }
    ];
  };

  // Generate mock asset allocation data
  const generateMockAssetAllocation = (holdings: PortfolioHolding[]): AssetAllocation[] => {
    // Group holdings by asset type
    const stockHoldings = holdings.filter(h => !h.symbol.includes('-USD'));
    const cryptoHoldings = holdings.filter(h => h.symbol.includes('-USD'));
    
    const stockValue = stockHoldings.reduce((sum, h) => sum + h.value, 0);
    const cryptoValue = cryptoHoldings.reduce((sum, h) => sum + h.value, 0);
    const totalValue = stockValue + cryptoValue;
    
    return [
      {
        category: 'Stocks',
        value: stockValue,
        percentage: (stockValue / totalValue) * 100,
        color: '#3b82f6' // blue
      },
      {
        category: 'Cryptocurrencies',
        value: cryptoValue,
        percentage: (cryptoValue / totalValue) * 100,
        color: '#f59e0b' // amber
      }
    ];
  };

  // Generate mock performance data
  const generateMockPerformanceData = (): PerformanceDataPoint[] => {
    const data = [];
    const now = new Date();
    
    for (let i = 90; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Generate a somewhat realistic equity curve with some randomness
      const baseValue = 50000 + (i * 150) + (Math.sin(i / 15) * 2000);
      const randomFactor = 1 + (Math.random() * 0.04 - 0.02); // Random factor between 0.98 and 1.02
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(baseValue * randomFactor)
      });
    }
    
    return data;
  };

  // Calculate portfolio summary
  const calculatePortfolioSummary = (holdings: PortfolioHolding[]) => {
    const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
    const totalPnL = holdings.reduce((sum, h) => sum + h.pnl, 0);
    const totalCost = holdings.reduce((sum, h) => sum + (h.averagePrice * h.quantity), 0);
    const totalPnLPercentage = (totalPnL / totalCost) * 100;
    const dayChange = holdings.reduce((sum, h) => sum + h.dayChange, 0);
    const dayChangePercentage = (dayChange / totalValue) * 100;
    
    return {
      totalValue,
      totalPnL,
      totalPnLPercentage,
      dayChange,
      dayChangePercentage
    };
  };

  // Load portfolio data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockHoldings = generateMockHoldings();
      const mockAllocation = generateMockAssetAllocation(mockHoldings);
      const mockPerformance = generateMockPerformanceData();
      const summary = calculatePortfolioSummary(mockHoldings);
      
      setHoldings(mockHoldings);
      setAssetAllocation(mockAllocation);
      setPerformanceData(mockPerformance);
      setPortfolioSummary(summary);
      setIsLoading(false);
    };
    
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6 max-w-screen-2xl">
      <h1 className="text-2xl font-bold">Portfolio</h1>
      
      {/* Portfolio summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Portfolio Value</CardDescription>
            <CardTitle className="text-2xl">
              ${portfolioSummary.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total P&L</CardDescription>
            <CardTitle className={`text-2xl flex items-center ${portfolioSummary.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {portfolioSummary.totalPnL >= 0 ? <ArrowUpRight className="mr-1 h-5 w-5" /> : <ArrowDownRight className="mr-1 h-5 w-5" />}
              ${Math.abs(portfolioSummary.totalPnL).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-sm ml-2">
                ({portfolioSummary.totalPnLPercentage >= 0 ? '+' : ''}{portfolioSummary.totalPnLPercentage.toFixed(2)}%)
              </span>
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Day Change</CardDescription>
            <CardTitle className={`text-2xl flex items-center ${portfolioSummary.dayChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {portfolioSummary.dayChange >= 0 ? <ArrowUpRight className="mr-1 h-5 w-5" /> : <ArrowDownRight className="mr-1 h-5 w-5" />}
              ${Math.abs(portfolioSummary.dayChange).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-sm ml-2">
                ({portfolioSummary.dayChangePercentage >= 0 ? '+' : ''}{portfolioSummary.dayChangePercentage.toFixed(2)}%)
              </span>
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Performance (90d)</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <TrendingUp className="mr-1 h-5 w-5 text-primary" />
              {performanceData.length > 0 ? (
                <>
                  {(((performanceData[performanceData.length - 1].value / performanceData[0].value) - 1) * 100).toFixed(2)}%
                </>
              ) : (
                'Loading...'
              )}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="allocation">Asset Allocation</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="holdings">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Holdings</CardTitle>
              <CardDescription>Your current investments</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Avg. Price</TableHead>
                        <TableHead className="text-right">Current Price</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                        <TableHead className="text-right">P&L</TableHead>
                        <TableHead className="text-right">Day Change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {holdings.map((holding) => (
                        <TableRow key={holding.symbol}>
                          <TableCell className="font-medium">{holding.symbol}</TableCell>
                          <TableCell>{holding.name}</TableCell>
                          <TableCell className="text-right">{holding.quantity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}</TableCell>
                          <TableCell className="text-right">${holding.averagePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                          <TableCell className="text-right">${holding.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                          <TableCell className="text-right">${holding.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                          <TableCell className={`text-right ${holding.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            ${holding.pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            <span className="block text-xs">
                              ({holding.pnlPercentage >= 0 ? '+' : ''}{holding.pnlPercentage.toFixed(2)}%)
                            </span>
                          </TableCell>
                          <TableCell className={`text-right ${holding.dayChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            ${holding.dayChange.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            <span className="block text-xs">
                              ({holding.dayChangePercentage >= 0 ? '+' : ''}{holding.dayChangePercentage.toFixed(2)}%)
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="allocation">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>Distribution of your investments</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <AssetAllocationChart 
                      data={assetAllocation}
                      nameField="category"
                      valueField="value"
                      colorField="color"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Allocation Details</CardTitle>
                <CardDescription>Breakdown by asset class</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Asset Class</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                        <TableHead className="text-right">Allocation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assetAllocation.map((asset) => (
                        <TableRow key={asset.category}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: asset.color }}></div>
                              {asset.category}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">${asset.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                          <TableCell className="text-right">{asset.percentage.toFixed(2)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Performance</CardTitle>
              <CardDescription>90-day historical performance</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-16">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="h-[400px]">
                  <PortfolioChart 
                    data={performanceData}
                    xField="date"
                    yField="value"
                    title="Portfolio Value"
                    color="#3b82f6"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Portfolio;
