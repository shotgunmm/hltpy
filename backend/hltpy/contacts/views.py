from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, render

from ..utils import render_json
from .models import Contact

ALLOWED_FIELDS = ['first_name', 'last_name', 'state',
    'phone_mobile', 'phone_home', 'phone_work',
    'phone_times', 'email_personal', 'email_work',
    'address_street', 'address_city', 'address_state', 'address_zip',
    'workplace', 'position']


def index(request):
    # TODO replace with proper login synchronization
    user = authenticate(username='admin', password='password')
    login(request, user)
    return render(request, 'spa_base.html')


@login_required
def all_contacts(request):
    return render_json({'items': [_.as_json() for _ in Contact.objects.all()]})


@login_required
def get_contact(request, contact_id=None):
    contact = get_object_or_404(Contact, id=contact_id)

    if 'POST' == request.method:
        action = request.POST['action']
        success = False
        if action == 'note':
            contact.event_set.create(kind='note', note=request.POST['note'])
            success = True
        elif action == 'update':
            field = request.POST['field']
            new_value = request.POST['value']
            assert field in ALLOWED_FIELDS
            old_value = getattr(contact, field)

            contact.event_set.create(kind='field_change', owner=request.user, field_changed=field, value_before=old_value, value_after=new_value)

            Contact.objects.filter(id=contact.id).update(updated=timezone.now(), **{field: new_value})
            setattr(contact, field, new_value)
            success = True

        if not success:
            return render_json({'success': False}, status=400)

    return render_json({'item': contact.as_json(events=True)})
    

@login_required
def create_contact(request):
    fields = {field:value for field, value in request.POST.items() if field in ALLOWED_FIELDS}
    contact = Contact.objects.create(owner=request.user, **fields)

    return render_json({'contact': contact.as_json(events=True)})
