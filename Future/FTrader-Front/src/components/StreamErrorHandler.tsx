import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/store/settingsStore';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface StreamErrorHandlerProps {
  error: string | null;
  onRetry: () => void;
}

const StreamErrorHandler: React.FC<StreamErrorHandlerProps> = ({ error, onRetry }) => {
  const [showAlert, setShowAlert] = useState(false);
  const settings = useSettingsStore();

  useEffect(() => {
    if (error) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [error]);

  const handleEnableOfflineMode = () => {
    settings.setOfflineMode(true);
    onRetry();
  };

  if (!showAlert) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Stream Connection Error</AlertTitle>
      <AlertDescription className="flex flex-col gap-3">
        <p>
          {error || "There was an error connecting to the market data stream."}
        </p>
        <div className="flex gap-2 mt-2">
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Connection
          </Button>
          {!settings.offlineMode && (
            <Button variant="outline" size="sm" onClick={handleEnableOfflineMode}>
              Switch to Offline Mode
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default StreamErrorHandler;
