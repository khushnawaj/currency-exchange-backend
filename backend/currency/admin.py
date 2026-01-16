from django.contrib import admin
from .models import Currency


@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = ("code", "name", "rate_to_base", "is_active")
    list_filter = ("is_active",)
    search_fields = ("code", "name")
