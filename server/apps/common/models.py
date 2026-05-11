import uuid
from django.conf import settings
from django.db import models


class PropertyInquiry(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="property_inquiries")
    property = models.ForeignKey("properties.Property", on_delete=models.CASCADE, related_name="inquiries")
    subject = models.CharField(max_length=255)
    message = models.TextField()
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


class ArtisanInquiry(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="artisan_inquiries")
    artisan = models.ForeignKey("artisans.ArtisanProfile", on_delete=models.CASCADE, related_name="inquiries")
    subject = models.CharField(max_length=255)
    message = models.TextField()
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)