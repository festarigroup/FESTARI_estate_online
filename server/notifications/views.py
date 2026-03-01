from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status
from utils import api_response
from .models import Subscriber
from .serializers import SubscriberSerializer
from .permissions import IsAdminRole
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


class SubscribeView(APIView):
    permission_classes = [AllowAny]
    @swagger_auto_schema(
        request_body=SubscriberSerializer,
        responses={201: SubscriberSerializer, 400: "Validation failed"}
    )

    def post(self, request):
        serializer = SubscriberSerializer(data=request.data)

        if not serializer.is_valid():
            return api_response(
                False,
                "Validation failed",
                status.HTTP_400_BAD_REQUEST,
                errors=serializer.errors
            )

        email = serializer.validated_data["email"]

        if Subscriber.objects.filter(email=email).exists():
            return api_response(
                True,
                "Already subscribed",
                status.HTTP_200_OK
            )

        serializer.save()

        return api_response(
            True,
            "Subscribed successfully",
            status.HTTP_201_CREATED,
            data=serializer.data
        )



class UnsubscribeView(APIView):
    permission_classes = [AllowAny]
    email_param = openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={"email": openapi.Schema(type=openapi.TYPE_STRING)},
        required=["email"]
    )
    @swagger_auto_schema(
        request_body=email_param,
        responses={200: "Unsubscribed successfully", 404: "Email not found"}
    )

    def delete(self, request):
        email = request.data.get("email")

        if not email:
            return api_response(
                False,
                "Email is required",
                status.HTTP_400_BAD_REQUEST
            )

        subscriber = Subscriber.objects.filter(email=email).first()

        if not subscriber:
            return api_response(
                False,
                "Email not found",
                status.HTTP_404_NOT_FOUND
            )

        subscriber.delete()

        return api_response(
            True,
            "Unsubscribed successfully",
            status.HTTP_200_OK
        )


class GetEmailsView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        subscribers = Subscriber.objects.all()
        serializer = SubscriberSerializer(subscribers, many=True)

        return api_response(
            True,
            "Emails retrieved successfully",
            status.HTTP_200_OK,
            data=serializer.data
        )