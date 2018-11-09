from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required

from .models import OpenHouse
from ..contacts.models import Contact

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

        if request.POST.get('agent_first_name'):
            contact.agent_name = "{} {}".format(request.POST.get('agent_first_name'), request.POST.get('agent_last_name'))

        contact.mortage_qualified = request.POST.get('mortgage_qualified') == 'true'
        contact.save()

        return redirect(open_house.kiosk_url())






