from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class Property(models.Model):
    LAND = 'land'
    HOUSE = 'house'

    PROPERTY_TYPE_CHOICES = [
        (LAND, 'Land'),
        (HOUSE, 'House'),
    ]

    RENT = 'rent'
    SALE = 'sale'

    LISTING_TYPE_CHOICES = [
        (RENT, 'Rent'),
        (SALE, 'Sale'),
    ]

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='properties'
    )

    title = models.CharField(max_length=255)
    description = models.TextField()

    property_type = models.CharField(
        max_length=10,
        choices=PROPERTY_TYPE_CHOICES
    )

    listing_type = models.CharField(
        max_length=10,
        choices=LISTING_TYPE_CHOICES
    )

    price = models.DecimalField(max_digits=12, decimal_places=2)

    location = models.CharField(max_length=255)

    is_available = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class PropertyImage(models.Model):
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='images'
    )

    image = models.URLField()  

    uploaded_at = models.DateTimeField(auto_now_add=True)


class Wishlist(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='wishlist_items'
    )
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='wishlisted_by'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'property')

    def __str__(self):
        return f"{self.user} → {self.property}"