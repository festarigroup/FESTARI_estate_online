from rest_framework import filters, status
from rest_framework.generics import (CreateAPIView, DestroyAPIView,
                                    ListAPIView, ListCreateAPIView,
                                    RetrieveUpdateDestroyAPIView)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Property, Wishlist
from .permissions import IsAdminOrEstateManager, IsBuyer
from .serializers import PropertySerializer, WishlistAddSerializer, WishlistPropertySerializer


class PropertyListCreateView(ListCreateAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'location', 'description']
    ordering_fields = ['price', 'created_at']

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated(), IsAdminOrEstateManager()]
        return [AllowAny()]

    def create(self, request, *args, **kwargs):
        user = request.user

        if user.role == 'estate_manager':
            subscription = getattr(user, 'subscription', None)
            if not subscription:
                return Response(
                    {"error": "No active subscription"},
                    status=status.HTTP_403_FORBIDDEN
                )

            current_count = user.properties.count()
            if current_count >= subscription.max_properties():
                return Response(
                    {"error": "Property limit reached for your plan"},
                    status=status.HTTP_403_FORBIDDEN
                )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(owner=user)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PropertyDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer

    def get_permissions(self):
        if self.request.method in ['PATCH', 'DELETE']:
            return [IsAuthenticated(), IsAdminOrEstateManager()]
        return [AllowAny()]


class WishlistListView(ListAPIView):
    serializer_class = WishlistPropertySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Property.objects.none()
        return Property.objects.filter(wishlisted_by__user=self.request.user)


class WishlistCreateView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = WishlistAddSerializer

    def perform_create(self, serializer):
        prop_id = serializer.validated_data['property_id']
        prop = Property.objects.get(id=prop_id)  # You can add try/except here if you want
        serializer.save(user=self.request.user, property=prop)

    def create(self, request, *args, **kwargs):
        """
        Override create to customize response message.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"success": True, "message": "Property added to wishlist."},
            status=status.HTTP_201_CREATED
        )


class WishlistDeleteView(DestroyAPIView):
    permission_classes = [IsBuyer]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Wishlist.objects.none()
        return Wishlist.objects.filter(user=self.request.user)
