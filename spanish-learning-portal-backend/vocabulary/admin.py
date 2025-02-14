from django.contrib import admin
from .models import Word, Group, Session

@admin.register(Word)
class WordAdmin(admin.ModelAdmin):
    list_display = ('spanish', 'english', 'get_type', 'get_level')
    search_fields = ('spanish', 'english')

    def get_type(self, obj):
        return obj.parts.get('type', '')
    get_type.short_description = 'Type'

    def get_level(self, obj):
        return obj.parts.get('level', '')
    get_level.short_description = 'Level'

@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'words_count')

    def words_count(self, obj):
        return obj.words.count()
    words_count.short_description = 'Number of Words'

@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ('group', 'start_time', 'end_time', 'review_items_count')
    list_filter = ('group', 'start_time') 