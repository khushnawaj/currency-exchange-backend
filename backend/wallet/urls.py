from django.urls import path
from .views import wallet_list_create, wallet_topup, wallet_delete

urlpatterns = [
    path("wallets/", wallet_list_create),
    path("wallets/topup/", wallet_topup),
    path("wallets/<int:wallet_id>/", wallet_delete),
]
