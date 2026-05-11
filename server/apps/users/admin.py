from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from apps.users.models import ActivityLog, OTPVerification, User

admin.site.register(User, UserAdmin)
admin.site.register(OTPVerification)
admin.site.register(ActivityLog)
