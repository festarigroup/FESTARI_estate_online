from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from utils.api_response import api_response
from artisans.models import ArtisanProfile
from .models import ArtisanService
from .serializers import ArtisanServiceSerializer

class CreateArtisanServiceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        profile = getattr(request.user, "artisan_profile", None)
        if not profile:
            return api_response(False, "Create profile first.", 400)

        serializer = ArtisanServiceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(artisan=profile)
            return api_response(True, "Service created successfully.", 201, data=serializer.data)

        return api_response(False, "Validation failed.", 400, errors=serializer.errors)