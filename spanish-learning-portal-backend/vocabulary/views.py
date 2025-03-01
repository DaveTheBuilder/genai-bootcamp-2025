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
from rest_framework.decorators import api_view, permission_classes
import random
import boto3
import os
import json
import logging
from typing import Dict, List, Optional
import uuid

from dotenv import load_dotenv
from .vector import QuestionVectorStore
from .models import GeneratedQuestion

load_dotenv('.env.local')

from rest_framework.response import Response
from rest_framework.decorators import api_view
from .services.retrieval import retrieve_similar_conversations
from rest_framework.permissions import AllowAny

from django.core.files.base import ContentFile
from django.conf import settings

import logging

logger = logging.getLogger(__name__)

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

@api_view(['GET'])
def get_translation_game(request):
    try:
        # Fetch all words from the database
        words = Word.objects.all()

        # Check if there are any words available
        if not words.exists():
            return Response({"detail": "No words available."}, status=status.HTTP_404_NOT_FOUND)

        # Randomly select a word
        selected_word = random.choice(words)

        # Prepare the correct translation
        correct_translation = selected_word.english

        # Generate a list of options
        # Get a few random words to use as distractors
        distractors = Word.objects.exclude(id=selected_word.id).order_by('?')[:3]
        options = [correct_translation] + [distractor.english for distractor in distractors]

        # Shuffle the options
        random.shuffle(options)

        # Prepare the response data
        response_data = {
            "spanish": selected_word.spanish,
            "correct_translation": correct_translation,
            "options": options,
        }

        return Response(response_data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from rest_framework.permissions import AllowAny
from django.http import FileResponse
from io import BytesIO

@api_view(['POST'])
@permission_classes([AllowAny])  # 👈 Allow unauthenticated access

def synthesize_speech(request):
    text = request.data.get('text')
    if not text:
        return Response({"error": "Text is required"}, status=400)

    try:
        polly = boto3.client('polly', region_name="eu-west-1")
        response = polly.synthesize_speech(
            Text=text,
            OutputFormat='mp3',
            VoiceId='Lucia',
            Engine='neural',
            LanguageCode='es-ES'
        )

        audio_stream = response.get("AudioStream")
        if not audio_stream:
            return Response({"error": "Failed to synthesize speech"}, status=500)

        # Read binary MP3 data into memory
        audio_bytes = BytesIO(audio_stream.read())

        # Return as a proper file response
        return FileResponse(audio_bytes, content_type="audio/mpeg")

    except Exception as e:
        import traceback
        print("Error in synthesize_speech:", traceback.format_exc())  # Log error details
        return Response({"error": str(e)}, status=500)



@api_view(['GET'])
def test_aws_auth(request):
    try:
        sts_client = boto3.client('sts')
        # Get caller identity to verify authentication
        identity = sts_client.get_caller_identity()
        print(identity)
        return Response({"message": "AWS authentication successful!", "identity": identity}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def get_words(request):
    words = Word.objects.all()
    serializer = WordSerializer(words, many=True)
    return Response(serializer.data)


from rest_framework.decorators import api_view
from .question_gen import QuestionGenerator
from django.http import JsonResponse

@api_view(['POST'])
@permission_classes([AllowAny])
def generate_question(request):
    data = json.loads(request.body)
    practice_type = data.get("practiceType")
    topic = data.get("topic")
    level = data.get("level")
    prompt = data.get("prompt")
    print(f"Received practice_type: {practice_type}, topic: {topic}, level: {level}")

    # Create an instance of QuestionGenerator
    question_generator = QuestionGenerator()
    bedrock_response = question_generator._invoke_bedrock(practice_type, topic, level, prompt)

    if bedrock_response:
        return JsonResponse(bedrock_response)
    else:
        return JsonResponse({"error": "Failed to generate question"}, status=500)
    

@api_view(['POST'])
@permission_classes([AllowAny])
def generate_similar_question(request):
    data = json.loads(request.body)
    practice_type = data.get("practiceType")
    topic = data.get("topic")
    level = data.get("level")
    prompt = data.get("prompt")
    question_generator = QuestionGenerator()
    similar_question = question_generator.generate_similar_question(practice_type, topic, level, prompt)

    if similar_question:
        return JsonResponse(similar_question)
    else:
        return JsonResponse({"error": "Failed to generate similar question"}, status=400)
    
@api_view(['POST'])
@permission_classes([AllowAny])
def WritingPractice(request):



    if similar_question:
        return JsonResponse(similar_question)
    else:
        return JsonResponse({"error": "Failed to generate similar question"}, status=450)