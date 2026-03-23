import requests
from django.conf import settings

PAYSTACK_BASE_URL = "https://api.paystack.co"

class PaystackService:

    @staticmethod
    def initialize_payment(email, amount, reference, plan_code=None):
        url = f"{PAYSTACK_BASE_URL}/transaction/initialize"
        headers = {
            "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
            "Content-Type": "application/json",
        }

        data = {
            "email": email,
            "amount": int(amount * 100),
            "reference": reference,
            "callback_url": "http://localhost:3000/payment-success"
        }

        # 🔥 Add this
        if plan_code:
            data["plan"] = plan_code

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

    @staticmethod
    def get_customer_by_email(email):
        """Fetch existing customer by email"""
        url = f"{PAYSTACK_BASE_URL}/customer?email={email}"
        headers = {
            "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
        }
        response = requests.get(url, headers=headers)
        data = response.json()
        if data.get("status") and data.get("data"):
            customers = data["data"]
            if customers:
                return customers[0]
        return None

    @staticmethod
    def create_customer(email, first_name, last_name):
        """Create a new Paystack customer"""
        url = f"{PAYSTACK_BASE_URL}/customer"
        headers = {
            "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
            "Content-Type": "application/json"
        }
        data = {
            "email": email,
            "first_name": first_name,
            "last_name": last_name
        }
        response = requests.post(url, json=data, headers=headers)
        data = response.json()
        if data.get("status"):
            return data["data"]
        return None


class PaystackSubscriptionService:

    @staticmethod
    def create_plan(name, amount, interval):
        url = f"{PAYSTACK_BASE_URL}/plan"
        headers = {
            "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
            "Content-Type": "application/json"
        }
        data = {
            "name": name,
            "amount": int(amount * 100),
            "interval": interval,
        }
        response = requests.post(url, json=data, headers=headers)
        return response.json()

    @staticmethod
    def disable_subscription(subscription_code, email_token):
        url = f"{PAYSTACK_BASE_URL}/subscription/disable"
        headers = {
            "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
            "Content-Type": "application/json"
        }
        data = {
            "code": subscription_code,
            "token": email_token
        }
        response = requests.post(url, json=data, headers=headers)
        return response.json()