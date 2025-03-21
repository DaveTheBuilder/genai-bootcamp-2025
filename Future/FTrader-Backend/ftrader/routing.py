from django.urls import path
from market_data.consumers import MarketDataConsumer
from trading.consumers import TradingConsumer
from notifications.consumers import NotificationConsumer

websocket_urlpatterns = [
    path('ws/market-data/', MarketDataConsumer.as_asgi()),
    path('ws/trading/', TradingConsumer.as_asgi()),
    path('ws/notifications/', NotificationConsumer.as_asgi()),
]
