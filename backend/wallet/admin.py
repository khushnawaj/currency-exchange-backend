from django.contrib import admin
from .models import Wallet


@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ("user", "currency", "balance", "created_at")
    list_filter = ("currency",)
