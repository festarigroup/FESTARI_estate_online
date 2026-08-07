import type { IconName } from "@/components/ui/DynamicIcon";

/** One slide within a user's story group — what the viewer actually displays. */
export interface StoryItem {
  id: string;
  image: string;
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

/** A post created through the composer modal — free-form text plus at most
 * one attachment type (photos, a property/service tag, or a poll). */
export interface GeneralPost {
  id: string;
  kind: "general";
  author: PostAuthor;
  body: string[];
  images?: GalleryImage[];
  poll?: Poll;
  tag?: "property" | "service";
  comments: Comment[];
}

export type FeedPost = PropertyPost | ServicePost | GeneralPost;

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
