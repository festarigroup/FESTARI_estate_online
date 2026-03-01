from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny
from .models import Hotel
from .serializers import HotelSerializer
from .permissions import IsHotelManagerOrAdmin
from utils.pagination import PageLimitPagination  # your pagination


class HotelViewSet(ModelViewSet):
    queryset = Hotel.objects.all().order_by("-created_at")
    serializer_class = HotelSerializer
    pagination_class = PageLimitPagination
    permission_classes = [IsHotelManagerOrAdmin]