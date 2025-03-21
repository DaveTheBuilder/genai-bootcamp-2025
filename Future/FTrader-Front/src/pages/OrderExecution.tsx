import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';

// Define types for order data
interface Order {
  order_id: string;
  symbol: string;
  order_type: 'market' | 'limit';
  side: 'buy' | 'sell';
  price: number | null;
  quantity: number;
  status: 'pending' | 'filled' | 'canceled' | 'rejected';
  timestamp: string;
}

const OrderExecution: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('new-order');
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // New order form state
  const [orderForm, setOrderForm] = useState({
    symbol: 'AAPL',
    order_type: 'limit',
    side: 'buy',
    price: '',
    quantity: ''
  });

  // Mock symbols for select dropdown
  const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'BTC-USD', 'ETH-USD'];

  // Load active orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock orders data
      const mockOrders: Order[] = [
        {
          order_id: 'ord-001',
          symbol: 'AAPL',
          order_type: 'limit',
          side: 'buy',
          price: 180.00,
          quantity: 10,
          status: 'pending',
          timestamp: '2025-03-08T12:34:56Z'
        },
        {
          order_id: 'ord-002',
          symbol: 'BTC-USD',
          order_type: 'market',
          side: 'sell',
          price: null,
          quantity: 0.5,
          status: 'filled',
          timestamp: '2025-03-08T11:22:33Z'
        },
        {
          order_id: 'ord-003',
          symbol: 'MSFT',
          order_type: 'limit',
          side: 'buy',
          price: 410.50,
          quantity: 5,
          status: 'pending',
          timestamp: '2025-03-08T10:15:00Z'
        }
      ];
      
      setOrders(mockOrders);
    };
    
    fetchOrders();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle select input changes
  const handleSelectChange = (name: string, value: string) => {
    setOrderForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle order submission
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate form
      if (!orderForm.symbol || !orderForm.quantity) {
        throw new Error('Please fill in all required fields');
      }
      
      if (orderForm.order_type === 'limit' && !orderForm.price) {
        throw new Error('Limit orders require a price');
      }
      
      // Convert string values to numbers
      const quantity = parseFloat(orderForm.quantity);
      const price = orderForm.price ? parseFloat(orderForm.price) : null;
      
      if (isNaN(quantity) || quantity <= 0) {
        throw new Error('Quantity must be a positive number');
      }
      
      if (orderForm.order_type === 'limit' && (isNaN(price as number) || (price as number) <= 0)) {
        throw new Error('Price must be a positive number');
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create new order object
      const newOrder: Order = {
        order_id: `ord-${Math.floor(Math.random() * 1000)}`,
        symbol: orderForm.symbol,
        order_type: orderForm.order_type as 'market' | 'limit',
        side: orderForm.side as 'buy' | 'sell',
        price: price,
        quantity: quantity,
        status: 'pending',
        timestamp: new Date().toISOString()
      };
      
      // Add to orders list
      setOrders(prev => [newOrder, ...prev]);
      
      // Show success notification
      toast({
        title: 'Order Placed',
        description: `Successfully placed a ${orderForm.side} order for ${quantity} ${orderForm.symbol}`,
      });
      
      // Reset form for market orders, keep symbol and side for limit orders
      setOrderForm(prev => ({
        ...prev,
        price: '',
        quantity: ''
      }));
      
      // Switch to active orders tab
      setActiveTab('active-orders');
      
    } catch (error) {
      toast({
        title: 'Order Failed',
        description: error instanceof Error ? error.message : 'Failed to place order',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle order cancellation
  const handleCancelOrder = async (orderId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update order status
      setOrders(prev => 
        prev.map(order => 
          order.order_id === orderId 
            ? { ...order, status: 'canceled' } 
            : order
        )
      );
      
      // Show success notification
      toast({
        title: 'Order Canceled',
        description: `Successfully canceled order ${orderId}`,
      });
      
    } catch (error) {
      toast({
        title: 'Cancellation Failed',
        description: 'Failed to cancel order',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6 max-w-screen-2xl">
      <h1 className="text-2xl font-bold">Order Execution</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="new-order">New Order</TabsTrigger>
          <TabsTrigger value="active-orders">Active Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new-order">
          <Card>
            <CardHeader>
              <CardTitle>Place New Order</CardTitle>
              <CardDescription>
                Enter the details for your order
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmitOrder}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Symbol */}
                  <div className="space-y-2">
                    <Label htmlFor="symbol">Symbol</Label>
                    <Select 
                      value={orderForm.symbol} 
                      onValueChange={(value) => handleSelectChange('symbol', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Symbol" />
                      </SelectTrigger>
                      <SelectContent>
                        {symbols.map(symbol => (
                          <SelectItem key={symbol} value={symbol}>
                            {symbol}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Order Type */}
                  <div className="space-y-2">
                    <Label htmlFor="order_type">Order Type</Label>
                    <Select 
                      value={orderForm.order_type} 
                      onValueChange={(value) => handleSelectChange('order_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Order Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="market">Market</SelectItem>
                        <SelectItem value="limit">Limit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Side */}
                  <div className="space-y-2">
                    <Label htmlFor="side">Side</Label>
                    <Select 
                      value={orderForm.side} 
                      onValueChange={(value) => handleSelectChange('side', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Side" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buy">Buy</SelectItem>
                        <SelectItem value="sell">Sell</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Price (for limit orders) */}
                  {orderForm.order_type === 'limit' && (
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="Enter price"
                        value={orderForm.price}
                        onChange={handleInputChange}
                      />
                    </div>
                  )}
                  
                  {/* Quantity */}
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="Enter quantity"
                      value={orderForm.quantity}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                {/* Order summary */}
                {(orderForm.symbol && orderForm.quantity) && (
                  <div className="mt-4 p-4 bg-muted rounded-md">
                    <h3 className="font-medium mb-2">Order Summary</h3>
                    <p>
                      {orderForm.side === 'buy' ? 'Buy' : 'Sell'} {orderForm.quantity} {orderForm.symbol} at 
                      {orderForm.order_type === 'market' 
                        ? ' market price' 
                        : orderForm.price ? ` $${orderForm.price} per unit` : ' (please enter price)'}
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                      Placing Order...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="active-orders">
          <Card>
            <CardHeader>
              <CardTitle>Active Orders</CardTitle>
              <CardDescription>
                View and manage your active orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Side</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <TableRow key={order.order_id}>
                          <TableCell className="font-medium">{order.order_id}</TableCell>
                          <TableCell>{order.symbol}</TableCell>
                          <TableCell>{order.order_type}</TableCell>
                          <TableCell className={order.side === 'buy' ? 'text-green-500' : 'text-red-500'}>
                            {order.side}
                          </TableCell>
                          <TableCell className="text-right">
                            {order.price ? `$${order.price.toFixed(2)}` : 'Market'}
                          </TableCell>
                          <TableCell className="text-right">{order.quantity}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'filled' ? 'bg-green-100 text-green-800' :
                              order.status === 'canceled' ? 'bg-gray-100 text-gray-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {order.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            {new Date(order.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {order.status === 'pending' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleCancelOrder(order.order_id)}
                              >
                                Cancel
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-4 text-muted-foreground">
                          No active orders
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderExecution;
