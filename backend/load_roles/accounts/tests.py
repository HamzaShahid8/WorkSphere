from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class SignupApiTests(APITestCase):
    def test_register_creates_employee(self):
        res = self.client.post(
            '/accounts/register/',
            {
                'username': 'newhire',
                'email': 'new@example.com',
                'password': 'securepass1',
                'password_confirm': 'securepass1',
            },
            format='json',
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        u = User.objects.get(username='newhire')
        self.assertEqual(u.role, 'employee')

    def test_register_password_mismatch(self):
        res = self.client.post(
            '/accounts/register/',
            {
                'username': 'x',
                'email': 'x@example.com',
                'password': 'securepass1',
                'password_confirm': 'other',
            },
            format='json',
        )
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
