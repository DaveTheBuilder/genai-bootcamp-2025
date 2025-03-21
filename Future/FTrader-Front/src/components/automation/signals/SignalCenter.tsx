import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAutomation, Signal, SignalSource } from '../core/AutomationEngine';

export const SignalCenter: React.FC = () => {
  const { signals, enableSignalSource, disableSignalSource, signalSources } = useAutomation();
  const [activeTab, setActiveTab] = useState('active');
  const [filteredSignals, setFilteredSignals] = useState<Signal[]>([]);
  
  // Filter signals based on active tab
  useEffect(() => {
    if (activeTab === 'active') {
      setFilteredSignals(signals.filter(signal => signal.status === 'pending' || signal.status === 'confirmed'));
    } else if (activeTab === 'pending') {
      setFilteredSignals(signals.filter(signal => signal.status === 'pending'));
    } else if (activeTab === 'processed') {
      setFilteredSignals(signals.filter(signal => signal.status === 'executed' || signal.status === 'rejected'));
    } else {
      setFilteredSignals(signals);
    }
  }, [activeTab, signals]);
  
  const getSignalBadgeVariant = (strength: number) => {
    if (strength > 0.7) return 'bg-green-100 text-green-800 border-green-200';
    if (strength > 0.3) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };
  
  const getSignalLabel = (signal: Signal) => {
    if (signal.direction === 'long') {
      return signal.strength > 0.7 ? 'Strong Buy' : 'Buy';
    } else if (signal.direction === 'short') {
      return signal.strength > 0.7 ? 'Strong Sell' : 'Sell';
    } else {
      return 'Exit';
    }
  };
  
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes === 1) return '1 min ago';
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };
  
  const getSourceDisplayName = (source: string) => {
    switch (source) {
      case 'pattern':
        return 'Pattern Recognition';
      case 'sentiment':
        return 'Sentiment Analysis';
      case 'orderflow':
        return 'Order Flow Analysis';
      case 'regime':
        return 'Market Regime Detection';
      default:
        return source.charAt(0).toUpperCase() + source.slice(1);
    }
  };
  
  // Helper function to find if a signal source is enabled
  const isSignalSourceEnabled = (sourceType: string): boolean => {
    return signalSources.some(source => source.type === sourceType && source.isEnabled);
  };
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Signal Center</CardTitle>
          <CardDescription>Monitor and manage trading signals from all sources</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="processed">Processed</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
            
            <div className="space-y-4">
              {filteredSignals.length === 0 ? (
                <div className="p-4 text-center border rounded-lg bg-muted/30">
                  <p className="text-muted-foreground">No signals in this category</p>
                </div>
              ) : (
                filteredSignals.map((signal) => {
                  const badgeVariant = getSignalBadgeVariant(signal.strength);
                  const signalLabel = getSignalLabel(signal);
                  const timeAgo = formatTimeAgo(signal.timestamp);
                  const sourceName = getSourceDisplayName(signal.source);
                  
                  return (
                    <div 
                      key={signal.id} 
                      className={`flex items-center justify-between p-3 border rounded-lg ${
                        signal.direction === 'long' ? 'bg-green-50' : 
                        signal.direction === 'short' ? 'bg-red-50' : 'bg-gray-50'
                      }`}
                    >
                      <div>
                        <h3 className="font-medium">{signal.instrument} {signal.direction.toUpperCase()} Signal</h3>
                        <p className="text-sm text-muted-foreground">{sourceName} • {timeAgo}</p>
                      </div>
                      <Badge className={badgeVariant}>
                        {signalLabel}
                      </Badge>
                    </div>
                  );
                })
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Signal Configuration</CardTitle>
          <CardDescription>Configure signal sources and parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h3 className="font-medium">Pattern Recognition</h3>
                <p className="text-sm text-muted-foreground">Chart pattern signals</p>
              </div>
              <Switch 
                checked={isSignalSourceEnabled('pattern')}
                onCheckedChange={(checked) => 
                  checked ? enableSignalSource('pattern-recognition') : disableSignalSource('pattern-recognition')
                }
              />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h3 className="font-medium">Sentiment Analysis</h3>
                <p className="text-sm text-muted-foreground">News and social media signals</p>
              </div>
              <Switch 
                checked={isSignalSourceEnabled('sentiment')}
                onCheckedChange={(checked) => 
                  checked ? enableSignalSource('sentiment-analysis') : disableSignalSource('sentiment-analysis')
                }
              />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h3 className="font-medium">Order Flow Analysis</h3>
                <p className="text-sm text-muted-foreground">Market depth and volume signals</p>
              </div>
              <Switch 
                checked={isSignalSourceEnabled('orderflow')}
                onCheckedChange={(checked) => 
                  checked ? enableSignalSource('order-flow') : disableSignalSource('order-flow')
                }
              />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h3 className="font-medium">Market Regime Detection</h3>
                <p className="text-sm text-muted-foreground">Market condition signals</p>
              </div>
              <Switch 
                checked={isSignalSourceEnabled('regime')}
                onCheckedChange={(checked) => 
                  checked ? enableSignalSource('market-regime') : disableSignalSource('market-regime')
                }
              />
            </div>
            
            <div className="mt-6">
              <Button className="w-full">Configure Signal Parameters</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
