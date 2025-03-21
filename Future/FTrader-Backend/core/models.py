from django.db import models
from django.utils import timezone


class TaskError(models.Model):
    """
    Model to track Celery task errors
    """
    task_id = models.CharField(max_length=255)
    task_name = models.CharField(max_length=255)
    error_message = models.TextField()
    error_traceback = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    resolved = models.BooleanField(default=False)
    resolved_at = models.DateTimeField(null=True, blank=True)
    resolution_notes = models.TextField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['task_name']),
            models.Index(fields=['created_at']),
            models.Index(fields=['resolved']),
        ]
    
    def __str__(self):
        return f"{self.task_name} - {self.task_id} - {self.created_at}"
    
    def resolve(self, notes=None):
        """
        Mark the error as resolved
        
        Args:
            notes: Resolution notes
        """
        self.resolved = True
        self.resolved_at = timezone.now()
        
        if notes:
            self.resolution_notes = notes
        
        self.save()


class TaskPerformanceMetric(models.Model):
    """
    Model to track Celery task performance metrics
    """
    task_id = models.CharField(max_length=255)
    task_name = models.CharField(max_length=255)
    execution_time = models.FloatField(help_text="Execution time in seconds")
    memory_usage = models.IntegerField(null=True, blank=True, help_text="Memory usage in KB")
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['task_name']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.task_name} - {self.task_id} - {self.execution_time}s"
