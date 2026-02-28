from django.urls import path
from . import views

urlpatterns = [
    path("stats/", views.dashboard_stats, name="admin-dashboard-stats"),
    path("users/", views.user_list, name="admin-user-list"),
    path("transactions/", views.transaction_list, name="admin-transaction-list"),
    path("users/<int:user_id>/toggle-status/", views.toggle_user_status, name="admin-toggle-user-status"),
    path("currencies/", views.currency_status, name="admin-currency-status"),
]
