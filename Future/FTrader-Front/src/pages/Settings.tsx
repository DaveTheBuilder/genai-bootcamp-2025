import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Bell, Moon, Shield, User, Globe, Code, LineChart } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import IGConnectivityTest from '@/components/IGConnectivityTest';
import IGProxyConnectivityTest from '@/components/IGProxyConnectivityTest';
import StreamingSettingsPage from '@/pages/settings/StreamingSettingsPage';

const Settings: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Get settings from store
  const settings = useSettingsStore();
  
  // Load user preferences on component mount
  useEffect(() => {
    const fetchPreferences = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, we would fetch user preferences from the API
      // const response = await userService.getPreferences();
      // setPreferences(response.data);
      
      setIsLoading(false);
    };
    
    fetchPreferences();
  }, []);

  // Handle save preferences
  const handleSavePreferences = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, we would save preferences to the API
      // await userService.updatePreferences(preferences);
      
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save your preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6 max-w-screen-xl">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Tabs defaultValue="appearance">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-64 space-y-4">
              <TabsList className="flex flex-col h-auto w-full p-0 bg-transparent space-y-1">
                <TabsTrigger 
                  value="appearance" 
                  className="justify-start px-4 py-2 h-10 w-full"
                >
                  <Moon className="h-4 w-4 mr-2" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger 
                  value="notifications" 
                  className="justify-start px-4 py-2 h-10 w-full"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="justify-start px-4 py-2 h-10 w-full"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger 
                  value="display" 
                  className="justify-start px-4 py-2 h-10 w-full"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Display
                </TabsTrigger>
                <TabsTrigger 
                  value="account" 
                  className="justify-start px-4 py-2 h-10 w-full"
                >
                  <User className="h-4 w-4 mr-2" />
                  Account
                </TabsTrigger>
                <TabsTrigger 
                  value="developer" 
                  className="justify-start px-4 py-2 h-10 w-full"
                >
                  <Code className="h-4 w-4 mr-2" />
                  Developer Options
                </TabsTrigger>
                <TabsTrigger 
                  value="streaming" 
                  className="justify-start px-4 py-2 h-10 w-full"
                >
                  <LineChart className="h-4 w-4 mr-2" />
                  Streaming
                </TabsTrigger>
              </TabsList>
              
              <div className="hidden md:block">
                <Button 
                  onClick={handleSavePreferences} 
                  className="w-full"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex-1">
              <TabsContent value="appearance" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                      Customize how FTrader looks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="dark-mode">Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable dark mode for a better viewing experience in low light
                        </p>
                      </div>
                      <Switch 
                        id="dark-mode"
                        checked={settings.darkMode}
                        onCheckedChange={settings.setDarkMode}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="compact-view">Compact View</Label>
                        <p className="text-sm text-muted-foreground">
                          Reduce spacing to show more content on screen
                        </p>
                      </div>
                      <Switch 
                        id="compact-view"
                        checked={settings.compactView}
                        onCheckedChange={settings.setCompactView}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>
                      Manage your notification preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="trade-alerts">Trade Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when your orders are executed
                        </p>
                      </div>
                      <Switch 
                        id="trade-alerts"
                        checked={settings.tradeAlerts}
                        onCheckedChange={settings.setTradeAlerts}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="price-alerts">Price Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when prices hit your targets
                        </p>
                      </div>
                      <Switch 
                        id="price-alerts"
                        checked={settings.priceAlerts}
                        onCheckedChange={settings.setPriceAlerts}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="news-alerts">News Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified about important market news
                        </p>
                      </div>
                      <Switch 
                        id="news-alerts"
                        checked={settings.newsAlerts}
                        onCheckedChange={settings.setNewsAlerts}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive important notifications via email
                        </p>
                      </div>
                      <Switch 
                        id="email-notifications"
                        checked={settings.emailNotifications}
                        onCheckedChange={settings.setEmailNotifications}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>
                      Manage your account security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch 
                        id="two-factor"
                        checked={settings.twoFactorAuth}
                        onCheckedChange={settings.setTwoFactorAuth}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="login-notifications">Login Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when someone logs into your account
                        </p>
                      </div>
                      <Switch 
                        id="login-notifications"
                        checked={settings.loginNotifications}
                        onCheckedChange={settings.setLoginNotifications}
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          toast({
                            description: "Password change functionality will be implemented in a future update.",
                          });
                        }}
                      >
                        Change Password
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="display" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Display Settings</CardTitle>
                    <CardDescription>
                      Customize regional settings and display preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select 
                          value={settings.currency} 
                          onValueChange={settings.setCurrency}
                        >
                          <SelectTrigger id="currency">
                            <SelectValue placeholder="Select Currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="GBP">GBP - British Pound</SelectItem>
                            <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                            <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select 
                          value={settings.language} 
                          onValueChange={settings.setLanguage}
                        >
                          <SelectTrigger id="language">
                            <SelectValue placeholder="Select Language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="ja">Japanese</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select 
                          value={settings.timezone} 
                          onValueChange={settings.setTimezone}
                        >
                          <SelectTrigger id="timezone">
                            <SelectValue placeholder="Select Timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UTC">UTC - Coordinated Universal Time</SelectItem>
                            <SelectItem value="EST">EST - Eastern Standard Time</SelectItem>
                            <SelectItem value="CST">CST - Central Standard Time</SelectItem>
                            <SelectItem value="MST">MST - Mountain Standard Time</SelectItem>
                            <SelectItem value="PST">PST - Pacific Standard Time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="account" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>
                      Manage your account details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value="John Doe" disabled />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" value="john.doe@example.com" disabled />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="account-id">Account ID</Label>
                      <Input id="account-id" value="FT-12345" disabled />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="account-type">Account Type</Label>
                      <Input id="account-type" value="Standard" disabled />
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        variant="outline" 
                        className="text-red-500 hover:text-red-600"
                        onClick={() => {
                          toast({
                            description: "Account deletion functionality will be implemented in a future update.",
                          });
                        }}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="developer" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Developer Options</CardTitle>
                    <CardDescription>
                      Advanced settings for developers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="offline-mode">Offline Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Use mock data instead of live API connections for testing and development
                        </p>
                      </div>
                      <Switch 
                        id="offline-mode"
                        checked={settings.offlineMode}
                        onCheckedChange={settings.setOfflineMode}
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          settings.resetSettings();
                          toast({
                            title: "Settings Reset",
                            description: "All settings have been reset to their default values.",
                          });
                        }}
                      >
                        Reset All Settings
                      </Button>
                    </div>

                    <div className="pt-6 border-t">
                      <h3 className="text-lg font-medium mb-4">API Connectivity</h3>
                      <Tabs defaultValue="ig" className="w-full">
                        <TabsList className="mb-4">
                          <TabsTrigger value="ig">IG API</TabsTrigger>
                          <TabsTrigger value="other" disabled>Other APIs</TabsTrigger>
                        </TabsList>
                        <TabsContent value="ig">
                          <Tabs defaultValue="proxy">
                            <TabsList className="mb-4">
                              <TabsTrigger value="proxy">Via Proxy (Recommended)</TabsTrigger>
                              <TabsTrigger value="direct">Direct Connection</TabsTrigger>
                            </TabsList>
                            <TabsContent value="proxy">
                              <IGProxyConnectivityTest />
                            </TabsContent>
                            <TabsContent value="direct">
                              <IGConnectivityTest />
                            </TabsContent>
                          </Tabs>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="streaming" className="m-0">
                <StreamingSettingsPage />
              </TabsContent>
            </div>
          </div>
          
          <div className="mt-6 md:hidden">
            <Button 
              onClick={handleSavePreferences} 
              className="w-full"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </Tabs>
      )}
    </div>
  );
};

export default Settings;
