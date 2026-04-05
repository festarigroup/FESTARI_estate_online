import uuid
from django.conf import settings
from django.db import models


class Payment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class PaymentType(models.TextChoices):
        SUBSCRIPTION = "subscription", "Subscription"
        PROPERTY_PURCHASE = "property_purchase", "Property Purchase"
        HOTEL_BOOKING = "hotel_booking", "Hotel Booking"
        ARTISAN_PAYMENT = "artisan_payment", "Artisan Payment"

    class Interval(models.TextChoices):
        MONTHLY = "monthly", "Monthly"
        YEARLY = "yearly", "Yearly"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="payments")
    payment_type = models.CharField(max_length=30, choices=PaymentType.choices)
    interval = models.CharField(max_length=10, choices=Interval.choices, blank=True, null=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10, default="NGN")
    reference = models.CharField(max_length=120, unique=True)
    provider = models.CharField(max_length=32, default="paystack")
    status = models.CharField(max_length=20, default="pending")
    recipient_email = models.EmailField(blank=True, null=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
