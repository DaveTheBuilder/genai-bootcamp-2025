import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  MinusCircle, 
  RefreshCw, 
  Info, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2,
  BrainCircuit, 
  TrendingUp, 
  TrendingDown, 
  Layers,
  Dices,
  Network,
  Sigma,
  PieChart,
  Loader2,
  Database,
  ExternalLink,
  Clock,
  Calendar,
  Target,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import mlService from "@/services/mlService";
import { MLModel, TrainingParams } from "@/types/ml";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell 
} from 'recharts';
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

// Live Predictions Component
const LivePredictions: React.FC<{ modelId?: number }> = ({ modelId }) => {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchPredictions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await mlService.getLivePredictions(modelId);
      
      // Check if we're in simulation mode
      if (mlService.isSimulationModeEnabled() && !isSimulationMode) {
        setIsSimulationMode(true);
        toast({
          title: "Using Simulation Mode",
          description: "Backend connection unavailable. Using simulated data instead.",
          variant: "default",
          duration: 5000,
        });
      }
      
      if (response.status === 'success') {
        setPredictions(response.predictions || []);
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        setError(response.message || 'Failed to fetch predictions');
      }
    } catch (err) {
      setError('Error fetching live predictions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [modelId, isSimulationMode, toast]);

  // Run prediction for a specific model
  const handleRunPrediction = async (id: number) => {
    try {
      setLoading(true);
      const response = await mlService.runModelPrediction(id);
      
      if (response.status === 'success') {
        toast({
          title: "Prediction Run Successfully",
          description: `New prediction generated for model #${id}`,
          variant: "default",
          duration: 3000,
        });
      } else {
        toast({
          title: "Error Running Prediction",
          description: response.message || "Failed to run prediction",
          variant: "destructive",
          duration: 5000,
        });
      }
      
      // Refresh predictions after running a new one
      await fetchPredictions();
    } catch (err) {
      setError('Error running prediction');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh predictions every 30 seconds
  useEffect(() => {
    fetchPredictions();
    const interval = setInterval(fetchPredictions, 30000);
    return () => clearInterval(interval);
  }, [fetchPredictions]);

  // Get icon for recommendation
  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation.toLowerCase()) {
      case 'buy':
        return <ArrowUpCircle className="h-5 w-5 text-green-500" />;
      case 'sell':
        return <ArrowDownCircle className="h-5 w-5 text-red-500" />;
      default:
        return <MinusCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get color for confidence
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) return "bg-green-100 text-green-800 hover:bg-green-200";
    if (confidence >= 0.5) return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    return "bg-red-100 text-red-800 hover:bg-red-200";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h3 className="text-lg font-medium">
            Live Predictions {modelId ? `for Model #${modelId}` : ''}
          </h3>
        </div>
        {isSimulationMode && (
          <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800">
            Simulation Mode
          </Badge>
        )}
        <div className="flex items-center">
          {lastUpdated && (
            <span className="text-sm text-muted-foreground mr-2">
              Last updated: {lastUpdated}
            </span>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={fetchPredictions} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh predictions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {loading && !predictions.length && (
        <div className="flex justify-center py-8">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Loading predictions...</p>
          </div>
        </div>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {predictions.length === 0 && !loading && !error && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>No predictions</AlertTitle>
          <AlertDescription>
            No live predictions available. Train a model first or click refresh.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {predictions.map((prediction) => (
          <Card key={prediction.model_id} className={cn(
            "border-2",
            prediction.recommendation === 'buy' 
              ? "border-green-500" 
              : prediction.recommendation === 'sell' 
                ? "border-red-500" 
                : "border-gray-300"
          )}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  {getRecommendationIcon(prediction.recommendation)}
                  <CardTitle className="text-lg">
                    {prediction.recommendation.toUpperCase()}
                  </CardTitle>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRunPrediction(prediction.model_id)}
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Run new prediction</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center">
                <CardDescription>
                  Model #{prediction.model_id} ({prediction.model_type})
                </CardDescription>
                {isSimulationMode && prediction.model_id >= 1000 && (
                  <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 text-xs">
                    Simulated
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Instrument:</span>
                  <span className="text-sm">{prediction.instrument}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Target:</span>
                  <span className="text-sm">{prediction.target}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Confidence:</span>
                  <Badge className={getConfidenceColor(prediction.confidence)}>
                    {(prediction.confidence * 100).toFixed(0)}%
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Timeframe:</span>
                  <span className="text-sm">{prediction.timeframe}</span>
                </div>
                <Separator className="my-2" />
                <p className="text-sm">{prediction.reason}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Main Machine Learning Component
const MachineLearning: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const [hasResults, setHasResults] = useState(true);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [models, setModels] = useState<MLModel[]>([]);
  const [currentTrainingModel, setCurrentTrainingModel] = useState<any>(null);
  const [deleteModelId, setDeleteModelId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Form state
  const [modelType, setModelType] = useState<string>("lstm");
  const [instrument, setInstrument] = useState<string>("EURUSD");
  const [target, setTarget] = useState<string>("direction");
  const [horizon, setHorizon] = useState<string>("1d");
  const [trainingPeriod, setTrainingPeriod] = useState<string>("1y");
  
  // UI state
  const { toast } = useToast();
  const [simulationMode, setSimulationMode] = useState<boolean>(false);

  // Convert horizon string to number (hours)
  const getHorizonHours = (horizon: string): number => {
    switch (horizon) {
      case "1h": return 1;
      case "4h": return 4;
      case "1d": return 24;
      case "1w": return 24 * 7;
      default: return 24;
    }
  };
  
  // Convert training period string to number (days)
  const getTrainingPeriodDays = (period: string): number => {
    switch (period) {
      case "1m": return 30;
      case "3m": return 90;
      case "6m": return 180;
      case "1y": return 365;
      default: return 365;
    }
  };
  
  // Fetch models on component mount
  useEffect(() => {
    fetchModels();
  }, []);
  
  // Function to fetch models from the API
  const fetchModels = async () => {
    try {
      setLoading(true);
      const fetchedModels = await mlService.getModels();
      setModels(fetchedModels);
      if (fetchedModels.length > 0) {
        setHasResults(true);
      }
    } catch (error) {
      console.error("Failed to fetch models:", error);
      toast({
        title: "Error",
        description: "Failed to load models. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle training a new model
  const handleTrainModel = async () => {
    try {
      setIsTraining(true);
      setError(null);
      setSuccessMessage(null);
      
      const trainingParams: TrainingParams = {
        model_type: modelType,
        instrument: instrument,
        target: target,
        horizon: getHorizonHours(horizon),
        training_period: getTrainingPeriodDays(trainingPeriod)
      };
      
      // If simulation mode is enabled, use the simulation directly
      if (simulationMode) {
        // Ensure simulation mode is enabled in the service
        mlService.enableSimulationMode();
        
        const response = await mlService.trainModel(trainingParams);
        
        // Start polling for model status
        const modelId = response.id;
        const statusInterval = setInterval(async () => {
          try {
            const modelStatus = await mlService.getModelStatus(modelId);
            setTrainingProgress(modelStatus.progress);
            
            if (modelStatus.status === 'trained' || modelStatus.status === 'failed') {
              clearInterval(statusInterval);
              setIsTraining(false);
              
              if (modelStatus.status === 'trained') {
                // Success - refresh models list
                fetchModels();
                setSuccessMessage(`Model trained successfully in simulation mode with ${(modelStatus.accuracy * 100).toFixed(2)}% accuracy`);
              } else {
                // Failed
                setError(`Training failed in simulation mode: ${modelStatus.training_phase}`);
              }
            }
          } catch (statusError) {
            console.error('Failed to get model status:', statusError);
            clearInterval(statusInterval);
            setIsTraining(false);
            setError('Failed to get model status. Please check the model list for updates.');
          }
        }, 2000);
        
        return;
      }
      
      // Try to use real model training
      try {
        const response = await mlService.trainModel(trainingParams);
        
        // Start polling for model status
        const modelId = response.id;
        const statusInterval = setInterval(async () => {
          try {
            const modelStatus = await mlService.getModelStatus(modelId);
            setTrainingProgress(modelStatus.progress);
            
            if (modelStatus.status === 'trained' || modelStatus.status === 'failed') {
              clearInterval(statusInterval);
              setIsTraining(false);
              
              if (modelStatus.status === 'trained') {
                // Success - refresh models list
                fetchModels();
                setSuccessMessage(`Model trained successfully with ${(modelStatus.accuracy * 100).toFixed(2)}% accuracy`);
              } else {
                // Failed
                setError(`Training failed: ${modelStatus.training_phase}`);
              }
            }
          } catch (statusError) {
            console.error('Failed to get model status:', statusError);
            clearInterval(statusInterval);
            setIsTraining(false);
            setError('Failed to get model status. Please check the model list for updates.');
          }
        }, 2000);
        
      } catch (error: any) {
        console.error('Failed to train model:', error);
        
        // Fallback to simulation mode
        if (window.confirm('Real model training failed. Would you like to use simulation mode instead?')) {
          // Enable simulation mode
          toggleSimulationMode(true);
          
          // Retry with simulation mode
          handleTrainModel();
        } else {
          setIsTraining(false);
          setError(`Failed to train model: ${error.response?.data?.error || error.message}`);
        }
      }
      
    } catch (error: any) {
      console.error('Failed to train model:', error);
      setIsTraining(false);
      setError(`Failed to train model: ${error.response?.data?.error || error.message}`);
    }
  };

  // Handle deleting a model
  const handleDeleteModel = async (modelId: number) => {
    setDeleteModelId(modelId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await mlService.deleteModel(deleteModelId!);
      toast({
        title: "Model Deleted",
        description: "The model has been successfully deleted.",
      });
      fetchModels(); // Refresh the models list
    } catch (error) {
      console.error("Failed to delete model:", error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the model. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  // Toggle simulation mode
  const toggleSimulationMode = (enabled: boolean) => {
    setSimulationMode(enabled);
    if (enabled) {
      mlService.enableSimulationMode();
      toast({
        title: "Simulation Mode Enabled",
        description: "Using simulated data for model training and predictions.",
      });
    } else {
      mlService.disableSimulationMode();
      toast({
        title: "Simulation Mode Disabled",
        description: "Using real data for model training and predictions.",
      });
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left Column - Training Form */}
      <div className="col-span-10 lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Train New Model</CardTitle>
            <CardDescription>Configure and train a new machine learning model</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="model-type">Model Type</Label>
              <Select value={modelType} onValueChange={setModelType}>
                <SelectTrigger id="model-type">
                  <SelectValue placeholder="Select a model type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear Regression</SelectItem>
                  <SelectItem value="random_forest">Random Forest</SelectItem>
                  <SelectItem value="xgboost">XGBoost</SelectItem>
                  <SelectItem value="lstm">LSTM Neural Network</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="instrument">Instrument</Label>
              <Select value={instrument} onValueChange={setInstrument}>
                <SelectTrigger id="instrument">
                  <SelectValue placeholder="Select an instrument" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EURUSD">EUR/USD</SelectItem>
                  <SelectItem value="GBPUSD">GBP/USD</SelectItem>
                  <SelectItem value="USDJPY">USD/JPY</SelectItem>
                  <SelectItem value="BTCUSD">BTC/USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="target">Target Variable</Label>
              <Select value={target} onValueChange={setTarget}>
                <SelectTrigger id="target">
                  <SelectValue placeholder="Select a target variable" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="direction">Direction</SelectItem>
                  <SelectItem value="volatility">Volatility</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="horizon">Prediction Horizon</Label>
              <Select value={horizon} onValueChange={setHorizon}>
                <SelectTrigger id="horizon">
                  <SelectValue placeholder="Select a prediction horizon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="4h">4 Hours</SelectItem>
                  <SelectItem value="1d">1 Day</SelectItem>
                  <SelectItem value="1w">1 Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="training-period">Training Period</Label>
              <Select value={trainingPeriod} onValueChange={setTrainingPeriod}>
                <SelectTrigger id="training-period">
                  <SelectValue placeholder="Select a training period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1 Month</SelectItem>
                  <SelectItem value="3m">3 Months</SelectItem>
                  <SelectItem value="6m">6 Months</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="simulation-mode">Simulation Mode</Label>
              <div className="flex items-center">
                <input 
                  id="simulation-mode" 
                  type="checkbox" 
                  checked={simulationMode} 
                  onChange={(e) => toggleSimulationMode(e.target.checked)} 
                  className="mr-2"
                />
                <span>Enable simulation mode</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full space-y-2">
              {isTraining && (
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>
                      {currentTrainingModel?.training_phase 
                        ? `${currentTrainingModel.training_phase} (${trainingProgress}%)`
                        : `Training Progress (${trainingProgress}%)`
                      }
                    </span>
                    <span>{trainingProgress}%</span>
                  </div>
                  <Progress value={trainingProgress} className="h-2" />
                </div>
              )}
              <Button 
                className="w-full"
                onClick={handleTrainModel} 
                disabled={isTraining || !modelType || !instrument || !target || !horizon || !trainingPeriod}
              >
                {isTraining ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Training
                  </>
                ) : (
                  'Train Model'
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Simulation Mode Banner */}
      {simulationMode && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Simulation Mode Active: </strong>
          <span className="block sm:inline">Using simulated data for model training and predictions. Results are not based on real market data.</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3" 
            onClick={() => toggleSimulationMode(false)}
          >
            <span className="text-yellow-500 hover:text-yellow-700">Disable</span>
          </button>
        </div>
      )}

      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </span>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success: </strong>
          <span className="block sm:inline">{successMessage}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setSuccessMessage(null)}>
            <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </span>
        </div>
      )}

      {/* Right Column - Results */}
      <div className="col-span-12 lg:col-span-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Available Models</CardTitle>
              <CardDescription>Models that you have trained</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchModels}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Loader2 className="h-12 w-12 animate-spin mb-4" />
                <h3 className="text-lg font-medium">Loading...</h3>
              </div>
            ) : models.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Instrument</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Horizon</TableHead>
                    <TableHead>Training Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {models.map((model) => (
                    <TableRow key={model.id}>
                      <TableCell className="font-medium">{model.model_type.toUpperCase()}</TableCell>
                      <TableCell>{model.instrument}</TableCell>
                      <TableCell>{model.target}</TableCell>
                      <TableCell>{model.horizon} hours</TableCell>
                      <TableCell>{model.training_period} days</TableCell>
                      <TableCell>
                        <Badge variant={
                          model.status === 'trained' ? 'default' : 
                          model.status === 'training' ? 'secondary' : 'destructive'
                        }>
                          {model.status === 'training' ? `${model.status} (${model.progress}%)` : model.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{model.accuracy ? (model.accuracy * 100).toFixed(2) + '%' : 'N/A'}</TableCell>
                      <TableCell>{new Date(model.created_at).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            asChild
                          >
                            <Link to={`/analysis/machine-learning/${model.id}`}>
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Details
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteModel(model.id)}
                            disabled={model.status === 'training'}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Database className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No models found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Train your first model to see results here
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="col-span-12 lg:col-span-10">
        <Card>
          <CardHeader>
            <CardTitle>Live Predictions</CardTitle>
            <CardDescription>Real-time predictions from your trained models</CardDescription>
          </CardHeader>
          <CardContent>
            <LivePredictions />
          </CardContent>
        </Card>
      </div>
      <div className="col-span-12 lg:col-span-10">
        <Card>
          <CardHeader>
            <CardTitle>Live Predictions</CardTitle>
            <CardDescription>Real-time predictions from your trained models</CardDescription>
          </CardHeader>
          <CardContent>
            <LivePredictions />
          </CardContent>
        </Card>
      </div>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogTrigger asChild>
          <span />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this model and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MachineLearning;
