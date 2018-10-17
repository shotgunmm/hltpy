from django.conf import settings
from django.db import models

from ..utils import extract


class Contact(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    first_name = models.CharField(max_length=512)
    last_name = models.CharField(max_length=512)

    state = models.CharField(max_length=64, default='New')

    phone_mobile = models.CharField(max_length=255, blank=True, null=True)
    phone_home = models.CharField(max_length=255, blank=True, null=True)
    phone_work = models.CharField(max_length=255, blank=True, null=True)
    phone_times = models.CharField(max_length=255, blank=True, null=True)

    email_personal = models.CharField(max_length=255, blank=True, null=True)
    email_work = models.CharField(max_length=255, blank=True, null=True)

    address_street = models.CharField(max_length=512, blank=True, null=True)
    address_city = models.CharField(max_length=128, blank=True, null=True)
    address_state = models.CharField(max_length=2, blank=True, null=True)
    address_zip = models.CharField(max_length=5, blank=True, null=True)

    workplace = models.CharField(max_length=255, blank=True, null=True)
    position = models.CharField(max_length=255, blank=True, null=True)

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def as_json(self, events=False):
        result = extract(self, 'id', 'first_name', 'last_name', 'state',
                         'phone_mobile', 'phone_home', 'phone_work',
                         'phone_times', 'email_personal', 'email_work',
                         'address_street', 'address_city', 'address_state', 'address_zip',
                         'workplace', 'position', 'created', 'updated')

        if events:
            result['events'] = [_.as_json() for _ in self.event_set.all()]

        return result


class ContactEvent(models.Model):
    contact = models.ForeignKey(
        Contact, on_delete=models.CASCADE, related_name='event_set')
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    kind = models.CharField(max_length=255)

    field_changed = models.CharField(max_length=255, blank=True, null=True)
    value_before = models.TextField(blank=True, null=True)
    value_after = models.TextField(blank=True, null=True)

    note = models.TextField(blank=True, null=True)

    extra = models.TextField(default='{}')

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def as_json(self):
        return extract(self, 'kind', 'field_changed', 'value_before', 'value_after', 'note', 'created')