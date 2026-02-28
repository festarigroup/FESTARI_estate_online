from rest_framework import serializers
from .models import ArtisanService

class ArtisanServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtisanService
        fields = "__all__"
        read_only_fields = ["artisan"]