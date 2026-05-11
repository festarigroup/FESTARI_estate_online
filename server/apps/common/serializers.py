from rest_framework import serializers

from apps.common.models import PropertyInquiry, ArtisanInquiry


class PropertyInquirySerializer(serializers.ModelSerializer):
    property_title = serializers.CharField(source="property.title", read_only=True)
    property_owner_email = serializers.EmailField(source="property.owner.email", read_only=True)

    class Meta:
        model = PropertyInquiry
        fields = "__all__"
        read_only_fields = ("id", "user", "is_read", "created_at")


class ArtisanInquirySerializer(serializers.ModelSerializer):
    artisan_name = serializers.CharField(source="artisan.user.first_name", read_only=True)
    artisan_email = serializers.EmailField(source="artisan.user.email", read_only=True)

    class Meta:
        model = ArtisanInquiry
        fields = "__all__"
        read_only_fields = ("id", "user", "is_read", "created_at")