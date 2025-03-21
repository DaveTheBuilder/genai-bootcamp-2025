from rest_framework import serializers
from .models import Portfolio, PortfolioItem, PortfolioTransaction, PortfolioPerformance
from market_data.serializers import MarketListSerializer


class PortfolioItemSerializer(serializers.ModelSerializer):
    """
    Serializer for PortfolioItem model
    """
    market_data = MarketListSerializer(source='market', read_only=True)
    current_value = serializers.DecimalField(max_digits=15, decimal_places=2, read_only=True)
    profit_loss = serializers.DecimalField(max_digits=15, decimal_places=2, read_only=True)
    profit_loss_percentage = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = PortfolioItem
        fields = ['id', 'portfolio', 'market', 'market_data', 'quantity', 'average_price', 
                 'current_value', 'profit_loss', 'profit_loss_percentage', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class PortfolioSerializer(serializers.ModelSerializer):
    """
    Serializer for Portfolio model
    """
    items = PortfolioItemSerializer(many=True, read_only=True)
    total_value = serializers.SerializerMethodField()
    total_profit_loss = serializers.SerializerMethodField()
    total_profit_loss_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = Portfolio
        fields = ['id', 'name', 'user', 'is_default', 'items', 'total_value', 
                 'total_profit_loss', 'total_profit_loss_percentage', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def get_total_value(self, obj):
        """
        Calculate the total value of the portfolio
        """
        return sum(item.current_value for item in obj.items.all())
    
    def get_total_profit_loss(self, obj):
        """
        Calculate the total profit/loss of the portfolio
        """
        return sum(item.profit_loss for item in obj.items.all())
    
    def get_total_profit_loss_percentage(self, obj):
        """
        Calculate the total profit/loss percentage of the portfolio
        """
        total_cost = sum(item.quantity * item.average_price for item in obj.items.all())
        if total_cost == 0:
            return 0
        return (self.get_total_profit_loss(obj) / total_cost) * 100


class PortfolioTransactionSerializer(serializers.ModelSerializer):
    """
    Serializer for PortfolioTransaction model
    """
    market_name = serializers.ReadOnlyField(source='market.name')
    
    class Meta:
        model = PortfolioTransaction
        fields = ['id', 'portfolio', 'market', 'market_name', 'transaction_type', 
                 'quantity', 'price', 'total_amount', 'currency', 'transaction_date', 
                 'notes', 'created_at']
        read_only_fields = ['created_at']
    
    def create(self, validated_data):
        # Calculate total amount if not provided
        if 'total_amount' not in validated_data:
            validated_data['total_amount'] = validated_data['quantity'] * validated_data['price']
        
        return super().create(validated_data)


class PortfolioPerformanceSerializer(serializers.ModelSerializer):
    """
    Serializer for PortfolioPerformance model
    """
    class Meta:
        model = PortfolioPerformance
        fields = ['id', 'portfolio', 'date', 'total_value', 'daily_change', 'daily_change_percentage']
        read_only_fields = ['id']


class PortfolioSummarySerializer(serializers.ModelSerializer):
    """
    Simplified serializer for Portfolio model
    """
    total_value = serializers.SerializerMethodField()
    total_profit_loss = serializers.SerializerMethodField()
    item_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Portfolio
        fields = ['id', 'name', 'is_default', 'total_value', 'total_profit_loss', 'item_count', 'created_at']
        read_only_fields = ['created_at']
    
    def get_total_value(self, obj):
        """
        Calculate the total value of the portfolio
        """
        return sum(item.current_value for item in obj.items.all())
    
    def get_total_profit_loss(self, obj):
        """
        Calculate the total profit/loss of the portfolio
        """
        return sum(item.profit_loss for item in obj.items.all())
    
    def get_item_count(self, obj):
        """
        Get the number of items in the portfolio
        """
        return obj.items.count()
