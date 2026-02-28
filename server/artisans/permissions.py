from rest_framework.permissions import BasePermission


class IsArtisan(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "artisan"


class IsBuyer(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "buyer"