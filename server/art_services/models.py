from django.db import models
from artisans.models import ArtisanProfile

class ArtisanService(models.Model):
    artisan = models.ForeignKey(ArtisanProfile, on_delete=models.CASCADE, related_name="services")
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.artisan.business_name}"