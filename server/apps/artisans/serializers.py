from rest_framework import serializers

from apps.artisans.models import ArtisanHireRequest, ArtisanProfile


class ArtisanProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtisanProfile
        fields = "__all__"
        read_only_fields = ("user", "status")


class ArtisanHireRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtisanHireRequest
        fields = "__all__"
        read_only_fields = ("buyer", "status")
