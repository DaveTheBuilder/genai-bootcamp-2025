import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AutomationProvider, useAutomation } from '@/components/automation/core/AutomationEngine';
import { SignalProcessor } from '@/components/automation/core/SignalProcessor';
import { ExecutionEngine } from '@/components/automation/core/ExecutionEngine';
import { MonitoringService } from '@/components/automation/core/MonitoringService';

// Import actual components instead of using placeholders
import { StrategyManager } from '@/components/automation/strategy/StrategyManager';
import { SignalCenter } from '@/components/automation/signals/SignalCenter';
import ExecutionDashboard from '@/components/automation/execution/ExecutionDashboard'; // Fix import statement
import PerformanceDashboard from '@/components/automation/monitoring/PerformanceDashboard'; // Fix import statement

// Main Automation Page Component
const AutomationPage = () => {
  const [activeTab, setActiveTab] = useState('strategies');
  const { 
    isSimulationMode, 
    toggleSimulationMode, 
    isProcessingActive, 
    toggleProcessing 
  } = useAutomation();

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Automated Trading</h1>
          <p className="text-muted-foreground">Create and manage automated trading strategies</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="simulation-mode" 
              checked={isSimulationMode}
              onCheckedChange={toggleSimulationMode}
            />
            <Label htmlFor="simulation-mode">Simulation Mode</Label>
          </div>
          
          <Button 
            variant={isProcessingActive ? "destructive" : "default"}
            onClick={toggleProcessing}
          >
            {isProcessingActive ? "Stop Processing" : "Start Processing"}
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="signals">Signals</TabsTrigger>
          <TabsTrigger value="execution">Execution</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="strategies" className="space-y-4">
          <StrategyManager />
        </TabsContent>
        
        <TabsContent value="signals" className="space-y-4">
          <SignalCenter />
        </TabsContent>
        
        <TabsContent value="execution" className="space-y-4">
          <ExecutionDashboard />
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <PerformanceDashboard />
        </TabsContent>
      </Tabs>
      
      {/* Core services - these don't render UI but provide functionality */}
      <SignalProcessor refreshInterval={5000} />
      <ExecutionEngine />
      <MonitoringService />
    </div>
  );
};

// Wrap the page with the AutomationProvider
const AutomationPageWithProvider = () => (
  <AutomationProvider>
    <AutomationPage />
  </AutomationProvider>
);

export default AutomationPageWithProvider;
