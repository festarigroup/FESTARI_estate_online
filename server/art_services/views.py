from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from utils.api_response import api_response
from .serializers import ArtisanServiceSerializer


class ArtisanServiceCreateView(generics.CreateAPIView):
    serializer_class = ArtisanServiceSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        profile = getattr(request.user, "artisan_profile", None)

        if not profile:
            return api_response(
                False,
                "Create profile first.",
                status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(artisan=profile)

        return api_response(
            True,
            "Service created successfully.",
            status.HTTP_201_CREATED,
            data=serializer.data
        )