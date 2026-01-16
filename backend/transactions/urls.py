from django.urls import path
from .views import send_money, transaction_history, analytics, export_transactions

urlpatterns = [
    path("send-money/", send_money),
    path("transactions/", transaction_history),
    path("analytics/", analytics),
    path("export/", export_transactions),
]
