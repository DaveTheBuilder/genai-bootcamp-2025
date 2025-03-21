import { useState, useEffect, useCallback } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import igStreamingService from '@/services/igStreamingService';
import igAuthService from '@/services/igAuthService';
import axios from 'axios';
import { useStreamErrorHandler } from './useStreamErrorHandler';
import { unsubscribeFromAllChartData } from '@/services/igStreamingServiceFix';

// Define types for market data
export interface MarketTicker {
  symbol: string;
  displayName: string;
  price: number;
  change: string;
  volume?: number;
  marketCap?: number;
}

export interface OrderBookEntry {
  price: number;
  quantity: number;
}

export interface OrderBook {
  symbol: string;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

export interface ChartDataPoint {
  date: string;
  price: string | number;
}

// Define tab type for stronger typing
export type MarketTab = 'stocks' | 'crypto' | 'forex';
export type TimeFrame = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d';

interface UseMarketDataStreamProps {
  initialTab?: MarketTab;
  initialSymbol?: string;
  initialTimeFrame?: TimeFrame;
}

interface UseMarketDataStreamResult {
  activeTab: MarketTab;
  setActiveTab: (tab: MarketTab) => void;
  selectedSymbol: string;
  setSelectedSymbol: (symbol: string) => void;
  timeFrame: TimeFrame;
  setTimeFrame: (timeFrame: TimeFrame) => void;
  marketTickers: MarketTicker[];
  orderBook: OrderBook | null;
  chartData: ChartDataPoint[];
  isLoading: boolean;
  streamError: string | null;
  isOfflineMode: boolean;
  handleRetry: () => void;
}

// Helper function to get display name for an epic
export const getDisplayNameForEpic = (epic: string): string => {
  const epicMap: Record<string, string> = {
    'IX.D.FTSE.DAILY.IP': 'FTSE 100',
    'IX.D.DOW.DAILY.IP': 'Dow Jones',
    'IX.D.NASDAQ.DAILY.IP': 'NASDAQ',
    'IX.D.DAX.DAILY.IP': 'DAX',
    'IX.D.SPTRD.DAILY.IP': 'S&P 500',
    'IX.D.ASX.DAILY.IP': 'ASX 200',
    'CS.D.BITCOIN.TODAY.IP': 'BTC/USD',
    'CS.D.ETHUSD.TODAY.IP': 'ETH/USD',
    'CS.D.RIPPLE.TODAY.IP': 'XRP/USD',
    'CS.D.BCHUSD.TODAY.IP': 'BCH/USD',
    'CS.D.LTCUSD.TODAY.IP': 'LTC/USD',
    'CS.D.DOTUSD.TODAY.IP': 'DOT/USD',
    'CS.D.EURUSD.TODAY.IP': 'EUR/USD',
    'CS.D.GBPUSD.TODAY.IP': 'GBP/USD',
    'CS.D.USDJPY.TODAY.IP': 'USD/JPY',
    'CS.D.AUDUSD.TODAY.IP': 'AUD/USD',
    'CS.D.USDCAD.TODAY.IP': 'USD/CAD',
    'CS.D.USDCHF.TODAY.IP': 'USD/CHF'
  };
  
  return epicMap[epic] || epic;
};

export const useMarketDataStream = (props?: UseMarketDataStreamProps): UseMarketDataStreamResult => {
  const { initialTab = 'stocks', initialSymbol, initialTimeFrame = '1h' } = props || {};
  
  // State for active tab and selected symbol
  const [activeTab, setActiveTab] = useState<MarketTab>(initialTab);
  const [selectedSymbol, setSelectedSymbol] = useState<string>(initialSymbol || '');
  const [timeFrame, setTimeFrame] = useState<TimeFrame>(initialTimeFrame);
  
  // State for market data
  const [marketTickers, setMarketTickers] = useState<MarketTicker[]>([]);
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Get streaming settings from store
  const { streamingUrl } = useSettingsStore();
  
  // Use the stream error handler
  const { streamError, setStreamError, isOfflineMode, setIsOfflineMode } = useStreamErrorHandler();
  
  // Generate mock market data for different asset classes
  const mockStockTickers: MarketTicker[] = [
    { symbol: 'IX.D.FTSE.DAILY.IP', displayName: 'FTSE 100', price: 7850.25, change: '+0.75%' },
    { symbol: 'IX.D.DOW.DAILY.IP', displayName: 'Dow Jones', price: 38750.50, change: '+0.42%' },
    { symbol: 'IX.D.NASDAQ.DAILY.IP', displayName: 'NASDAQ', price: 16320.75, change: '-0.18%' },
    { symbol: 'IX.D.DAX.DAILY.IP', displayName: 'DAX', price: 17980.30, change: '+0.33%' },
    { symbol: 'IX.D.SPTRD.DAILY.IP', displayName: 'S&P 500', price: 5120.80, change: '+0.22%' },
    { symbol: 'IX.D.ASX.DAILY.IP', displayName: 'ASX 200', price: 7680.40, change: '-0.15%' }
  ];
  
  const mockCryptoTickers: MarketTicker[] = [
    { symbol: 'CS.D.BITCOIN.TODAY.IP', displayName: 'BTC/USD', price: 68420.50, change: '+2.35%' },
    { symbol: 'CS.D.ETHUSD.TODAY.IP', displayName: 'ETH/USD', price: 3850.25, change: '+1.75%' },
    { symbol: 'CS.D.RIPPLE.TODAY.IP', displayName: 'XRP/USD', price: 0.52, change: '-0.95%' },
    { symbol: 'CS.D.BCHUSD.TODAY.IP', displayName: 'BCH/USD', price: 380.75, change: '+0.65%' },
    { symbol: 'CS.D.LTCUSD.TODAY.IP', displayName: 'LTC/USD', price: 85.60, change: '-0.45%' },
    { symbol: 'CS.D.DOTUSD.TODAY.IP', displayName: 'DOT/USD', price: 7.85, change: '+1.25%' }
  ];
  
  const mockForexTickers: MarketTicker[] = [
    { symbol: 'CS.D.EURUSD.TODAY.IP', displayName: 'EUR/USD', price: 1.0825, change: '+0.12%' },
    { symbol: 'CS.D.GBPUSD.TODAY.IP', displayName: 'GBP/USD', price: 1.2650, change: '+0.08%' },
    { symbol: 'CS.D.USDJPY.TODAY.IP', displayName: 'USD/JPY', price: 151.25, change: '-0.15%' },
    { symbol: 'CS.D.AUDUSD.TODAY.IP', displayName: 'AUD/USD', price: 0.6580, change: '+0.22%' },
    { symbol: 'CS.D.USDCAD.TODAY.IP', displayName: 'USD/CAD', price: 1.3620, change: '-0.05%' },
    { symbol: 'CS.D.USDCHF.TODAY.IP', displayName: 'USD/CHF', price: 0.9050, change: '+0.03%' }
  ];
  
  // Generate mock chart data
  const generateMockChartData = (symbol: string, timeFrame: TimeFrame): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    const now = new Date();
    const basePrice = getBasePrice(symbol);
    let currentPrice = basePrice;
    
    // Generate 30 data points going back in time
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * getTimeFrameMinutes(timeFrame) * 60 * 1000);
      
      // Add some randomness to the price (within 2% range)
      const randomFactor = 1 + (Math.random() * 0.04 - 0.02);
      currentPrice = currentPrice * randomFactor;
      
      data.push({
        date: date.toISOString(),
        price: currentPrice
      });
    }
    
    return data;
  };
  
  // Helper to get base price for a symbol
  const getBasePrice = (symbol: string): number => {
    // Map symbols to base prices
    const priceMap: Record<string, number> = {
      // Stocks/Indices
      'IX.D.FTSE.DAILY.IP': 7850.25,
      'IX.D.DOW.DAILY.IP': 38750.50,
      'IX.D.NASDAQ.DAILY.IP': 16320.75,
      'IX.D.DAX.DAILY.IP': 17980.30,
      'IX.D.SPTRD.DAILY.IP': 5120.80,
      'IX.D.ASX.DAILY.IP': 7680.40,
      
      // Cryptocurrencies
      'CS.D.BITCOIN.TODAY.IP': 68420.50,
      'CS.D.ETHUSD.TODAY.IP': 3850.25,
      'CS.D.RIPPLE.TODAY.IP': 0.52,
      'CS.D.BCHUSD.TODAY.IP': 380.75,
      'CS.D.LTCUSD.TODAY.IP': 85.60,
      'CS.D.DOTUSD.TODAY.IP': 7.85,
      
      // Forex
      'CS.D.EURUSD.TODAY.IP': 1.0825,
      'CS.D.GBPUSD.TODAY.IP': 1.2650,
      'CS.D.USDJPY.TODAY.IP': 151.25,
      'CS.D.AUDUSD.TODAY.IP': 0.6580,
      'CS.D.USDCAD.TODAY.IP': 1.3620,
      'CS.D.USDCHF.TODAY.IP': 0.9050
    };
    
    return priceMap[symbol] || 100;
  };
  
  // Helper to convert timeframe to minutes
  const getTimeFrameMinutes = (timeFrame: TimeFrame): number => {
    switch (timeFrame) {
      case '1m': return 1;
      case '5m': return 5;
      case '15m': return 15;
      case '30m': return 30;
      case '1h': return 60;
      case '4h': return 240;
      case '1d': return 1440;
      default: return 60;
    }
  };
  
  // Generate mock order book
  const generateMockOrderBook = (symbol: string): OrderBook => {
    const basePrice = getBasePrice(symbol);
    const bids: OrderBookEntry[] = [];
    const asks: OrderBookEntry[] = [];
    
    // Generate 10 bid entries (below the base price)
    for (let i = 0; i < 10; i++) {
      const priceFactor = 1 - ((i + 1) * 0.001); // 0.1% steps down
      bids.push({
        price: basePrice * priceFactor,
        quantity: Math.floor(Math.random() * 100) + 1
      });
    }
    
    // Generate 10 ask entries (above the base price)
    for (let i = 0; i < 10; i++) {
      const priceFactor = 1 + ((i + 1) * 0.001); // 0.1% steps up
      asks.push({
        price: basePrice * priceFactor,
        quantity: Math.floor(Math.random() * 100) + 1
      });
    }
    
    return {
      symbol,
      bids,
      asks
    };
  };
  
  // Function to handle retry
  const handleRetry = useCallback(async () => {
    setStreamError(null);
    setIsOfflineMode(false);
    await loadMarketData();
  }, [setStreamError, setIsOfflineMode]);
  
  // Function to load market data
  const loadMarketData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Initialize the streaming service
      if (!igStreamingService.getConnectionStatus()) {
        try {
          // Get the lightstreamer endpoint from the IG API
          const lightstreamerEndpoint = streamingUrl || 'https://demo-apd.marketdatasystems.com';
          
          // Initialize the streaming service with the endpoint
          await igStreamingService.initialize(lightstreamerEndpoint);
          
          // Set offline mode based on connection status
          setIsOfflineMode(!igStreamingService.getConnectionStatus());
        } catch (error) {
          console.error('Failed to initialize streaming service:', error);
          setStreamError(`Failed to connect to streaming service: ${error instanceof Error ? error.message : 'Unknown error'}`);
          setIsOfflineMode(true);
        }
      }
      
      // Load market tickers based on active tab
      let tickers: MarketTicker[] = [];
      
      switch (activeTab) {
        case 'stocks':
          tickers = mockStockTickers;
          break;
        case 'crypto':
          tickers = mockCryptoTickers;
          break;
        case 'forex':
          tickers = mockForexTickers;
          break;
        default:
          tickers = mockStockTickers;
          break;
      }
      
      setMarketTickers(tickers);
      
      // Generate mock chart data for the selected symbol
      if (selectedSymbol) {
        setChartData(generateMockChartData(selectedSymbol, timeFrame));
        setOrderBook(generateMockOrderBook(selectedSymbol));
      }
      
      setIsLoading(false);
      
    } catch (error) {
      console.error('Failed to initialize streaming service:', error);
      // No longer setting offline mode since it's been removed
      // Fallback to mock data will be handled by the streaming service itself
    }
  }, [
    activeTab, 
    generateMockChartData, 
    generateMockOrderBook,
    selectedSymbol,
    timeFrame
  ]);

  // Effect to update data based on active tab
  useEffect(() => {
    loadMarketData();
  }, [activeTab, loadMarketData]);

  // Effect to update chart and order book when selected symbol changes
  useEffect(() => {
    if (!selectedSymbol) return;
    
    setIsLoading(true);
    console.log(`Updating data for selected symbol: ${selectedSymbol}`);
    
    try {
      // Unsubscribe from any existing chart data subscriptions
      unsubscribeFromAllChartData(igStreamingService);
      
      // Clear existing chart data when symbol changes
      setChartData([]);
      
      // Always load mock data first to ensure the UI is never empty
      const initialData = generateMockChartData(selectedSymbol, timeFrame);
      setChartData(initialData);
      setOrderBook(generateMockOrderBook(selectedSymbol));
      
      // Check if the streaming service is properly initialized
      if (!igStreamingService.getConnectionStatus()) {
        console.warn("IG Streaming service not connected, using offline data");
        // Don't enable offline mode here, as we might reconnect later
        setIsLoading(false);
        return;
      }
      
      // Subscribe to chart data for the selected symbol
      igStreamingService.subscribeToChartData(selectedSymbol, timeFrame, (update) => {
        console.log(`Received chart update for ${selectedSymbol}:`, update);
        
        const dataPoint: ChartDataPoint = {
          date: update.timestamp,
          price: update.closePrice
        };
        
        // Update chart data with the new point
        setChartData(prev => {
          // Make a copy of the previous data
          const newData = [...prev];
          
          // Add the new data point
          newData.push(dataPoint);
          
          // Keep only the last 30 points to avoid too much data
          return newData.slice(-30);
        });
      });
      
      // Subscribe to order book for the selected symbol
      igStreamingService.subscribeToOrderBook(selectedSymbol, (update) => {
        // Create or update the order book
        setOrderBook(currentOrderBook => {
          const newOrderBook: OrderBook = currentOrderBook ? { ...currentOrderBook } : {
            symbol: selectedSymbol,
            bids: [],
            asks: []
          };
          
          // Update the bid or ask based on the update
          const bidEntry: OrderBookEntry = {
            price: update.bidPrice,
            quantity: update.bidSize
          };
          
          const askEntry: OrderBookEntry = {
            price: update.offerPrice,
            quantity: update.offerSize
          };
          
          // Find and update or add the bid entry
          const bidIndex = newOrderBook.bids.findIndex(b => Math.abs(b.price - bidEntry.price) < 0.0001);
          if (bidIndex >= 0) {
            newOrderBook.bids[bidIndex] = bidEntry;
          } else {
            newOrderBook.bids.push(bidEntry);
          }
          
          // Find and update or add the ask entry
          const askIndex = newOrderBook.asks.findIndex(a => Math.abs(a.price - askEntry.price) < 0.0001);
          if (askIndex >= 0) {
            newOrderBook.asks[askIndex] = askEntry;
          } else {
            newOrderBook.asks.push(askEntry);
          }
          
          // Sort bids (highest first) and asks (lowest first)
          newOrderBook.bids.sort((a, b) => b.price - a.price);
          newOrderBook.asks.sort((a, b) => a.price - b.price);
          
          // Keep only top 10 entries
          newOrderBook.bids = newOrderBook.bids.slice(0, 10);
          newOrderBook.asks = newOrderBook.asks.slice(0, 10);
          
          return newOrderBook;
        });
      });
      
      // Subscribe to market data for the selected symbol
      igStreamingService.subscribeToMarketData(selectedSymbol, (update) => {
        // Update the market ticker with the latest price
        setMarketTickers(tickers => {
          return tickers.map(ticker => {
            if (ticker.symbol === selectedSymbol) {
              // Calculate change percentage
              const oldPrice = ticker.price;
              const newPrice = update.bid; // Use bid price
              const changePercent = ((newPrice - oldPrice) / oldPrice) * 100;
              const changeStr = changePercent >= 0 ? `+${changePercent.toFixed(2)}%` : `${changePercent.toFixed(2)}%`;
              
              return {
                ...ticker,
                price: newPrice,
                change: changeStr
              };
            }
            return ticker;
          });
        });
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error(`Error setting up data streams for ${selectedSymbol}:`, error);
      setStreamError(`Error setting up data streams: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  }, [selectedSymbol, timeFrame, setStreamError]);
  
  // Effect to update chart data when timeframe changes
  useEffect(() => {
    if (!selectedSymbol) return;
    
    // Unsubscribe from any existing chart data subscriptions
    unsubscribeFromAllChartData(igStreamingService);
    
    // Clear existing chart data
    setChartData([]);
    
    // Load mock data for the new timeframe
    setChartData(generateMockChartData(selectedSymbol, timeFrame));
    
    // Check if the streaming service is properly initialized
    if (!igStreamingService.getConnectionStatus()) {
      console.warn("IG Streaming service not connected, using offline data for timeframe change");
      return;
    }
    
    // Subscribe to chart data for the selected symbol with the new timeframe
    igStreamingService.subscribeToChartData(selectedSymbol, timeFrame, (update) => {
      console.log(`Received chart update for ${selectedSymbol} with timeframe ${timeFrame}:`, update);
      
      const dataPoint: ChartDataPoint = {
        date: update.timestamp,
        price: update.closePrice
      };
      
      // Update chart data with the new point
      setChartData(prev => {
        const newData = [...prev];
        newData.push(dataPoint);
        return newData.slice(-30);
      });
    });
  }, [timeFrame]);
  
  // Set default selected symbol if not set and market tickers are loaded
  useEffect(() => {
    if (!selectedSymbol && marketTickers.length > 0) {
      setSelectedSymbol(marketTickers[0].symbol);
    }
  }, [selectedSymbol, marketTickers]);
  
  return {
    activeTab,
    setActiveTab,
    selectedSymbol,
    setSelectedSymbol,
    timeFrame,
    setTimeFrame,
    marketTickers,
    orderBook,
    chartData,
    isLoading,
    streamError,
    isOfflineMode,
    handleRetry
  };
};
