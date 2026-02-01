from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Property
from .serializers import PropertySerializer
from .permissions import IsAdminOrEstateManager


class PropertyListCreateView(generics.ListCreateAPIView):
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


class PropertyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer

    def get_permissions(self):
        if self.request.method in ['PATCH', 'DELETE']:
            return [IsAuthenticated(), IsAdminOrEstateManager()]
        return [AllowAny()]
