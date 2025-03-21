import { useState, useEffect, useCallback } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import igStreamingService from '@/services/igStreamingService';
import igAuthService from '@/services/igAuthService';
import axios from 'axios'; // Import axios
import { useStreamErrorHandler } from './useStreamErrorHandler';
import igConnectivityTest from '@/services/igConnectivityTest';

// Define types for market data
export interface MarketTicker {
  symbol: string;
  displayName: string;
  price: number;
  change: string;
  changeDirection: 'up' | 'down';
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
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
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
  enableOfflineMode: () => void;
  lastPrice: number | null;
}

/**
 * Hook to handle market data streaming and offline mode
 */
export const useMarketDataStream = (
  props?: UseMarketDataStreamProps
): UseMarketDataStreamResult => {
  const { 
    initialTab = 'stocks', 
    initialSymbol = 'AAPL',
    initialTimeFrame = '1h'
  } = props || {};
  const [activeTab, setActiveTab] = useState<MarketTab>(initialTab);
  const [selectedSymbol, setSelectedSymbol] = useState(initialSymbol);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>(initialTimeFrame);
  const [marketTickers, setMarketTickers] = useState<MarketTicker[]>([]);
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastPrice, setLastPrice] = useState<number | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const settingsStore = useSettingsStore();
  
  // Mock data for different asset classes
  const mockStockTickers: MarketTicker[] = [
    { symbol: 'IX.D.FTSE.DAILY.IP', displayName: 'FTSE 100', price: 180.25, change: '+1.2%', changeDirection: 'up', volume: 45678900, marketCap: 2950000000000 },
    { symbol: 'IX.D.DOW.DAILY.IP', displayName: 'Dow Jones', price: 410.75, change: '+0.8%', changeDirection: 'up', volume: 23456700, marketCap: 3050000000000 },
    { symbol: 'IX.D.NASDAQ.DAILY.IP', displayName: 'NASDAQ', price: 142.30, change: '-0.5%', changeDirection: 'down', volume: 12345600, marketCap: 1850000000000 },
    { symbol: 'IX.D.DAX.DAILY.IP', displayName: 'DAX', price: 178.50, change: '+2.1%', changeDirection: 'up', volume: 34567800, marketCap: 1750000000000 },
    { symbol: 'IX.D.SPTRD.DAILY.IP', displayName: 'S&P 500', price: 248.50, change: '-1.3%', changeDirection: 'down', volume: 56789000, marketCap: 780000000000 },
    { symbol: 'IX.D.ASX.DAILY.IP', displayName: 'ASX 200', price: 485.20, change: '+1.5%', changeDirection: 'up', volume: 21345600, marketCap: 1250000000000 },
  ];

  const mockCryptoTickers: MarketTicker[] = [
    { symbol: 'CS.D.BITCOIN.TODAY.IP', displayName: 'BTC/USD', price: 65420.50, change: '-0.7%', changeDirection: 'down', volume: 45678900000, marketCap: 1250000000000 },
    { symbol: 'CS.D.ETHUSD.TODAY.IP', displayName: 'ETH/USD', price: 3950.25, change: '+1.5%', changeDirection: 'up', volume: 23456700000, marketCap: 450000000000 },
    { symbol: 'CS.D.RIPPLE.TODAY.IP', displayName: 'XRP/USD', price: 142.30, change: '+3.2%', changeDirection: 'up', volume: 12345600000, marketCap: 65000000000 },
    { symbol: 'CS.D.BCHUSD.TODAY.IP', displayName: 'BCH/USD', price: 0.58, change: '-0.9%', changeDirection: 'down', volume: 3456780000, marketCap: 20000000000 },
    { symbol: 'CS.D.LTCUSD.TODAY.IP', displayName: 'LTC/USD', price: 0.62, change: '+0.5%', changeDirection: 'up', volume: 2134560000, marketCap: 35000000000 },
    { symbol: 'CS.D.DOTUSD.TODAY.IP', displayName: 'DOT/USD', price: 7.85, change: '+1.2%', changeDirection: 'up', volume: 1234560000, marketCap: 10000000000 },
  ];

  const mockForexTickers: MarketTicker[] = [
    { symbol: 'CS.D.EURUSD.TODAY.IP', displayName: 'EUR/USD', price: 1.0825, change: '-0.2%', changeDirection: 'down', volume: 123456000000 },
    { symbol: 'CS.D.GBPUSD.TODAY.IP', displayName: 'GBP/USD', price: 151.25, change: '+0.3%', changeDirection: 'up', volume: 98765000000 },
    { symbol: 'CS.D.USDJPY.TODAY.IP', displayName: 'USD/JPY', price: 1.2650, change: '-0.1%', changeDirection: 'down', volume: 87654000000 },
    { symbol: 'CS.D.AUDUSD.TODAY.IP', displayName: 'AUD/USD', price: 0.9050, change: '+0.2%', changeDirection: 'up', volume: 76543000000 },
    { symbol: 'CS.D.USDCAD.TODAY.IP', displayName: 'USD/CAD', price: 0.6580, change: '-0.3%', changeDirection: 'down', volume: 65432000000 },
    { symbol: 'CS.D.USDCHF.TODAY.IP', displayName: 'USD/CHF', price: 1.3620, change: '+0.1%', changeDirection: 'up', volume: 54321000000 },
  ];
  
  // Initialize the stream error handler
  const { 
    handleRetry, 
    enableOfflineMode 
  } = useStreamErrorHandler({
    onRetry: () => loadMarketData()
  });
  
  // Helper function to get base price for a symbol
  const getBasePrice = (symbol: string): number => {
    switch (symbol) {
      case 'IX.D.FTSE.DAILY.IP':
        return 180.25;
      case 'CS.D.BITCOIN.TODAY.IP':
        return 65420.50;
      case 'CS.D.EURUSD.TODAY.IP':
        return 1.0825;
      default:
        return 100;
    }
  };

  // Helper function to generate mock chart data based on timeframe
  const generateMockChartData = useCallback((symbol: string, tf: TimeFrame = '1h'): ChartDataPoint[] => {
    const now = new Date();
    const data: ChartDataPoint[] = [];
    const basePrice = getBasePrice(symbol);
    const volatility = basePrice * 0.05; // 5% volatility
    
    // Determine time increment based on timeframe
    let timeIncrement: number;
    let points: number;
    
    switch (tf) {
      case '1m':
        timeIncrement = 60 * 1000; // 1 minute
        points = 240; // 4 hours of 1-minute data
        break;
      case '5m':
        timeIncrement = 5 * 60 * 1000; // 5 minutes
        points = 288; // 24 hours of 5-minute data
        break;
      case '15m':
        timeIncrement = 15 * 60 * 1000; // 15 minutes
        points = 192; // 48 hours of 15-minute data
        break;
      case '30m':
        timeIncrement = 30 * 60 * 1000; // 30 minutes
        points = 168; // 84 hours (3.5 days) of 30-minute data
        break;
      case '1h':
        timeIncrement = 60 * 60 * 1000; // 1 hour
        points = 168; // 7 days of hourly data
        break;
      case '4h':
        timeIncrement = 4 * 60 * 60 * 1000; // 4 hours
        points = 90; // 15 days of 4-hour data
        break;
      case '1d':
        timeIncrement = 24 * 60 * 60 * 1000; // 1 day
        points = 90; // 90 days of daily data
        break;
      default:
        timeIncrement = 60 * 60 * 1000; // Default to 1 hour
        points = 168; // 7 days of hourly data
    }
    
    // Generate data points with more realistic market behavior
    let price = basePrice;
    let trend = 0; // Tracks the current market trend (positive = uptrend, negative = downtrend)
    let trendStrength = 0; // How strong the current trend is
    let trendDuration = 0; // How long the current trend has lasted
    
    // Create some market cycles
    const cycles: {startPoint: number, endPoint: number, direction: number}[] = [];
    let remainingPoints = points;
    
    while (remainingPoints > 0) {
      // Create cycles of varying lengths
      const cycleLength = Math.floor(Math.random() * 20) + 10; // 10-30 points per cycle
      const actualLength = Math.min(cycleLength, remainingPoints);
      const direction = Math.random() > 0.5 ? 1 : -1; // Uptrend or downtrend
      
      cycles.push({
        startPoint: points - remainingPoints,
        endPoint: points - remainingPoints + actualLength,
        direction
      });
      
      remainingPoints -= actualLength;
    }
    
    for (let i = points; i > 0; i--) {
      const timestamp = new Date(now.getTime() - (i * timeIncrement));
      const pointIndex = points - i;
      
      // Find the current cycle
      const currentCycle = cycles.find(c => pointIndex >= c.startPoint && pointIndex < c.endPoint);
      
      if (currentCycle) {
        // Adjust trend based on the cycle
        const cycleProgress = (pointIndex - currentCycle.startPoint) / (currentCycle.endPoint - currentCycle.startPoint);
        trend = currentCycle.direction * (cycleProgress < 0.5 ? cycleProgress * 2 : (1 - cycleProgress) * 2);
      } else {
        // Random trend if not in a defined cycle
        trend = (Math.random() - 0.5) * 2;
      }
      
      // Random component (noise)
      const noise = (Math.random() - 0.5) * volatility * 0.3;
      
      // Trend component
      const trendComponent = trend * volatility * 0.7;
      
      // Mean reversion component (stronger when price deviates more from base)
      const deviation = price - basePrice;
      const meanReversion = -deviation * 0.03;
      
      // Update price
      price = price + noise + trendComponent + meanReversion;
      
      // Ensure price doesn't go negative or too far from base
      price = Math.max(basePrice * 0.5, price);
      price = Math.min(basePrice * 1.5, price);
      
      data.push({
        date: timestamp.toISOString(),
        price: price.toFixed(2)
      });
    }
    
    return data;
  }, []);

  // Generate mock order book
  const generateMockOrderBook = useCallback((symbol: string): OrderBook => {
    const basePrice = getBasePrice(symbol);
    
    const bids = [];
    const asks = [];
    
    // Generate 10 bid prices below the base price
    for (let i = 1; i <= 10; i++) {
      const priceDelta = (i * 0.05) * (symbol === 'CS.D.BITCOIN.TODAY.IP' ? 100 : 1);
      const quantity = Math.floor(Math.random() * 1000) + 100;
      bids.push({
        price: parseFloat((basePrice - priceDelta).toFixed(2)),
        quantity
      });
    }
    
    // Generate 10 ask prices above the base price
    for (let i = 1; i <= 10; i++) {
      const priceDelta = (i * 0.05) * (symbol === 'CS.D.BITCOIN.TODAY.IP' ? 100 : 1);
      const quantity = Math.floor(Math.random() * 1000) + 100;
      asks.push({
        price: parseFloat((basePrice + priceDelta).toFixed(2)),
        quantity
      });
    }
    
    // Sort bids in descending order (highest bid first)
    bids.sort((a, b) => b.price - a.price);
    
    // Sort asks in ascending order (lowest ask first)
    asks.sort((a, b) => a.price - b.price);
    
    return {
      symbol,
      bids,
      asks
    };
  }, []);

  // Function to load market data
  const loadMarketData = useCallback(async () => {
    setIsLoading(true);
    
    // Use the IG Streaming API
    try {
      // Function to check authentication and connect to IG streaming
      const checkAuthStatus = async () => {
        try {
          console.log("Checking IG authentication status...");
          
          // Check if we're authenticated
          const isAuthenticated = await igAuthService.checkAuthStatus();
          
          console.log("IG authentication status:", isAuthenticated);
          
          if (!isAuthenticated) {
            // Instead of throwing an error immediately, set offline mode with friendly message
            console.log("Not authenticated with IG, using offline mode...");
            setIsLoading(false);
            enableOfflineMode(); // Use the existing function to enable offline mode
            return false;
          }
          
          // Get credentials for streaming
          console.log("Getting IG credentials...");
          const credentials = await igAuthService.getCredentials();
          
          if (!credentials) {
            throw new Error("Failed to get IG credentials");
          }
          
          console.log("Successfully retrieved IG credentials");
          
          // Get the lightstreamer endpoint from the streaming connection test
          console.log("Testing streaming connection...");
          const streamingTestResponse = await axios.get('/api/trading/test/ig/test-connection/', {
            headers: {
              'CST': credentials.cst,
              'X-SECURITY-TOKEN': credentials.securityToken,
            }
          });
          
          console.log("Streaming test response:", streamingTestResponse.data);
          
          // Check if the streaming test was successful
          if (!streamingTestResponse.data.success) {
            throw new Error(`Failed to get lightstreamer endpoint: ${streamingTestResponse.data.message || 'Unknown error'}`);
          }
          
          // Connect to streaming service and wait for connection to be established
          try {
            await igStreamingService.initialize(
              credentials.cst,
              credentials.securityToken,
              credentials.accountId,
              streamingTestResponse.data.lightstreamerEndpoint
            );
            
            console.log("Successfully initialized Lightstreamer client");
          } catch (error) {
            console.error("Failed to initialize Lightstreamer client:", error);
            throw new Error("Failed to connect to streaming service");
          }
          
          // Set up connection status change handler
          igStreamingService.onConnectionStatusChange((connected) => {
            if (!connected) {
              // If connection fails, log the disconnection but don't try to set offline mode
              // since we've removed that option from settings
              console.log("IG connection status changed to disconnected");
              // Fallback to mock data will be handled by the streaming service itself
            }
          });
          
          // Subscribe to market data based on active tab
          let symbols: string[] = [];
          switch (activeTab) {
            case 'stocks':
              // Use valid IG epics for stocks/indices instead of standard symbols
              symbols = [
                'IX.D.FTSE.DAILY.IP', // FTSE 100
                'IX.D.DOW.DAILY.IP',  // Dow Jones
                'IX.D.NASDAQ.DAILY.IP', // NASDAQ
                'IX.D.DAX.DAILY.IP',  // German DAX
                'IX.D.SPTRD.DAILY.IP', // S&P 500
                'IX.D.ASX.DAILY.IP'   // ASX 200
              ];
              break;
            case 'crypto':
              // Use valid IG epics for cryptocurrencies
              symbols = [
                'CS.D.BITCOIN.TODAY.IP', // Bitcoin
                'CS.D.ETHUSD.TODAY.IP',  // Ethereum
                'CS.D.RIPPLE.TODAY.IP',  // Ripple (XRP)
                'CS.D.BCHUSD.TODAY.IP',  // Bitcoin Cash
                'CS.D.LTCUSD.TODAY.IP',  // Litecoin
                'CS.D.DOTUSD.TODAY.IP'   // Polkadot
              ];
              break;
            case 'forex':
              // Use valid IG epics for forex pairs
              symbols = [
                'CS.D.EURUSD.TODAY.IP', // EUR/USD
                'CS.D.GBPUSD.TODAY.IP', // GBP/USD
                'CS.D.USDJPY.TODAY.IP', // USD/JPY
                'CS.D.AUDUSD.TODAY.IP', // AUD/USD
                'CS.D.USDCAD.TODAY.IP', // USD/CAD
                'CS.D.USDCHF.TODAY.IP'  // USD/CHF
              ];
              break;
          }
          
          // Subscribe to each symbol
          const marketTickers: MarketTicker[] = [];
          symbols.forEach(symbol => {
            console.log(`Subscribing to market data for ${symbol}`);
            igStreamingService.subscribeToMarketData(symbol, (update) => {
              // Log the received update for debugging
              console.log(`Received market update for ${symbol}:`, update);
              
              // Convert IG update to our MarketTicker format
              const changePct = update.changePct || 0;
              const ticker: MarketTicker = {
                symbol: update.epic,
                displayName: getDisplayNameForEpic(update.epic),
                price: (update.bid + update.offer) / 2, // Calculate mid price
                change: changePct ? (changePct >= 0 ? '+' : '') + changePct.toFixed(2) + '%' : '0.00%',
                changeDirection: changePct >= 0 ? 'up' : 'down',
                volume: 0 // IG doesn't provide volume in streaming updates
              };
              
              console.log(`Formatted ticker for ${symbol}:`, ticker);
              
              // Add to our tickers array if not already present
              const existingIndex = marketTickers.findIndex(t => t.symbol === ticker.symbol);
              if (existingIndex >= 0) {
                marketTickers[existingIndex] = ticker;
              } else {
                marketTickers.push(ticker);
              }
              
              // Update state
              setMarketTickers([...marketTickers]);
            });
          });
          
          setIsLoading(false);
          return true;
        } catch (error) {
          console.error('Authentication or connection error:', error);
          return false;
        }
      };
      
      // Try to connect, but don't wait for it to complete
      // This allows us to proceed with loading mock data if there's an error
      checkAuthStatus().then(success => {
        if (!success) {
          console.warn("Failed to connect to IG API, using offline mode");
        }
      }).catch(error => {
        console.error('Failed to initialize streaming service:', error);
      });
      
      // Load initial mock data anyway, will be replaced by real data if connection succeeds
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
    
    try {
      // Always load mock data first to ensure the UI is never empty
      setChartData(generateMockChartData(selectedSymbol, timeFrame));
      setOrderBook(generateMockOrderBook(selectedSymbol));
      
      // Check if the streaming service is properly initialized
      if (!igStreamingService.getConnectionStatus()) {
        console.warn("IG Streaming service not connected, using offline data");
        // Don't enable offline mode here, as we might reconnect later
        setIsLoading(false);
        return;
      }
      
      // Clear any existing chart data to ensure we start fresh with the new symbol
      setChartData([]);
      
      // Subscribe to chart data for the selected symbol
      const chartUpdateCallback = (update: any) => {
        console.log(`Received chart update for ${selectedSymbol}:`, update);
        
        try {
          // Create a data point from the update
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
          
          // Update loading state if needed
          if (isLoading) {
            setIsLoading(false);
          }
        } catch (error) {
          console.error(`Error processing chart update for ${selectedSymbol}:`, error);
        }
      };
      
      igStreamingService.subscribeToChartData(selectedSymbol, timeFrame, chartUpdateCallback);
      
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
          
          // Update bids and asks
          newOrderBook.bids = updateOrderBookEntries(newOrderBook.bids, bidEntry);
          newOrderBook.asks = updateOrderBookEntries(newOrderBook.asks, askEntry);
          
          return newOrderBook;
        });
      });
      
      setIsLoading(false);
      
      // Clean up subscriptions when symbol changes
      return () => {
        if (selectedSymbol) {
          try {
            igStreamingService.unsubscribeFromChartData(selectedSymbol, timeFrame, chartUpdateCallback);
            igStreamingService.unsubscribeFromOrderBook(selectedSymbol);
          } catch (error) {
            console.warn('Error unsubscribing from data:', error);
            // Errors during unsubscribe are not critical
          }
        }
      };
    } catch (error) {
      console.error('Failed to subscribe to data:', error);
      // Don't enable offline mode here, just use the mock data we already loaded
      setIsLoading(false);
    }
  }, [selectedSymbol, timeFrame, generateMockChartData, generateMockOrderBook]);

  // Effect to update data when timeframe changes
  useEffect(() => {
    if (selectedSymbol) {
      console.log(`Subscribing to chart data for ${selectedSymbol} with timeframe ${timeFrame}`);
      
      // Track if component is mounted to prevent state updates after unmount
      let isMounted = true;
      
      // Subscribe to chart data with the new timeframe
      const chartUpdateCallback = (update: any) => {
        if (!isMounted) return;
        
        try {
          // Create a data point from the update
          const dataPoint: ChartDataPoint = {
            date: update.timestamp,
            price: update.closePrice,
            open: update.openPrice,
            high: update.highPrice,
            low: update.lowPrice,
            volume: update.lastTradedVolume
          };
          
          // Update chart data, keeping the last 100 points for smoother charts
          setChartData(prev => {
            const newData = [...prev, dataPoint];
            // Keep last 100 points for better chart visualization
            return newData.slice(-100);
          });
          
          // Update last price for display
          if (update.closePrice > 0) {
            setLastPrice(update.closePrice);
          }
          
          // Update loading state if needed
          if (isLoading) {
            setIsLoading(false);
          }
        } catch (error) {
          console.error(`Error processing chart update for ${selectedSymbol}:`, error);
        }
      };
      
      igStreamingService.subscribeToChartData(selectedSymbol, timeFrame, chartUpdateCallback);
      
      // Clean up previous subscription
      return () => {
        console.log(`Unsubscribing from chart data for ${selectedSymbol} with timeframe ${timeFrame}`);
        igStreamingService.unsubscribeFromChartData(selectedSymbol, timeFrame, chartUpdateCallback);
        isMounted = false;
      };
    }
  }, [timeFrame, selectedSymbol, isLoading]);

  // Helper function to update order book entries
  const updateOrderBookEntries = (entries: OrderBookEntry[], newEntry: OrderBookEntry): OrderBookEntry[] => {
    const existingIndex = entries.findIndex(e => e.price === newEntry.price);
    if (existingIndex >= 0) {
      // Update existing entry
      const updatedEntries = [...entries];
      updatedEntries[existingIndex] = newEntry;
      return updatedEntries;
    } else {
      // Add new entry and sort
      const updatedEntries = [...entries, newEntry];
      return updatedEntries.sort((a, b) => b.price - a.price);
    }
  };

  // Helper function to map IG epics to friendly display names
  const getDisplayNameForEpic = (epic: string): string => {
    const epicMap: Record<string, string> = {
      // Stocks/Indices
      'IX.D.FTSE.DAILY.IP': 'FTSE 100',
      'IX.D.DOW.DAILY.IP': 'Dow Jones',
      'IX.D.NASDAQ.DAILY.IP': 'NASDAQ',
      'IX.D.DAX.DAILY.IP': 'DAX',
      'IX.D.SPTRD.DAILY.IP': 'S&P 500',
      'IX.D.ASX.DAILY.IP': 'ASX 200',
      
      // Cryptocurrencies
      'CS.D.BITCOIN.TODAY.IP': 'BTC/USD',
      'CS.D.ETHUSD.TODAY.IP': 'ETH/USD',
      'CS.D.RIPPLE.TODAY.IP': 'XRP/USD',
      'CS.D.BCHUSD.TODAY.IP': 'BCH/USD',
      'CS.D.LTCUSD.TODAY.IP': 'LTC/USD',
      'CS.D.DOTUSD.TODAY.IP': 'DOT/USD',
      
      // Forex
      'CS.D.EURUSD.TODAY.IP': 'EUR/USD',
      'CS.D.GBPUSD.TODAY.IP': 'GBP/USD',
      'CS.D.USDJPY.TODAY.IP': 'USD/JPY',
      'CS.D.AUDUSD.TODAY.IP': 'AUD/USD',
      'CS.D.USDCAD.TODAY.IP': 'USD/CAD',
      'CS.D.USDCHF.TODAY.IP': 'USD/CHF'
    };
    
    return epicMap[epic] || epic;
  };

  // Effect to handle initialization when component mounts
  useEffect(() => {
    const initializeStreaming = async () => {
      try {
        setIsLoading(true);
        setStreamError(null);
        
        // Check if we're in offline mode
        if (settingsStore.offlineMode) {
          console.log('Offline mode enabled in settings, skipping streaming initialization');
          setIsOfflineMode(true);
          setIsLoading(false);
          return;
        }
        
        // Get credentials for streaming
        const credentials = await igAuthService.getCredentials();
        
        if (!credentials) {
          console.error('Failed to get IG credentials');
          setStreamError('Failed to get IG credentials');
          setIsOfflineMode(true);
          setIsLoading(false);
          return;
        }
        
        // Get the streaming endpoint from the connectivity test
        const streamingTestResponse = await igConnectivityTest.testConnection();
        
        if (!streamingTestResponse || !streamingTestResponse.lightstreamerEndpoint) {
          console.error('Failed to get streaming endpoint');
          setStreamError('Failed to get streaming endpoint');
          setIsOfflineMode(true);
          setIsLoading(false);
          return;
        }
        
        // Initialize the streaming service
        await igStreamingService.initialize(
          credentials.cst,
          credentials.securityToken,
          credentials.accountId,
          streamingTestResponse.lightstreamerEndpoint
        );
        
        setIsOfflineMode(!igStreamingService.getConnectionStatus());
        setIsLoading(false);
        
        // Load market data
        loadMarketData();
      } catch (error) {
        console.error('Error initializing streaming service:', error);
        setStreamError(error instanceof Error ? error.message : String(error));
        setIsOfflineMode(true);
        setIsLoading(false);
        
        // Still load market data in offline mode
        loadMarketData();
      }
    };
    
    initializeStreaming();
    
    // Clean up on unmount
    return () => {
      // Use disconnect method
      if (igStreamingService.getConnectionStatus()) {
        // Only attempt to disconnect if we're connected
        try {
          // Unsubscribe from all subscriptions
          if (selectedSymbol) {
            igStreamingService.unsubscribeFromChartData(selectedSymbol, timeFrame, () => {});
            igStreamingService.unsubscribeFromOrderBook(selectedSymbol);
          }
        } catch (error) {
          console.warn('Error during cleanup:', error);
        }
      }
    };
  }, [settingsStore.offlineMode, loadMarketData, selectedSymbol, timeFrame]);

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
    handleRetry,
    enableOfflineMode,
    lastPrice
  };
};
