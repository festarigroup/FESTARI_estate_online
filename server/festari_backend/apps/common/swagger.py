from drf_yasg.inspectors import SwaggerAutoSchema
from rest_framework.permissions import AllowAny


class AuthAwareSwaggerAutoSchema(SwaggerAutoSchema):
    """
    Show Swagger lock only on endpoints that require authentication.
    """

    def get_security(self):
        try:
            permissions = self.view.get_permissions()
        except Exception:
            permissions = []

        if any(isinstance(permission, AllowAny) for permission in permissions):
            return []
        return [{"Bearer": []}]
