import type {
  Category,
  ContentPost,
  FollowSuggestion,
  NavItem,
  ServiceProvider,
  Story,
  TrendingProperty,
} from "@/types/home";

// NOTE: this is placeholder content standing in for a real feed API, matching
// the copy shown in the Figma "Home" screen. Swap for real data once the feed
// endpoint exists (see docs/api-reference.md).

export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: "Home", href: "/" },
  { id: "properties", label: "Properties", icon: "Building2", href: "/properties" },
  { id: "stay", label: "Stay (Hotels)", icon: "BedDouble", href: "/stay" },
  { id: "craftwork", label: "Craftwork", icon: "Hammer", href: "/craftwork" },
  { id: "professionals", label: "Professionals", icon: "Users", href: "/professionals" },
  { id: "pricing", label: "Pricing", icon: "Banknote", href: "/pricing" },
  { id: "messages", label: "Messages", icon: "Mail", href: "/messages", badgeCount: 12 },
  { id: "notifications", label: "Notifications", icon: "Bell", href: "/notifications", badgeCount: 23 },
  { id: "services", label: "Services", icon: "Settings2", href: "/services" },
];

export const NAV_SECONDARY_ITEMS: NavItem[] = [
  { id: "saved", label: "Saved", icon: "Bookmark", href: "/saved" },
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

export const FEED_POSTS: ContentPost[] = [
  {
    id: "post-1",
    kind: "property",
    author: {
      name: "Ama Serwaa",
      avatar: "/images/avatar-ama-serwaa-post.png",
      verified: true,
      subtitle: "2h ago • Accra",
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
  },
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

export const TOP_SERVICE_PROVIDERS: ServiceProvider[] = [
  { id: "brightfix", name: "BrightFix", avatar: "/images/avatar-brightfix-provider.png", rating: 4.9 },
  { id: "dee-interiors", name: "Dee Interiors", icon: "PencilRuler", rating: 4.8 },
  { id: "buildwell-gh", name: "BuildWell GH", icon: "HardHat", rating: 4.9 },
  { id: "fixright", name: "FixRight", icon: "Wrench", rating: 4.7 },
];
