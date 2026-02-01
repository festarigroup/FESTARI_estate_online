from rest_framework.permissions import BasePermission


class IsAdminOrEstateManager(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role in ['admin', 'estate_manager']
        )

class IsBuyer(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role == 'buyer'
        )
