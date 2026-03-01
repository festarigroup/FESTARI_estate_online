from django.db import transaction, models
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from utils.api_response import api_response
from art_services.models import ArtisanService
from .models import ServiceRequest
from .serializers import ServiceRequestSerializer, EmptySerializer, ServiceRequestUpdateSerializer


class ServiceRequestViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ServiceRequestSerializer
    lookup_field = "id"
    lookup_url_kwarg = "request_id"

    def get_serializer_class(self):
        if self.action in ["partial_update"]:
            return ServiceRequestUpdateSerializer
        return ServiceRequestSerializer

    def get_queryset(self):
        user = self.request.user
        return ServiceRequest.objects.filter(
            is_deleted=False
        ).filter(
            models.Q(buyer=user) |
            models.Q(artisan__user=user)
        ).order_by("-created_at")

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        service_id = request.data.get("service_id")
        if not service_id:
            return api_response(False, "service_id is required.", 400)

        service = get_object_or_404(ArtisanService, id=service_id, is_active=True)

        if not request.user.is_verified:
            return api_response(False, "Account not verified.", 403)

        if ServiceRequest.objects.filter(
            buyer=request.user,
            service=service,
            status=ServiceRequest.PENDING,
            is_deleted=False
        ).exists():
            return api_response(False, "Duplicate pending request.", 400)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        sr = serializer.save(
            service=service,
            artisan=service.artisan,
            buyer=request.user,
            price_snapshot=service.price
        )

        return api_response(True, "Service request created.", status.HTTP_201_CREATED, {"request_id": sr.id})

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return api_response(True, "Requests retrieved.", 200, response.data)

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        return api_response(True, "Request retrieved.", 200, response.data)

    def partial_update(self, request, *args, **kwargs):
        sr = self.get_object()
        new_status = request.data.get("status")
        new_price = request.data.get("price_snapshot")

        # Buyer can update price if request is pending
        if new_price:
            if request.user == sr.buyer and sr.status == ServiceRequest.PENDING:
                sr.price_snapshot = new_price
            else:
                return api_response(False, "Unauthorized to update price.", 403)

        # Status updates
        if new_status:
            # Buyer can cancel
            if request.user == sr.buyer and new_status == ServiceRequest.CANCELLED:
                sr.status = ServiceRequest.CANCELLED
            # Artisan controls workflow
            elif request.user == sr.artisan.user and new_status in [
                ServiceRequest.ACCEPTED,
                ServiceRequest.REJECTED,
                ServiceRequest.IN_PROGRESS,
            ]:
                sr.status = new_status
            else:
                return api_response(False, "Unauthorized status update.", 403)

        sr.save()
        return api_response(True, "Service request updated.", 200, {
            "status": sr.status,
            "price_snapshot": str(sr.price_snapshot)
        })

    @action(detail=True, methods=["post"], serializer_class=EmptySerializer)
    def mark_complete(self, request, request_id=None):
        sr = self.get_object()
        if request.user == sr.buyer:
            sr.buyer_marked_completed = True
        elif request.user == sr.artisan.user:
            sr.artisan_marked_completed = True
        else:
            return api_response(False, "Unauthorized.", 403)

        sr.save()
        sr.finalize_if_ready()
        return api_response(True, "Marked successfully.", 200)

    def destroy(self, request, *args, **kwargs):
        sr = self.get_object()
        if request.user != sr.buyer and request.user != sr.artisan.user:
            return api_response(False, "Unauthorized.", 403)
        sr.is_deleted = True
        sr.save()
        return api_response(True, "Service request deleted.", 200)
