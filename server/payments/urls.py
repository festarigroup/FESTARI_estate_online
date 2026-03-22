from django.urls import path
from .views import InitializePaymentView, SubscribeView, VerifyPaymentView

urlpatterns = [
    path("initialize/", InitializePaymentView.as_view()),
    path("verify/<str:reference>/", VerifyPaymentView.as_view()),
    path('subscribe/', SubscribeView.as_view(), name='subscribe'),
]