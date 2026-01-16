from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


class UserManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)
        user = self.model(email=email)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        user = self.create_user(email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100)
    profile_photo = models.ImageField(
    upload_to="profile_photos/",
    null=True,
    blank=True
)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email


class FavoriteCurrency(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorite_currencies')
    currency_code = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'currency_code')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'currency_code')

    def __str__(self):
        return f"{self.user.email} - {self.currency_code}"
