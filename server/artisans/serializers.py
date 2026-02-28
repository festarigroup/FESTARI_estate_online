from rest_framework import serializers
from .models import ArtisanProfile

class ArtisanProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtisanProfile
        fields = "__all__"
        read_only_fields = ["user", "total_jobs_completed", "rating"]