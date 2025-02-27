from django.db import models

class Word(models.Model):
    spanish = models.CharField(max_length=100)
    english = models.CharField(max_length=100)
    difficulty = models.CharField(max_length=20, choices=[
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ], default='easy')
    xp = models.IntegerField(default=0)  # XP associated with the word
    parts = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['spanish']

    def __str__(self):
        return self.spanish

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

class StudyActivity(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name 
    
class Conversation(models.Model):
    user_id = models.IntegerField()
    topic = models.CharField(max_length=255)
    user_response = models.TextField()
    correct = models.BooleanField()
    embedding = models.TextField()  # Storing as text (base64 encoded or serialized JSON)

    def __str__(self):
        return f"Conversation {self.id} on {self.topic} for user {self.user_id}"



class GeneratedQuestion(models.Model):
    question_text = models.TextField()
    options = models.JSONField(default=list)  # Stores options
    audio_file = models.FileField(upload_to='speech/', blank=True, null=True)

    def __str__(self):
        return self.question_text

class QuestionAnswerLog(models.Model):
    user_id = models.IntegerField()
    generated_question = models.ForeignKey(GeneratedQuestion, on_delete=models.CASCADE)
    answer = models.CharField(max_length=255)
    is_correct = models.BooleanField()
    answered_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"User {self.user_id} - {self.generated_question.question_text} answered: {self.answer}"

class APICallLog(models.Model):
    endpoint = models.CharField(max_length=255)
    request_data = models.JSONField()  # To store the raw data sent to the endpoint
    response_data = models.JSONField()  # To store the response data from the endpoint
    status = models.CharField(max_length=20)  # e.g., 'success', 'error'
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"API call to {self.endpoint} at {self.timestamp}"
