from django.urls import path
from .views import currency_list, convert_currency

urlpatterns = [
    path("currencies/", currency_list),
    path("convert/", convert_currency),
]
