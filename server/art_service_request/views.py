from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from utils.api_response import api_response
from art_services.models import ArtisanService
from .models import ServiceRequest

class CreateServiceRequestView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, service_id):
        service = get_object_or_404(ArtisanService, id=service_id, is_active=True)
        artisan = service.artisan

        if not request.user.is_verified:
            return api_response(False, "Account not verified.", 403)

        if ServiceRequest.objects.filter(buyer=request.user, service=service, status="pending").exists():
            return api_response(False, "Duplicate pending request.", 400)

        sr = ServiceRequest.objects.create(
            service=service,
            artisan=artisan,
            buyer=request.user,
            description=request.data.get("description"),
            price_snapshot=service.price
        )
        return api_response(True, "Service request created.", 201, data={"request_id": sr.id})


class MarkServiceCompleteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, request_id):
        sr = get_object_or_404(ServiceRequest, id=request_id)
        if request.user == sr.buyer:
            sr.buyer_marked_completed = True
        elif request.user == sr.artisan.user:
            sr.artisan_marked_completed = True
        else:
            return api_response(False, "Unauthorized.", 403)

        sr.save()
        sr.finalize_if_ready()
        return api_response(True, "Marked successfully.", 200)