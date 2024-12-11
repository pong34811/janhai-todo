from django.contrib.auth.models import User
from django.contrib.auth import update_session_auth_hash
from rest_framework import viewsets, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.contrib.auth.password_validation import validate_password

# User serializer for registration
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

# Change password serializer
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, write_only=True)

    def validate_new_password(self, value):
        try:
            validate_password(value)
        except Exception as e:
            raise serializers.ValidationError(str(e))
        return value

class CustomPasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("No user is associated with this email address.")
        return value

    def save(self):
        email = self.validated_data['email']
        try:
            user = User.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(force_bytes(user.pk))  # เข้ารหัส user.pk
            token = default_token_generator.make_token(user)  # สร้าง token

            
            reset_url = f"http://127.0.0.1:3000/reset-confirm/{uidb64}/{token}/"

            send_mail(
                "Password Reset Request",
                f"""
                
                We received a request to reset your password for your account. If you made this request, you can reset your password by clicking the link below:

                {reset_url}

                If you did not request to reset your password, you can safely ignore this email. Your password will remain unchanged.

                Best regards,
                The Support Team
                """,
                "no-reply@example.com",
                [user.email],
            )

        except User.DoesNotExist:
            pass  # ถ้าไม่พบผู้ใช้

class PasswordResetConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        # ตรวจสอบ uid และ token
        return attrs

    def save(self):
        user = self.context['user']
        user.set_password(self.validated_data['new_password'])
        user.save()

