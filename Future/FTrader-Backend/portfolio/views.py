from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, F, ExpressionWrapper, DecimalField
from django.utils import timezone
import datetime
import logging

from .models import Portfolio, PortfolioItem, PortfolioTransaction, PortfolioPerformance
from .serializers import (
    PortfolioSerializer,
    PortfolioItemSerializer,
    PortfolioTransactionSerializer,
    PortfolioPerformanceSerializer,
    PortfolioSummarySerializer
)
from users.permissions import IsOwnerOrAdmin

logger = logging.getLogger(__name__)


class PortfolioViewSet(viewsets.ModelViewSet):
    """
    API endpoint for portfolios
    """
    serializer_class = PortfolioSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    
    def get_queryset(self):
        return Portfolio.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # Check if this is the first portfolio for the user
        is_first = not Portfolio.objects.filter(user=self.request.user).exists()
        
        # If it's the first portfolio, set is_default to True
        if is_first:
            serializer.save(user=self.request.user, is_default=True)
        else:
            serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """
        Get a summary of all portfolios
        """
        portfolios = self.get_queryset()
        serializer = PortfolioSummarySerializer(portfolios, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def default(self, request):
        """
        Get the default portfolio
        """
        try:
            portfolio = Portfolio.objects.get(user=request.user, is_default=True)
            serializer = self.get_serializer(portfolio)
            return Response(serializer.data)
        except Portfolio.DoesNotExist:
            # If no default portfolio exists, create one
            portfolio = Portfolio.objects.create(
                user=request.user,
                name="Default Portfolio",
                is_default=True
            )
            serializer = self.get_serializer(portfolio)
            return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def set_default(self, request, pk=None):
        """
        Set a portfolio as default
        """
        portfolio = self.get_object()
        
        # Remove default flag from all other portfolios
        Portfolio.objects.filter(user=request.user, is_default=True).update(is_default=False)
        
        # Set this portfolio as default
        portfolio.is_default = True
        portfolio.save()
        
        serializer = self.get_serializer(portfolio)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def performance(self, request, pk=None):
        """
        Get portfolio performance history
        """
        portfolio = self.get_object()
        
        # Get the period from query parameters (default to 30 days)
        period = request.query_params.get('period', '30')
        try:
            period = int(period)
        except ValueError:
            period = 30
        
        # Get the start date
        start_date = timezone.now().date() - datetime.timedelta(days=period)
        
        # Get the performance data
        performance_data = PortfolioPerformance.objects.filter(
            portfolio=portfolio,
            date__gte=start_date
        ).order_by('date')
        
        serializer = PortfolioPerformanceSerializer(performance_data, many=True)
        return Response(serializer.data)


class PortfolioItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint for portfolio items
    """
    serializer_class = PortfolioItemSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['market__name', 'quantity', 'average_price', 'created_at']
    ordering = ['market__name']
    
    def get_queryset(self):
        # Filter by portfolio if provided
        portfolio_id = self.request.query_params.get('portfolio')
        if portfolio_id:
            return PortfolioItem.objects.filter(
                portfolio__user=self.request.user,
                portfolio_id=portfolio_id
            )
        
        return PortfolioItem.objects.filter(portfolio__user=self.request.user)
    
    def perform_create(self, serializer):
        # Check if the portfolio belongs to the user
        portfolio = serializer.validated_data['portfolio']
        if portfolio.user != self.request.user:
            raise permissions.PermissionDenied("You don't have permission to add items to this portfolio.")
        
        serializer.save()


class PortfolioTransactionViewSet(viewsets.ModelViewSet):
    """
    API endpoint for portfolio transactions
    """
    serializer_class = PortfolioTransactionSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['transaction_date', 'transaction_type', 'market__name', 'quantity', 'price']
    ordering = ['-transaction_date']
    
    def get_queryset(self):
        # Filter by portfolio if provided
        portfolio_id = self.request.query_params.get('portfolio')
        if portfolio_id:
            return PortfolioTransaction.objects.filter(
                portfolio__user=self.request.user,
                portfolio_id=portfolio_id
            )
        
        # Filter by market if provided
        market_id = self.request.query_params.get('market')
        if market_id:
            return PortfolioTransaction.objects.filter(
                portfolio__user=self.request.user,
                market_id=market_id
            )
        
        return PortfolioTransaction.objects.filter(portfolio__user=self.request.user)
    
    def perform_create(self, serializer):
        # Check if the portfolio belongs to the user
        portfolio = serializer.validated_data['portfolio']
        if portfolio.user != self.request.user:
            raise permissions.PermissionDenied("You don't have permission to add transactions to this portfolio.")
        
        serializer.save()
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """
        Get a summary of transactions by type
        """
        # Filter by portfolio if provided
        portfolio_id = request.query_params.get('portfolio')
        if portfolio_id:
            transactions = PortfolioTransaction.objects.filter(
                portfolio__user=request.user,
                portfolio_id=portfolio_id
            )
        else:
            transactions = PortfolioTransaction.objects.filter(portfolio__user=request.user)
        
        # Group by transaction type and sum the total amount
        summary = transactions.values('transaction_type').annotate(
            total=Sum('total_amount'),
            count=Sum(1)
        ).order_by('transaction_type')
        
        return Response(summary)


class PortfolioPerformanceViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for portfolio performance (read-only)
    """
    serializer_class = PortfolioPerformanceSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['date', 'total_value']
    ordering = ['date']
    
    def get_queryset(self):
        # Filter by portfolio if provided
        portfolio_id = self.request.query_params.get('portfolio')
        if portfolio_id:
            return PortfolioPerformance.objects.filter(
                portfolio__user=self.request.user,
                portfolio_id=portfolio_id
            )
        
        return PortfolioPerformance.objects.filter(portfolio__user=self.request.user)
