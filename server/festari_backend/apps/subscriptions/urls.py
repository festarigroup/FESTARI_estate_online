from rest_framework.routers import DefaultRouter

from apps.subscriptions.views import SubscriptionPlanViewSet, UserSubscriptionViewSet

router = DefaultRouter()
router.register("subscription-plans", SubscriptionPlanViewSet, basename="subscription-plans")
router.register("subscriptions", UserSubscriptionViewSet, basename="subscriptions")

urlpatterns = router.urls
