from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import PasswordResetTokenGenerator

CustomUser = get_user_model()


class AuthTests(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            email="test@example.com",
            password="TestPass123!",
            full_name="Test User"
        )
        self.login_url = reverse('login')
        self.register_url = reverse('register')
        self.logout_url = reverse('logout')
        self.profile_url = reverse('profile')
        self.change_password_url = reverse('change-password')
        self.forgot_password_url = reverse('forgot-password')
        self.reset_password_url = reverse('reset-password')

    def authenticate(self):
        res = self.client.post(self.login_url, {
            "email": "test@example.com",
            "password": "TestPass123!"
        })
        self.token = res.data['tokens']['access']
        self.refresh_token = res.data['tokens']['refresh']
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

    def test_register_user(self):
        data = {
            "email": "new@example.com",
            "password": "NewPass123!",
            "full_name": "New User"
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_login_user(self):
        data = {
            "email": "test@example.com",
            "password": "TestPass123!"
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("tokens", response.data)

    def test_logout_user(self):
        self.authenticate()
        response = self.client.post(self.logout_url, {"refresh": self.refresh_token})
        self.assertEqual(response.status_code, status.HTTP_205_RESET_CONTENT)

    def test_get_profile(self):
        self.authenticate()
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user.email)

    def test_update_profile(self):
        self.authenticate()
        data = {
            "full_name": "Updated Name",
            "bio": "Updated bio"
        }
        response = self.client.put(self.profile_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["full_name"], "Updated Name")

    def test_change_password(self):
        self.authenticate()
        data = {
            "old_password": "TestPass123!",
            "new_password": "NewSecurePass123!"
        }
        response = self.client.post(self.change_password_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], "Password changed successfully.")

    def test_forgot_password(self):
        data = {
            "email": "test@example.com"
        }
        response = self.client.post(self.forgot_password_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("uidb64", response.data)
        self.assertIn("token", response.data)

    def test_reset_password(self):
        uidb64 = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = PasswordResetTokenGenerator().make_token(self.user)
        data = {
            "uidb64": uidb64,
            "token": token,
            "new_password": "ResetPass123!"
        }
        response = self.client.post(self.reset_password_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["detail"], "Password reset successful.")

        # Check if login works with new password
        login_response = self.client.post(self.login_url, {
            "email": "test@example.com",
            "password": "ResetPass123!"
        })
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
