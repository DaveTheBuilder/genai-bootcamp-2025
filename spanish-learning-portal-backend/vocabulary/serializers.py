from rest_framework import serializers
from .models import Word, Group, Session

class WordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = ['id', 'spanish', 'english', 'parts']

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