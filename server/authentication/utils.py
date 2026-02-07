from django.conf import settings
from django.core.mail import send_mail
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string


def send_otp_email(email, code):
    html_content = render_to_string(
        "templates/emails/my_email.html",
        context={"OTP": code},
    )

    msg = EmailMultiAlternatives(
        subject="Festari Estate - Activate account",
        body="Activate your account using the OTP provided.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[email],
        headers={"List-Unsubscribe": "<mailto:unsub@example.com>"},
    )

    msg.attach_alternative(html_content, "text/html")
    msg.send()
