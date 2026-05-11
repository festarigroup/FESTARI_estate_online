from rest_framework.routers import DefaultRouter

from apps.common.views import PropertyInquiryViewSet, ArtisanInquiryViewSet

router = DefaultRouter()
router.register("property-inquiries", PropertyInquiryViewSet, basename="property-inquiries")
router.register("artisan-inquiries", ArtisanInquiryViewSet, basename="artisan-inquiries")

urlpatterns = router.urls