import logging
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from apps.common.tasks import send_email_task
from apps.common.idempotency import generate_id, exists as idempotency_exists, mark_sent as idempotency_mark_sent

logger = logging.getLogger(__name__)

def prepare_email(subject, recipient_list, template_name=None, context=None, plain_message=None, from_email=None):
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

def send_email(subject, recipient_list, template_name=None, context=None, plain_message=None, from_email=None, background=True, message_id=None, force_sync=False):
    """
    Trigger email send.
    - background=True => Celery async
    - force_sync=True => immediate send in-process
    """
    logger.info("Email send initiated - Subject: '%s', Recipients: %s, Template: %s, Background: %s",
                subject, recipient_list, template_name, background and not force_sync)

    payload = prepare_email(subject, recipient_list, template_name, context, plain_message, from_email)
    if not message_id:
        message_id = generate_id(subject, recipient_list, template_name, context)

    logger.debug("Email payload prepared - Message ID: %s", message_id)

    if background and not force_sync:
        logger.info("Queueing email task for background processing - Message ID: %s", message_id)
        result = send_email_task.apply_async(
            args=[
                payload["subject"],
                payload["recipient_list"],
                template_name,
                context,
                payload["message"],
                from_email,
                message_id,
            ],
            queue="email",
            task_id=message_id,
        )
        logger.info("Email task queued successfully - Task ID: %s, Message ID: %s", result.id, message_id)
        return result

    logger.info("Sending email synchronously - Message ID: %s", message_id)
    from django.core.mail import send_mail
    if idempotency_exists(message_id):
        logger.info("Email already sent (%s), skipping sync send", message_id)
        return {"skipped": True}
    result = send_mail(**payload)
    if result:
        idempotency_mark_sent(message_id)
        logger.info("Email sent successfully (sync) - Message ID: %s", message_id)
    else:
        logger.warning("Email send failed (sync) - Message ID: %s", message_id)
    return {"sent": bool(result), "message_id": message_id}