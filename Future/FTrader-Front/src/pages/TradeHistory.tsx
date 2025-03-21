import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Download, Search, Filter } from 'lucide-react';

// Define types for trade data
interface Trade {
  trade_id: string;
  symbol: string;
  side: 'buy' | 'sell';
  price: number;
  quantity: number;
  total: number;
  timestamp: string;
  status: 'executed' | 'settled';
}

const TradeHistory: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [filteredTrades, setFilteredTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [symbolFilter, setSymbolFilter] = useState('all');
  const [sideFilter, setSideFilter] = useState('all');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);

  // Generate mock trade data
  const generateMockTrades = (): Trade[] => {
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'BTC-USD', 'ETH-USD'];
    const trades: Trade[] = [];
    
    // Generate 50 random trades over the past 30 days
    for (let i = 0; i < 50; i++) {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const side = Math.random() > 0.5 ? 'buy' : 'sell';
      const price = symbol === 'BTC-USD' ? 65000 + (Math.random() * 2000 - 1000) :
                   symbol === 'ETH-USD' ? 3900 + (Math.random() * 200 - 100) :
                   100 + (Math.random() * 400);
      const quantity = symbol.includes('USD') ? 0.1 + (Math.random() * 2) : 1 + Math.floor(Math.random() * 20);
      const total = price * quantity;
      
      // Random date within the last 30 days
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      trades.push({
        trade_id: `t-${1000 + i}`,
        symbol,
        side,
        price,
        quantity,
        total,
        timestamp: date.toISOString(),
        status: Math.random() > 0.2 ? 'settled' : 'executed'
      });
    }
    
    // Sort by timestamp (newest first)
    return trades.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  // Load trades on component mount
  useEffect(() => {
    const fetchTrades = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockTrades = generateMockTrades();
      setTrades(mockTrades);
      setFilteredTrades(mockTrades);
      setIsLoading(false);
    };
    
    fetchTrades();
  }, []);

  // Apply filters when any filter changes
  useEffect(() => {
    let result = [...trades];
    
    // Apply symbol filter
    if (symbolFilter !== 'all') {
      result = result.filter(trade => trade.symbol === symbolFilter);
    }
    
    // Apply side filter
    if (sideFilter !== 'all') {
      result = result.filter(trade => trade.side === sideFilter);
    }
    
    // Apply date range filter
    if (startDate) {
      result = result.filter(trade => new Date(trade.timestamp) >= startDate);
    }
    
    if (endDate) {
      // Add one day to include the end date fully
      const endDatePlusOne = new Date(endDate);
      endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
      result = result.filter(trade => new Date(trade.timestamp) < endDatePlusOne);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(trade => 
        trade.trade_id.toLowerCase().includes(query) ||
        trade.symbol.toLowerCase().includes(query)
      );
    }
    
    setFilteredTrades(result);
  }, [trades, symbolFilter, sideFilter, startDate, endDate, searchQuery]);

  // Get unique symbols for filter dropdown
  const uniqueSymbols = Array.from(new Set(trades.map(trade => trade.symbol)));

  // Handle export to CSV
  const handleExportCSV = () => {
    // Create CSV content
    const headers = ['Trade ID', 'Symbol', 'Side', 'Price', 'Quantity', 'Total', 'Timestamp', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredTrades.map(trade => [
        trade.trade_id,
        trade.symbol,
        trade.side,
        trade.price.toFixed(2),
        trade.quantity.toFixed(2),
        trade.total.toFixed(2),
        new Date(trade.timestamp).toLocaleString(),
        trade.status
      ].join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `trade-history-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSymbolFilter('all');
    setSideFilter('all');
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6 max-w-screen-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Trade History</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportCSV}
            disabled={filteredTrades.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter your trade history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Symbol filter */}
              <div>
                <label className="text-sm font-medium mb-1 block">Symbol</label>
                <Select value={symbolFilter} onValueChange={setSymbolFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Symbol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Symbols</SelectItem>
                    {uniqueSymbols.map(symbol => (
                      <SelectItem key={symbol} value={symbol}>{symbol}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Side filter */}
              <div>
                <label className="text-sm font-medium mb-1 block">Side</label>
                <Select value={sideFilter} onValueChange={setSideFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Side" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="sell">Sell</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Start date filter */}
              <div>
                <label className="text-sm font-medium mb-1 block">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* End date filter */}
              <div>
                <label className="text-sm font-medium mb-1 block">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleResetFilters}
              >
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search by ID or symbol..." 
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Trade history table */}
      <Card>
        <CardHeader>
          <CardTitle>Trades</CardTitle>
          <CardDescription>
            {filteredTrades.length} {filteredTrades.length === 1 ? 'trade' : 'trades'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trade ID</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Side</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrades.length > 0 ? (
                    filteredTrades.map((trade) => (
                      <TableRow key={trade.trade_id}>
                        <TableCell className="font-medium">{trade.trade_id}</TableCell>
                        <TableCell>{trade.symbol}</TableCell>
                        <TableCell className={trade.side === 'buy' ? 'text-green-500' : 'text-red-500'}>
                          {trade.side}
                        </TableCell>
                        <TableCell className="text-right">${trade.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{trade.quantity.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${trade.total.toFixed(2)}</TableCell>
                        <TableCell>{new Date(trade.timestamp).toLocaleString()}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            trade.status === 'settled' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {trade.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                        No trades found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TradeHistory;
