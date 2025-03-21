import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, CheckCircle2, RefreshCw, Info } from 'lucide-react';
import igAuthService from '@/services/igAuthService';
import igStreamingService from '@/services/igStreamingService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface IGConnectivityTestProps {
  className?: string;
}

const IGConnectivityTest: React.FC<IGConnectivityTestProps> = ({ className }) => {
  const { toast } = useToast();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<{
    auth: boolean | null;
    streaming: boolean | null;
    message: string;
    errorDetails?: string;
  }>({
    auth: null,
    streaming: null,
    message: '',
  });

  const formatErrorMessage = (error: any): string => {
    if (!error) return 'Unknown error';
    
    let errorMessage = '';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage = `Status: ${error.response.status} - ${error.response.statusText || 'Error'}`;
      
      if (error.response.data && typeof error.response.data === 'object') {
        try {
          errorMessage += `\nDetails: ${JSON.stringify(error.response.data, null, 2)}`;
        } catch (e) {
          errorMessage += '\nDetails: [Error parsing response data]';
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response received from server. This could be a network issue or CORS restriction.';
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message || 'Unknown error occurred';
    }
    
    if (error.code) {
      errorMessage += `\nError Code: ${error.code}`;
    }
    
    return errorMessage;
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    setTestResults({
      auth: null,
      streaming: null,
      message: 'Testing connection...',
    });

    try {
      // Step 1: Test authentication
      const authResponse = await igAuthService.login(username, password);
      setTestResults(prev => ({
        ...prev,
        auth: true,
        message: 'Authentication successful. Testing streaming connection...',
      }));

      // Step 2: Test streaming connection
      try {
        // Get credentials for streaming
        const credentials = await igAuthService.getCredentials();
        
        if (!credentials) {
          throw new Error('Failed to get streaming credentials');
        }
        
        // Get the lightstreamer endpoint from the API
        const streamingTestResponse = await fetch('/api/trading/test/ig/test-connection/', {
          headers: {
            'CST': credentials.cst,
            'X-SECURITY-TOKEN': credentials.securityToken,
          }
        });
        
        const streamingData = await streamingTestResponse.json();
        
        if (!streamingData.success) {
          throw new Error(`Failed to get lightstreamer endpoint: ${streamingData.message || 'Unknown error'}`);
        }
        
        console.log('Streaming test response:', streamingData);
        
        // Initialize streaming service with the endpoint from the API
        igStreamingService.initialize(
          credentials.cst,
          credentials.securityToken,
          credentials.accountId,
          streamingData.lightstreamerEndpoint
        );
        
        // Set up a promise that resolves when connection is established or rejects after timeout
        const streamingTest = new Promise<boolean>((resolve, reject) => {
          // Set up a timeout to reject the promise after 10 seconds
          const timeout = setTimeout(() => {
            reject(new Error('Streaming connection test timed out after 10 seconds'));
          }, 10000);
          
          // Set up a connection status handler
          const statusHandler = (connected: boolean) => {
            if (connected) {
              clearTimeout(timeout);
              resolve(true);
            }
          };
          
          igStreamingService.onConnectionStatusChange(statusHandler);
          
          // Check current connection status (might already be connected)
          if (igStreamingService.getConnectionStatus()) {
            clearTimeout(timeout);
            resolve(true);
          }
        });
        
        await streamingTest;
        
        setTestResults({
          auth: true,
          streaming: true,
          message: 'Connection test successful! Both authentication and streaming are working.',
        });
        
        toast({
          title: 'Connection Test Successful',
          description: 'Successfully connected to IG API and streaming service.',
          variant: 'default',
        });
      } catch (streamingError: any) {
        console.error('Streaming connection error:', streamingError);
        setTestResults({
          auth: true,
          streaming: false,
          message: `Authentication successful, but streaming connection failed.`,
          errorDetails: formatErrorMessage(streamingError)
        });
        
        toast({
          title: 'Streaming Connection Failed',
          description: 'Authentication was successful, but streaming connection failed.',
          variant: 'destructive',
        });
      }
    } catch (authError: any) {
      console.error('Authentication error:', authError);
      setTestResults({
        auth: false,
        streaming: null,
        message: `Authentication failed.`,
        errorDetails: formatErrorMessage(authError)
      });
      
      toast({
        title: 'Authentication Failed',
        description: 'Failed to authenticate with IG API. Please check your credentials.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: boolean | null) => {
    if (status === null) return null;
    return status ? 
      <CheckCircle2 className="h-5 w-5 text-green-500" /> : 
      <AlertCircle className="h-5 w-5 text-red-500" />;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>IG Connectivity Test</CardTitle>
        <CardDescription>
          Test your connection to the IG API and streaming service
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
          <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle>Important Note</AlertTitle>
          <AlertDescription>
            Direct browser connections to the IG API may be blocked by CORS restrictions. 
            For production use, consider implementing a server-side proxy to handle API requests.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="ig-username">IG Username</Label>
          <Input 
            id="ig-username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your IG username"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ig-password">IG Password</Label>
          <Input 
            id="ig-password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your IG password"
          />
        </div>
        
        {testResults.message && (
          <div className={`p-3 rounded-md ${
            testResults.auth === false ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
            testResults.streaming === false ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
            testResults.auth === true && testResults.streaming === true ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                {testResults.auth === false ? getStatusIcon(false) :
                 testResults.streaming === false ? getStatusIcon(false) :
                 testResults.auth === true && testResults.streaming === true ? getStatusIcon(true) :
                 <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{testResults.message}</p>
                {testResults.auth !== null && (
                  <div className="mt-2 flex items-center">
                    <span className="text-xs font-medium mr-2">Authentication:</span>
                    {getStatusIcon(testResults.auth)}
                  </div>
                )}
                {testResults.streaming !== null && (
                  <div className="mt-1 flex items-center">
                    <span className="text-xs font-medium mr-2">Streaming:</span>
                    {getStatusIcon(testResults.streaming)}
                  </div>
                )}
                {testResults.errorDetails && (
                  <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono overflow-auto max-h-40">
                    <pre className="whitespace-pre-wrap">{testResults.errorDetails}</pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleTestConnection} 
          disabled={isLoading || !username || !password}
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            'Test Connection'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default IGConnectivityTest;
