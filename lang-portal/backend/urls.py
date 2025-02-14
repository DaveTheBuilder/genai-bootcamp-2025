from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WordViewSet, GroupViewSet, StudySessionViewSet

router = DefaultRouter()
router.register(r'words', WordViewSet, basename='word')
router.register(r'groups', GroupViewSet)
router.register(r'study_sessions', StudySessionViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 