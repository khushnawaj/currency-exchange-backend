from decimal import Decimal
from django.db import transaction as db_transaction
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from accounts.models import User
from wallet.models import Wallet
from currency.models import Currency
from .models import Transaction
from .serializers import SendMoneySerializer, TransactionSerializer


@api_view(["POST"])
def send_money(request):
    serializer = SendMoneySerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    sender_user = request.user
    data = serializer.validated_data

    try:
        sender_wallet = Wallet.objects.get(
            user=sender_user,
            currency=data["from_currency"].upper()
        )
    except Wallet.DoesNotExist:
        return Response(
            {"error": "Sender wallet not found"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        receiver_user = User.objects.get(email=data["receiver_email"])
        receiver_wallet = Wallet.objects.get(
            user=receiver_user,
            currency=data["to_currency"].upper()
        )
    except (User.DoesNotExist, Wallet.DoesNotExist):
        return Response(
            {"error": "Receiver wallet not found"},
            status=status.HTTP_400_BAD_REQUEST
        )

    amount = data["amount"]

    if sender_wallet.balance < amount:
        return Response(
            {"error": "Insufficient balance"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # get currency rates
    from_currency = Currency.objects.get(code=data["from_currency"].upper())
    to_currency = Currency.objects.get(code=data["to_currency"].upper())

    # conversion
    amount_in_base = amount / from_currency.rate_to_base
    converted_amount = amount_in_base * to_currency.rate_to_base

    # atomic DB transaction
    with db_transaction.atomic():
        sender_wallet.balance -= amount
        receiver_wallet.balance += converted_amount

        sender_wallet.save()
        receiver_wallet.save()

        Transaction.objects.create(
            sender=sender_wallet,
            receiver=receiver_wallet,
            amount_sent=amount,
            amount_received=round(converted_amount, 2),
            from_currency=from_currency.code,
            to_currency=to_currency.code
        )

    return Response({
        "message": "Money sent successfully",
        "sent": amount,
        "received": round(converted_amount, 2),
        "to": receiver_user.email
    })

@api_view(["GET"])
def transaction_history(request):
    user = request.user

    wallets = Wallet.objects.filter(user=user)

    transactions = Transaction.objects.filter(
        sender__in=wallets
    ) | Transaction.objects.filter(
        receiver__in=wallets
    )

    transactions = transactions.order_by("-created_at")

    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data)