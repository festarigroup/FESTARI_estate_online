from rest_framework.routers import DefaultRouter
from django.urls import path

from apps.users.views import AuthViewSet, LoginView, ProfileViewSet, RefreshTokenView

router = DefaultRouter()
router.register("auth", AuthViewSet, basename="auth")
router.register("profiles", ProfileViewSet, basename="profiles")

urlpatterns = [
    path("auth/login/", LoginView.as_view(), name="token_obtain_pair"),
    path("auth/refresh/", RefreshTokenView.as_view(), name="token_refresh"),
]
urlpatterns += router.urls
