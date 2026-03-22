import requests
from django.conf import settings

PAYSTACK_BASE_URL = "https://api.paystack.co"

class PaystackService:

    @staticmethod
    def initialize_payment(email, amount, reference):
        url = f"{PAYSTACK_BASE_URL}/transaction/initialize"

        headers = {
            "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
            "Content-Type": "application/json",
        }

        data = {
            "email": email,
            "amount": int(amount * 100),  # convert to kobo/pesewas
            "reference": reference,
            "callback_url": "http://localhost:3000/payment-success"
        }

        response = requests.post(url, json=data, headers=headers)
        return response.json()


    @staticmethod
    def verify_payment(reference):
        url = f"{PAYSTACK_BASE_URL}/transaction/verify/{reference}"

        headers = {
            "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
        }

        response = requests.get(url, headers=headers)
        return response.json()


class PaystackSubscriptionService:

    @staticmethod
    def create_plan(name, amount, interval):
        """Create a plan on Paystack"""
        url = f"{PAYSTACK_BASE_URL}/plan"
        headers = {
            "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
            "Content-Type": "application/json"
        }
        data = {
            "name": name,
            "amount": int(amount * 100),
            "interval": interval,  # 'monthly', 'yearly'
        }
        response = requests.post(url, json=data, headers=headers)
        return response.json()

    @staticmethod
    def create_subscription(email, plan_code):
        """Subscribe user to a Paystack plan"""
        url = f"{PAYSTACK_BASE_URL}/subscription"
        headers = {
            "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
            "Content-Type": "application/json"
        }
        data = {
            "customer": email,
            "plan": plan_code
        }
        response = requests.post(url, json=data, headers=headers)
        return response.json()