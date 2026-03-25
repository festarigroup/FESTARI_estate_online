from django.urls import path

from apps.dashboard.views import AdminAnalyticsView

urlpatterns = [
    path("admin/analytics/", AdminAnalyticsView.as_view(), name="admin-analytics"),
]
