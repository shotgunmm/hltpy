from django.urls import path

from . import kiosk_views

urlpatterns = [
    path("<house_key>/enter", kiosk_views.kiosk_enter),
    path("<house_key>", kiosk_views.kiosk_welcome),
    path("<house_key>/buyer", kiosk_views.kiosk_form, {"kind": "buyer"}),
    path("<house_key>/broker", kiosk_views.kiosk_form, {"kind": "broker"}),
]
