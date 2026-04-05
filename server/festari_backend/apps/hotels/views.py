from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework import serializers

from apps.common.constants import (
    DEFAULT_FILE_SIZE_MB,
    DEFAULT_IMAGE_LIMIT,
    DEFAULT_VIDEO_LIMIT,
    IMAGE_EXTENSIONS,
    VIDEO_EXTENSIONS,
)
from apps.common.responses import api_response
from apps.common.supabase import (
    delete_media_file,
    get_media_path_from_url,
    upload_media_file,
)
from apps.common.tasks import delete_supabase_media_file_task
from apps.hotels.models import Hotel, HotelBooking
from apps.hotels.serializers import HotelBookingSerializer, HotelSerializer


class HotelViewSet(viewsets.ModelViewSet):
    queryset = Hotel.objects.all().order_by("-created_at")
    serializer_class = HotelSerializer
    parser_classes = [MultiPartParser, FormParser]
    filterset_fields = ("location", "status")
    search_fields = ("name", "description", "location")
    ordering_fields = ("nightly_rate", "created_at")

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def _is_admin(self):
        user = self.request.user
        return user.is_staff or getattr(user, "role", None) == "admin"

    def _verify_owner(self, obj):
        if obj.manager != self.request.user and not self._is_admin():
            self.permission_denied(self.request)

    def perform_create(self, serializer):
        user = self.request.user
        # Check if user has hotel subscription
        subscription = getattr(user, "subscription", None)
        if not (subscription and subscription.is_active and subscription.plan.is_hotel_plan):
            raise serializers.ValidationError("Hotel subscription required to create hotel")
        # Check hotel limit
        current_hotels = Hotel.objects.filter(manager=user).count()
        if current_hotels >= subscription.plan.max_hotels:
            raise serializers.ValidationError(f"Hotel limit reached ({subscription.plan.max_hotels})")
        serializer.save(manager=user)

    def perform_update(self, serializer):
        instance = self.get_object()
        old_media = set(instance.media_urls or [])
        new_media = set(serializer.validated_data.get("media_urls", old_media))
        removed_media = old_media - new_media
        if removed_media:
            for media_url in removed_media:
                try:
                    path = get_media_path_from_url(media_url)
                    delete_supabase_media_file_task.delay(path)
                except ValueError:
                    continue
        serializer.save()

    def perform_destroy(self, instance):
        self._verify_owner(instance)
        super().perform_destroy(instance)

    @action(detail=True, methods=["post"], url_path="upload-media")
    def upload_media(self, request, pk=None):
        obj = self.get_object()
        self._verify_owner(obj)

        # Check subscription limits
        user = request.user
        subscription = getattr(user, "subscription", None)
        if subscription and subscription.is_active and subscription.plan.is_hotel_plan:
            plan = subscription.plan
            current_images = sum(1 for url in (obj.media_urls or []) if url.lower().endswith(IMAGE_EXTENSIONS))
            current_videos = sum(1 for url in (obj.media_urls or []) if url.lower().endswith(VIDEO_EXTENSIONS))
            if current_images >= plan.max_images:
                return api_response(False, f"Image limit reached ({plan.max_images})", status.HTTP_400_BAD_REQUEST)
            if current_videos >= plan.max_videos:
                return api_response(False, f"Video limit reached ({plan.max_videos})", status.HTTP_400_BAD_REQUEST)
        else:
            # Default limits for non-subscribed users
            current_images = sum(1 for url in (obj.media_urls or []) if url.lower().endswith(IMAGE_EXTENSIONS))
            current_videos = sum(1 for url in (obj.media_urls or []) if url.lower().endswith(VIDEO_EXTENSIONS))
            if current_images >= DEFAULT_IMAGE_LIMIT:  # Default
                return api_response(False, f"Image limit reached ({DEFAULT_IMAGE_LIMIT})", status.HTTP_400_BAD_REQUEST)
            if current_videos >= DEFAULT_VIDEO_LIMIT:  # Default
                return api_response(False, f"Video limit reached ({DEFAULT_VIDEO_LIMIT})", status.HTTP_400_BAD_REQUEST)

        media_file = request.FILES.get("file")
        if not media_file:
            return api_response(False, "File is required.", status.HTTP_400_BAD_REQUEST)

        # Check file size
        max_size = DEFAULT_FILE_SIZE_MB * 1024 * 1024  # Default 5MB
        if subscription and subscription.is_active and subscription.plan.is_hotel_plan:
            plan = subscription.plan
            max_size = plan.max_image_size_mb * 1024 * 1024 if media_file.content_type.startswith('image/') else plan.max_video_size_mb * 1024 * 1024
        if media_file.size > max_size:
            return api_response(False, f"File size exceeds limit ({max_size // (1024*1024)}MB)", status.HTTP_400_BAD_REQUEST)

        old_url = request.data.get("old_url")
        upload_result = upload_media_file(media_file, "hotels", str(obj.id))
        if not upload_result.get("success"):
            return api_response(False, upload_result.get("error", "Upload failed."), status.HTTP_400_BAD_REQUEST)

        media_urls = obj.media_urls or []
        if old_url and old_url in media_urls:
            media_urls.remove(old_url)
        if upload_result["public_url"] not in media_urls:
            media_urls.append(upload_result["public_url"])
        obj.media_urls = media_urls
        obj.save(update_fields=["media_urls"])

        if old_url:
            try:
                old_path = get_media_path_from_url(old_url)
                delete_media_file(old_path)
            except ValueError:
                pass

        return api_response(
            True,
            "Hotel media uploaded successfully.",
            status.HTTP_201_CREATED,
            data={
                "url": upload_result["public_url"],
                "path": upload_result["path"],
            },
        )

    @action(detail=True, methods=["delete"], url_path="delete-media")
    def delete_media(self, request, pk=None):
        obj = self.get_object()
        self._verify_owner(obj)

        media_url = request.data.get("url") or request.query_params.get("url")
        if not media_url:
            return api_response(False, "url is required.", status.HTTP_400_BAD_REQUEST)

        if media_url not in (obj.media_urls or []):
            return api_response(False, "Media URL does not belong to this hotel.", status.HTTP_400_BAD_REQUEST)

        try:
            path = get_media_path_from_url(media_url)
        except ValueError:
            return api_response(False, "Unable to parse media path.", status.HTTP_400_BAD_REQUEST)

        delete_result = delete_media_file(path)
        if not delete_result.get("success"):
            return api_response(False, delete_result.get("error", "Delete failed."), status.HTTP_400_BAD_REQUEST)

        obj.media_urls = [url for url in (obj.media_urls or []) if url != media_url]
        obj.save(update_fields=["media_urls"])
        return api_response(True, "Hotel media deleted.", status.HTTP_200_OK, data={"url": media_url})


class HotelBookingViewSet(viewsets.ModelViewSet):
    serializer_class = HotelBookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return HotelBooking.objects.none()
        if not self.request.user.is_authenticated:
            return HotelBooking.objects.none()
        return HotelBooking.objects.filter(user=self.request.user).select_related("hotel")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
