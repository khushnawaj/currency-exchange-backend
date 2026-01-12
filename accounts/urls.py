from django.urls import path
from .views import login, signup

urlpatterns = [
    path("login/", login),
    path("signup/", signup),
]
