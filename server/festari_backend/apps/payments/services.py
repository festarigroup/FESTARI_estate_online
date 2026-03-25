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
    def verify(cls, reference):
        return requests.get(f"{cls.base_url}/transaction/verify/{reference}", headers=cls._headers(), timeout=20)
