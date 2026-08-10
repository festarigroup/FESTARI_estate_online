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
  /** The real users.id this post's author maps back to — absent for
   * synthetic/local-only authors (e.g. a repost wrapper's CURRENT_USER
   * stand-in in Feed.tsx) that were never a real ApiPostAuthor to begin
   * with. Lets PostOptionsMenu tell "my own post" apart from anyone
   * else's by comparing against useAuth()'s own `user.id`. */
  id?: string;
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
  /** The linked real-estate listing's id (properties.id) — set when this
   * post was created from real backend data, used to send enquiries/wishlist
   * actions against the actual property rather than the post. */
  propertyId?: string;
  isLiked?: boolean;
  author: PostAuthor;
  body: string[];
  hashtags: string;
  images: GalleryImage[];
  totalImages: number;
  reactions: { likes: number; shares: number };
  comments: Comment[];
  /** Full-listing facts shown on the Properties page's "Property Metadata
   * Strip" (Figma node 3340:936/2446) — PropertyPostCard's Home-feed
   * presentation of this same post doesn't render these (its CTA was
   * removed at explicit request; see git history), but PropertyListingCard
   * does, since the listing page is where these facts actually matter. */
  price: string;
  propertyType: string;
  /** Separate from `author.subtitle`'s "2h ago • East Legon, Accra" —
   * that's display text, this is what the Properties page's Location
   * filter actually matches against. */
  location: string;
  listingType: "For Sale" | "For Rent";
  beds: number;
  baths: number;
  areaSqm: number;
}

export interface ServicePost {
  id: string;
  kind: "service";
  /** The linked artisan profile's id (artisan_profiles.id) — set when this
   * post was created from real backend data, used to send hire requests
   * against the actual artisan rather than the post. */
  providerId?: string;
  isLiked?: boolean;
  author: PostAuthor;
  body: string[];
  image: GalleryImage;
  comments: Comment[];
}

/** The Stay page's category tabs (Figma node 3387:8856) — every venue post
 * belongs to exactly one, so the tabs actually have something to filter. */
export type StayCategory = "Hotel" | "Resort" | "Apartment" | "Event Venue" | "Short Stay";

/** Amenity chips on a Stay listing card's metadata strip (Figma node
 * 3387:8880, which shows WiFi/Pool/Dining — the rest of this set is this
 * app's own reasonable extension of that same idea, not pulled from Figma). */
export type Amenity = "WiFi" | "Pool" | "Dining" | "Parking" | "Gym" | "AC";

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
  /** Matches the "4 Bedrooms" stat on the Figma metadata strip (node
   * 3340:936) — a venue's equivalent of a property's bedroom count. */
  bedrooms: number;
  /** Which Stay page tab this venue shows up under (Figma node 3387:8856). */
  category: StayCategory;
  /** Aggregate guest rating out of 5 (Figma node 3387:8896, "4.9"). There's
   * no review system yet to compute this from, so it's only ever set on
   * seeded/mock venues — a freshly posted venue starts unrated and the Stay
   * card just omits the rating pill until reviews exist. */
  rating?: number;
  /** Amenity chips (Figma node 3387:8880). Optional — defaults to none for
   * a freshly posted venue. */
  amenities?: Amenity[];
}

/** The structured facts a property post carries beyond its free-form
 * caption — the same facts the Properties page's "Property Metadata
 * Strip" shows for every listing there (see PropertyPost/
 * PropertyListingCard). Required whenever `tag === "property"` (enforced
 * in CreatePostModal, not by the type system). */
export interface PropertyDetails {
  listingType: "For Sale" | "For Rent";
  /** Free text, not a number: a sale price and a rental rate ("GHS
   * 8,000 / month") don't share one unit the way a venue's nightly rate
   * does, so this stays whatever the poster actually types. */
  price: string;
  /** e.g. "4 Bedroom Detached House" — the metadata strip's subtitle. */
  propertyType: string;
  location: string;
  beds: number;
  baths: number;
  areaSqm: number;
}

/** A post created through the composer modal — free-form text plus at most
 * one attachment type (photos, a property/service/venue tag, or a poll). */
export interface GeneralPost {
  id: string;
  kind: "general";
  isLiked?: boolean;
  author: PostAuthor;
  body: string[];
  images?: GalleryImage[];
  poll?: Poll;
  tag?: "property" | "service" | "venue";
  /** Only set when `tag === "property"`. */
  propertyDetails?: PropertyDetails;
  /** The real backend properties.id created for a `tag === "property"` post
   * — set when the composer successfully created a matching listing, used
   * to send enquiries against the actual property. */
  propertyId?: string;
  /** Only set when `tag === "venue"`. */
  venueDetails?: VenueDetails;
  /** The real backend hotels.id this venue post is linked to, used to send
   * reservations against the actual hotel rather than the post. Only ever
   * set when `tag === "venue"`. */
  hotelId?: string;
  /** The Stay listing page's visible like/share numbers (Figma node
   * 3384:8330), the same role PropertyPost's own `reactions` plays for
   * PropertyListingCard. Every other GeneralPost variant has never needed a
   * visible count, just a toggle. */
  reactions?: { likes: number; shares: number };
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
