import React, { useEffect, useCallback } from 'react';
import { useAutomation, Signal, Order, Strategy } from './AutomationEngine';
import { useToast } from '@/components/ui/use-toast';

// Types
export interface ExecutionConfig {
  defaultOrderType: 'market' | 'limit' | 'stop';
  defaultPositionSizing: {
    type: 'fixed' | 'percent' | 'risk';
    value: number;
  };
  slippageProtection: boolean;
  maxSlippagePercent: number;
  retryOnRejection: boolean;
  maxRetries: number;
}

interface ExecutionEngineProps {
  config?: Partial<ExecutionConfig>;
}

// Default configuration
const defaultConfig: ExecutionConfig = {
  defaultOrderType: 'market',
  defaultPositionSizing: {
    type: 'percent',
    value: 5, // 5% of account
  },
  slippageProtection: true,
  maxSlippagePercent: 0.5, // 0.5%
  retryOnRejection: true,
  maxRetries: 3
};

export const ExecutionEngine: React.FC<ExecutionEngineProps> = ({ 
  config = {} 
}) => {
  const { 
    strategies, 
    signals, 
    executeOrder,
    isProcessingActive,
    isSimulationMode
  } = useAutomation();
  
  const { toast } = useToast();
  
  // Merge provided config with defaults
  const executionConfig = { ...defaultConfig, ...config };
  
  // Process confirmed signals and create orders
  const processSignalsForExecution = useCallback(() => {
    if (!isProcessingActive) return;
    
    // Get confirmed signals that haven't been executed yet
    const confirmedSignals = signals.filter(signal => 
      signal.status === 'confirmed'
    );
    
    if (confirmedSignals.length === 0) return;
    
    // Process each confirmed signal
    confirmedSignals.forEach(signal => {
      // Find the strategy for this signal
      const strategy = strategies.find(s => s.id === signal.strategyId);
      
      if (!strategy || strategy.status !== 'active') return;
      
      // In a real implementation, we would validate the signal against strategy rules
      // and create an appropriate order based on the signal and strategy configuration
      
      // For now, we'll create a simple market order
      if (signal.direction === 'long' || signal.direction === 'short') {
        const newOrder: Omit<Order, 'id' | 'submittedAt' | 'updatedAt' | 'status'> = {
          strategyId: signal.strategyId,
          signalId: signal.id,
          instrument: signal.instrument,
          direction: signal.direction === 'long' ? 'buy' : 'sell',
          type: strategy.executionRules.orderType || executionConfig.defaultOrderType,
          quantity: calculateOrderQuantity(strategy, signal),
          price: signal.parameters.price // For limit/stop orders
        };
        
        // Execute the order
        executeOrder(newOrder);
        
        // Update signal status to 'executed'
        // This would normally be done by the AutomationEngine when the order is created
      }
    });
  }, [isProcessingActive, signals, strategies, executeOrder, executionConfig]);

  // Calculate order quantity based on strategy rules and signal
  const calculateOrderQuantity = (strategy: Strategy, signal: Signal): number => {
    // Get position sizing rule from strategy or use default
    const positionSizing = strategy.executionRules.positionSizing || executionConfig.defaultPositionSizing;
    
    // In a real implementation, this would calculate based on account balance,
    // risk parameters, and current market prices
    
    // For now, we'll return a simple fixed quantity
    switch (positionSizing.type) {
      case 'fixed':
        return positionSizing.value;
      case 'percent':
        // Simulate 100,000 account balance
        return (100000 * positionSizing.value / 100) / signal.parameters.price;
      case 'risk':
        // Risk-based position sizing would calculate based on stop loss distance
        // For now, we'll just return a simple value
        return 10;
      default:
        return 1;
    }
  };

  // Set up interval for processing signals
  useEffect(() => {
    if (!isProcessingActive) return;
    
    const intervalId = setInterval(() => {
      processSignalsForExecution();
    }, 2000); // Check for signals to execute every 2 seconds
    
    return () => clearInterval(intervalId);
  }, [isProcessingActive, processSignalsForExecution]);

  // This component doesn't render anything directly
  // It's a functional component that handles execution logic
  return null;
};

// Utility functions for order management
export const calculateStopLoss = (
  entryPrice: number, 
  direction: 'long' | 'short',
  stopType: 'fixed' | 'percent' | 'atr',
  stopValue: number,
  atrValue?: number
): number => {
  switch (stopType) {
    case 'fixed':
      return direction === 'long' 
        ? entryPrice - stopValue 
        : entryPrice + stopValue;
    case 'percent':
      return direction === 'long' 
        ? entryPrice * (1 - stopValue / 100) 
        : entryPrice * (1 + stopValue / 100);
    case 'atr':
      if (!atrValue) return 0;
      return direction === 'long' 
        ? entryPrice - (atrValue * stopValue) 
        : entryPrice + (atrValue * stopValue);
    default:
      return 0;
  }
};

export const calculateTakeProfit = (
  entryPrice: number, 
  direction: 'long' | 'short',
  profitType: 'fixed' | 'percent' | 'riskRatio',
  profitValue: number,
  stopLossDistance?: number
): number => {
  switch (profitType) {
    case 'fixed':
      return direction === 'long' 
        ? entryPrice + profitValue 
        : entryPrice - profitValue;
    case 'percent':
      return direction === 'long' 
        ? entryPrice * (1 + profitValue / 100) 
        : entryPrice * (1 - profitValue / 100);
    case 'riskRatio':
      if (!stopLossDistance) return 0;
      return direction === 'long' 
        ? entryPrice + (stopLossDistance * profitValue) 
        : entryPrice - (stopLossDistance * profitValue);
    default:
      return 0;
  }
};

// Custom hook for order management
export const useOrderManagement = (strategyId: string) => {
  const { orders, positions } = useAutomation();
  
  // Get orders for a specific strategy
  const getStrategyOrders = useCallback(() => {
    return orders.filter(order => order.strategyId === strategyId);
  }, [orders, strategyId]);
  
  // Get positions for a specific strategy
  const getStrategyPositions = useCallback(() => {
    return positions.filter(position => position.strategyId === strategyId);
  }, [positions, strategyId]);
  
  // Calculate strategy performance metrics
  const calculatePerformanceMetrics = useCallback(() => {
    const strategyOrders = getStrategyOrders();
    
    // In a real implementation, this would calculate various performance metrics
    // based on order history and current positions
    
    return {
      totalTrades: strategyOrders.length,
      winRate: 0.65, // Placeholder
      profitFactor: 1.8, // Placeholder
      averageTrade: 250, // Placeholder
      netProfit: 5000 // Placeholder
    };
  }, [getStrategyOrders]);
  
  return {
    getStrategyOrders,
    getStrategyPositions,
    calculatePerformanceMetrics
  };
};
