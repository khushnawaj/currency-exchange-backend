from django.db import models
from django.conf import settings
from wallet.models import Wallet


class Transaction(models.Model):
    sender = models.ForeignKey(
        Wallet,
        on_delete=models.CASCADE,
        related_name="sent_transactions"
    )
    receiver = models.ForeignKey(
        Wallet,
        on_delete=models.CASCADE,
        related_name="received_transactions"
    )
    amount_sent = models.DecimalField(max_digits=12, decimal_places=2)
    amount_received = models.DecimalField(max_digits=12, decimal_places=2)
    from_currency = models.CharField(max_length=10)
    to_currency = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.user.email} → {self.receiver.user.email}"
