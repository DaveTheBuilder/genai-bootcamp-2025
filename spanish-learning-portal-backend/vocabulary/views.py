from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from .models import Word, Group, Session, StudyActivity
from .serializers import (
    WordSerializer, GroupSerializer, SessionSerializer,
    StudyActivitySerializer, DashboardLastStudySessionSerializer,
    DashboardStudyProgressSerializer, DashboardQuickStatsSerializer
)
from django.utils import timezone

class WordViewSet(viewsets.ModelViewSet):
    queryset = Word.objects.all()
    serializer_class = WordSerializer

    def get_queryset(self):
        queryset = Word.objects.all()
        sort_by = self.request.query_params.get('sort_by', 'spanish')
        order = self.request.query_params.get('order', 'asc')
        
        if order == 'desc':
            sort_by = f'-{sort_by}'
            
        return queryset.order_by(sort_by)

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

    @action(detail=True, methods=['post'])
    def add_words(self, request, pk=None):
        group = self.get_object()
        word_ids = request.data.get('word_ids', [])
        words = Word.objects.filter(id__in=word_ids)
        group.words.add(*words)
        return Response({'status': 'words added'})

class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer

    @action(detail=True, methods=['post'])
    def end_session(self, request, pk=None):
        session = self.get_object()
        session.end_time = timezone.now()
        session.save()
        return Response({'status': 'session ended'})

class StudyActivityViewSet(viewsets.ModelViewSet):
    queryset = StudyActivity.objects.all()
    serializer_class = StudyActivitySerializer 

class DashboardViewSet(viewsets.ViewSet):
    def last_study_session(self, request):
        last_session = Session.objects.order_by('-created_at').first()
        if last_session:
            serializer = DashboardLastStudySessionSerializer(last_session)
            return Response(serializer.data)
        return Response({"detail": "No study sessions found."}, status=status.HTTP_404_NOT_FOUND)

    def study_progress(self, request):
        total_studied = Word.objects.filter(groups__isnull=False).count()
        total_available = Word.objects.count()
        data = {
            "total_words_studied": total_studied,
            "total_available_words": total_available,
        }
        serializer = DashboardStudyProgressSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)

    def quick_stats(self, request):
        total_sessions = Session.objects.count()
        total_groups = Group.objects.count()
        # Assuming a simple calculation for success rate and streak days
        success_rate = 80.0  # Placeholder value
        study_streak_days = 4  # Placeholder value

        data = {
            "success_rate": success_rate,
            "total_study_sessions": total_sessions,
            "total_active_groups": total_groups,
            "study_streak_days": study_streak_days,
        }
        serializer = DashboardQuickStatsSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data) 