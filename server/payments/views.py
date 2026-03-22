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
        plan = serializer.validated_data["plan"]
        user = request.user

        PLAN_MAP = {
            'basic': {"amount": 5000, "plan_code": "PLN_basic123"},
            'pro': {"amount": 15000, "plan_code": "PLN_pro123"},
            'enterprise': {"amount": 50000, "plan_code": "PLN_enterprise123"},
        }

        # 1️⃣ Ensure the customer exists in Paystack
        customer = PaystackService.get_customer_by_email(user.email)
        if not customer:
            customer = PaystackService.create_customer(
                email=user.email,
                first_name=user.first_name,
                last_name=user.last_name
            )

        # 2️⃣ Create subscription in Paystack
        response = PaystackSubscriptionService.create_subscription(
            customer_code=customer['customer_code'],  # Use Paystack's unique customer code
            plan_code=PLAN_MAP[plan]["plan_code"]
        )

        # 3️⃣ Store subscription payment locally
        reference = str(uuid.uuid4())
        payment = SubscriptionPayment.objects.create(
            user=user,
            subscription_plan=plan,
            amount=PLAN_MAP[plan]["amount"],
            reference=reference
        )

        return api_response(True, "Subscription initiated", 200, data=response)


class VerifyPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, reference):
        response = PaystackService.verify_payment(reference)
        data = response.get("data")

        if data and data.get("status") == "success":
            try:
                payment = Payment.objects.get(reference=reference)
                if payment.status != "success":
                    payment.status = "success"
                    payment.save()
            except Payment.DoesNotExist:
                return api_response(False, "Payment not found", 404)

        return api_response(True, "Payment verification result", 200, data=response)

