from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
import hmac, hashlib
from .models import SubscriptionPayment, Subscription

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

        if event_type == 'subscription.create':
            # Optional logging
            pass

        elif event_type == 'subscription.update':
            ref = data.get('reference')
            try:
                payment = SubscriptionPayment.objects.get(reference=ref)
                if payment.status != 'success':
                    payment.status = 'success'
                    payment.save()

                # Update or create subscription
                subscription, created = Subscription.objects.get_or_create(user=payment.user)
                subscription.plan = payment.subscription_plan
                subscription.next_billing_date = data.get('next_payment_date')  # if Paystack provides it
                subscription.save()
            except SubscriptionPayment.DoesNotExist:
                pass  # maybe log this

        elif event_type == 'subscription.disable':
            ref = data.get('reference')
            try:
                payment = SubscriptionPayment.objects.get(reference=ref)
                payment.status = 'failed'
                payment.save()
            except SubscriptionPayment.DoesNotExist:
                pass

        return Response({"status": "ok"})