import json
from functools import cmp_to_key

from django.conf import settings
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.shortcuts import get_object_or_404, redirect, render
from django.utils import timezone
from django.utils.http import urlencode

from ..utils import choice, parse_bool, render_json
from .models import (Contact, ContactNote, ContactReminder, ContactStar,
                     ContactTag, ContactTeamMember)

ALLOWED_FIELDS = [
    'first_name', 'last_name', 'state', 'phone_mobile', 'phone_home',
    'phone_work', 'phone_times', 'email_personal', 'email_work',
    'address_street', 'address_city', 'address_state', 'address_zip',
    'workplace', 'position'
]


def index(request, path=None):
    if request.user.is_authenticated:
        user_data = json.dumps(request.user.as_json())
        return render(request, 'spa_base.html', {'user': user_data})
    else:
        url = request.build_absolute_uri()
        qs = urlencode({'redirect_url': url})

        return redirect(settings.LOGIN_URL + '?' + qs)


@login_required
def all_contacts(request):
    if 'POST' == request.method:
        return get_contact(request)

    order_by = choice(
        request.GET.get('sort'), 'last_name', 'phone_mobile', 'email_personal')
    order_reverse = request.GET.get('reverse') == 'true'

    if request.GET.get('q'):
        contacts = Contact.objects.match_query(request.GET['q'])
    else:
        contacts = Contact.objects.all()

    contacts = contacts.prefetch_related('tag_set')

    contacts = contacts.filter(
        Q(owner=request.user) | Q(team_member_set__user=request.user),
        deleted=False).distinct()
    if order_by:
        contacts = contacts.order_by(('-' if order_reverse else '') + order_by)

    query = request.POST.get('q')
    if query:
        contacts = contacts.filter(~Q(first_name__like='%' + query + '%')
                                   | ~Q(last_name__like='%' + query + '%'))

    contacts = [_.as_json() for _ in contacts]

    stars = ContactStar.objects.filter(user=request.user).values_list(
        'contact_id', flat=True)
    reminders = ContactReminder.objects.filter(
        user=request.user, date__lte=timezone.now().date(),
        seen=False).values_list(
            'contact_id', flat=True)

    for contact in contacts:
        contact["starred"] = contact["id"] in stars
        contact["reminder_due"] = contact["id"] in reminders

    contacts = [c for c in contacts if c["starred"] or c["reminder_due"]] +\
        [c for c in contacts if not (c["starred"] or c["reminder_due"])]

    return render_json({'items': contacts, 'stars': stars})


@login_required
def get_contact(request, contact_id=None):
    if 'GET' == request.method:
        contact = get_object_or_404(Contact, id=contact_id)
        return render_json({
            'item':
            contact.as_json(full=True, user=request.user)
        })

    elif 'POST' == request.method:
        contacts = []

        for data in request.data:  # JSON submission is an array of contacts
            if data.get("import_id"):
                contact, _ = Contact.objects.get_or_create(
                    import_id=data["import_id"])
            elif contact_id:
                contact = get_object_or_404(Contact, id=contact_id)
            else:
                contact = Contact(owner=request.user)

            for field, value in data.items():
                if field in ALLOWED_FIELDS:
                    setattr(contact, field, str(value))

            contact.save()

            contacts.append(contact)

        return render_json({
            'items': [
                contact.as_json(full=True, user=request.user)
                for contact in contacts
            ]
        })

    elif 'DELETE' == request.method:
        contact = get_object_or_404(Contact, id=contact_id)
        contact.deleted = True
        contact.save()

        return render_json({'success': True})


#############################
# Notes
#############################


@login_required
def save_note(request, contact_id, note_id=None):
    contact = Contact.objects.get_for_user(contact_id, request.user)

    if note_id:
        note = contact.note_set.get(id=note_id)
    else:
        note = ContactNote(owner=request.user, contact=contact)

    if 'text' in request.data:
        note.text = request.data['text']
    if 'shared' in request.data:
        note.shared = parse_bool(request.data['shared'])

    note.save()

    return render_json({'item': contact.as_json(full=True, user=request.user)})


#############################
# Reminders
#############################


@login_required
def save_reminder(request, contact_id, reminder_id=None):
    contact = Contact.objects.get_for_user(contact_id, request.user)

    if reminder_id:
        reminder = contact.reminder_set.get(id=reminder_id)
    else:
        reminder = ContactReminder(user=request.user, contact=contact)

    if 'date' in request.data:
        reminder.date = request.data['date']
    if 'note' in request.data:
        reminder.note = request.data['note']
    reminder.seen = 'seen' in request.data

    reminder.save()

    return render_json({'item': contact.as_json(full=True, user=request.user)})


#############################
# Members
#############################


@login_required
def search_members(request, query):
    members = ContactTeamMember.obejcts.filter(name__contains=query)
    return render_json({'results': [_.as_json() for _ in members]})


@login_required
def edit_member(request, contact_id, member_id=None):
    contact = Contact.objects.get_for_user(contact_id, request.user)

    if member_id:
        member = get_object_or_404(ContactTeamMember, id=member_id)
    else:
        member = ContactTeamMember(creator=request.user)

    if 'DELETE' == request.method:
        member.contacts.remove(contact)
    elif 'POST' == request.method:
        for key in ContactTeamMember.EDITABLE_FIELDS:
            if key in request.data:
                setattr(member, key, request.data[key])

        member.save()

        member.contacts.add(contact)

    return render_json({'item': contact.as_json(full=True, user=request.user)})


@login_required
def attach_member(request, contact_id, member_id):
    contact = Contact.objects.get_for_user(contact_id, request.user)
    member = get_object_or_404(ContactTeamMember, id=member_id)

    member.contacts.add(contact)

    return render_json({'item': contact.as_json(full=True, user=request.user)})


@login_required
def get_stars(request):
    return render_json({'starred': stars})


@login_required
def set_star(request, contact_id):
    contact = Contact.objects.get_for_user(contact_id, request.user)
    if 'POST' == request.method:
        ContactStar.objects.get_or_create(contact=contact, user=request.user)
        stars = ContactStar.objects.filter(user=request.user).values_list(
            'contact_id', flat=True)
        return render_json({'success': True, 'stars': stars})

    elif 'DELETE' == request.method:
        ContactStar.objects.filter(contact=contact, user=request.user).delete()
        stars = ContactStar.objects.filter(user=request.user).values_list(
            'contact_id', flat=True)
        return render_json({'success': True, 'stars': stars})


@login_required
def save_tag(request, contact_id):
    contact = Contact.objects.get_for_user(contact_id, request.user)
    if 'POST' == request.method and request.data.get('tag'):
        tag, _ = ContactTag.objects.get_or_create(tag=request.data['tag'])
        contact.tag_set.add(tag)

        return render_json({
            'item':
            contact.as_json(full=True, user=request.user)
        })


@login_required
def delete_tag(request, contact_id, tag_id):
    contact = Contact.objects.get_for_user(contact_id, request.user)
    if 'DELETE' == request.method:
        tag = get_object_or_404(ContactTag, id=tag_id)
        contact.tag_set.remove(tag)

    return render_json({'item': contact.as_json(full=True, user=request.user)})
