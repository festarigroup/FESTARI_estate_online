from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    BUYER = 'buyer'
    ESTATE_MANAGER = 'estate_manager'
    ARTISAN = 'artisan'
    HOTEL_MANAGER = 'hotel_manager'
    ADMIN = 'admin'

    ROLE_CHOICES = [
        (BUYER, 'Buyer'),
        (ESTATE_MANAGER, 'Estate Manager'),
        (ARTISAN, 'Artisan'),
        (HOTEL_MANAGER, 'Hotel Manager'),
        (ADMIN, 'Admin'),
    ]

    email = models.EmailField(null=True, blank=True, unique=True)
    phone_number = models.CharField(
        max_length=15,
        null=True,
        blank=True,
        unique=True
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=BUYER
    )

    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.username
