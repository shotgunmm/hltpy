import json

from django.core.serializers.json import DjangoJSONEncoder
from django.db.models import QuerySet
from django.db.models.fields.files import FieldFile
from django.http import HttpRequest, JsonResponse


def render_json(data, **kwargs):
    return JsonResponse(data, encoder=ModelEncoder, **kwargs)

def choice(value, *opts):
    if value in opts:
        return value
    else:
        return opts[0]

def allow_fields(value, *opts):
    return {k: v for k, v in value.items if k in opts}


def JsonBodyMiddleware(get_response):
    def middleware(request: HttpRequest):
        print(repr(request.META))
        if request.META.get('CONTENT_TYPE').split(";")[0] == 'application/json':
            try:
                request.data = json.loads(request.body.decode('utf-8'))
            except Exception as e:
                print(e)
                request.data = None
        else:
            request.data = None

        return get_response(request)

    return middleware


class ModelEncoder(DjangoJSONEncoder):
    def default(self, obj):
        if isinstance(obj, QuerySet):
            return list(obj)
        if isinstance(obj, FieldFile):
            try:
                return obj.url
            except ValueError:
                return None
        if hasattr(obj, 'as_json'):
            return obj.as_json()
        return super().default(obj)


def extract(value, *keys):
    return {key: getattr(value, key) for key in keys}

def parse_bool(value):
    if value in ['true', 'True', True, '1', 'on']:
        return True
    else:
        return False
