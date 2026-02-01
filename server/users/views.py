from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model

from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import RegisterSerializer, VerifiedTokenSerializer
from .models import OTP
from .utils import send_otp_email

User = get_user_model()


class RegisterView(APIView):
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
