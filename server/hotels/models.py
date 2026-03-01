from django.db import models
from django.conf import settings


class Hotel(models.Model):
    manager = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="hotel"
    )

    name = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    number_of_nights = models.PositiveIntegerField(default=1)
    number_of_rooms = models.PositiveIntegerField(default=1)
    bed_type = models.CharField(max_length=100)
    max_guests = models.PositiveIntegerField()
    bathrooms = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name