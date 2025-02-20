from rest_framework import serializers
from .models import Word, Group, StudySession, WordReviewItem, StudyActivity

class WordSerializer(serializers.ModelSerializer):
    correct_count = serializers.SerializerMethodField()
    wrong_count = serializers.SerializerMethodField()

    class Meta:
        model = Word
        fields = ['id', 'spanish', 'english', 'parts', 'correct_count', 'wrong_count']

    def get_correct_count(self, obj):
        return WordReviewItem.objects.filter(word=obj, correct=True).count()

    def get_wrong_count(self, obj):
        return WordReviewItem.objects.filter(word=obj, correct=False).count()

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name', 'words_count']

class GroupDetailSerializer(serializers.ModelSerializer):
    words = WordSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = ['id', 'name', 'words_count', 'words']

class StudySessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudySession
        fields = ['id', 'group', 'study_activity', 'created_at']

class WordReviewItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = WordReviewItem
        fields = ['id', 'word', 'study_session', 'correct', 'created_at'] 