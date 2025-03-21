// Define types for ML API responses
export interface MLModel {
  id: number;
  name?: string;
  model_type: string;
  instrument: string;
  target: string;
  horizon: number;
  training_period: number;
  status: string;
  progress: number;
  accuracy: number | null;
  created_at: string;
  updated_at?: string;
  training_phase?: string; // Optional field for current training phase
  feature_importance?: Array<{feature: string, importance: number}>;
  accuracy_history?: Array<{epoch: number, accuracy: number}>;
  prediction_history?: Array<{date: string, actual: number, predicted: number}>;
  recommendations?: Array<{action: string, confidence: number, reason: string}>;
}

export interface TrainingParams {
  model_type: string;
  instrument: string;
  target: string;
  horizon: number;
  training_period: number;
}
