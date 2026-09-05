import {
  CONTACT_FOR_PRICE_ALLOWED,
  type MarketplaceCategory,
  type MarketplaceItem,
} from "@/types/marketplace";

/**
 * Mock stand-in for the real `GET /api/marketplace/search` endpoint (server
 * side, Phase 1 — not built in this branch). `fetchMarketplaceSearch()` is
 * the ONLY export the page/components should ever call; nothing outside
 * this file should import `MOCK_ITEMS` directly. When the backend lands,
 * this function's body is the only thing that needs to change — swap its
 * insides for an `apiGet<...>("/marketplace/search?...")` call and every
 * caller keeps working unmodified, same convention as `lib/api/*.ts`.
 */

const MOCK_ITEMS: MarketplaceItem[] = [
  // -- Properties, Sale -----------------------------------------------
  {
    id: "prop-sale-1",
    category: "property_sale",
    title: "4 Bedroom Detached House, East Legon",
    location: "East Legon, Accra",
    price: { amount: 850000, currency: "GHS", unit: "total" },
    media: [{ url: "/images/post-house-main.jpg" }],
    verified: true,
    linkTo: "/properties/prop-sale-1",
    facts: ["4 Bed", "3 Bath", "320 sqm"],
  },
  {
    id: "prop-sale-2",
    category: "property_sale",
    title: "3 Bedroom Semi-Detached, Airport Residential",
    location: "Airport Residential, Accra",
    price: { amount: 620000, currency: "GHS", unit: "total" },
    media: [{ url: "/images/post-house-thumb-1.jpg" }],
    verified: false,
    linkTo: "/properties/prop-sale-2",
    facts: ["3 Bed", "2 Bath", "210 sqm"],
  },

  // -- Properties, Rental -----------------------------------------------
  {
    id: "prop-rent-1",
    category: "property_rental",
    title: "2 Bedroom Apartment, Tarkwa",
    location: "Tarkwa, Western Region",
    price: { amount: 2500, currency: "GHS", unit: "per_month" },
    media: [{ url: "/images/property-trending-1.png" }],
    verified: true,
    linkTo: "/properties/prop-rent-1",
    facts: ["2 Bed", "1 Bath", "90 sqm"],
  },
  {
    id: "prop-rent-2",
    category: "property_rental",
    title: "Studio Apartment, Osu",
    location: "Osu, Accra",
    price: { amount: 3200, currency: "GHS", unit: "per_month" },
    media: [{ url: "/images/property-trending-2.jpg" }],
    verified: true,
    linkTo: "/properties/prop-rent-2",
    facts: ["Studio", "1 Bath", "45 sqm"],
  },

  // -- Land -----------------------------------------------------------
  {
    id: "land-1",
    category: "land",
    title: "Registered Plot, Kasoa New Market Road",
    location: "Kasoa, Central Region",
    price: { amount: 45000, currency: "GHS", unit: "per_plot" },
    media: [{ url: "/images/property-map-canvas.png" }],
    verified: true,
    linkTo: "/properties/land-1",
    facts: ["1 Plot (100x100 ft)", "Registered title"],
  },
  {
    id: "land-2",
    category: "land",
    title: "Beachfront Land, Ada",
    location: "Ada, Greater Accra",
    price: { amount: 180000, currency: "GHS", unit: "range" },
    media: [{ url: "/images/stay-luxury-beach-resort-1.jpg" }],
    verified: false,
    linkTo: "/properties/land-2",
    facts: ["2 Plots available", "Coastal"],
  },

  // -- Stay -------------------------------------------------------------
  {
    id: "stay-1",
    category: "stay",
    title: "Labadi Beach Hotel",
    location: "Labadi, Accra",
    price: { amount: 1200, currency: "GHS", unit: "per_night" },
    media: [{ url: "/images/stay-luxury-beach-resort-hero.jpg" }],
    verified: true,
    linkTo: "/stay/stay-1",
    facts: ["4.8 ★", "Hotel", "Free WiFi"],
  },
  {
    id: "stay-2",
    category: "stay",
    title: "Kumasi City Apartment Suites",
    location: "Adum, Kumasi",
    price: { amount: 450, currency: "GHS", unit: "per_night" },
    media: [{ url: "/images/stay-luxury-beach-resort-2.jpg" }],
    verified: false,
    linkTo: "/stay/stay-2",
    facts: ["4.3 ★", "Apartment"],
  },

  // -- Professional Services --------------------------------------------
  {
    id: "prof-1",
    category: "professional_service",
    title: "Ama Serwaa — Interior Designer",
    location: "East Legon, Accra",
    price: { amount: 3500, currency: "GHS", unit: "starting_from" },
    media: [{ url: "/images/avatar-dee-interiors-follow.png" }],
    verified: true,
    linkTo: "/professionals/prof-1",
    facts: ["Interior Design", "8 yrs experience"],
  },
  {
    id: "prof-2",
    category: "professional_service",
    title: "Kojo Mensah — Licensed Surveyor",
    location: "Takoradi, Western Region",
    price: { amount: 800, currency: "GHS", unit: "per_job" },
    media: [{ url: "/images/avatar-kojo-mensah-follow.png" }],
    verified: true,
    linkTo: "/professionals/prof-2",
    facts: ["Land Surveying", "Registered"],
  },

  // -- Artisan Services ---------------------------------------------------
  {
    id: "artisan-1",
    category: "artisan_service",
    title: "Yaw Boateng — Electrician",
    location: "Tarkwa, Western Region",
    price: { amount: 80, currency: "GHS", unit: "per_hour" },
    media: [{ url: "/images/post-electrician.png" }],
    verified: true,
    linkTo: "/craftwork/artisan-1",
    facts: ["Electrician", "Available near me"],
  },
  {
    id: "artisan-2",
    category: "artisan_service",
    title: "Abena Owusu — Plumber",
    location: "Madina, Accra",
    price: { amount: 250, currency: "GHS", unit: "per_job" },
    media: [{ url: "/images/avatar-brightfix-post.png" }],
    verified: false,
    linkTo: "/craftwork/artisan-2",
    facts: ["Plumbing", "Emergency callout"],
  },

  // -- Property/Facility Services -----------------------------------------
  {
    id: "service-1",
    category: "service_business",
    title: "CleanPro Facility Services",
    location: "Spintex, Accra",
    price: { amount: 600, currency: "GHS", unit: "per_month" },
    media: [{ url: "/images/avatar-builders-gh-follow.png" }],
    verified: true,
    linkTo: "/services/service-1",
    facts: ["Cleaning & Maintenance", "Contract or one-off"],
  },
  {
    id: "service-2",
    category: "service_business",
    title: "SecureGate Estate Security",
    location: "Kumasi",
    price: { amount: 1800, currency: "GHS", unit: "per_month" },
    media: [{ url: "/images/concierge-portrait.png" }],
    verified: true,
    linkTo: "/services/service-2",
    facts: ["Estate Security", "24/7 patrol"],
  },

  // -- Materials ----------------------------------------------------------
  {
    id: "material-1",
    category: "materials",
    title: "Dangote 42.5R Cement",
    location: "Tema, Greater Accra",
    price: { amount: 78, currency: "GHS", unit: "total" },
    media: [{ url: "/images/post-house-thumb-2.png" }],
    verified: true,
    linkTo: "/services/material-1",
    facts: ["Unit: per bag", "Min. order: 50 bags"],
  },
  {
    id: "material-2",
    category: "materials",
    title: "Quarry Chippings (Aggregate)",
    location: "Nsawam, Eastern Region",
    price: { amount: 950, currency: "GHS", unit: "total" },
    media: [{ url: "/images/story-builders-gh-1.jpg" }],
    verified: false,
    linkTo: "/services/material-2",
    facts: ["Unit: per trip (tipper truck)", "Min. order: 1 trip"],
  },

  // -- Equipment ------------------------------------------------------
  {
    id: "equipment-1",
    category: "equipment",
    title: "CAT 320 Excavator",
    location: "Takoradi, Western Region",
    price: { amount: 1500, currency: "GHS", unit: "per_job" },
    media: [{ url: "/images/story-builders-gh-2.jpg" }],
    verified: true,
    linkTo: "/services/equipment-1",
    saleOrHire: "hire",
    facts: ["Excavator hire", "Operator included"],
  },
  {
    id: "equipment-2",
    category: "equipment",
    title: "Tipper Truck (10-Ton)",
    location: "Accra",
    price: { amount: 350000, currency: "GHS", unit: "total" },
    media: [{ url: "/images/avatar-builders-gh-story.png" }],
    verified: false,
    linkTo: "/services/equipment-2",
    saleOrHire: "sale",
    facts: ["For sale", "2019 model"],
  },

  // -- Projects/Developments ---------------------------------------------
  {
    id: "project-1",
    category: "project",
    title: "Appolonia City — Phase 3",
    location: "Oyibi, Greater Accra",
    price: { amount: 320000, currency: "GHS", unit: "starting_from" },
    media: [{ url: "/images/story-dee-interiors-2.jpg" }],
    verified: true,
    linkTo: "/properties/project-1",
    facts: ["Gated community", "Serviced plots + built homes"],
  },
  {
    id: "project-2",
    category: "project",
    title: "Marina Heights Mixed-Use Development",
    location: "Airport City, Accra",
    // Contact for Price is only ever valid here because "project" is on
    // CONTACT_FOR_PRICE_ALLOWED — see isMarketplaceItemValid() below, which
    // would reject this same `null` on any other category.
    price: null,
    media: [{ url: "/images/story-ama-serwaa-1.jpg" }],
    verified: true,
    linkTo: "/properties/project-2",
    facts: ["Mixed-use", "Pre-launch — pricing on request"],
  },
];

/** Defensive re-check of the spec's price-first hard rule against whatever
 * this "endpoint" is about to return. A UI-side allow-list check
 * (`CATEGORY_META`/`CONTACT_FOR_PRICE_ALLOWED`) only helps if every source
 * of `MarketplaceItem`s actually honors it — this makes that guarantee hold
 * even if someone edits `MOCK_ITEMS` carelessly later, or once a real
 * backend response replaces it. */
function isMarketplaceItemValid(item: MarketplaceItem): boolean {
  if (item.price !== null) return true;
  const allowed = CONTACT_FOR_PRICE_ALLOWED.includes(item.category);
  if (!allowed && process.env.NODE_ENV !== "production") {
    console.warn(
      `[marketplace] dropped "${item.id}" (${item.category}): null price on a category not in CONTACT_FOR_PRICE_ALLOWED`,
    );
  }
  return allowed;
}

export interface MarketplaceSearchParams {
  category?: MarketplaceCategory | "all";
  query?: string;
  location?: string;
  page?: number;
  limit?: number;
}

export interface MarketplaceSearchResult {
  items: MarketplaceItem[];
  total: number;
  page: number;
}

const DEFAULT_LIMIT = 12;
// Small artificial delay so loading states are actually visible against
// mock data, and so callers already write the same "await + loading flag"
// code they'll need once this is swapped for a real network call.
const MOCK_LATENCY_MS = 300;

/** Matches free text against title, category label's own search terms, and
 * facts — e.g. "electrician" matches an artisan_service item via its facts
 * even though "electrician" isn't in the title's every word. */
function matchesQuery(item: MarketplaceItem, query: string): boolean {
  const haystack = [item.title, item.location, ...(item.facts ?? [])].join(" ").toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function matchesLocation(item: MarketplaceItem, location: string): boolean {
  return item.location.toLowerCase().includes(location.toLowerCase());
}

export function fetchMarketplaceSearch(params: MarketplaceSearchParams = {}): Promise<MarketplaceSearchResult> {
  const { category = "all", query = "", location = "", page = 1, limit = DEFAULT_LIMIT } = params;

  return new Promise((resolve) => {
    setTimeout(() => {
      let results = MOCK_ITEMS.filter(isMarketplaceItemValid);

      if (category !== "all") {
        results = results.filter((item) => item.category === category);
      }
      if (query.trim()) {
        results = results.filter((item) => matchesQuery(item, query.trim()));
      }
      if (location.trim()) {
        results = results.filter((item) => matchesLocation(item, location.trim()));
      }

      const total = results.length;
      const start = (page - 1) * limit;
      const items = results.slice(start, start + limit);

      resolve({ items, total, page });
    }, MOCK_LATENCY_MS);
  });
}
