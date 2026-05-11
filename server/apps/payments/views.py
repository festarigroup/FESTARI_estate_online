import json
import logging
import uuid

from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.views import APIView
from django.utils import timezone
from datetime import timedelta

from apps.common.email_utils import send_email
from apps.common.responses import api_response
from apps.payments.models import Payment
from apps.payments.serializers import PaymentSerializer
from apps.payments.services import PaystackService
from apps.subscriptions.models import SubscriptionPlan, UserSubscription

logger = logging.getLogger(__name__)


def _send_payment_notification(payment, recipient_email, recipient_name, status, message):
    logger.info("Sending payment notification - Payment: %s, Status: %s, Recipient: %s",
                payment.reference, status, recipient_email)
    context = {
        "recipient_name": recipient_name,
        "reference": payment.reference,
        "amount": payment.amount,
        "currency": payment.currency,
        "payment_type": payment.payment_type,
        "status": status,
        "message": message,
        "logo_url": settings.EMAIL_LOGO_URL,
    }
    message_id = f"payment:{payment.reference}:{recipient_email}:{status}"
    send_email(
        subject=f"Festari Payment {status.title()}",
        recipient_list=recipient_email,
        template_name="payments/payment_notification.html",
        context=context,
        background=True,
        message_id=message_id,
    )
    logger.info("Payment notification email queued - Payment: %s", payment.reference)


class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Payment.objects.none()
        user = self.request.user
        if not user or not user.is_authenticated:
            return Payment.objects.none()
        if user.is_staff:
            return Payment.objects.all().order_by("-created_at")
        return Payment.objects.filter(user=user).order_by("-created_at")

    @action(detail=False, methods=["post"], url_path="initiate")
    def initiate(self, request):
        serializer = PaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        reference = f"FESTARI-{uuid.uuid4().hex[:16].upper()}"
        payment = serializer.save(user=request.user, reference=reference, status="pending")
        response = PaystackService.initialize(request.user.email, payment.amount, reference)

        _send_payment_notification(
            payment=payment,
            recipient_email=request.user.email,
            recipient_name=request.user.first_name or request.user.username,
            status="pending",
            message="Your payment request has been received and is pending confirmation.",
        )

        if payment.recipient_email and payment.recipient_email != request.user.email:
            _send_payment_notification(
                payment=payment,
                recipient_email=payment.recipient_email,
                recipient_name=payment.recipient_email,
                status="pending",
                message=f"A payment of {payment.amount} {payment.currency} has been initiated to you.",
            )

        return api_response(True, "Payment initialized", status.HTTP_200_OK, data=response.json())

    @action(detail=False, methods=["post"], url_path="verify")
    def verify(self, request):
        reference = request.data.get("reference")
        if not reference:
            return api_response(False, "reference is required", status.HTTP_400_BAD_REQUEST, errors={"reference": "required"})
        paystack_resp = PaystackService.verify(reference).json()
        payment = Payment.objects.filter(reference=reference).first()
        if payment and paystack_resp.get("data", {}).get("status") == "success":
            payment.status = "success"
            payment.metadata = paystack_resp
            payment.save(update_fields=["status", "metadata"])

            # Handle subscription creation for successful subscription payments
            if payment.payment_type == Payment.PaymentType.SUBSCRIPTION:
                plan_id = payment.metadata.get("plan_id")
                if plan_id:
                    try:
                        plan = SubscriptionPlan.objects.get(id=plan_id)
                        # Calculate end date based on interval
                        if plan.interval == "yearly":
                            end_date = timezone.now() + timedelta(days=365)
                        else:  # monthly
                            end_date = timezone.now() + timedelta(days=30)
                        
                        # Create or update subscription
                        subscription, created = UserSubscription.objects.get_or_create(
                            user=payment.user,
                            defaults={
                                'plan': plan,
                                'end_date': end_date,
                                'is_active': True
                            }
                        )
                        
                        if not created:
                            # Update existing subscription
                            subscription.plan = plan
                            subscription.end_date = end_date
                            subscription.is_active = True
                            subscription.save()
                        
                        logger.info(f"Subscription {'created' if created else 'updated'} for user {payment.user.username} with plan {plan.name}")
                        
                    except SubscriptionPlan.DoesNotExist:
                        logger.error(f"Plan {plan_id} not found for subscription payment {reference}")

            _send_payment_notification(
                payment=payment,
                recipient_email=payment.user.email,
                recipient_name=payment.user.first_name or payment.user.username,
                status="success",
                message="Your payment has been successfully completed.",
            )
            if payment.recipient_email and payment.recipient_email != payment.user.email:
                _send_payment_notification(
                    payment=payment,
                    recipient_email=payment.recipient_email,
                    recipient_name=payment.recipient_email,
                    status="success",
                    message=f"You have received a payment of {payment.amount} {payment.currency}.",
                )

        return api_response(True, "Payment verification completed", status.HTTP_200_OK, data=paystack_resp)


@method_decorator(csrf_exempt, name="dispatch")
class PaymentWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        payload = json.loads(request.body.decode("utf-8"))
        reference = payload.get("data", {}).get("reference")
        payment = Payment.objects.filter(reference=reference).first()
        if payment:
            new_status = payload.get("data", {}).get("status", payment.status)
            payment.status = new_status
            payment.metadata = payload
            payment.save(update_fields=["status", "metadata"])

            if new_status == "success":
                # Handle subscription creation for successful subscription payments
                if payment.payment_type == Payment.PaymentType.SUBSCRIPTION:
                    plan_id = payment.metadata.get("plan_id")
                    if plan_id:
                        try:
                            plan = SubscriptionPlan.objects.get(id=plan_id)
                            # Calculate end date based on interval
                            if plan.interval == "yearly":
                                end_date = timezone.now() + timedelta(days=365)
                            else:  # monthly
                                end_date = timezone.now() + timedelta(days=30)
                            
                            # Create or update subscription
                            subscription, created = UserSubscription.objects.get_or_create(
                                user=payment.user,
                                defaults={
                                    'plan': plan,
                                    'end_date': end_date,
                                    'is_active': True
                                }
                            )
                            
                            if not created:
                                # Update existing subscription
                                subscription.plan = plan
                                subscription.end_date = end_date
                                subscription.is_active = True
                                subscription.save()
                            
                            logger.info(f"Subscription {'created' if created else 'updated'} for user {payment.user.username} with plan {plan.name}")
                            
                        except SubscriptionPlan.DoesNotExist:
                            logger.error(f"Plan {plan_id} not found for subscription payment {reference}")

                _send_payment_notification(
                    payment=payment,
                    recipient_email=payment.user.email,
                    recipient_name=payment.user.first_name or payment.user.username,
                    status="success",
                    message="Your payment has been successfully completed via webhook update.",
                )
                if payment.recipient_email and payment.recipient_email != payment.user.email:
                    _send_payment_notification(
                        payment=payment,
                        recipient_email=payment.recipient_email,
                        recipient_name=payment.recipient_email,
                        status="success",
                        message=f"You have received a payment of {payment.amount} {payment.currency}.",
                    )

        return api_response(True, "Webhook processed", status.HTTP_200_OK)
