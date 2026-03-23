from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
import hmac, hashlib

from .models import SubscriptionPayment

class PaystackWebhookView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        # Verify signature
        signature = request.headers.get('x-paystack-signature')
        computed = hmac.new(
            settings.PAYSTACK_SECRET_KEY.encode(),
            request.body,
            hashlib.sha512
        ).hexdigest()

        if signature != computed:
            return Response({"error": "Invalid signature"}, status=400)

        event = request.data
        event_type = event.get('event')
        data = event.get('data', {})

        # ✅ Subscription created (after payment)
        if event_type in ['subscription.create', 'charge.success']:
            customer_email = data["customer"]["email"]
            reference = data.get("reference")
            subscription_code = data.get("subscription")  # Paystack sends this for charge.success

            sub_payment = None
            if reference:
                sub_payment = SubscriptionPayment.objects.filter(reference=reference).first()
            if not sub_payment:
                sub_payment = SubscriptionPayment.objects.filter(user__email=customer_email).last()

            if sub_payment:
                sub_payment.subscription_code = subscription_code or sub_payment.subscription_code
                sub_payment.email_token = data.get("email_token") or sub_payment.email_token
                sub_payment.is_active = True
                sub_payment.status = "success"
                sub_payment.next_billing_date = data.get("next_payment_date")
                sub_payment.save()

        # ✅ Subscription cancelled
        elif event_type == 'subscription.disable':
            subscription_code = data.get("subscription_code")

            sub_payment = SubscriptionPayment.objects.filter(
                subscription_code=subscription_code
            ).first()

            if sub_payment:
                sub_payment.is_active = False
                sub_payment.status = "cancelled"
                sub_payment.save()

        return Response({"status": "ok"})