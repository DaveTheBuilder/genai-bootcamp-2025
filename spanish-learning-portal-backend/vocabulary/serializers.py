from rest_framework import serializers
from .models import Word, Group, Session, StudyActivity

class WordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = ['id', 'spanish', 'english', 'difficulty', 'xp']

class GroupSerializer(serializers.ModelSerializer):
    words_count = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = ['id', 'name', 'words_count']

    def get_words_count(self, obj):
        return obj.words.count()

class SessionSerializer(serializers.ModelSerializer):
    group_name = serializers.CharField(source='group.name', read_only=True)

    class Meta:
        model = Session
        fields = ['id', 'group_name', 'activity_id', 'start_time', 'review_items_count']

class StudyActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyActivity
        fields = ['id', 'name', 'description', 'created_at']

class DashboardLastStudySessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ['id', 'group', 'created_at', 'activity_id']

class DashboardStudyProgressSerializer(serializers.Serializer):
    total_words_studied = serializers.IntegerField()
    total_available_words = serializers.IntegerField()

class DashboardQuickStatsSerializer(serializers.Serializer):
    success_rate = serializers.FloatField()
    total_study_sessions = serializers.IntegerField()
    total_active_groups = serializers.IntegerField()
    study_streak_days = serializers.IntegerField() 