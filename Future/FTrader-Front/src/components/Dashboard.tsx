
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import StatCard from './StatCard';
import PerformanceChart from './PerformanceChart';
import MarketCard from './MarketCard';
import TradeActivityCard from './TradeActivityCard';

// Define the Trade type with proper typing for 'side'
interface Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  price: number;
  quantity: number;
  timestamp: string;
}

// Generate mock performance data
const generateMockPerformanceData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate a somewhat realistic equity curve with some randomness
    const baseValue = 10000 + (i * 100) + (Math.sin(i / 5) * 500);
    const randomFactor = 1 + (Math.random() * 0.04 - 0.02); // Random factor between 0.98 and 1.02
    
    data.push({
      date: date.toISOString().split('T')[0],
      equity: Math.round(baseValue * randomFactor)
    });
  }
  
  return data;
};

const mockPerformanceData = generateMockPerformanceData();

const mockRecentTrades: Trade[] = [
  { id: 't1', symbol: 'AAPL', side: 'buy', price: 180.25, quantity: 10, timestamp: '2025-03-07T13:45:00Z' },
  { id: 't2', symbol: 'BTC-USD', side: 'sell', price: 65420.50, quantity: 0.15, timestamp: '2025-03-07T12:30:00Z' },
  { id: 't3', symbol: 'MSFT', side: 'buy', price: 410.75, quantity: 5, timestamp: '2025-03-07T11:15:00Z' },
  { id: 't4', symbol: 'ETH-USD', side: 'buy', price: 3950.25, quantity: 0.5, timestamp: '2025-03-07T10:00:00Z' }
];

const Dashboard: React.FC = () => {
  const isMobile = useIsMobile();
  const [portfolioSummary, setPortfolioSummary] = useState({
    totalEquity: 25420.75,
    cashBalance: 12500.50,
    dayPnL: '+$420.25',
    dayPnLPercentage: '+1.68%',
    totalPnL: '+$2,420.75',
    totalPnLPercentage: '+10.52%'
  });
  const [marketData, setMarketData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate fetching data
  useEffect(() => {
    const fetchData = async () => {
      // In a real app, we would call the API services here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock market data for the watchlist
      const mockMarketData = [
        { symbol: 'AAPL', price: 180.25, change: '+1.2%', changeDirection: 'up' },
        { symbol: 'MSFT', price: 410.75, change: '+0.8%', changeDirection: 'up' },
        { symbol: 'GOOGL', price: 142.30, change: '-0.5%', changeDirection: 'down' },
        { symbol: 'AMZN', price: 178.50, change: '+2.1%', changeDirection: 'up' },
        { symbol: 'BTC-USD', price: 65420.50, change: '-0.7%', changeDirection: 'down' },
        { symbol: 'ETH-USD', price: 3950.25, change: '+1.5%', changeDirection: 'up' }
      ];
      
      setMarketData(mockMarketData);
      setIsLoading(false);
    };
    
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <div className="spinner"></div>
        <p className="mt-4 text-muted-foreground font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          title="Total Equity" 
          value={`$${portfolioSummary.totalEquity.toLocaleString()}`} 
          delay={100}
        />
        
        <StatCard 
          title="Cash Balance" 
          value={`$${portfolioSummary.cashBalance.toLocaleString()}`} 
          delay={200}
        />
        
        <StatCard 
          title="Day P&L" 
          value={portfolioSummary.dayPnL} 
          changePercent={portfolioSummary.dayPnLPercentage}
          isPositive={true}
          delay={300}
        />
        
        <StatCard 
          title="Total P&L" 
          value={portfolioSummary.totalPnL} 
          changePercent={portfolioSummary.totalPnLPercentage}
          isPositive={true}
          delay={400}
        />
      </div>
      
      <PerformanceChart data={mockPerformanceData} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarketCard marketData={marketData} />
        <TradeActivityCard trades={mockRecentTrades} />
      </div>
    </div>
  );
};

export default Dashboard;
