from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Currency

User = get_user_model()

class CurrencyConversionTest(APITestCase):
    def setUp(self):
        # Create test currencies
        self.usd = Currency.objects.create(code='USD', name='US Dollar', rate_to_base=1.0)
        self.inr = Currency.objects.create(code='INR', name='Indian Rupee', rate_to_base=83.0)
        
        # Create test user
        self.user = User.objects.create_user(email='test@example.com', password='testpass')
        self.client.force_authenticate(user=self.user)

    def test_currency_conversion(self):
        url = '/api/convert/'
        data = {
            'from_currency': 'USD',
            'to_currency': 'INR',
            'amount': 10
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['converted_amount'], 830.0)  # 10 * 83
