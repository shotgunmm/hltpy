from django.forms import ModelForm
from .models import OpenHouse

class EditOpenHouseForm(ModelForm):
    class Meta:
        model = OpenHouse
        fields = OpenHouse.EDITABLE_FIELDS