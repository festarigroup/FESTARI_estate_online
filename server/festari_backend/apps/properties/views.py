from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action

from apps.common.permissions import IsAdminRole
from apps.common.responses import api_response
from apps.properties.models import Property, Wishlist
from apps.properties.serializers import PropertySerializer, WishlistSerializer


class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all().order_by("-created_at")
    serializer_class = PropertySerializer
    filterset_fields = ("status", "is_featured", "location")
    search_fields = ("title", "description", "location")
    ordering_fields = ("price", "created_at", "views_count")

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        if self.action in ("approve", "reject"):
            return [IsAdminRole()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        obj = self.get_object()
        obj.status = Property.Status.APPROVED
        obj.save(update_fields=["status"])
        return api_response(True, "Property approved", status.HTTP_200_OK, data=PropertySerializer(obj).data)

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        obj = self.get_object()
        obj.status = Property.Status.REJECTED
        obj.save(update_fields=["status"])
        return api_response(True, "Property rejected", status.HTTP_200_OK, data=PropertySerializer(obj).data)


class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Wishlist.objects.none()
        if not self.request.user.is_authenticated:
            return Wishlist.objects.none()
        return Wishlist.objects.filter(user=self.request.user).select_related("property")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
