from django.conf import settings
from django.db import models

class ArtisanProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="artisan_profile"
    ) 
    business_name = models.CharField(max_length=255)
    bio = models.TextField(blank=True)
    address = models.CharField(max_length=255)
    contacts = models.JSONField(default=dict, blank=True) 
    years_of_experience = models.PositiveIntegerField(default=0)
    is_available = models.BooleanField(default=True)
    total_jobs_completed = models.PositiveIntegerField(default=0)
    rating = models.FloatField(default=0.0)

    def __str__(self):
        return self.business_name