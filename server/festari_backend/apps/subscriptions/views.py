from rest_framework import permissions, viewsets

from apps.common.permissions import IsAdminRole
from apps.subscriptions.models import SubscriptionPlan, UserSubscription
from apps.subscriptions.serializers import SubscriptionPlanSerializer, UserSubscriptionSerializer


class SubscriptionPlanViewSet(viewsets.ModelViewSet):
    queryset = SubscriptionPlan.objects.all().order_by("amount")
    serializer_class = SubscriptionPlanSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [IsAdminRole()]


class UserSubscriptionViewSet(viewsets.ModelViewSet):
    serializer_class = UserSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return UserSubscription.objects.none()
        user = self.request.user
        if not user or not user.is_authenticated:
            return UserSubscription.objects.none()
        if user.is_staff:
            return UserSubscription.objects.all().select_related("user", "plan")
        return UserSubscription.objects.filter(user=user).select_related("plan")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
