from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceRequestViewSet

router = DefaultRouter()
router.register("", ServiceRequestViewSet, basename="service-requests")

urlpatterns = [
    path("", include(router.urls)),
]