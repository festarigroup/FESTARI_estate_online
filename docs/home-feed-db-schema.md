# Home Feed — Required DB Schema

Companion to [home-feed-api-endpoints.md](home-feed-api-endpoints.md). Specs the Django models
needed to back the Home screen's real data, following the exact conventions already used across
`server/apps/*/models.py`: UUID primary keys (`default=uuid.uuid4, editable=False`), FKs to
`settings.AUTH_USER_MODEL`, `TextChoices` for enums, `auto_now_add`/`auto_now` timestamps, and
`JSONField(default=list, blank=True)` for media URL lists.

None of the models below exist yet — searched `server/apps/**/models.py` and there is currently
no feed, social-graph, notification, or messaging app. Suggested as a new `apps/feed` app (plus
two small additions to the existing `properties` and `artisans` apps).

---

## New app: `apps/feed`

### `Story`
| Field | Type | Notes |
|---|---|---|
| `id` | `UUIDField` | PK, `default=uuid.uuid4` |
| `author` | `FK → User` | `related_name="stories"`, `on_delete=CASCADE` |
| `media_url` | `URLField` | image or video, uploaded via Supabase storage per platform convention |
| `caption` | `CharField(max_length=255, blank=True)` | |
| `created_at` | `DateTimeField(auto_now_add=True)` | |
| `expires_at` | `DateTimeField` | set to `created_at + 24h` on save |

### `StoryView`
| Field | Type | Notes |
|---|---|---|
| `id` | `UUIDField` | PK |
| `story` | `FK → Story` | `related_name="views"` |
| `viewer` | `FK → User` | `related_name="story_views"` |
| `viewed_at` | `DateTimeField(auto_now_add=True)` | |

`unique_together = ("story", "viewer")` — one view record per viewer.

### `Post`
| Field | Type | Notes |
|---|---|---|
| `id` | `UUIDField` | PK |
| `author` | `FK → User` | `related_name="posts"` |
| `kind` | `CharField` + `TextChoices` | `PROPERTY`, `SERVICE`, `GENERAL` |
| `body` | `TextField` | |
| `hashtags` | `CharField(max_length=255, blank=True)` | stored as raw text (`"#A #B #C"`), matching how the Figma copy renders it as one styled line — parse client-side if per-tag linking is ever needed |
| `linked_property` | `FK → properties.Property`, `null=True, blank=True` | set when `kind = PROPERTY` |
| `linked_artisan` | `FK → artisans.ArtisanProfile`, `null=True, blank=True` | set when `kind = SERVICE` |
| `created_at` | `DateTimeField(auto_now_add=True)` | |
| `updated_at` | `DateTimeField(auto_now=True)` | |

`likes_count` / `comments_count` / `shares_count`: **don't** store these as columns — compute
via `annotate(Count(...))` in the list view's queryset, same as `Property.views_count` is the
one exception in this codebase that *is* stored (because it's write-heavy/increment-only, unlike
likes which need dedup via `PostLike`).

### `PostImage`
| Field | Type | Notes |
|---|---|---|
| `id` | `UUIDField` | PK |
| `post` | `FK → Post` | `related_name="images"` |
| `image_url` | `URLField` | |
| `position` | `PositiveSmallIntegerField(default=0)` | drives the 1-big + N-thumbnail gallery layout |

### `PostLike`
| Field | Type | Notes |
|---|---|---|
| `id` | `UUIDField` | PK |
| `post` | `FK → Post` | `related_name="likes"` |
| `user` | `FK → User` | `related_name="post_likes"` |
| `created_at` | `DateTimeField(auto_now_add=True)` | |

`unique_together = ("post", "user")`.

### `PostComment`
| Field | Type | Notes |
|---|---|---|
| `id` | `UUIDField` | PK |
| `post` | `FK → Post` | `related_name="comments"` |
| `author` | `FK → User` | |
| `body` | `TextField` | |
| `created_at` | `DateTimeField(auto_now_add=True)` | |

### `PostShare`
| Field | Type | Notes |
|---|---|---|
| `id` | `UUIDField` | PK |
| `post` | `FK → Post` | `related_name="shares"` |
| `user` | `FK → User` | |
| `created_at` | `DateTimeField(auto_now_add=True)` | |

No `unique_together` — a user can share the same post more than once (matches "Share" being a
repeatable action, unlike Like/Save).

### `SavedPost`
| Field | Type | Notes |
|---|---|---|
| `id` | `UUIDField` | PK |
| `post` | `FK → Post` | `related_name="saved_by"` |
| `user` | `FK → User` | `related_name="saved_posts"` |
| `created_at` | `DateTimeField(auto_now_add=True)` | |

`unique_together = ("post", "user")`.

---

## New app: `apps/social`

### `Follow`
| Field | Type | Notes |
|---|---|---|
| `id` | `UUIDField` | PK |
| `follower` | `FK → User` | `related_name="following"` |
| `following` | `FK → User` | `related_name="followers"` |
| `created_at` | `DateTimeField(auto_now_add=True)` | |

`unique_together = ("follower", "following")`. Add a `CheckConstraint` (or validate in the
serializer) so `follower != following`.

---

## New app: `apps/notifications`

### `Notification`
| Field | Type | Notes |
|---|---|---|
| `id` | `UUIDField` | PK |
| `recipient` | `FK → User` | `related_name="notifications"` |
| `actor` | `FK → User`, `null=True` | who triggered it (null for system notifications) |
| `verb` | `CharField` + `TextChoices` | `LIKE`, `COMMENT`, `FOLLOW`, `BOOKING`, `INQUIRY`, `HIRE_REQUEST` |
| `target_type` | `CharField(max_length=32)` | e.g. `"post"`, `"property"`, `"hotel_booking"` |
| `target_id` | `UUIDField` | generic FK avoided on purpose — keep this app decoupled from every other app it might notify about |
| `is_read` | `BooleanField(default=False)` | |
| `created_at` | `DateTimeField(auto_now_add=True)` | |

---

## New app: `apps/messaging`

### `Conversation`
| Field | Type | Notes |
|---|---|---|
| `id` | `UUIDField` | PK |
| `participants` | `ManyToManyField(User, related_name="conversations")` | 1:1 DMs for now (2 participants); shape allows group chat later |
| `created_at` | `DateTimeField(auto_now_add=True)` | |
| `updated_at` | `DateTimeField(auto_now=True)` | bump on new message, used to sort the conversation list |

### `Message`
| Field | Type | Notes |
|---|---|---|
| `id` | `UUIDField` | PK |
| `conversation` | `FK → Conversation` | `related_name="messages"` |
| `sender` | `FK → User` | |
| `body` | `TextField` | |
| `is_read` | `BooleanField(default=False)` | |
| `created_at` | `DateTimeField(auto_now_add=True)` | |

---

## Additions to existing models

### `properties.Property`
Needed so `CategoryGrid` and `TrendingProperties` can query real data instead of being hardcoded
copy. Neither field exists on the current model (`title`, `description`, `price`, `location`,
`is_featured`, `status`, `media_urls`, `views_count`).

| Field | Type | Notes |
|---|---|---|
| `listing_type` | `CharField` + `TextChoices` | `FOR_SALE`, `FOR_RENT`, `SHORT_STAY` — drives the "FOR SALE"/"FOR RENT" badge on trending cards and the category filter |
| `property_type` | `CharField` + `TextChoices` | `LAND`, `HOME`, `APARTMENT`, `OFFICE` — the other half of `CategoryGrid` |
| `bedrooms` | `PositiveSmallIntegerField(null=True, blank=True)` | `api-reference.md` already documents `?bedrooms=2` as a filter, but the field isn't on the model — needed for the bed/bath/sqm row on `TrendingProperties` too |
| `bathrooms` | `PositiveSmallIntegerField(null=True, blank=True)` | same gap as above, no existing doc reference |
| `area_sqm` | `PositiveIntegerField(null=True, blank=True)` | |

### `artisans.ArtisanProfile`
Needed so `TopServiceProviders` can show a real rating instead of a hardcoded number.
`api-reference.md` already documents `?rating=4` and `-ordering=-rating` as artisan filters, but
there is no rating field or review model anywhere in `apps/artisans` today — this is a
pre-existing doc/schema gap, not something new introduced by the Home feed.

Add a review model rather than a self-reported field:

#### `ArtisanReview` (new model in `apps/artisans`)
| Field | Type | Notes |
|---|---|---|
| `id` | `UUIDField` | PK |
| `artisan` | `FK → ArtisanProfile` | `related_name="reviews"` |
| `reviewer` | `FK → User` | |
| `rating` | `PositiveSmallIntegerField` | 1–5, validate with `MinValueValidator(1)` / `MaxValueValidator(5)` |
| `comment` | `TextField(blank=True)` | |
| `created_at` | `DateTimeField(auto_now_add=True)` | |

`ArtisanProfile.average_rating` can then be an annotated value (`reviews.aggregate(Avg("rating"))`)
in the queryset backing `GET /api/v1/artisans/top/`, same pattern recommended above for
`Post.likes_count` — don't denormalize onto the model unless read volume ends up requiring it.

---

## Out of scope here
- **Migrations** aren't included — generate via `makemigrations` once the models above are
  reviewed and adjusted; not guessing at migration dependency ordering in a doc.
- **Poll model** (Post Composer's "Poll" attach type) isn't specced — see the note in
  [home-feed-api-endpoints.md](home-feed-api-endpoints.md#out-of-scope-here).
