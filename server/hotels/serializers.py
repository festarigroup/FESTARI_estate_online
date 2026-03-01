from rest_framework import serializers
from .models import Hotel


class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = "__all__"
        read_only_fields = ["manager", "created_at", "updated_at"]

    def validate(self, attrs):
        request = self.context.get("request")

        if request.method == "POST":
            if hasattr(request.user, "hotel"):
                raise serializers.ValidationError(
                    "You already have a hotel registered."
                )

        return attrs

    def create(self, validated_data):
        validated_data["manager"] = self.context["request"].user
        return super().create(validated_data)