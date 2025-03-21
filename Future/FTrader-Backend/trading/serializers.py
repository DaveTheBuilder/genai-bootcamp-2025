from rest_framework import serializers
from .models import Position, Order, Transaction
from market_data.serializers import MarketListSerializer


class PositionSerializer(serializers.ModelSerializer):
    """
    Serializer for Position model
    """
    market_data = MarketListSerializer(source='market', read_only=True)
    profit_loss_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Position
        fields = '__all__'
        read_only_fields = ['user', 'deal_id', 'deal_reference', 'status', 
                           'created_at', 'updated_at', 'opened_at', 'closed_at', 
                           'profit_loss', 'currency']
    
    def get_profit_loss_display(self, obj):
        if obj.profit_loss is None:
            return None
        return f"{obj.profit_loss} {obj.currency}"


class OrderSerializer(serializers.ModelSerializer):
    """
    Serializer for Order model
    """
    market_data = MarketListSerializer(source='market', read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['user', 'deal_id', 'deal_reference', 'status', 
                           'created_at', 'updated_at', 'executed_at', 'position']


class TransactionSerializer(serializers.ModelSerializer):
    """
    Serializer for Transaction model
    """
    market_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ['user', 'created_at']
    
    def get_market_name(self, obj):
        return obj.market.name if obj.market else None


class CreatePositionSerializer(serializers.Serializer):
    """
    Serializer for creating a position
    """
    epic = serializers.CharField(required=True)
    direction = serializers.ChoiceField(choices=['BUY', 'SELL'], required=True)
    size = serializers.DecimalField(max_digits=15, decimal_places=2, required=True)
    limit_level = serializers.DecimalField(max_digits=15, decimal_places=5, required=False, allow_null=True)
    stop_level = serializers.DecimalField(max_digits=15, decimal_places=5, required=False, allow_null=True)
    guaranteed_stop = serializers.BooleanField(required=False, default=False)
    trailing_stop = serializers.BooleanField(required=False, default=False)


class ClosePositionSerializer(serializers.Serializer):
    """
    Serializer for closing a position
    """
    deal_id = serializers.CharField(required=True)
    size = serializers.DecimalField(max_digits=15, decimal_places=2, required=False)


class CreateOrderSerializer(serializers.Serializer):
    """
    Serializer for creating an order
    """
    epic = serializers.CharField(required=True)
    order_type = serializers.ChoiceField(choices=['LIMIT', 'MARKET', 'STOP'], required=True)
    direction = serializers.ChoiceField(choices=['BUY', 'SELL'], required=True)
    size = serializers.DecimalField(max_digits=15, decimal_places=2, required=True)
    level = serializers.DecimalField(max_digits=15, decimal_places=5, required=True)
    limit_distance = serializers.DecimalField(max_digits=15, decimal_places=5, required=False, allow_null=True)
    stop_distance = serializers.DecimalField(max_digits=15, decimal_places=5, required=False, allow_null=True)
    good_till_date = serializers.DateTimeField(required=False, allow_null=True)
    guaranteed_stop = serializers.BooleanField(required=False, default=False)
    trailing_stop = serializers.BooleanField(required=False, default=False)


class CancelOrderSerializer(serializers.Serializer):
    """
    Serializer for cancelling an order
    """
    deal_id = serializers.CharField(required=True)
