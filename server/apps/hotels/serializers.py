from rest_framework import serializers

from apps.hotels.models import Hotel, HotelBooking


class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = "__all__"
        read_only_fields = ("manager",)


class HotelBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = HotelBooking
        fields = "__all__"
        read_only_fields = ("user", "status")
