from rest_framework import serializers
from .models import ServiceRequest


class ServiceRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceRequest
        fields = "__all__"
        read_only_fields = [
            "buyer",
            "artisan",
            "service",
            "artisan_marked_completed",
            "buyer_marked_completed",
            "created_at",
            "updated_at",
            "is_deleted",
        ]


class ServiceRequestUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceRequest
        fields = ["status", "price_snapshot", "description"]
        read_only_fields = []


class EmptySerializer(serializers.Serializer):
    pass