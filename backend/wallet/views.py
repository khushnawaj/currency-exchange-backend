from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db import transaction as db_transaction

from .models import Wallet
from .serializers import WalletSerializer, WalletTopUpSerializer


@api_view(["GET", "POST"])
def wallet_list_create(request):
    user = request.user

    if request.method == "GET":
        wallets = Wallet.objects.filter(user=user)
        serializer = WalletSerializer(wallets, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        currency = request.data.get("currency")

        if not currency:
            return Response(
                {"error": "Currency is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        wallet, created = Wallet.objects.get_or_create(
            user=user,
            currency=currency.upper()
        )

        if not created:
            return Response(
                {"error": "Wallet already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = WalletSerializer(wallet)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def wallet_delete(request, wallet_id):
    try:
        wallet = Wallet.objects.get(id=wallet_id, user=request.user)
    except Wallet.DoesNotExist:
        return Response(
            {"error": "Wallet not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if wallet.balance > 0:
        return Response(
            {"error": "Cannot delete wallet with balance"},
            status=status.HTTP_400_BAD_REQUEST
        )

    wallet.delete()
    return Response({"message": "Wallet deleted"})

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def wallet_topup(request):
    serializer = WalletTopUpSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    currency = serializer.validated_data["currency"].upper()
    amount = serializer.validated_data["amount"]

    try:
        wallet = Wallet.objects.get(user=request.user, currency=currency)
    except Wallet.DoesNotExist:
        return Response(
            {"error": "Wallet not found"},
            status=status.HTTP_400_BAD_REQUEST
        )

    with db_transaction.atomic():
        wallet.balance += amount
        wallet.save()

    return Response({
        "message": "Wallet topped up successfully",
        "currency": currency,
        "added_amount": amount,
        "new_balance": wallet.balance
    })