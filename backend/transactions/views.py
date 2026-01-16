from decimal import Decimal
from django.db import transaction as db_transaction
from django.db.models import Sum, Q
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import logging
import csv

logger = logging.getLogger(__name__)

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

    logger.info(f"Money sent: {sender_user.email} sent {amount} {from_currency.code} to {receiver_user.email}, received {round(converted_amount, 2)} {to_currency.code}")

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

    # Search and filter
    search = request.GET.get('search', '')
    currency_filter = request.GET.get('currency', '')
    type_filter = request.GET.get('type', '')

    transactions = Transaction.objects.filter(
        Q(sender__in=wallets) | Q(receiver__in=wallets)
    )

    if search:
        transactions = transactions.filter(
            Q(sender__user__email__icontains=search) |
            Q(receiver__user__email__icontains=search) |
            Q(from_currency__icontains=search) |
            Q(to_currency__icontains=search)
        )

    if currency_filter:
        transactions = transactions.filter(
            Q(from_currency=currency_filter) | Q(to_currency=currency_filter)
        )

    if type_filter:
        if type_filter == 'sent':
            transactions = transactions.filter(sender__in=wallets)
        elif type_filter == 'received':
            transactions = transactions.filter(receiver__in=wallets)

    transactions = transactions.order_by("-created_at")

    serializer = TransactionSerializer(transactions, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(["GET"])
def analytics(request):
    user = request.user
    wallets = Wallet.objects.filter(user=user)

    total_sent = Transaction.objects.filter(sender__in=wallets).aggregate(
        total=Sum('amount_sent')
    )['total'] or 0

    total_received = Transaction.objects.filter(receiver__in=wallets).aggregate(
        total=Sum('amount_received')
    )['total'] or 0

    transaction_count = Transaction.objects.filter(
        sender__in=wallets
    ) | Transaction.objects.filter(
        receiver__in=wallets
    )
    transaction_count = transaction_count.count()

    return Response({
        "total_sent": total_sent,
        "total_received": total_received,
        "transaction_count": transaction_count,
        "net_balance_change": total_received - total_sent
    })


@api_view(["GET"])
def export_transactions(request):
    user = request.user
    wallets = Wallet.objects.filter(user=user)

    transactions = Transaction.objects.filter(
        Q(sender__in=wallets) | Q(receiver__in=wallets)
    ).order_by("-created_at")

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="transactions.csv"'

    writer = csv.writer(response)
    writer.writerow(['Date', 'Type', 'Amount Sent', 'Currency Sent', 'Amount Received', 'Currency Received', 'From/To'])

    for tx in transactions:
        is_sent = tx.sender.user == user
        tx_type = 'Sent' if is_sent else 'Received'
        amount_sent = tx.amount_sent if is_sent else ''
        currency_sent = tx.from_currency if is_sent else ''
        amount_received = tx.amount_received if not is_sent else ''
        currency_received = tx.to_currency if not is_sent else ''
        counterparty = tx.receiver.user.email if is_sent else tx.sender.user.email

        writer.writerow([
            tx.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            tx_type,
            amount_sent,
            currency_sent,
            amount_received,
            currency_received,
            counterparty
        ])

    return response