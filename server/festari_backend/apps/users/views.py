from datetime import timedelta
import random
import logging
import uuid

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.middleware.csrf import get_token
from django.utils import timezone
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from apps.common.supabase import verify_supabase_jwt
from apps.users.models import OTPVerification
from apps.users.serializers import EmailSerializer, EmptySerializer, OAuthLoginSerializer, RegisterSerializer, ResetPasswordSerializer, UserSerializer, VerifyOTPSerializer
from apps.common.email_utils import send_email
from apps.common.responses import api_response

User = get_user_model()
logger = logging.getLogger(__name__)

def _set_auth_cookies(response, access_token, refresh_token):
    response.set_cookie(
        key=settings.JWT_AUTH_COOKIE_ACCESS,
        value=access_token,
        httponly=settings.JWT_AUTH_COOKIE_HTTP_ONLY,
        secure=settings.JWT_AUTH_COOKIE_SECURE,
        samesite=settings.JWT_AUTH_COOKIE_SAMESITE,
    )
    response.set_cookie(
        key=settings.JWT_AUTH_COOKIE_REFRESH,
        value=refresh_token,
        httponly=settings.JWT_AUTH_COOKIE_HTTP_ONLY,
        secure=settings.JWT_AUTH_COOKIE_SECURE,
        samesite=settings.JWT_AUTH_COOKIE_SAMESITE,
    )


def _clear_auth_cookies(response):
    response.delete_cookie(settings.JWT_AUTH_COOKIE_ACCESS)
    response.delete_cookie(settings.JWT_AUTH_COOKIE_REFRESH)


def _generate_otp():
    return f"{random.randint(0, 999999):06d}"


def _send_otp_email(user, otp_code):
    logger.info("Sending OTP email to user: %s (%s)", user.username, user.email)
    subject = "Festari Account Validation: Your OTP"
    context = {
        "user": {
            "first_name": user.first_name,
            "username": user.username,
            "email": user.email,
        },
        "otp": otp_code,
        "site_name": "Festari Estates",
        "logo_url": settings.EMAIL_LOGO_URL,
        "expiry_minutes": 15,
    }
    message_id = f"send-otp:{user.email}"
    send_email(
        subject=subject,
        recipient_list=user.email,
        template_name="users/verification_email.html",
        context=context,
        background=True,
        message_id=message_id,
    )
    logger.info("OTP email queued for user: %s", user.username)


class AuthViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer
    def get_serializer_class(self):
        if self.action == "register":
            return RegisterSerializer
        elif self.action == "verify_otp":
            return VerifyOTPSerializer
        elif self.action == "resend_otp":
            return EmailSerializer
        elif self.action == "request_password_reset":
            return EmailSerializer
        elif self.action == "reset_password":
            return ResetPasswordSerializer
        elif self.action == "oauth_login":
            return OAuthLoginSerializer
        elif self.action == "logout":
            return EmptySerializer
        return super().get_serializer_class()

    @action(detail=False, methods=["post"])
    async def register(self, request):
        logger.info("User registration attempt - Email: %s", request.data.get("email"))
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        code = _generate_otp()
        expiry = timezone.now() + timedelta(minutes=15)
        OTPVerification.objects.create(user=user, code=code, expires_at=expiry)
        logger.info("OTP created for user: %s - Code: %s", user.username, code)
        _send_otp_email(user, code)

        logger.info("User registration completed - User: %s", user.username)
        return api_response(True, "Registered successfully. Check your email for verification OTP.", status.HTTP_201_CREATED, data=UserSerializer(user).data)

    @action(detail=False, methods=["post"])
    def verify_otp(self, request):
        email = request.data.get("email")
        otp_code = request.data.get("otp")

        if not email or not otp_code:
            return api_response(False, "Email and OTP are required.", status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return api_response(False, "Invalid email or OTP.", status.HTTP_400_BAD_REQUEST)

        if user.is_verified:
            return api_response(True, "Account already verified.", status.HTTP_200_OK)

        otp_instance = OTPVerification.objects.filter(user=user, code=otp_code, is_used=False, expires_at__gte=timezone.now()).order_by("-created_at").first()
        if not otp_instance:
            return api_response(False, "Invalid or expired OTP.", status.HTTP_400_BAD_REQUEST)

        otp_instance.is_used = True
        otp_instance.save(update_fields=["is_used"])

        user.is_verified = True
        user.save(update_fields=["is_verified"])

        return api_response(True, "Account verified successfully.", status.HTTP_200_OK)

    @action(detail=False, methods=["post"])
    def resend_otp(self, request):
        email = request.data.get("email")
        logger.info("OTP resend request - Email: %s", email)
        if not email:
            logger.warning("OTP resend failed - No email provided")
            return api_response(False, "Email is required.", status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            logger.warning("OTP resend failed - User not found: %s", email)
            return api_response(False, "Email not found.", status.HTTP_404_NOT_FOUND)

        if user.is_verified:
            logger.info("OTP resend skipped - User already verified: %s", user.username)
            return api_response(True, "Account already verified.", status.HTTP_200_OK)

        code = _generate_otp()
        expiry = timezone.now() + timedelta(minutes=15)
        OTPVerification.objects.create(user=user, code=code, expires_at=expiry)
        logger.info("New OTP created for user: %s - Code: %s", user.username, code)
        _send_otp_email(user, code)

        logger.info("OTP resend completed for user: %s", user.username)
        return api_response(True, "New OTP sent to your email.", status.HTTP_200_OK)

    @action(detail=False, methods=["post"])
    def request_password_reset(self, request):
        email = request.data.get("email")
        logger.info("Password reset request - Email: %s", email)
        if not email:
            logger.warning("Password reset failed - No email provided")
            return api_response(False, "Email is required.", status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            logger.warning("Password reset failed - User not found: %s", email)
            return api_response(False, "Email not found.", status.HTTP_404_NOT_FOUND)

        token = default_token_generator.make_token(user)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        reset_link = f"{settings.FRONTEND_URL}/reset-password/?uid={uidb64}&token={token}"

        context = {
            "user": {
                "first_name": user.first_name,
                "username": user.username,
                "email": user.email,
            },
            "reset_link": reset_link,
            "logo_url": settings.EMAIL_LOGO_URL,
            "site_name": "Festari Estates",
        }

        message_id = f"password-reset:{user.email}"
        send_email(
            subject="Reset your password",
            recipient_list=user.email,
            template_name="users/password_reset_email.html",
            context=context,
            background=True,
            message_id=message_id,
        )

        logger.info("Password reset email queued for user: %s", user.username)
        return api_response(True, "Password reset instructions have been sent to your email.", status.HTTP_200_OK)

    @action(detail=False, methods=["post"])
    def reset_password(self, request):
        uidb64 = request.data.get("uid")
        token = request.data.get("token")
        new_password = request.data.get("new_password")

        if not uidb64 or not token or not new_password:
            return api_response(False, "uid, token, and new_password are required.", status.HTTP_400_BAD_REQUEST)

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return api_response(False, "Invalid reset token or uid.", status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return api_response(False, "Invalid or expired reset token.", status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save(update_fields=["password"])

        return api_response(True, "Password has been reset successfully.", status.HTTP_200_OK)

    @action(detail=False, methods=["post"])
    def oauth_login(self, request):
        """Authenticate user with OAuth providers (Google/Apple) via Supabase."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        provider = serializer.validated_data["provider"]
        token = serializer.validated_data["token"]

        logger.info(f"OAuth login attempt - Provider: {provider}, Email: checking token")

        # Verify the OAuth token with Supabase
        user_data = verify_supabase_jwt(token)
        if not user_data:
            logger.warning(f"OAuth login failed - Invalid token for provider: {provider}")
            return api_response(
                False, 
                "Invalid or expired OAuth token", 
                status.HTTP_401_UNAUTHORIZED
            )

        # Extract user information from Supabase response
        email = user_data.get("email")
        if not email:
            logger.warning(f"OAuth login failed - No email in response for provider: {provider}")
            return api_response(
                False, 
                "Email not found in OAuth response", 
                status.HTTP_400_BAD_REQUEST
            )

        logger.info(f"OAuth login - Processing user: {email} via {provider}")

        # Check if user exists, create if not
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "username": email.split("@")[0] + "_" + str(uuid.uuid4().hex[:8]),
                "first_name": user_data.get("user_metadata", {}).get("full_name", "").split()[0] if user_data.get("user_metadata", {}).get("full_name") else "",
                "last_name": " ".join(user_data.get("user_metadata", {}).get("full_name", "").split()[1:]) if user_data.get("user_metadata", {}).get("full_name") and len(user_data.get("user_metadata", {}).get("full_name").split()) > 1 else "",
                "is_verified": True,  # OAuth users are pre-verified
            }
        )

        if created:
            logger.info(f"New OAuth user created: {user.email} via {provider}")
        else:
            logger.info(f"Existing OAuth user logged in: {user.email} via {provider}")

        # Generate JWT tokens for the user
        from rest_framework_simplejwt.tokens import RefreshToken

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response_data = {
            "user": UserSerializer(user).data,
            "tokens": {
                "access": access_token,
                "refresh": refresh_token,
            },
            "provider": provider,
            "created": created,
        }

        response = api_response(
            True, 
            f"Successfully authenticated with {provider}", 
            status.HTTP_200_OK, 
            data=response_data
        )
        
        # Set auth cookies
        _set_auth_cookies(response, access_token, refresh_token)
        
        return response

    @action(detail=False, methods=["get"])
    def csrf(self, request):
        csrf_token = get_token(request)
        return api_response(True, "CSRF token issued", status.HTTP_200_OK, data={"csrfToken": csrf_token})

    @action(detail=False, methods=["post"], permission_classes=[permissions.AllowAny])
    def logout(self, request):
        response = api_response(True, "Logged out successfully", status.HTTP_200_OK)
        _clear_auth_cookies(response)
        return response


class ProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return User.objects.none()
        user = self.request.user
        if not user or not user.is_authenticated:
            return User.objects.none()
        if user.is_staff or user.role == User.Roles.ADMIN:
            return User.objects.all().order_by("-id")
        return User.objects.filter(id=user.id)

    def update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return super().update(request, *args, **kwargs)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "email"

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        if not user.is_verified:
            raise AuthenticationFailed("Account not activated. Please verify your email before logging in.")
        return data


class LoginView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tokens = serializer.validated_data
        response = api_response(True, "Login successful", status.HTTP_200_OK, data={"detail": "Logged in successfully"})
        _set_auth_cookies(response, tokens["access"], tokens["refresh"])
        return response


class RefreshTokenView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get("refresh") or request.COOKIES.get(settings.JWT_AUTH_COOKIE_REFRESH)
        serializer = TokenRefreshSerializer(data={"refresh": refresh_token})
        serializer.is_valid(raise_exception=True)
        tokens = serializer.validated_data
        response = api_response(True, "Token refreshed", status.HTTP_200_OK, data={"detail": "Session refreshed."})
        new_refresh = tokens.get("refresh", refresh_token)
        _set_auth_cookies(response, tokens["access"], new_refresh)
        return response
