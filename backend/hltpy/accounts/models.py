import base64

import phpserialize
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

from ..utils import extract


def php_object_hook(_name, data):
    return dict(**data)

class UserManager(BaseUserManager):
    def create_user(self, **kwargs):
        raise NotImplementedError

    def create_superuser(self, **kwargs):
        raise NotImplementedError


class User(models.Model):
    username = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(unique=True, max_length=255)
    password = models.CharField(max_length=255)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    confirmation_code = models.CharField(max_length=255)
    remember_token = models.CharField(max_length=255, blank=True, null=True)
    confirmed = models.IntegerField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)

    def as_json(self):
        return extract(self, 'email', 'id', 'first_name', 'last_name')

    #
    # Django Auth module compatibility functions
    #
    objects = UserManager()

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['password']

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

    @property
    def is_active(self):
        return self.confirmed

    def get_short_name(self):
        return self.first_name

    def get_full_name(self):
        return "{} {}".format(self.first_name, self.last_name)


    class Meta:
        managed = False
        db_table = 'users'



class Session(models.Model):
    id = models.CharField(unique=True, max_length=255, primary_key=True)
    payload = models.TextField()
    last_activity = models.IntegerField()

    def extract_user_id(self):
        session = phpserialize.loads(base64.b64decode(self.payload), object_hook=php_object_hook, decode_strings=True)
        for key, value in session.items():
            if key.startswith("login_"):
                return value

        return None

    class Meta:
        managed = False
        db_table = 'sessions'
