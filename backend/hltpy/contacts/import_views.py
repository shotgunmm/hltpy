from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, redirect, render

from google.auth.exceptions import RefreshError
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from httplib2 import Http


@login_required
def import_login(request):
    flow = Flow.from_client_secrets_file(
        'client_secret.json',
        scopes=['https://www.googleapis.com/auth/contacts.readonly'])

    flow.redirect_uri = 'https://{}/dashboard/contacts/import/auth'.format(settings.CANONICAL_DOMAIN)

    if 'code' not in request.GET:
        authorization_url, state = flow.authorization_url(access_type='offline', include_granted_scopes='true')
        return redirect(authorization_url)
    else:
        flow.fetch_token(code=request.GET['code'])

        request.session['google_credentials'] = credentials_to_dict(flow.credentials)

        return redirect('/dashboard/contacts/import')


@login_required
def import_contacts(request):
    if 'google_credentials' in request.session:
        credentials = Credentials(**request.session['google_credentials'])
    else:
        return JsonResponse({'authorized': False})

    people = build('people', 'v1', credentials=credentials).people()

    # check if the token is good
    try:
        people.connections().list(resourceName='people/me', personFields='names').execute()
    except RefreshError:
        return JsonResponse({'authorized': False})

    contacts = []
    page_token = None

    while True:
        page, page_token = fetch_page(people, page_token)
        contacts += page
        if not page_token:
            break
    

    contacts.sort(key=lambda c: (c['last_name'], c['first_name']))
    return JsonResponse({'authorized': True, 'contacts': contacts})

def fetch_page(client, token=None):
    out = []
    results = client.connections().list(
        resourceName='people/me',
        personFields='names,addresses,phoneNumbers,emailAddresses',
        pageToken=token
    ).execute()

    for person in results["connections"]:
        contact = {'import_id': person['resourceName']}
        if 'names' in person:
            contact['first_name'] = person['names'][0].get('givenName', '')
            contact['last_name'] = person['names'][0].get('familyName', '')
        else:
            continue
        
        if 'phoneNumbers' in person:
            contact['phone_mobile'] = person['phoneNumbers'][0].get('canonicalForm')
            if len(person['phoneNumbers']) > 1:
                contact['phone_home'] = person['phoneNumbers'][1].get('canonicalForm')
        
        if 'emailAddresses' in person:
            contact['email_personal'] = person['emailAddresses'][0].get('value')
            if len(person['emailAddresses']) > 1:
                contact['email_work'] = person['emailAddresses'][1].get('canonicalForm')

        out.append(contact)

    return out, results.get("nextPageToken")


def credentials_to_dict(credentials):
  return {'token': credentials.token,
          'refresh_token': credentials.refresh_token,
          'token_uri': credentials.token_uri,
          'client_id': credentials.client_id,
          'client_secret': credentials.client_secret,
          'scopes': credentials.scopes}
