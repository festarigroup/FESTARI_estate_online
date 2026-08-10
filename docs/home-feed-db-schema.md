# Home Feed — DB Schema

Companion to [home-feed-api-endpoints.md](home-feed-api-endpoints.md). Documents the actual
Drizzle ORM tables backing the feed/social/notifications/messaging surface, as built in
`server/src/app/db/schema/*.ts` — this is a Node/Drizzle/PostgreSQL backend, not Django, so there
are no Django-style model classes; every table below is a `pgTable(...)` definition.

Shared conventions across every table in this schema (not repeated per-table below):
`id: uuid("id").primaryKey().defaultRandom()`; `created_at`/`updated_at` as
`timestamp().defaultNow().notNull()` (bumped manually in the owning service's `update()`, no DB
trigger); foreign keys via `.references(() => table.id, { onDelete: ... })`; enums via
`pgEnum(...)` (defined once in `schema/enums.ts`, not per-table).

---

## `schema/feed.ts`

### `stories`
| Column | Type | Notes |
|---|---|---|
| `author_id` | uuid → `users.id`, cascade | |
| `media_url` | text | Supabase Storage public URL |
| `caption` | varchar(255), nullable | |
| `expires_at` | timestamp | set to `created_at + 24h` in `storiesService.create`, not a DB default |

### `story_views`
`story_id` → `stories.id` cascade, `viewer_id` → `users.id` cascade, `viewed_at`.
Unique on `(story_id, viewer_id)` — one view record per viewer.

### `posts`
| Column | Type | Notes |
|---|---|---|
| `author_id` | uuid → `users.id`, cascade | |
| `kind` | `post_kind` enum: `property \| service \| general \| venue` | |
| `body` | text | |
| `hashtags` | text, nullable | raw text, e.g. `"#A #B #C"` — not parsed into per-tag rows |
| `linked_property_id` | uuid → `properties.id`, set null | set when `kind = property` |
| `linked_artisan_id` | uuid → `artisan_profiles.id`, set null | set when `kind = service` |
| `linked_hotel_id` | uuid → `hotels.id`, set null | set when `kind = venue` |

`likes_count`/`comments_count`/`shares_count` are **not** columns — computed via correlated
`count(*)` subqueries in `postsService`'s `withCounts()` helper at query time. `is_liked`/
`is_saved` are computed the same way against the requesting user, when authenticated. The one
exception to "don't denormalize" anywhere in this schema is `properties.views_count`, which is a
stored incrementing counter (write-heavy, no dedup needed, unlike likes).

### `post_images`
`post_id` → `posts.id` cascade, `image_url`, `position: smallint` (drives gallery ordering).

### `post_likes`
`post_id` → `posts.id` cascade, `user_id` → `users.id` cascade. Unique on `(post_id, user_id)`.

### `post_comments`
`post_id` → `posts.id` cascade, `author_id` → `users.id`, `body`.

### `post_shares`
`post_id` → `posts.id` cascade, `user_id` → `users.id`. **No** unique constraint — a user can
share the same post more than once (repeatable action, unlike Like/Save).

### `saved_posts`
`post_id` → `posts.id` cascade, `user_id` → `users.id` cascade. Unique on `(post_id, user_id)`.

---

## `schema/social.ts`

### `follows`
`follower_id` / `following_id` → `users.id`, both cascade. Unique on `(follower_id,
following_id)`, plus a Postgres `CHECK (follower_id <> following_id)` constraint.

---

## `schema/notifications.ts`

### `notifications`
| Column | Type | Notes |
|---|---|---|
| `recipient_id` | uuid → `users.id`, cascade | |
| `actor_id` | uuid → `users.id`, set null, nullable | who triggered it; null for system notifications |
| `verb` | `notification_verb` enum: `like \| comment \| follow \| booking \| inquiry \| hire_request \| message \| system` | |
| `target_type` | text, nullable | e.g. `"post"`, `"property"`, `"hotel_booking"`, `"conversation"` |
| `target_id` | uuid, nullable | **no FK** — deliberately decoupled so this table doesn't reference every domain it might notify about |
| `channel` | `notification_channel` enum: `in_app \| email \| sms \| whatsapp` | |
| `title`, `body` | text | |
| `data` | jsonb, nullable | |
| `is_read` | boolean | |
| `sent_at`, `read_at` | timestamp, nullable | |

One table serves both transactional notifications (booking/inquiry/hire_request) and social ones
(like/comment/follow/message) — merged on purpose to avoid duplicate unread-count logic across
two tables. Every producer emits through a single `notificationsService.notify()` call.

### `user_notification_preferences`
One row per user (`user_id` unique FK). Channel toggles: `in_app_enabled`, `email_enabled`,
`sms_enabled`, `whatsapp_enabled`. Domain toggles: `booking_enabled`, `inquiry_enabled`,
`hire_request_enabled`, `social_enabled`, `message_enabled`, `system_enabled`. Plus `frequency`
(`daily | weekly | monthly | never`).

---

## `schema/messaging.ts`

### `conversations`
No columns beyond id/timestamps — `updated_at` is bumped on every new message and drives the
conversation-list sort order.

### `conversation_participants`
Composite primary key `(conversation_id, user_id)` — the Drizzle translation of a
many-to-many relationship. Shaped for a future group chat (more than 2 participants), though
nothing in the app creates one yet — `messagingService.findOrCreateOneToOne` always inserts
exactly 2 rows.

### `messages`
`conversation_id` → `conversations.id` cascade, `sender_id` → `users.id`, `body`, `is_read`.

---

## Fields added to existing tables for the feed

### `schema/properties.ts` — `properties`
Beyond the base listing fields (`title`, `description`, `price`, `location`, `is_featured`,
`status`, `views_count`), the feed/category surface needs:
`listing_type` (`for_sale | for_rent | short_stay`), `property_type` (`land | home | apartment |
office`), `bedrooms`, `bathrooms`, `area_sqm` — all present on the table as built.

### `schema/artisans.ts` — `artisan_profiles` + `artisan_reviews`
`artisan_profiles.id` **is** the owning user's id (FK + PK in one, one profile per account) — not
a separate generated id. `average_rating` is not a column; `artisan_reviews` (`artisan_id`,
`reviewer_id`, `rating: 1-5` with a Postgres `CHECK`, `comment`) backs a computed
`AVG(rating)`/`COUNT(*)` in `artisansService.getTop()` / `getRatingSummary()`.

### `schema/hotels.ts` — `hotels` + `hotel_reviews`
`category` (`hotel_category` enum: `hotel | resort | apartment | event_venue | short_stay`) and
`rooms` (nullable integer) back the Stay page's category tabs and bedroom-equivalent stat —
same reasoning as the property/artisan additions above, added once the Stay page actually needed
real data instead of the mock `STAY_LISTINGS`/`STAY_CATEGORIES` it started from. `hotel_reviews`
mirrors `artisan_reviews` exactly (`hotel_id`, `reviewer_id`, `rating: 1-5` with a `CHECK`,
`comment`), backing a computed `average_rating`/`review_count` the same way.

---

## Out of scope
- **Poll model** — the Create Post modal's "Poll" attachment type has no backing table; posts of
  that shape stay local-only on the client.
