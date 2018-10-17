from django.core.serializers.json import DjangoJSONEncoder
from django.db.models import QuerySet
from django.http import JsonResponse


def render_json(data, **kwargs):
    return JsonResponse(data, encoder=ModelEncoder, **kwargs)


class ModelEncoder(DjangoJSONEncoder):
    def default(self, obj):
        if isinstance(obj, QuerySet):
            return list(obj)
        if hasattr(obj, 'as_json'):
            return super().default(obj.as_json())
        return super().default(obj)


def extract(value, *keys):
    return {key: getattr(value, key) for key in keys}
