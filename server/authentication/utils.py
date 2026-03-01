from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string


def send_email(
    *,
    to_email: str,
    subject: str,
    template_name: str,
    context: dict,
    text_body: str = ""
):
    html_content = render_to_string(template_name, context)
    msg = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=settings.EMAIL_HOST_USER,
        to=[to_email],
    )

    msg.attach_alternative(html_content, "text/html")
    msg.send()


def send_otp_email(email, code):
    send_email(
        to_email=email,
        subject="Festari Estate - Activate account",
        template_name="emails/otp_email.html",
        context={"OTP": code},
        text_body="Activate your account using the OTP provided.",
    )


def send_password_reset_email(email, reset_link):
    send_email(
        to_email=email,
        subject="Festari Estate - Password Reset",
        template_name="emails/password_reset_email.html",
        context={"reset_link": reset_link},
        text_body=f"Reset your password using the link below:\n{reset_link}",
    )