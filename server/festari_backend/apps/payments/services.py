import requests
from django.conf import settings


class PaystackService:
    base_url = "https://api.paystack.co"

    @classmethod
    def _headers(cls):
        return {"Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}", "Content-Type": "application/json"}

    @classmethod
    def initialize(cls, email, amount, reference, callback_url=None):
        payload = {"email": email, "amount": int(float(amount) * 100), "reference": reference}
        if callback_url:
            payload["callback_url"] = callback_url
        return requests.post(f"{cls.base_url}/transaction/initialize", json=payload, headers=cls._headers(), timeout=20)

    @classmethod
    def create_plan(cls, name, amount, interval="monthly"):
        payload = {"name": name, "amount": int(float(amount) * 100), "interval": interval}
        return requests.post(f"{cls.base_url}/plan", json=payload, headers=cls._headers(), timeout=20)

    @classmethod
    def list_plans(cls):
        return requests.get(f"{cls.base_url}/plan", headers=cls._headers(), timeout=20)

    @classmethod
    def update_plan(cls, plan_code, name=None, amount=None, interval=None):
        payload = {}
        if name:
            payload["name"] = name
        if amount:
            payload["amount"] = int(float(amount) * 100)
        if interval:
            payload["interval"] = interval
        return requests.put(f"{cls.base_url}/plan/{plan_code}", json=payload, headers=cls._headers(), timeout=20)
