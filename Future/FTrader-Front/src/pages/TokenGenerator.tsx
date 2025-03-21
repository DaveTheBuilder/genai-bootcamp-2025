import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, Check } from 'lucide-react';
import axios from 'axios';
import authService from '@/services/authService';

const TokenGenerator: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [tokens, setTokens] = useState<{
    access: string;
    refresh: string;
    user: any;
  } | null>(null);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Use authService for login
      const authState = await authService.login(formData.email, formData.password);
      
      // Get tokens from auth state
      const tokens = {
        access: authState.tokens?.access || '',
        refresh: authState.tokens?.refresh || '',
        user: authState.user
      };
      
      setTokens(tokens);
      
      toast({
        title: 'Success',
        description: 'Token generated successfully!'
      });
    } catch (error) {
      let errorMessage = 'Failed to generate token';
      
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          errorMessage = "Invalid email or password";
        } else if (error.response.data?.detail) {
          errorMessage = error.response.data.detail;
        }
      }
      
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshToken = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Use authService for token refresh
      await authService.refreshToken();
      
      // Get updated tokens
      const newTokens = {
        access: authService.getAuthState().tokens?.access || '',
        refresh: authService.getAuthState().tokens?.refresh || '',
        user: authService.getAuthState().user
      };
      
      setTokens(newTokens);
      
      toast({
        title: 'Success',
        description: 'Token refreshed successfully!'
      });
    } catch (error) {
      let errorMessage = 'Failed to refresh token';
      
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data?.detail || errorMessage;
      }
      
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearTokens = () => {
    authService.logout();
    setTokens(null);
    toast({
      title: 'Success',
      description: 'Tokens cleared successfully!'
    });
  };

  const handleCopyToken = (tokenType: 'access' | 'refresh') => {
    const token = tokens?.[tokenType];
    if (!token) return;

    navigator.clipboard.writeText(token);
    setCopied(true);
    toast({
      title: 'Copied',
      description: `${tokenType} token copied to clipboard!`
    });

    // Reset copied state after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">JWT Token Generator</h1>
      <p className="text-muted-foreground mb-8">
        Generate JWT tokens for authenticating with the backend API
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Generate Token</CardTitle>
            <CardDescription>
              Enter your credentials to generate a JWT token
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleGenerateToken}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm mb-4">
                  {error}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                type="button"
                onClick={handleClearTokens}
                disabled={isLoading || !tokens}
              >
                Clear Tokens
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? "Generating..." : "Generate Token"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Token Information</CardTitle>
            <CardDescription>
              Your generated JWT tokens
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tokens ? (
              <Tabs defaultValue="access">
                <TabsList className="mb-4">
                  <TabsTrigger value="access">Access Token</TabsTrigger>
                  <TabsTrigger value="refresh">Refresh Token</TabsTrigger>
                </TabsList>
                <TabsContent value="access" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Badge>Access Token</Badge>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleCopyToken('access')}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Textarea 
                    readOnly 
                    value={tokens.access}
                    className="font-mono text-xs h-32"
                  />
                  <Button 
                    onClick={handleRefreshToken}
                    disabled={isLoading}
                    className="w-full"
                  >
                    Refresh Token
                  </Button>
                </TabsContent>
                <TabsContent value="refresh" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Badge>Refresh Token</Badge>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleCopyToken('refresh')}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Textarea 
                    readOnly 
                    value={tokens.refresh}
                    className="font-mono text-xs h-32"
                  />
                  <p className="text-sm text-muted-foreground">
                    The refresh token is used to obtain a new access token when it expires.
                    Keep this token secure and don't share it.
                  </p>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No tokens generated yet. Fill in the form and click "Generate Token".
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            <p>
              Tokens are automatically stored in localStorage and will be used for API requests.
            </p>
          </CardFooter>
        </Card>
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
          <CardDescription>
            Instructions for using the JWT token in API requests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">1. Include in API Requests</h3>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
              <code>
                {`// Using axios
const response = await axios.get('http://localhost:8000/api/market-data/models/', {
  headers: {
    'Authorization': 'Bearer ${authService.getAccessToken()}'
  }
});

// Using fetch
const response = await fetch('http://localhost:8000/api/market-data/models/', {
  headers: {
    'Authorization': 'Bearer ${authService.getAccessToken()}'
  }
});`}
              </code>
            </pre>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">2. Handle Token Expiration</h3>
            <p className="text-sm mb-2">
              If you receive a 401 Unauthorized error, your access token may have expired.
              Use the refresh token to get a new access token:
            </p>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
              <code>
                {`// Refresh the token
const success = await authService.refreshToken();
if (!success) {
  throw new Error('Token refresh failed');
}

const newAccessToken = authService.getAccessToken();
if (!newAccessToken) {
  throw new Error('Failed to get new access token');
}`}
              </code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenGenerator;
