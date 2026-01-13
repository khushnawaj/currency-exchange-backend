from rest_framework import serializers
from .models import Transaction


class SendMoneySerializer(serializers.Serializer):
    receiver_email = serializers.EmailField()
    from_currency = serializers.CharField()
    to_currency = serializers.CharField()
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)

class TransactionSerializer(serializers.ModelSerializer):
    sender_email = serializers.CharField(source="sender.user.email", read_only=True)
    receiver_email = serializers.CharField(source="receiver.user.email", read_only=True)

    class Meta:
        model = Transaction
        fields = (
            "id",
            "sender_email",
            "receiver_email",
            "amount_sent",
            "amount_received",
            "from_currency",
            "to_currency",
            "created_at",
        )