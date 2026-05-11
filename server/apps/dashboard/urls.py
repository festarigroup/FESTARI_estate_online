from django.urls import path

from apps.dashboard.views import AdminAnalyticsView, HomeSummaryView

urlpatterns = [
    path("admin/analytics/", AdminAnalyticsView.as_view(), name="admin-analytics"),
    path("home/summary/", HomeSummaryView.as_view(), name="home-summary"),
]
