from rest_framework.routers import DefaultRouter

from apps.artisans.views import ArtisanHireRequestViewSet, ArtisanProfileViewSet

router = DefaultRouter()
router.register("artisans", ArtisanProfileViewSet, basename="artisans")
router.register("artisan-hires", ArtisanHireRequestViewSet, basename="artisan-hires")

urlpatterns = router.urls
