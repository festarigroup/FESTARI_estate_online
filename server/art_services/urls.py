from django.urls import path
from .views import ArtisanServiceCreateView

urlpatterns = [
    path("", ArtisanServiceCreateView.as_view()),
]