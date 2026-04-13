from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import timedelta

from apps.common.permissions import IsAdminRole
from apps.common.responses import api_response
from apps.payments.services import PaystackService
from apps.payments.models import Payment
from apps.subscriptions.models import SubscriptionPlan, UserSubscription
from apps.subscriptions.serializers import SubscriptionPlanSerializer, UserSubscriptionSerializer


class SubscriptionPlanViewSet(viewsets.ModelViewSet):
    queryset = SubscriptionPlan.objects.all().order_by("amount")
    serializer_class = SubscriptionPlanSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [IsAdminRole()]

    @action(detail=False, methods=["post"])
    def sync_from_paystack(self, request):
        """Sync plans from Paystack to local DB."""
        response = PaystackService.list_plans()
        if response.status_code != 200:
            return api_response(False, "Failed to fetch plans from Paystack", status.HTTP_400_BAD_REQUEST)

        plans_data = response.json().get("data", [])
        synced = 0
        for plan in plans_data:
            SubscriptionPlan.objects.update_or_create(
                paystack_plan_code=plan["plan_code"],
                defaults={
                    "name": plan["name"],
                    "amount": plan["amount"] / 100,  # Convert from kobo
                    "interval": plan["interval"],
                    "is_active": plan["status"] == "active",
                },
            )
            synced += 1

        return api_response(True, f"Synced {synced} plans from Paystack", status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def push_to_paystack(self, request, pk=None):
        """Push local plan to Paystack."""
        plan = self.get_object()
        if plan.paystack_plan_code:
            # Update existing
            response = PaystackService.update_plan(
                plan.paystack_plan_code,
                name=plan.name,
                amount=plan.amount,
                interval=plan.interval,
            )
        else:
            # Create new
            response = PaystackService.create_plan(plan.name, plan.amount, plan.interval)

        if response.status_code not in (200, 201):
            return api_response(False, "Failed to sync with Paystack", status.HTTP_400_BAD_REQUEST)

        data = response.json().get("data", {})
        plan.paystack_plan_code = data.get("plan_code")
        plan.save()

        return api_response(True, "Plan synced with Paystack", status.HTTP_200_OK, data=SubscriptionPlanSerializer(plan).data)


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

    @action(detail=False, methods=["post"], url_path="subscribe")
    def subscribe(self, request):
        """Initialize subscription payment for a plan."""
        plan_id = request.data.get("plan_id")
        if not plan_id:
            return api_response(False, "plan_id is required", status.HTTP_400_BAD_REQUEST)

        try:
            plan = SubscriptionPlan.objects.get(id=plan_id, is_active=True)
        except SubscriptionPlan.DoesNotExist:
            return api_response(False, "Plan not found or inactive", status.HTTP_404_NOT_FOUND)

        # Check if user already has active subscription
        existing_subscription = UserSubscription.objects.filter(
            user=request.user, 
            is_active=True
        ).first()

        if existing_subscription:
            return api_response(
                False, 
                "You already have an active subscription. Cancel it first to subscribe to a new plan.", 
                status.HTTP_400_BAD_REQUEST
            )

        # Create payment record
        import uuid
        reference = f"FESTARI-SUB-{uuid.uuid4().hex[:16].upper()}"
        payment = Payment.objects.create(
            user=request.user,
            payment_type=Payment.PaymentType.SUBSCRIPTION,
            amount=plan.amount,
            reference=reference,
            metadata={"plan_id": str(plan.id)}
        )

        # Initialize Paystack payment
        response = PaystackService.initialize(
            email=request.user.email,
            amount=plan.amount,
            reference=reference,
            callback_url=f"{request.scheme}://{request.get_host()}/api/v1/payments/verify/?reference={reference}"
        )

        if response.status_code != 200:
            payment.delete()  # Clean up failed payment
            return api_response(False, "Failed to initialize payment", status.HTTP_400_BAD_REQUEST)

        return api_response(
            True, 
            "Subscription payment initialized successfully", 
            status.HTTP_200_OK,
            data={
                "payment_reference": reference,
                "paystack_url": response.json().get("data", {}).get("authorization_url"),
                "plan": SubscriptionPlanSerializer(plan).data
            }
        )

    @action(detail=False, methods=["post"], url_path="cancel")
    def cancel_subscription(self, request):
        """Cancel current active subscription."""
        subscription = UserSubscription.objects.filter(
            user=request.user, 
            is_active=True
        ).first()

        if not subscription:
            return api_response(False, "No active subscription found", status.HTTP_404_NOT_FOUND)

        # Here you would typically call Paystack API to cancel the subscription
        # For now, we'll just deactivate locally
        subscription.is_active = False
        subscription.save()

        return api_response(True, "Subscription cancelled successfully", status.HTTP_200_OK)
