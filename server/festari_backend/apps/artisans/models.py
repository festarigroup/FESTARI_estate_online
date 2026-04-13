import uuid
from django.conf import settings
from django.db import models


class ArtisanProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="artisan_profile")
    bio = models.TextField(blank=True)
    service_categories = models.JSONField(default=list, blank=True)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=16, default="pending")
    media_urls = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class ArtisanHireRequest(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="artisan_hires")
    artisan = models.ForeignKey(ArtisanProfile, on_delete=models.CASCADE, related_name="hire_requests")
    service_description = models.TextField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=16, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
