from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from .models import Word, Group, Session
from .serializers import WordSerializer, GroupSerializer, SessionSerializer
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