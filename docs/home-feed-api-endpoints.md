# Home Feed — Required API Endpoints

The `client/` Home screen (`src/app/(app)/page.tsx`, from Figma node `3303:5277`) is currently
wired to static mock data in `client/src/lib/mock-data.ts`. This document specs the backend
surface needed to replace that mock data with real data, following the conventions already
established in [api-reference.md](api-reference.md) (auth, response envelope, pagination,
filtering) and the routes actually registered in `server/festari_backend/urls.py`.

> **Note on base path**: `api-reference.md` documents the base URL as `/api/`, but the real
> mount in `festari_backend/urls.py` is `/api/v1/` (`path("api/v1/", include("apps.properties.urls"))`,
> etc.). This doc uses the real `/api/v1/` prefix — worth reconciling with `api-reference.md`
> separately.

## Base URL
```
http://localhost:8000/api/v1/
```

## Authentication
Same as the rest of the platform: `Authorization: Bearer <jwt_token>`. All endpoints below
require an authenticated user unless marked **Public**.

## Response formats
Reuses the platform's existing envelope — success/error/paginated shapes as documented in
[api-reference.md](api-reference.md#response-formats). List endpoints below are paginated
the same way (`count` / `next` / `previous` / `results`).

---

## 1. Stories
Backs the `StoryBar` component (`Create Story` + ringed avatars, `LIVE` badge).

- `GET /api/v1/feed/stories/` — List active stories from people/businesses the current user
  follows (or trending, if none), most recent first. Excludes expired stories (24h TTL).
- `POST /api/v1/feed/stories/` — Create a story. `multipart/form-data`: `media` (image/video,
  required), `caption` (optional).
- `GET /api/v1/feed/stories/{id}/` — Get one story (used when opening the viewer).
- `DELETE /api/v1/feed/stories/{id}/` — Delete own story.
- `POST /api/v1/feed/stories/{id}/view/` — Mark viewed by the current user (dedupes via
  `StoryView`; used to drive a "seen/unseen" ring state the current Figma frame doesn't show
  but most story UIs need).

## 2. Feed Posts
Backs `PostComposer`, `FeedPostCard` (`PropertyPostCard` / `ServicePostCard` variants).

- `GET /api/v1/feed/posts/` — List the home timeline, paginated, newest first.
  - `?kind=property|service|general` — filter by post kind.
- `POST /api/v1/feed/posts/` — Create a post.
  ```json
  {
    "kind": "property",           // "property" | "service" | "general"
    "body": "Just listed this beautiful 4 bedroom house...",
    "hashtags": "#NewListing #EastLegon #ForSale #FestariEstates",
    "linked_property_id": "uuid or null",   // set when kind = "property"
    "linked_artisan_id": "uuid or null"      // set when kind = "service"
  }
  ```
- `GET /api/v1/feed/posts/{id}/` — Get one post with its images and reaction counts.
- `PUT /api/v1/feed/posts/{id}/` — Update own post.
- `DELETE /api/v1/feed/posts/{id}/` — Delete own post.
- `POST /api/v1/feed/posts/{id}/images/` — Upload post image(s), same convention as
  `POST /api/v1/properties/{id}/images/`. `multipart/form-data`: `image`, `position`.

## 3. Post interactions
Backs `PostEngagementBar` (Like / Comment / Share / Save) and the reaction-avatar stack.

- `POST /api/v1/feed/posts/{id}/like/` / `DELETE /api/v1/feed/posts/{id}/like/` — Like / unlike.
- `GET /api/v1/feed/posts/{id}/comments/` — List comments, paginated.
- `POST /api/v1/feed/posts/{id}/comments/` — Add a comment. `{ "body": "..." }`.
- `DELETE /api/v1/feed/comments/{id}/` — Delete own comment.
- `POST /api/v1/feed/posts/{id}/share/` — Record a share (increments the share count shown
  under the post; the actual "share" UX — copy link, repost — is a frontend concern).
- `POST /api/v1/feed/posts/{id}/save/` / `DELETE /api/v1/feed/posts/{id}/save/` — Save / unsave.
- `GET /api/v1/feed/saved/` — List the current user's saved posts (backs the sidebar `Saved`
  nav item).

## 4. Book Service (from a service post)
The `ServicePostCard`'s "Book Service" button doesn't need a new endpoint — it should call the
**existing** artisan hire flow once it's exposed:
- `POST /api/v1/artisans/{artisan_id}/hire/` — not yet listed in `api-reference.md`; the
  `ArtisanHireRequest` model already exists in `apps/artisans/models.py`, so this is likely a
  missing route rather than missing schema. Flagging here since the Home feed depends on it.

## 5. Social graph (follow)
Backs `WhoToFollow` and the follow/unfollow toggle.

- `GET /api/v1/social/suggestions/` — "Who to follow" suggestions (people/businesses the
  current user doesn't already follow, ranked by mutuals/activity).
- `POST /api/v1/social/follow/{user_id}/` / `DELETE /api/v1/social/follow/{user_id}/` — Follow /
  unfollow a user or business account.
- `GET /api/v1/social/following/` — Who the current user follows.
- `GET /api/v1/social/followers/` — Who follows the current user.

## 6. Explore by Category
Backs `CategoryGrid` (For Sale / For Rent / Short Stay / Lands / Homes / Apartments / Offices /
More). This is a thin filter over the **existing** `properties` app, not a new resource — but
`Property` doesn't yet carry the fields needed to filter this way. See
[home-feed-db-schema.md](home-feed-db-schema.md#additions-to-existing-models).

- `GET /api/v1/properties/categories/` — Returns each category with its live count, e.g.:
  ```json
  { "data": [
    { "id": "for-sale", "label": "For Sale", "count": 214 },
    { "id": "for-rent", "label": "For Rent", "count": 88 }
  ] }
  ```
- Existing `GET /api/v1/properties/?listing_type=for_sale` / `?property_type=apartment` then
  serves the actual "See all" / category-click destination.

## 7. Trending Properties
Backs the `TrendingProperties` widget. Thin extension of the **existing** properties list.

- `GET /api/v1/properties/trending/` — Top properties by a trending score (recent
  `views_count` velocity, `is_featured` boost), limited to a handful for the sidebar.
  `?limit=2` (the widget only needs 2–3 cards).

## 8. Top Service Providers
Backs the `TopServiceProviders` widget. Thin extension of the **existing** artisans list, but
depends on a rating that doesn't exist in the schema yet — see
[home-feed-db-schema.md](home-feed-db-schema.md#additions-to-existing-models).

- `GET /api/v1/artisans/top/?limit=4` — Top artisans ordered by `-average_rating`.

## 9. Notifications
Backs the sidebar `Notifications` badge count and eventual notifications page.

- `GET /api/v1/notifications/` — List, paginated, newest first.
- `GET /api/v1/notifications/unread-count/` — `{ "count": 23 }`, polled for the sidebar badge.
- `PUT /api/v1/notifications/{id}/read/` — Mark one read.
- `PUT /api/v1/notifications/read-all/` — Mark all read.

## 10. Messages
Backs the sidebar `Messages` badge count and the header chat icon.

- `GET /api/v1/messages/conversations/` — List conversations, most recently active first.
- `GET /api/v1/messages/conversations/{id}/` — One conversation with its messages, paginated.
- `POST /api/v1/messages/conversations/{id}/messages/` — Send a message. `{ "body": "..." }`.
- `GET /api/v1/messages/unread-count/` — `{ "count": 12 }`, polled for the sidebar/header badge.

---

## Out of scope here
- **Create Post modal contents** (Photo/Video, Property, Service, Poll attachment types) —
  the composer currently just toasts "coming soon"; a real implementation needs the `Post`
  endpoints above plus a `Poll` model this doc doesn't cover, since the Figma frame doesn't
  specify poll behavior.
- **Real-time delivery** (new messages/notifications pushing to the client without polling) —
  would need a WebSocket/SSE channel; not something the current REST-only backend has, and not
  required just to unmock the Home screen.
