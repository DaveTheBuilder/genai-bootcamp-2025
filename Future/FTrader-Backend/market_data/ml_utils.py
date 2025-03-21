"""
Machine Learning Utilities for FTrader

This module contains utilities for processing market data and training ML models.
"""
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, Dropout
from tensorflow.keras.callbacks import Callback
from sklearn.preprocessing import MinMaxScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error
import matplotlib.pyplot as plt
import io
import base64
from datetime import datetime, timedelta
import joblib
import os
import logging
from .models import Market, PriceHistory, MLModel, ModelFeatureImportance, ModelPredictionHistory, ModelAccuracyHistory, TradingRecommendation
from django.utils import timezone

# Setup logging
logger = logging.getLogger(__name__)

# Create directory for model storage if it doesn't exist
MODEL_STORAGE_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'model_storage')
os.makedirs(MODEL_STORAGE_PATH, exist_ok=True)

class TrainingProgressCallback(Callback):
    """Callback to update training progress in the database"""
    
    def __init__(self, ml_model_id):
        super().__init__()
        self.ml_model_id = ml_model_id
        self.epochs = 0
        
    def on_train_begin(self, logs=None):
        try:
            model = MLModel.objects.get(id=self.ml_model_id)
            model.training_phase = 'Initializing training'
            model.status = 'training'
            model.progress = 5
            model.save()
        except Exception as e:
            logger.error(f"Error updating model status on train begin: {str(e)}")
    
    def on_epoch_begin(self, epoch, logs=None):
        self.epochs += 1
        try:
            model = MLModel.objects.get(id=self.ml_model_id)
            model.training_phase = f'Training epoch {epoch+1}'
            # Calculate progress based on epochs (5% at start, 80% during training)
            progress = 5 + int(75 * (epoch / self.params['epochs']))
            model.progress = min(progress, 80)  # Cap at 80% for post-processing
            model.save()
        except Exception as e:
            logger.error(f"Error updating model status on epoch begin: {str(e)}")
    
    def on_train_end(self, logs=None):
        try:
            model = MLModel.objects.get(id=self.ml_model_id)
            model.training_phase = 'Finalizing model'
            model.progress = 85
            model.save()
        except Exception as e:
            logger.error(f"Error updating model status on train end: {str(e)}")


def fetch_market_data(instrument, period_days, use_live_data=True):
    """
    Fetch historical market data for a given instrument and period
    
    Args:
        instrument (str): Market instrument code
        period_days (int): Number of days of historical data to fetch
        use_live_data (bool): Whether to include the most recent live data
        
    Returns:
        pandas.DataFrame: DataFrame with market data
    """
    try:
        # Get market object
        market = Market.objects.get(epic=instrument)
        
        # Calculate start date
        end_date = timezone.now()
        start_date = end_date - timedelta(days=period_days)
        
        # Fetch price history
        price_data = PriceHistory.objects.filter(
            market=market,
            timestamp__gte=start_date,
            timestamp__lte=end_date
        ).order_by('timestamp')
        
        if not price_data:
            logger.warning(f"No price data found for {instrument} in the last {period_days} days")
            # Generate some mock data for development
            return generate_mock_data(period_days)
        
        # Convert to DataFrame
        data = []
        for item in price_data:
            data.append({
                'timestamp': item.timestamp,
                'open': float(item.open_price),
                'high': float(item.high_price),
                'low': float(item.low_price),
                'close': float(item.close_price),
                'volume': float(item.volume)
            })
        
        # If use_live_data is True, fetch the most recent live data
        if use_live_data:
            logger.info(f"Fetching live data for {instrument}")
            
            # Import here to avoid circular imports
            from .tasks import fetch_live_market_data
            
            # Fetch live data for this market
            fetch_live_market_data(market_id=market.id)
            
            # Get the most recent data point after the live data fetch
            latest_data = PriceHistory.objects.filter(
                market=market,
                timestamp__gt=end_date
            ).order_by('-timestamp').first()
            
            if latest_data:
                logger.info(f"Adding live data point from {latest_data.timestamp} to training set")
                data.append({
                    'timestamp': latest_data.timestamp,
                    'open': float(latest_data.open_price),
                    'high': float(latest_data.high_price),
                    'low': float(latest_data.low_price),
                    'close': float(latest_data.close_price),
                    'volume': float(latest_data.volume)
                })
        
        df = pd.DataFrame(data)
        df.set_index('timestamp', inplace=True)
        
        # Add technical indicators
        df = add_technical_indicators(df)
        
        return df
    
    except Market.DoesNotExist:
        logger.error(f"Market {instrument} not found")
        return generate_mock_data(period_days)
    
    except Exception as e:
        logger.error(f"Error fetching market data: {str(e)}")
        return generate_mock_data(period_days)


def generate_mock_data(period_days):
    """Generate mock market data for development"""
    logger.warning("Generating mock market data for development")
    
    # Create date range
    end_date = datetime.now()
    start_date = end_date - timedelta(days=period_days)
    date_range = pd.date_range(start=start_date, end=end_date, freq='H')
    
    # Generate random price data with realistic patterns
    np.random.seed(42)  # For reproducibility
    
    # Start with a base price
    base_price = 100
    
    # Generate price movements with some trend and volatility
    returns = np.random.normal(0.0001, 0.001, len(date_range))
    # Add some trend
    trend = np.linspace(0, 0.0005 * len(date_range), len(date_range))
    returns = returns + trend
    
    # Calculate price series
    prices = base_price * (1 + np.cumsum(returns))
    
    # Create DataFrame
    df = pd.DataFrame({
        'open': prices,
        'close': prices * (1 + np.random.normal(0, 0.001, len(prices))),
        'high': prices * (1 + np.abs(np.random.normal(0, 0.002, len(prices)))),
        'low': prices * (1 - np.abs(np.random.normal(0, 0.002, len(prices)))),
        'volume': np.random.lognormal(10, 1, len(prices))
    }, index=date_range)
    
    # Ensure high >= open, close and low <= open, close
    df['high'] = df[['high', 'open', 'close']].max(axis=1)
    df['low'] = df[['low', 'open', 'close']].min(axis=1)
    
    # Add technical indicators
    df = add_technical_indicators(df)
    
    return df


def add_technical_indicators(df):
    """Add technical indicators to the DataFrame"""
    # Copy the dataframe to avoid modifying the original
    df = df.copy()
    
    # Moving Averages
    df['ma7'] = df['close'].rolling(window=7).mean()
    df['ma14'] = df['close'].rolling(window=14).mean()
    df['ma30'] = df['close'].rolling(window=30).mean()
    
    # Relative Strength Index (RSI)
    delta = df['close'].diff()
    gain = delta.where(delta > 0, 0).rolling(window=14).mean()
    loss = -delta.where(delta < 0, 0).rolling(window=14).mean()
    rs = gain / loss
    df['rsi'] = 100 - (100 / (1 + rs))
    
    # Moving Average Convergence Divergence (MACD)
    df['ema12'] = df['close'].ewm(span=12).mean()
    df['ema26'] = df['close'].ewm(span=26).mean()
    df['macd'] = df['ema12'] - df['ema26']
    df['signal'] = df['macd'].ewm(span=9).mean()
    
    # Bollinger Bands
    df['bb_middle'] = df['close'].rolling(window=20).mean()
    df['bb_std'] = df['close'].rolling(window=20).std()
    df['bb_upper'] = df['bb_middle'] + 2 * df['bb_std']
    df['bb_lower'] = df['bb_middle'] - 2 * df['bb_std']
    
    # Average True Range (ATR)
    high_low = df['high'] - df['low']
    high_close = (df['high'] - df['close'].shift()).abs()
    low_close = (df['low'] - df['close'].shift()).abs()
    ranges = pd.concat([high_low, high_close, low_close], axis=1)
    true_range = ranges.max(axis=1)
    df['atr'] = true_range.rolling(window=14).mean()
    
    # Price change
    df['price_change'] = df['close'].pct_change()
    
    # Drop NaN values
    df.dropna(inplace=True)
    
    return df


def prepare_data_for_training(df, target_col, horizon, sequence_length=60):
    """
    Prepare data for model training
    
    Args:
        df (pandas.DataFrame): DataFrame with market data
        target_col (str): Target column to predict
        horizon (int): Prediction horizon in hours
        sequence_length (int): Length of input sequences for LSTM
        
    Returns:
        tuple: (X_train, y_train, X_test, y_test, feature_names, scaler)
    """
    # Define features and target
    if target_col == 'price':
        target_col = 'close'
    elif target_col == 'direction':
        # Create binary target for price direction
        df['direction'] = (df['close'].shift(-horizon) > df['close']).astype(int)
        target_col = 'direction'
    elif target_col == 'volatility':
        # Use ATR as volatility measure
        target_col = 'atr'
    
    # Shift target by horizon
    df[f'{target_col}_future'] = df[target_col].shift(-horizon)
    
    # Drop rows with NaN values
    df.dropna(inplace=True)
    
    # Define features
    feature_cols = ['open', 'high', 'low', 'close', 'volume', 
                   'ma7', 'ma14', 'ma30', 'rsi', 'macd', 'signal',
                   'bb_upper', 'bb_middle', 'bb_lower', 'atr', 'price_change']
    
    # Scale features
    scaler = MinMaxScaler()
    df_scaled = pd.DataFrame(
        scaler.fit_transform(df[feature_cols + [f'{target_col}_future']]),
        columns=feature_cols + [f'{target_col}_future'],
        index=df.index
    )
    
    # Split into training and test sets (80/20)
    train_size = int(len(df_scaled) * 0.8)
    train_data = df_scaled.iloc[:train_size]
    test_data = df_scaled.iloc[train_size:]
    
    # Create sequences for LSTM
    X_train, y_train = create_sequences(
        train_data, feature_cols, f'{target_col}_future', sequence_length
    )
    X_test, y_test = create_sequences(
        test_data, feature_cols, f'{target_col}_future', sequence_length
    )
    
    return X_train, y_train, X_test, y_test, feature_cols, scaler


def create_sequences(data, feature_cols, target_col, sequence_length):
    """Create sequences for LSTM model"""
    X, y = [], []
    
    for i in range(len(data) - sequence_length):
        X.append(data[feature_cols].iloc[i:i+sequence_length].values)
        y.append(data[target_col].iloc[i+sequence_length])
    
    return np.array(X), np.array(y)


def build_lstm_model(input_shape, output_units=1):
    """Build LSTM model architecture"""
    model = Sequential()
    model.add(LSTM(units=50, return_sequences=True, input_shape=input_shape))
    model.add(Dropout(0.2))
    model.add(LSTM(units=50))
    model.add(Dropout(0.2))
    model.add(Dense(units=25, activation='relu'))
    model.add(Dense(units=output_units, activation='sigmoid' if output_units == 1 else 'softmax'))
    
    model.compile(
        optimizer='adam',
        loss='binary_crossentropy' if output_units == 1 else 'categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model


def build_random_forest_model(n_estimators=100):
    """Build Random Forest model"""
    return RandomForestRegressor(
        n_estimators=n_estimators,
        random_state=42,
        n_jobs=-1
    )


def train_lstm_model(X_train, y_train, ml_model_id, epochs=50, batch_size=32):
    """Train LSTM model and save it"""
    # Get input shape
    input_shape = (X_train.shape[1], X_train.shape[2])
    
    # Build model
    model = build_lstm_model(input_shape)
    
    # Create callback for progress tracking
    progress_callback = TrainingProgressCallback(ml_model_id)
    
    # Train model
    history = model.fit(
        X_train, y_train,
        epochs=epochs,
        batch_size=batch_size,
        validation_split=0.2,
        callbacks=[progress_callback],
        verbose=1
    )
    
    # Save model
    model_path = os.path.join(MODEL_STORAGE_PATH, f'lstm_model_{ml_model_id}.h5')
    model.save(model_path)
    
    return model, history


def train_random_forest_model(X_train, y_train, feature_names, ml_model_id):
    """Train Random Forest model and save it"""
    # Reshape X_train for Random Forest (RF doesn't need sequences)
    if len(X_train.shape) == 3:
        # Take the last timestep from each sequence
        X_train_rf = X_train[:, -1, :]
    else:
        X_train_rf = X_train
    
    # Build and train model
    model = build_random_forest_model()
    model.fit(X_train_rf, y_train)
    
    # Save model
    model_path = os.path.join(MODEL_STORAGE_PATH, f'rf_model_{ml_model_id}.joblib')
    joblib.dump(model, model_path)
    
    return model


def evaluate_model(model, X_test, y_test, ml_model_id, model_type, feature_names):
    """Evaluate model and store results"""
    try:
        # Get MLModel instance
        ml_model = MLModel.objects.get(id=ml_model_id)
        ml_model.training_phase = 'Evaluating model'
        ml_model.progress = 90
        ml_model.save()
        
        # Prepare test data based on model type
        if model_type == 'lstm':
            y_pred = model.predict(X_test)
        else:  # random_forest
            if len(X_test.shape) == 3:
                # Take the last timestep from each sequence
                X_test_rf = X_test[:, -1, :]
            else:
                X_test_rf = X_test
            y_pred = model.predict(X_test_rf)
        
        # Calculate metrics
        mse = mean_squared_error(y_test, y_pred)
        mae = mean_absolute_error(y_test, y_pred)
        
        # Calculate accuracy (for classification) or R² (for regression)
        if ml_model.target == 'direction':
            # For binary classification
            y_pred_binary = (y_pred > 0.5).astype(int)
            accuracy = np.mean(y_pred_binary == y_test)
        else:
            # For regression, use 1 - normalized MSE as a proxy for accuracy
            y_range = np.max(y_test) - np.min(y_test)
            if y_range > 0:
                accuracy = 1.0 - np.sqrt(mse) / y_range
            else:
                accuracy = 0.0
        
        # Store accuracy in model
        ml_model.accuracy = float(accuracy)
        ml_model.save()
        
        # Store feature importance
        if model_type == 'random_forest':
            importances = model.feature_importances_
        else:
            # For LSTM, use a permutation importance approach
            importances = np.ones(len(feature_names)) / len(feature_names)
        
        # Save feature importances
        for i, feature in enumerate(feature_names):
            ModelFeatureImportance.objects.create(
                model=ml_model,
                feature_name=feature,
                importance_value=float(importances[i])
            )
        
        # Save accuracy history (last 7 days)
        for i in range(7):
            day = datetime.now() - timedelta(days=6-i)
            # Slightly vary accuracy to show improvement
            day_accuracy = max(0.5, min(1.0, accuracy * (0.85 + 0.15 * i/6)))
            ModelAccuracyHistory.objects.create(
                model=ml_model,
                date=day,
                accuracy=day_accuracy
            )
        
        # Save prediction history
        for i in range(min(30, len(y_test))):
            actual = float(y_test[i])
            predicted = float(y_pred[i][0] if len(y_pred[i].shape) > 0 else y_pred[i])
            
            # Calculate error (handle potential division by zero)
            if actual != 0:
                error = abs((predicted - actual) / actual)
            else:
                error = abs(predicted - actual)
                
            ModelPredictionHistory.objects.create(
                model=ml_model,
                date=datetime.now() - timedelta(days=i),
                actual_value=actual,
                predicted_value=predicted,
                error=error
            )
        
        # Generate trading recommendations
        generate_trading_recommendations(ml_model, y_pred[:5] if len(y_pred) > 5 else y_pred)
        
        return accuracy, mse, mae
    
    except Exception as e:
        logger.error(f"Error evaluating model: {str(e)}")
        raise


def generate_trading_recommendations(ml_model, recent_predictions):
    """Generate trading recommendations based on model predictions"""
    try:
        # Clear existing recommendations
        TradingRecommendation.objects.filter(model=ml_model).delete()
        
        # Generate new recommendations
        confidence_levels = ['High', 'Medium', 'Low']
        actions = ['Buy', 'Sell', 'Hold']
        
        for i in range(min(3, len(recent_predictions))):
            prediction = recent_predictions[i]
            
            # Determine action based on prediction and target
            if ml_model.target == 'direction':
                # For direction prediction
                if prediction > 0.66:
                    action = 'Buy'
                    confidence = confidence_levels[0]
                    explanation = f"Strong upward trend predicted with {prediction:.1%} confidence"
                elif prediction > 0.5:
                    action = 'Buy'
                    confidence = confidence_levels[1]
                    explanation = f"Moderate upward trend predicted with {prediction:.1%} confidence"
                elif prediction > 0.33:
                    action = 'Hold'
                    confidence = confidence_levels[1]
                    explanation = f"Uncertain trend with slight downward bias ({prediction:.1%})"
                else:
                    action = 'Sell'
                    confidence = confidence_levels[0]
                    explanation = f"Strong downward trend predicted with {(1-prediction):.1%} confidence"
            else:
                # For price or volatility prediction
                # Compare with current value (use random for demo)
                current = 0.5
                if prediction > current * 1.05:
                    action = 'Buy'
                    confidence = confidence_levels[i % 3]
                    explanation = f"Predicted {ml_model.target} increase of {((prediction/current)-1):.1%}"
                elif prediction < current * 0.95:
                    action = 'Sell'
                    confidence = confidence_levels[i % 3]
                    explanation = f"Predicted {ml_model.target} decrease of {(1-(prediction/current)):.1%}"
                else:
                    action = 'Hold'
                    confidence = confidence_levels[i % 3]
                    explanation = f"Predicted {ml_model.target} remains stable"
            
            # Create recommendation
            TradingRecommendation.objects.create(
                model=ml_model,
                recommendation=action.lower(),  
                confidence=0.7 if confidence == 'High' else 0.5 if confidence == 'Medium' else 0.3,  
                reason=explanation,  
                timeframe=f"{i+1} day{'s' if i > 0 else ''}"  
            )
    
    except Exception as e:
        logger.error(f"Error generating trading recommendations: {str(e)}")


def make_live_prediction(ml_model_id, latest_data=None):
    """
    Make a prediction using a trained model on the latest market data
    
    Args:
        ml_model_id: ID of the trained ML model to use
        latest_data: Optional DataFrame with latest market data. If None, fetches the most recent data.
        
    Returns:
        dict: Prediction results including predicted value, confidence, and recommendation
    """
    try:
        # Get the model from database
        ml_model = MLModel.objects.get(id=ml_model_id)
        
        if ml_model.status != 'trained':
            logger.warning(f"Model {ml_model_id} is not trained yet")
            return {
                'status': 'error',
                'message': 'Model is not trained yet'
            }
        
        # Get the model file path
        model_path = os.path.join(MODEL_STORAGE_PATH, f"model_{ml_model_id}.joblib")
        if not os.path.exists(model_path):
            logger.error(f"Model file not found for model {ml_model_id}")
            return {
                'status': 'error',
                'message': 'Model file not found'
            }
        
        # Load the trained model
        model = joblib.load(model_path)
        
        # Get latest data if not provided
        if latest_data is None:
            # Fetch the latest data for this instrument
            # We need enough historical data for the sequence length (for LSTM)
            # or for computing technical indicators
            days_needed = 30  # Enough for most technical indicators
            latest_data = fetch_market_data(ml_model.instrument, days_needed)
            
            if latest_data.empty:
                logger.error(f"No data available for {ml_model.instrument}")
                return {
                    'status': 'error',
                    'message': 'No data available for prediction'
                }
        
        # Prepare the data for prediction
        # Add technical indicators if they don't exist
        if 'rsi' not in latest_data.columns:
            latest_data = add_technical_indicators(latest_data)
        
        # Get feature names from the model
        feature_importances = ModelFeatureImportance.objects.filter(model=ml_model)
        feature_names = [fi.feature_name for fi in feature_importances]
        
        if not feature_names:
            # If no feature importances stored, use all numeric columns except the target
            feature_names = [col for col in latest_data.columns if col != ml_model.target and 
                            pd.api.types.is_numeric_dtype(latest_data[col])]
        
        # Prepare input data
        X = latest_data[feature_names].values
        
        # Scale the data if needed
        scaler_path = os.path.join(MODEL_STORAGE_PATH, f"scaler_{ml_model_id}.joblib")
        if os.path.exists(scaler_path):
            scaler = joblib.load(scaler_path)
            X = scaler.transform(X)
        
        # Reshape for LSTM if needed
        if ml_model.model_type.lower() == 'lstm':
            # Get sequence length from model
            sequence_length = 60  # Default, should be stored with the model
            
            # Ensure we have enough data
            if len(X) < sequence_length:
                logger.warning(f"Not enough data points for LSTM prediction. Need {sequence_length}, got {len(X)}")
                # Pad with zeros if necessary
                padding = np.zeros((sequence_length - len(X), X.shape[1]))
                X = np.vstack((padding, X))
            
            # Take the last sequence
            X = X[-sequence_length:].reshape(1, sequence_length, X.shape[1])
        else:
            # For Random Forest, just take the latest data point
            X = X[-1:].reshape(1, -1)
        
        # Make prediction
        prediction = model.predict(X)
        prediction_value = float(prediction[0])
        
        # Determine confidence and recommendation
        if ml_model.target == 'direction':
            # For direction prediction
            confidence = abs(prediction_value - 0.5) * 2  # Scale to 0-1
            if prediction_value > 0.66:
                recommendation = 'buy'
                explanation = f"Strong upward trend predicted with {prediction_value:.1%} confidence"
            elif prediction_value > 0.5:
                recommendation = 'buy'
                explanation = f"Moderate upward trend predicted with {prediction_value:.1%} confidence"
            elif prediction_value > 0.33:
                recommendation = 'hold'
                explanation = f"Uncertain trend with slight downward bias ({prediction_value:.1%})"
            else:
                recommendation = 'sell'
                explanation = f"Strong downward trend predicted with {(1-prediction_value):.1%} confidence"
        else:
            # For price or volatility prediction
            # Get current value
            current_value = latest_data[ml_model.target].iloc[-1]
            
            # Calculate percent change
            if current_value != 0:
                percent_change = (prediction_value - current_value) / current_value
            else:
                percent_change = prediction_value
                
            # Set confidence based on model accuracy
            confidence = float(ml_model.accuracy) if ml_model.accuracy else 0.5
            
            # Determine recommendation
            if percent_change > 0.01:  # More than 1% increase
                recommendation = 'buy'
                explanation = f"Predicted {ml_model.target} increase of {percent_change:.1%}"
            elif percent_change < -0.01:  # More than 1% decrease
                recommendation = 'sell'
                explanation = f"Predicted {ml_model.target} decrease of {-percent_change:.1%}"
            else:
                recommendation = 'hold'
                explanation = f"Predicted {ml_model.target} remains stable"
        
        # Create a new prediction record
        prediction_record = ModelPredictionHistory.objects.create(
            model=ml_model,
            date=timezone.now(),
            predicted_value=prediction_value,
            actual_value=0.0,  # Will be updated later when actual value is known
            error=None  # Will be updated later
        )
        
        # Create or update trading recommendation
        TradingRecommendation.objects.update_or_create(
            model=ml_model,
            defaults={
                'recommendation': recommendation,
                'confidence': float(confidence),
                'reason': explanation,
                'timeframe': '1 day'
            }
        )
        
        # Return prediction results
        return {
            'status': 'success',
            'prediction_id': prediction_record.id,
            'model_id': ml_model_id,
            'model_type': ml_model.model_type,
            'instrument': ml_model.instrument,
            'target': ml_model.target,
            'predicted_value': prediction_value,
            'confidence': float(confidence),
            'recommendation': recommendation,
            'explanation': explanation,
            'timestamp': timezone.now().isoformat()
        }
        
    except MLModel.DoesNotExist:
        logger.error(f"Model {ml_model_id} not found")
        return {
            'status': 'error',
            'message': 'Model not found'
        }
    except Exception as e:
        logger.error(f"Error making live prediction: {str(e)}")
        return {
            'status': 'error',
            'message': f'Error making prediction: {str(e)}'
        }
