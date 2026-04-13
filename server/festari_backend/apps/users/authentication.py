from django.conf import settings
from rest_framework import exceptions
from rest_framework.authentication import CSRFCheck
from rest_framework_simplejwt.authentication import JWTAuthentication


class CookieJWTAuthentication(JWTAuthentication):
    """
    Authenticate using Authorization header first, then HttpOnly access cookie.
    """

    def enforce_csrf(self, request):
        check = CSRFCheck(lambda r: None)
        check.process_request(request)
        reason = check.process_view(request, None, (), {})
        if reason:
            raise exceptions.PermissionDenied(f"CSRF Failed: {reason}")

    def authenticate(self, request):
        header = self.get_header(request)
        if header is not None:
            try:
                return super().authenticate(request)
            except Exception:
                # If header auth fails, don't try cookie
                return None

        raw_token = request.COOKIES.get(settings.JWT_AUTH_COOKIE_ACCESS)
        if raw_token is None:
            return None

        try:
            validated_token = self.get_validated_token(raw_token)
        except Exception:
            # If token validation fails (expired, invalid, etc.), return None for anonymous access
            return None

        if request.method not in ("GET", "HEAD", "OPTIONS", "TRACE"):
            self.enforce_csrf(request)
        return self.get_user(validated_token), validated_token
