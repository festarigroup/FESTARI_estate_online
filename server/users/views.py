from django.contrib.auth import get_user_model
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import OTP
from .serializers import RegisterSerializer, VerifiedTokenSerializer
from .utils import send_otp_email

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

        if serializer.is_valid():
            user = serializer.save()
            otp = user.otps.latest('created_at')

            if user.email:
                send_otp_email(user.email, otp.code)

            return Response(
                {
                    "success": True,
                    "message": "User registered. OTP sent.",
                },
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
            otp = OTP.objects.filter(
                user=user,
                code=code,
                is_used=False
            ).latest('created_at')

            if otp.is_expired():
                return Response(
                    {"error": "OTP expired"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            otp.is_used = True
            otp.save()

            user.is_verified = True
            user.save()

            return Response(
                {
                    "success": True,
                    "message": "Account verified successfully."
                }
            )

        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except OTP.DoesNotExist:
            return Response(
                {"error": "Invalid OTP"},
                status=status.HTTP_400_BAD_REQUEST
            )


class LoginView(TokenObtainPairView):
    serializer_class = VerifiedTokenSerializer



class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {"success": True, "message": "Logged out successfully."},
                status=status.HTTP_205_RESET_CONTENT
            )
        except Exception as e:
            return Response(
                {"error": "Invalid or missing refresh token."},
                status=status.HTTP_400_BAD_REQUEST
            )
