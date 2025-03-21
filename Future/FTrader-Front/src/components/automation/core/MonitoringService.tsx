import React, { useEffect, useCallback, useState } from 'react';
import { useAutomation, Strategy, Order, Position, StrategyPerformance } from './AutomationEngine';
import { useToast } from '@/components/ui/use-toast';

// Types
export interface Alert {
  id: string;
  strategyId: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: Date;
  read: boolean;
  data?: Record<string, any>;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  change: number; // Percentage change
  target?: number;
  status: 'positive' | 'neutral' | 'negative';
}

export interface MonitoringConfig {
  refreshInterval: number; // in milliseconds
  alertThresholds: {
    drawdown: number; // percentage
    consecutiveLosses: number;
    profitTarget: number; // percentage
    riskExposure: number; // percentage of account
  };
  performanceWindow: {
    short: number; // in days
    medium: number; // in days
    long: number; // in days
  };
}

interface MonitoringServiceProps {
  config?: Partial<MonitoringConfig>;
}

// Default configuration
const defaultConfig: MonitoringConfig = {
  refreshInterval: 10000, // 10 seconds
  alertThresholds: {
    drawdown: 5, // 5%
    consecutiveLosses: 3,
    profitTarget: 10, // 10%
    riskExposure: 20 // 20% of account
  },
  performanceWindow: {
    short: 1, // 1 day
    medium: 7, // 7 days
    long: 30 // 30 days
  }
};

export const MonitoringService: React.FC<MonitoringServiceProps> = ({ 
  config = {} 
}) => {
  const { 
    strategies, 
    orders, 
    positions,
    isProcessingActive
  } = useAutomation();
  
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<Record<string, PerformanceMetric[]>>({});
  
  // Merge provided config with defaults
  const monitoringConfig = { ...defaultConfig, ...config };
  
  // Process strategy performance and generate alerts
  const monitorStrategies = useCallback(() => {
    if (!isProcessingActive) return;
    
    // Get active strategies
    const activeStrategies = strategies.filter(strategy => strategy.status === 'active');
    
    if (activeStrategies.length === 0) return;
    
    // Process each active strategy
    activeStrategies.forEach(strategy => {
      // Calculate performance metrics
      const performance = calculateStrategyPerformance(strategy.id);
      
      // Update strategy performance
      // In a real implementation, this would be done via the AutomationEngine
      
      // Check for alert conditions
      checkAlertConditions(strategy, performance);
      
      // Update performance metrics
      updatePerformanceMetrics(strategy.id, performance);
    });
  }, [isProcessingActive, strategies]);

  // Calculate strategy performance
  const calculateStrategyPerformance = useCallback((strategyId: string): StrategyPerformance => {
    // Get strategy orders and positions
    const strategyOrders = orders.filter(order => order.strategyId === strategyId);
    const strategyPositions = positions.filter(position => position.strategyId === strategyId);
    
    // In a real implementation, this would calculate actual performance metrics
    // based on order history and current positions
    
    // For now, we'll return simulated metrics
    return {
      winRate: Math.random() * 0.3 + 0.5, // 50-80%
      profitFactor: Math.random() * 1 + 1.2, // 1.2-2.2
      sharpeRatio: Math.random() * 1 + 0.8, // 0.8-1.8
      maxDrawdown: Math.random() * 10, // 0-10%
      totalTrades: strategyOrders.length,
      netProfit: Math.random() * 5000 - 1000, // -1000 to 4000
      averageTrade: Math.random() * 200 - 50, // -50 to 150
      equityCurve: generateSimulatedEquityCurve()
    };
  }, [orders, positions]);

  // Generate a simulated equity curve for testing
  const generateSimulatedEquityCurve = (): [number, number][] => {
    const curve: [number, number][] = [];
    let equity = 10000;
    const now = Date.now();
    
    // Generate 30 days of data
    for (let i = 30; i >= 0; i--) {
      const timestamp = now - (i * 24 * 60 * 60 * 1000);
      equity = equity * (1 + (Math.random() * 0.04 - 0.01)); // -1% to +3% daily change
      curve.push([timestamp, equity]);
    }
    
    return curve;
  };

  // Check for alert conditions
  const checkAlertConditions = useCallback((strategy: Strategy, performance: StrategyPerformance) => {
    const { alertThresholds } = monitoringConfig;
    
    // Check for drawdown alert
    if (performance.maxDrawdown > alertThresholds.drawdown) {
      createAlert(strategy.id, 'warning', `Strategy ${strategy.name} has exceeded drawdown threshold (${performance.maxDrawdown.toFixed(2)}%)`);
    }
    
    // Check for profit target alert
    if (performance.netProfit > 0 && (performance.netProfit / 10000) * 100 > alertThresholds.profitTarget) {
      createAlert(strategy.id, 'success', `Strategy ${strategy.name} has reached profit target (${(performance.netProfit / 100).toFixed(2)}%)`);
    }
    
    // In a real implementation, we would check for consecutive losses and risk exposure
  }, [monitoringConfig]);

  // Create a new alert
  const createAlert = useCallback((strategyId: string, type: 'info' | 'warning' | 'error' | 'success', message: string, data?: Record<string, any>) => {
    const newAlert: Alert = {
      id: `alert-${Date.now()}`,
      strategyId,
      type,
      message,
      timestamp: new Date(),
      read: false,
      data
    };
    
    setAlerts(prev => [newAlert, ...prev]);
    
    // Show toast notification for the alert
    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Alert`,
      description: message,
      variant: type === 'error' ? 'destructive' : 'default'
    });
  }, [toast]);

  // Update performance metrics for a strategy
  const updatePerformanceMetrics = useCallback((strategyId: string, performance: StrategyPerformance) => {
    const metrics: PerformanceMetric[] = [
      {
        name: 'Win Rate',
        value: performance.winRate * 100,
        unit: '%',
        change: 0, // Would calculate change over time in real implementation
        status: performance.winRate > 0.5 ? 'positive' : 'negative'
      },
      {
        name: 'Profit Factor',
        value: performance.profitFactor,
        unit: '',
        change: 0,
        status: performance.profitFactor > 1 ? 'positive' : 'negative'
      },
      {
        name: 'Sharpe Ratio',
        value: performance.sharpeRatio,
        unit: '',
        change: 0,
        status: performance.sharpeRatio > 1 ? 'positive' : 'negative'
      },
      {
        name: 'Max Drawdown',
        value: performance.maxDrawdown,
        unit: '%',
        change: 0,
        status: performance.maxDrawdown < 10 ? 'positive' : 'negative'
      },
      {
        name: 'Net Profit',
        value: performance.netProfit,
        unit: '$',
        change: 0,
        status: performance.netProfit > 0 ? 'positive' : 'negative'
      },
      {
        name: 'Average Trade',
        value: performance.averageTrade,
        unit: '$',
        change: 0,
        status: performance.averageTrade > 0 ? 'positive' : 'negative'
      }
    ];
    
    setPerformanceMetrics(prev => ({
      ...prev,
      [strategyId]: metrics
    }));
  }, []);

  // Mark an alert as read
  const markAlertAsRead = useCallback((alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, read: true } 
          : alert
      )
    );
  }, []);

  // Clear all alerts for a strategy
  const clearAlerts = useCallback((strategyId: string) => {
    setAlerts(prev => prev.filter(alert => alert.strategyId !== strategyId));
  }, []);

  // Set up interval for monitoring
  useEffect(() => {
    if (!isProcessingActive) return;
    
    const intervalId = setInterval(() => {
      monitorStrategies();
    }, monitoringConfig.refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [isProcessingActive, monitorStrategies, monitoringConfig.refreshInterval]);

  // Custom hook for accessing monitoring data
  const useStrategyMonitoring = (strategyId: string) => {
    // Get alerts for a specific strategy
    const getStrategyAlerts = useCallback(() => {
      return alerts.filter(alert => alert.strategyId === strategyId);
    }, [alerts, strategyId]);
    
    // Get performance metrics for a specific strategy
    const getStrategyMetrics = useCallback(() => {
      return performanceMetrics[strategyId] || [];
    }, [performanceMetrics, strategyId]);
    
    return {
      alerts: getStrategyAlerts(),
      metrics: getStrategyMetrics(),
      markAlertAsRead,
      clearAlerts: () => clearAlerts(strategyId)
    };
  };

  // This component doesn't render anything directly
  // It's a functional component that handles monitoring logic
  return null;
};

// Export the custom hook for use in other components
export const useStrategyMonitoring = (strategyId: string) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  
  // In a real implementation, this would connect to the MonitoringService
  // For now, we'll return simulated data
  
  useEffect(() => {
    // Simulate loading alerts
    setAlerts([
      {
        id: 'alert-1',
        strategyId,
        type: 'info',
        message: 'Strategy activated',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        read: true
      },
      {
        id: 'alert-2',
        strategyId,
        type: 'success',
        message: 'Trade executed successfully',
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        read: false
      },
      {
        id: 'alert-3',
        strategyId,
        type: 'warning',
        message: 'Approaching drawdown limit',
        timestamp: new Date(Date.now() - 900000), // 15 minutes ago
        read: false
      }
    ]);
    
    // Simulate loading metrics
    setMetrics([
      {
        name: 'Win Rate',
        value: 65,
        unit: '%',
        change: 2.5,
        status: 'positive'
      },
      {
        name: 'Profit Factor',
        value: 1.8,
        unit: '',
        change: 0.2,
        status: 'positive'
      },
      {
        name: 'Max Drawdown',
        value: 4.2,
        unit: '%',
        change: -0.5,
        status: 'positive'
      },
      {
        name: 'Net Profit',
        value: 2500,
        unit: '$',
        change: 15,
        status: 'positive'
      }
    ]);
  }, [strategyId]);
  
  const markAlertAsRead = useCallback((alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, read: true } 
          : alert
      )
    );
  }, []);
  
  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);
  
  return {
    alerts,
    metrics,
    markAlertAsRead,
    clearAlerts
  };
};
