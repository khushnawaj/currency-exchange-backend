from django.urls import path
from .views import send_money, transaction_history

urlpatterns = [
    path("send-money/", send_money),
    path("transactions/", transaction_history),
]
