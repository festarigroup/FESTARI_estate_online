from django.urls import path
from .views import CreateArtisanServiceView

urlpatterns = [
    path("", CreateArtisanServiceView.as_view()),
]