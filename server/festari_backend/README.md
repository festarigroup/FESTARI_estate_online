# Festari Estates Backend (DRF)

Production-focused Django REST Framework backend for properties, hotels, artisans, subscriptions, payments, and admin analytics.

## 1) Virtual environment

From project root (`festari_estates`):

```powershell
.\venv\Scripts\activate
pip install -r requirements.txt
cd .\festari_backend
```

## 2) Configure environment

```powershell
copy .env.example .env
```

Update `.env` values for Supabase, Paystack, PostgreSQL, and Gmail SMTP.

## 3) Run database + API

```powershell
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Swagger docs:
- `http://127.0.0.1:8000/swagger/`
- `http://127.0.0.1:8000/redoc/`

## 4) Core API groups

- `api/v1/auth/*` register, JWT login/refresh, OAuth placeholder endpoint
- `api/v1/profiles/*` user profiles
- `api/v1/properties/*`, `api/v1/wishlist/*`
- `api/v1/hotels/*`, `api/v1/hotel-bookings/*`
- `api/v1/artisans/*`, `api/v1/artisan-hires/*`
- `api/v1/subscription-plans/*`, `api/v1/subscriptions/*`
- `api/v1/payments/initiate/`, `api/v1/payments/verify/`, `api/v1/payments/webhook/`
- `api/v1/admin/analytics/` (admin only)

## 5) Docker

From project root:

```powershell
docker compose up --build
```
