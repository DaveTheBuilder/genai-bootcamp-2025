import { LightstreamerClient, Subscription } from 'lightstreamer-client-web';

export interface MarketUpdate {
  epic: string;
  marketId: string;
  bid: number;
  offer: number;
  high: number;
  low: number;
  change: number;
  changePct: number;
  updateTime: string;
  marketState: string;
  marketDelay: number;
  midOpen: number;
  timestamp: string;
}

export interface ChartUpdate {
  epic: string;
  chartId: string;
  resolution: string;
  openPrice: number;
  closePrice: number;
  highPrice: number;
  lowPrice: number;
  lastTradedVolume: number;
  timestamp: string;
}

export interface OrderBookUpdate {
  epic: string;
  timestamp: string;
  level: number;
  bidPrice: number;
  bidSize: number;
  offerPrice: number;
  offerSize: number;
}

// New types for enhanced features
export interface VolumeProfileUpdate {
  epic: string;
  priceLevel: number;
  volume: number;
  buyVolume: number;
  sellVolume: number;
  timestamp: string;
}

export interface MultiTimeframeUpdate {
  epic: string;
  updates: {
    [timeframe: string]: ChartUpdate;
  };
  correlations: {
    [timeframe: string]: number;
  };
}

export interface OrderFlowUpdate {
  epic: string;
  timestamp: string;
  tradeSize: number;
  price: number;
  side: 'BUY' | 'SELL';
  aggressor: 'BUYER' | 'SELLER';
  clusterId?: number;
  isLargeOrder: boolean;
}

export interface MarketDepthUpdate {
  epic: string;
  timestamp: string;
  depth: Array<{
    level: number;
    bidPrice: number;
    bidSize: number;
    offerPrice: number;
    offerSize: number;
  }>;
  aggregatedLiquidity: {
    buyLiquidity: number;
    sellLiquidity: number;
    imbalanceRatio: number;
  };
}

// Callback types
export type MarketUpdateCallback = (update: MarketUpdate) => void;
export type ChartUpdateCallback = (update: ChartUpdate) => void;
export type OrderBookUpdateCallback = (update: OrderBookUpdate) => void;
export type VolumeProfileCallback = (update: VolumeProfileUpdate) => void;
export type MultiTimeframeCallback = (update: MultiTimeframeUpdate) => void;
export type OrderFlowCallback = (update: OrderFlowUpdate) => void;
export type MarketDepthCallback = (update: MarketDepthUpdate) => void;

// Type declarations for Lightstreamer client
declare global {
  interface Window {
    LightstreamerClient: any;
    Subscription: any;
  }
}
