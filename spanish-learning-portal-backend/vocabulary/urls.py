from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'words', views.WordViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'sessions', views.SessionViewSet)
router.register(r'study-activities', views.StudyActivityViewSet)

# Add a new router for the dashboard
dashboard_router = DefaultRouter()
dashboard_router.register(r'dashboard', views.DashboardViewSet, basename='dashboard')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(dashboard_router.urls)),  # Include dashboard URLs
] 