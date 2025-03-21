import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAutomation, Strategy } from '../core/AutomationEngine';
import { StrategyBuilder } from './StrategyBuilder';

export const StrategyManager: React.FC = () => {
  const { strategies, activateStrategy, deactivateStrategy, deleteStrategy } = useAutomation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const handleCreateStrategy = (strategy: Strategy) => {
    setIsCreateDialogOpen(false);
  };
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'paused':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'draft':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };
  
  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Strategy Manager</CardTitle>
            <CardDescription>Create, configure, and deploy automated trading strategies</CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>Create Strategy</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Create New Strategy</DialogTitle>
                <DialogDescription>
                  Define your strategy parameters, signals, and risk management rules.
                </DialogDescription>
              </DialogHeader>
              <StrategyBuilder onSave={handleCreateStrategy} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {strategies.length === 0 ? (
            <div className="p-6 border rounded-lg bg-muted/50 text-center">
              <h3 className="text-lg font-medium mb-2">No Strategies Yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first automated trading strategy to get started
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>Create Strategy</Button>
            </div>
          ) : (
            strategies.map((strategy) => (
              <div key={strategy.id} className="border rounded-lg">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{strategy.name}</h3>
                      <p className="text-sm text-muted-foreground">{strategy.description}</p>
                    </div>
                    <Badge variant="outline" className={getStatusBadgeVariant(strategy.status)}>
                      {strategy.status.charAt(0).toUpperCase() + strategy.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div className="p-4 flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">Backtest</Button>
                  {strategy.status === 'active' ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-amber-600 hover:text-amber-700"
                      onClick={() => deactivateStrategy(strategy.id)}
                    >
                      Pause
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-green-600 hover:text-green-700"
                      onClick={() => activateStrategy(strategy.id)}
                    >
                      Activate
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700 ml-auto"
                    onClick={() => deleteStrategy(strategy.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
