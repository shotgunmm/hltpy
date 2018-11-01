import json

from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render

from ..contacts.models import Contact
from .models import OpenHouse


@login_required
def contactform_submit(request):
    if request.method == 'POST':
        open_house = get_object_or_404(OpenHouse, id=request.POST['id'])
        broker = request.user

        contact = Contact(owner=broker, open_house_visit=open_house)

        #print(request.body)
        #data = json.loads(request.body.decode())

        for field in Contact.EDITABLE_FIELDS:
            value = request.POST.get(field)
            if value:
                setattr(contact, field, value)
        contact.save()

        return redirect(request.META['HTTP_REFERER'])


@login_required
def all_records(request):
    if 'POST' == request.method:
        return get_record(request)
    
    return render_json({'items': [_.as_json() for _ in OpenHouse.objects.all()]})
