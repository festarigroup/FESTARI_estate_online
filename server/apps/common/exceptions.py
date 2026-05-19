from rest_framework import status
from rest_framework.views import exception_handler

from apps.common.responses import api_response


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        return api_response(False, "Internal server error", status.HTTP_500_INTERNAL_SERVER_ERROR, errors={"detail": str(exc)})
    if isinstance(response.data, dict):
        return api_response(False, "Request failed", response.status_code, errors=response.data)
    return api_response(False, "Request failed", response.status_code, errors={"detail": response.data})
