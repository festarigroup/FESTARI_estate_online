from rest_framework import serializers

class PaymentInitializeSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)

class SubscriptionSerializer(serializers.Serializer):
    PLAN_CHOICES = ['basic', 'pro', 'enterprise']
    plan = serializers.ChoiceField(choices=PLAN_CHOICES)
    recurring = serializers.BooleanField(default=True)