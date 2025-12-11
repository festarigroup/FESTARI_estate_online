from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['GET'])
def getExample(request):
    example = {'name': 'John', 'age': 50}
    return Response(example)