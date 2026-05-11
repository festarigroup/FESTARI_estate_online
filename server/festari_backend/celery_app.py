import os
import sys
from celery import Celery

sys.path.insert(0, '/app/festari_backend')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "festari_backend.settings")

app = Celery("festari_backend")

app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()

celery = app

@app.task(bind=True)
def debug_task(self):
    print(f"Request: {self.request!r}")
