import uuid
from django.conf import settings
from django.db import models


class Property(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="properties")
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=14, decimal_places=2)
    location = models.CharField(max_length=255)
    is_featured = models.BooleanField(default=False)
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.PENDING)
    media_urls = models.JSONField(default=list, blank=True)
    views_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Wishlist(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="wishlisted_properties")
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="wishlisted_by")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "property")
