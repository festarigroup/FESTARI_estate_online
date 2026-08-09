# Home Feed — API Endpoints

The `client/` Home screen (`src/app/(app)/page.tsx`) and Properties page
(`src/app/(app)/properties/page.tsx`) are wired to these endpoints via
`client/src/lib/api/feed.ts` and `client/src/lib/adapters.ts`. This document specs the same
surface documented in [api-reference.md](api-reference.md), expanded with the feed-specific
detail that reference doesn't cover.

## Base URL
```
http://localhost:3030/api/v1/
```

## Authentication
`Authorization: Bearer <access_token>`, same as the rest of the platform. Every endpoint below
is public (works signed-out) **except** where marked **Auth required** — but several public ones
still personalize their response (`is_liked`/`is_saved`) when a valid token is sent, so the
client always attaches one if it has it.

## Response formats
Same envelope as [api-reference.md](api-reference.md#response-formats).

---

## 1. Stories
Backs `StoryBar` (`Create Story` + ringed avatars). Grouped client-side by author into one rail
bubble per person; there is no separate "story group" resource server-side, just a flat list of
`stories` rows with a 24h `expires_at`.

- `GET /feed/stories/` — active (non-expired) stories, most recent first.
- `POST /feed/stories/` **Auth required** — `multipart/form-data`: `media` (image or video,
  required, up to 20MB), `caption` (optional).
- `GET /feed/stories/:id/` — one story.
- `DELETE /feed/stories/:id/` **Auth required** — own story only.
- `POST /feed/stories/:id/view/` **Auth required** — records a view (deduped per viewer).

## 2. Feed Posts
Backs `PostComposer` and the `PropertyPostCard` / `ServicePostCard` / `GeneralPostCard` variants.

- `GET /feed/posts/?kind=property|service|general&current_page=&limit=` — paginated, newest first.
  Each item includes `author`, `linked_property` (present + populated only for `kind=property`
  posts with a real listing attached), `linked_artisan` (same, for `kind=service`), `images[]`,
  and computed `likes_count`/`comments_count`/`shares_count`/`is_liked`/`is_saved`.
- `POST /feed/posts/` **Auth required**
  ```json
  {
    "kind": "property",
    "body": "Just listed this beautiful 4 bedroom house...",
    "hashtags": "#NewListing #EastLegon #ForSale",
    "linked_property_id": "uuid or omitted",
    "linked_artisan_id": "uuid or omitted"
  }
  ```
  The frontend composer's "Property" attach type calls `POST /properties` first to create the
  real listing, then this endpoint with the returned `linked_property_id` — a property post
  always backs a real, independently-queryable `Property` row, not just caption text.
- `GET /feed/posts/:id/` — one post with images and computed counts.
- `PUT /feed/posts/:id/` **Auth required** — own post.
- `DELETE /feed/posts/:id/` **Auth required** — own post or admin.
- `POST /feed/posts/:id/images/` **Auth required** — `multipart/form-data`: `image`, `position`.

## 3. Post interactions
Backs `PostEngagementBar` (Like / Comment / Share / Save).

- `POST /feed/posts/:id/like/` / `DELETE /feed/posts/:id/like/` **Auth required**
- `GET /feed/posts/:id/comments/?current_page=&limit=` — paginated.
- `POST /feed/posts/:id/comments/` **Auth required** — `{ "body": "..." }`.
- `DELETE /feed/comments/:id/` **Auth required** — own comment or admin.
- `POST /feed/posts/:id/share/` **Auth required** — records a share (repeatable, no dedup —
  matches "Share" being an action you can take more than once, unlike Like/Save).
- `POST /feed/posts/:id/save/` / `DELETE /feed/posts/:id/save/` **Auth required**
- `GET /feed/saved/` **Auth required** — the current user's saved posts, backs the sidebar
  `Saved` nav item.

## 4. Book Service / Hire (from a service post)
The `ServicePostCard`'s "Book Service" button calls:
- `POST /artisans/{artisan_id}/hire/` **Auth required** — `{ "message": "..." }`. Free request,
  no payment collected at this step (see [api-reference.md](api-reference.md#artisans--artisans)).

## 5. Social graph (follow)
Backs `WhoToFollow` and the follow/unfollow toggle. All **Auth required**.
- `GET /social/suggestions/?limit=5`
- `POST /social/follow/{user_id}/` / `DELETE /social/follow/{user_id}/`
- `GET /social/following/`
- `GET /social/followers/`

## 6. Explore by Category
Backs `CategoryGrid`. Thin filter over `properties`, not a feed endpoint.
- `GET /properties/categories/` — count per `listing_type`.
- `GET /properties/?listing_type=for_sale` / `?property_type=apartment` — the "See all"/category-click destination.

## 7. Trending Properties
Backs the `TrendingProperties` widget.
- `GET /properties/trending/?limit=2` — ranked by `is_featured` then `views_count`.

## 8. Top Service Providers
Backs the `TopServiceProviders` widget.
- `GET /artisans/top/?limit=4` — ordered by `-average_rating` (computed via `AVG(artisan_reviews.rating)`, not stored on the profile).

## 9. Notifications
Backs the sidebar `Notifications` badge and `/notifications` page. All **Auth required**.
- `GET /notifications/`
- `GET /notifications/unread-count/` → `{ "count": 23 }`, polled for the badge.
- `PUT /notifications/{id}/read/`
- `PUT /notifications/read-all/`

## 10. Messages
Backs the header/sidebar `Messages` badge and `/messages` page. All **Auth required**.
- `GET /messages/conversations/`
- `POST /messages/conversations/` — `{ "participant_id": "..." }`, finds-or-creates a 1:1 thread.
- `GET /messages/conversations/{id}/` — includes `participants[]` and paginated `messages[]`.
- `POST /messages/conversations/{id}/messages/` — `{ "body": "..." }`.
- `GET /messages/unread-count/` → `{ "count": 12 }`.

---

## Out of scope
- **Poll attachment** (Create Post modal's "Poll" type) — no `Poll` model exists; the composer
  still builds a local-only post for this case, same as before real wiring existed.
- **Venue attachment** — there's no `venue` post kind or model either; `listing_type: short_stay`
  on `Property` covers "short stay" style listings, but the composer's dedicated venue form
  (name/price-per-night/bedrooms) has no backend endpoint and stays local-only.
- **Real-time delivery** (messages/notifications pushing to the client without polling) — REST +
  client-side polling only, no WebSocket/SSE channel.
- **`useFollowedAuthors`** (the per-post "Unfollow X" menu item, keyed by author name) is a
  separate, still-local-only mechanism from the `/social/follow` endpoints above — the two aren't
  reconciled yet.
