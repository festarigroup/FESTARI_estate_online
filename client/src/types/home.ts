import type { IconName } from "@/components/ui/DynamicIcon";

/** One slide within a user's story group — what the viewer actually displays. */
export interface StoryItem {
  id: string;
  image: string;
  /** Defaults to "image" when omitted — every seeded story predates video
   * support, so none of them set this. */
  type?: "image" | "video";
  /** Shown in the story viewer's header, e.g. "2h ago". Defaults to "Active now". */
  postedAt?: string;
  caption?: string;
}

/** A user's story rail bubble. Can hold multiple `items` — the rail shows one
 * bubble per person, and the viewer plays through their items in sequence
 * before advancing to the next person's group (Instagram/Facebook convention). */
export interface Story {
  id: string;
  name: string;
  avatar: string;
  ringColor: "gold" | "live";
  isLive?: boolean;
  items: StoryItem[];
}

export interface PostAuthor {
  name: string;
  /** Omit when the brand/profile has no resolvable photo — pair with `avatarIcon`. */
  avatar?: string;
  avatarIcon?: IconName;
  verified?: boolean;
  subtitle: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  /** Defaults to "image" when omitted — every seeded gallery item predates
   * video support, so none of them set this. */
  type?: "image" | "video";
}

/** Lighter than `PostAuthor` — comments don't carry a "2h ago • Accra"-style
 * subtitle or a verified badge, just who said what. */
export interface CommentAuthor {
  name: string;
  avatar?: string;
  avatarIcon?: IconName;
}

export interface Comment {
  id: string;
  author: CommentAuthor;
  body: string;
  createdAt: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  question: string;
  options: PollOption[];
}

export interface PropertyPost {
  id: string;
  kind: "property";
  author: PostAuthor;
  body: string[];
  hashtags: string;
  images: GalleryImage[];
  totalImages: number;
  reactions: { likes: number; shares: number };
  comments: Comment[];
}

export interface ServicePost {
  id: string;
  kind: "service";
  author: PostAuthor;
  body: string[];
  image: GalleryImage;
  comments: Comment[];
}

/** The structured facts a venue post carries beyond its free-form caption —
 * what a guest needs before requesting a reservation. Required whenever
 * `tag === "venue"` (enforced in CreatePostModal, not by the type system,
 * since a plain photo/property/service post never has this at all). */
export interface VenueDetails {
  name: string;
  location: string;
  /** GHS, nightly — every venue reservation is date-based (see
   * ReservationModal), so the rate is always per night, not a free-text
   * price that could be per-event or per-hour. */
  pricePerNight: number;
  capacity: number;
}

/** A post created through the composer modal — free-form text plus at most
 * one attachment type (photos, a property/service/venue tag, or a poll). */
export interface GeneralPost {
  id: string;
  kind: "general";
  author: PostAuthor;
  body: string[];
  images?: GalleryImage[];
  poll?: Poll;
  tag?: "property" | "service" | "venue";
  /** Only set when `tag === "venue"`. */
  venueDetails?: VenueDetails;
  comments: Comment[];
}

/** Anything that carries its own body/comments/engagement bar — i.e. every
 * feed item except a repost wrapper, which has none of its own. */
export type ContentPost = PropertyPost | ServicePost | GeneralPost;

/** A no-comment "X reposted this" wrapper around an existing post —
 * reposting a repost re-targets `original`, not the wrapper, so this never
 * nests. `thoughts` is the commentary from a "Repost with thoughts" (quote
 * repost); absent for a plain repost. */
export interface RepostedPost {
  id: string;
  kind: "repost";
  repostedBy: PostAuthor;
  repostedAt: string;
  thoughts?: string;
  original: ContentPost;
}

export type FeedPost = ContentPost | RepostedPost;

export interface Category {
  id: string;
  label: string;
  icon: IconName;
}

export interface FollowSuggestion {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface TrendingProperty {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  listingType: "For Sale" | "For Rent";
  beds: number;
  baths: number;
  areaSqm: number;
}

export interface ServiceProvider {
  id: string;
  name: string;
  avatar?: string;
  icon?: IconName;
  rating: number;
}

export interface NavItem {
  id: string;
  label: string;
  icon: IconName;
  href: string;
  badgeCount?: number;
}
