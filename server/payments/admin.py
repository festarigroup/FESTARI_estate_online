from django.contrib import admin

from .models import Payment, SubscriptionPayment

# Register your models here.
admin.site.register(SubscriptionPayment)
admin.site.register(Payment)