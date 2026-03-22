from datetime import timedelta
from django.utils import timezone
import random

from django.contrib.auth import get_user_model
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from utils.api_response import api_response
from .models import OTP
from .serializers import RegisterSerializer, VerifiedTokenSerializer
from .utils import send_otp_email, send_password_reset_email
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.db import transaction
from django.conf import settings

User = get_user_model()


class RegisterView(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['username', 'password'],
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING, description='Username', example='john_doe'),
                'password': openapi.Schema(type=openapi.TYPE_STRING, description='Password', example='strongpassword123'),
                'email': openapi.Schema(type=openapi.TYPE_STRING, description='Email', example='john@example.com'),
                'phone_number': openapi.Schema(type=openapi.TYPE_STRING, description='Phone number', example='233244123456'),
            },
        ),
        responses={201: "User registered. OTP sent."}
    )
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return api_response(
                False,
                "Validation failed.",
                status.HTTP_400_BAD_REQUEST,
                errors=serializer.errors
            )

        try:
            with transaction.atomic():
                user = serializer.save()

                code = str(random.randint(1000, 9999))
                otp = OTP.objects.create(
                    user=user,
                    code=code,
                    expires_at=timezone.now() + timedelta(minutes=10)
                )

                if user.email:
                    print("sending email")
                    send_otp_email(user.email, code)
                    print("email sent")

        except Exception as e:
            return api_response(
                False,
                f"Failed to register user: {str(e)}",
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        data = {
            "user_id": user.id,
            "username": user.username,
            "email": user.email,
            "otp_sent": True
        }

        return api_response(True, "User registered. OTP sent.", status.HTTP_201_CREATED, data=data)


class VerifyOTPView(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['username', 'code'],
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING, description='Username'),
                'code': openapi.Schema(type=openapi.TYPE_STRING, description='OTP code (4 digits)'),
            },
        ),
        responses={200: "Account verified successfully."}
    )
    def post(self, request):
        username = request.data.get('username')
        code = request.data.get('code')

        try:
            user = User.objects.get(username=username)
            otp = OTP.objects.filter(user=user, code=code, is_used=False).latest('created_at')

            if otp.is_expired():
                return api_response(False, "OTP expired.", status.HTTP_400_BAD_REQUEST)

            otp.is_used = True
            otp.save()
            user.is_verified = True
            user.save()

            return api_response(True, "Account verified successfully.", status.HTTP_200_OK)

        except User.DoesNotExist:
            return api_response(False, "User not found.", status.HTTP_404_NOT_FOUND)
        except OTP.DoesNotExist:
            return api_response(False, "Invalid OTP.", status.HTTP_400_BAD_REQUEST)


class LoginView(TokenObtainPairView):
    serializer_class = VerifiedTokenSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            data = response.data
            return api_response(True, "Login successful.", status.HTTP_200_OK, data=data)
        return api_response(False, "Invalid credentials.", status.HTTP_401_UNAUTHORIZED, errors=response.data)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        security=[{'Bearer': []}],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['refresh'],
            properties={
                'refresh': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='Refresh token',
                    example='ja9843u52.aks34j7oi7qrk.ajo2is7dru9jlksdf'
                ),
            },
        ),
        responses={205: "Logged out successfully."}
    )
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return api_response(False, "Refresh token is required.", status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist()

            return api_response(True, "Logged out successfully.", status.HTTP_205_RESET_CONTENT)

        except Exception:
            return api_response(False, "Invalid or expired refresh token.", status.HTTP_400_BAD_REQUEST)


class ForgotPasswordView(APIView):

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['email'],
            properties={
                'email': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='Registered email',
                    example='john@example.com'
                ),
            },
        ),
        responses={200: "Password reset link sent."}
    )
    def post(self, request):
        email = request.data.get("email")

        if not email:
            return api_response(False, "Email is required.", status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)

            if not user.is_verified:
                return api_response(False, "Account not verified.", status.HTTP_400_BAD_REQUEST)

            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = PasswordResetTokenGenerator().make_token(user)
            reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"
            send_password_reset_email(user.email, reset_link)

            return api_response(True, "Password reset link sent.", status.HTTP_200_OK)

        except User.DoesNotExist:
            # Do NOT reveal whether email exists (security)
            return api_response(True, "Password reset link sent.", status.HTTP_200_OK)


class ResetPasswordView(APIView):

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['uid', 'token', 'new_password'],
            properties={
                'uid': openapi.Schema(type=openapi.TYPE_STRING),
                'token': openapi.Schema(type=openapi.TYPE_STRING),
                'new_password': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    example="NewStrongPassword123"
                ),
            },
        ),
        responses={200: "Password reset successful."}
    )
    def post(self, request):
        uid = request.data.get("uid")
        token = request.data.get("token")
        new_password = request.data.get("new_password")

        if not all([uid, token, new_password]):
            return api_response(
                False,
                "uid, token and new_password are required.",
                status.HTTP_400_BAD_REQUEST
            )

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)

        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return api_response(False, "Invalid reset link.", status.HTTP_400_BAD_REQUEST)

        if not PasswordResetTokenGenerator().check_token(user, token):
            return api_response(False, "Invalid or expired token.", status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return api_response(True, "Password reset successful.", status.HTTP_200_OK)