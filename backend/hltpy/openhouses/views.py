import json, uuid

from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render

from ..contacts.models import Contact
from .models import OpenHouse
from .forms import EditOpenHouseForm
from ..utils import render_json


@login_required
def all_records(request):
    if 'POST' == request.method:
        return get_record(request)
    
    return render_json({'items': [_.as_json() for _ in OpenHouse.objects.all()]})

@login_required
def get_record(request, record_id=None):
    if record_id:
        record = get_object_or_404(OpenHouse, id=record_id)
    elif 'POST' == request.method:
        record = OpenHouse(user=request.user, key=str(uuid.uuid4()))

    if 'POST' == request.method:
        data = record.as_json()
        data.update(request.data)
        form = EditOpenHouseForm(data=data, instance=record)
        if form.is_valid():
            record = form.save()
            return render_json({'success': True, 'item': record.as_json()})
        else:
            return render_json({'success': False, 'errors': form.errors})

    return render_json({'item': record.as_json()})