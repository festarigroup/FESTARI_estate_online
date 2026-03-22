import uuid
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Payment, SubscriptionPayment
from .services import PaystackService, PaystackSubscriptionService


class InitializePaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        amount = float(request.data.get("amount"))

        reference = str(uuid.uuid4())

        payment = Payment.objects.create(
            user=user,
            amount=amount,
            reference=reference
        )

        response = PaystackService.initialize_payment(
            email=user.email,
            amount=amount,
            reference=reference
        )

        return Response(response)
    

class VerifyPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, reference):
        response = PaystackService.verify_payment(reference)

        data = response.get("data")

        if data and data["status"] == "success":
            payment = Payment.objects.get(reference=reference)

            if payment.status != "success":
                payment.status = "success"
                payment.save()

        return Response(response)
    

class SubscribeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        plan = request.data.get("plan")  # basic, pro, enterprise

        # Map plan to amount and Paystack plan code
        PLAN_MAP = {
            'basic': {"amount": 5000, "plan_code": "PLN_basic123"},
            'pro': {"amount": 15000, "plan_code": "PLN_pro123"},
            'enterprise': {"amount": 50000, "plan_code": "PLN_enterprise123"},
        }

        if plan not in PLAN_MAP:
            return Response({"error": "Invalid plan"}, status=400)

        reference = str(uuid.uuid4())

        # Store payment record
        payment = SubscriptionPayment.objects.create(
            user=user,
            subscription_plan=plan,
            amount=PLAN_MAP[plan]["amount"],
            reference=reference
        )

        # Call Paystack to subscribe user
        response = PaystackSubscriptionService.create_subscription(
            email=user.email,
            plan_code=PLAN_MAP[plan]["plan_code"]
        )

        return Response(response)