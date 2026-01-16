from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Wallet

User = get_user_model()

class WalletTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='test@example.com', password='testpass')
        self.client.force_authenticate(user=self.user)

    def test_create_wallet(self):
        url = '/api/wallets/'
        data = {'currency': 'USD'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Wallet.objects.count(), 1)
        self.assertEqual(Wallet.objects.get().currency, 'USD')

    def test_list_wallets(self):
        Wallet.objects.create(user=self.user, currency='USD')
        url = '/api/wallets/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
