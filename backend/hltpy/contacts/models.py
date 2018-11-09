from django.conf import settings
from django.db import models

from ..utils import extract
from ..openhouses.models import OpenHouse


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

    open_house_visit = models.ForeignKey('openhouses.OpenHouse', blank=True, null=True, on_delete=models.SET_NULL)
    agent_name = models.CharField(max_length=512, blank=True, null=True)
    agent_company = models.CharField(max_length=128, blank=True, null=True)
    agent_phone = models.CharField(max_length=100, blank=True, null=True)
    agent_email = models.CharField(max_length=512, blank=True, null=True)

    mortgage_qualified = models.BooleanField(default=False)
    mortgage_broker = models.CharField(max_length=512, blank=True, null=True)
    mortgage_company = models.CharField(max_length=128, blank=True, null=True)

    buyer_name = models.CharField(max_length=512, blank=True, null=True)

    company = models.CharField(max_length=255, blank=True, null=True)
    position = models.CharField(max_length=255, blank=True, null=True)

    deleted = models.BooleanField(default=False)

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    EDITABLE_FIELDS = ['first_name', 'last_name', 'state',
                         'phone_mobile', 'phone_home', 'phone_work',
                         'phone_times', 'email_personal', 'email_work',
                         'address_street', 'address_city', 'address_state', 'address_zip',
                         'agent_name', 'agent_company', 'agent_phone', 'agent_email',
                         'mortgage_qualified', 'mortgage_broker', 'mortgage_company',
                         'buyer_name', 'company', 'position']
    READONLY_FIELDS = ['id', 'created', 'updated']
    
    def as_json(self, events=False):
        fields = self.EDITABLE_FIELDS + self.READONLY_FIELDS
        result = extract(self, *fields)

        if events:
            result['events'] = [_.as_json() for _ in self.event_set.all().order_by('-created')]

        if events and self.open_house_visit_id != None:
            try: 
                result['open_house'] = self.open_house_visit.as_json()
            except OpenHouse.DoesNotExist:
                pass

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
        return extract(self, 'id', 'kind', 'field_changed', 'value_before', 'value_after', 'note', 'created')


class ContactStar(models.Model):
    contact = models.ForeignKey(
        Contact, on_delete=models.CASCADE, related_name='star_set')
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    created = models.DateTimeField(auto_now_add=True)
