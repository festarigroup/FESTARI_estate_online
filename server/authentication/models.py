from django.db import models
from django.utils import timezone

from users.models import User

# Create your models here.

class OTP(models.Model):
    class Meta:
        ordering = ['-created_at']

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='otps'
    )
    code = models.CharField(max_length=4)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    def is_expired(self):
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"OTP for {self.user.username}"


class Subscription(models.Model):
    BASIC = 'basic'
    PRO = 'pro'
    ENTERPRISE = 'enterprise'

    PLAN_CHOICES = [
        (BASIC, 'Basic'),
        (PRO, 'Pro'),
        (ENTERPRISE, 'Enterprise'),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='subscription'
    )

    plan = models.CharField(
        max_length=20,
        choices=PLAN_CHOICES,
        default=BASIC
    )

    def max_properties(self):
        return {
            self.BASIC: 2,
            self.PRO: 5,
            self.ENTERPRISE: 10,
        }[self.plan]
