from rest_framework import serializers

from apps.properties.models import Property, Wishlist


class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = "__all__"
        read_only_fields = ("owner", "status", "views_count", "created_at", "updated_at")


class WishlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wishlist
        fields = "__all__"
        read_only_fields = ("user",)
