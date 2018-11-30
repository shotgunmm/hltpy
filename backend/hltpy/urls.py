"""hltpy URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path

from .contacts import import_views as contacts_import
from .contacts import views as contacts
from .openhouses import views as openhouses

urlpatterns = [
    path('dashboard', contacts.index),
    path('dashboard/contacts/import/auth', contacts_import.import_login),
    path('dashboard/<path:path>', contacts.index),
    path('openhouse/', include('hltpy.openhouses.urls')),
    path('api/contacts', contacts.all_contacts),
    path('api/contacts/import', contacts_import.import_contacts),
    path('api/contacts/<int:contact_id>', contacts.get_contact),
    path('api/contacts/<int:contact_id>/star', contacts.set_star),
    path('api/contacts/<int:contact_id>/members', contacts.edit_member),
    path('api/contacts/<int:contact_id>/members/<int:member_id>', contacts.edit_member),
    path('api/contacts/<int:contact_id>/members/<int:member_id>/attach', contacts.attach_member),
    path('api/members', contacts.search_members),
    path('api/openhouses', openhouses.all_records),
    path('api/openhouses/<int:record_id>', openhouses.get_record),
]
