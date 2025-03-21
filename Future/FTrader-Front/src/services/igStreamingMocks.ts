import { MarketUpdate, ChartUpdate, OrderBookUpdate, VolumeProfileUpdate, MultiTimeframeUpdate, OrderFlowUpdate, MarketDepthUpdate } from './igStreamingTypes';
import { TIMEFRAME_RESOLUTIONS } from './igStreamingFields';

export const generateMockMarketUpdate = (epic: string): MarketUpdate => {
  const basePrice = 100 + Math.random() * 10;
  const change = (Math.random() - 0.5) * 5; // Increased volatility for better visualization
  const changePercent = (change / basePrice) * 100;
  
  return {
    epic,
    marketId: epic,
    bid: parseFloat((basePrice - 0.5).toFixed(2)),
    offer: parseFloat((basePrice + 0.5).toFixed(2)),
    high: parseFloat((basePrice + 2).toFixed(2)),
    low: parseFloat((basePrice - 2).toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePct: parseFloat(changePercent.toFixed(2)),
    updateTime: new Date().toISOString(),
    marketState: 'TRADEABLE',
    marketDelay: 0,
    midOpen: parseFloat(basePrice.toFixed(2)),
    timestamp: new Date().toISOString()
  };
};

export const generateMockChartUpdate = (epic: string, resolution: string): ChartUpdate => {
  const basePrice = Math.random() * 1000 + 50;
  const range = basePrice * 0.05; // 5% range for better visualization
  
  return {
    epic,
    chartId: `${epic}:${resolution}`,
    resolution,
    openPrice: parseFloat((basePrice - range/2).toFixed(2)),
    closePrice: parseFloat(basePrice.toFixed(2)),
    highPrice: parseFloat((basePrice + range).toFixed(2)),
    lowPrice: parseFloat((basePrice - range).toFixed(2)),
    lastTradedVolume: Math.floor(Math.random() * 10000),
    timestamp: new Date().toISOString()
  };
};

export const generateMockOrderBookUpdate = (epic: string): OrderBookUpdate => {
  const basePrice = Math.random() * 1000 + 50;
  
  return {
    epic,
    timestamp: new Date().toISOString(),
    level: 1,
    bidPrice: parseFloat((basePrice - 0.5).toFixed(2)),
    bidSize: Math.floor(Math.random() * 1000),
    offerPrice: parseFloat((basePrice + 0.5).toFixed(2)),
    offerSize: Math.floor(Math.random() * 1000)
  };
};

// New mock data generators for enhanced features
export const generateMockVolumeProfile = (epic: string): VolumeProfileUpdate => {
  const basePrice = Math.random() * 1000 + 50;
  const totalVolume = Math.floor(Math.random() * 10000);
  const buyVolume = Math.floor(totalVolume * (0.4 + Math.random() * 0.2)); // 40-60% buy volume
  
  return {
    epic,
    priceLevel: parseFloat(basePrice.toFixed(2)),
    volume: totalVolume,
    buyVolume,
    sellVolume: totalVolume - buyVolume,
    timestamp: new Date().toISOString()
  };
};

export const generateMockMultiTimeframe = (epic: string): MultiTimeframeUpdate => {
  const updates: { [key: string]: ChartUpdate } = {};
  const correlations: { [key: string]: number } = {};
  
  Object.keys(TIMEFRAME_RESOLUTIONS).forEach(timeframe => {
    updates[timeframe] = generateMockChartUpdate(epic, timeframe);
    correlations[timeframe] = parseFloat((0.5 + Math.random() * 0.5).toFixed(2)); // 0.5-1.0 correlation
  });
  
  return {
    epic,
    updates,
    correlations
  };
};

export const generateMockOrderFlow = (epic: string): OrderFlowUpdate => {
  const basePrice = Math.random() * 1000 + 50;
  const tradeSize = Math.floor(Math.random() * 10000);
  const isLargeOrder = tradeSize > 5000;
  
  return {
    epic,
    timestamp: new Date().toISOString(),
    tradeSize,
    price: parseFloat(basePrice.toFixed(2)),
    side: Math.random() > 0.5 ? 'BUY' : 'SELL',
    aggressor: Math.random() > 0.5 ? 'BUYER' : 'SELLER',
    clusterId: isLargeOrder ? Math.floor(Math.random() * 100) : undefined,
    isLargeOrder
  };
};

export const generateMockMarketDepth = (epic: string): MarketDepthUpdate => {
  const basePrice = Math.random() * 1000 + 50;
  const depth: Array<{
    level: number;
    bidPrice: number;
    bidSize: number;
    offerPrice: number;
    offerSize: number;
  }> = [];
  
  let totalBuyLiquidity = 0;
  let totalSellLiquidity = 0;
  
  // Generate 10 levels of depth
  for (let i = 0; i < 10; i++) {
    const spread = (i + 1) * 0.1; // Increasing spread at each level
    const bidSize = Math.floor(Math.random() * 1000);
    const offerSize = Math.floor(Math.random() * 1000);
    
    depth.push({
      level: i + 1,
      bidPrice: parseFloat((basePrice - spread).toFixed(2)),
      bidSize,
      offerPrice: parseFloat((basePrice + spread).toFixed(2)),
      offerSize
    });
    
    totalBuyLiquidity += bidSize;
    totalSellLiquidity += offerSize;
  }
  
  const imbalanceRatio = parseFloat((totalBuyLiquidity / totalSellLiquidity).toFixed(3));
  
  return {
    epic,
    timestamp: new Date().toISOString(),
    depth,
    aggregatedLiquidity: {
      buyLiquidity: totalBuyLiquidity,
      sellLiquidity: totalSellLiquidity,
      imbalanceRatio
    }
  };
};
