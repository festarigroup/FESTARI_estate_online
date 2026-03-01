from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q

from .models import ArtisanProfile
from .serializers import ArtisanProfileSerializer
from utils.pagination import PageLimitPagination
from utils.api_response import api_response


class ArtisanProfileListCreateView(generics.ListCreateAPIView):
    queryset = ArtisanProfile.objects.all()
    serializer_class = ArtisanProfileSerializer
    pagination_class = PageLimitPagination

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = ArtisanProfile.objects.all()

        username = self.request.query_params.get("username")
        business_name = self.request.query_params.get("business_name")
        service = self.request.query_params.get("service")
        min_rating = self.request.query_params.get("min_rating")
        available = self.request.query_params.get("is_available")
        ordering = self.request.query_params.get("ordering")

        if username:
            queryset = queryset.filter(user__username__icontains=username)

        if business_name:
            queryset = queryset.filter(business_name__icontains=business_name)

        if service:
            queryset = queryset.filter(
                services__name__icontains=service,
                services__is_active=True
            ).distinct()

        if min_rating:
            queryset = queryset.filter(rating__gte=float(min_rating))

        if available is not None:
            queryset = queryset.filter(
                is_available=available.lower() in ["true", "1"]
            )

        if ordering:
            queryset = queryset.order_by(ordering)
        else:
            queryset = queryset.order_by("-total_jobs_completed")

        return queryset

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return api_response(
            True,
            "Artisans retrieved successfully.",
            status.HTTP_200_OK,
            data=response.data
        )

    def create(self, request, *args, **kwargs):
        if hasattr(request.user, "artisan_profile"):
            return api_response(
                False,
                "Profile already exists.",
                status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)

        return api_response(
            True,
            "Profile created.",
            status.HTTP_201_CREATED,
            data=serializer.data
        )


class ArtisanProfileDetailView(generics.RetrieveUpdateAPIView):
    queryset = ArtisanProfile.objects.all()
    serializer_class = ArtisanProfileSerializer
    permission_classes = [AllowAny]
    lookup_field = "user_id"

    def update(self, request, *args, **kwargs):
        profile = self.get_object()

        if request.user.role != "admin":
            return api_response(
                False,
                "Unauthorized.",
                status.HTTP_403_FORBIDDEN
            )

        partial = kwargs.pop("partial", True)
        serializer = self.get_serializer(
            profile,
            data=request.data,
            partial=partial
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return api_response(
            True,
            "Profile updated.",
            status.HTTP_200_OK,
            data=serializer.data
        )