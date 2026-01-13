from django.contrib import admin
from .models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        "sender",
        "receiver",
        "amount_sent",
        "amount_received",
        "from_currency",
        "to_currency",
        "created_at"
    )
