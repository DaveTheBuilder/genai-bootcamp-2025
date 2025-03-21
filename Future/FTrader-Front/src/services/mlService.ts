import axios from 'axios';
import authService from './authService';
import { MLModel, TrainingParams } from '@/types/ml';

class MLService {
  private baseUrl: string;
  private simulationMode: boolean = false;
  private simulatedModels: MLModel[] = [];
  private nextModelId: number = 1000; // Start high to avoid conflicts with real models
  private apiUrl: string;
  private authToken: string;

  constructor() {
    // Use a specific environment variable for market data URL or default to market data endpoint
    this.baseUrl = import.meta.env.VITE_MARKET_API_URL || 'http://localhost:8000/api/market-data';
    this.apiUrl = import.meta.env.VITE_MARKET_API_URL || 'http://localhost:8000/api/market-data';
    
    // Check if we're authenticated with the backend
    this.authToken = authService.getAccessToken();
    
    // Enable simulation mode by default in development if no token is available
    if (!this.authToken && import.meta.env.DEV) {
      this.simulationMode = true;
      console.log('ML Service: Simulation mode enabled automatically (no auth token)');
    }
  }

  private async getHeaders(): Promise<{ [key: string]: string }> {
    // First try to get the current token
    const token = authService.getAccessToken();
    if (!token) {
      console.log('ML Service: No access token found');
      throw new Error('Not authenticated. Please log in first.');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // Check if token is expired
    const tokenExpiration = authService.getTokenExpiration(token);
    const now = new Date().getTime();
    
    if (tokenExpiration && now >= tokenExpiration) {
      try {
        await authService.refreshToken();
        // Update headers with new token
        headers['Authorization'] = `Bearer ${authService.getAccessToken()}`;
      } catch (error) {
        console.error('ML Service: Failed to refresh token:', error);
        throw new Error('Token refresh failed. Please log in again.');
      }
    }

    return headers;
  }

  // Enable simulation mode
  enableSimulationMode() {
    this.simulationMode = true;
    console.log('ML Service: Simulation mode enabled');
    return true;
  }

  // Disable simulation mode
  disableSimulationMode() {
    this.simulationMode = false;
    console.log('ML Service: Simulation mode disabled');
    return true;
  }

  // Check if simulation mode is enabled
  isSimulationModeEnabled() {
    return this.simulationMode;
  }

  // Train a new model
  async trainModel(params: TrainingParams): Promise<{ id: number; message: string }> {
    try {
      // Check authentication before making API call
      if (!authService.getAuthState().isAuthenticated) {
        throw new Error('Not authenticated. Please log in first.');
      }

      if (this.simulationMode) {
        return this.simulateTrainModel(params);
      }

      const headers = await this.getHeaders();
      const response = await axios.post(`${this.baseUrl}/ml/train/train/`, params, {
        headers,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to train model:', error);
      throw error;
    }
  }

  // Simulate training a model
  private simulateTrainModel(params: TrainingParams): Promise<{ id: number; message: string }> {
    return new Promise((resolve) => {
      const modelId = this.nextModelId++;
      
      // Create a new simulated model
      const newModel: MLModel = {
        id: modelId,
        name: `${params.model_type.toUpperCase()} - ${params.instrument} (Simulated)`,
        model_type: params.model_type,
        instrument: params.instrument,
        target: params.target,
        horizon: params.horizon,
        training_period: params.training_period,
        status: 'pending',
        progress: 0,
        accuracy: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        feature_importance: [],
        accuracy_history: [],
        prediction_history: [],
        recommendations: [],
        training_phase: 'initializing'
      };
      
      this.simulatedModels.push(newModel);
      
      // Start simulated training
      setTimeout(() => {
        const model = this.simulatedModels.find(m => m.id === modelId);
        if (model) {
          model.status = 'training';
          model.progress = 5;
          model.training_phase = 'data_collection';
        }
      }, 1000);
      
      setTimeout(() => {
        const model = this.simulatedModels.find(m => m.id === modelId);
        if (model) {
          model.progress = 30;
          model.training_phase = 'data_preparation';
        }
      }, 3000);
      
      setTimeout(() => {
        const model = this.simulatedModels.find(m => m.id === modelId);
        if (model) {
          model.progress = 60;
          model.training_phase = 'model_training';
        }
      }, 5000);
      
      setTimeout(() => {
        const model = this.simulatedModels.find(m => m.id === modelId);
        if (model) {
          model.progress = 90;
          model.training_phase = 'evaluation';
        }
      }, 7000);
      
      setTimeout(() => {
        const model = this.simulatedModels.find(m => m.id === modelId);
        if (model) {
          model.status = 'trained';
          model.progress = 100;
          model.accuracy = Math.random() * 0.3 + 0.6; // Random accuracy between 60% and 90%
          model.training_phase = 'completed';
          
          // Generate simulated feature importance
          model.feature_importance = [
            { feature: 'price_change', importance: Math.random() * 0.3 + 0.2 },
            { feature: 'volume', importance: Math.random() * 0.2 + 0.15 },
            { feature: 'rsi', importance: Math.random() * 0.2 + 0.1 },
            { feature: 'macd', importance: Math.random() * 0.15 + 0.05 },
            { feature: 'bollinger', importance: Math.random() * 0.1 + 0.05 }
          ];
          
          // Generate simulated accuracy history
          const accuracyPoints = 10;
          model.accuracy_history = Array.from({ length: accuracyPoints }, (_, i) => ({
            epoch: i + 1,
            accuracy: Math.random() * 0.4 + 0.5
          }));
          
          // Generate simulated prediction history
          const predictionPoints = 30;
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - predictionPoints);
          
          let currentPrice = 100;
          model.prediction_history = Array.from({ length: predictionPoints }, (_, i) => {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            
            const actualChange = (Math.random() - 0.5) * 5;
            currentPrice += actualChange;
            
            const predictedChange = actualChange + (Math.random() - 0.5) * 2;
            
            return {
              date: date.toISOString().split('T')[0],
              actual: currentPrice,
              predicted: currentPrice + predictedChange
            };
          });
          
          // Generate simulated recommendations
          model.recommendations = [
            { action: Math.random() > 0.5 ? 'buy' : 'sell', confidence: Math.random() * 0.3 + 0.6, reason: 'Based on technical indicators and historical patterns' },
            { action: Math.random() > 0.5 ? 'buy' : 'sell', confidence: Math.random() * 0.3 + 0.5, reason: 'Market momentum analysis suggests potential movement' }
          ];
        }
      }, 10000);
      
      resolve({ id: modelId, message: 'Model training started in simulation mode' });
    });
  }

  // Get model status
  async getModelStatus(modelId: number): Promise<any> {
    try {
      // Check authentication before making API call
      if (!authService.getAuthState().isAuthenticated) {
        throw new Error('Not authenticated. Please log in first.');
      }

      if (this.simulationMode) {
        return this.simulateGetModelStatus(modelId);
      }

      const headers = await this.getHeaders();
      const response = await axios.get(`${this.baseUrl}/ml-models/${modelId}/status/`, {
        headers,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to get model status:', error);
      throw error;
    }
  }

  // Simulate getting model status
  private simulateGetModelStatus(modelId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const model = this.simulatedModels.find(m => m.id === modelId);
      if (model) {
        resolve({ ...model });
      } else {
        reject(new Error('Model not found'));
      }
    });
  }

  // Get all models
  async getModels(): Promise<any> {
    try {
      // Check authentication before making API call
      if (!authService.getAuthState().isAuthenticated) {
        throw new Error('Not authenticated. Please log in first.');
      }

      if (this.simulationMode) {
        return this.simulatedModels;
      }

      const headers = await this.getHeaders();
      const response = await axios.get(`${this.baseUrl}/ml-models/`, {
        headers,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to get models:', error);
      throw error;
    }
  }

  // Delete a model
  async deleteModel(modelId: number): Promise<void> {
    try {
      // Check authentication before making API call
      if (!authService.getAuthState().isAuthenticated) {
        throw new Error('Not authenticated. Please log in first.');
      }

      if (this.simulationMode) {
        this.simulatedModels = this.simulatedModels.filter(model => model.id !== modelId);
        return;
      }

      const headers = await this.getHeaders();
      await axios.delete(`${this.baseUrl}/ml-models/${modelId}/`, {
        headers,
      });
    } catch (error) {
      console.error('Failed to delete model:', error);
      throw error;
    }
  }

  // Make a prediction
  async makePrediction(modelId: number, inputData: any): Promise<any> {
    try {
      // Check authentication before making API call
      if (!authService.getAuthState().isAuthenticated) {
        throw new Error('Not authenticated. Please log in first.');
      }

      const headers = await this.getHeaders();
      const response = await axios.post(`${this.baseUrl}/ml/predict/predict/`, {
        model_id: modelId,
        input_data: inputData
      }, {
        headers,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to make prediction:', error);
      throw error;
    }
  }

  // Get live predictions
  async getLivePredictions(modelId?: number): Promise<any> {
    try {
      // Check authentication before making API call
      if (!authService.getAuthState().isAuthenticated) {
        throw new Error('Not authenticated. Please log in first.');
      }

      const headers = await this.getHeaders();
      const url = modelId 
        ? `${this.apiUrl}/api/live-predictions/?model_id=${modelId}` 
        : `${this.apiUrl}/api/live-predictions/`;
      
      const response = await axios.get(url, {
        headers,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to get live predictions:', error);
      throw error;
    }
  }

  // Get detailed information about a model including analytics data
  async getModelDetails(modelId: number): Promise<any> {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(`${this.baseUrl}/ml-models/${modelId}/details/`, {
        headers,
      });

      console.log('Model details response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to get model details:', error);
      throw error;
    }
  }

  // Get live market data
  async getLiveMarketData(marketId?: number): Promise<any> {
    try {
      const url = marketId 
        ? `${this.apiUrl}/market_data/api/live-data/${marketId}/` 
        : `${this.apiUrl}/market_data/api/live-data/`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${this.authToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error fetching live market data: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching live market data:', error);
      throw error;
    }
  }

  // Run a prediction for a specific model
  async runPrediction(modelId: number): Promise<any> {
    try {
      const headers = await this.getHeaders();
      const url = `${this.apiUrl}/api/predict/${modelId}/`;
      
      console.log(`Running prediction for model ${modelId} at: ${url}`);
      const response = await axios.post(url, {}, {
        headers,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to run prediction:', error);
      throw error;
    }
  }
}

export default new MLService();
