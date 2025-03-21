import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAutomation, Strategy, SignalConfig, ExecutionRules, RiskControls } from '../core/AutomationEngine';

// Valid IG epics for different asset classes
const validInstruments = [
  { value: 'IX.D.FTSE.DAILY.IP', label: 'FTSE 100' },
  { value: 'IX.D.DAX.DAILY.IP', label: 'DAX' },
  { value: 'IX.D.SPTRD.DAILY.IP', label: 'S&P 500' },
  { value: 'CS.D.EURUSD.TODAY.IP', label: 'EUR/USD' },
  { value: 'CS.D.GBPUSD.TODAY.IP', label: 'GBP/USD' },
  { value: 'CS.D.USDJPY.TODAY.IP', label: 'USD/JPY' },
  { value: 'CC.D.LCO.UNC.IP', label: 'Brent Crude' },
  { value: 'CC.D.CL.UNC.IP', label: 'WTI Crude' },
  { value: 'CS.D.BITCOIN.TODAY.IP', label: 'Bitcoin' },
  { value: 'CS.D.ETHUSD.TODAY.IP', label: 'Ethereum' }
];

interface StrategyBuilderProps {
  onSave?: (strategy: Strategy) => void;
  initialStrategy?: Partial<Strategy>;
}

export const StrategyBuilder: React.FC<StrategyBuilderProps> = ({ 
  onSave,
  initialStrategy 
}) => {
  const { addStrategy } = useAutomation();
  const [activeTab, setActiveTab] = useState('general');
  
  // Strategy state
  const [strategyName, setStrategyName] = useState(initialStrategy?.name || '');
  const [strategyDescription, setStrategyDescription] = useState(initialStrategy?.description || '');
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [selectedSignalSources, setSelectedSignalSources] = useState<string[]>([]);
  
  // Execution rules
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market');
  const [positionSizingType, setPositionSizingType] = useState<'fixed' | 'percent' | 'risk'>('percent');
  const [positionSizingValue, setPositionSizingValue] = useState(5); // 5% default
  
  // Risk controls
  const [maxPositionSize, setMaxPositionSize] = useState(10000);
  const [maxDrawdown, setMaxDrawdown] = useState(5); // 5% default
  const [stopLossType, setStopLossType] = useState<'fixed' | 'percent' | 'atr'>('percent');
  const [stopLossValue, setStopLossValue] = useState(2); // 2% default
  const [takeProfitType, setTakeProfitType] = useState<'fixed' | 'percent' | 'riskRatio'>('percent');
  const [takeProfitValue, setTakeProfitValue] = useState(4); // 4% default
  
  // Handle adding an instrument
  const handleAddInstrument = (instrument: string) => {
    if (!selectedInstruments.includes(instrument)) {
      setSelectedInstruments([...selectedInstruments, instrument]);
    }
  };
  
  // Handle removing an instrument
  const handleRemoveInstrument = (instrument: string) => {
    setSelectedInstruments(selectedInstruments.filter(i => i !== instrument));
  };
  
  // Handle adding a signal source
  const handleToggleSignalSource = (source: string) => {
    if (selectedSignalSources.includes(source)) {
      setSelectedSignalSources(selectedSignalSources.filter(s => s !== source));
    } else {
      setSelectedSignalSources([...selectedSignalSources, source]);
    }
  };
  
  // Handle strategy creation
  const handleCreateStrategy = () => {
    // Create signal configurations
    const signals: SignalConfig[] = selectedSignalSources.map(source => {
      let signalType: 'pattern' | 'sentiment' | 'orderflow' | 'regime' | 'custom' = 'custom';
      
      if (source === 'pattern-recognition') signalType = 'pattern';
      if (source === 'sentiment-analysis') signalType = 'sentiment';
      if (source === 'order-flow') signalType = 'orderflow';
      if (source === 'market-regime') signalType = 'regime';
      
      return {
        id: `signal-${Date.now()}-${source}`,
        name: source,
        source: signalType,
        direction: 'both',
        parameters: {},
        confirmations: []
      };
    });
    
    // Create execution rules
    const executionRules: ExecutionRules = {
      orderType,
      positionSizing: {
        type: positionSizingType,
        value: positionSizingValue
      },
      timeRestrictions: {
        tradingHours: {
          start: '08:00',
          end: '16:30'
        },
        daysToAvoid: ['Saturday', 'Sunday']
      },
      entryConditions: {},
      exitConditions: {}
    };
    
    // Create risk controls
    const riskControls: RiskControls = {
      maxPositionSize,
      maxDrawdown,
      stopLoss: {
        type: stopLossType,
        value: stopLossValue
      },
      takeProfit: {
        type: takeProfitType,
        value: takeProfitValue
      },
      maxOpenPositions: 5
    };
    
    // Create strategy
    const newStrategy: Omit<Strategy, 'id' | 'createdAt' | 'updatedAt'> = {
      name: strategyName,
      description: strategyDescription,
      status: 'draft',
      signals,
      executionRules,
      riskControls
    };
    
    // Add strategy
    const strategyId = addStrategy(newStrategy);
    
    // Call onSave callback if provided
    if (onSave) {
      onSave({
        ...newStrategy,
        id: strategyId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Strategy Builder</CardTitle>
        <CardDescription>Create and configure an automated trading strategy</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="signals">Signals</TabsTrigger>
            <TabsTrigger value="execution">Execution</TabsTrigger>
            <TabsTrigger value="risk">Risk Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="strategy-name">Strategy Name</Label>
              <Input 
                id="strategy-name" 
                value={strategyName} 
                onChange={(e) => setStrategyName(e.target.value)} 
                placeholder="e.g., Moving Average Crossover" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="strategy-description">Description</Label>
              <Input 
                id="strategy-description" 
                value={strategyDescription} 
                onChange={(e) => setStrategyDescription(e.target.value)} 
                placeholder="Brief description of the strategy" 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Instruments</Label>
              <Select onValueChange={handleAddInstrument}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an instrument" />
                </SelectTrigger>
                <SelectContent>
                  {validInstruments.map((instrument) => (
                    <SelectItem key={instrument.value} value={instrument.value}>
                      {instrument.label} ({instrument.value})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedInstruments.map((instrument) => {
                  const instrumentLabel = validInstruments.find(i => i.value === instrument)?.label || instrument;
                  return (
                    <div key={instrument} className="flex items-center bg-muted px-3 py-1 rounded-full text-sm">
                      <span>{instrumentLabel}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-4 w-4 p-0 ml-2" 
                        onClick={() => handleRemoveInstrument(instrument)}
                      >
                        ✕
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="signals" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium">Pattern Recognition</h3>
                  <p className="text-sm text-muted-foreground">Chart pattern signals</p>
                </div>
                <Switch 
                  checked={selectedSignalSources.includes('pattern-recognition')}
                  onCheckedChange={() => handleToggleSignalSource('pattern-recognition')}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium">Sentiment Analysis</h3>
                  <p className="text-sm text-muted-foreground">News and social media signals</p>
                </div>
                <Switch 
                  checked={selectedSignalSources.includes('sentiment-analysis')}
                  onCheckedChange={() => handleToggleSignalSource('sentiment-analysis')}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium">Order Flow Analysis</h3>
                  <p className="text-sm text-muted-foreground">Market depth and volume signals</p>
                </div>
                <Switch 
                  checked={selectedSignalSources.includes('order-flow')}
                  onCheckedChange={() => handleToggleSignalSource('order-flow')}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium">Market Regime Detection</h3>
                  <p className="text-sm text-muted-foreground">Market condition signals</p>
                </div>
                <Switch 
                  checked={selectedSignalSources.includes('market-regime')}
                  onCheckedChange={() => handleToggleSignalSource('market-regime')}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="execution" className="space-y-4">
            <div className="space-y-2">
              <Label>Order Type</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant={orderType === 'market' ? 'default' : 'outline'} 
                  onClick={() => setOrderType('market')}
                >
                  Market
                </Button>
                <Button 
                  variant={orderType === 'limit' ? 'default' : 'outline'} 
                  onClick={() => setOrderType('limit')}
                >
                  Limit
                </Button>
                <Button 
                  variant={orderType === 'stop' ? 'default' : 'outline'} 
                  onClick={() => setOrderType('stop')}
                >
                  Stop
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Position Sizing</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant={positionSizingType === 'fixed' ? 'default' : 'outline'} 
                  onClick={() => setPositionSizingType('fixed')}
                >
                  Fixed
                </Button>
                <Button 
                  variant={positionSizingType === 'percent' ? 'default' : 'outline'} 
                  onClick={() => setPositionSizingType('percent')}
                >
                  Percent
                </Button>
                <Button 
                  variant={positionSizingType === 'risk' ? 'default' : 'outline'} 
                  onClick={() => setPositionSizingType('risk')}
                >
                  Risk
                </Button>
              </div>
              
              <div className="mt-2">
                <Label htmlFor="position-size">
                  {positionSizingType === 'fixed' ? 'Amount ($)' : 
                   positionSizingType === 'percent' ? 'Portfolio Percentage (%)' : 
                   'Risk Percentage (%)'}
                </Label>
                <Input 
                  id="position-size" 
                  type="number" 
                  value={positionSizingValue} 
                  onChange={(e) => setPositionSizingValue(Number(e.target.value))} 
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="risk" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="max-position-size">Maximum Position Size ($)</Label>
              <Input 
                id="max-position-size" 
                type="number" 
                value={maxPositionSize} 
                onChange={(e) => setMaxPositionSize(Number(e.target.value))} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="max-drawdown">Maximum Drawdown (%)</Label>
              <Input 
                id="max-drawdown" 
                type="number" 
                value={maxDrawdown} 
                onChange={(e) => setMaxDrawdown(Number(e.target.value))} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Stop Loss</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant={stopLossType === 'fixed' ? 'default' : 'outline'} 
                  onClick={() => setStopLossType('fixed')}
                >
                  Fixed
                </Button>
                <Button 
                  variant={stopLossType === 'percent' ? 'default' : 'outline'} 
                  onClick={() => setStopLossType('percent')}
                >
                  Percent
                </Button>
                <Button 
                  variant={stopLossType === 'atr' ? 'default' : 'outline'} 
                  onClick={() => setStopLossType('atr')}
                >
                  ATR
                </Button>
              </div>
              
              <div className="mt-2">
                <Label htmlFor="stop-loss-value">
                  {stopLossType === 'fixed' ? 'Amount ($)' : 
                   stopLossType === 'percent' ? 'Percentage (%)' : 
                   'ATR Multiplier'}
                </Label>
                <Input 
                  id="stop-loss-value" 
                  type="number" 
                  value={stopLossValue} 
                  onChange={(e) => setStopLossValue(Number(e.target.value))} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Take Profit</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant={takeProfitType === 'fixed' ? 'default' : 'outline'} 
                  onClick={() => setTakeProfitType('fixed')}
                >
                  Fixed
                </Button>
                <Button 
                  variant={takeProfitType === 'percent' ? 'default' : 'outline'} 
                  onClick={() => setTakeProfitType('percent')}
                >
                  Percent
                </Button>
                <Button 
                  variant={takeProfitType === 'riskRatio' ? 'default' : 'outline'} 
                  onClick={() => setTakeProfitType('riskRatio')}
                >
                  Risk Ratio
                </Button>
              </div>
              
              <div className="mt-2">
                <Label htmlFor="take-profit-value">
                  {takeProfitType === 'fixed' ? 'Amount ($)' : 
                   takeProfitType === 'percent' ? 'Percentage (%)' : 
                   'Risk-Reward Ratio'}
                </Label>
                <Input 
                  id="take-profit-value" 
                  type="number" 
                  value={takeProfitValue} 
                  onChange={(e) => setTakeProfitValue(Number(e.target.value))} 
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleCreateStrategy}>Create Strategy</Button>
      </CardFooter>
    </Card>
  );
};
