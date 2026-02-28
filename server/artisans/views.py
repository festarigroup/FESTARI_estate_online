from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from utils.pagination import PageLimitPagination
from utils.api_response import api_response
from .models import ArtisanProfile
from django.db import models
from .serializers import ArtisanProfileSerializer

class ArtisanProfileListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        queryset = ArtisanProfile.objects.all()

        username = request.GET.get("username")
        business_name = request.GET.get("business_name")
        service = request.GET.get("service")
        min_rating = request.GET.get("min_rating")
        available = request.GET.get("is_available")

        if username:
            queryset = queryset.filter(user__username__icontains=username)
        if business_name:
            queryset = queryset.filter(business_name__icontains=business_name)
        if service:
            queryset = queryset.filter(services__name__icontains=service, services__is_active=True).distinct()
        if min_rating:
            queryset = queryset.filter(rating__gte=float(min_rating))
        if available:
            queryset = queryset.filter(is_available=available.lower() in ["true", "1"])
            
        ordering = request.GET.get("ordering")
        if ordering:
            queryset = queryset.order_by(ordering)
        else:
            queryset = queryset.order_by("-total_jobs_completed")
        paginator = PageLimitPagination()
        page = paginator.paginate_queryset(queryset, request)
        serializer = ArtisanProfileSerializer(page, many=True)
        paginated_data = paginator.get_paginated_response(serializer.data)
        return api_response(True, "Artisans retrieved successfully.", status.HTTP_200_OK, data=paginated_data)

    def post(self, request):
        if hasattr(request.user, "artisan_profile"):
            return api_response(False, "Profile already exists.", status.HTTP_400_BAD_REQUEST)
        serializer = ArtisanProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return api_response(True, "Profile created.", status.HTTP_201_CREATED, data=serializer.data)
        return api_response(False, "Validation failed.", status.HTTP_400_BAD_REQUEST, errors=serializer.errors)

    def put(self, request):
        profile = getattr(request.user, "artisan_profile", None)
        if not profile:
            return api_response(False, "Profile not found.", status.HTTP_404_NOT_FOUND)
        serializer = ArtisanProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return api_response(True, "Profile updated.", status.HTTP_200_OK, data=serializer.data)
        return api_response(False, "Validation failed.", status.HTTP_400_BAD_REQUEST, errors=serializer.errors)


class ArtisanProfileDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        profile = get_object_or_404(ArtisanProfile, user_id=user_id)
        serializer = ArtisanProfileSerializer(profile)
        return api_response(True, "Artisan retrieved successfully.", status.HTTP_200_OK, data=serializer.data)

    def put(self, request, user_id):
        profile = get_object_or_404(ArtisanProfile, user_id=user_id)
        if request.user.role != "admin":
            return api_response(False, "Unauthorized.", status.HTTP_403_FORBIDDEN)
        serializer = ArtisanProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return api_response(True, "Profile updated.", status.HTTP_200_OK, data=serializer.data)
        return api_response(False, "Validation failed.", status.HTTP_400_BAD_REQUEST, errors=serializer.errors)