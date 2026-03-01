from django.urls import path
from .views import SubscribeView, UnsubscribeView, GetEmailsView

urlpatterns = [
    path("subscribe/", SubscribeView.as_view()),
    path("unsubscribe/", UnsubscribeView.as_view()),
    path("emails/", GetEmailsView.as_view()),
]