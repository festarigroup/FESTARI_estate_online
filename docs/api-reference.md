# FESTARI Estate Online API Reference

## Base URL
```
http://localhost:3030/api/v1/
```
(`PORT` and `API_BASE_URL` are configurable via `server/.env` — 3030 is this repo's default.)

## Stack
Node.js + TypeScript + Express 5, Drizzle ORM (PostgreSQL), Joi validation. Not Django —
this document describes the current backend under `server/src`, which replaced an earlier
Django REST Framework implementation.

## Authentication
Every endpoint below is public unless marked **Auth required**. Authenticated requests send:
```
Authorization: Bearer <access_token>
```
Access tokens expire after 1 day; refresh tokens after 7 days. There is no session cookie —
tokens are issued in the JSON body of register/login/google/verify-otp responses and must be
stored and sent by the client. A user can hold multiple roles at once (e.g. `buyer` and
`artisan`); the JWT payload carries `roles: string[]`, not a single role.

Roles: `buyer`, `estate_manager`, `hotel_manager`, `artisan`, `admin`.

## Response Formats

### Success
```json
{ "success": true, "data": { ... }, "message": "Optional human-readable message" }
```

### Error
```json
{ "success": false, "error": { "code": "SOME_CODE", "message": "What went wrong" } }
```

### Paginated list
List endpoints that accept `current_page`/`limit` return:
```json
{
  "success": true,
  "data": {
    "items": [ ... ],
    "metadata": { "total": 100, "pages": 5, "current_page": 1, "limit": 20 }
  }
}
```

## Auth — `/auth`
- `POST /auth/register` — `{ firstname, lastname, email, password, roles: string[] }`. Creates
  an unverified account and emails a 6-digit OTP. **Login is blocked until verified.**
- `POST /auth/login` — `{ email, password }` → `{ accessToken, refreshToken, sessionId, user }`.
- `POST /auth/google` — `{ idToken, role }`. Verifies a Google ID token, creates the account on
  first sign-in (pre-verified), adds `role` if the account doesn't already have it. Same token
  response shape as login.
- `POST /auth/verify-otp` — `{ email, otp, purpose: "email_verification" | "password_reset" }`.
- `POST /auth/resend-otp` — `{ email, purpose }`.
- `POST /auth/forgot-password` — `{ email }`. Emails a password-reset OTP.
- `POST /auth/reset-password` — `{ email, otp, newPassword }`. Revokes all existing sessions.
- `POST /auth/refresh-token` — `{ refreshToken }` → `{ accessToken }`.
- `POST /auth/logout` **Auth required** — `{ sessionId? }`. Revokes one session, or all sessions
  if `sessionId` is omitted.

## Users — `/users`
- `GET /users` — paginated list.
- `GET /users/find?authKey=email|phone&authValue=...` — look up a user by email or phone.
- `GET /users/me` **Auth required**
- `POST /users/me/accept-terms` **Auth required**
- `POST /users/me/avatar` **Auth required** — `multipart/form-data`, field `avatar` (JPEG/PNG/WebP, max 5MB).
- `GET /users/:id`
- `PATCH /users/:id` **Auth required** — self only.

## Properties — `/properties`
- `GET /properties?location=&property_type=&listing_type=&min_price=&max_price=&bedrooms=&ordering=`
- `POST /properties` **Auth required** — gated by the caller's subscription `max_properties` limit.
- `GET /properties/:id`
- `PUT /properties/:id` **Auth required** — owner or admin.
- `DELETE /properties/:id` **Auth required** — owner or admin.
- `PUT /properties/:id/approve` **Admin only**
- `PUT /properties/:id/reject` **Admin only**
- `POST /properties/:id/images` **Auth required** — `multipart/form-data`, field `image` + `position`. Gated by the caller's `max_images` limit.
- `DELETE /properties/:id/images/:imageId` **Auth required**
- `GET /properties/categories` — listing-type counts for the category grid.
- `GET /properties/trending?limit=2`
- `GET /properties/wishlist` **Auth required**
- `POST /properties/:id/wishlist` **Auth required**
- `DELETE /properties/:id/wishlist` **Auth required**

`listing_type`: `for_sale | for_rent | short_stay`. `property_type`: `land | home | apartment | office`.
`status` (moderation): `pending | approved | rejected` — public list/detail only return `approved`.

## Hotels — `/hotels`
- `GET /hotels?location=&category=` — `category`: `hotel | resort | apartment | event_venue | short_stay`. Includes `average_rating`/`review_count` (computed from `hotel_reviews`, not stored).
- `POST /hotels` **Auth required** — gated by `max_hotels`. Accepts `category` (defaults `hotel`) and `rooms`.
- `GET /hotels/:id`
- `PUT /hotels/:id` / `DELETE /hotels/:id` **Auth required** — owner or admin.
- `PUT /hotels/:id/approve` / `PUT /hotels/:id/reject` **Admin only**
- `POST /hotels/:id/images` **Auth required** — same shape as property images.
- `DELETE /hotels/:id/images/:imageId` **Auth required**
- `GET /hotels/:hotelId/bookings` **Auth required** — hotel owner or admin.
- `POST /hotels/:hotelId/bookings` **Auth required** — `{ check_in, check_out, guests }`; total price computed server-side from nights × `price_per_night`.
- `GET /hotels/bookings/me` **Auth required**
- `GET /hotels/bookings/:id` **Auth required** — booker, hotel owner, or admin.
- `PUT /hotels/bookings/:id` **Auth required** — hotel owner or admin, updates `status`.
- `DELETE /hotels/bookings/:id` **Auth required** — booker or admin, cancels.
- `POST /hotels/:id/reviews` **Auth required** — `{ rating: 1-5, comment? }`.

A hotel can be linked into the home feed via `POST /feed/posts` with `kind: "venue"` and
`linked_hotel_id` — see [home-feed-api-endpoints.md](home-feed-api-endpoints.md). Every
like/comment/share/save on a venue post goes through the normal feed endpoints, since it's a
real post row, not a hotel-specific interaction system.

## Artisans — `/artisans`
- `GET /artisans?service_type=`
- `GET /artisans/top?limit=4` — ranked by average review rating.
- `GET /artisans/:id` — includes `average_rating`, `review_count`, and the review list.
- `POST /artisans` **Auth required** — creates the caller's own artisan profile (one per account).
- `PUT /artisans/:id` / `DELETE /artisans/:id` **Auth required** — owner or admin.
- `PUT /artisans/:id/approve` / `PUT /artisans/:id/reject` **Admin only**
- `POST /artisans/:id/hire` **Auth required** — `{ message }`. Free request — no payment is
  collected at hire time; that's a follow-up action once the artisan accepts.
- `GET /artisans/hire-requests/me` **Auth required** — requests the caller has sent.
- `GET /artisans/:id/hire-requests` **Auth required** — artisan or admin, requests they've received.
- `PUT /artisans/hire-requests/:id` **Auth required** — artisan or admin, `{ status: "accepted" | "rejected" | "completed" }`.
- `POST /artisans/:id/reviews` **Auth required** — `{ rating: 1-5, comment? }`.

## Inquiries — `/common`
- `POST /common/property-inquiries` — `{ property_id, name, email, phone?, message }`. No auth
  required to send one; `user_id` is attached automatically when the caller is signed in.
- `GET /common/property-inquiries?property_id=` **Auth required** — property owner or admin.
- `GET /common/property-inquiries/:id` **Auth required**
- `PUT /common/property-inquiries/:id/mark-read` **Auth required**
- `DELETE /common/property-inquiries/:id` **Admin only**
- `POST /common/artisan-inquiries` — `{ artisan_id, name, email, phone?, message }`.
- `GET /common/artisan-inquiries?artisan_id=` **Auth required** — artisan or admin.
- `GET /common/artisan-inquiries/:id` **Auth required**
- `PUT /common/artisan-inquiries/:id/mark-read` **Auth required**
- `DELETE /common/artisan-inquiries/:id` **Admin only**

## Subscriptions — `/subscriptions`
- `GET /subscriptions/plans`
- `POST /subscriptions/plans` **Admin only** — create a plan.
- `POST /subscriptions/subscribe` **Auth required** — creates a pending subscription + Paystack payment.
- `GET /subscriptions/my-subscription` **Auth required**
- `PUT /subscriptions/cancel` **Auth required**
- `GET /subscriptions/history` **Auth required**

Plans carry the feature-gating limits enforced elsewhere: `max_properties`, `max_hotels`,
`max_images`, `max_videos`, `can_feature_properties`. A user with no active subscription gets a
small free-tier default (see `subscriptionLimitService`).

## Payments — `/payments`
- `POST /payments/webhook` — Paystack webhook, verified by signature, not by auth token.
- `GET /payments` **Auth required** — the caller's own payments.
- `POST /payments/initiate` **Auth required** — `{ payment_type: "subscription" | "property" | "hotel_booking" | "artisan_hire", amount, ... }`, returns a Paystack authorization URL.
- `GET /payments/verify/:reference` **Auth required**
- `GET /payments/:id` **Auth required**

All payments — subscriptions, hotel bookings, artisan hires — go through this one generic table
and flow. There is no stored wallet/balance anywhere in this platform.

## Home Feed — `/feed`
See [home-feed-api-endpoints.md](home-feed-api-endpoints.md) for the full endpoint list (stories,
posts, likes, comments, shares, saves).

## Social — `/social`
All **Auth required**.
- `GET /social/suggestions?limit=5`
- `POST /social/follow/:userId` / `DELETE /social/follow/:userId`
- `GET /social/following`
- `GET /social/followers`

## Notifications — `/notifications`
All **Auth required**.
- `GET /notifications/preferences` / `PUT /notifications/preferences`
- `GET /notifications?limit=&offset=`
- `GET /notifications/unread-count` → `{ count }`
- `PUT /notifications/:id/read`
- `PUT /notifications/read-all`
- `DELETE /notifications/:id`
- `DELETE /notifications/clear-all`

Every like, comment, follow, booking, inquiry, hire request, and message emits one of these
through a single `notificationsService.notify()` call, distinguished by `verb` (`like | comment |
follow | booking | inquiry | hire_request | message | system`) and a decoupled
`target_type`/`target_id` pair (no foreign key — the notifications table stays independent of
every domain it might reference).

## Messages — `/messages`
All **Auth required**. 1:1 conversations only (the schema allows group chat later, nothing
in this app creates one yet).
- `GET /messages/conversations`
- `POST /messages/conversations` — `{ participant_id }`, finds or creates the 1:1 conversation.
- `GET /messages/conversations/:id`
- `POST /messages/conversations/:id/messages` — `{ body }`.
- `GET /messages/unread-count` → `{ count }`

## Dashboard — `/dashboard`
**Admin only.**
- `GET /dashboard/stats` — platform counts, active subscriptions, revenue by payment type.
- `GET /dashboard/recent-activity`
- `GET /dashboard/pending-approvals` — properties/hotels/artisans awaiting moderation.

## File Upload
Every image upload endpoint (`properties/:id/images`, `hotels/:id/images`,
`feed/posts/:id/images`, `feed/stories`) is `multipart/form-data`, stored in Supabase Storage,
and limited to JPEG/PNG/WebP (plus MP4/MOV/WebM for stories, up to 20MB). Feature-limited
resources (properties, hotels) are additionally gated by the caller's subscription plan.

## Webhooks
### Paystack
- **Endpoint**: `POST /api/v1/payments/webhook`
- **Header**: `X-Paystack-Signature`
- Deduplicated by event id (`paystack_webhook_events` table) so a redelivered webhook is a no-op.

## Error Codes
- `400` Bad Request · `401` Unauthorized · `403` Forbidden · `404` Not Found ·
  `409` Conflict (e.g. duplicate email) · `429` Too Many Requests (OTP rate limiting) ·
  `500` Internal Server Error

## API Documentation
Interactive Swagger UI is served at `/api-docs` (JSDoc source: `server/src/app/docs/*.docs.ts`,
currently covering auth/payments/notifications/example — the newer domains below aren't
annotated yet).
