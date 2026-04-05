# Festari Estates Backend (DRF)

Production-focused Django REST Framework backend for properties, hotels, artisans, subscriptions, payments, and admin analytics.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Core Services & Features](#core-services--features)
- [Use Case Flows](#use-case-flows)
- [Database Schema](#database-schema)
- [Environment Configuration](#environment-configuration)
- [Deployment](#deployment)

## Overview

Festari Estates is a comprehensive real estate platform backend that provides APIs for:

- **Property Management**: List, search, and manage real estate properties
- **Hotel Management**: Hotel listings and booking management
- **Artisan Services**: Connect customers with local artisans
- **Subscription System**: Tiered plans for different user types
- **Payment Processing**: Secure payments via Paystack
- **Media Management**: File uploads to Supabase storage
- **Admin Analytics**: Dashboard insights and reporting

## Architecture

### Tech Stack

- **Backend**: Django 5.0 + Django REST Framework
- **Database**: PostgreSQL 15
- **Cache/Queue**: Redis 7
- **File Storage**: Supabase Storage
- **Payments**: Paystack API
- **Email**: Gmail SMTP
- **Task Queue**: Celery + Redis
- **Containerization**: Docker + Docker Compose

### Service Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js App   │    │  Django REST API │    │   PostgreSQL    │
│     (Port 3000) │◄──►│     (Port 8000)  │◄──►│     Database    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
                    ┌─────────────────┐    ┌─────────────────┐
                    │     Redis       │    │    Supabase     │
                    │  Cache & Queue  │    │    Storage      │
                    └─────────────────┘    └─────────────────┘
```

## Installation & Setup

### Prerequisites

- Docker & Docker Compose
- Git
- Python 3.11+ (for local development)

### Quick Start with Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd festari_estates/server
   ```

2. **Environment Configuration**
   ```bash
   cp festari_backend/.env.example festari_backend/.env
   ```

   Edit `.env` with your configuration:
   ```env
   DEBUG=True
   SECRET_KEY=your-secret-key-here
   DATABASE_URL=postgresql://postgres:postgres@db:5432/festari_db
   REDIS_URL=redis://redis:6379/0

   # Supabase Configuration
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   SUPABASE_BUCKET=festari-media

   # Paystack Configuration
   PAYSTACK_SECRET_KEY=sk_test_your-paystack-secret
   PAYSTACK_WEBHOOK_SECRET=whsec_your-webhook-secret

   # Email Configuration
   EMAIL_HOST_USER=your-gmail@gmail.com
   EMAIL_HOST_PASSWORD=your-gmail-app-password
   ```

3. **Launch Services**
   ```bash
   docker compose up --build
   ```

4. **Run Database Migrations**
   ```bash
   docker compose exec server python manage.py migrate
   ```

5. **Create Superuser**
   ```bash
   docker compose exec server python manage.py createsuperuser
   ```

6. **Access the Application**
   - API: http://localhost:8000
   - Swagger Docs: http://localhost:8000/swagger/
   - Redoc Docs: http://localhost:8000/redoc/
   - Admin Panel: http://localhost:8000/admin/

### Local Development Setup

1. **Create Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Setup PostgreSQL & Redis**
   ```bash
   # Using Docker for services
   docker run -d --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:15-alpine
   docker run -d --name redis -p 6379:6379 redis:7-alpine
   ```

4. **Run Migrations & Start Server**
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

## Running the Application

### Docker Commands

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f server

# Run commands in container
docker compose exec server python manage.py shell
docker compose exec server python manage.py dbshell

# Stop services
docker compose down

# Rebuild after code changes
docker compose up --build --force-recreate
```

### Celery Tasks

The application uses Celery for background tasks:

- **Worker**: Processes email sending, media deletion
- **Beat**: Runs scheduled tasks (subscription expiration checks)

```bash
# Start Celery worker
celery -A festari_backend worker --loglevel=info

# Start Celery beat scheduler
celery -A festari_backend beat --loglevel=info
```

## API Documentation

### Authentication

The API uses JWT (JSON Web Tokens) for authentication.

#### Register User
```http
POST /api/v1/auth/register/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "first_name": "John",
  "last_name": "Doe"
}
```

#### Verify Email
```http
POST /api/v1/auth/verify-otp/
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

#### Login
```http
POST /api/v1/auth/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### Refresh Token
```http
POST /api/v1/auth/refresh/
Content-Type: application/json

{
  "refresh": "refresh-token-here"
}
```

### Core API Endpoints

#### Properties API

**List Properties**
```http
GET /api/v1/properties/
Authorization: Bearer <access-token>
```

**Create Property**
```http
POST /api/v1/properties/
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "title": "Beautiful 3BR Apartment",
  "description": "Spacious apartment in city center",
  "price": 250000.00,
  "location": "Lagos, Nigeria",
  "property_type": "apartment",
  "bedrooms": 3,
  "bathrooms": 2
}
```

**Upload Property Media**
```http
POST /api/v1/properties/{id}/upload-media/
Authorization: Bearer <access-token>
Content-Type: multipart/form-data

file: <image-file>
```

#### Hotels API

**List Hotels**
```http
GET /api/v1/hotels/
```

**Create Hotel** (Requires hotel subscription)
```http
POST /api/v1/hotels/
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "name": "Grand Hotel Lagos",
  "description": "Luxury hotel in Victoria Island",
  "location": "Lagos, Nigeria",
  "nightly_rate": 150.00,
  "total_rooms": 50
}
```

#### Artisans API

**List Artisans**
```http
GET /api/v1/artisans/
```

**Create Artisan Profile** (Requires artisan subscription)
```http
POST /api/v1/artisans/
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "bio": "Professional electrician with 10 years experience",
  "skills": ["electrical", "wiring", "repairs"],
  "hourly_rate": 25.00,
  "location": "Lagos, Nigeria"
}
```

#### Subscriptions API

**List Available Plans**
```http
GET /api/v1/subscription-plans/
```

**Subscribe to Plan**
```http
POST /api/v1/subscriptions/subscribe/
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "plan_id": "uuid-of-plan"
}
```

**Cancel Subscription**
```http
POST /api/v1/subscriptions/cancel/
Authorization: Bearer <access-token>
```

#### Payments API

**Initiate Payment**
```http
POST /api/v1/payments/initiate/
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "amount": 100.00,
  "payment_type": "subscription",
  "metadata": {"plan_id": "uuid"}
}
```

**Verify Payment**
```http
POST /api/v1/payments/verify/
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "reference": "payment-reference"
}
```

## Core Services & Features

### 1. User Management
- User registration with email verification
- JWT-based authentication
- Profile management
- Role-based permissions (admin, property manager, hotel manager, artisan)

### 2. Property Management
- CRUD operations for properties
- Advanced filtering and search
- Media upload with subscription limits
- Wishlist functionality
- Property approval workflow

### 3. Hotel Management
- Hotel listings and details
- Room booking system
- Media management
- Subscription-based hotel creation

### 4. Artisan Services
- Artisan profile management
- Service requests and hiring
- Rating and review system
- Subscription-based profile creation

### 5. Subscription System
- Multiple plan types (Property, Hotel, Artisan)
- Automatic billing via Paystack
- Usage limits and enforcement
- Subscription lifecycle management

### 6. Payment Processing
- Secure payments via Paystack
- Webhook handling for payment confirmation
- Subscription activation upon successful payment
- Payment history and tracking

### 7. Media Management
- File upload to Supabase Storage
- Automatic media validation
- Background media deletion
- Size and type restrictions

### 8. Admin Dashboard
- Analytics and reporting
- User and content management
- System monitoring
- Revenue tracking

## Use Case Flows

### 1. New User Registration & Property Listing

```
1. User visits website
2. Clicks "Sign Up"
3. Enters email, password, name
4. Receives OTP via email
5. Verifies email with OTP
6. Account activated
7. User can now browse properties
8. To list property → Subscribe to property plan
9. After subscription → Create property listing
10. Upload property photos/videos
11. Property goes live after admin approval
```

### 2. Hotel Manager Onboarding

```
1. User registers account
2. Subscribes to hotel plan via Paystack
3. Payment successful → Subscription activated
4. User can create hotel profile
5. Upload hotel photos
6. Set room rates and availability
7. Hotel appears in search results
8. Customers can book rooms
```

### 3. Artisan Service Provider

```
1. User registers account
2. Subscribes to artisan plan
3. Creates artisan profile with skills/services
4. Uploads portfolio photos
5. Sets hourly rates and availability
6. Customers can browse and hire artisans
7. Service requests and bookings
```

### 4. Customer Property Search

```
1. User browses property listings
2. Filters by location, price, type
3. Views property details and photos
4. Adds favorite properties to wishlist
5. Contacts property owner
6. Schedules property visits
```

### 5. Subscription Management

```
1. User views available plans
2. Selects plan and initiates payment
3. Completes Paystack checkout
4. Webhook confirms payment
5. Subscription automatically activated
6. User gains access to plan features
7. Daily checks deactivate expired subscriptions
8. Renewal reminders sent via email
```

### 6. Media Upload & Management

```
1. User with active subscription
2. Uploads image/video to property/hotel/artisan
3. File validated for size and type
4. Uploaded to Supabase storage
5. URL stored in database
6. Old media automatically deleted in background
7. Usage counted against subscription limits
```

## Database Schema

### Core Models

#### User
- Standard Django User fields
- `is_verified`: Email verification status
- `role`: User role (admin, property_manager, hotel_manager, artisan)

#### SubscriptionPlan
- `name`: Plan name
- `amount`: Monthly/yearly cost
- `interval`: billing frequency
- `max_properties`: Property creation limit
- `max_hotels`: Hotel creation limit
- `max_images/max_videos`: Media upload limits
- `is_artisan_plan/is_hotel_plan`: Plan type flags

#### UserSubscription
- `user`: Foreign key to User
- `plan`: Foreign key to SubscriptionPlan
- `start_date/end_date`: Subscription period
- `is_active`: Current status

#### Property
- `title`, `description`, `price`, `location`
- `owner`: Foreign key to User
- `media_urls`: JSON array of media URLs
- `status`: approved/pending/rejected

#### Hotel
- `name`, `description`, `location`
- `manager`: Foreign key to User
- `nightly_rate`, `total_rooms`
- `media_urls`: JSON array

#### ArtisanProfile
- `user`: One-to-one with User
- `bio`, `skills`, `hourly_rate`
- `media_urls`: JSON array

#### Payment
- `user`, `amount`, `reference`
- `payment_type`: subscription/property_purchase/etc
- `status`: pending/success/failed
- `metadata`: Additional data

## Environment Configuration

### Required Environment Variables

```env
# Django Core
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=festari_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=db
DB_PORT=5432

# Redis
REDIS_URL=redis://redis:6379/0

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=service-role-key
SUPABASE_BUCKET=festari-media

# Paystack
PAYSTACK_SECRET_KEY=sk_test_xxx
PAYSTACK_WEBHOOK_SECRET=whsec_xxx

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=app-password
EMAIL_USE_TLS=True

# CORS & Security
CORS_ALLOWED_ORIGINS=http://localhost:3000
CSRF_TRUSTED_ORIGINS=http://localhost:3000
```

## Deployment

### Production Considerations

1. **Security**
   - Set `DEBUG=False`
   - Use strong `SECRET_KEY`
   - Configure HTTPS
   - Set up proper CORS policies

2. **Database**
   - Use managed PostgreSQL
   - Configure backups
   - Set up read replicas for scaling

3. **File Storage**
   - Configure Supabase for production
   - Set up CDN for media files

4. **Email**
   - Use transactional email service (SendGrid, Mailgun)
   - Configure SPF/DKIM

5. **Monitoring**
   - Set up logging
   - Configure error tracking (Sentry)
   - Monitor Celery tasks

### Docker Production Setup

```yaml
# docker-compose.prod.yml
version: '3.9'
services:
  server:
    environment:
      - DEBUG=False
      - DJANGO_SETTINGS_MODULE=festari_backend.settings
    env_file:
      - .env.prod
```

## Support

For API documentation, visit:
- Swagger UI: http://localhost:8000/swagger/
- ReDoc: http://localhost:8000/redoc/
