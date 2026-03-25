import requests
from django.conf import settings


def verify_supabase_jwt(token: str) -> dict:
    if not settings.SUPABASE_URL or not token:
        return {}
    url = f"{settings.SUPABASE_URL}/auth/v1/user"
    resp = requests.get(url, headers={"Authorization": f"Bearer {token}", "apikey": settings.SUPABASE_SERVICE_ROLE_KEY}, timeout=20)
    if resp.ok:
        return resp.json()
    return {}


def upload_signed_url(path: str) -> dict:
    if not settings.SUPABASE_URL:
        return {}
    url = f"{settings.SUPABASE_URL}/storage/v1/object/sign/{settings.SUPABASE_BUCKET}/{path}"
    resp = requests.post(url, json={"expiresIn": 3600}, headers={"Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}", "apikey": settings.SUPABASE_SERVICE_ROLE_KEY}, timeout=20)
    return resp.json() if resp.ok else {}
