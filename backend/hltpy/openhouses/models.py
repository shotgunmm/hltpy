from django.conf import settings
from django.db import models

from ..utils import extract


class OpenHouse(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.DO_NOTHING)
    name = models.CharField(max_length=255)
    when = models.DateField()
    associates = models.CharField(max_length=255)
    slug = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    start = models.TimeField()
    end = models.TimeField()
    agents = models.TextField()
    members = models.TextField()
    files = models.TextField()
    mls_id = models.CharField(max_length=255)
    completed = models.IntegerField()
    list_price = models.DecimalField(max_digits=8, decimal_places=2)
    mls = models.CharField(db_column='MLS', max_length=255)  # Field name made lowercase.
    image = models.CharField(max_length=255)
    deleted = models.IntegerField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'open_houses'

    def as_json(self):
        return extract(self, 'id', 'image', 'name', 'when', 'address', 'start', 'end', 'list_price')
