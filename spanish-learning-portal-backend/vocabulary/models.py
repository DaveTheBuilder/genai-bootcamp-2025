from django.db import models

class Word(models.Model):
    spanish = models.CharField(max_length=255)
    english = models.CharField(max_length=255)
    parts = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['spanish']

    def __str__(self):
        return f"{self.spanish} ({self.english})"

class Group(models.Model):
    name = models.CharField(max_length=255)
    words = models.ManyToManyField(Word, related_name='groups')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

class Session(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='sessions')
    activity_id = models.IntegerField()
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    review_items_count = models.IntegerField(default=0)

    class Meta:
        ordering = ['-start_time']

    def __str__(self):
        return f"{self.group.name} - {self.start_time}" 