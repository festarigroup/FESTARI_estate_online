from django.core.mail import send_mail
from django.conf import settings


def send_otp_email(email, code):
    send_mail(
        subject="Your Festari Verification Code",
        message=f"Your OTP is {code}. It expires in 10 minutes.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        fail_silently=False,
    )
