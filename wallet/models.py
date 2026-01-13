from django.db import models
from django.conf import settings


class Wallet(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="wallets"
    )
    currency = models.CharField(max_length=10)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "currency")

    def __str__(self):
        return f"{self.user.email} - {self.currency}"
