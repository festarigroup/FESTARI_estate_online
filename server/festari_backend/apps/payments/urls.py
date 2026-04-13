from django.urls import path
from rest_framework.routers import DefaultRouter

from apps.payments.views import PaymentViewSet, PaymentWebhookView

router = DefaultRouter()
router.register("payments", PaymentViewSet, basename="payments")

urlpatterns = [
    path("payments/webhook/", PaymentWebhookView.as_view(), name="payments-webhook"),
]
urlpatterns += router.urls
