from rest_framework import filters, status
from rest_framework.generics import (
    CreateAPIView, DestroyAPIView, ListAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
)
from rest_framework.permissions import AllowAny, IsAuthenticated

from utils.api_response import api_response

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
                return api_response(False, "No active subscription.", status.HTTP_403_FORBIDDEN)

            current_count = user.properties.count()
            if current_count >= subscription.max_properties():
                return api_response(False, "Property limit reached for your plan.", status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=user)
            return api_response(True, "Property created successfully.", status.HTTP_201_CREATED, data=serializer.data)
        return api_response(False, "Validation failed.", status.HTTP_400_BAD_REQUEST, errors=serializer.errors)


class PropertyDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer

    def get_permissions(self):
        if self.request.method in ['PATCH', 'DELETE']:
            return [IsAuthenticated(), IsAdminOrEstateManager()]
        return [AllowAny()]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(True, "Property retrieved successfully.", status.HTTP_200_OK, data=serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return api_response(True, "Property updated successfully.", status.HTTP_200_OK, data=serializer.data)
        return api_response(False, "Validation failed.", status.HTTP_400_BAD_REQUEST, errors=serializer.errors)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return api_response(True, "Property deleted successfully.", status.HTTP_204_NO_CONTENT)


class WishlistListView(ListAPIView):
    serializer_class = WishlistPropertySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Property.objects.none()
        return Property.objects.filter(wishlisted_by__user=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return api_response(True, "Wishlist retrieved successfully.", status.HTTP_200_OK, data=serializer.data)


class WishlistCreateView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = WishlistAddSerializer

    def perform_create(self, serializer):
        prop_id = serializer.validated_data.get('property_id')
        try:
            prop = Property.objects.get(id=prop_id)
        except Property.DoesNotExist:
            raise ValueError("Property not found")

        serializer.save(user=self.request.user, property=prop)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return api_response(True, "Property added to wishlist.", status.HTTP_201_CREATED, code="WISHLIST_CREATED")
        except ValueError as e:
            return api_response(False, str(e), status.HTTP_404_NOT_FOUND, code="PROPERTY_NOT_FOUND")
        except Exception as e:
            return api_response(False, "Validation failed.", status.HTTP_400_BAD_REQUEST, errors=serializer.errors, code="VALIDATION_ERROR")


class WishlistDeleteView(DestroyAPIView):
    permission_classes = [IsBuyer]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Wishlist.objects.none()
        return Wishlist.objects.filter(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return api_response(True, "Property removed from wishlist.", status.HTTP_204_NO_CONTENT)
