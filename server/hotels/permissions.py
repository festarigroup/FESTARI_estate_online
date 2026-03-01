from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsHotelManagerOrAdmin(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        if not request.user or not request.user.is_authenticated:
            return False

        return request.user.role in ["hotel_manager", "admin"]

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        if request.user.role == "admin":
            return True

        return obj.manager == request.user