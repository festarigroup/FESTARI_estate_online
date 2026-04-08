# FESTARI Estate Online API Reference

## Base URL
```
http://localhost:8000/api/
```

## Authentication
All API requests require authentication except for registration and login endpoints.

### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/refresh/` - Refresh JWT token
- `POST /api/auth/forgot-password/` - Password reset request
- `POST /api/auth/reset-password/` - Password reset confirmation
- `GET /api/auth/profile/` - Get user profile
- `PUT /api/auth/profile/` - Update user profile

### Properties
- `GET /api/properties/` - List properties (with filters)
- `POST /api/properties/` - Create property (Manager/Admin only)
- `GET /api/properties/{id}/` - Get property details
- `PUT /api/properties/{id}/` - Update property (Manager/Admin only)
- `DELETE /api/properties/{id}/` - Delete property (Admin only)
- `GET /api/properties/{id}/images/` - Get property images
- `POST /api/properties/{id}/images/` - Upload property images

### Property Inquiries
- `GET /api/common/property-inquiries/` - List property inquiries
- `POST /api/common/property-inquiries/` - Create property inquiry
- `GET /api/common/property-inquiries/{id}/` - Get inquiry details
- `PUT /api/common/property-inquiries/{id}/mark-read/` - Mark inquiry as read
- `DELETE /api/common/property-inquiries/{id}/` - Delete inquiry (Admin only)

### Hotels
- `GET /api/hotels/` - List hotels
- `POST /api/hotels/` - Create hotel (Manager/Admin only)
- `GET /api/hotels/{id}/` - Get hotel details
- `PUT /api/hotels/{id}/` - Update hotel (Manager/Admin only)
- `DELETE /api/hotels/{id}/` - Delete hotel (Admin only)
- `PUT /api/hotels/{id}/approve/` - Approve hotel (Admin only)
- `PUT /api/hotels/{id}/reject/` - Reject hotel (Admin only)

### Hotel Bookings
- `GET /api/hotels/{hotel_id}/bookings/` - List hotel bookings
- `POST /api/hotels/{hotel_id}/bookings/` - Create booking
- `GET /api/hotels/bookings/{id}/` - Get booking details
- `PUT /api/hotels/bookings/{id}/` - Update booking
- `DELETE /api/hotels/bookings/{id}/` - Cancel booking

### Artisans
- `GET /api/artisans/` - List artisans (with filters)
- `POST /api/artisans/` - Register as artisan
- `GET /api/artisans/{id}/` - Get artisan profile
- `PUT /api/artisans/{id}/` - Update artisan profile
- `DELETE /api/artisans/{id}/` - Delete artisan profile (Admin only)
- `PUT /api/artisans/{id}/approve/` - Approve artisan (Admin only)
- `PUT /api/artisans/{id}/reject/` - Reject artisan (Admin only)

### Artisan Inquiries
- `GET /api/common/artisan-inquiries/` - List artisan inquiries
- `POST /api/common/artisan-inquiries/` - Create artisan inquiry
- `GET /api/common/artisan-inquiries/{id}/` - Get inquiry details
- `PUT /api/common/artisan-inquiries/{id}/mark-read/` - Mark inquiry as read
- `DELETE /api/common/artisan-inquiries/{id}/` - Delete inquiry (Admin only)

### Subscriptions
- `GET /api/subscriptions/plans/` - List subscription plans
- `POST /api/subscriptions/subscribe/` - Subscribe to plan
- `GET /api/subscriptions/my-subscription/` - Get current subscription
- `PUT /api/subscriptions/cancel/` - Cancel subscription
- `GET /api/subscriptions/history/` - Subscription history

### Payments
- `GET /api/payments/` - List user payments
- `POST /api/payments/initiate/` - Initiate payment
- `GET /api/payments/{id}/` - Get payment details
- `POST /api/payments/webhook/` - Payment webhook (Paystack)
- `POST /api/payments/verify/{reference}/` - Verify payment

### Dashboard (Admin/Manager)
- `GET /api/dashboard/stats/` - Platform statistics
- `GET /api/dashboard/recent-activity/` - Recent platform activity
- `GET /api/dashboard/pending-approvals/` - Items pending approval

## Response Formats

### Success Response
```json
{
  "status": "success",
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "errors": { ... }
}
```

### Paginated Response
```json
{
  "status": "success",
  "data": {
    "count": 100,
    "next": "http://localhost:8000/api/properties/?page=2",
    "previous": null,
    "results": [ ... ]
  }
}
```

## Filtering & Sorting

### Properties
- `?location=city` - Filter by location
- `?property_type=apartment` - Filter by type
- `?min_price=100000` - Minimum price
- `?max_price=500000` - Maximum price
- `?bedrooms=2` - Number of bedrooms
- `?ordering=-created_at` - Sort by creation date (desc)

### Artisans
- `?service_type=plumbing` - Filter by service type
- `?location=city` - Filter by location
- `?rating=4` - Minimum rating
- `?ordering=-rating` - Sort by rating

### Bookings
- `?status=confirmed` - Filter by status
- `?check_in_date=2024-01-01` - Filter by check-in date
- `?ordering=-created_at` - Sort by creation date

## File Upload

### Image Upload
- **Endpoint**: `POST /api/properties/{id}/images/`
- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `image`: Image file (JPEG, PNG, max 5MB)
  - `alt_text`: Optional description

### Document Upload
- **Endpoint**: `POST /api/artisans/{id}/documents/`
- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `document`: PDF file (max 10MB)
  - `document_type`: Type of document

## Webhooks

### Paystack Payment Webhook
- **Endpoint**: `POST /api/payments/webhook/`
- **Headers**:
  - `X-Paystack-Signature`: Webhook signature
- **Events**: `charge.success`, `charge.failed`, `transfer.success`

## Rate Limiting
- **Authenticated requests**: 1000/hour
- **Unauthenticated requests**: 100/hour
- **File uploads**: 50/hour

## Error Codes
- `400`: Bad Request - Invalid input data
- `401`: Unauthorized - Missing or invalid authentication
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource doesn't exist
- `409`: Conflict - Resource already exists
- `422`: Unprocessable Entity - Validation errors
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error - Server error

## SDKs & Libraries
- **Python**: `requests` library for API calls
- **JavaScript**: `axios` or `fetch` for frontend integration
- **Postman Collection**: Available in `/docs/postman_collection.json`

## Testing
- **Base URL for testing**: `http://localhost:8000/api`
- **Test credentials**: Available in development environment
- **API documentation**: Interactive Swagger UI at `/api/docs/`

## Support
For API support or questions:
- Email: support@festariestate.com
- Documentation: `/docs/`
- Issues: GitHub repository