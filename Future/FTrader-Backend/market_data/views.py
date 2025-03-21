from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
import requests
import logging
from django.conf import settings
from django.utils import timezone
from datetime import timedelta

from .models import Market, WatchList, PriceHistory, MarketAlert, UserMarketStream
from .serializers import (
    MarketSerializer, 
    MarketListSerializer,
    WatchListSerializer, 
    PriceHistorySerializer, 
    MarketAlertSerializer,
    UserMarketStreamSerializer
)
from users.permissions import IsOwnerOrAdmin

logger = logging.getLogger(__name__)


class MarketViewSet(viewsets.ModelViewSet):
    """
    API endpoint for markets
    """
    queryset = Market.objects.all()
    serializer_class = MarketSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'epic', 'instrument_type']
    ordering_fields = ['name', 'percentage_change', 'bid', 'offer']
    ordering = ['name']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return MarketListSerializer
        return MarketSerializer
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """
        Search for markets in IG API
        """
        query = request.query_params.get('q', '')
        if not query or len(query) < 2:
            return Response(
                {'error': 'Search query must be at least 2 characters'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Get optional market type filter
        market_type = request.query_params.get('type', None)
        
        # Get results from IG API
        from .utils import search_markets
        success, markets, error_message = search_markets(
            user=request.user,
            search_term=query,
            market_type=market_type
        )
        
        if not success:
            return Response(
                {'error': error_message},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        
        return Response(markets)
    
    @action(detail=False, methods=['get'])
    def check_ig_api(self, request):
        """
        Check if the IG API is working properly
        """
        # Import the necessary utility functions
        from .utils import get_ig_api_url, get_ig_api_headers
        
        try:
            # Get the API URL and headers
            api_url = get_ig_api_url(request.user)
            headers = get_ig_api_headers(request.user)
            
            # Make a simple request to the IG API
            response = requests.get(
                f"{api_url}/gateway/deal/session",
                headers=headers
            )
            
            # Check if the response is successful
            if response.status_code == 200:
                return Response({
                    'status': 'success',
                    'message': 'IG API connection is working properly',
                    'details': {
                        'api_url': api_url,
                        'status_code': response.status_code
                    }
                })
            else:
                # If the response is not successful, return the error details
                error_data = response.json() if response.content else {"errorCode": "NO_RESPONSE"}
                return Response({
                    'status': 'error',
                    'message': 'IG API connection failed',
                    'details': {
                        'api_url': api_url,
                        'status_code': response.status_code,
                        'error_code': error_data.get('errorCode', 'Unknown error')
                    }
                }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
                
        except Exception as e:
            # If an exception occurs, return the error details
            logger.exception("Error checking IG API connection")
            return Response({
                'status': 'error',
                'message': 'Error checking IG API connection',
                'details': {
                    'exception': str(e)
                }
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['get'])
    def price_history(self, request, pk=None):
        """
        Get historical price data for a market
        """
        market = self.get_object()
        
        # Get query parameters
        resolution = request.query_params.get('resolution', 'DAY')
        num_points = int(request.query_params.get('num_points', 30))
        from_date = request.query_params.get('from_date', None)
        to_date = request.query_params.get('to_date', None)
        
        # Validate resolution
        valid_resolutions = ['MINUTE', 'MINUTE_5', 'MINUTE_15', 'MINUTE_30', 'HOUR', 'HOUR_4', 'DAY', 'WEEK', 'MONTH']
        if resolution not in valid_resolutions:
            return Response(
                {'error': f'Invalid resolution. Must be one of {valid_resolutions}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = request.user
        if not user.ig_active_session:
            return Response(
                {'error': 'No active IG session. Please log in to IG API first.'},
                status=status.HTTP_400_BAD_REQUEST
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
            'Version': '3'
        }
        
        # Prepare query parameters
        params = {
            'resolution': resolution,
            'max': num_points
        }
        
        if from_date:
            params['from'] = from_date
        if to_date:
            params['to'] = to_date
        
        try:
            # Make the price history request to IG API
            response = requests.get(
                f"{base_url}/prices/{market.epic}",
                headers=headers,
                params=params
            )
            
            if response.status_code == 200:
                prices_data = response.json().get('prices', [])
                
                # Process and store price history data
                price_history_objects = []
                for price_data in prices_data:
                    timestamp = price_data.get('snapshotTimeUTC')
                    open_price = price_data.get('openPrice', {}).get('bid')
                    close_price = price_data.get('closePrice', {}).get('bid')
                    high_price = price_data.get('highPrice', {}).get('bid')
                    low_price = price_data.get('lowPrice', {}).get('bid')
                    
                    if all([timestamp, open_price, close_price, high_price, low_price]):
                        price_history, created = PriceHistory.objects.update_or_create(
                            market=market,
                            timestamp=timestamp,
                            defaults={
                                'open_price': open_price,
                                'close_price': close_price,
                                'high_price': high_price,
                                'low_price': low_price,
                                'volume': price_data.get('lastTradedVolume')
                            }
                        )
                        price_history_objects.append(price_history)
                
                # Return the processed price history data
                serializer = PriceHistorySerializer(price_history_objects, many=True)
                return Response(serializer.data)
            else:
                error_message = response.json().get('errorCode', 'Unknown error')
                logger.error(f"IG API price history failed: {error_message}")
                return Response(
                    {'error': f'IG API price history failed: {error_message}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        except Exception as e:
            logger.exception("Error connecting to IG API for price history")
            return Response(
                {'error': f'Error connecting to IG API: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class WatchListViewSet(viewsets.ModelViewSet):
    """
    API endpoint for watchlists
    """
    serializer_class = WatchListSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    
    def get_queryset(self):
        return WatchList.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def add_market(self, request, pk=None):
        watchlist = self.get_object()
        epic = request.data.get('epic')
        
        if not epic:
            return Response(
                {'error': 'Market epic is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            market = Market.objects.get(epic=epic)
            watchlist.markets.add(market)
            return Response({'status': 'Market added to watchlist'})
        except Market.DoesNotExist:
            return Response(
                {'error': 'Market not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'])
    def remove_market(self, request, pk=None):
        watchlist = self.get_object()
        epic = request.data.get('epic')
        
        if not epic:
            return Response(
                {'error': 'Market epic is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            market = Market.objects.get(epic=epic)
            watchlist.markets.remove(market)
            return Response({'status': 'Market removed from watchlist'})
        except Market.DoesNotExist:
            return Response(
                {'error': 'Market not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'])
    def default(self, request):
        """
        Get or create the default watchlist for the user
        """
        user = request.user
        default_watchlist, created = WatchList.objects.get_or_create(
            user=user,
            is_default=True,
            defaults={'name': 'Default Watchlist'}
        )
        
        serializer = self.get_serializer(default_watchlist)
        return Response(serializer.data)


class MarketAlertViewSet(viewsets.ModelViewSet):
    """
    API endpoint for market alerts
    """
    serializer_class = MarketAlertSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    
    def get_queryset(self):
        return MarketAlert.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """
        Get all active alerts for the user
        """
        active_alerts = MarketAlert.objects.filter(
            user=request.user,
            status='active'
        )
        serializer = self.get_serializer(active_alerts, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """
        Cancel an alert
        """
        alert = self.get_object()
        alert.status = 'cancelled'
        alert.save()
        
        serializer = self.get_serializer(alert)
        return Response(serializer.data)


class UserMarketStreamViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing user market streaming preferences
    """
    serializer_class = UserMarketStreamSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    
    def get_queryset(self):
        return UserMarketStream.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """
        Automatically set the user to the current user
        """
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def toggle_streaming(self, request):
        """
        Toggle streaming for a market
        """
        market_id = request.data.get('market_id')
        if not market_id:
            return Response({'error': 'market_id is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        market = get_object_or_404(Market, pk=market_id)
        
        # Get or create the streaming preference
        stream, created = UserMarketStream.objects.get_or_create(
            user=request.user,
            market=market,
            defaults={'is_streaming': True}
        )
        
        # Toggle the streaming status
        stream.is_streaming = not stream.is_streaming
        stream.save()
        
        return Response(UserMarketStreamSerializer(stream).data)
    
    @action(detail=False, methods=['get'])
    def get_streaming_markets(self, request):
        """
        Get all markets that are currently streaming for the user
        """
        streaming_markets = self.get_queryset().filter(is_streaming=True)
        serializer = self.get_serializer(streaming_markets, many=True)
        return Response(serializer.data)


from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .tasks import fetch_live_market_data, run_live_predictions
from .ml_utils import make_live_prediction
from .models import MLModel, TradingRecommendation

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_live_market_data(request, market_id=None):
    """
    Get live market data for a specific market or all markets
    """
    try:
        # Trigger the task to fetch live data
        task = fetch_live_market_data.delay(market_id)
        
        # Wait for a short time to get the result
        try:
            result = task.get(timeout=10)
        except:
            # If timeout, just return that the task is running
            result = "Task is running in the background"
        
        # Get the latest data
        if market_id:
            markets = Market.objects.filter(id=market_id)
        else:
            markets = Market.objects.all()
            
        market_data = []
        for market in markets:
            # Get the latest price
            latest_price = PriceHistory.objects.filter(market=market).order_by('-timestamp').first()
            
            if latest_price:
                market_data.append({
                    'id': market.id,
                    'name': market.name,
                    'epic': market.epic,
                    'bid': float(market.bid) if market.bid else None,
                    'offer': float(market.offer) if market.offer else None,
                    'last_update': market.last_update.isoformat() if market.last_update else None,
                    'latest_price': {
                        'timestamp': latest_price.timestamp.isoformat(),
                        'open': float(latest_price.open_price),
                        'high': float(latest_price.high_price),
                        'low': float(latest_price.low_price),
                        'close': float(latest_price.close_price),
                        'volume': float(latest_price.volume)
                    }
                })
        
        return Response({
            'status': 'success',
            'task_result': result,
            'market_data': market_data,
            'timestamp': timezone.now().isoformat()
        })
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_live_predictions(request, model_id=None):
    """
    Get live predictions for a specific model or all trained models
    """
    try:
        # If model_id is provided, run prediction for that model only
        if model_id:
            prediction = make_live_prediction(model_id)
            return Response(prediction)
        
        # Otherwise, trigger the task to run predictions for all models
        task = run_live_predictions.delay()
        
        # Wait for a short time to get the result
        try:
            task.get(timeout=5)
        except:
            # If timeout, just continue
            pass
        
        # Get the latest predictions
        predictions = []
        models = MLModel.objects.filter(status='trained')
        
        for model in models:
            # Get the latest recommendation
            recommendation = TradingRecommendation.objects.filter(model=model).order_by('-created_at').first()
            
            if recommendation:
                predictions.append({
                    'model_id': model.id,
                    'model_type': model.model_type,
                    'instrument': model.instrument,
                    'target': model.target,
                    'accuracy': float(model.accuracy) if model.accuracy else None,
                    'recommendation': recommendation.recommendation,
                    'confidence': float(recommendation.confidence),
                    'reason': recommendation.reason,
                    'timeframe': recommendation.timeframe,
                    'created_at': recommendation.created_at.isoformat()
                })
        
        return Response({
            'status': 'success',
            'predictions': predictions,
            'timestamp': timezone.now().isoformat()
        })
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def run_model_prediction(request, model_id):
    """
    Run a prediction for a specific model with the latest data
    """
    try:
        # Check if model exists and is trained
        try:
            model = MLModel.objects.get(id=model_id)
            if model.status != 'trained':
                return Response({
                    'status': 'error',
                    'message': f'Model {model_id} is not trained yet'
                }, status=status.HTTP_400_BAD_REQUEST)
        except MLModel.DoesNotExist:
            return Response({
                'status': 'error',
                'message': f'Model {model_id} not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Run prediction
        prediction = make_live_prediction(model_id)
        
        return Response(prediction)
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
