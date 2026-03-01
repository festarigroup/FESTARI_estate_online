from django.urls import path

from .views import ForgotPasswordView, LoginView, LogoutView, RegisterView, ResetPasswordView, VerifyOTPView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('verify-otp/', VerifyOTPView.as_view()),
    path('login/', LoginView.as_view()),
    path('logout/', LogoutView.as_view()),
    path("forgot-password/", ForgotPasswordView.as_view()),
    path("reset-password/", ResetPasswordView.as_view()),
]
