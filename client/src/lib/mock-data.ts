import type { Amenity, Category, NavItem, StayCategory } from "@/types/home";
import type { IconName } from "@/components/ui/DynamicIcon";

// The Home feed, stories, saved posts, trending properties, top service
// providers, "who to follow", and the Stay page's venue listings all come
// from the real API now (see lib/api/* and lib/adapters.ts) — what's left
// here is UI config, not data: nav labels and the Stay page's
// category/amenity chip labels (STAY_CATEGORIES/AMENITIES).

export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: "Home", href: "/" },
  { id: "properties", label: "Property", icon: "Building2", href: "/properties" },
  { id: "stay", label: "Stay (Hotels)", icon: "BedDouble", href: "/stay" },
  { id: "craftwork", label: "Craftwork", icon: "Hammer", href: "/craftwork" },
  { id: "professionals", label: "Professionals", icon: "Users", href: "/professionals" },
  { id: "saved", label: "Saved", icon: "Bookmark", href: "/saved" },
];

export const NAV_SECONDARY_ITEMS: NavItem[] = [
  { id: "verification", label: "Verification Centre", icon: "ShieldCheck", href: "/verification" },
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
