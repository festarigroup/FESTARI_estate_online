from rest_framework.response import Response

def api_response(success, message, status_code, data=None, errors=None):
    response = {
        "success": success,
        "status": status_code,
        "message": message,
    }
    if success and data is not None:
        response["data"] = data
    if not success and errors is not None:
        response["errors"] = errors
    return Response(response, status=status_code)