from rest_framework.routers import DefaultRouter

from apps.hotels.views import HotelBookingViewSet, HotelViewSet

router = DefaultRouter()
router.register("hotels", HotelViewSet, basename="hotels")
router.register("hotel-bookings", HotelBookingViewSet, basename="hotel-bookings")

urlpatterns = router.urls
