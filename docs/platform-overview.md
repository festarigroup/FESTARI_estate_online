# FESTARI Estate Online Platform Documentation

## Overview
FESTARI Estate Online is a comprehensive estate management platform built with Django REST Framework backend and Next.js frontend. The platform enables property management, hotel bookings, artisan services, subscription-based access, and secure payment processing.

## Core Platform Flows

### 1. User Authentication & Registration Flow
- **Registration**: Users can sign up via email/password or OAuth (Google, etc.)
- **Email Verification**: Account activation via email link
- **Login**: JWT-based authentication with role assignment (user, manager, admin)
- **Password Reset**: Secure password recovery via email
- **Profile Management**: Update personal information and preferences

### 2. Property Management Flow
- **Property Listing**: Managers/admins can create and manage property listings
- **Property Search**: Users can browse properties with filters (location, price, type)
- **Property Details**: View detailed property information with images
- **Property Booking**: Users can inquire about properties via contact form
- **Admin Approval**: Property inquiries require admin approval before processing

### 3. Hotel Booking Flow
- **Hotel Listing**: Browse available hotels with amenities and pricing
- **Room Selection**: Choose room types and dates
- **Booking Creation**: Submit booking with payment
- **Payment Processing**: Secure payment via Paystack integration
- **Booking Confirmation**: Email confirmation with booking details
- **Admin Management**: Hotel managers can approve/reject bookings

### 4. Artisan Services Flow
- **Artisan Registration**: Service providers register with profiles
- **Service Categories**: Browse artisans by service type (plumbing, electrical, etc.)
- **Service Requests**: Users can submit service inquiries
- **Artisan Approval**: Admin approval required for artisan listings
- **Service Booking**: Direct booking with artisans
- **Review System**: Rating and feedback for completed services

### 5. Subscription Management Flow
- **Plan Selection**: Choose from available subscription plans
- **Payment Processing**: Secure subscription payment
- **Access Control**: Subscription-based feature access
- **Renewal Reminders**: Automated email notifications
- **Expiration Handling**: Graceful handling of expired subscriptions

### 6. Payment Processing Flow
- **Payment Initiation**: Secure payment gateway integration (Paystack)
- **Webhook Handling**: Real-time payment status updates
- **Transaction Records**: Complete payment history tracking
- **Refund Processing**: Support for payment reversals
- **Invoice Generation**: Automated receipt generation

### 7. Contact & Messaging Flow
- **Property Inquiries**: Contact forms for property interest
- **Artisan Inquiries**: Service request messaging
- **Admin Notifications**: Email alerts for new inquiries
- **Message Management**: Admin dashboard for inquiry management
- **Response System**: Direct communication channels

### 8. Admin Management Flow
- **User Management**: Admin oversight of user accounts
- **Content Approval**: Review and approve hotels, artisans, properties
- **Analytics Dashboard**: Platform usage and performance metrics
- **System Configuration**: Settings and maintenance controls
- **Notification Management**: Email template and communication settings

## Technical Architecture

### Backend (Django REST Framework)
- **Authentication**: JWT with role-based permissions
- **Database**: PostgreSQL with optimized queries
- **File Storage**: Supabase for media uploads
- **Background Tasks**: Celery + Redis for async processing
- **Email System**: SMTP-based notifications with templates
- **Payment Integration**: Paystack API with webhook support

### Frontend (Next.js)
- **UI Framework**: React with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React hooks and context
- **API Integration**: RESTful API consumption
- **Authentication**: JWT token management

### Infrastructure
- **Containerization**: Docker for consistent deployment
- **Orchestration**: Docker Compose for multi-service setup
- **Database**: PostgreSQL with connection pooling
- **Caching**: Redis for session and data caching
- **Monitoring**: Logging and error tracking

## Security Features
- JWT authentication with refresh tokens
- Role-based access control (User, Manager, Admin)
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Secure file upload handling
- Payment data encryption

## API Design Principles
- RESTful architecture
- Consistent response formats
- Comprehensive error handling
- Pagination for large datasets
- Filtering and sorting capabilities
- Versioned API endpoints
- Swagger documentation

## Deployment & Scaling
- Docker containerization
- Environment-based configuration
- Database migrations
- Static file serving
- CDN integration for media
- Horizontal scaling support