from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

from .managers import CustomUserManager


# Create your models here.
class CustomUser(AbstractBaseUser, PermissionsMixin):

    name = models.CharField(max_length=100, null=True, blank=True)
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(max_length=100, null=True, blank=True)
    password = models.CharField(max_length=128)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = "username"

    objects = CustomUserManager()

    def __str__(self):
        return self.username
