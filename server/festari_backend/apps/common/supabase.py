import os
import uuid
from urllib.parse import urlparse

import requests
from django.conf import settings

from .constants import ALLOWED_MEDIA_CONTENT_TYPES, MAX_MEDIA_FILE_SIZE


def verify_supabase_jwt(token: str) -> dict:
    if not settings.SUPABASE_URL or not token:
        return {}
    url = f"{settings.SUPABASE_URL}/auth/v1/user"
    resp = requests.get(
        url,
        headers={
            "Authorization": f"Bearer {token}",
            "apikey": settings.SUPABASE_SERVICE_ROLE_KEY,
        },
        timeout=20,
    )
    return resp.json() if resp.ok else {}


def _get_supabase_headers() -> dict:
    return {
        "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}",
        "apikey": settings.SUPABASE_SERVICE_ROLE_KEY,
    }


def get_media_public_url(path: str) -> str:
    return f"{settings.SUPABASE_URL}/storage/v1/object/public/{settings.SUPABASE_BUCKET}/{path}"


def get_media_path_from_url(url: str) -> str:
    prefix = f"{settings.SUPABASE_URL}/storage/v1/object/public/{settings.SUPABASE_BUCKET}/"
    if url.startswith(prefix):
        return url[len(prefix) :]

    parsed = urlparse(url)
    route_prefix = f"/storage/v1/object/public/{settings.SUPABASE_BUCKET}/"
    if parsed.path.startswith(route_prefix):
        return parsed.path[len(route_prefix) :]

    raise ValueError("Unable to parse Supabase storage path from URL")


def validate_media_file(media_file) -> tuple[bool, str | None]:
    if not media_file:
        return False, "Media file is required."
    if media_file.size > MAX_MEDIA_FILE_SIZE:
        return False, "Media file size exceeds 50MB."
    if media_file.content_type not in ALLOWED_MEDIA_CONTENT_TYPES:
        return False, f"Unsupported media type: {media_file.content_type}"
    return True, None


def build_media_storage_path(model_name: str, instance_id: str, filename: str) -> str:
    _, ext = os.path.splitext(filename)
    ext = ext.lower() if ext else ""
    if not ext:
        ext = ".bin"
    return f"{model_name}/{instance_id}/{uuid.uuid4().hex}{ext}"


def upload_media_file(media_file, model_name: str, instance_id: str) -> dict:
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY or not settings.SUPABASE_BUCKET:
        return {"success": False, "error": "Supabase storage is not configured."}

    valid, error = validate_media_file(media_file)
    if not valid:
        return {"success": False, "error": error}

    path = build_media_storage_path(model_name, instance_id, media_file.name)
    url = f"{settings.SUPABASE_URL}/storage/v1/object/{settings.SUPABASE_BUCKET}"
    headers = _get_supabase_headers()
    params = {"cacheControl": "3600", "upsert": "false", "name": path}
    files = {"file": (media_file.name, media_file, media_file.content_type)}

    try:
        resp = requests.post(url, headers=headers, params=params, files=files, timeout=120)
        if not resp.ok:
            return {
                "success": False,
                "error": f"Supabase upload failed: {resp.status_code} {resp.text}",
            }
        return {"success": True, "path": path, "public_url": get_media_public_url(path)}
    except Exception as exc:
        return {"success": False, "error": str(exc)}


def delete_media_file(path: str) -> dict:
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY or not settings.SUPABASE_BUCKET:
        return {"success": False, "error": "Supabase storage is not configured."}
    if not path:
        return {"success": False, "error": "Storage path is required."}

    url = f"{settings.SUPABASE_URL}/storage/v1/object/{settings.SUPABASE_BUCKET}/{path}"
    headers = _get_supabase_headers()

    try:
        resp = requests.delete(url, headers=headers, timeout=120)
        if resp.status_code in (200, 204):
            return {"success": True}
        return {"success": False, "error": f"Supabase delete failed: {resp.status_code} {resp.text}"}
    except Exception as exc:
        return {"success": False, "error": str(exc)}
