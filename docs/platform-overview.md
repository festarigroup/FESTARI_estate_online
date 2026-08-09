# FESTARI Estate Online Platform Documentation

## Overview
FESTARI Estate Online is a comprehensive estate platform connecting buyers, sellers, artisans,
and hotels, with an Instagram/Facebook-style social feed layered on top. Built with a Node.js
(Express + Drizzle ORM) backend and a Next.js frontend. The platform enables property management,
hotel bookings, artisan services, subscription-based access, secure payment processing, and a
home feed of stories/posts/likes/comments/shares/saves/follows/messages.

## Core Platform Flows

### 1. User Authentication & Registration Flow
- **Registration**: Email/password, with account activation via a one-time emailed code (not an
  activation link). Google Sign-In also supported, pre-verified on first sign-in.
- **Email Verification**: 6-digit OTP, 10-minute expiry, 5-attempt lockout. Login is blocked
  until the account is verified.
- **Login**: JWT (access + refresh) with multi-role assignment — a single account can hold more
  than one role at once (e.g. buyer *and* artisan), not just one of buyer/manager/admin.
- **Password Reset**: OTP-based, same mechanism as email verification, revokes all existing
  sessions on success.
- **Profile Management**: Update personal information, avatar upload via Supabase Storage.

### 2. Property Management Flow
- **Property Listing**: Any authenticated user can list, gated by their subscription plan's
  `max_properties` limit (a small free-tier default applies with no active subscription).
- **Property Search**: Filter by location, price range, property type, listing type, bedrooms.
- **Property Details**: Full listing with an ordered image gallery.
- **Property Enquiry**: Contact form (name/email/phone/message), no account required to send one.
- **Admin Approval**: New listings start `pending`; only `approved` listings appear in public
  search until an admin approves or rejects them.

### 3. Hotel Booking Flow
- **Hotel Listing**: Browse hotels with amenities, location, nightly rate.
- **Booking Creation**: Date range + guest count; total price computed server-side from nights ×
  rate — the client never sends a total.
- **Payment Processing**: Paystack, through the same generic payment flow every other paid action
  uses (see Payment Processing Flow below) — no separate hotel-specific payment path.
- **Booking Confirmation**: The hotel owner is notified in-app when a booking is created.
- **Admin/Owner Management**: Hotel owners approve/reject listings' pending status; bookings can
  be updated (status) or cancelled by the booker, owner, or an admin.

### 4. Artisan Services Flow
- **Artisan Registration**: One profile per account, `service_type` + bio + location, starts
  `pending` until admin approval.
- **Service Categories**: Browse/filter by `service_type`.
- **Hire Requests**: A buyer submits a free request (message only, no payment collected) — the
  artisan accepts/rejects/completes it. Payment, if any, is a follow-up action after acceptance,
  not part of the hire request itself.
- **Review System**: 1-5 star ratings + comment after a completed hire; `average_rating` is
  always computed from `artisan_reviews` at query time, never stored on the profile.

### 5. Subscription Management Flow
- **Plan Selection**: Plans carry both a Paystack billing interval/amount and feature-gating
  limits (`max_properties`, `max_hotels`, `max_images`, `max_videos`, `can_feature_properties`).
- **Payment Processing**: Paystack, generic payment flow.
- **Access Control**: Every gated action (listing creation, image upload) checks the caller's
  active plan (or a free-tier default) before proceeding.
- **Expiration Handling**: An hourly cron job (`server/src/app/jobs/expireSubscriptions.ts`) flips
  active subscriptions past their `expires_at` to `expired`.

### 6. Payment Processing Flow
- **Payment Initiation**: One generic `payments` table serves subscriptions, property purchases,
  hotel bookings, and artisan hires alike, discriminated by `payment_type` — not four separate
  payment models. No wallet/stored balance anywhere in the platform; every payment is per-transaction.
- **Webhook Handling**: Paystack webhook, signature-verified, deduplicated by event id so a
  redelivered webhook is a no-op.
- **Transaction Records**: `GET /payments` returns the caller's own payment history.

### 7. Home Feed & Social Flow
- **Stories**: 24-hour ephemeral photo/video posts, grouped into one rail bubble per author.
- **Posts**: `property` (backed by a real listing), `service` (optionally linked to an artisan
  profile), or `general` (free-form text/photos). A property-tagged post created through the
  composer creates an actual `Property` row, not just caption text — it's independently
  queryable/filterable like any other listing.
- **Engagement**: Like, comment, share (repeatable, not deduped), save — all backed by dedicated
  join tables, with counts computed at query time rather than stored on the post.
- **Follow graph**: Follow/unfollow, "who to follow" suggestions, following/followers lists.
- **Messaging**: 1:1 conversations, REST + client polling (no WebSocket/real-time channel yet).
- **Out of scope**: poll attachments and a distinct "venue" post kind aren't modeled yet — the
  composer's Poll and Venue attachment types still post locally only, not through the API.

### 8. Contact & Notifications Flow
- **Property/Artisan Inquiries**: Contact forms, notify the property owner / artisan in-app on
  submission.
- **Notifications**: One unified table for every notification kind (like, comment, follow,
  booking, inquiry, hire_request, message, system) — a single `notify()` call from any producer,
  rather than a separate mechanism per domain.
- **Admin Notifications**: Admins see pending-approval items via the dashboard, not a separate
  inbox.

### 9. Admin Management Flow
- **User Management**: Admin oversight of accounts via `GET /users`.
- **Content Approval**: Approve/reject properties, hotels, artisans (all share the same
  pending/approved/rejected moderation pattern).
- **Analytics Dashboard**: Platform stats (counts, active subscriptions, revenue by payment type),
  recent activity, pending approvals — admin-only endpoints under `/dashboard`.

## Technical Architecture

### Backend (Node.js + Express + Drizzle ORM)
- **Stack**: Express 5, Drizzle ORM (PostgreSQL), Joi validation, TypeScript throughout.
- **Authentication**: JWT (access + refresh) with multi-role permissions — no session cookies.
- **Database**: PostgreSQL (Supabase-hosted in this repo's default config).
- **File Storage**: Supabase Storage for avatars, property/hotel/post images, and story media.
- **Background Tasks**: `node-cron` for the hourly subscription-expiry job — no Celery/Redis;
  this backend has no task queue or cache layer.
- **Email System**: Resend/SMTP (`nodemailer`) for OTP codes.
- **Payment Integration**: Paystack API with webhook support.
- **Docs**: Swagger UI at `/api-docs`, generated from JSDoc comments in `server/src/app/docs/`.

### Frontend (Next.js)
- **UI Framework**: React 19 + TypeScript, Next.js App Router.
- **Styling**: Tailwind CSS.
- **State Management**: React hooks and context (`AuthContext` for the signed-in user), no
  Redux/Zustand/React Query — data fetching is plain `useEffect` + the `lib/api/*` client modules.
- **API Integration**: `lib/api/client.ts` — a `fetch` wrapper handling the `Authorization` header,
  the `{success,data}`/`{success:false,error}` envelope, and one automatic refresh-and-retry on a
  401 before giving up.
- **Authentication**: Access/refresh tokens in `localStorage`; every route under the `(app)` group
  redirects to `/login` when there's no signed-in user.

### Infrastructure
- **Containerization**: `server/Dockerfile` and `client/Dockerfile`, orchestrated via the root
  `docker-compose.yml` — no Redis/Celery services (this stack has neither).
- **Database**: PostgreSQL, no connection-pooler layer configured beyond what the hosting
  provider (Supabase) already does.
- **Monitoring**: `morgan` request logging; no centralized log aggregation configured yet.

## Security Features
- JWT authentication with refresh tokens
- Multi-role access control (`buyer`, `estate_manager`, `hotel_manager`, `artisan`, `admin` — a
  user can hold several at once)
- Joi input validation on every mutating endpoint
- Parameterized queries throughout (Drizzle ORM — no raw string-concatenated SQL)
- Secure file upload handling (MIME allowlist, size limits, Supabase Storage — never local disk)
- Paystack webhook signature verification

## API Design Principles
- RESTful architecture, versioned under `/api/v1/`
- Consistent `{success, data, message?}` / `{success:false, error:{code,message}}` response envelope
- Centralized error handling (`errorController.ts`), including Postgres unique-violation → 409 mapping
- Pagination via `current_page`/`limit`, response shape `{items, metadata}`
- Filtering and sorting on list endpoints (properties, hotels, artisans)
- Swagger documentation at `/api-docs`

## Deployment & Scaling
- Docker containerization (server + client, no Redis/Celery services)
- Environment-based configuration (`.env`, `.env.development`, `.env.example`)
- Drizzle migrations (`npm run db:generate` / `db:migrate:run`)
- Supabase Storage + CDN for media, no local static-file serving
- Horizontal scaling is straightforward for the API (stateless, JWT-only) — the only shared state
  is the Postgres database and Supabase Storage
