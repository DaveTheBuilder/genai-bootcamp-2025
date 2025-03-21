import React from 'react';
import { AlertCircle, WifiOff, Wifi } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/store/settingsStore';
import { StreamingError } from '@/services/igStreamingService';

interface StreamErrorBannerProps {
  error: StreamingError | null;
  isOfflineMode: boolean;
  onRetry: () => void;
  onEnableOfflineMode: () => void;
}

const StreamErrorBanner: React.FC<StreamErrorBannerProps> = ({
  error,
  isOfflineMode,
  onRetry,
  onEnableOfflineMode
}) => {
  const settingsStore = useSettingsStore();

  const handleDisableOfflineMode = () => {
    settingsStore.setOfflineMode(false);
    onRetry();
  };

  if (isOfflineMode) {
    return (
      <Alert variant="default" className="bg-muted border-muted-foreground/20">
        <WifiOff className="h-4 w-4" />
        <AlertTitle>Offline Mode</AlertTitle>
        <AlertDescription className="flex flex-col sm:flex-row gap-2 items-start sm:items-center mt-2">
          <span>
            You're viewing mock data in offline mode. Real-time market data is not available.
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleDisableOfflineMode}
          >
            <Wifi className="h-3 w-3" />
            Switch to Online Mode
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    const severity = error.recoverable ? "default" : "destructive";
    return (
      <Alert variant={severity}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{error.message}</AlertTitle>
        <AlertDescription className="flex flex-col sm:flex-row gap-2 items-start sm:items-center mt-2">
          <span>{error.description}</span>
          <div className="flex gap-2">
            {error.recoverable && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={onRetry}
              >
                Retry Connection
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={onEnableOfflineMode}
            >
              <WifiOff className="h-3 w-3" />
              Use Offline Mode
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default StreamErrorBanner;
