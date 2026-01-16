import requests
from django.core.management.base import BaseCommand
from currency.models import Currency

class Command(BaseCommand):
    help = 'Update currency rates from external API'

    def handle(self, *args, **options):
        try:
            # Using exchangerate-api.com (free tier)
            response = requests.get('https://api.exchangerate-api.com/v4/latest/USD')
            response.raise_for_status()
            data = response.json()

            rates = data['rates']
            updated_count = 0

            for code, rate in rates.items():
                currency, created = Currency.objects.update_or_create(
                    code=code.upper(),
                    defaults={
                        'rate_to_base': rate,
                        'is_active': True,
                        'name': code.upper()  # Simple name, can be improved
                    }
                )
                if not created:
                    updated_count += 1
                else:
                    self.stdout.write(f'Created currency: {code}')

            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully updated {updated_count} currencies and created {len(rates) - updated_count} new ones'
                )
            )

        except requests.RequestException as e:
            self.stdout.write(
                self.style.ERROR(f'Failed to fetch rates: {e}')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error updating rates: {e}')
            )