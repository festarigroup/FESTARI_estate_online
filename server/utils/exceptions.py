from rest_framework.views import exception_handler
from .api_response import api_response

def custom_exception_handler(execption, context):
    response = exception_handler(execption, context)

    if response is not None:
        return api_response(
            False,
            response.data.get("detail", "Request failed."),
            response.status_code,
            errors=response.data
        )

    return response