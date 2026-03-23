from django.urls import path

from .webhooks import PaystackWebhookView
from .views import InitializePaymentView, SubscribeView, CancelSubscriptionView

urlpatterns = [
    path("initialize/", InitializePaymentView.as_view()),
    path('subscribe/', SubscribeView.as_view(), name='subscribe'),
    path('subscription/cancel/', CancelSubscriptionView.as_view(), name='cancel-subscription'),
    path("webhook/paystack/", PaystackWebhookView.as_view(), name="paystack-webhook"),
]