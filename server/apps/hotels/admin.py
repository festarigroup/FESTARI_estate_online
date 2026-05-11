from django.contrib import admin

from apps.hotels.models import Hotel, HotelBooking

admin.site.register(Hotel)
admin.site.register(HotelBooking)
