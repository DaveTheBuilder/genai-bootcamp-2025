// chartDataFix.ts - Helper functions for consistent chart data generation
import { ChartUpdate } from './igStreamingTypes';

// Map of timeframes to milliseconds for simulation
export const TIMEFRAME_INTERVALS: Record<string, number> = {
  'SECOND': 1000,
  'MINUTE': 60 * 1000,
  'MINUTE_5': 5 * 60 * 1000,
  'MINUTE_15': 15 * 60 * 1000,
  'MINUTE_30': 30 * 60 * 1000,
  'HOUR': 60 * 60 * 1000,
  'HOUR_4': 4 * 60 * 60 * 1000,
  'DAY': 24 * 60 * 60 * 1000,
  'WEEK': 7 * 24 * 60 * 60 * 1000,
  'MONTH': 30 * 24 * 60 * 60 * 1000
};

// Helper function to get base price for a symbol (for consistent mock data)
export const getBasePrice = (epic: string): number => {
  // Map epics to consistent base prices
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
  
  return priceMap[epic] || 100 + Math.random() * 10; // Return mapped price or random fallback
};

// Track price trends for each epic
export const priceTrends: Record<string, { 
  currentPrice: number, 
  direction: number, 
  momentum: number,
  lastUpdate: number,
  history: Array<{
    timestamp: number,
    price: number,
    volume: number
  }>
}> = {};

// Get volatility factor based on market type
export const getVolatilityFactor = (epic: string): number => {
  // Higher volatility for crypto, lower for indices
  if (epic.startsWith('CS.')) {
    return 0.002 + Math.random() * 0.004; // 0.2% to 0.6% for crypto
  } else if (epic.startsWith('IX.')) {
    return 0.0005 + Math.random() * 0.001; // 0.05% to 0.15% for indices
  } else {
    return 0.001 + Math.random() * 0.002; // 0.1% to 0.3% for others
  }
};

// Get a consistent chart update for an epic
export const getConsistentChartUpdate = (epic: string, resolution: string): ChartUpdate => {
  // Get or initialize price trend for this epic
  if (!priceTrends[epic]) {
    const basePrice = getBasePrice(epic);
    priceTrends[epic] = {
      currentPrice: basePrice,
      direction: Math.random() > 0.5 ? 1 : -1,
      momentum: getVolatilityFactor(epic),
      lastUpdate: Date.now(),
      history: [{
        timestamp: Date.now(),
        price: basePrice,
        volume: Math.floor(Math.random() * 10000)
      }]
    };
  }
  
  const trend = priceTrends[epic];
  const now = Date.now();
  
  // Occasionally change direction (10% chance)
  if (Math.random() < 0.1) {
    trend.direction *= -1;
    trend.momentum = getVolatilityFactor(epic);
  }
  
  // Calculate price movement based on time elapsed and resolution
  const timeFactor = Math.min((now - trend.lastUpdate) / 1000, 5); // Cap at 5 seconds
  
  // Adjust movement based on timeframe - longer timeframes have more movement
  const timeframeMultiplier = getTimeframeMultiplier(resolution);
  const movement = trend.currentPrice * trend.momentum * trend.direction * timeFactor * timeframeMultiplier;
  
  // Update the current price
  trend.currentPrice += movement;
  trend.lastUpdate = now;
  
  // Ensure price doesn't go negative
  trend.currentPrice = Math.max(trend.currentPrice, 0.01);
  
  // Add to history
  const volume = Math.floor(Math.random() * 10000 * timeframeMultiplier);
  trend.history.push({
    timestamp: now,
    price: trend.currentPrice,
    volume
  });
  
  // Keep history limited to 100 points
  if (trend.history.length > 100) {
    trend.history = trend.history.slice(-100);
  }
  
  // Calculate high/low based on current price and recent history
  const recentHistory = getRecentHistory(trend.history, resolution);
  const highPrice = Math.max(...recentHistory.map(h => h.price), trend.currentPrice);
  const lowPrice = Math.min(...recentHistory.map(h => h.price), trend.currentPrice);
  
  // Format the timestamp based on resolution
  const timestamp = formatTimestampForResolution(now, resolution);
  
  return {
    epic,
    chartId: `${epic}:${resolution}`,
    resolution,
    openPrice: parseFloat(recentHistory[0]?.price.toFixed(4) || (trend.currentPrice - movement).toFixed(4)),
    closePrice: parseFloat(trend.currentPrice.toFixed(4)),
    highPrice: parseFloat(highPrice.toFixed(4)),
    lowPrice: parseFloat(Math.max(lowPrice, 0.01).toFixed(4)),
    lastTradedVolume: volume,
    timestamp
  };
};

// Get a multiplier for price movement based on timeframe
const getTimeframeMultiplier = (resolution: string): number => {
  const upperResolution = resolution.toUpperCase();
  
  if (upperResolution.includes('SECOND')) return 0.5;
  if (upperResolution.includes('MINUTE')) {
    if (upperResolution.includes('5')) return 1.2;
    if (upperResolution.includes('15')) return 1.5;
    if (upperResolution.includes('30')) return 1.8;
    return 1.0;
  }
  if (upperResolution.includes('HOUR')) {
    if (upperResolution.includes('4')) return 2.5;
    return 2.0;
  }
  if (upperResolution.includes('DAY')) return 3.0;
  if (upperResolution.includes('WEEK')) return 4.0;
  if (upperResolution.includes('MONTH')) return 5.0;
  
  return 1.0; // Default multiplier
};

// Get recent history relevant to the current resolution
const getRecentHistory = (history: Array<{timestamp: number, price: number, volume: number}>, resolution: string): Array<{timestamp: number, price: number, volume: number}> => {
  const now = Date.now();
  const upperResolution = resolution.toUpperCase();
  let timeWindow = 60 * 1000; // Default to 1 minute
  
  // Set time window based on resolution
  if (upperResolution.includes('SECOND')) timeWindow = 10 * 1000; // 10 seconds
  else if (upperResolution.includes('MINUTE')) {
    if (upperResolution.includes('5')) timeWindow = 5 * 60 * 1000;
    else if (upperResolution.includes('15')) timeWindow = 15 * 60 * 1000;
    else if (upperResolution.includes('30')) timeWindow = 30 * 60 * 1000;
    else timeWindow = 60 * 1000;
  }
  else if (upperResolution.includes('HOUR')) {
    if (upperResolution.includes('4')) timeWindow = 4 * 60 * 60 * 1000;
    else timeWindow = 60 * 60 * 1000;
  }
  else if (upperResolution.includes('DAY')) timeWindow = 24 * 60 * 60 * 1000;
  else if (upperResolution.includes('WEEK')) timeWindow = 7 * 24 * 60 * 60 * 1000;
  else if (upperResolution.includes('MONTH')) timeWindow = 30 * 24 * 60 * 60 * 1000;
  
  // Filter history to include only points within the time window
  const recentHistory = history.filter(h => (now - h.timestamp) <= timeWindow);
  
  // If we don't have enough history, return what we have
  if (recentHistory.length < 2) return history.slice(-2);
  
  return recentHistory;
};

// Format timestamp based on resolution
const formatTimestampForResolution = (timestamp: number, resolution: string): string => {
  const date = new Date(timestamp);
  const upperResolution = resolution.toUpperCase();
  
  // For resolutions less than a day, round to the appropriate interval
  if (upperResolution.includes('SECOND')) {
    // Round to the nearest second
    date.setMilliseconds(0);
  } else if (upperResolution.includes('MINUTE')) {
    // Round to the nearest minute or multi-minute interval
    date.setSeconds(0);
    date.setMilliseconds(0);
    
    if (upperResolution.includes('5')) {
      const minutes = date.getMinutes();
      date.setMinutes(Math.floor(minutes / 5) * 5);
    } else if (upperResolution.includes('15')) {
      const minutes = date.getMinutes();
      date.setMinutes(Math.floor(minutes / 15) * 15);
    } else if (upperResolution.includes('30')) {
      const minutes = date.getMinutes();
      date.setMinutes(Math.floor(minutes / 30) * 30);
    }
  } else if (upperResolution.includes('HOUR')) {
    // Round to the nearest hour or multi-hour interval
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    
    if (upperResolution.includes('4')) {
      const hours = date.getHours();
      date.setHours(Math.floor(hours / 4) * 4);
    }
  } else if (upperResolution.includes('DAY')) {
    // Round to the start of the day
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
  } else if (upperResolution.includes('WEEK')) {
    // Round to the start of the week (Sunday)
    const day = date.getDay();
    date.setDate(date.getDate() - day);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
  } else if (upperResolution.includes('MONTH')) {
    // Round to the start of the month
    date.setDate(1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
  }
  
  return date.toISOString();
};

// Get a consistent order book update for an epic
export const getConsistentOrderBookUpdate = (epic: string): any => {
  // Use the same base price as the chart for consistency
  const trend = priceTrends[epic];
  const basePrice = trend ? trend.currentPrice : getBasePrice(epic);
  
  // Create a realistic spread
  const spreadPercentage = 0.0005; // 0.05% spread
  const spread = basePrice * spreadPercentage;
  
  return {
    epic,
    timestamp: new Date().toISOString(),
    level: 1,
    bidPrice: parseFloat((basePrice - spread).toFixed(4)),
    bidSize: Math.floor(Math.random() * 1000) + 100,
    offerPrice: parseFloat((basePrice + spread).toFixed(4)),
    offerSize: Math.floor(Math.random() * 1000) + 100
  };
};

// Convert raw chart data to a format suitable for charting libraries
export const convertChartUpdateToChartData = (update: ChartUpdate): any => {
  return {
    time: new Date(update.timestamp).getTime(),
    open: update.openPrice,
    high: update.highPrice,
    low: update.lowPrice,
    close: update.closePrice,
    volume: update.lastTradedVolume
  };
};

// Normalize resolution string to a standard format
export const normalizeResolution = (resolution: string): string => {
  const upperRes = resolution.toUpperCase();
  
  // Map common resolution formats to our standard format
  if (upperRes === 'M1' || upperRes === '1M' || upperRes === '1') return 'MINUTE';
  if (upperRes === 'M5' || upperRes === '5M' || upperRes === '5') return 'MINUTE_5';
  if (upperRes === 'M15' || upperRes === '15M' || upperRes === '15') return 'MINUTE_15';
  if (upperRes === 'M30' || upperRes === '30M' || upperRes === '30') return 'MINUTE_30';
  if (upperRes === 'H1' || upperRes === '1H' || upperRes === '60') return 'HOUR';
  if (upperRes === 'H4' || upperRes === '4H' || upperRes === '240') return 'HOUR_4';
  if (upperRes === 'D1' || upperRes === '1D' || upperRes === 'DAY' || upperRes === 'DAILY') return 'DAY';
  if (upperRes === 'W1' || upperRes === '1W' || upperRes === 'WEEK' || upperRes === 'WEEKLY') return 'WEEK';
  if (upperRes === 'MN' || upperRes === '1MN' || upperRes === 'MONTH' || upperRes === 'MONTHLY') return 'MONTH';
  
  // If we can't normalize, return the original
  return resolution;
};
