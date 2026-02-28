from django.urls import path
from .views import CreateServiceRequestView, MarkServiceCompleteView

urlpatterns = [
    path("services/<int:service_id>/request/", CreateServiceRequestView.as_view()),
    path("requests/<int:request_id>/complete/", MarkServiceCompleteView.as_view()),
]