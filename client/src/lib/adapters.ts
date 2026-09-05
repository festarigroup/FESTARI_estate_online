import type {
  ApiComment,
  ApiFollowSuggestion,
  ApiPost,
  ApiProperty,
  ApiPropertyImage,
  ApiArtisan,
  ApiStory,
} from "@/lib/api/types";
import type {
  Amenity,
  Comment,
  ContentPost,
  FollowSuggestion,
  GeneralPost,
  PropertyPost,
  ServicePost,
  ServiceProvider,
  StayCategory,
  Story,
  TrendingProperty,
} from "@/types/home";
import type { Listing, ListingPricing, ListingPurpose, PropertyCategory } from "@/types/listing";

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

// The backend doesn't persist an image/video flag on `post_images` or
// `stories` rows — `mediaStorageService.uploadMedia` names the stored file
// from the upload's content-type extension (video/mp4 -> ".mp4", etc.), so
// the extension on the returned URL is the only signal we have left by the
// time it comes back from the API. Without this, every video (post
// attachment or story) renders through an <img>/<Image> tag instead of
// <video> and just shows a broken-image icon after posting.
const VIDEO_EXTENSIONS = /\.(mp4|webm|mov|quicktime|m4v|ogg)(\?.*)?$/i;

function isVideoUrl(url: string) {
  return VIDEO_EXTENSIONS.test(url);
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

const HOTEL_CATEGORY_LABEL: Record<string, StayCategory> = {
  hotel: "Hotel",
  resort: "Resort",
  apartment: "Apartment",
  event_venue: "Event Venue",
  short_stay: "Short Stay",
};

const BACKEND_AMENITY_LABEL: Record<string, Amenity> = {
  wifi: "WiFi",
  pool: "Pool",
  parking: "Parking",
  gym: "Gym",
  breakfast: "Dining",
  restaurant: "Dining",
  ac: "AC",
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
    id: post.author.id,
    name: authorName(post.author),
    avatar: post.author.profile_picture ?? undefined,
    subtitle: relativeTime(post.created_at),
  };

  const images = post.images.map((image) => ({
    src: image.image_url,
    alt: isVideoUrl(image.image_url) ? `Video from ${author.name}` : `Photo from ${author.name}`,
    type: isVideoUrl(image.image_url) ? ("video" as const) : ("image" as const),
  }));

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
      likesCount: post.likes_count,
      commentsCount: post.comments_count,
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

  if (post.kind === "venue" && post.linked_hotel) {
    const hotel = post.linked_hotel;
    const amenities = hotel.amenities
      ? [...new Set(Object.entries(hotel.amenities).flatMap(([key, on]) => (on && BACKEND_AMENITY_LABEL[key] ? [BACKEND_AMENITY_LABEL[key]] : [])))]
      : undefined;

    const mapped: GeneralPost = {
      id: post.id,
      kind: "general",
      isLiked: post.is_liked,
      author,
      body: post.body ? [post.body] : [],
      images: images.length ? images : undefined,
      tag: "venue",
      hotelId: hotel.id,
      venueDetails: {
        name: hotel.name,
        location: hotel.location,
        pricePerNight: Number(hotel.price_per_night),
        bedrooms: hotel.rooms ?? 0,
        category: HOTEL_CATEGORY_LABEL[hotel.category] ?? "Hotel",
        rating: hotel.average_rating ?? undefined,
        amenities: amenities && amenities.length > 0 ? amenities : undefined,
      },
      likesCount: post.likes_count,
      commentsCount: post.comments_count,
      comments: [],
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
      likesCount: post.likes_count,
      commentsCount: post.comments_count,
      comments: [],
    };
    return mapped;
  }

  const mapped: GeneralPost = {
    id: post.id,
    kind: "general",
    isLiked: post.is_liked,
    author,
    likesCount: post.likes_count,
    commentsCount: post.comments_count,
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
      type: isVideoUrl(story.media_url) ? ("video" as const) : ("image" as const),
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

/** The real backend has no residential/land/commercial split (`ApiProperty`
 * is one flat row for every kind of listing) — this is the one place that
 * gap gets bridged so `PropertyDetailsView` (built for the My Listings
 * wizard's own `Listing` shape) can also render a real property fetched by
 * id, per its own doc comment on why it's the one component both use. */
export function mapApiPropertyToListing(property: ApiProperty & { images?: ApiPropertyImage[] }): Listing {
  const category: PropertyCategory =
    property.property_type === "land" ? "land" : property.property_type === "office" ? "commercial" : "residential";
  const purpose: ListingPurpose = property.listing_type === "for_sale" ? "sale" : "rent";
  const unit: ListingPricing["unit"] = property.listing_type === "for_sale" ? "total" : "per_month";
  // ApiProperty.status is a moderation state ("pending"/"approved"/
  // "rejected"), not this app's own listing-lifecycle vocabulary — only an
  // approved property is actually live/public, so that's the only case
  // mapped to "published" (which is what gates the enquiry/viewing CTA).
  const status: Listing["status"] = property.status === "approved" ? "published" : "pending_review";

  return {
    id: property.id,
    ownerId: property.owner_id,
    status,
    purpose,
    category,
    title: property.title,
    propertyType: PROPERTY_TYPE_LABEL[property.property_type] ?? property.property_type,
    location: { address: property.location, area: "", city: "", region: "", precision: "exact" },
    residential:
      category === "residential"
        ? {
            bedrooms: property.bedrooms ?? undefined,
            bathrooms: property.bathrooms ?? undefined,
            areaSqm: property.area_sqm ?? undefined,
          }
        : {},
    land: category === "land" ? { plotSize: property.area_sqm ?? undefined, plotUnit: "sqm" } : {},
    commercial: category === "commercial" ? { floorAreaSqm: property.area_sqm ?? undefined } : {},
    pricing: { amount: Number(property.price) || 0, currency: "GHS", unit, negotiable: false },
    features: [],
    description: property.description ?? "",
    media: (property.images ?? []).map((image) => ({ url: image.image_url, type: "image" as const })),
    // The real backend has no owner-facing viewing/contact-preference
    // record yet (that's this branch's own new concept) — omitted rather
    // than guessed; PropertyDetailsView already renders a sensible
    // "haven't been set yet" message for a null viewingContact.
    viewingContact: null,
    authority: { status: "pending" },
    createdAt: property.created_at,
    updatedAt: property.created_at,
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
