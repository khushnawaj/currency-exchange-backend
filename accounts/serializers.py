from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User


# -------------------------
# LOGIN SERIALIZER
# -------------------------
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        request = self.context.get("request")

        user = authenticate(
            request=request,
            email=data["email"],
            password=data["password"]
        )

        if not user:
            raise serializers.ValidationError("Invalid email or password")

        if not user.is_active:
            raise serializers.ValidationError("User account is disabled")

        data["user"] = user
        return data


# -------------------------
# SIGNUP SERIALIZER
# -------------------------
class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ("email", "full_name", "password")

    def validate_email(self, email):
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email already registered")
        return email

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
        )
        user.full_name = validated_data["full_name"]
        user.save()
        return user
class ProfilePhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("profile_photo",)
