from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
import requests
import json
import logging
from django.conf import settings
from django.utils import timezone
from datetime import timedelta

from .models import Position, Order, Transaction
from .serializers import (
    PositionSerializer,
    OrderSerializer,
    TransactionSerializer,
    CreatePositionSerializer,
    ClosePositionSerializer,
    CreateOrderSerializer,
    CancelOrderSerializer
)
from market_data.models import Market
from users.permissions import IsOwnerOrAdmin

logger = logging.getLogger(__name__)


class PositionViewSet(viewsets.ModelViewSet):
    """
    API endpoint for positions
    """
    serializer_class = PositionSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at', 'market__name', 'profit_loss']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Position.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def create_position(self, request):
        """
        Create a new position
        """
        serializer = CreatePositionSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            
            if not user.ig_active_session:
                return Response(
                    {'error': 'No active IG session. Please log in to IG API first.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get validated data
            epic = serializer.validated_data['epic']
            direction = serializer.validated_data['direction']
            size = serializer.validated_data['size']
            limit_level = serializer.validated_data.get('limit_level')
            stop_level = serializer.validated_data.get('stop_level')
            guaranteed_stop = serializer.validated_data.get('guaranteed_stop', False)
            trailing_stop = serializer.validated_data.get('trailing_stop', False)
            
            # Get market
            try:
                market = Market.objects.get(epic=epic)
            except Market.DoesNotExist:
                return Response(
                    {'error': f'Market with epic {epic} not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Determine the IG API URL based on user's demo flag
            base_url = 'https://demo-api.ig.com/gateway/deal' if user.use_demo_account else 'https://api.ig.com/gateway/deal'
            
            # Prepare headers for IG API
            headers = {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8',
                'X-IG-API-KEY': user.ig_api_key,
                'CST': user.ig_cst,
                'X-SECURITY-TOKEN': user.ig_security_token,
                'Version': '2'
            }
            
            # Prepare data for IG API
            data = {
                'epic': epic,
                'direction': direction,
                'size': str(size),
                'orderType': 'MARKET',
                'timeInForce': 'FILL_OR_KILL',
                'guaranteedStop': guaranteed_stop,
                'trailingStop': trailing_stop,
            }
            
            if limit_level is not None:
                data['limitLevel'] = str(limit_level)
            
            if stop_level is not None:
                data['stopLevel'] = str(stop_level)
            
            try:
                # Make the position creation request to IG API
                response = requests.post(
                    f"{base_url}/positions/otc",
                    headers=headers,
                    data=json.dumps(data)
                )
                
                if response.status_code == 200:
                    position_data = response.json()
                    deal_reference = position_data.get('dealReference')
                    
                    # Create a position object
                    position = Position.objects.create(
                        user=user,
                        market=market,
                        deal_reference=deal_reference,
                        direction=direction,
                        size=size,
                        open_level=market.bid if direction == 'BUY' else market.offer,
                        limit_level=limit_level,
                        stop_level=stop_level,
                        status='PENDING'
                    )
                    
                    # Create a transaction record
                    Transaction.objects.create(
                        user=user,
                        transaction_type='OPEN_POSITION',
                        position=position,
                        market=market,
                        amount=size * position.open_level,
                        currency='USD',
                        reference=deal_reference,
                        description=f"Open {direction} position for {market.name}"
                    )
                    
                    # Return the position data
                    position_serializer = PositionSerializer(position)
                    return Response(position_serializer.data)
                else:
                    error_message = response.json().get('errorCode', 'Unknown error')
                    logger.error(f"IG API position creation failed: {error_message}")
                    return Response(
                        {'error': f'IG API position creation failed: {error_message}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            except Exception as e:
                logger.exception("Error connecting to IG API for position creation")
                return Response(
                    {'error': f'Error connecting to IG API: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def close_position(self, request, pk=None):
        """
        Close a position
        """
        position = self.get_object()
        
        if position.status != 'OPEN':
            return Response(
                {'error': f'Position is not open, current status: {position.status}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = ClosePositionSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            
            if not user.ig_active_session:
                return Response(
                    {'error': 'No active IG session. Please log in to IG API first.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get validated data
            deal_id = serializer.validated_data['deal_id']
            size = serializer.validated_data.get('size', position.size)
            
            # Determine the IG API URL based on user's demo flag
            base_url = 'https://demo-api.ig.com/gateway/deal' if user.use_demo_account else 'https://api.ig.com/gateway/deal'
            
            # Prepare headers for IG API
            headers = {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8',
                'X-IG-API-KEY': user.ig_api_key,
                'CST': user.ig_cst,
                'X-SECURITY-TOKEN': user.ig_security_token,
                'Version': '1'
            }
            
            # Prepare data for IG API
            data = {
                'dealId': deal_id,
                'direction': 'SELL' if position.direction == 'BUY' else 'BUY',
                'size': str(size),
                'orderType': 'MARKET'
            }
            
            try:
                # Make the position closure request to IG API
                response = requests.post(
                    f"{base_url}/positions/otc",
                    headers=headers,
                    data=json.dumps(data)
                )
                
                if response.status_code == 200:
                    close_data = response.json()
                    deal_reference = close_data.get('dealReference')
                    
                    # Update the position
                    position.status = 'CLOSED'
                    position.closed_at = timezone.now()
                    position.close_level = position.market.offer if position.direction == 'BUY' else position.market.bid
                    
                    # Calculate profit/loss
                    if position.direction == 'BUY':
                        position.profit_loss = (position.close_level - position.open_level) * position.size
                    else:
                        position.profit_loss = (position.open_level - position.close_level) * position.size
                    
                    position.save()
                    
                    # Create a transaction record
                    Transaction.objects.create(
                        user=user,
                        transaction_type='CLOSE_POSITION',
                        position=position,
                        market=position.market,
                        amount=position.profit_loss,
                        currency='USD',
                        reference=deal_reference,
                        description=f"Close {position.direction} position for {position.market.name}"
                    )
                    
                    # Return the position data
                    position_serializer = PositionSerializer(position)
                    return Response(position_serializer.data)
                else:
                    error_message = response.json().get('errorCode', 'Unknown error')
                    logger.error(f"IG API position closure failed: {error_message}")
                    return Response(
                        {'error': f'IG API position closure failed: {error_message}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            except Exception as e:
                logger.exception("Error connecting to IG API for position closure")
                return Response(
                    {'error': f'Error connecting to IG API: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def open(self, request):
        """
        Get all open positions
        """
        open_positions = Position.objects.filter(
            user=request.user,
            status='OPEN'
        )
        serializer = self.get_serializer(open_positions, many=True)
        return Response(serializer.data)


class OrderViewSet(viewsets.ModelViewSet):
    """
    API endpoint for orders
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at', 'market__name']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def create_order(self, request):
        """
        Create a new order
        """
        serializer = CreateOrderSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            
            if not user.ig_active_session:
                return Response(
                    {'error': 'No active IG session. Please log in to IG API first.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get validated data
            epic = serializer.validated_data['epic']
            order_type = serializer.validated_data['order_type']
            direction = serializer.validated_data['direction']
            size = serializer.validated_data['size']
            level = serializer.validated_data['level']
            limit_distance = serializer.validated_data.get('limit_distance')
            stop_distance = serializer.validated_data.get('stop_distance')
            good_till_date = serializer.validated_data.get('good_till_date')
            guaranteed_stop = serializer.validated_data.get('guaranteed_stop', False)
            trailing_stop = serializer.validated_data.get('trailing_stop', False)
            
            # Get market
            try:
                market = Market.objects.get(epic=epic)
            except Market.DoesNotExist:
                return Response(
                    {'error': f'Market with epic {epic} not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Determine the IG API URL based on user's demo flag
            base_url = 'https://demo-api.ig.com/gateway/deal' if user.use_demo_account else 'https://api.ig.com/gateway/deal'
            
            # Prepare headers for IG API
            headers = {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8',
                'X-IG-API-KEY': user.ig_api_key,
                'CST': user.ig_cst,
                'X-SECURITY-TOKEN': user.ig_security_token,
                'Version': '2'
            }
            
            # Prepare data for IG API
            data = {
                'epic': epic,
                'direction': direction,
                'size': str(size),
                'level': str(level),
                'type': order_type,
                'timeInForce': 'GOOD_TILL_CANCELLED',
                'guaranteedStop': guaranteed_stop,
                'trailingStop': trailing_stop,
            }
            
            if limit_distance is not None:
                data['limitDistance'] = str(limit_distance)
            
            if stop_distance is not None:
                data['stopDistance'] = str(stop_distance)
            
            if good_till_date is not None:
                data['goodTillDate'] = good_till_date.isoformat()
                data['timeInForce'] = 'GOOD_TILL_DATE'
            
            try:
                # Make the order creation request to IG API
                response = requests.post(
                    f"{base_url}/workingorders/otc",
                    headers=headers,
                    data=json.dumps(data)
                )
                
                if response.status_code == 200:
                    order_data = response.json()
                    deal_reference = order_data.get('dealReference')
                    
                    # Create an order object
                    order = Order.objects.create(
                        user=user,
                        market=market,
                        deal_reference=deal_reference,
                        order_type=order_type,
                        direction=direction,
                        size=size,
                        level=level,
                        limit_distance=limit_distance,
                        stop_distance=stop_distance,
                        status='PENDING',
                        good_till_date=good_till_date
                    )
                    
                    # Create a transaction record
                    Transaction.objects.create(
                        user=user,
                        transaction_type='CREATE_ORDER',
                        order=order,
                        market=market,
                        amount=0,  # No immediate financial impact
                        currency='USD',
                        reference=deal_reference,
                        description=f"Create {order_type} {direction} order for {market.name}"
                    )
                    
                    # Return the order data
                    order_serializer = OrderSerializer(order)
                    return Response(order_serializer.data)
                else:
                    error_message = response.json().get('errorCode', 'Unknown error')
                    logger.error(f"IG API order creation failed: {error_message}")
                    return Response(
                        {'error': f'IG API order creation failed: {error_message}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            except Exception as e:
                logger.exception("Error connecting to IG API for order creation")
                return Response(
                    {'error': f'Error connecting to IG API: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def cancel_order(self, request, pk=None):
        """
        Cancel an order
        """
        order = self.get_object()
        
        if order.status not in ['PENDING']:
            return Response(
                {'error': f'Order cannot be cancelled, current status: {order.status}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = CancelOrderSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            
            if not user.ig_active_session:
                return Response(
                    {'error': 'No active IG session. Please log in to IG API first.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get validated data
            deal_id = serializer.validated_data['deal_id']
            
            # Determine the IG API URL based on user's demo flag
            base_url = 'https://demo-api.ig.com/gateway/deal' if user.use_demo_account else 'https://api.ig.com/gateway/deal'
            
            # Prepare headers for IG API
            headers = {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8',
                'X-IG-API-KEY': user.ig_api_key,
                'CST': user.ig_cst,
                'X-SECURITY-TOKEN': user.ig_security_token,
                'Version': '1'
            }
            
            try:
                # Make the order cancellation request to IG API
                response = requests.delete(
                    f"{base_url}/workingorders/otc/{deal_id}",
                    headers=headers
                )
                
                if response.status_code in [200, 204]:
                    # Update the order
                    order.status = 'CANCELLED'
                    order.save()
                    
                    # Create a transaction record
                    Transaction.objects.create(
                        user=user,
                        transaction_type='CANCEL_ORDER',
                        order=order,
                        market=order.market,
                        amount=0,  # No financial impact
                        currency='USD',
                        reference=order.deal_reference,
                        description=f"Cancel {order.order_type} {order.direction} order for {order.market.name}"
                    )
                    
                    # Return the order data
                    order_serializer = OrderSerializer(order)
                    return Response(order_serializer.data)
                else:
                    error_message = response.json().get('errorCode', 'Unknown error') if response.content else 'No response content'
                    logger.error(f"IG API order cancellation failed: {error_message}")
                    return Response(
                        {'error': f'IG API order cancellation failed: {error_message}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            except Exception as e:
                logger.exception("Error connecting to IG API for order cancellation")
                return Response(
                    {'error': f'Error connecting to IG API: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """
        Get all pending orders
        """
        pending_orders = Order.objects.filter(
            user=request.user,
            status='PENDING'
        )
        serializer = self.get_serializer(pending_orders, many=True)
        return Response(serializer.data)


class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for transactions (read-only)
    """
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at', 'transaction_type', 'amount']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)
