from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PortfolioViewSet,
    PortfolioItemViewSet,
    PortfolioTransactionViewSet,
    PortfolioPerformanceViewSet
)

router = DefaultRouter()
router.register(r'portfolios', PortfolioViewSet, basename='portfolio')
router.register(r'items', PortfolioItemViewSet, basename='portfolio-item')
router.register(r'transactions', PortfolioTransactionViewSet, basename='portfolio-transaction')
router.register(r'performance', PortfolioPerformanceViewSet, basename='portfolio-performance')

urlpatterns = [
    path('', include(router.urls)),
]
