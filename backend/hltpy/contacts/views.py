import json

from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.shortcuts import get_object_or_404, render, redirect
from django.utils.http import urlencode

from ..utils import render_json
from .models import Contact

ALLOWED_FIELDS = ['first_name', 'last_name', 'state',
    'phone_mobile', 'phone_home', 'phone_work',
    'phone_times', 'email_personal', 'email_work',
    'address_street', 'address_city', 'address_state', 'address_zip',
    'workplace', 'position']


def index(request, path=None):
    if request.user.is_authenticated:
        user_data = json.dumps(request.user.as_json())
        return render(request, 'spa_base.html', { 'user': user_data })
    else:
        url = request.build_absolute_uri()
        qs = urlencode({'redirect_url': url})

        return redirect(settings.LOGIN_URL + '?' + qs)


@login_required
def all_contacts(request):
    if 'POST' == request.method:
        return get_contact(request)

    return render_json({'items': [_.as_json() for _ in Contact.objects.all()]})


@login_required
def get_contact(request, contact_id=None):
    if 'GET' == request.method:
        contact = get_object_or_404(Contact, id=contact_id)
    if 'POST' == request.method:
        contact = get_object_or_404(Contact, id=contact_id) if contact_id else Contact(owner=request.user)

        data = json.loads(request.body.decode('utf-8'))
        for field, value in data.items():
            if field in ALLOWED_FIELDS:
                setattr(contact, field, str(value))
        
        contact.save()

        if 'note' in data:
            contact.event_set.create(owner=request.user, kind='note', note=data['note'])

    return render_json({'item': contact.as_json(events=True)})
