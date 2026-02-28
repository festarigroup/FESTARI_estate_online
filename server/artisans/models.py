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
    years_of_experience = models.PositiveIntegerField(default=0)
    is_available = models.BooleanField(default=True)
    rating = models.FloatField(default=0.0)

    def __str__(self):
        return self.business_name

class ArtisanService(models.Model):
    artisan = models.ForeignKey(
        ArtisanProfile,
        on_delete=models.CASCADE,
        related_name="services"
    )

    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.name} - {self.artisan.business_name}"