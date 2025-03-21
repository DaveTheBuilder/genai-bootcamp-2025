import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
// Comment out or remove the problematic imports until they're properly implemented
// import { useIgStreamingService } from '@/hooks/useIgStreamingService';
// import { useMarketDataStream } from '@/hooks/useMarketDataStream';

// Types
export interface Strategy {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft' | 'backtest';
  signals: SignalConfig[];
  executionRules: ExecutionRules;
  riskControls: RiskControls;
  performance?: StrategyPerformance;
  createdAt: Date;
  updatedAt: Date;
}

export interface SignalConfig {
  id: string;
  name: string;
  source: 'pattern' | 'sentiment' | 'orderflow' | 'regime' | 'custom';
  direction: 'long' | 'short' | 'both';
  parameters: Record<string, any>;
  confirmations: SignalConfirmation[];
}

export interface SignalConfirmation {
  source: string;
  condition: string;
  value: any;
}

export interface ExecutionRules {
  orderType: 'market' | 'limit' | 'stop';
  positionSizing: {
    type: 'fixed' | 'percent' | 'risk';
    value: number;
  };
  timeRestrictions: {
    tradingHours: {
      start: string;
      end: string;
    };
    daysToAvoid: string[];
  };
  entryConditions: Record<string, any>;
  exitConditions: Record<string, any>;
}

export interface RiskControls {
  maxPositionSize: number;
  maxDrawdown: number;
  stopLoss: {
    type: 'fixed' | 'percent' | 'atr';
    value: number;
  };
  takeProfit: {
    type: 'fixed' | 'percent' | 'riskRatio';
    value: number;
  };
  maxOpenPositions: number;
}

export interface StrategyPerformance {
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  totalTrades: number;
  netProfit: number;
  averageTrade: number;
  equityCurve: [number, number][]; // [timestamp, value]
}

export interface Signal {
  id: string;
  strategyId: string;
  timestamp: Date;
  source: string;
  direction: 'long' | 'short' | 'exit';
  strength: number; // 0-100
  instrument: string;
  parameters: Record<string, any>;
  status: 'pending' | 'confirmed' | 'rejected' | 'executed';
}

export interface Order {
  id: string;
  strategyId: string;
  signalId: string;
  instrument: string;
  direction: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop';
  quantity: number;
  price?: number;
  status: 'pending' | 'submitted' | 'filled' | 'partial' | 'cancelled' | 'rejected';
  submittedAt: Date;
  updatedAt: Date;
  executionDetails?: {
    filledQuantity: number;
    averagePrice: number;
    fees: number;
  };
}

export interface Position {
  id: string;
  strategyId: string;
  instrument: string;
  direction: 'long' | 'short';
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  currentValue: number;
  openedAt: Date;
  updatedAt: Date;
  relatedOrders: string[]; // Order IDs
}

export interface SignalSource {
  id: string;
  name: string;
  type: 'pattern' | 'sentiment' | 'orderflow' | 'regime' | 'custom';
  isEnabled: boolean;
  description: string;
  parameters: Record<string, any>;
}

// Context interface
interface AutomationContextType {
  strategies: Strategy[];
  signals: Signal[];
  orders: Order[];
  positions: Position[];
  signalSources: SignalSource[];
  isSimulationMode: boolean;
  isProcessingActive: boolean;
  addStrategy: (strategy: Omit<Strategy, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateStrategy: (id: string, updates: Partial<Strategy>) => void;
  deleteStrategy: (id: string) => void;
  activateStrategy: (id: string) => void;
  deactivateStrategy: (id: string) => void;
  pauseStrategy: (id: string) => void;
  processSignal: (signal: Omit<Signal, 'id' | 'timestamp' | 'status'>) => void;
  executeOrder: (order: Omit<Order, 'id' | 'submittedAt' | 'updatedAt' | 'status'>) => void;
  toggleSimulationMode: () => void;
  toggleProcessing: () => void;
  clearAllData: () => void;
  enableSignalSource: (id: string) => void;
  disableSignalSource: (id: string) => void;
  getStrategyPerformance: (id: string, timeframe: string) => StrategyPerformance | undefined;
}

// Create context with default values
const AutomationContext = createContext<AutomationContextType | undefined>(undefined);

// Provider component
export const AutomationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [signalSources, setSignalSources] = useState<SignalSource[]>([
    {
      id: 'pattern-recognition',
      name: 'Pattern Recognition',
      type: 'pattern',
      isEnabled: true,
      description: 'Detects chart patterns like head and shoulders, double tops, etc.',
      parameters: { sensitivity: 75, patterns: ['doubleTop', 'doubleBottom', 'headAndShoulders'] }
    },
    {
      id: 'sentiment-analysis',
      name: 'Sentiment Analysis',
      type: 'sentiment',
      isEnabled: true,
      description: 'Analyzes news and social media sentiment for trading signals',
      parameters: { sources: ['twitter', 'reddit', 'news'], threshold: 0.65 }
    },
    {
      id: 'order-flow',
      name: 'Order Flow Analysis',
      type: 'orderflow',
      isEnabled: true,
      description: 'Analyzes market depth and volume for trading signals',
      parameters: { volumeThreshold: 1000000, depthLevels: 5 }
    },
    {
      id: 'market-regime',
      name: 'Market Regime Detection',
      type: 'regime',
      isEnabled: true,
      description: 'Identifies market regimes like trending, ranging, or volatile',
      parameters: { lookbackPeriod: 20, volatilityThreshold: 1.5 }
    }
  ]);
  const [isSimulationMode, setIsSimulationMode] = useState(true);
  const [isProcessingActive, setIsProcessingActive] = useState(false);
  
  const { toast } = useToast();
  // Comment out the IG API related hooks until they're properly implemented
  // const igStreamingService = useIgStreamingService();
  // const { isConnected, isOfflineMode } = useMarketDataStream();
  
  // For now, assume we're always connected for demo purposes
  const isConnected = true;

  // Initialize from local storage
  useEffect(() => {
    const loadedStrategies = localStorage.getItem('automation-strategies');
    if (loadedStrategies) {
      try {
        setStrategies(JSON.parse(loadedStrategies));
      } catch (error) {
        console.error('Failed to load strategies from local storage', error);
      }
    }
  }, []);

  // Save strategies to local storage when updated
  useEffect(() => {
    if (strategies.length > 0) {
      localStorage.setItem('automation-strategies', JSON.stringify(strategies));
    }
  }, [strategies]);

  // Strategy management
  const addStrategy = useCallback((strategyData: Omit<Strategy, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `strategy-${Date.now()}`;
    const newStrategy: Strategy = {
      ...strategyData,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setStrategies(prev => [...prev, newStrategy]);
    toast({
      title: "Strategy Created",
      description: `${newStrategy.name} has been created successfully.`
    });
    
    return id;
  }, [toast]);

  const updateStrategy = useCallback((id: string, updates: Partial<Strategy>) => {
    setStrategies(prev => 
      prev.map(strategy => 
        strategy.id === id 
          ? { ...strategy, ...updates, updatedAt: new Date() } 
          : strategy
      )
    );
    
    toast({
      title: "Strategy Updated",
      description: `Strategy has been updated successfully.`
    });
  }, [toast]);

  const deleteStrategy = useCallback((id: string) => {
    setStrategies(prev => prev.filter(strategy => strategy.id !== id));
    
    toast({
      title: "Strategy Deleted",
      description: `Strategy has been removed from your account.`
    });
  }, [toast]);

  const activateStrategy = useCallback((id: string) => {
    if (!isConnected && !isSimulationMode) {
      toast({
        title: "Connection Error",
        description: "Cannot activate strategy without market data connection. Enable simulation mode or connect to market data.",
        variant: "destructive"
      });
      return;
    }
    
    setStrategies(prev => 
      prev.map(strategy => 
        strategy.id === id 
          ? { ...strategy, status: 'active', updatedAt: new Date() } 
          : strategy
      )
    );
    
    toast({
      title: "Strategy Activated",
      description: `Strategy is now active and will generate signals.`
    });
  }, [isConnected, isSimulationMode, toast]);

  const deactivateStrategy = useCallback((id: string) => {
    setStrategies(prev => 
      prev.map(strategy => 
        strategy.id === id 
          ? { ...strategy, status: 'paused', updatedAt: new Date() } 
          : strategy
      )
    );
    toast({
      title: "Strategy Deactivated",
      description: `Strategy has been deactivated.`
    });
  }, [toast]);

  const pauseStrategy = useCallback((id: string) => {
    setStrategies(prev => 
      prev.map(strategy => 
        strategy.id === id 
          ? { ...strategy, status: 'paused', updatedAt: new Date() } 
          : strategy
      )
    );
    
    toast({
      title: "Strategy Paused",
      description: `Strategy has been paused and will not generate signals.`
    });
  }, [toast]);

  // Signal processing
  const processSignal = useCallback((signalData: Omit<Signal, 'id' | 'timestamp' | 'status'>) => {
    const id = `signal-${Date.now()}`;
    const newSignal: Signal = {
      ...signalData,
      id,
      timestamp: new Date(),
      status: 'pending'
    };
    
    setSignals(prev => [...prev, newSignal]);
    
    // Find the strategy this signal belongs to
    const strategy = strategies.find(s => s.id === signalData.strategyId);
    
    if (!strategy) {
      console.error(`Strategy not found for signal: ${id}`);
      return;
    }
    
    if (strategy.status !== 'active') {
      console.log(`Signal received for inactive strategy: ${strategy.name}`);
      return;
    }
    
    // In a real implementation, we would validate the signal against strategy rules
    // and potentially create orders based on the signal
    
    // For now, we'll just update the signal status to 'confirmed'
    setTimeout(() => {
      setSignals(prev => 
        prev.map(signal => 
          signal.id === id 
            ? { ...signal, status: 'confirmed' } 
            : signal
        )
      );
      
      toast({
        title: "Signal Confirmed",
        description: `New ${signalData.direction} signal for ${signalData.instrument} confirmed.`
      });
    }, 1500);
  }, [strategies, toast]);

  // Order execution
  const executeOrder = useCallback((orderData: Omit<Order, 'id' | 'submittedAt' | 'updatedAt' | 'status'>) => {
    const id = `order-${Date.now()}`;
    const newOrder: Order = {
      ...orderData,
      id,
      status: 'pending',
      submittedAt: new Date(),
      updatedAt: new Date()
    };
    
    setOrders(prev => [...prev, newOrder]);
    
    // In simulation mode, we'll simulate order execution
    if (isSimulationMode) {
      // Simulate order submission
      setTimeout(() => {
        setOrders(prev => 
          prev.map(order => 
            order.id === id 
              ? { ...order, status: 'submitted', updatedAt: new Date() } 
              : order
          )
        );
      }, 1000);
      
      // Simulate order fill
      setTimeout(() => {
        setOrders(prev => 
          prev.map(order => 
            order.id === id 
              ? { 
                  ...order, 
                  status: 'filled', 
                  updatedAt: new Date(),
                  executionDetails: {
                    filledQuantity: order.quantity,
                    averagePrice: order.price || 0,
                    fees: order.quantity * 0.001 // Simulated fees
                  }
                } 
              : order
          )
        );
        
        // Create a position based on the filled order
        const filledOrder = orders.find(o => o.id === id);
        if (filledOrder) {
          const newPosition: Position = {
            id: `position-${Date.now()}`,
            strategyId: filledOrder.strategyId,
            instrument: filledOrder.instrument,
            direction: filledOrder.direction === 'buy' ? 'long' : 'short',
            quantity: filledOrder.quantity,
            entryPrice: filledOrder.price || 0,
            currentPrice: filledOrder.price || 0,
            unrealizedPnL: 0,
            unrealizedPnLPercent: 0,
            currentValue: 0,
            openedAt: new Date(),
            updatedAt: new Date(),
            relatedOrders: [id]
          };
          
          setPositions(prev => [...prev, newPosition]);
        }
        
        toast({
          title: "Order Filled",
          description: `${orderData.direction === 'buy' ? 'Buy' : 'Sell'} order for ${orderData.instrument} has been filled.`
        });
      }, 3000);
    } else {
      // In real mode, we would connect to the IG API to place the order
      // This is where we would integrate with the IG API
      toast({
        title: "Real Trading Not Implemented",
        description: "Real trading functionality is not yet implemented. Switch to simulation mode.",
        variant: "destructive"
      });
    }
  }, [isSimulationMode, orders, toast]);

  // Toggle simulation mode
  const toggleSimulationMode = useCallback(() => {
    setIsSimulationMode(prev => !prev);
    
    toast({
      title: `Simulation Mode ${!isSimulationMode ? 'Enabled' : 'Disabled'}`,
      description: `Trading will now be performed in ${!isSimulationMode ? 'simulation' : 'real'} mode.`
    });
  }, [isSimulationMode, toast]);

  // Toggle signal processing
  const toggleProcessing = useCallback(() => {
    setIsProcessingActive(prev => !prev);
    
    toast({
      title: `Signal Processing ${!isProcessingActive ? 'Started' : 'Stopped'}`,
      description: `Automated signal processing has been ${!isProcessingActive ? 'started' : 'stopped'}.`
    });
  }, [isProcessingActive, toast]);

  // Clear all data (for testing/reset)
  const clearAllData = useCallback(() => {
    setStrategies([]);
    setSignals([]);
    setOrders([]);
    setPositions([]);
    localStorage.removeItem('automation-strategies');
    
    toast({
      title: "Data Cleared",
      description: "All automation data has been cleared."
    });
  }, [toast]);

  const enableSignalSource = useCallback((id: string) => {
    setSignalSources(prev => 
      prev.map(source => 
        source.id === id 
          ? { ...source, isEnabled: true } 
          : source
      )
    );
    toast({
      title: "Signal Source Enabled",
      description: `The signal source has been enabled.`
    });
  }, [toast]);

  const disableSignalSource = useCallback((id: string) => {
    setSignalSources(prev => 
      prev.map(source => 
        source.id === id 
          ? { ...source, isEnabled: false } 
          : source
      )
    );
    toast({
      title: "Signal Source Disabled",
      description: `The signal source has been disabled.`
    });
  }, [toast]);

  const getStrategyPerformance = useCallback((id: string, timeframe: string) => {
    const strategy = strategies.find(s => s.id === id);
    if (!strategy || !strategy.performance) return undefined;
    
    // In a real implementation, we would filter the performance data based on the timeframe
    // For now, we just return the full performance data
    return strategy.performance;
  }, [strategies]);

  const contextValue: AutomationContextType = {
    strategies,
    signals,
    orders,
    positions,
    signalSources,
    isSimulationMode,
    isProcessingActive,
    addStrategy,
    updateStrategy,
    deleteStrategy,
    activateStrategy,
    deactivateStrategy,
    pauseStrategy,
    processSignal,
    executeOrder,
    toggleSimulationMode,
    toggleProcessing,
    clearAllData,
    enableSignalSource,
    disableSignalSource,
    getStrategyPerformance
  };

  return (
    <AutomationContext.Provider value={contextValue}>
      {children}
    </AutomationContext.Provider>
  );
};

// Custom hook to use the automation context
export const useAutomation = () => {
  const context = useContext(AutomationContext);
  if (context === undefined) {
    throw new Error('useAutomation must be used within an AutomationProvider');
  }
  return context;
};
