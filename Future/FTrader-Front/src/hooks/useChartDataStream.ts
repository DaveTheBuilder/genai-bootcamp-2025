import { useState, useEffect, useCallback } from 'react';
import { ChartUpdate, ChartUpdateCallback } from '@/services/igStreamingTypes';
import igStreamingService from '@/services/igStreamingService';
import igAuthService from '@/services/igAuthService';
import { getConsistentChartUpdate } from '@/services/chartDataFix';
import { useStreamErrorHandler } from './useStreamErrorHandler';
import axios from 'axios';

// Define chart data types
export interface ChartDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type TimeFrame = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d';

interface UseChartDataStreamProps {
  epic: string;
  resolution?: TimeFrame;
}

interface UseChartDataStreamResult {
  chartData: ChartDataPoint[];
  isLoading: boolean;
  streamError: string | null;
  isOfflineMode: boolean;
  handleRetry: () => void;
  resolution: TimeFrame;
  setResolution: (resolution: TimeFrame) => void;
}

/**
 * Hook to handle chart data streaming with fallback to offline mode
 */
export const useChartDataStream = ({
  epic,
  resolution: initialResolution = '1h'
}: UseChartDataStreamProps): UseChartDataStreamResult => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [resolution, setResolution] = useState<TimeFrame>(initialResolution);
  
  // Initialize the stream error handler
  const { 
    streamError, 
    isOfflineMode, 
    handleRetry, 
    enableOfflineMode 
  } = useStreamErrorHandler({
    onRetry: () => loadChartData()
  });

  // Map resolution to IG API resolution format
  const mapResolutionToIGFormat = (res: TimeFrame): string => {
    switch (res) {
      case '1m': return 'MINUTE';
      case '5m': return 'MINUTE_5';
      case '15m': return 'MINUTE_15';
      case '30m': return 'MINUTE_30';
      case '1h': return 'HOUR';
      case '4h': return 'HOUR_4';
      case '1d': return 'DAY';
      default: return 'HOUR';
    }
  };

  // Convert ChartUpdate to ChartDataPoint
  const convertUpdateToDataPoint = (update: ChartUpdate): ChartDataPoint => {
    return {
      date: update.timestamp,
      open: update.openPrice,
      high: update.highPrice,
      low: update.lowPrice,
      close: update.closePrice,
      volume: update.lastTradedVolume
    };
  };

  // Generate initial mock data
  const generateInitialMockData = useCallback((): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    const now = new Date();
    
    // Determine time increment based on timeframe
    let timeIncrement: number;
    let points: number;
    
    switch (resolution) {
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
    
    for (let i = points; i > 0; i--) {
      const timestamp = new Date(now.getTime() - (i * timeIncrement));
      const mockUpdate = getConsistentChartUpdate(epic, mapResolutionToIGFormat(resolution));
      
      data.push({
        date: timestamp.toISOString(),
        open: mockUpdate.openPrice,
        high: mockUpdate.highPrice,
        low: mockUpdate.lowPrice,
        close: mockUpdate.closePrice,
        volume: mockUpdate.lastTradedVolume
      });
    }
    
    return data;
  }, [epic, resolution]);

  // Function to load chart data
  const loadChartData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Always load mock data first to ensure the UI is never empty
      const mockData = generateInitialMockData();
      setChartData(mockData);
      
      // Function to check authentication and connect to IG streaming
      const setupChartDataStream = async () => {
        try {
          console.log(`Setting up chart data stream for ${epic} with resolution ${resolution}...`);
          
          // Check if we're authenticated
          const isAuthenticated = await igAuthService.checkAuthStatus();
          
          if (!isAuthenticated) {
            console.log("Not authenticated with IG, using offline mode for chart data...");
            setIsLoading(false);
            enableOfflineMode();
            return false;
          }
          
          // Get credentials for streaming
          const credentials = await igAuthService.getCredentials();
          
          if (!credentials) {
            throw new Error("Failed to get IG credentials for chart data");
          }
          
          // Get the lightstreamer endpoint from the streaming connection test if not already connected
          if (!igStreamingService.getCurrentError()) {
            try {
              const streamingTestResponse = await axios.get('/api/trading/test/ig/test-connection/', {
                headers: {
                  'CST': credentials.cst,
                  'X-SECURITY-TOKEN': credentials.securityToken,
                }
              });
              
              // Check if the streaming test was successful
              if (!streamingTestResponse.data.success) {
                throw new Error(`Failed to get lightstreamer endpoint: ${streamingTestResponse.data.message || 'Unknown error'}`);
              }
              
              // Initialize streaming service if not already connected
              await igStreamingService.initialize(
                credentials.cst,
                credentials.securityToken,
                credentials.accountId,
                streamingTestResponse.data.lightstreamerEndpoint
              );
            } catch (error) {
              console.error("Failed to initialize Lightstreamer client for chart data:", error);
              throw new Error("Failed to connect to streaming service for chart data");
            }
          }
          
          // Convert resolution to IG format
          const igResolution = mapResolutionToIGFormat(resolution);
          
          // Create a new array to store real-time updates
          const liveChartData = [...mockData];
          
          // Subscribe to chart data
          const handleChartUpdate: ChartUpdateCallback = (update) => {
            // Convert update to chart data point
            const dataPoint = convertUpdateToDataPoint(update);
            
            // Check if we already have a point with this timestamp
            const existingIndex = liveChartData.findIndex(point => 
              new Date(point.date).getTime() === new Date(dataPoint.date).getTime()
            );
            
            if (existingIndex >= 0) {
              // Update existing point
              liveChartData[existingIndex] = dataPoint;
            } else {
              // Add new point
              liveChartData.push(dataPoint);
              
              // Sort by date
              liveChartData.sort((a, b) => 
                new Date(a.date).getTime() - new Date(b.date).getTime()
              );
              
              // Keep only the last 'points' data points to avoid memory issues
              const maxPoints = resolution === '1d' ? 90 : 
                               resolution === '4h' ? 90 : 
                               resolution === '1h' ? 168 : 
                               resolution === '30m' ? 168 : 
                               resolution === '15m' ? 192 : 
                               resolution === '5m' ? 288 : 240;
              
              if (liveChartData.length > maxPoints) {
                liveChartData.splice(0, liveChartData.length - maxPoints);
              }
            }
            
            // Update state with new data
            setChartData([...liveChartData]);
          };
          
          // Subscribe to chart data with the streaming service
          igStreamingService.subscribeToChartData(epic, igResolution, handleChartUpdate);
          
          setIsLoading(false);
          return true;
        } catch (error) {
          console.error('Chart data subscription error:', error);
          setIsLoading(false);
          enableOfflineMode();
          return false;
        }
      };
      
      // Try to connect, but don't wait for it to complete
      setupChartDataStream().catch(error => {
        console.error('Failed to set up chart data stream:', error);
        setIsLoading(false);
        enableOfflineMode();
      });
      
    } catch (error) {
      console.error('Failed to load chart data:', error);
      setIsLoading(false);
      enableOfflineMode();
    }
  }, [epic, resolution, generateInitialMockData, enableOfflineMode]);

  // Effect to load chart data when epic or resolution changes
  useEffect(() => {
    loadChartData();
    
    // Cleanup function to unsubscribe when component unmounts or dependencies change
    return () => {
      // Unsubscribe from chart data
      igStreamingService.unsubscribeFromChartData(
        epic, 
        mapResolutionToIGFormat(resolution), 
        () => {} // Empty callback as we're just cleaning up
      );
    };
  }, [epic, resolution, loadChartData]);

  return {
    chartData,
    isLoading,
    streamError,
    isOfflineMode,
    handleRetry,
    resolution,
    setResolution
  };
};
