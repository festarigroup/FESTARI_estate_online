from rest_framework import permissions, viewsets

from apps.artisans.models import ArtisanHireRequest, ArtisanProfile
from apps.artisans.serializers import ArtisanHireRequestSerializer, ArtisanProfileSerializer


class ArtisanProfileViewSet(viewsets.ModelViewSet):
    queryset = ArtisanProfile.objects.all().order_by("-created_at")
    serializer_class = ArtisanProfileSerializer
    filterset_fields = ("status",)
    search_fields = ("bio",)

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ArtisanHireRequestViewSet(viewsets.ModelViewSet):
    serializer_class = ArtisanHireRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return ArtisanHireRequest.objects.none()
        if not self.request.user.is_authenticated:
            return ArtisanHireRequest.objects.none()
        return ArtisanHireRequest.objects.filter(buyer=self.request.user).select_related("artisan")

    def perform_create(self, serializer):
        serializer.save(buyer=self.request.user)
