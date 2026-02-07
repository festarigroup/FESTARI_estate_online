from django.contrib import admin
from authentication.models import OTP, Subscription

# Register your models here.
admin.site.register(OTP)
admin.site.register(Subscription)