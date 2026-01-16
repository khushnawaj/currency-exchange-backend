from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class AuthTest(APITestCase):
    def test_signup(self):
        url = '/api/signup/'
        data = {
            'email': 'newuser@example.com',
            'full_name': 'New User',
            'password': 'password123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)

    def test_login(self):
        User.objects.create_user(email='user@example.com', password='password123')
        url = '/api/login/'
        data = {'email': 'user@example.com', 'password': 'password123'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
