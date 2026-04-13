from rest_framework.permissions import BasePermission


class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and (user.is_staff or getattr(user, "role", "") == "admin"))


class IsOwnerOrAdmin(BasePermission):
    owner_field = "owner"

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return getattr(obj, self.owner_field, None) == request.user
