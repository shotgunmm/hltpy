from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render

from ..contacts.models import Contact
from .models import OpenHouse


@login_required
def kiosk_enter(request, house_key):
    open_house = get_object_or_404(OpenHouse, key=house_key)
    return render(request, 'openhouses/enter.html', {'open_house': open_house})

@login_required
def kiosk_welcome(request, house_key):
    open_house = get_object_or_404(OpenHouse, key=house_key)
    return render(request, 'openhouses/welcome.html', {'open_house': open_house, 'associate': request.user})

@login_required
def kiosk_form(request, house_key, kind):
    open_house = get_object_or_404(OpenHouse, key=house_key)
    assert kind in ['broker', 'buyer']

    if 'GET' == request.method:
        return render(request, 'openhouses/form.html', {'open_house': open_house, 'kind': kind})
    elif 'POST' == request.method:
        email = request.POST.get('email_personal')
        email_matches = Contact.objects.filter(email_personal=email)
        if email and email_matches.exists():
            contact = email_matches[0]
        else:
            contact = Contact(owner=request.user, open_house_visit=open_house)

        for field in Contact.EDITABLE_FIELDS:
            value = request.POST.get(field)
            if value:
                setattr(contact, field, value)

        agent_data = {k.split('[')[1].strip(']'): v for k,v in request.POST.items() if k.startswith('agent[')}
        if 'first_name' in agent_data and 'last_name' in agent_data:
            agent_data['name'] = "{} {}".format(agent_data['first_name'], agent_data['last_name'])

        agent_data = filter_fields(agent_data, ContactTeamMember.EDITABLE_FIELDS)
        mortgage_data = {k.split('[')[1].strip(']'): v for k,v in request.POST.items() if k.startswith('mortgage[')}
        mortgage_data = filter_fields(mortgage_data, ContactTeamMember.EDITABLE_FIELDS)

        if len(agent_data):
            contact.team_member_set.create(**agent_data)

        if len(mortgage_data):
            contact.team_member_set.create(**mortgage_data)

        contact.mortage_qualified = request.POST.get('mortgage_qualified') == 'true'
        contact.save()


        return redirect(open_house.kiosk_url())


def send_customer_email(contact, open_house):
    pass
