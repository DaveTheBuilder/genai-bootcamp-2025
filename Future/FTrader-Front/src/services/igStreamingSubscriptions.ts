import { Subscription } from 'lightstreamer-client-web';
import {
  MarketUpdateCallback, ChartUpdateCallback,
  OrderBookUpdateCallback, VolumeProfileCallback,
  MultiTimeframeCallback, OrderFlowCallback,
  MarketDepthCallback
} from './igStreamingTypes';

export interface SubscriptionManager {
  subscriptions: Map<string, Subscription>;
  callbacks: Map<string, any[]>;
  intervals: Map<string, NodeJS.Timeout>;
}

export interface SubscriptionManagers {
  market: SubscriptionManager;
  chart: SubscriptionManager;
  orderBook: SubscriptionManager;
  volumeProfile: SubscriptionManager;
  multiTimeframe: SubscriptionManager;
  orderFlow: SubscriptionManager;
  marketDepth: SubscriptionManager;
}

export function createSubscriptionManager(): SubscriptionManager {
  return {
    subscriptions: new Map(),
    callbacks: new Map(),
    intervals: new Map()
  };
}

export function createSubscriptionManagers(): SubscriptionManagers {
  return {
    market: createSubscriptionManager(),
    chart: createSubscriptionManager(),
    orderBook: createSubscriptionManager(),
    volumeProfile: createSubscriptionManager(),
    multiTimeframe: createSubscriptionManager(),
    orderFlow: createSubscriptionManager(),
    marketDepth: createSubscriptionManager()
  };
}
