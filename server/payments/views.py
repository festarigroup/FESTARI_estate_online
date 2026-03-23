import uuid
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from .serilizers import PaymentInitializeSerializer, SubscriptionSerializer
from .models import Payment, SubscriptionPayment
from .services import PaystackService, PaystackSubscriptionService
from utils.api_response import api_response 
from rest_framework import generics


class InitializePaymentView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentInitializeSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        amount = serializer.validated_data["amount"]
        user = request.user

        reference = str(uuid.uuid4())
        Payment.objects.create(user=user, amount=amount, reference=reference)

        response = PaystackService.initialize_payment(
            email=user.email,
            amount=amount,
            reference=reference
        )

        return api_response(True, "Payment initialized", 200, data=response)

class SubscribeView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SubscriptionSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        print(1)
        plan = serializer.validated_data["plan"]
        recurring = serializer.validated_data["recurring"]
        user = request.user
        print(2)

        PLAN_MAP = {
            'basic': {"amount": 5000, "plan_code": "PLN_j15oejicxwctp14"},
            'pro': {"amount": 7000, "plan_code": "PLN_697asolzl4o05tx"},
            'enterprise': {"amount": 10000, "plan_code": "PLN_yo5yprsfwhuxex9"},
        }

        amount = PLAN_MAP[plan]["amount"]
        plan_code = PLAN_MAP[plan]["plan_code"]
        print(3)

        # 🔍 Check active subscription
        active_sub = SubscriptionPayment.objects.filter(
            user=user,
            is_active=True
        ).first()
        print(4)

        # ❌ Same plan
        if active_sub and active_sub.subscription_plan == plan:
            return api_response(False, "You are already on this plan", 400)

        try:
            # 🔁 CHANGE PLAN (cancel old)
            if active_sub:
                print(5)
                PaystackSubscriptionService.disable_subscription(
                    active_sub.subscription_code,
                    active_sub.email_token
                )
                active_sub.is_active = False
                active_sub.save()

            # 🆕 Create new subscription or one-time
            reference = str(uuid.uuid4())

            if recurring:
                print(6)
                response = PaystackService.initialize_payment(
                    email=user.email,
                    amount=amount,
                    reference=reference,
                    plan_code=plan_code
                )
            else:
                response = PaystackService.initialize_payment(
                    email=user.email,
                    amount=amount,
                    reference=reference
                )

        except Exception as e:
            return api_response(False, str(e), 500)

        # 💾 Save new record
        print(7)
        SubscriptionPayment.objects.create(
            user=user,
            subscription_plan=plan,
            amount=amount,
            reference=reference,
            status="pending"
        )

        return api_response(True, "Plan change initiated", 200, data=response)


class CancelSubscriptionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        sub = SubscriptionPayment.objects.filter(
            user=user,
            is_active=True
        ).first()

        if not sub:
            return api_response(False, "No active subscription", 400)

        try:
            PaystackSubscriptionService.disable_subscription(
                sub.subscription_code,
                sub.email_token
            )

            sub.is_active = False
            sub.save()

        except Exception as e:
            return api_response(False, str(e), 500)

        return api_response(True, "Subscription cancelled", 200)
