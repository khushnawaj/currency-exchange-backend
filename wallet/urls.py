from django.urls import path
from .views import wallet_list_create, wallet_topup

urlpatterns = [
    path("wallets/", wallet_list_create),
    path("wallets/topup/", wallet_topup),
]
