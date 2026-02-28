from django.db.models import Sum, Count
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from accounts.models import User
from wallet.models import Wallet
from transactions.models import Transaction
from currency.models import Currency
from accounts.serializers import UserSerializer
from transactions.serializers import TransactionSerializer
from currency.serializers import CurrencySerializer

@api_view(['GET'])
@permission_classes([IsAdminUser])
def dashboard_stats(request):
    """Overall system statistics."""
    total_users = User.objects.count()
    total_transactions = Transaction.objects.count()
    
    # Volume across platform
    total_volume = Transaction.objects.aggregate(sum=Sum('amount_sent'))['sum'] or 0
    
    # Balance across all wallets per currency
    wallets_by_currency = Wallet.objects.values('currency').annotate(
        total_balance=Sum('balance'),
        count=Count('id')
    )

    return Response({
        "total_users": total_users,
        "total_transactions": total_transactions,
        "total_volume": round(float(total_volume), 2),
        "wallets_summary": wallets_by_currency,
        "active_currencies": Currency.objects.filter(is_active=True).count()
    })

@api_view(['GET'])
@permission_classes([IsAdminUser])
def user_list(request):
    """List all users."""
    users = User.objects.all().order_by('-created_at')
    serializer = UserSerializer(users, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def transaction_list(request):
    """List all transactions."""
    transactions = Transaction.objects.all().order_by('-created_at')
    serializer = TransactionSerializer(transactions, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def toggle_user_status(request, user_id):
    """Enable or disable a user."""
    try:
        user = User.objects.get(id=user_id)
        if user == request.user:
            return Response({"error": "Cannot disable yourself"}, status=status.HTTP_400_BAD_REQUEST)
        
        user.is_active = not user.is_active
        user.save()
        return Response({"message": f"User {'enabled' if user.is_active else 'disabled'} successfully", "is_active": user.is_active})
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def currency_status(request):
    """Get all currencies and their current rates."""
    currencies = Currency.objects.all().order_by('code')
    serializer = CurrencySerializer(currencies, many=True, context={'request': request})
    return Response(serializer.data)
