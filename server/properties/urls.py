from django.urls import path

from .views import (PropertyDetailView, PropertyListCreateView,
                    WishlistCreateView, WishlistDeleteView, WishlistListView)

urlpatterns = [
    path('', PropertyListCreateView.as_view()),
    path('<int:pk>/', PropertyDetailView.as_view()),

    # Wishlist
    path('wishlist/', WishlistListView.as_view(), name='wishlist-list'),
    path('wishlist/add/', WishlistCreateView.as_view(), name='wishlist-add'),
    path('wishlist/<int:pk>/', WishlistDeleteView.as_view(), name='wishlist-delete'),
]
