from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Market(models.Model):
    """
    Model to store market information from IG API
    """
    epic = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=255)
    instrument_type = models.CharField(max_length=100)
    expiry = models.CharField(max_length=100, blank=True, null=True)
    high = models.DecimalField(max_digits=15, decimal_places=5, blank=True, null=True)
    low = models.DecimalField(max_digits=15, decimal_places=5, blank=True, null=True)
    percentage_change = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    net_change = models.DecimalField(max_digits=15, decimal_places=5, blank=True, null=True)
    bid = models.DecimalField(max_digits=15, decimal_places=5, blank=True, null=True)
    offer = models.DecimalField(max_digits=15, decimal_places=5, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} ({self.epic})"


class WatchList(models.Model):
    """
    Model to store user watchlists
    """
    name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='watchlists')
    markets = models.ManyToManyField(Market, related_name='watchlists')
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('name', 'user')
    
    def __str__(self):
        return f"{self.user.username}'s {self.name} watchlist"


class PriceHistory(models.Model):
    """
    Model to store historical price data
    """
    market = models.ForeignKey(Market, on_delete=models.CASCADE, related_name='price_history')
    timestamp = models.DateTimeField()
    open_price = models.DecimalField(max_digits=15, decimal_places=5)
    close_price = models.DecimalField(max_digits=15, decimal_places=5)
    high_price = models.DecimalField(max_digits=15, decimal_places=5)
    low_price = models.DecimalField(max_digits=15, decimal_places=5)
    volume = models.IntegerField(blank=True, null=True)
    
    class Meta:
        unique_together = ('market', 'timestamp')
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.market.name} price at {self.timestamp}"


class MarketAlert(models.Model):
    """
    Model to store user-defined market alerts
    """
    ALERT_TYPES = (
        ('price_above', 'Price Above'),
        ('price_below', 'Price Below'),
        ('price_change_percent', 'Price Change Percent'),
        ('price_change_value', 'Price Change Value'),
    )
    
    ALERT_STATUS = (
        ('active', 'Active'),
        ('triggered', 'Triggered'),
        ('expired', 'Expired'),
        ('cancelled', 'Cancelled'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='market_alerts')
    market = models.ForeignKey(Market, on_delete=models.CASCADE, related_name='alerts')
    alert_type = models.CharField(max_length=20, choices=ALERT_TYPES)
    threshold_value = models.DecimalField(max_digits=15, decimal_places=5)
    status = models.CharField(max_length=10, choices=ALERT_STATUS, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    triggered_at = models.DateTimeField(blank=True, null=True)
    expiry_date = models.DateTimeField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.user.username}'s alert for {self.market.name} ({self.alert_type})"

class MLModel(models.Model):
    """
    Machine Learning model for market prediction
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('queued', 'Queued'),
        ('training', 'Training'),
        ('trained', 'Trained'),
        ('active', 'Active'),
        ('queued_for_retraining', 'Queued for Retraining'),
        ('failed', 'Failed'),
    ]
    model_type = models.CharField(max_length=50)  # e.g., 'lstm', 'random_forest', etc.
    instrument = models.CharField(max_length=50)  # e.g., 'EURUSD', 'BTCUSD', etc.
    target = models.CharField(max_length=50)  # e.g., 'price', 'direction', 'volatility'
    horizon = models.IntegerField()  # Prediction horizon in hours
    training_period = models.IntegerField()  # Training period in days
    status = models.CharField(max_length=25, choices=STATUS_CHOICES, default='pending')  # 'pending', 'training', 'trained', 'failed'
    progress = models.IntegerField(default=0)  # Training progress (0-100)
    accuracy = models.FloatField(null=True, blank=True)  # Model accuracy (0-1)
    training_phase = models.TextField(null=True, blank=True)  # Current training phase - using TextField for longer messages
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_retrained = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.model_type} model for {self.instrument}"


class ModelFeatureImportance(models.Model):
    """
    Stores feature importance data for ML models
    """
    model = models.ForeignKey(MLModel, on_delete=models.CASCADE, related_name='feature_importance')
    feature_name = models.CharField(max_length=100)
    importance_value = models.FloatField()
    
    def __str__(self):
        return f"{self.feature_name} ({self.importance_value}) for model {self.model.id}"


class ModelPredictionHistory(models.Model):
    """
    Stores historical prediction data for ML models
    """
    model = models.ForeignKey(MLModel, on_delete=models.CASCADE, related_name='prediction_history')
    date = models.DateTimeField()
    actual_value = models.FloatField()
    predicted_value = models.FloatField()
    error = models.FloatField(null=True, blank=True)  # Allow null values for error field
    
    class Meta:
        ordering = ['date']
    
    def __str__(self):
        return f"Prediction for model {self.model.id} at {self.date}"


class ModelAccuracyHistory(models.Model):
    """
    Stores historical accuracy data for ML models
    """
    model = models.ForeignKey(MLModel, on_delete=models.CASCADE, related_name='accuracy_history')
    date = models.DateTimeField()
    accuracy = models.FloatField()
    
    class Meta:
        ordering = ['date']
    
    def __str__(self):
        return f"Accuracy for model {self.model.id} at {self.date}"


class TradingRecommendation(models.Model):
    """
    Stores trading recommendations generated by ML models
    """
    RECOMMENDATION_CHOICES = [
        ('buy', 'Buy'),
        ('sell', 'Sell'),
        ('hold', 'Hold'),
    ]
    
    model = models.ForeignKey(MLModel, on_delete=models.CASCADE, related_name='recommendations')
    recommendation = models.CharField(max_length=10, choices=RECOMMENDATION_CHOICES)
    confidence = models.FloatField()
    reason = models.TextField()
    timeframe = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.recommendation} recommendation for model {self.model.id}"


class UserMarketStream(models.Model):
    """
    Model to track which markets a user wants to stream data for
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='streaming_markets')
    market = models.ForeignKey(Market, on_delete=models.CASCADE, related_name='streaming_users')
    is_streaming = models.BooleanField(default=False)
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('user', 'market')
        
    def __str__(self):
        return f"{self.user.username} streaming {self.market.name} ({'active' if self.is_streaming else 'inactive'})"