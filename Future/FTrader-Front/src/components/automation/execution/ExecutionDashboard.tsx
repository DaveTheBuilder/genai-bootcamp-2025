import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAutomation, Order, Position } from '../core/AutomationEngine';

const ExecutionDashboard: React.FC = () => {
  const { orders, positions } = useAutomation();
  const [activeTab, setActiveTab] = useState('positions');
  
  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'filled':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Filled</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700">Pending</Badge>;
      case 'canceled':
        return <Badge variant="outline" className="bg-red-50 text-red-700">Canceled</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  };
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Execution Dashboard</CardTitle>
          <CardDescription>Monitor orders and positions from automated strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="positions">Positions</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>
            
            <TabsContent value="positions">
              <div className="space-y-4">
                <div className="p-3 border rounded-lg">
                  <h3 className="font-medium">Open Positions</h3>
                  {positions.length === 0 ? (
                    <div className="mt-2 p-4 text-center bg-muted/30 rounded">
                      <p className="text-muted-foreground">No open positions</p>
                    </div>
                  ) : (
                    <div className="mt-2 space-y-2">
                      {positions.map((position) => (
                        <div 
                          key={position.id} 
                          className="flex items-center justify-between p-2 bg-muted/30 rounded"
                        >
                          <span>{position.instrument} {position.direction.toUpperCase()}</span>
                          <span className={position.unrealizedPnL >= 0 ? "text-green-600" : "text-red-600"}>
                            {formatCurrency(position.unrealizedPnL)} ({formatPercentage(position.unrealizedPnLPercent)})
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="p-3 border rounded-lg">
                  <h3 className="font-medium">Position Summary</h3>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="p-2 bg-muted/30 rounded">
                      <span className="text-sm text-muted-foreground">Total Value</span>
                      <p className="font-medium">
                        {formatCurrency(positions.reduce((sum, pos) => sum + pos.currentValue, 0))}
                      </p>
                    </div>
                    <div className="p-2 bg-muted/30 rounded">
                      <span className="text-sm text-muted-foreground">Unrealized P&L</span>
                      <p className={
                        positions.reduce((sum, pos) => sum + pos.unrealizedPnL, 0) >= 0 
                          ? "font-medium text-green-600" 
                          : "font-medium text-red-600"
                      }>
                        {formatCurrency(positions.reduce((sum, pos) => sum + pos.unrealizedPnL, 0))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="orders">
              <div className="space-y-4">
                <div className="p-3 border rounded-lg">
                  <h3 className="font-medium">Recent Orders</h3>
                  {orders.length === 0 ? (
                    <div className="mt-2 p-4 text-center bg-muted/30 rounded">
                      <p className="text-muted-foreground">No recent orders</p>
                    </div>
                  ) : (
                    <div className="mt-2 space-y-2">
                      {orders.map((order) => (
                        <div 
                          key={order.id} 
                          className="flex items-center justify-between p-2 bg-muted/30 rounded"
                        >
                          <div>
                            <span>
                              {order.direction === 'buy' ? 'Buy' : 'Sell'} {order.instrument}
                            </span>
                            <p className="text-xs text-muted-foreground">
                              {order.quantity} @ {formatCurrency(order.price)}
                            </p>
                          </div>
                          {getOrderStatusBadge(order.status)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Execution Settings</CardTitle>
          <CardDescription>Configure order execution parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 border rounded-lg">
              <h3 className="font-medium mb-2">Default Order Type</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" className="bg-primary/10">Market</Button>
                <Button variant="outline">Limit</Button>
                <Button variant="outline">Stop</Button>
              </div>
            </div>
            
            <div className="p-3 border rounded-lg">
              <h3 className="font-medium mb-2">Position Sizing</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline">Fixed</Button>
                <Button variant="outline" className="bg-primary/10">Percent</Button>
                <Button variant="outline">Risk</Button>
              </div>
              <div className="mt-2">
                <Label htmlFor="position-size">Position Size (%)</Label>
                <input 
                  type="range" 
                  id="position-size" 
                  min="1" 
                  max="20" 
                  defaultValue="5" 
                  className="w-full" 
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1%</span>
                  <span>5%</span>
                  <span>10%</span>
                  <span>20%</span>
                </div>
              </div>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Slippage Protection</h3>
                <Switch defaultChecked />
              </div>
              <Label htmlFor="slippage">Max Slippage (%)</Label>
              <input 
                type="range" 
                id="slippage" 
                min="0.1" 
                max="1" 
                step="0.1"
                defaultValue="0.5" 
                className="w-full" 
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0.1%</span>
                <span>0.5%</span>
                <span>1.0%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutionDashboard;
