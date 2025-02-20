from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Count
from .models import Word, Group, StudySession, WordReviewItem
from .serializers import (
    WordSerializer, GroupSerializer, GroupDetailSerializer,
    StudySessionSerializer, WordReviewItemSerializer
)

class WordViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = WordSerializer
    
    def get_queryset(self):
        queryset = Word.objects.all()
        sort_by = self.request.query_params.get('sort_by', 'spanish')
        order = self.request.query_params.get('order', 'asc')

        if sort_by in ['spanish', 'english']:
            if order == 'desc':
                sort_by = f'-{sort_by}'
            queryset = queryset.order_by(sort_by)

        return queryset

class GroupViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Group.objects.all()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return GroupDetailSerializer
        return GroupSerializer

class StudySessionViewSet(viewsets.ModelViewSet):
    queryset = StudySession.objects.all()
    serializer_class = StudySessionSerializer

    @action(detail=True, methods=['post'])
    def review(self, request, pk=None):
        session = self.get_object()
        serializer = WordReviewItemSerializer(data={
            **request.data,
            'study_session': session.id
        })
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 