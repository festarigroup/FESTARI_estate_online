from rest_framework.routers import DefaultRouter

from apps.properties.views import PropertyViewSet, WishlistViewSet

router = DefaultRouter()
router.register("properties", PropertyViewSet, basename="properties")
router.register("wishlist", WishlistViewSet, basename="wishlist")

urlpatterns = router.urls
