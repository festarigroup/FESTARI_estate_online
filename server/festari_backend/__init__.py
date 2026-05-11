from .celery_app import app as celery_app

celery_config = celery_app

__all__ = ("celery_app", "celery_config")
