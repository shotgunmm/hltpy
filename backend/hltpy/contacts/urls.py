from django.urls import path

from . import import_views, views

urlpatterns = [
    path('', views.all_contacts),
    path('import', import_views.import_contacts),
    path('<int:contact_id>', views.get_contact),
    path('<int:contact_id>/star', views.set_star),
    path('<int:contact_id>/members', views.edit_member),
    path('<int:contact_id>/members/<int:member_id>', views.edit_member),
    path('<int:contact_id>/members/<int:member_id>/attach', views.attach_member),
    path('<int:contact_id>/reminders', views.save_reminder),
    path('<int:contact_id>/reminders/<int:reminder_id>', views.save_reminder),
    path('<int:contact_id>/notes', views.save_note),
    path('<int:contact_id>/notes/<int:note_id>', views.save_note),
]
