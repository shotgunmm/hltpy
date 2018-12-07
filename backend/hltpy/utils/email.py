from django.conf import settings
from django.core.mail import send_mail
from django.template import RequestContext
from django.template.loader import render_to_string


def send_html_email(request, user, template, from_email=None, from_name=None, **kwargs):
    kwargs['user'] = user

    to_email = user.email
    to_name = user.get_full_name()
    recipient = "{} <{}>".format(to_name, to_email)

    from_email = from_email or settings.EMAIL_FROM_ADDRESS
    from_name = from_name or settings.EMAIL_FROM_NAME
    sender = "{} <{}>".format(from_name, from_email)

    context = RequestContext(request, {**kwargs)
    subject, html = render_to_string(template, contact, request).split("\n", 1)

    default_msg = "Please use an HTML-enabled mail client to read this email. Thank you!"

    send_mail(subject, default_msg, sender, [recipient], html_message=html, fail_silently=False)
