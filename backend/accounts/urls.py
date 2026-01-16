from django.urls import path
from .views import login, signup, upload_profile_photo, user_detail, favorite_currencies

urlpatterns = [
    path("login/", login),
    path("signup/", signup),
    path("profile-photo/", upload_profile_photo),
    path("profile/", user_detail),
    path("favorites/", favorite_currencies),
]
