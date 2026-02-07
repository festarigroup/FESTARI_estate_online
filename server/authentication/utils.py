from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string


def send_otp_email(email, code):
    html_content = render_to_string(
        "emails/otp_email.html",
        context={"OTP": code},
    )

    msg = EmailMultiAlternatives(
        subject="Festari Estate - Activate account",
        body="Activate your account using the OTP provided.",
        from_email=settings.EMAIL_HOST_USER,
        to=[email],
        # headers={"List-Unsubscribe": "<mailto:unsub@gmail.com>"},
    )

    msg.attach_alternative(html_content, "text/html")
    msg.send()
