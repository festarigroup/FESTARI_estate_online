import uuid
from django.conf import settings
from django.db import models


class SubscriptionPlan(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    interval = models.CharField(max_length=20, default="monthly")  # e.g., monthly, yearly
    paystack_plan_code = models.CharField(max_length=50, blank=True, null=True, unique=True)
    max_properties = models.PositiveIntegerField(default=5)
    can_feature_properties = models.BooleanField(default=False)
    max_hotels = models.PositiveIntegerField(default=1)  # For hotel managers
    max_images = models.PositiveIntegerField(default=10)
    max_videos = models.PositiveIntegerField(default=2)
    max_image_size_mb = models.PositiveIntegerField(default=5)  # MB
    max_video_size_mb = models.PositiveIntegerField(default=50)  # MB
    is_active = models.BooleanField(default=True)
    is_artisan_plan = models.BooleanField(default=False)  # For artisans, single plan
    is_hotel_plan = models.BooleanField(default=False)  # For hotels, single plan


class UserSubscription(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="subscription")
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.PROTECT, related_name="subscriptions")
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)
