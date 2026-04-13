FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY ../requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY . /app
RUN mkdir -p /app/festari_backend/logs
RUN mkdir -p /app/logs

EXPOSE 8000

CMD ["python", "festari_backend/manage.py", "runserver", "0.0.0.0:8000"]
