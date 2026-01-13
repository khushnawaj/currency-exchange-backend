from django.urls import path
from .views import login, signup, upload_profile_photo

urlpatterns = [
    path("login/", login),
    path("signup/", signup),
    path("profile-photo/", upload_profile_photo),
]
