from django.db import models
from django.db.models import JSONField
from django.utils import timezone

class Word(models.Model):
    spanish = models.CharField(max_length=255)
    english = models.CharField(max_length=255)
    parts = JSONField()
    groups = models.ManyToManyField('Group', through='WordGroup')

    class Meta:
        ordering = ['spanish']

    def __str__(self):
        return f"{self.spanish} ({self.english})"

class Group(models.Model):
    name = models.CharField(max_length=255)
    words_count = models.IntegerField(default=0)
    words = models.ManyToManyField(Word, through='WordGroup')

    def __str__(self):
        return self.name

class WordGroup(models.Model):
    word = models.ForeignKey(Word, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('word', 'group')

class StudyActivity(models.Model):
    name = models.CharField(max_length=255)
    url = models.URLField()

    def __str__(self):
        return self.name

class StudySession(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    study_activity = models.ForeignKey(StudyActivity, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)

class WordReviewItem(models.Model):
    word = models.ForeignKey(Word, on_delete=models.CASCADE)
    study_session = models.ForeignKey(StudySession, on_delete=models.CASCADE)
    correct = models.BooleanField()
    created_at = models.DateTimeField(default=timezone.now) 