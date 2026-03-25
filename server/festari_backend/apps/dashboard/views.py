from django.db.models import Count, Sum
from rest_framework import permissions
from rest_framework.views import APIView

from apps.common.permissions import IsAdminRole
from apps.common.responses import api_response
from apps.hotels.models import HotelBooking
from apps.payments.models import Payment
from apps.properties.models import Property
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
