from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import MarketViewSet, WatchListViewSet, MarketAlertViewSet, UserMarketStreamViewSet
from .ml_views import MLModelViewSet, MLTrainViewSet, MLPredictViewSet

# Create a router for the main endpoints
router = DefaultRouter()
router.register(r'markets', MarketViewSet)
router.register(r'watchlists', WatchListViewSet, basename='watchlist')
router.register(r'alerts', MarketAlertViewSet, basename='market-alert')
router.register(r'ml-models', MLModelViewSet, basename='ml-model')
router.register(r'user-market-stream', UserMarketStreamViewSet, basename='user-market-stream')

# Create a separate router for ML-related endpoints
ml_router = DefaultRouter()
ml_router.register(r'train', MLTrainViewSet, basename='ml-train')
ml_router.register(r'predict', MLPredictViewSet, basename='ml-predict')

urlpatterns = [
    path('', include(router.urls)),
    path('ml/', include(ml_router.urls)),
    # Live data and predictions
    path('api/live-data/', views.get_live_market_data, name='live-market-data'),
    path('api/live-data/<int:market_id>/', views.get_live_market_data, name='live-market-data-detail'),
    path('api/live-predictions/', views.get_live_predictions, name='live-predictions'),
    path('api/live-predictions/<int:model_id>/', views.get_live_predictions, name='live-predictions-detail'),
    path('api/run-prediction/<int:model_id>/', views.run_model_prediction, name='run-model-prediction'),
]
