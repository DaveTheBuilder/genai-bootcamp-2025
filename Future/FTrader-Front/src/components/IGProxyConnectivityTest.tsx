import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, CheckCircle2, RefreshCw, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import axios from 'axios';
import igStreamingService from '@/services/igStreamingService';
import igAuthService from '@/services/igAuthService';
import { useSettingsStore } from '@/store/settingsStore';

interface IGProxyConnectivityTestProps {
  className?: string;
}

const IGProxyConnectivityTest: React.FC<IGProxyConnectivityTestProps> = ({ className }) => {
  const { toast } = useToast();
  const settingsStore = useSettingsStore();
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
      errorMessage = 'No response received from server. This could be a network issue.';
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
      message: 'Running connection test...',
    });
    
    try {
      // Step 1: Test authentication via proxy
      const authResponse = await axios.post(
        '/api/trading/test/ig/session/',
        {
          identifier: username,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      // Extract tokens from response headers
      const cst = authResponse.headers['cst'];
      const securityToken = authResponse.headers['x-security-token'];

      console.log('Auth response data structure:', {
        data: authResponse.data,
        headers: {
          cst: cst ? 'Present' : 'Missing',
          securityToken: securityToken ? 'Present' : 'Missing'
        }
      });

      if (!cst || !securityToken) {
        throw new Error('Authentication successful but missing security tokens in response');
      }
      
      // Log full auth response to understand user ID issue
      console.log('Full auth response:', {
        rawData: authResponse.data,
        headers: authResponse.headers,
        endpoint: authResponse.data.lightstreamerEndpoint
      });

      setTestResults(prev => ({
        ...prev,
        auth: true,
        message: 'Authentication successful. Testing streaming connection...',
      }));

      // Step 2: Test streaming connection
      try {
        // Test the streaming connection via proxy
        const streamingTestResponse = await axios.get(
          '/api/trading/test/ig/test-connection/',
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'CST': cst,
              'X-SECURITY-TOKEN': securityToken,
            },
          }
        );

        console.log('Streaming test response:', streamingTestResponse.data);
        
        if (streamingTestResponse.data.success) {
          // Initialize streaming service with the tokens
          try {
            console.log("Attempting to initialize Lightstreamer with endpoint:", streamingTestResponse.data.lightstreamerEndpoint);
            
            // To test the live connection, set the last parameter to false
            // For development with CORS issues, set it to true
            const testLiveConnection = false; // Set to false to test the actual connection, true for development
            
            // Extract account ID from response
            const responseData = authResponse.data.data || authResponse.data;
            
            // Log full response structure to help diagnose account ID issues
            console.log('Auth response structure:', {
              rawData: authResponse.data,
              processedData: responseData,
              headers: {
                cst: authResponse.headers['cst'] ? 'Present' : 'Missing',
                securityToken: authResponse.headers['x-security-token'] ? 'Present' : 'Missing'
              },
              possibleIds: {
                accountId: responseData.accountId,
                currentAccountId: responseData.currentAccountId,
                clientId: responseData.clientId,
                firstAccountId: responseData.accounts?.[0]?.accountId
              }
            });
            
            // Try each possible location for the account ID
            const accountId = responseData.accountId || 
              responseData.currentAccountId || 
              (responseData.accounts && responseData.accounts[0]?.accountId);
            
            if (!accountId) {
              throw new Error('No account ID found in authentication response');
            }
            
            console.log('Using account ID:', accountId);
            
            await igStreamingService.initialize(
              cst,
              securityToken,
              accountId,
              streamingTestResponse.data.lightstreamerEndpoint
            );
            
            console.log("Successfully initialized Lightstreamer client");
            
            // Initialize igAuthService with the credentials for market data streaming
            igAuthService.initializeWithCredentials(
              cst,
              securityToken,
              accountId
            );
            
            // The connection is already established thanks to the Promise-based initialize
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
          } catch (error) {
            console.error("Failed to initialize streaming service:", error);
            setTestResults({
              auth: true,
              streaming: false,
              message: `Authentication successful, but streaming connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            });
            
            toast({
              title: 'Streaming Connection Failed',
              description: 'Authentication was successful, but streaming connection failed.',
              variant: 'destructive',
            });
          }
        } else {
          throw new Error(streamingTestResponse.data.message || 'Unknown streaming connection error');
        }
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
        <CardTitle>IG Connectivity Test (via Proxy)</CardTitle>
        <CardDescription>
          Test your connection to the IG API and streaming service using the backend proxy
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertTitle>Server-side Proxy</AlertTitle>
          <AlertDescription>
            This test uses a server-side proxy to avoid CORS issues when connecting to the IG API.
            Make sure your backend server is running and properly configured.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="ig-username-proxy">IG Username</Label>
          <Input 
            id="ig-username-proxy" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your IG username"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ig-password-proxy">IG Password</Label>
          <Input 
            id="ig-password-proxy" 
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

export default IGProxyConnectivityTest;
