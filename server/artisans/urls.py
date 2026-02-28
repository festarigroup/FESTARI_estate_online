from django.urls import path
from .views import ArtisanProfileListCreateView, ArtisanProfileDetailView

urlpatterns = [
    path("", ArtisanProfileListCreateView.as_view(), name="artisan-profiles"),
    path("<int:user_id>/", ArtisanProfileDetailView.as_view(), name="artisan-profile-detail"),
]