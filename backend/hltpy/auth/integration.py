from django.conf import settings
from django.contrib.auth import authenticate
from django.http import HttpRequest

from .models import Session, User


def LaravelAuthMiddleware(get_response):
    def middleware(request: HttpRequest):
        cookie = request.COOKIES.get(settings.LARAVEL_SESSION_COOKIE)
        if cookie:
            try:
                session = Session.objects.get(id=cookie)
                user_id = session.extract_user_id()
                request.user = authenticate(request, laravel_user_id=user_id)
            except Session.DidNotExist:
                pass

        return get_response(request)


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
