import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart, 
  ArrowUpDown, 
  RefreshCw,
  Download,
  Layers,
  ArrowUp,
  ArrowDown,
  Activity,
  BarChart4,
  Clock,
  LineChart
} from "lucide-react";

// Mock order flow data
const mockOrderFlowData = {
  symbol: "IX.D.FTSE.DAILY.IP",
  name: "FTSE 100",
  lastPrice: 8245.32,
  bidPrice: 8245.25,
  askPrice: 8245.50,
  spread: 0.25,
  marketDepth: {
    bids: [
      { price: 8245.25, volume: 125, orders: 8 },
      { price: 8245.00, volume: 210, orders: 12 },
      { price: 8244.75, volume: 185, orders: 7 },
      { price: 8244.50, volume: 320, orders: 15 },
      { price: 8244.25, volume: 150, orders: 5 },
      { price: 8244.00, volume: 275, orders: 9 },
      { price: 8243.75, volume: 190, orders: 6 },
      { price: 8243.50, volume: 230, orders: 11 },
      { price: 8243.25, volume: 175, orders: 8 },
      { price: 8243.00, volume: 290, orders: 14 },
    ],
    asks: [
      { price: 8245.50, volume: 110, orders: 6 },
      { price: 8245.75, volume: 180, orders: 9 },
      { price: 8246.00, volume: 145, orders: 5 },
      { price: 8246.25, volume: 260, orders: 12 },
      { price: 8246.50, volume: 130, orders: 4 },
      { price: 8246.75, volume: 195, orders: 8 },
      { price: 8247.00, volume: 220, orders: 10 },
      { price: 8247.25, volume: 170, orders: 7 },
      { price: 8247.50, volume: 240, orders: 11 },
      { price: 8247.75, volume: 135, orders: 6 },
    ]
  },
  timeAndSales: [
    { time: "12:04:32", price: 8245.50, volume: 25, direction: "buy", aggressor: "buyer" },
    { time: "12:04:28", price: 8245.25, volume: 18, direction: "sell", aggressor: "seller" },
    { time: "12:04:15", price: 8245.50, volume: 32, direction: "buy", aggressor: "buyer" },
    { time: "12:04:03", price: 8245.75, volume: 45, direction: "buy", aggressor: "buyer" },
    { time: "12:03:58", price: 8245.25, volume: 15, direction: "sell", aggressor: "seller" },
    { time: "12:03:42", price: 8245.00, volume: 28, direction: "sell", aggressor: "seller" },
    { time: "12:03:37", price: 8245.25, volume: 22, direction: "sell", aggressor: "seller" },
    { time: "12:03:21", price: 8245.50, volume: 37, direction: "buy", aggressor: "buyer" },
    { time: "12:03:15", price: 8245.75, volume: 42, direction: "buy", aggressor: "buyer" },
    { time: "12:03:02", price: 8245.50, volume: 19, direction: "buy", aggressor: "buyer" },
  ],
  volumeProfile: {
    priceRange: { high: 8248.00, low: 8242.00 },
    pointOfControl: 8245.50,
    valueAreaHigh: 8246.75,
    valueAreaLow: 8244.25,
    volumes: [
      { price: 8248.00, volume: 120, bidVolume: 45, askVolume: 75 },
      { price: 8247.50, volume: 180, bidVolume: 65, askVolume: 115 },
      { price: 8247.00, volume: 240, bidVolume: 90, askVolume: 150 },
      { price: 8246.50, volume: 320, bidVolume: 130, askVolume: 190 },
      { price: 8246.00, volume: 420, bidVolume: 180, askVolume: 240 },
      { price: 8245.50, volume: 580, bidVolume: 310, askVolume: 270 },
      { price: 8245.00, volume: 510, bidVolume: 290, askVolume: 220 },
      { price: 8244.50, volume: 380, bidVolume: 220, askVolume: 160 },
      { price: 8244.00, volume: 290, bidVolume: 170, askVolume: 120 },
      { price: 8243.50, volume: 210, bidVolume: 125, askVolume: 85 },
      { price: 8243.00, volume: 160, bidVolume: 95, askVolume: 65 },
      { price: 8242.50, volume: 130, bidVolume: 80, askVolume: 50 },
      { price: 8242.00, volume: 90, bidVolume: 55, askVolume: 35 },
    ]
  },
  volumeDelta: {
    cumulative: 285,
    byBar: [
      { time: "11:30", delta: -45, volume: 320 },
      { time: "11:45", delta: 65, volume: 410 },
      { time: "12:00", delta: 120, volume: 480 },
      { time: "12:15", delta: 85, volume: 390 },
      { time: "12:30", delta: -35, volume: 350 },
      { time: "12:45", delta: 95, volume: 420 },
    ]
  },
  largeOrders: [
    { time: "11:52:15", price: 8246.25, volume: 120, type: "bid", status: "active" },
    { time: "11:48:32", price: 8244.00, volume: 150, type: "ask", status: "filled" },
    { time: "11:43:18", price: 8245.75, volume: 180, type: "bid", status: "partial" },
    { time: "11:37:45", price: 8243.50, volume: 135, type: "ask", status: "canceled" },
  ]
};

// Helper function to format volume
const formatVolume = (volume: number) => {
  return volume.toLocaleString();
};

// Helper function to get direction color
const getDirectionColor = (direction: string) => {
  return direction === "buy" ? "text-green-500" : "text-red-500";
};

// Helper function to get direction icon
const getDirectionIcon = (direction: string) => {
  return direction === "buy" ? 
    <ArrowUp className="h-4 w-4 text-green-500" /> : 
    <ArrowDown className="h-4 w-4 text-red-500" />;
};

const OrderFlowAnalysis: React.FC = () => {
  const [selectedInstrument, setSelectedInstrument] = useState("ftse");
  const [depthLevels, setDepthLevels] = useState("10");
  const [volumeProfilePeriod, setVolumeProfilePeriod] = useState("session");
  const [activeTab, setActiveTab] = useState("market_depth");
  
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Configuration Panel */}
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Order Flow Analysis</CardTitle>
          <CardDescription>Analyze market microstructure and institutional activity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Instrument Selection */}
          <div className="space-y-2">
            <Label htmlFor="instrument">Instrument</Label>
            <Select defaultValue="ftse" onValueChange={setSelectedInstrument}>
              <SelectTrigger id="instrument">
                <SelectValue placeholder="Select instrument" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ftse">FTSE 100</SelectItem>
                <SelectItem value="dax">DAX</SelectItem>
                <SelectItem value="eurusd">EUR/USD</SelectItem>
                <SelectItem value="gbpusd">GBP/USD</SelectItem>
                <SelectItem value="crude">Brent Crude</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Market Depth Settings */}
          <div className="space-y-2">
            <Label htmlFor="depth">Market Depth Levels</Label>
            <Select defaultValue="10" onValueChange={setDepthLevels}>
              <SelectTrigger id="depth">
                <SelectValue placeholder="Select depth levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 Levels</SelectItem>
                <SelectItem value="10">10 Levels</SelectItem>
                <SelectItem value="20">20 Levels</SelectItem>
                <SelectItem value="50">50 Levels</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Volume Profile Settings */}
          <div className="space-y-2">
            <Label htmlFor="profile">Volume Profile Period</Label>
            <Select defaultValue="session" onValueChange={setVolumeProfilePeriod}>
              <SelectTrigger id="profile">
                <SelectValue placeholder="Select profile period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="session">Current Session</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Display Options */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-medium">Display Options</h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="heatmap" className="cursor-pointer">Show Depth Heatmap</Label>
              <input type="checkbox" id="heatmap" className="toggle" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="delta" className="cursor-pointer">Show Volume Delta</Label>
              <input type="checkbox" id="delta" className="toggle" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="large" className="cursor-pointer">Highlight Large Orders</Label>
              <input type="checkbox" id="large" className="toggle" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="imbalance" className="cursor-pointer">Show Imbalance Zones</Label>
              <input type="checkbox" id="imbalance" className="toggle" defaultChecked />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Update Order Flow Data
          </Button>
        </CardFooter>
      </Card>

      {/* Results Panel */}
      <div className="col-span-9 space-y-6">
        {/* Instrument Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{mockOrderFlowData.name}</h2>
                <p className="text-muted-foreground">{mockOrderFlowData.symbol}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{mockOrderFlowData.lastPrice}</div>
                <div className="flex items-center justify-end space-x-2">
                  <Badge variant="outline" className="text-green-500">
                    Bid: {mockOrderFlowData.bidPrice}
                  </Badge>
                  <Badge variant="outline" className="text-red-500">
                    Ask: {mockOrderFlowData.askPrice}
                  </Badge>
                  <Badge variant="outline">
                    Spread: {mockOrderFlowData.spread}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Flow Tabs */}
        <Tabs defaultValue="market_depth" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="market_depth">Market Depth</TabsTrigger>
            <TabsTrigger value="volume_profile">Volume Profile</TabsTrigger>
            <TabsTrigger value="time_sales">Time & Sales</TabsTrigger>
            <TabsTrigger value="large_orders">Large Orders</TabsTrigger>
          </TabsList>
          
          {/* Market Depth Tab */}
          <TabsContent value="market_depth" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Market Depth</CardTitle>
                    <CardDescription>
                      Order book showing {depthLevels} levels of market depth
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  {/* Bid Side */}
                  <div>
                    <div className="flex justify-between font-medium text-sm mb-2">
                      <span>Bid Price</span>
                      <span>Volume</span>
                      <span>Orders</span>
                    </div>
                    <div className="space-y-1">
                      {mockOrderFlowData.marketDepth.bids.map((level, index) => (
                        <div 
                          key={index} 
                          className="flex justify-between items-center p-2 rounded-md"
                          style={{ 
                            backgroundColor: `rgba(34, 197, 94, ${0.05 + (0.2 * (1 - index / mockOrderFlowData.marketDepth.bids.length))})` 
                          }}
                        >
                          <span className="font-medium">{level.price}</span>
                          <span>{formatVolume(level.volume)}</span>
                          <span>{level.orders}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Ask Side */}
                  <div>
                    <div className="flex justify-between font-medium text-sm mb-2">
                      <span>Ask Price</span>
                      <span>Volume</span>
                      <span>Orders</span>
                    </div>
                    <div className="space-y-1">
                      {mockOrderFlowData.marketDepth.asks.map((level, index) => (
                        <div 
                          key={index} 
                          className="flex justify-between items-center p-2 rounded-md"
                          style={{ 
                            backgroundColor: `rgba(239, 68, 68, ${0.05 + (0.2 * (1 - index / mockOrderFlowData.marketDepth.asks.length))})` 
                          }}
                        >
                          <span className="font-medium">{level.price}</span>
                          <span>{formatVolume(level.volume)}</span>
                          <span>{level.orders}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Market Depth Visualization Placeholder */}
                <div className="mt-8 border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Market Depth Heatmap</h3>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <BarChart className="h-16 w-16 mx-auto mb-2" />
                      <p>Market depth heatmap would be displayed here</p>
                      <p className="text-sm">In a real implementation, this would show a visual representation of the order book</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Volume Profile Tab */}
          <TabsContent value="volume_profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Volume Profile</CardTitle>
                    <CardDescription>
                      Volume distribution by price level for {volumeProfilePeriod} period
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                      <div className="flex items-center">
                        <Layers className="h-5 w-5 mr-2 text-blue-500" />
                        <span className="font-medium">Point of Control</span>
                      </div>
                      <span className="font-bold">{mockOrderFlowData.volumeProfile.pointOfControl}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                      <div className="flex items-center">
                        <ArrowUp className="h-5 w-5 mr-2 text-green-500" />
                        <span className="font-medium">Value Area High</span>
                      </div>
                      <span className="font-bold">{mockOrderFlowData.volumeProfile.valueAreaHigh}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                      <div className="flex items-center">
                        <ArrowDown className="h-5 w-5 mr-2 text-red-500" />
                        <span className="font-medium">Value Area Low</span>
                      </div>
                      <span className="font-bold">{mockOrderFlowData.volumeProfile.valueAreaLow}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                      <div className="flex items-center">
                        <Activity className="h-5 w-5 mr-2 text-purple-500" />
                        <span className="font-medium">Volume Delta</span>
                      </div>
                      <span className={`font-bold ${mockOrderFlowData.volumeDelta.cumulative >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {mockOrderFlowData.volumeDelta.cumulative > 0 ? '+' : ''}{mockOrderFlowData.volumeDelta.cumulative}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Volume Distribution</h3>
                    <div className="space-y-1">
                      {mockOrderFlowData.volumeProfile.volumes.slice(0, 8).map((level, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-16 text-right mr-2">
                            <span className={level.price === mockOrderFlowData.volumeProfile.pointOfControl ? 'font-bold' : ''}>
                              {level.price}
                            </span>
                          </div>
                          <div className="flex-1 flex">
                            <div 
                              className="bg-green-500 h-5 rounded-l-sm" 
                              style={{ width: `${(level.bidVolume / level.volume) * 100}%` }}
                            ></div>
                            <div 
                              className="bg-red-500 h-5 rounded-r-sm" 
                              style={{ width: `${(level.askVolume / level.volume) * 100}%` }}
                            ></div>
                          </div>
                          <div className="w-16 text-right ml-2">
                            <span className="text-xs">{formatVolume(level.volume)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Volume Profile Visualization Placeholder */}
                <div className="mt-8 border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Volume Profile Chart</h3>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <BarChart4 className="h-16 w-16 mx-auto mb-2" />
                      <p>Volume profile chart would be displayed here</p>
                      <p className="text-sm">In a real implementation, this would show volume distribution by price with bid/ask breakdown</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Time & Sales Tab */}
          <TabsContent value="time_sales" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Time & Sales</CardTitle>
                    <CardDescription>
                      Real-time transaction data showing trades as they occur
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Time</th>
                        <th className="text-right py-3 px-4">Price</th>
                        <th className="text-right py-3 px-4">Volume</th>
                        <th className="text-center py-3 px-4">Direction</th>
                        <th className="text-left py-3 px-4">Aggressor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockOrderFlowData.timeAndSales.map((trade, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            {trade.time}
                          </td>
                          <td className={`text-right py-3 px-4 ${getDirectionColor(trade.direction)}`}>
                            {trade.price}
                          </td>
                          <td className="text-right py-3 px-4">
                            {formatVolume(trade.volume)}
                          </td>
                          <td className="text-center py-3 px-4">
                            {getDirectionIcon(trade.direction)}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={trade.aggressor === "buyer" ? "default" : "destructive"} className="capitalize">
                              {trade.aggressor}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Volume Delta Visualization Placeholder */}
                <div className="mt-8 border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Volume Delta Chart</h3>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <BarChart className="h-16 w-16 mx-auto mb-2" />
                      <p>Volume delta chart would be displayed here</p>
                      <p className="text-sm">In a real implementation, this would show the difference between buying and selling volume over time</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Large Orders Tab */}
          <TabsContent value="large_orders" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Large Orders & Institutional Activity</CardTitle>
                    <CardDescription>
                      Detection of significant market orders and potential institutional activity
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Time</th>
                        <th className="text-right py-3 px-4">Price</th>
                        <th className="text-right py-3 px-4">Volume</th>
                        <th className="text-left py-3 px-4">Type</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Significance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockOrderFlowData.largeOrders.map((order, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            {order.time}
                          </td>
                          <td className="text-right py-3 px-4">
                            {order.price}
                          </td>
                          <td className="text-right py-3 px-4 font-medium">
                            {formatVolume(order.volume)}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={order.type === "bid" ? "default" : "destructive"} className="capitalize">
                              {order.type}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 capitalize">
                            {order.status}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className={`${order.type === "bid" ? 'bg-green-500' : 'bg-red-500'} h-2 rounded-full`} 
                                  style={{ width: `${(order.volume / 200) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs">
                                {order.volume > 150 ? "High" : order.volume > 100 ? "Medium" : "Low"}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Liquidity Zones Visualization Placeholder */}
                <div className="mt-8 border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Liquidity Zones</h3>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <LineChart className="h-16 w-16 mx-auto mb-2" />
                      <p>Liquidity zones chart would be displayed here</p>
                      <p className="text-sm">In a real implementation, this would show areas of significant liquidity and potential price levels of interest</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrderFlowAnalysis;
