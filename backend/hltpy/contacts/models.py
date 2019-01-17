from django.conf import settings
from django.db import models
from django.db.models import Q
from django.utils import timezone

from ..openhouses.models import OpenHouse
from ..utils import extract


class ContactManager(models.Manager):
    def match_query(self, query):
        qs = self.get_queryset()
        q_chain = None

        for field in Contact.SEARCH_FIELDS:
            field_name = field + '__icontains'
            filter = {field_name: query}

            if q_chain:
                q_chain = q_chain | Q(**filter)
            else:
                q_chain = Q(**filter)
        
        return qs.filter(q_chain)

    def get_for_user(self, id, user):
        contact = self.get_queryset().get(id=id)
        if contact.owner == user:
            return contact
        elif contact.team_member_set.filter(user=user).exists():
            return contact
        else:
            raise Contact.DoesNotExist

class Contact(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    first_name = models.CharField(max_length=512)
    last_name = models.CharField(max_length=512)

    state = models.CharField(max_length=64, default='New')

    phone_mobile = models.CharField(max_length=255, blank=True, null=True)
    phone_home = models.CharField(max_length=255, blank=True, null=True)
    phone_work = models.CharField(max_length=255, blank=True, null=True)
    phone_work_extension = models.CharField(max_length=255, blank=True, null=True)
    phone_times = models.CharField(max_length=255, blank=True, null=True)

    email_personal = models.CharField(max_length=255, blank=True, null=True)
    email_work = models.CharField(max_length=255, blank=True, null=True)

    address_street = models.CharField(max_length=512, blank=True, null=True)
    address_city = models.CharField(max_length=128, blank=True, null=True)
    address_state = models.CharField(max_length=2, blank=True, null=True)
    address_zip = models.CharField(max_length=5, blank=True, null=True)

    open_house_visit = models.ForeignKey('openhouses.OpenHouse', blank=True, null=True, on_delete=models.SET_NULL)

    mortgage_qualified = models.BooleanField(default=False)

    company = models.CharField(max_length=255, blank=True, null=True)
    position = models.CharField(max_length=255, blank=True, null=True)

    import_id = models.CharField(max_length=256, blank=True, null=True)

    deleted = models.BooleanField(default=False)

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    objects = ContactManager()

    EDITABLE_FIELDS = ['first_name', 'last_name', 'state',
                         'phone_mobile', 'phone_home', 'phone_work', 'phone_work_extension',
                         'phone_times', 'email_personal', 'email_work',
                         'address_street', 'address_city', 'address_state', 'address_zip',
                         'mortgage_qualified',
                         'company', 'position']
    READONLY_FIELDS = ['id', 'created', 'updated']

    SEARCH_FIELDS = ['first_name', 'last_name', 'state', 'phone_mobile', 'phone_home', 'email_personal',
        'email_work', 'address_street', 'address_city', 'address_state', 'agent_name', 'agent_company', 'agent_phone',
        'agent_email', 'mortgage_broker', 'mortgage_company', 'company']

    @property
    def email(self):
        return self.email_personal or self.email_work

    def get_full_name(self):
        return "{} {}".format(self.first_name, self.last_name)

    def as_json(self, full=False, user=None):
        fields = self.EDITABLE_FIELDS + self.READONLY_FIELDS
        result = extract(self, *fields)
        result['tags'] = [_.as_json() for _ in self.tag_set.all()]

        if full:
            result['events'] = [_.as_json() for _ in self.event_set.all().order_by('-created')]
            result['reminders'] = [_.as_json() for _ in self.reminder_set.all()]
            result['team_members'] = [_.as_json() for _ in self.team_member_set.all()]

            notes = self.note_set.filter(Q(owner=user) | Q(shared=True))
            result['notes'] = [_.as_json() for _ in notes]

        if full and self.open_house_visit_id != None:
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

class ContactNote(models.Model):
    contact = models.ForeignKey(
        Contact, on_delete=models.CASCADE, related_name='note_set')

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    shared = models.BooleanField(default=False)

    text = models.TextField(default='')

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created']

    def as_json(self):
        return extract(self, 'id', 'shared', 'text', 'created')


class ContactStar(models.Model):
    contact = models.ForeignKey(
        Contact, on_delete=models.CASCADE, related_name='star_set')
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

class ContactTag(models.Model):
    contacts = models.ManyToManyField('Contact', related_name='tag_set')
    tag = models.CharField(max_length=255, unique=True)

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def as_json(self):
        return {'id': self.id, 'tag': self.tag}

class ContactReminder(models.Model):
    contact = models.ForeignKey(
        Contact, on_delete=models.CASCADE, related_name='reminder_set')
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    date = models.DateField(db_index=True)
    note = models.TextField()
    seen = models.BooleanField(default=False)

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['seen', 'date']

    @property
    def is_active(self):
        return timezone.now().date() >= self.date

    def as_json(self):
        return extract(self, 'id', 'date', 'note', 'seen', 'is_active')


class ContactTeamMember(models.Model):
    EDITABLE_FIELDS = ['name', 'role', 'company', 'phone_number', 'email', 'note']

    name = models.CharField(max_length=512)
    role = models.CharField(max_length=512)

    contacts = models.ManyToManyField(Contact, related_name="team_member_set")

    company = models.CharField(max_length=512, blank=True, null=True)
    phone_number = models.CharField(max_length=512, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    note = models.TextField(blank=True, null=True)

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="team_member_roles")

    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="team_members_created")

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def as_json(self):
        return extract(self, 'id', 'name', 'role', 'company', 'phone_number', 'email', 'note')
