import logging
import uuid
from celery import shared_task, Task
from celery.schedules import crontab
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

from apps.common.idempotency import exists as idempotency_exists, mark_sent as idempotency_mark_sent

logger = logging.getLogger(__name__)


def _prepare_email(subject, recipient_list, template_name=None, context=None, plain_message=None, from_email=None):
    from django.conf import settings
    from django.template.loader import render_to_string
    from django.utils.html import strip_tags

    from_email = from_email or settings.DEFAULT_FROM_EMAIL
    context = context or {}

    if template_name:
        html_message = render_to_string(template_name, context)
        message = plain_message or strip_tags(html_message)
    else:
        html_message = None
        message = plain_message or ""

    return {
        "subject": subject,
        "message": message,
        "from_email": from_email,
        "recipient_list": [recipient_list] if isinstance(recipient_list, str) else recipient_list,
        "html_message": html_message,
    }

class BaseTaskWithRetry(Task):
    autoretry_for = (Exception,)
    retry_kwargs = {"max_retries": 5, "countdown": 10}
    retry_backoff = True
    retry_backoff_max = 600
    retry_jitter = True
    time_limit = 60
    soft_time_limit = 45
    acks_late = True

@shared_task(bind=True, base=BaseTaskWithRetry, queue="default")
def delete_supabase_media_file_task(self, path: str):
    """Delete media file from Supabase storage asynchronously."""
    from apps.common.supabase import delete_media_file
    
    logger.info("Deleting Supabase media file: %s", path)
    
    try:
        result = delete_media_file(path)
        if result.get("success"):
            logger.info("Successfully deleted Supabase media file: %s", path)
            return {"success": True, "path": path}
        else:
            error_msg = result.get("error", "Unknown error")
            logger.error("Failed to delete Supabase media file %s: %s", path, error_msg)
            return {"success": False, "path": path, "error": error_msg}
    except Exception as exc:
        logger.exception("Exception deleting Supabase media file %s: %s", path, str(exc))
        raise self.retry(exc=exc)

@shared_task(bind=True, base=BaseTaskWithRetry, queue="email")
def send_email_task(self, subject, recipient_list, template_name=None, context=None, plain_message=None, from_email=None, message_id=None):
    """
    Send email via Celery worker. Uses message_id for idempotency.
    """
    logger.info("Email task started - Task ID: %s, Message ID: %s, Subject: '%s', Recipients: %s",
                self.request.id, message_id, subject, recipient_list)

    if not message_id:
        message_id = str(uuid.uuid4())
        logger.debug("Generated new message ID: %s", message_id)

    if idempotency_exists(message_id):
        logger.info("Email duplicate skipped: %s", message_id)
        return {"skipped": True, "message_id": message_id}

    logger.debug("Preparing email payload for Message ID: %s", message_id)
    payload = _prepare_email(subject, recipient_list, template_name, context, plain_message, from_email)

    try:
        logger.info("Sending email via Django send_mail - Message ID: %s", message_id)
        send_mail(**payload)
        idempotency_mark_sent(message_id)
        logger.info("Email sent successfully: %s to %s", message_id, recipient_list)
        return {"success": True, "message_id": message_id}
    except Exception as exc:
        logger.exception("Email send failed: %s - Error: %s", message_id, str(exc))
        raise self.retry(exc=exc)


@shared_task(bind=True, base=BaseTaskWithRetry, queue="default")
def check_expired_subscriptions(self):
    """Check and deactivate expired subscriptions."""
    from django.utils import timezone
    from apps.subscriptions.models import UserSubscription
    
    logger.info("Checking for expired subscriptions")
    
    expired_subscriptions = UserSubscription.objects.filter(
        end_date__lt=timezone.now(),
        is_active=True
    )
    
    count = 0
    for subscription in expired_subscriptions:
        subscription.is_active = False
        subscription.save(update_fields=['is_active'])
        count += 1
        
        # Send notification email
        context = {
            "recipient_name": subscription.user.first_name or subscription.user.username,
            "plan_name": subscription.plan.name,
            "end_date": subscription.end_date.strftime("%B %d, %Y"),
            "logo_url": settings.EMAIL_LOGO_URL,
        }
        send_email_task.delay(
            subject="Your Festari Subscription Has Expired",
            recipient_list=subscription.user.email,
            template_name="subscriptions/subscription_expired.html",
            context=context,
            message_id=f"subscription_expired:{subscription.id}"
        )
    
    logger.info(f"Deactivated {count} expired subscriptions")
    return {"deactivated_count": count}
