from django.conf import settings
from django.db import models

from ..utils import extract


class OpenHouse(models.Model):
    key = models.CharField(max_length=255, unique=True) 
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.DO_NOTHING)

    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)

    date = models.DateField(blank=True, null=True)
    start_time = models.TimeField(blank=True, null=True)
    end_time = models.TimeField(blank=True, null=True)

    list_price = models.DecimalField(max_digits=8, decimal_places=2)
    mls_id = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)
    image = models.ImageField(upload_to='openhouses/images', blank=True, null=True)

    brochure = models.FileField(upload_to='openhouses/brochures', blank=True, null=True)

    deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    EDITABLE_FIELDS = [
        'name', 'address',
        'date', 'start_time', 'end_time',
        'list_price', 'mls_id', 'image',
    ]

    READ_ONLY_FIELDS = [
        'id', 'key', 'user', 'completed', 'deleted',
        'created_at', 'updated_at'
    ]

    def as_json(self):
        return extract(self, *(self.EDITABLE_FIELDS + self.READ_ONLY_FIELDS))

    def kiosk_url(self):
        return "/openhouse/" + self.key
