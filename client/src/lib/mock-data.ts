import type { Amenity, Category, GeneralPost, NavItem, StayCategory } from "@/types/home";
import type { IconName } from "@/components/ui/DynamicIcon";

// The Home feed, stories, saved posts, trending properties, top service
// providers, and "who to follow" all come from the real API now (see
// lib/api/* and lib/adapters.ts) — what's left here is content the backend
// has no model for yet: nav config, category/amenity chip labels, and the
// Stay page's venue listings (see docs/home-feed-api-endpoints.md's "Out of
// scope" section for why venue posts specifically aren't wired up).

export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: "Home", href: "/" },
  { id: "properties", label: "Property", icon: "Building2", href: "/properties" },
  { id: "stay", label: "Stay (Hotels)", icon: "BedDouble", href: "/stay" },
  { id: "craftwork", label: "Craftwork", icon: "Hammer", href: "/craftwork" },
  { id: "professionals", label: "Professionals", icon: "Users", href: "/professionals" },
  { id: "saved", label: "Saved", icon: "Bookmark", href: "/saved" },
];

export const NAV_SECONDARY_ITEMS: NavItem[] = [
  { id: "activity", label: "My Activity", icon: "History", href: "/activity" },
];

export const CATEGORIES: Category[] = [
  { id: "for-sale", label: "For Sale", icon: "Home" },
  { id: "for-rent", label: "For Rent", icon: "Key" },
  { id: "short-stay", label: "Short Stay", icon: "BedDouble" },
  { id: "lands", label: "Lands", icon: "Mountain" },
  { id: "homes", label: "Homes", icon: "Building" },
  { id: "apartments", label: "Apartments", icon: "Building2" },
  { id: "offices", label: "Offices", icon: "Building" },
  { id: "more", label: "More", icon: "MoreHorizontal" },
];

// Stay page category tabs (Figma node 3387:8856) -- also doubles as the
// options for CreatePostModal's "Category" select when tag === "venue",
// so a venue can't be posted without landing under one of these tabs.
export const STAY_CATEGORIES: { id: StayCategory; label: string; icon: IconName }[] = [
  { id: "Hotel", label: "Hotels", icon: "BedDouble" },
  { id: "Resort", label: "Resorts", icon: "Waves" },
  { id: "Apartment", label: "Apartments", icon: "Building2" },
  { id: "Event Venue", label: "Event Venues", icon: "PartyPopper" },
  { id: "Short Stay", label: "Short Stays", icon: "Key" },
];

// Amenity chips on a Stay listing card's metadata strip (Figma node
// 3387:8880 shows WiFi/Pool/Dining; the rest extend that same idea).
export const AMENITIES: { id: Amenity; label: string; icon: IconName }[] = [
  { id: "WiFi", label: "WiFi", icon: "Wifi" },
  { id: "Pool", label: "Pool", icon: "Waves" },
  { id: "Dining", label: "Dining", icon: "UtensilsCrossed" },
  { id: "Parking", label: "Parking", icon: "ParkingCircle" },
  { id: "Gym", label: "Gym", icon: "Dumbbell" },
  { id: "AC", label: "AC", icon: "Wind" },
];

// Seed venue posts for the Stay page (Figma node 3384:8225) -- venue posts
// have no backend counterpart yet (see CreatePostModal's buildLocalPost),
// so this stands in until that gap is closed. Figma's own example card
// reused a property listing's caption verbatim as filler text (visible in
// the raw design data) -- swapped here for copy that actually fits a venue
// rather than reproducing that mismatch.
export const STAY_LISTINGS: GeneralPost[] = [
  {
    id: "stay-1",
    kind: "general",
    author: {
      name: "Ama Serwaa",
      avatar: "/images/avatar-ama-serwaa-post.png",
      verified: true,
      subtitle: "2h ago • Accra",
    },
    body: [
      "Just opened our beachfront suites for the season — private pool, ocean views, and a kitchen team that does not miss.",
      "Book direct for the best rate.",
    ],
    images: [
      { src: "/images/stay-luxury-beach-resort-hero.jpg", alt: "Luxury Beach Resort exterior at night" },
      { src: "/images/stay-luxury-beach-resort-1.jpg", alt: "Luxury Beach Resort living room" },
      { src: "/images/stay-luxury-beach-resort-2.jpg", alt: "Luxury Beach Resort kitchen" },
    ],
    tag: "venue",
    venueDetails: {
      name: "Luxury Beach Resort",
      location: "Labadi, Accra",
      pricePerNight: 3000,
      bedrooms: 4,
      category: "Resort",
      rating: 4.9,
      amenities: ["WiFi", "Pool", "Dining"],
    },
    reactions: { likes: 128, shares: 14 },
    comments: [
      {
        id: "stay-1-comment-1",
        author: { name: "Kojo Mensah", avatar: "/images/avatar-kojo-mensah-follow.png" },
        body: "Stayed here in July, the sunset view alone is worth it.",
        createdAt: "1h ago",
      },
    ],
  },
  {
    id: "stay-2",
    kind: "general",
    author: {
      name: "Dee Interiors",
      avatar: "/images/avatar-dee-interiors-follow.png",
      verified: true,
      subtitle: "5h ago • Airport Residential, Accra",
    },
    body: ["Fully furnished executive apartment, styled by us end to end — great for a business trip or a longer stay."],
    images: [{ src: "/images/property-trending-2.jpg", alt: "Modern Executive Apartment living area" }],
    tag: "venue",
    venueDetails: {
      name: "Modern Executive Apartment",
      location: "Airport Residential, Accra",
      pricePerNight: 1200,
      bedrooms: 2,
      category: "Apartment",
      rating: 4.7,
      amenities: ["WiFi", "AC", "Parking"],
    },
    reactions: { likes: 64, shares: 5 },
    comments: [],
  },
  {
    id: "stay-3",
    kind: "general",
    author: { name: "Golden Sands Hotel", avatarIcon: "BedDouble", verified: true, subtitle: "1d ago • Osu, Accra" },
    body: ["City-centre comfort with a rooftop pool and gym, five minutes from Oxford Street."],
    images: [{ src: "/images/property-trending-1.png", alt: "Golden Sands Hotel exterior" }],
    tag: "venue",
    venueDetails: {
      name: "Golden Sands Hotel",
      location: "Osu, Accra",
      pricePerNight: 950,
      bedrooms: 1,
      category: "Hotel",
      rating: 4.5,
      amenities: ["WiFi", "Pool", "Gym"],
    },
    reactions: { likes: 51, shares: 3 },
    comments: [],
  },
  {
    id: "stay-4",
    kind: "general",
    author: { name: "The Grand Terrace", avatarIcon: "PartyPopper", verified: true, subtitle: "2d ago • East Legon, Accra" },
    body: ["Open-air event space for up to 300 guests — weddings, launches, and everything in between."],
    images: [{ src: "/images/post-house-main.jpg", alt: "The Grand Terrace event space" }],
    tag: "venue",
    venueDetails: {
      name: "The Grand Terrace",
      location: "East Legon, Accra",
      pricePerNight: 5000,
      bedrooms: 0,
      category: "Event Venue",
      rating: 4.8,
      amenities: ["Parking", "Dining"],
    },
    reactions: { likes: 37, shares: 9 },
    comments: [],
  },
  {
    id: "stay-5",
    kind: "general",
    author: { name: "Palm Grove Guesthouse", avatarIcon: "Key", verified: false, subtitle: "3d ago • Kokrobite, Accra" },
    body: ["Cozy short-stay rooms two minutes from the beach — perfect for a quick weekend getaway."],
    images: [{ src: "/images/post-house-thumb-1.jpg", alt: "Palm Grove Guesthouse room" }],
    tag: "venue",
    venueDetails: {
      name: "Palm Grove Guesthouse",
      location: "Kokrobite, Accra",
      pricePerNight: 400,
      bedrooms: 1,
      category: "Short Stay",
      rating: 4.3,
      amenities: ["WiFi"],
    },
    reactions: { likes: 19, shares: 1 },
    comments: [],
  },
];
