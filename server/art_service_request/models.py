from django.conf import settings
from django.db import models
from art_services.models import ArtisanService
from artisans.models import ArtisanProfile


class ServiceRequest(models.Model):
    PENDING = "pending"
    ACCEPTED = "accepted"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    REJECTED = "rejected"

    STATUS_CHOICES = [
        (PENDING, "Pending"),
        (ACCEPTED, "Accepted"),
        (IN_PROGRESS, "In Progress"),
        (COMPLETED, "Completed"),
        (CANCELLED, "Cancelled"),
        (REJECTED, "Rejected"),
    ]

    service = models.ForeignKey(ArtisanService, on_delete=models.PROTECT)
    artisan = models.ForeignKey(ArtisanProfile, on_delete=models.PROTECT)
    buyer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="service_requests"
    )
    description = models.TextField()
    price_snapshot = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=PENDING)

    artisan_marked_completed = models.BooleanField(default=False)
    buyer_marked_completed = models.BooleanField(default=False)

    is_deleted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def finalize_if_ready(self):
        if self.artisan_marked_completed and self.buyer_marked_completed:
            self.status = self.COMPLETED
            self.save()
            self.artisan.total_jobs_completed += 1
            self.artisan.save()