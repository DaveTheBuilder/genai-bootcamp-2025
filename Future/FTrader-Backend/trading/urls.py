from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PositionViewSet, OrderViewSet, TransactionViewSet
from . import ig_proxy
from . import ig_proxy_test  # Import the test proxy module

router = DefaultRouter()
router.register(r'positions', PositionViewSet, basename='position')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'transactions', TransactionViewSet, basename='transaction')

urlpatterns = [
    path('', include(router.urls)),
    # IG API proxy endpoints
    path('ig/session/', ig_proxy.proxy_login, name='ig-login'),
    path('ig/accounts/', ig_proxy.proxy_accounts, name='ig-accounts'),
    path('ig/markets/<str:epic>/', ig_proxy.proxy_markets, name='ig-markets'),
    path('ig/prices/<str:epic>/', ig_proxy.proxy_prices, name='ig-prices'),
    path('ig/test-connection/', ig_proxy.proxy_streaming_connection_test, name='ig-test-connection'),
    
    # Test endpoints without authentication
    path('test/ig/session/', ig_proxy_test.test_proxy_login, name='test-ig-login'),
    path('test/ig/test-connection/', ig_proxy_test.test_proxy_streaming_connection_test, name='test-ig-test-connection'),
]
