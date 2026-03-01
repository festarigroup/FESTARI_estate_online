from django.conf import settings
from django.db import models

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

    PER_DAY = 'day'
    PER_WEEK = 'week'
    PER_MONTH = 'month'
    PER_YEAR = 'year'

    RENTAL_PERIOD_CHOICES = [
        (PER_DAY, 'Per Day'),
        (PER_WEEK, 'Per Week'),
        (PER_MONTH, 'Per Month'),
        (PER_YEAR, 'Per Year'),
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
    rental_period = models.CharField(
        max_length=10,
        choices=RENTAL_PERIOD_CHOICES,
        blank=True,
        null=True,
        help_text="Only required if the property is for rent"
    )

    location = models.CharField(max_length=255)
    is_available = models.BooleanField(default=True)

    beds = models.CharField(max_length=50, blank=True, null=True, help_text="Example: King Size Bed")
    capacity = models.CharField(max_length=50, blank=True, null=True, help_text="Example: 1-2 Persons")
    bathrooms = models.PositiveSmallIntegerField(blank=True, null=True, help_text="Number of bathrooms")

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