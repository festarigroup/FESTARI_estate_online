from django.contrib import admin

from apps.artisans.models import ArtisanHireRequest, ArtisanProfile

admin.site.register(ArtisanProfile)
admin.site.register(ArtisanHireRequest)
