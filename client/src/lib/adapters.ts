import type {
  ApiComment,
  ApiFollowSuggestion,
  ApiPost,
  ApiProperty,
  ApiArtisan,
  ApiStory,
} from "@/lib/api/types";
import type {
  Comment,
  ContentPost,
  FollowSuggestion,
  GeneralPost,
  PropertyPost,
  ServicePost,
  ServiceProvider,
  Story,
  TrendingProperty,
} from "@/types/home";

function authorName(author: { firstname: string | null; lastname: string | null }) {
  return [author.firstname, author.lastname].filter(Boolean).join(" ") || "Festari member";
}

function relativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatPrice(price: string) {
  const amount = Number(price);
  if (Number.isNaN(amount)) return price;
  return `GHS ${amount.toLocaleString()}`;
}

const LISTING_TYPE_LABEL: Record<string, "For Sale" | "For Rent"> = {
  for_sale: "For Sale",
  for_rent: "For Rent",
  short_stay: "For Rent",
};

const PROPERTY_TYPE_LABEL: Record<string, string> = {
  land: "Land",
  home: "Home",
  apartment: "Apartment",
  office: "Office",
};

export function mapComment(comment: ApiComment): Comment {
  return {
    id: comment.id,
    author: { name: authorName(comment.author), avatar: comment.author.profile_picture ?? undefined },
    body: comment.body,
    createdAt: relativeTime(comment.created_at),
  };
}

export function mapPost(post: ApiPost): ContentPost {
  const author = {
    name: authorName(post.author),
    avatar: post.author.profile_picture ?? undefined,
    subtitle: relativeTime(post.created_at),
  };

  const images = post.images.map((image) => ({ src: image.image_url, alt: `Photo from ${author.name}` }));

  if (post.kind === "property" && post.linked_property) {
    const property = post.linked_property;
    const mapped: PropertyPost = {
      id: post.id,
      kind: "property",
      propertyId: property.id,
      isLiked: post.is_liked,
      author,
      body: post.body ? [post.body] : [],
      hashtags: post.hashtags ?? "",
      images,
      totalImages: images.length,
      reactions: { likes: post.likes_count, shares: post.shares_count },
      comments: [],
      price: formatPrice(property.price),
      propertyType: PROPERTY_TYPE_LABEL[property.property_type] ?? property.property_type,
      location: property.location,
      listingType: LISTING_TYPE_LABEL[property.listing_type] ?? "For Sale",
      beds: property.bedrooms ?? 0,
      baths: property.bathrooms ?? 0,
      areaSqm: property.area_sqm ?? 0,
    };
    return mapped;
  }

  if (post.kind === "service") {
    const mapped: ServicePost = {
      id: post.id,
      kind: "service",
      providerId: post.linked_artisan?.id,
      isLiked: post.is_liked,
      author,
      body: post.body ? [post.body] : [],
      image: images[0] ?? { src: "/images/avatar-kwame-composer.png", alt: author.name },
      comments: [],
    };
    return mapped;
  }

  const mapped: GeneralPost = {
    id: post.id,
    kind: "general",
    isLiked: post.is_liked,
    author,
    body: post.body ? post.body.split("\n").filter(Boolean) : [],
    images: images.length ? images : undefined,
    comments: [],
  };
  return mapped;
}

export function mapStoriesToGroups(stories: ApiStory[]): Story[] {
  const groups = new Map<string, Story>();

  for (const story of stories) {
    const existing = groups.get(story.author_id);
    const item = {
      id: story.id,
      image: story.media_url,
      postedAt: relativeTime(story.created_at),
      caption: story.caption ?? undefined,
    };

    if (existing) {
      existing.items.push(item);
    } else {
      groups.set(story.author_id, {
        id: story.author_id,
        name: authorName(story.author),
        avatar: story.author.profile_picture ?? "/images/avatar-kwame-composer.png",
        ringColor: "gold",
        items: [item],
      });
    }
  }

  return [...groups.values()];
}

export function mapFollowSuggestion(person: ApiFollowSuggestion): FollowSuggestion {
  return {
    id: person.id,
    name: authorName(person),
    role: "Festari member",
    avatar: person.profile_picture ?? "/images/avatar-kwame-composer.png",
  };
}

export function mapTrendingProperty(property: ApiProperty): TrendingProperty {
  return {
    id: property.id,
    title: property.title,
    location: property.location,
    price: formatPrice(property.price),
    image: "/images/property-trending-1.png",
    listingType: LISTING_TYPE_LABEL[property.listing_type] ?? "For Sale",
    beds: property.bedrooms ?? 0,
    baths: property.bathrooms ?? 0,
    areaSqm: property.area_sqm ?? 0,
  };
}

export function mapServiceProvider(artisan: ApiArtisan): ServiceProvider {
  return {
    id: artisan.id,
    name: artisan.service_type,
    icon: "Wrench",
    rating: artisan.average_rating ? Number(artisan.average_rating.toFixed(1)) : 0,
  };
}
