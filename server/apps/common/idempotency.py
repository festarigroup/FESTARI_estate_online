import redis
from django.conf import settings
import hashlib
import json

redis_client = redis.Redis.from_url(settings.REDIS_URL)

def generate_id(subject, recipient_list, template_name=None, context=None):
    key_data = {
        "subject": subject,
        "recipients": recipient_list,
        "template": template_name,
        "context": context,
    }
    return hashlib.sha256(json.dumps(key_data, sort_keys=True).encode("utf-8")).hexdigest()

def exists(message_id):
    return bool(redis_client.get(f"email_idempotency:{message_id}"))

def mark_sent(message_id, ttl=86400):
    return redis_client.set(f"email_idempotency:{message_id}", "1", ex=ttl)