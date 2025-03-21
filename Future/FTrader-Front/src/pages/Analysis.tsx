import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  LineChart, 
  BarChart, 
  PieChart, 
  Activity, 
  TrendingUp, 
  GitCompare, 
  History, 
  Clock, 
  Layers, 
  BrainCircuit,
  GitMerge,
  AlertTriangle,
  BarChart4,
  Newspaper,
  Briefcase,
  Lightbulb,
  PanelTop
} from 'lucide-react';

// Import analysis components
import Backtesting from '@/components/analysis/Backtesting';
import MultiTimeframe from '@/components/analysis/MultiTimeframe';
import StatisticalArbitrage from '@/components/analysis/StatisticalArbitrage';
import MachineLearning from '@/components/analysis/MachineLearning';
import TechnicalIndicators from '@/components/analysis/TechnicalIndicators';

// Import advanced analysis components
import PatternRecognition from '@/components/analysis/advanced/PatternRecognition';
import StrategyBuilder from '@/components/analysis/advanced/StrategyBuilder';
import CorrelationMatrix from '@/components/analysis/advanced/CorrelationMatrix';
import RiskAnalytics from '@/components/analysis/advanced/RiskAnalytics';
import MarketRegimeDetection from '@/components/analysis/advanced/MarketRegimeDetection';
import OrderFlowAnalysis from '@/components/analysis/advanced/OrderFlowAnalysis';
import SentimentAnalysis from '@/components/analysis/advanced/SentimentAnalysis';
import PortfolioOptimization from '@/components/analysis/advanced/PortfolioOptimization';

const Analysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState("backtesting");
  const [activeCategory, setActiveCategory] = useState("basic");

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Analysis & Research</h1>
          <p className="text-muted-foreground">Advanced tools for market analysis and strategy development</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Export Results</Button>
          <Button>New Analysis</Button>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs defaultValue="basic" value={activeCategory} onValueChange={setActiveCategory} className="w-full mb-6">
        <TabsList className="grid grid-cols-2 w-[400px] mx-auto">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>Basic Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4" />
            <span>Advanced Analysis</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Basic Analysis Tools */}
      {activeCategory === "basic" && (
        <Tabs defaultValue="backtesting" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="backtesting" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span>Backtesting</span>
            </TabsTrigger>
            <TabsTrigger value="multi-timeframe" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span>Multi-Timeframe</span>
            </TabsTrigger>
            <TabsTrigger value="statistical-arbitrage" className="flex items-center gap-2">
              <GitCompare className="h-4 w-4" />
              <span>Statistical Arbitrage</span>
            </TabsTrigger>
            <TabsTrigger value="machine-learning" className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4" />
              <span>Machine Learning</span>
            </TabsTrigger>
            <TabsTrigger value="technical-indicators" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span>Technical Indicators</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="backtesting" className="space-y-4">
            <Backtesting />
          </TabsContent>

          <TabsContent value="multi-timeframe" className="space-y-4">
            <MultiTimeframe />
          </TabsContent>

          <TabsContent value="statistical-arbitrage" className="space-y-4">
            <StatisticalArbitrage />
          </TabsContent>

          <TabsContent value="machine-learning" className="space-y-4">
            <MachineLearning />
          </TabsContent>

          <TabsContent value="technical-indicators" className="space-y-4">
            <TechnicalIndicators />
          </TabsContent>
        </Tabs>
      )}

      {/* Advanced Analysis Tools */}
      {activeCategory === "advanced" && (
        <Tabs defaultValue="pattern-recognition" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="pattern-recognition" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              <span>Pattern Recognition</span>
            </TabsTrigger>
            <TabsTrigger value="strategy-builder" className="flex items-center gap-2">
              <PanelTop className="h-4 w-4" />
              <span>Strategy Builder</span>
            </TabsTrigger>
            <TabsTrigger value="correlation-matrix" className="flex items-center gap-2">
              <GitMerge className="h-4 w-4" />
              <span>Correlation Matrix</span>
            </TabsTrigger>
          </TabsList>

          {/* Second row of tabs */}
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="risk-analytics" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Risk Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="market-regime" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Market Regime</span>
            </TabsTrigger>
            <TabsTrigger value="order-flow" className="flex items-center gap-2">
              <BarChart4 className="h-4 w-4" />
              <span>Order Flow</span>
            </TabsTrigger>
          </TabsList>

          {/* Third row of tabs */}
          <TabsList className="grid grid-cols-2 w-[400px] mb-8">
            <TabsTrigger value="sentiment-analysis" className="flex items-center gap-2">
              <Newspaper className="h-4 w-4" />
              <span>Sentiment Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="portfolio-optimization" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>Portfolio Optimization</span>
            </TabsTrigger>
          </TabsList>

          {/* Implemented Components */}
          <TabsContent value="pattern-recognition" className="space-y-4">
            <PatternRecognition />
          </TabsContent>

          <TabsContent value="strategy-builder" className="space-y-4">
            <StrategyBuilder />
          </TabsContent>

          <TabsContent value="correlation-matrix" className="space-y-4">
            <CorrelationMatrix />
          </TabsContent>

          <TabsContent value="risk-analytics" className="space-y-4">
            <RiskAnalytics />
          </TabsContent>

          <TabsContent value="market-regime" className="space-y-4">
            <MarketRegimeDetection />
          </TabsContent>

          <TabsContent value="order-flow" className="space-y-4">
            <OrderFlowAnalysis />
          </TabsContent>

          <TabsContent value="sentiment-analysis" className="space-y-4">
            <SentimentAnalysis />
          </TabsContent>

          <TabsContent value="portfolio-optimization" className="space-y-4">
            <PortfolioOptimization />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Analysis;
