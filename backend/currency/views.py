from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from decimal import Decimal
from rest_framework import status
from .serializers import CurrencyConvertSerializer

from .models import Currency
from .serializers import CurrencySerializer



@api_view(["GET"])
def currency_list(request):
    currencies = Currency.objects.filter(is_active=True)
    serializer = CurrencySerializer(
        currencies,
        many=True,
        context={"request": request}
    )
    return Response(serializer.data)


@api_view(["POST"])
def convert_currency(request):
    serializer = CurrencyConvertSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    from_code = serializer.validated_data["from_currency"].upper()
    to_code = serializer.validated_data["to_currency"].upper()
    amount = serializer.validated_data["amount"]

    try:
        from_currency = Currency.objects.get(code=from_code, is_active=True)
        to_currency = Currency.objects.get(code=to_code, is_active=True)
    except Currency.DoesNotExist:
        return Response(
            {"error": "Invalid currency code"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # conversion logic
    amount_in_base = amount / from_currency.rate_to_base
    converted_amount = amount_in_base * to_currency.rate_to_base

    return Response({
        "from_currency": from_code,
        "to_currency": to_code,
        "original_amount": amount,
        "converted_amount": round(converted_amount, 2)
    })