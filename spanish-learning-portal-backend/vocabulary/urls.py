from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    WordViewSet, GroupViewSet, SessionViewSet, StudyActivityViewSet,
    DashboardViewSet, synthesize_speech, process_youtube_video,
    search_similar_content, get_translation_game, test_aws_auth, get_words,
    generate_question, generate_similar_question, WritingPractice
)

router = DefaultRouter()
router.register(r'words', WordViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'sessions', SessionViewSet)
router.register(r'study-activities', StudyActivityViewSet)

dashboard_router = DefaultRouter()
dashboard_router.register(r'', DashboardViewSet, basename='dashboard')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', include(dashboard_router.urls)),  # Include dashboard URLs
    path('synthesize-speech/', synthesize_speech, name='synthesize-speech'),
    path('process-youtube-video/', process_youtube_video),
    path('search-similar-content/', search_similar_content),
    path('translation-game/', get_translation_game, name='translation-game'),
    path('test-aws-auth/', test_aws_auth, name='test-aws-auth'),
    path('words/', get_words, name='get-words'),
    path('generate_question/', generate_question, name='generate_question'),
    path('similar/', generate_similar_question, name='generate_similar_question'),
    path('WritingPractice/', WritingPractice, name='WritingPractice'),
]

# Allow serving files in development
from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)