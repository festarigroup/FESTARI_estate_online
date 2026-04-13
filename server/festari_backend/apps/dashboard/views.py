from django.db.models import Count, Sum
from rest_framework import permissions, status
from rest_framework.views import APIView

from apps.common.permissions import IsAdminRole
from apps.common.responses import api_response
from apps.hotels.models import Hotel, HotelBooking
from apps.hotels.serializers import HotelSerializer
from apps.payments.models import Payment
from apps.payments.serializers import PaymentSerializer
from apps.properties.models import Property
from apps.properties.serializers import PropertySerializer
from apps.artisans.models import ArtisanProfile
from apps.artisans.serializers import ArtisanProfileSerializer
from apps.subscriptions.models import UserSubscription


class AdminAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get(self, request):
        data = {
            "revenue": Payment.objects.filter(status="success").aggregate(total=Sum("amount")).get("total") or 0,
            "bookings": HotelBooking.objects.count(),
            "subscriptions": UserSubscription.objects.filter(is_active=True).count(),
            "popular_properties": list(Property.objects.order_by("-views_count").values("id", "title", "views_count")[:10]),
            "payment_by_type": list(Payment.objects.values("payment_type").annotate(count=Count("id")).order_by("-count")),
        }
        return api_response(True, "Analytics fetched", 200, data=data)


class HomeSummaryView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        featured_properties = Property.objects.filter(is_featured=True, status=Property.Status.APPROVED).order_by("-created_at")[:3]
        featured_hotels = Hotel.objects.filter(status="approved").order_by("-created_at")[:3]
        featured_artisans = ArtisanProfile.objects.filter(status="approved").order_by("-created_at")[:3]
        payments = []

        if request.user.is_authenticated:
            user_payments = Payment.objects.filter(user=request.user).order_by("-created_at")[:5]
            payments = PaymentSerializer(user_payments, many=True).data

        data = {
            "featured_properties": PropertySerializer(featured_properties, many=True).data,
            "featured_hotels": HotelSerializer(featured_hotels, many=True).data,
            "featured_artisans": ArtisanProfileSerializer(featured_artisans, many=True).data,
            "payments": payments,
        }
        return api_response(True, "Home summary fetched", status.HTTP_200_OK, data=data)
