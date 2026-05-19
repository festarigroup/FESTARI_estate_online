from django.contrib import admin

from apps.subscriptions.models import SubscriptionPlan, UserSubscription

admin.site.register(SubscriptionPlan)
admin.site.register(UserSubscription)
