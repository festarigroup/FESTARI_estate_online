from rest_framework import permissions, viewsets

from apps.hotels.models import Hotel, HotelBooking
from apps.hotels.serializers import HotelBookingSerializer, HotelSerializer


class HotelViewSet(viewsets.ModelViewSet):
    queryset = Hotel.objects.all().order_by("-created_at")
    serializer_class = HotelSerializer
    filterset_fields = ("location", "status")
    search_fields = ("name", "description", "location")
    ordering_fields = ("nightly_rate", "created_at")

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(manager=self.request.user)


class HotelBookingViewSet(viewsets.ModelViewSet):
    serializer_class = HotelBookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return HotelBooking.objects.none()
        if not self.request.user.is_authenticated:
            return HotelBooking.objects.none()
        return HotelBooking.objects.filter(user=self.request.user).select_related("hotel")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
