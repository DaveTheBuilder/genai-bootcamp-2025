from rest_framework import serializers
from .models import Market, WatchList, PriceHistory, MarketAlert, MLModel, ModelFeatureImportance, ModelPredictionHistory, ModelAccuracyHistory, TradingRecommendation, UserMarketStream


class MarketSerializer(serializers.ModelSerializer):
    """
    Serializer for Market model
    """
    class Meta:
        model = Market
        fields = '__all__'


class MarketListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for Market model when used in lists
    """
    class Meta:
        model = Market
        fields = ['epic', 'name', 'instrument_type', 'bid', 'offer', 'percentage_change']


class WatchListSerializer(serializers.ModelSerializer):
    """
    Serializer for WatchList model
    """
    markets = MarketListSerializer(many=True, read_only=True)
    market_epics = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = WatchList
        fields = ['id', 'name', 'user', 'markets', 'market_epics', 'is_default', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        market_epics = validated_data.pop('market_epics', [])
        watchlist = WatchList.objects.create(**validated_data)
        
        # Add markets to watchlist
        if market_epics:
            markets = Market.objects.filter(epic__in=market_epics)
            watchlist.markets.add(*markets)
        
        return watchlist
    
    def update(self, instance, validated_data):
        market_epics = validated_data.pop('market_epics', None)
        
        # Update watchlist fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update markets if provided
        if market_epics is not None:
            instance.markets.clear()
            markets = Market.objects.filter(epic__in=market_epics)
            instance.markets.add(*markets)
        
        return instance


class PriceHistorySerializer(serializers.ModelSerializer):
    """
    Serializer for PriceHistory model
    """
    class Meta:
        model = PriceHistory
        fields = '__all__'


class MarketAlertSerializer(serializers.ModelSerializer):
    """
    Serializer for MarketAlert model
    """
    market_name = serializers.SerializerMethodField()
    
    class Meta:
        model = MarketAlert
        fields = ['id', 'user', 'market', 'market_name', 'alert_type', 'threshold_value', 
                 'status', 'created_at', 'updated_at', 'triggered_at', 'expiry_date']
        read_only_fields = ['user', 'status', 'created_at', 'updated_at', 'triggered_at']
    
    def get_market_name(self, obj):
        return obj.market.name if obj.market else None
    
    def create(self, validated_data):
        # Set the user from the request
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class MLModelSerializer(serializers.ModelSerializer):
    """
    Serializer for MLModel model
    """
    class Meta:
        model = MLModel
        fields = '__all__'


class ModelFeatureImportanceSerializer(serializers.ModelSerializer):
    """
    Serializer for ModelFeatureImportance model
    """
    class Meta:
        model = ModelFeatureImportance
        fields = ['id', 'model', 'feature_name', 'importance_value']


class ModelPredictionHistorySerializer(serializers.ModelSerializer):
    """
    Serializer for ModelPredictionHistory model
    """
    class Meta:
        model = ModelPredictionHistory
        fields = ['id', 'model', 'date', 'actual_value', 'predicted_value', 'error']


class ModelAccuracyHistorySerializer(serializers.ModelSerializer):
    """
    Serializer for ModelAccuracyHistory model
    """
    class Meta:
        model = ModelAccuracyHistory
        fields = ['id', 'model', 'date', 'accuracy']


class TradingRecommendationSerializer(serializers.ModelSerializer):
    """
    Serializer for TradingRecommendation model
    """
    class Meta:
        model = TradingRecommendation
        fields = ['id', 'model', 'recommendation', 'confidence', 'reason', 'timeframe', 'created_at']


class MLModelDetailSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for MLModel with related analytics data
    """
    feature_importance = ModelFeatureImportanceSerializer(many=True, read_only=True)
    prediction_history = ModelPredictionHistorySerializer(many=True, read_only=True)
    accuracy_history = ModelAccuracyHistorySerializer(many=True, read_only=True)
    recommendations = TradingRecommendationSerializer(many=True, read_only=True)
    
    class Meta:
        model = MLModel
        fields = '__all__'


class UserMarketStreamSerializer(serializers.ModelSerializer):
    """
    Serializer for UserMarketStream model
    """
    market_name = serializers.SerializerMethodField()
    
    class Meta:
        model = UserMarketStream
        fields = ['id', 'user', 'market', 'market_name', 'is_streaming', 'last_updated']
        read_only_fields = ['user', 'last_updated']
    
    def get_market_name(self, obj):
        return obj.market.name if obj.market else None
    
    def validate(self, data):
        """
        Ensure user can only modify their own streaming preferences
        """
        user = self.context['request'].user
        if 'user' in data and data['user'] != user:
            raise serializers.ValidationError("Cannot modify other user's streaming preferences")
        return data