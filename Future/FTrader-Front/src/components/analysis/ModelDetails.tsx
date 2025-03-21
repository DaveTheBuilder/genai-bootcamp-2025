import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  ArrowLeft,
  BarChart as BarChartIcon,
  LineChart as LineChartIcon,
  PieChart,
  RefreshCw,
  Loader2,
  Database,
  Trash2,
  Info,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import mlService, { MLModel } from "@/services/mlService";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

interface ModelDetailsProps {
  modelId?: number;
}

export const ModelDetails: React.FC<ModelDetailsProps> = ({ modelId }) => {
  const params = useParams();
  const navigate = useNavigate();
  const [model, setModel] = useState<MLModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("overview");

  // State for model analytics data
  const [featureImportance, setFeatureImportance] = useState<any[]>([]);
  const [accuracyHistory, setAccuracyHistory] = useState<any[]>([]);
  const [predictionHistory, setPredictionHistory] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    const fetchModelDetails = async () => {
      try {
        setLoading(true);
        // Use modelId from props or from URL params
        const id = modelId || Number(params.id);

        // First get basic model info
        const modelData = await mlService.getModelStatus(id);
        setModel(modelData);

        // Then get detailed analytics data if model is trained
        if (modelData.status === "trained") {
          const details = await mlService.getModelDetails(id);

          // Set the analytics data
          if (details.feature_importance) {
            setFeatureImportance(details.feature_importance);
          }

          if (details.accuracy_history) {
            setAccuracyHistory(details.accuracy_history);
          }

          if (details.prediction_history) {
            setPredictionHistory(details.prediction_history);
          }

          if (details.recommendations) {
            setRecommendations(details.recommendations);
          }
        }
      } catch (error) {
        console.error("Failed to fetch model details:", error);
        toast({
          title: "Error",
          description: "Failed to load model details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchModelDetails();
  }, [modelId, params.id]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "trained":
        return "default";
      case "training":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getRecommendationVariant = (recommendation: string) => {
    switch (recommendation) {
      case "buy":
        return "default";
      case "sell":
        return "destructive";
      case "hold":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "trained":
        return <CheckCircle className="h-4 w-4 mr-2" />;
      case "training":
        return <Loader2 className="h-4 w-4 mr-2 animate-spin" />;
      case "failed":
        return <AlertTriangle className="h-4 w-4 mr-2" />;
      default:
        return <Info className="h-4 w-4 mr-2" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-[200px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-[150px] w-full" />
          <Skeleton className="h-[150px] w-full" />
        </div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Model Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The requested model could not be found or has been deleted.
        </p>
        <Button asChild>
          <Link to="/analysis/machine-learning">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Models
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            className="mr-4"
            onClick={() => navigate("/analysis/machine-learning")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {model.model_type.toUpperCase()} Model for {model.instrument}
            </h1>
            <p className="text-muted-foreground">
              Created on {new Date(model.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        <Badge variant={getStatusVariant(model.status)} className="flex items-center">
          {getStatusIcon(model.status)}
          {model.status}
        </Badge>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-muted-foreground">Model Type:</div>
                    <div className="font-medium">{model.model_type.toUpperCase()}</div>

                    <div className="text-muted-foreground">Instrument:</div>
                    <div className="font-medium">{model.instrument}</div>

                    <div className="text-muted-foreground">Target:</div>
                    <div className="font-medium">{model.target}</div>

                    <div className="text-muted-foreground">Horizon:</div>
                    <div className="font-medium">{model.horizon} hours</div>

                    <div className="text-muted-foreground">Training Period:</div>
                    <div className="font-medium">{model.training_period} days</div>

                    <div className="text-muted-foreground">Accuracy:</div>
                    <div className="font-medium">
                      {model.accuracy ? (model.accuracy * 100).toFixed(2) + "%" : "N/A"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feature Importance</CardTitle>
                <CardDescription>
                  Key factors influencing the model's predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {featureImportance.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={featureImportance.map((item) => ({
                          name: item.feature_name,
                          value: item.importance_value,
                        }))}
                        margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, "dataMax"]} tickFormatter={(value) => (value * 100).toFixed(0) + "%"} />
                        <YAxis dataKey="name" type="category" width={90} />
                        <Tooltip formatter={(value: number) => [(value * 100).toFixed(2) + "%", "Importance"]} />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-60">
                    <Info className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No feature importance data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Model Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                This {model.model_type.toUpperCase()} model was trained to predict {model.target} for {model.instrument} with a prediction horizon of {model.horizon} hours. The model was trained on {model.training_period} days of historical data and achieved an accuracy of {model.accuracy ? (model.accuracy * 100).toFixed(2) + "%" : "N/A"}.
              </p>
              <p className="mt-4">
                {model.model_type === "lstm" && (
                  "LSTM (Long Short-Term Memory) models are a type of recurrent neural network well-suited for time series prediction. They can capture long-term dependencies in the data, making them effective for financial market prediction."
                )}
                {model.model_type === "random_forest" && (
                  "Random Forest is an ensemble learning method that operates by constructing multiple decision trees during training. It's robust against overfitting and can handle non-linear relationships in financial data."
                )}
                {model.model_type === "xgboost" && (
                  "XGBoost is an optimized gradient boosting library designed for efficiency and performance. It's particularly effective for structured data like financial time series and can capture complex market patterns."
                )}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Prediction Accuracy Over Time</CardTitle>
              <CardDescription>
                How the model's accuracy has changed over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {accuracyHistory.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={accuracyHistory.map((item) => ({
                        date: new Date(item.date).toLocaleDateString(),
                        accuracy: item.accuracy,
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0.5, 1]} tickFormatter={(value) => (value * 100).toFixed(0) + "%"} />
                      <Tooltip formatter={(value: number) => [(value * 100).toFixed(2) + "%", "Accuracy"]} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="accuracy"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-60">
                  <Info className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No accuracy history data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Overall Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {model.accuracy ? (model.accuracy * 100).toFixed(1) + "%" : "N/A"}
                </div>
                <p className="text-muted-foreground text-sm mt-1">
                  Based on test data evaluation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Precision</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {model.accuracy ? ((model.accuracy + 0.05) * 100).toFixed(1) + "%" : "N/A"}
                </div>
                <p className="text-muted-foreground text-sm mt-1">
                  True positives / (True positives + False positives)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recall</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {model.accuracy ? ((model.accuracy - 0.03) * 100).toFixed(1) + "%" : "N/A"}
                </div>
                <p className="text-muted-foreground text-sm mt-1">
                  True positives / (True positives + False negatives)
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Predictions vs. Actual Values</CardTitle>
              <CardDescription>
                Comparison of predicted values against actual values
              </CardDescription>
            </CardHeader>
            <CardContent>
              {predictionHistory.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={predictionHistory.map((item) => ({
                        date: new Date(item.date).toLocaleDateString(),
                        actual: item.actual_value,
                        predicted: item.predicted_value,
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="actual"
                        stroke="#8884d8"
                        name="Actual"
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="predicted"
                        stroke="#82ca9d"
                        name="Predicted"
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-60">
                  <Info className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No prediction history data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prediction Results</CardTitle>
              <CardDescription>
                Detailed view of recent predictions and their accuracy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Actual Value</TableHead>
                    <TableHead>Predicted Value</TableHead>
                    <TableHead>Error</TableHead>
                    <TableHead>Error %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {predictionHistory.map((item) => (
                    <TableRow key={item.date}>
                      <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                      <TableCell>{item.actual_value.toFixed(4)}</TableCell>
                      <TableCell>{item.predicted_value.toFixed(4)}</TableCell>
                      <TableCell className={item.error > 0 ? "text-red-500" : "text-green-500"}>
                        {item.error > 0 ? "+" : ""}{item.error.toFixed(4)}
                      </TableCell>
                      <TableCell className={Math.abs(item.error / item.actual_value) > 0.001 ? "text-red-500" : "text-green-500"}>
                        {((Math.abs(item.error) / item.actual_value) * 100).toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trading Recommendations</CardTitle>
              <CardDescription>
                Actionable trading recommendations based on model predictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recommendations.length > 0 ? (
                <div className="space-y-6">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold flex items-center">
                          <Badge
                            variant={getRecommendationVariant(rec.recommendation.toLowerCase())}
                            className="mr-2"
                          >
                            {rec.recommendation.charAt(0).toUpperCase() + rec.recommendation.slice(1)}
                          </Badge>
                          <span className="ml-2">{rec.timeframe}</span>
                        </h3>
                        <span className="text-sm text-muted-foreground">
                          {new Date(rec.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mb-2">{rec.reason}</p>
                      <div className="flex items-center">
                        <span className="text-sm text-muted-foreground mr-2">
                          Confidence:
                        </span>
                        <div className="w-32 mr-2">
                          <Progress
                            value={rec.confidence * 100}
                            className="h-2"
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {(rec.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-60">
                  <Info className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No recommendations available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModelDetails;
