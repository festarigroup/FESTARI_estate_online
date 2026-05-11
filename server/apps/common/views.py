from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404

from apps.common.models import PropertyInquiry, ArtisanInquiry
from apps.common.serializers import PropertyInquirySerializer, ArtisanInquirySerializer
from apps.common.responses import api_response
from apps.common.permissions import IsAdminRole
from apps.common.email_utils import send_email


class PropertyInquiryViewSet(viewsets.ModelViewSet):
    serializer_class = PropertyInquirySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.role == "admin":
            return PropertyInquiry.objects.all().select_related("user", "property", "property__owner")
        # Property owners can see inquiries for their properties
        return PropertyInquiry.objects.filter(property__owner=user).select_related("user", "property")

    def perform_create(self, serializer):
        inquiry = serializer.save(user=self.request.user)
        
        # Send email notification to property owner
        context = {
            "property_owner_name": inquiry.property.owner.first_name or inquiry.property.owner.username,
            "property_owner_email": inquiry.property.owner.email,
            "property_title": inquiry.property.title,
            "inquirer_name": f"{inquiry.user.first_name} {inquiry.user.last_name}".strip() or inquiry.user.username,
            "inquirer_email": inquiry.contact_email,
            "inquirer_phone": inquiry.contact_phone,
            "subject": inquiry.subject,
            "message": inquiry.message,
            "inquiry_date": inquiry.created_at.strftime("%B %d, %Y at %I:%M %p"),
        }
        
        send_email(
            subject=f"New Property Inquiry: {inquiry.property.title}",
            recipient_list=inquiry.property.owner.email,
            template_name="common/property_inquiry_notification.html",
            context=context,
            background=True,
            message_id=f"property_inquiry:{inquiry.id}"
        )

    @action(detail=True, methods=["post"], url_path="mark-read")
    def mark_read(self, request, pk=None):
        inquiry = self.get_object()
        inquiry.is_read = True
        inquiry.save(update_fields=["is_read"])
        return api_response(True, "Inquiry marked as read", status.HTTP_200_OK)


class ArtisanInquiryViewSet(viewsets.ModelViewSet):
    serializer_class = ArtisanInquirySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.role == "admin":
            return ArtisanInquiry.objects.all().select_related("user", "artisan", "artisan__user")
        # Artisans can see inquiries for their profiles
        return ArtisanInquiry.objects.filter(artisan__user=user).select_related("user", "artisan")

    def perform_create(self, serializer):
        inquiry = serializer.save(user=self.request.user)
        
        # Send email notification to artisan
        context = {
            "artisan_name": inquiry.artisan.user.first_name or inquiry.artisan.user.username,
            "artisan_email": inquiry.artisan.user.email,
            "inquirer_name": f"{inquiry.user.first_name} {inquiry.user.last_name}".strip() or inquiry.user.username,
            "inquirer_email": inquiry.contact_email,
            "inquirer_phone": inquiry.contact_phone,
            "subject": inquiry.subject,
            "message": inquiry.message,
            "inquiry_date": inquiry.created_at.strftime("%B %d, %Y at %I:%M %p"),
        }
        
        send_email(
            subject=f"New Service Inquiry",
            recipient_list=inquiry.artisan.user.email,
            template_name="common/artisan_inquiry_notification.html",
            context=context,
            background=True,
            message_id=f"artisan_inquiry:{inquiry.id}"
        )

    @action(detail=True, methods=["post"], url_path="mark-read")
    def mark_read(self, request, pk=None):
        inquiry = self.get_object()
        inquiry.is_read = True
        inquiry.save(update_fields=["is_read"])
        return api_response(True, "Inquiry marked as read", status.HTTP_200_OK)