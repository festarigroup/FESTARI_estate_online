import type {
  Amenity,
  Category,
  ContentPost,
  FollowSuggestion,
  GeneralPost,
  NavItem,
  PropertyPost,
  ServiceProvider,
  Story,
  StayCategory,
  TrendingProperty,
} from "@/types/home";
import type { IconName } from "@/components/ui/DynamicIcon";

// NOTE: this is placeholder content standing in for a real feed API, matching
// the copy shown in the Figma "Home" screen. Swap for real data once the feed
// endpoint exists (see docs/api-reference.md).

export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: "Home", href: "/" },
  { id: "properties", label: "Property", icon: "Building2", href: "/properties" },
  { id: "stay", label: "Stay (Hotels)", icon: "BedDouble", href: "/stay" },
  { id: "craftwork", label: "Craftwork", icon: "Hammer", href: "/craftwork" },
  { id: "professionals", label: "Professionals", icon: "Users", href: "/professionals" },
  { id: "messages", label: "Messages", icon: "Mail", href: "/messages", badgeCount: 12 },
  { id: "notifications", label: "Notifications", icon: "Bell", href: "/notifications", badgeCount: 23 },
  { id: "saved", label: "Saved", icon: "Bookmark", href: "/saved" },
];

export const NAV_SECONDARY_ITEMS: NavItem[] = [
  { id: "activity", label: "My Activity", icon: "History", href: "/activity" },
];

export const STORIES: Story[] = [
  {
    id: "ama-serwaa",
    name: "Ama Serwaa",
    avatar: "/images/avatar-ama-serwaa-story.png",
    ringColor: "gold",
    items: [
      { id: "ama-serwaa-1", image: "/images/story-ama-serwaa-1.jpg", postedAt: "2h ago", caption: "House hunting all weekend 🏡" },
      { id: "ama-serwaa-2", image: "/images/story-ama-serwaa-2.jpg", postedAt: "1h ago", caption: "This kitchen though 😍" },
    ],
  },
  {
    id: "builders-gh",
    name: "Builders GH",
    avatar: "/images/avatar-builders-gh-story.png",
    ringColor: "live",
    isLive: true,
    items: [
      { id: "builders-gh-1", image: "/images/story-builders-gh-1.jpg", postedAt: "Active now", caption: "Live from the East Legon site" },
      { id: "builders-gh-2", image: "/images/story-builders-gh-2.jpg", postedAt: "Active now", caption: "Frame's up, crew's on it 🏗️" },
    ],
  },
  {
    id: "dee-interiors",
    name: "Dee Interiors",
    avatar: "/images/avatar-dee-interiors-story.png",
    ringColor: "gold",
    items: [
      { id: "dee-interiors-1", image: "/images/story-dee-interiors-1.jpg", postedAt: "4h ago", caption: "New moodboard for a client reveal" },
      { id: "dee-interiors-2", image: "/images/story-dee-interiors-2.jpg", postedAt: "3h ago", caption: "Dining nook, wrapped up today" },
    ],
  },
  {
    id: "brightfix",
    name: "BrightFix",
    avatar: "/images/avatar-brightfix-story.png",
    ringColor: "gold",
    items: [{ id: "brightfix-1", image: "/images/avatar-brightfix-story.png", postedAt: "5h ago" }],
  },
  {
    id: "luxury-stays",
    name: "Luxury Stays",
    avatar: "/images/avatar-luxury-stays-story.png",
    ringColor: "gold",
    items: [{ id: "luxury-stays-1", image: "/images/avatar-luxury-stays-story.png", postedAt: "8h ago", caption: "Sunset check-ins hit different" }],
  },
  {
    id: "kojo-mensah",
    name: "Kojo Mensah",
    avatar: "/images/avatar-kojo-mensah-story.png",
    ringColor: "gold",
    items: [{ id: "kojo-mensah-1", image: "/images/avatar-kojo-mensah-story.png", postedAt: "10h ago" }],
  },
];

// Ama Serwaa's listing appears both in the Home feed (via FEED_POSTS,
// rendered by PropertyPostCard) and on the Properties page (via
// PROPERTY_LISTINGS, rendered by PropertyListingCard) -- same underlying
// post, same `id`, so Saving it on one page correctly reflects on the
// other (both read/write the same useSavedPosts store, keyed by id).
const AMA_SERWAA_LISTING: PropertyPost = {
  id: "post-1",
  kind: "property",
  author: {
    name: "Ama Serwaa",
    avatar: "/images/avatar-ama-serwaa-post.png",
    verified: true,
    subtitle: "2h ago • East Legon, Accra",
  },
  body: [
    "Just listed this beautiful 4 bedroom house in East Legon. Spacious, modern",
    "and in a prime location. DM for enquiries or click to view more details.",
  ],
  hashtags: "#NewListing #EastLegon #ForSale #FestariEstates",
  images: [
    { src: "/images/post-house-thumb-1.jpg", alt: "East Legon house living room" },
    { src: "/images/post-house-thumb-2.png", alt: "East Legon house kitchen" },
    { src: "/images/post-house-main.jpg", alt: "East Legon house exterior" },
  ],
  totalImages: 8,
  reactions: { likes: 128, shares: 15 },
  comments: [
    {
      id: "post-1-comment-1",
      author: { name: "Kojo Mensah", avatar: "/images/avatar-kojo-mensah-follow.png" },
      body: "This is stunning! Is the pool heated?",
      createdAt: "1h ago",
    },
    {
      id: "post-1-comment-2",
      author: { name: "Dee Interiors", avatar: "/images/avatar-dee-interiors-follow.png" },
      body: "That kitchen island though 😍 gorgeous finishes.",
      createdAt: "45m ago",
    },
  ],
  price: "GHS 3,450,000",
  propertyType: "4 Bedroom Detached House",
  location: "East Legon, Accra",
  listingType: "For Sale",
  beds: 4,
  baths: 4.5,
  areaSqm: 420,
};

export const FEED_POSTS: ContentPost[] = [
  AMA_SERWAA_LISTING,
  {
    id: "post-2",
    kind: "service",
    author: {
      name: "BrightFix Electricals",
      avatar: "/images/avatar-brightfix-post.png",
      verified: true,
      subtitle: "4h ago • Service Provider",
    },
    body: [
      "Running a promo this week! 20% off all home wiring and lighting installations.",
      "Book us now and let's power your home safely. ⚡",
    ],
    image: { src: "/images/post-electrician.png", alt: "BrightFix electrician installing a chandelier" },
    comments: [
      {
        id: "post-2-comment-1",
        author: { name: "Builders GH", avatar: "/images/avatar-builders-gh-follow.png" },
        body: "Do you cover Kumasi as well?",
        createdAt: "2h ago",
      },
    ],
  },
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

export const FOLLOW_SUGGESTIONS: FollowSuggestion[] = [
  { id: "kojo-mensah", name: "Kojo Mensah", role: "Real Estate Agent", avatar: "/images/avatar-kojo-mensah-follow.png" },
  { id: "dee-interiors", name: "Dee Interiors", role: "Interior Designer", avatar: "/images/avatar-dee-interiors-follow.png" },
  { id: "builders-gh", name: "Builders GH", role: "Construction Company", avatar: "/images/avatar-builders-gh-follow.png" },
];

export const TRENDING_PROPERTIES: TrendingProperty[] = [
  {
    id: "trending-1",
    title: "5 Bedroom House",
    location: "East Legon, Accra",
    price: "GHS 3,450,000",
    image: "/images/property-trending-1.png",
    listingType: "For Sale",
    beds: 5,
    baths: 5,
    areaSqm: 350,
  },
  {
    id: "trending-2",
    title: "3 Bedroom Apartment",
    location: "Airport Residential, Accra",
    price: "GHS 8,000 / month",
    image: "/images/property-trending-2.jpg",
    listingType: "For Rent",
    beds: 3,
    baths: 3,
    areaSqm: 120,
  },
];

// Full listing posts for the Properties page (node 3340:1485) —
// AMA_SERWAA_LISTING is the same object FEED_POSTS renders (see its own
// comment above); this second one reuses the "3 Bedroom Apartment" details
// already seeded in TRENDING_PROPERTIES, attributed to Kojo Mensah since
// he's already established elsewhere as a real estate agent. Only one real
// photo exists for it (property-trending-2.jpg) — PropertyListingCard's
// media grid adapts to however many images a listing actually has rather
// than padding out fake extra tiles with an unrelated property's photo.
export const PROPERTY_LISTINGS: PropertyPost[] = [
  AMA_SERWAA_LISTING,
  {
    id: "listing-2",
    kind: "property",
    author: {
      name: "Kojo Mensah",
      avatar: "/images/avatar-kojo-mensah-follow.png",
      verified: true,
      subtitle: "5h ago • Airport Residential, Accra",
    },
    body: [
      "Modern 3 bedroom apartment available for rent in a secure, gated community.",
      "Fully furnished, 24/7 power backup, and parking for two cars.",
    ],
    hashtags: "#ForRent #AirportResidential #FestariEstates",
    images: [{ src: "/images/property-trending-2.jpg", alt: "Airport Residential apartment interior" }],
    totalImages: 5,
    reactions: { likes: 64, shares: 6 },
    comments: [],
    price: "GHS 8,000 / month",
    propertyType: "3 Bedroom Apartment",
    location: "Airport Residential, Accra",
    listingType: "For Rent",
    beds: 3,
    baths: 3,
    areaSqm: 120,
  },
  // Third listing so the Properties page's filters (property type,
  // price range, location) have more than two data points to actually
  // narrow down — reuses the "5 Bedroom House" details already seeded
  // in TRENDING_PROPERTIES, attributed to Builders GH since they're
  // already established elsewhere as a construction company.
  {
    id: "listing-3",
    kind: "property",
    author: {
      name: "Builders GH",
      avatar: "/images/avatar-builders-gh-follow.png",
      verified: true,
      subtitle: "1d ago • East Legon, Accra",
    },
    body: [
      "Brand new 5 bedroom family home, freshly built and move-in ready.",
      "Spacious compound with room for a pool and garden.",
    ],
    hashtags: "#NewBuild #EastLegon #ForSale #FestariEstates",
    images: [{ src: "/images/property-trending-1.png", alt: "East Legon 5 bedroom house exterior" }],
    totalImages: 6,
    reactions: { likes: 42, shares: 3 },
    comments: [],
    price: "GHS 3,450,000",
    propertyType: "5 Bedroom House",
    location: "East Legon, Accra",
    listingType: "For Sale",
    beds: 5,
    baths: 5,
    areaSqm: 350,
  },
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
// so this stands in for the /feed data every other page's widgets fetch,
// same role TRENDING_PROPERTIES/PROPERTY_LISTINGS play elsewhere. Figma's
// own example card reused a property listing's caption verbatim as filler
// text (visible in the raw design data) -- swapped here for copy that
// actually fits a venue rather than reproducing that mismatch.
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

export const TOP_SERVICE_PROVIDERS: ServiceProvider[] = [
  { id: "brightfix", name: "BrightFix", avatar: "/images/avatar-brightfix-provider.png", rating: 4.9 },
  { id: "dee-interiors", name: "Dee Interiors", icon: "PencilRuler", rating: 4.8 },
  { id: "buildwell-gh", name: "BuildWell GH", icon: "HardHat", rating: 4.9 },
  { id: "fixright", name: "FixRight", icon: "Wrench", rating: 4.7 },
];
