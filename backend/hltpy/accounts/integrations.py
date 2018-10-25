from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import AnonymousUser
from django.http import HttpRequest

from .models import Session, User


def LaravelAuthMiddleware(get_response):
    def middleware(request: HttpRequest):
        cookie = request.COOKIES.get(settings.LARAVEL_SESSION_COOKIE)
        if cookie:
            try:
                session = Session.objects.get(id=cookie)
                user_id = session.extract_user_id()
                user = User.objects.get(id=user_id)
                user.backend = 'hltpy.accounts.integrations.LaravelAuthBackend'
                request.user = user
                return get_response(request)
            except User.DoesNotExist:
                pass
            except Session.DoesNotExist:
                pass

        request.user = AnonymousUser()
        return get_response(request)

    return middleware


class LaravelAuthBackend:
    def authenticate(self, request, laravel_user_id=None):
        if laravel_user_id:
            return self.get_user(laravel_user_id)
        else:
            return None
    
    def get_user(self, user_id):
        try:
            return User.objects.get(id=laravel_user_id)
        except User.DoesNotExist:
            return None
