from rest_framework import status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.generics import RetrieveUpdateDestroyAPIView, ListAPIView, ListCreateAPIView, CreateAPIView, DestroyAPIView

from .models import Wishlist, Property
from .serializers import PropertySerializer, WishlistPropertySerializer
from .permissions import IsAdminOrEstateManager, IsBuyer


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
        return Property.objects.filter(wishlisted_by__user=self.request.user)


class WishlistCreateView(CreateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        property_id = request.data.get('property_id')
        user = request.user
        prop = Property.objects.get(id=property_id)

        wishlist_item, created = Wishlist.objects.get_or_create(
            user=user,
            property=prop
        )

        return Response(
            {"success": True, "message": "Property added to wishlist."},
            status=201 if created else 200
        )


class WishlistDeleteView(DestroyAPIView):
    permission_classes = [IsBuyer]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)
