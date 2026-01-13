from django.db import models


class Currency(models.Model):
    code = models.CharField(max_length=10, unique=True)   # INR, USD
    name = models.CharField(max_length=50)                # Indian Rupee
    rate_to_base = models.DecimalField(
        max_digits=10,
        decimal_places=4,
        help_text="Conversion rate relative to base currency"
    )
    logo = models.ImageField(upload_to="currency_logos/")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.code} - {self.name}"
