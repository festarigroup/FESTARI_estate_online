import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField("email address", unique=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Roles(models.TextChoices):
        BUYER = "buyer", "Buyer"
        ESTATE_MANAGER = "estate_manager", "Estate Manager"
        HOTEL_MANAGER = "hotel_manager", "Hotel Manager"
        ARTISAN = "artisan", "Artisan"
        ADMIN = "admin", "Admin"

    role = models.CharField(max_length=32, choices=Roles.choices, default=Roles.BUYER)
    phone_number = models.CharField(max_length=30, blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    oauth_provider = models.CharField(max_length=30, blank=True, null=True)


class OTPVerification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="otp_codes")
    code = models.CharField(max_length=6)
    is_used = models.BooleanField(default=False)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)


class ActivityLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=255)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
