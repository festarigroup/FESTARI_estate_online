# FESTARI Estate Online — Stakeholder Update

**Last updated:** August 10, 2026
**Status:** Live in production — client (Vercel) and backend (Render) deployed and talking to
each other in real production traffic.

## 1. What FESTARI Is

FESTARI Estate Online is a real-estate and hospitality platform that connects property
buyers/sellers, hotel/venue guests, and service artisans — layered with an Instagram/Facebook-style
social feed, so users discover listings and services by browsing a timeline rather than only
through a search form.

## 2. Stack

| Layer | Stack |
|---|---|
| Backend | Node.js + Express 5 + Drizzle ORM, PostgreSQL (Supabase-hosted), TypeScript |
| Frontend | Next.js (App Router) + React 19 + TypeScript + Tailwind CSS |
| Auth | JWT access/refresh tokens, multi-role accounts |
| Hosting | Backend on Render, frontend on Vercel |

The original Django (Python) backend from earlier iterations of this project has been fully
retired and replaced by the stack above.

## 3. What's Actually Wired Up (Frontend ⇄ Backend)

This is the important part for planning what's demoable today vs. what still needs frontend work.
The backend has significantly more built than the frontend currently calls — several features are
**API-complete but have no UI consuming them yet**.

### ✅ Fully connected — real data, real network calls, working end to end

| Feature | What it does |
|---|---|
| **Sign up / log in / log out** | Real accounts, OTP email verification, Google Sign-In, JWT refresh — no mock users |
| **Home feed** | Stories, posts (general/property/service), likes, comments, shares, saves — all read from and written to the live database |
| **My Activity** | Shows a user's own real posts, with working edit and delete against the backend |
| **Create Post** | Composer posts (with photos, a tagged property, or a tagged service) actually create real rows in the database — a property-tagged post becomes a real, searchable property listing |
| **Properties page** | Listing grid + map pulls real property listings from the backend, filtered live |
| **Stay page** | Venue listing grid pulls real venue-tagged posts from the backend |
| **Saved posts** | Save/unsave persists to the backend (`/feed/saved`), not just local storage |
| **Follow / Who to Follow** | Real follow graph, real suggestions |
| **Property enquiry** | Enquiry form submits to the backend and notifies the property owner |
| **Book a service (artisan)** | "Book" on a service post creates a real hire request against a real artisan profile |
| **Reserve a venue** | Booking modal creates a real hotel/venue booking, with the total price calculated server-side |
| **Top bar unread badges** | The message and notification bell counts in the top nav are live counts pulled from the backend |

### 🟡 Backend built, frontend not connected yet

These have working, documented API endpoints on the server, but the corresponding page in the app
is still a placeholder ("Coming soon") or doesn't call the endpoint:

| Feature | Backend status | Frontend status |
|---|---|---|
| **Messages** (full inbox) | 1:1 messaging endpoints exist | Page is a "Coming soon" placeholder — only the unread-count badge in the top bar is wired |
| **Notifications** (full feed) | Unified notifications endpoint exists | Page is a "Coming soon" placeholder — only the unread-count badge is wired |
| **Craftwork** (artisan browse/hire hub) | Artisan endpoints exist and are used elsewhere (e.g. Book Service modal) | Dedicated page is a "Coming soon" placeholder |
| **Professionals** (agents/designers directory) | No dedicated backend model for this yet | Page is a "Coming soon" placeholder |
| **Pricing / Subscriptions** | Subscription plans, limits, and Paystack billing exist on the backend | No pricing page UI or subscription-purchase flow wired up yet |
| **Admin dashboard** | Approval workflows + analytics endpoints exist (properties/hotels/artisans, platform stats) | No admin UI in the frontend at all yet — backend-only today |

### ⚪ Not built on either side yet

- Poll and "venue attachment" post types in the composer are UI-only mockups — they don't post to
  the API yet
- Real-time messaging (current messaging is REST, no live/WebSocket channel)

## 4. Recent Work This Sprint

- Fixed text overflow on venue/property cards (long names, locations, prices) — now truncates
  cleanly on narrow screens instead of breaking layout
- Fixed a real mobile bug where a venue listing's "Message + Reserve" buttons got clipped
  off-screen on very narrow phones — they now wrap instead of clipping
- Unified card styling app-wide: consistent corner rounding (19px mobile / 24px desktop) and a
  single flat-border look in place of mismatched drop-shadows
- Deployed the latest client build to production and confirmed, via a live automated check, that
  the deployed frontend and the deployed backend are correctly connected (login + real feed data
  load with zero errors)

## 5. Suggested Next Priorities

Given the gap above, the highest-leverage frontend work to close next is wiring up the pages that
already have a working backend behind them: **Messages**, **Notifications**, and **Pricing/
Subscriptions** — these need frontend integration only, not new backend work. **Admin** and
**Professionals** would need backend work first (admin UI + a professionals data model,
respectively).

## 6. Documentation

Full technical documentation lives under [`docs/`](../docs/README.md):
- [`platform-overview.md`](platform-overview.md) — architecture and flows in depth
- [`api-reference.md`](api-reference.md) — endpoint reference
- [`home-feed-api-endpoints.md`](home-feed-api-endpoints.md) / [`home-feed-db-schema.md`](home-feed-db-schema.md) — social feed specifics
- [`setup-deployment.md`](setup-deployment.md) — local setup and deployment instructions
