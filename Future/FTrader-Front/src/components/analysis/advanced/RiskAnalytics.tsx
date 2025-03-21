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
  AlertTriangle, 
  BarChart, 
  LineChart, 
  PieChart, 
  RefreshCw,
  Download,
  Calculator,
  Percent,
  TrendingDown,
  Clock
} from "lucide-react";

// Mock portfolio data
const mockPortfolio = {
  name: "Sample Portfolio",
  totalValue: 100000,
  positions: [
    { id: "1", symbol: "IX.D.FTSE.DAILY.IP", name: "FTSE 100", allocation: 0.25, value: 25000, volatility: 0.18, beta: 1.05, var95: 1250, var99: 1875 },
    { id: "2", symbol: "IX.D.DAX.DAILY.IP", name: "DAX", allocation: 0.20, value: 20000, volatility: 0.22, beta: 1.15, var95: 1100, var99: 1650 },
    { id: "3", symbol: "CS.D.EURUSD.TODAY.IP", name: "EUR/USD", allocation: 0.15, value: 15000, volatility: 0.08, beta: 0.25, var95: 300, var99: 450 },
    { id: "4", symbol: "CS.D.GBPUSD.TODAY.IP", name: "GBP/USD", allocation: 0.15, value: 15000, volatility: 0.10, beta: 0.30, var95: 375, var99: 560 },
    { id: "5", symbol: "CC.D.LCO.UNC.IP", name: "Brent Crude", allocation: 0.10, value: 10000, volatility: 0.28, beta: 0.75, var95: 700, var99: 1050 },
    { id: "6", symbol: "CS.D.BITCOIN.TODAY.IP", name: "Bitcoin", allocation: 0.10, value: 10000, volatility: 0.65, beta: 1.80, var95: 1625, var99: 2440 },
    { id: "7", symbol: "IX.D.SPTRD.DAILY.IP", name: "S&P 500", allocation: 0.05, value: 5000, volatility: 0.16, beta: 1.00, var95: 200, var99: 300 },
  ]
};

// Mock historical VaR data
const mockHistoricalVaR = [
  { date: "2025-01-01", var95: 4800, var99: 7200 },
  { date: "2025-01-08", var95: 5100, var99: 7650 },
  { date: "2025-01-15", var95: 4950, var99: 7425 },
  { date: "2025-01-22", var95: 5250, var99: 7875 },
  { date: "2025-01-29", var95: 5400, var99: 8100 },
  { date: "2025-02-05", var95: 5100, var99: 7650 },
  { date: "2025-02-12", var95: 4800, var99: 7200 },
  { date: "2025-02-19", var95: 5250, var99: 7875 },
  { date: "2025-02-26", var95: 5550, var99: 8325 },
  { date: "2025-03-05", var95: 5400, var99: 8100 },
  { date: "2025-03-12", var95: 5550, var99: 8325 },
];

// Mock stress test scenarios
const mockStressScenarios = [
  { 
    id: "covid", 
    name: "COVID-19 Crash", 
    description: "Market conditions similar to March 2020",
    impact: -0.32,
    varImpact: 2.5,
    positionImpacts: [
      { symbol: "IX.D.FTSE.DAILY.IP", impact: -0.28 },
      { symbol: "IX.D.DAX.DAILY.IP", impact: -0.30 },
      { symbol: "CS.D.EURUSD.TODAY.IP", impact: -0.05 },
      { symbol: "CS.D.GBPUSD.TODAY.IP", impact: -0.08 },
      { symbol: "CC.D.LCO.UNC.IP", impact: -0.65 },
      { symbol: "CS.D.BITCOIN.TODAY.IP", impact: -0.48 },
      { symbol: "IX.D.SPTRD.DAILY.IP", impact: -0.35 },
    ]
  },
  { 
    id: "2008", 
    name: "2008 Financial Crisis", 
    description: "Market conditions similar to 2008 crash",
    impact: -0.45,
    varImpact: 3.2,
    positionImpacts: [
      { symbol: "IX.D.FTSE.DAILY.IP", impact: -0.42 },
      { symbol: "IX.D.DAX.DAILY.IP", impact: -0.48 },
      { symbol: "CS.D.EURUSD.TODAY.IP", impact: -0.12 },
      { symbol: "CS.D.GBPUSD.TODAY.IP", impact: -0.15 },
      { symbol: "CC.D.LCO.UNC.IP", impact: -0.72 },
      { symbol: "CS.D.BITCOIN.TODAY.IP", impact: -0.60 },
      { symbol: "IX.D.SPTRD.DAILY.IP", impact: -0.50 },
    ]
  },
  { 
    id: "inflation", 
    name: "Inflation Spike", 
    description: "Rapid increase in inflation and interest rates",
    impact: -0.22,
    varImpact: 1.8,
    positionImpacts: [
      { symbol: "IX.D.FTSE.DAILY.IP", impact: -0.18 },
      { symbol: "IX.D.DAX.DAILY.IP", impact: -0.20 },
      { symbol: "CS.D.EURUSD.TODAY.IP", impact: -0.08 },
      { symbol: "CS.D.GBPUSD.TODAY.IP", impact: -0.10 },
      { symbol: "CC.D.LCO.UNC.IP", impact: 0.15 },
      { symbol: "CS.D.BITCOIN.TODAY.IP", impact: -0.35 },
      { symbol: "IX.D.SPTRD.DAILY.IP", impact: -0.25 },
    ]
  },
];

// Helper function to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

// Helper function to format percentage
const formatPercent = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2 }).format(value);
};

const RiskAnalytics: React.FC = () => {
  const [confidenceLevel, setConfidenceLevel] = useState("95");
  const [timeHorizon, setTimeHorizon] = useState("1d");
  const [varMethod, setVarMethod] = useState("historical");
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  
  // Calculate portfolio VaR
  const portfolioVaR = confidenceLevel === "95" 
    ? mockPortfolio.positions.reduce((sum, position) => sum + position.var95, 0)
    : mockPortfolio.positions.reduce((sum, position) => sum + position.var99, 0);
  
  // Calculate portfolio VaR as percentage
  const portfolioVaRPercent = portfolioVaR / mockPortfolio.totalValue;
  
  // Get current VaR from historical data (most recent entry)
  const currentHistoricalVaR = mockHistoricalVaR[mockHistoricalVaR.length - 1];

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Configuration Panel */}
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Risk Analytics</CardTitle>
          <CardDescription>Analyze portfolio risk and stress test scenarios</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Portfolio Selection */}
          <div className="space-y-2">
            <Label htmlFor="portfolio">Portfolio</Label>
            <Select defaultValue="sample">
              <SelectTrigger id="portfolio">
                <SelectValue placeholder="Select portfolio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sample">Sample Portfolio</SelectItem>
                <SelectItem value="custom">Custom Portfolio</SelectItem>
                <SelectItem value="hedged">Hedged Strategy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* VaR Configuration */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-medium">Value at Risk (VaR) Settings</h3>
            
            <div className="space-y-2">
              <Label htmlFor="confidence">Confidence Level</Label>
              <Select defaultValue="95" onValueChange={setConfidenceLevel}>
                <SelectTrigger id="confidence">
                  <SelectValue placeholder="Select confidence level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="95">95%</SelectItem>
                  <SelectItem value="99">99%</SelectItem>
                  <SelectItem value="99.5">99.5%</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="horizon">Time Horizon</Label>
              <Select defaultValue="1d" onValueChange={setTimeHorizon}>
                <SelectTrigger id="horizon">
                  <SelectValue placeholder="Select time horizon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">1 Day</SelectItem>
                  <SelectItem value="1w">1 Week</SelectItem>
                  <SelectItem value="2w">2 Weeks</SelectItem>
                  <SelectItem value="1m">1 Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="method">Calculation Method</Label>
              <Select defaultValue="historical" onValueChange={setVarMethod}>
                <SelectTrigger id="method">
                  <SelectValue placeholder="Select calculation method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="historical">Historical</SelectItem>
                  <SelectItem value="parametric">Parametric</SelectItem>
                  <SelectItem value="montecarlo">Monte Carlo</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {varMethod === "historical" && "Uses historical returns to estimate potential losses"}
                {varMethod === "parametric" && "Assumes normal distribution of returns"}
                {varMethod === "montecarlo" && "Simulates multiple scenarios to estimate risk"}
              </p>
            </div>
          </div>

          {/* Stress Test Settings */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-medium">Stress Testing</h3>
            
            <div className="space-y-2">
              <Label htmlFor="scenario">Scenario</Label>
              <Select defaultValue="none" onValueChange={(value) => setSelectedScenario(value === "none" ? null : value)}>
                <SelectTrigger id="scenario">
                  <SelectValue placeholder="Select stress scenario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Scenario</SelectItem>
                  <SelectItem value="covid">COVID-19 Crash</SelectItem>
                  <SelectItem value="2008">2008 Financial Crisis</SelectItem>
                  <SelectItem value="inflation">Inflation Spike</SelectItem>
                  <SelectItem value="custom">Custom Scenario</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Update Risk Analysis
          </Button>
        </CardFooter>
      </Card>

      {/* Results Panel */}
      <div className="col-span-9 space-y-6">
        {/* Risk Summary */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Risk Summary</CardTitle>
                <CardDescription>
                  {confidenceLevel}% confidence, {timeHorizon} horizon, {varMethod} method
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
            <div className="grid grid-cols-4 gap-4">
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                      <span className="text-sm font-medium">Value at Risk ({confidenceLevel}%)</span>
                    </div>
                    <Badge variant="outline" className="text-amber-500 border-amber-500">
                      {formatPercent(portfolioVaRPercent)}
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-bold">{formatCurrency(portfolioVaR)}</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Maximum expected loss at {confidenceLevel}% confidence over {timeHorizon}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TrendingDown className="h-5 w-5 mr-2 text-red-500" />
                      <span className="text-sm font-medium">Expected Shortfall</span>
                    </div>
                    <Badge variant="outline" className="text-red-500 border-red-500">
                      {formatPercent(portfolioVaRPercent * 1.5)}
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-bold">{formatCurrency(portfolioVaR * 1.5)}</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Average loss when exceeding VaR threshold
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Percent className="h-5 w-5 mr-2 text-blue-500" />
                      <span className="text-sm font-medium">Portfolio Volatility</span>
                    </div>
                    <Badge variant="outline" className="text-blue-500 border-blue-500">
                      Annual
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-bold">{formatPercent(0.185)}</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Annualized standard deviation of returns
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calculator className="h-5 w-5 mr-2 text-purple-500" />
                      <span className="text-sm font-medium">Risk Contribution</span>
                    </div>
                    <Badge variant="outline" className="text-purple-500 border-purple-500">
                      Top Asset
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-bold">Bitcoin</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatPercent(0.325)} of total portfolio risk
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Historical VaR Chart Placeholder */}
            <div className="mt-8 border rounded-md p-4">
              <h3 className="text-lg font-medium mb-4">Historical VaR Trend</h3>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <LineChart className="h-16 w-16 mx-auto mb-2" />
                  <p>Historical VaR chart would be displayed here</p>
                  <p className="text-sm">In a real implementation, this would show VaR trends over time</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Position Risk Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Position Risk Analysis</CardTitle>
            <CardDescription>
              Risk contribution by individual positions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Position</th>
                    <th className="text-right py-3 px-4">Allocation</th>
                    <th className="text-right py-3 px-4">Value</th>
                    <th className="text-right py-3 px-4">Volatility</th>
                    <th className="text-right py-3 px-4">Beta</th>
                    <th className="text-right py-3 px-4">VaR ({confidenceLevel}%)</th>
                    <th className="text-right py-3 px-4">Risk Contribution</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPortfolio.positions.map((position) => {
                    const positionVaR = confidenceLevel === "95" ? position.var95 : position.var99;
                    const riskContribution = positionVaR / portfolioVaR;
                    
                    return (
                      <tr key={position.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="font-medium">{position.name}</div>
                          <div className="text-xs text-muted-foreground">{position.symbol}</div>
                        </td>
                        <td className="text-right py-3 px-4">
                          {formatPercent(position.allocation)}
                        </td>
                        <td className="text-right py-3 px-4">
                          {formatCurrency(position.value)}
                        </td>
                        <td className="text-right py-3 px-4">
                          {formatPercent(position.volatility)}
                        </td>
                        <td className="text-right py-3 px-4">
                          {position.beta.toFixed(2)}
                        </td>
                        <td className="text-right py-3 px-4">
                          <div>{formatCurrency(positionVaR)}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatPercent(positionVaR / position.value)}
                          </div>
                        </td>
                        <td className="text-right py-3 px-4">
                          <div className="flex items-center justify-end">
                            <div className="mr-2">{formatPercent(riskContribution)}</div>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-amber-500 h-2 rounded-full" 
                                style={{ width: `${riskContribution * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Stress Testing */}
        {selectedScenario && (
          <Card>
            <CardHeader>
              <CardTitle>
                Stress Test: {mockStressScenarios.find(s => s.id === selectedScenario)?.name}
              </CardTitle>
              <CardDescription>
                {mockStressScenarios.find(s => s.id === selectedScenario)?.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <TrendingDown className="h-5 w-5 mr-2 text-red-500" />
                        <span className="text-sm font-medium">Portfolio Impact</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-2xl font-bold text-red-500">
                        {formatPercent(mockStressScenarios.find(s => s.id === selectedScenario)?.impact || 0)}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        Estimated portfolio value change
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                        <span className="text-sm font-medium">Stressed VaR</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-2xl font-bold">
                        {formatCurrency(portfolioVaR * (mockStressScenarios.find(s => s.id === selectedScenario)?.varImpact || 1))}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        VaR under stress conditions
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-blue-500" />
                        <span className="text-sm font-medium">Recovery Period</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-2xl font-bold">
                        {selectedScenario === "covid" ? "4-6 months" : 
                         selectedScenario === "2008" ? "12-18 months" : 
                         "3-4 months"}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        Estimated time to recover losses
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Position Impact Table */}
              <div className="overflow-x-auto">
                <h3 className="text-lg font-medium mb-4">Position Impacts</h3>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Position</th>
                      <th className="text-right py-3 px-4">Current Value</th>
                      <th className="text-right py-3 px-4">Impact %</th>
                      <th className="text-right py-3 px-4">Stressed Value</th>
                      <th className="text-right py-3 px-4">Value Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockPortfolio.positions.map((position) => {
                      const scenario = mockStressScenarios.find(s => s.id === selectedScenario);
                      const positionImpact = scenario?.positionImpacts.find(p => p.symbol === position.symbol)?.impact || 0;
                      const stressedValue = position.value * (1 + positionImpact);
                      const valueChange = stressedValue - position.value;
                      
                      return (
                        <tr key={position.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="font-medium">{position.name}</div>
                            <div className="text-xs text-muted-foreground">{position.symbol}</div>
                          </td>
                          <td className="text-right py-3 px-4">
                            {formatCurrency(position.value)}
                          </td>
                          <td className="text-right py-3 px-4">
                            <span className={positionImpact < 0 ? "text-red-500" : "text-green-500"}>
                              {formatPercent(positionImpact)}
                            </span>
                          </td>
                          <td className="text-right py-3 px-4">
                            {formatCurrency(stressedValue)}
                          </td>
                          <td className="text-right py-3 px-4">
                            <span className={valueChange < 0 ? "text-red-500" : "text-green-500"}>
                              {formatCurrency(valueChange)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Stress Test Chart Placeholder */}
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-4">Stress Test Visualization</h3>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <BarChart className="h-16 w-16 mx-auto mb-2" />
                    <p>Stress test impact visualization would be displayed here</p>
                    <p className="text-sm">In a real implementation, this would show the impact of the stress scenario on the portfolio</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RiskAnalytics;
