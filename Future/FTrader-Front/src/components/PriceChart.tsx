import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  LineChart,
  CandlestickChart,
  AreaChart,
  TrendingUp,
  Activity
} from 'lucide-react';
import Chart from '@qognicafinance/react-lightweight-charts';
import { TimeFrame, ChartDataPoint } from '@/hooks/useMarketDataStream';

// Define chart data types
interface CandlestickPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

type ChartType = 'candlestick' | 'line' | 'area';
type IndicatorType = 'sma' | 'ema' | 'bollinger' | 'rsi' | 'macd';

interface PriceChartProps {
  data: ChartDataPoint[];
  candlestickData: CandlestickPoint[];
  isLoading?: boolean;
  symbol?: string;
  onTimeFrameChange?: (timeFrame: TimeFrame) => void;
  selectedTimeFrame?: TimeFrame;
}

export const PriceChart: React.FC<PriceChartProps> = ({
  data = [],
  candlestickData = [],
  isLoading = false,
  symbol = '',
  onTimeFrameChange,
  selectedTimeFrame = '1h',
}) => {
  const [chartType, setChartType] = useState<ChartType>('candlestick');
  const [indicators, setIndicators] = useState<IndicatorType[]>(['sma']);
  const color = useMemo(() => '#3b82f6', []);
  
  // Process data to ensure price is a number
  const processedData = useMemo(() => data.map(point => ({
    ...point,
    price: typeof point.price === 'string' ? parseFloat(point.price) : point.price
  })), [data]);
  
  // Format data for different chart types
  const formattedCandlestickData = useMemo(() => 
    candlestickData.map(item => ({
      time: new Date(item.date).getTime() / 1000,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    })),
    [candlestickData]
  );
  
  const formattedLineData = useMemo(() => 
    processedData.map(item => ({
      time: new Date(item.date).getTime() / 1000,
      value: Number(item.price),
    })),
    [processedData]
  );
  
  // Calculate technical indicators
  const calculateSMA = (prices: number[], period: number): (number | null)[] => {
    const result: (number | null)[] = [];
    for (let i = 0; i < prices.length; i++) {
      if (i < period - 1) {
        result.push(null);
        continue;
      }
      
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += prices[i - j];
      }
      result.push(sum / period);
    }
    return result;
  };
  
  const calculateEMA = (prices: number[], period: number): (number | null)[] => {
    const result: (number | null)[] = [];
    const k = 2 / (period + 1);
    
    // First EMA is SMA
    let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
    
    for (let i = 0; i < prices.length; i++) {
      if (i < period - 1) {
        result.push(null);
        continue;
      }
      
      if (i === period - 1) {
        result.push(ema);
        continue;
      }
      
      ema = prices[i] * k + ema * (1 - k);
      result.push(ema);
    }
    
    return result;
  };
  
  const calculateBollingerBands = (prices: number[], period: number, multiplier: number) => {
    const middle = calculateSMA(prices, period);
    const upper: (number | null)[] = [];
    const lower: (number | null)[] = [];
    
    for (let i = 0; i < prices.length; i++) {
      if (i < period - 1) {
        upper.push(null);
        lower.push(null);
        continue;
      }
      
      let sum = 0;
      for (let j = 0; j < period; j++) {
        const middleValue = middle[i];
        if (middleValue === null) continue;
        sum += Math.pow(prices[i - j] - middleValue, 2);
      }
      
      const stdDev = Math.sqrt(sum / period);
      const middleValue = middle[i];
      if (middleValue !== null) {
        upper.push(middleValue + multiplier * stdDev);
        lower.push(middleValue - multiplier * stdDev);
      } else {
        upper.push(null);
        lower.push(null);
      }
    }
    
    return { middle, upper, lower };
  };
  
  // Calculate indicator data
  const smaData = useMemo(() => {
    if (!indicators.includes('sma')) return [];
    const values = calculateSMA(processedData.map(d => Number(d.price)), 20);
    return processedData.map((item, index) => ({
      time: new Date(item.date).getTime() / 1000,
      value: values[index] || null,
    })).filter(d => d.value !== null);
  }, [processedData, indicators]);
  
  const emaData = useMemo(() => {
    if (!indicators.includes('ema')) return [];
    const values = calculateEMA(processedData.map(d => Number(d.price)), 14);
    return processedData.map((item, index) => ({
      time: new Date(item.date).getTime() / 1000,
      value: values[index] || null,
    })).filter(d => d.value !== null);
  }, [processedData, indicators]);
  
  // Chart options
  const chartOptions = {
    layout: {
      background: { type: 'solid', color: '#1E293B' },
      textColor: '#d1d5db',
    },
    grid: {
      vertLines: { color: '#334155' },
      horzLines: { color: '#334155' },
    },
    crosshair: {
      mode: 'normal',
      vertLine: {
        width: 1,
        color: '#6B7280',
        style: 'solid',
      },
      horzLine: {
        width: 1,
        color: '#6B7280',
        style: 'solid',
      },
    },
    timeScale: {
      borderColor: '#4b5563',
      timeVisible: true,
      secondsVisible: false,
    },
    rightPriceScale: {
      borderColor: '#4b5563',
    },
    handleScroll: true,
    handleScale: true,
  };
  
  const candlestickOptions = {
    upColor: '#26A69A',
    downColor: '#EF5350',
    borderVisible: false,
    wickUpColor: '#26A69A',
    wickDownColor: '#EF5350',
  };
  
  const lineOptions = {
    color: color,
    lineWidth: 2,
  };
  
  const areaOptions = {
    topColor: `${color}50`,
    bottomColor: `${color}10`,
    lineColor: color,
    lineWidth: 2,
  };
  
  return (
    <Card className="col-span-3 row-span-4">
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold">{symbol || 'Price Chart'}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <ToggleGroup type="single" value={chartType} onValueChange={(value) => value && setChartType(value as ChartType)}>
              <ToggleGroupItem value="candlestick" aria-label="Candlestick Chart">
                <CandlestickChart className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="line" aria-label="Line Chart">
                <LineChart className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="area" aria-label="Area Chart">
                <AreaChart className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
            
            <Tabs 
              defaultValue={selectedTimeFrame} 
              value={selectedTimeFrame}
              onValueChange={(value) => onTimeFrameChange?.(value as TimeFrame)}
              className="ml-4"
            >
              <TabsList>
                <TabsTrigger value="1m">1m</TabsTrigger>
                <TabsTrigger value="5m">5m</TabsTrigger>
                <TabsTrigger value="15m">15m</TabsTrigger>
                <TabsTrigger value="30m">30m</TabsTrigger>
                <TabsTrigger value="1h">1h</TabsTrigger>
                <TabsTrigger value="4h">4h</TabsTrigger>
                <TabsTrigger value="1d">1d</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <div className="flex">
          <div className="flex-1 h-[500px] relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            ) : (
              <Chart 
                options={chartOptions}
                autoWidth
                height={500}
                candlestickSeries={chartType === 'candlestick' ? [{
                  data: formattedCandlestickData,
                  options: candlestickOptions
                }] : []}
                lineSeries={[
                  ...(chartType === 'line' ? [{
                    data: formattedLineData,
                    options: lineOptions
                  }] : []),
                  ...(indicators.includes('sma') ? [{
                    data: smaData,
                    options: {
                      color: '#FF6B6B',
                      lineWidth: 1,
                      title: 'SMA 20',
                    }
                  }] : []),
                  ...(indicators.includes('ema') ? [{
                    data: emaData,
                    options: {
                      color: '#4ECDC4',
                      lineWidth: 1,
                      title: 'EMA 14',
                    }
                  }] : []),
                ]}
                areaSeries={chartType === 'area' ? [{
                  data: formattedLineData,
                  options: areaOptions
                }] : []}
              />
            )}
          </div>
          
          <div className="w-48 p-4 border-l border-border">
            <h4 className="text-sm font-medium mb-2">Indicators</h4>
            <div className="space-y-2">
              <Button 
                variant={indicators.includes('sma') ? "default" : "outline"} 
                size="sm" 
                className="w-full justify-start"
                onClick={() => {
                  if (indicators.includes('sma')) {
                    setIndicators(indicators.filter(i => i !== 'sma'));
                  } else {
                    setIndicators([...indicators, 'sma']);
                  }
                }}
              >
                <LineChart className="h-4 w-4 mr-2" />
                SMA (20)
              </Button>
              
              <Button 
                variant={indicators.includes('ema') ? "default" : "outline"} 
                size="sm" 
                className="w-full justify-start"
                onClick={() => {
                  if (indicators.includes('ema')) {
                    setIndicators(indicators.filter(i => i !== 'ema'));
                  } else {
                    setIndicators([...indicators, 'ema']);
                  }
                }}
              >
                <LineChart className="h-4 w-4 mr-2" />
                EMA (14)
              </Button>
              
              <Button 
                variant={indicators.includes('bollinger') ? "default" : "outline"} 
                size="sm" 
                className="w-full justify-start"
                disabled
                title="Coming soon"
              >
                <Activity className="h-4 w-4 mr-2" />
                Bollinger Bands
              </Button>
              
              <Button 
                variant={indicators.includes('rsi') ? "default" : "outline"} 
                size="sm" 
                className="w-full justify-start"
                disabled
                title="Coming soon"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                RSI
              </Button>
              
              <Button 
                variant={indicators.includes('macd') ? "default" : "outline"} 
                size="sm" 
                className="w-full justify-start"
                disabled
                title="Coming soon"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                MACD
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
