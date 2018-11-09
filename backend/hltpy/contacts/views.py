import json

from django.conf import settings
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render
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

    return render_json({'items': [_.as_json() for _ in Contact.objects.filter(deleted=False)]})


@login_required
def get_contact(request, contact_id=None):
    if 'GET' == request.method:
        contact = get_object_or_404(Contact, id=contact_id)
    if request.method in ['POST', 'DELETE']:
        contact = get_object_or_404(Contact, id=contact_id) if contact_id else Contact(owner=request.user)

        if 'POST' == request.method:
            for field, value in request.data.items():
                if field in ALLOWED_FIELDS:
                    setattr(contact, field, str(value))
            if 'note' in request.data:
                contact.event_set.create(owner=request.user, kind='note', note=data['note'])
        elif 'DELETE' == request.method:
            contact.deleted = True
        
        contact.save()

    return render_json({'item': contact.as_json(events=True)})

@login_required
def get_stars(request):
    stars = ContactStar.objects.filter(user=request.user).values_list('contact_id', flat=True)
    return render_json({'starred': stars})

@login_required
def set_star(request, contact_id):
    contact = get_object_or_404(Contact, id=contact_id)
    if 'POST' == request.method:
        ContactStar.objects.get_or_create(contact=contact, user=request.user)
        return render_json({'success': True})

    elif 'DELETE' == request.method:
        ContactStar.objects.filter(contact=contact, user=request.user).delete()
        return render_json({'success': True})