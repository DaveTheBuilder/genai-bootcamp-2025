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
    path('dashboard/', include(dashboard_router.urls)),  # Include dashboard URLs
    path('synthesize-speech/', views.synthesize_speech, name='synthesize-speech'),
    path('translation-game/', views.get_translation_game, name='translation-game'),
    path('test-aws-auth/', views.test_aws_auth, name='test-aws-auth'),
    path('words/', views.get_words, name='get-words'),
    path('generate_question/', views.generate_question, name='generate_question'),
    path('similar/', views.generate_similar_question, name='generate_similar_question'),
] 

# Allow serving files in development
from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)