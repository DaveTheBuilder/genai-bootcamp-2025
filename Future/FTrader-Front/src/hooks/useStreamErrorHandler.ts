import { useState, useEffect, useCallback } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import igStreamingService from '@/services/igStreamingService';

interface UseStreamErrorHandlerProps {
  onRetry?: () => void;
}

interface UseStreamErrorHandlerResult {
  streamError: string | null;
  isOfflineMode: boolean;
  handleRetry: () => void;
  enableOfflineMode: () => void;
}

/**
 * Hook to handle IG streaming service errors and offline mode
 */
export const useStreamErrorHandler = (
  props?: UseStreamErrorHandlerProps
): UseStreamErrorHandlerResult => {
  const { onRetry } = props || {};
  const [streamError, setStreamError] = useState<string | null>(null);
  const settingsStore = useSettingsStore();
  
  // Listen for connection status changes
  useEffect(() => {
    const handleConnectionStatus = (isConnected: boolean) => {
      if (!isConnected && !settingsStore.offlineMode) {
        setStreamError('Lost connection to market data stream. Please check your internet connection or try again later.');
      } else {
        setStreamError(null);
      }
    };
    
    igStreamingService.onConnectionStatusChange(handleConnectionStatus);
    
    return () => {
      // No direct way to unsubscribe from connection status changes,
      // but we can add this when the service is updated
    };
  }, [settingsStore.offlineMode]);
  
  // Handle stream errors
  useEffect(() => {
    const handleStreamError = (error: any) => {
      if (!settingsStore.offlineMode) {
        let errorMessage = 'Error connecting to market data stream.';
        
        if (error?.message) {
          if (error.message.includes('INTERNAL_ERROR')) {
            errorMessage = 'Internal server error occurred. The streaming service is currently unavailable.';
          } else if (error.message.includes('CONNECTION_ERROR')) {
            errorMessage = 'Failed to connect to the streaming service. Please check your internet connection.';
          } else {
            errorMessage = `Error: ${error.message}`;
          }
        }
        
        setStreamError(errorMessage);
      }
    };
    
    // We would ideally add an error listener to the streaming service here
    // For now, we'll rely on the connection status listener
    
    return () => {
      // Cleanup would go here
    };
  }, [settingsStore.offlineMode]);
  
  // Handle retry
  const handleRetry = useCallback(() => {
    setStreamError(null);
    
    // If we're in offline mode, do nothing
    if (settingsStore.offlineMode) {
      return;
    }
    
    // Try to reconnect to the streaming service
    // This would depend on the implementation of the streaming service
    // For now, we'll just call the onRetry callback if provided
    if (onRetry) {
      onRetry();
    }
  }, [onRetry, settingsStore.offlineMode]);
  
  // Enable offline mode
  const enableOfflineMode = useCallback(() => {
    settingsStore.setOfflineMode(true);
    setStreamError(null);
    
    // If onRetry is provided, call it to refresh the data
    if (onRetry) {
      onRetry();
    }
  }, [onRetry, settingsStore]);
  
  return {
    streamError,
    isOfflineMode: settingsStore.offlineMode,
    handleRetry,
    enableOfflineMode
  };
};
