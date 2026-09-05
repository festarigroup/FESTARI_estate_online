import type { IconName } from "@/components/ui/DynamicIcon";

/**
 * Biltlinx Marketplace — the price-first aggregator surface that searches
 * across every category (Properties, Stay, Professionals, Artisans,
 * Services, Materials, Equipment, Projects) from one entry point.
 *
 * This is the ONLY category union the Marketplace UI understands. It's
 * intentionally more granular than the source pages' own tags (e.g.
 * "property_sale" vs "property_rental" split out, where Properties itself
 * just has one `PropertyPost`) because the search/filter UX here needs to
 * narrow by sale-vs-rental the way a real marketplace listing does.
 */
export type MarketplaceCategory =
  | "property_sale"
  | "property_rental"
  | "land"
  | "stay"
  | "professional_service"
  | "artisan_service"
  | "service_business"
  | "materials"
  | "equipment"
  | "project";

export const MARKETPLACE_CATEGORIES: MarketplaceCategory[] = [
  "property_sale",
  "property_rental",
  "land",
  "stay",
  "professional_service",
  "artisan_service",
  "service_business",
  "materials",
  "equipment",
  "project",
];

/** Label + icon shown on both the category filter chips and each card's
 * category badge — one registry so the two never drift apart. */
export const CATEGORY_META: Record<MarketplaceCategory, { label: string; icon: IconName }> = {
  property_sale: { label: "Property · Sale", icon: "Building2" },
  property_rental: { label: "Property · Rental", icon: "Key" },
  land: { label: "Land", icon: "Mountain" },
  stay: { label: "Stay", icon: "BedDouble" },
  professional_service: { label: "Professional Service", icon: "Briefcase" },
  artisan_service: { label: "Artisan Service", icon: "Hammer" },
  service_business: { label: "Property/Facility Service", icon: "Wrench" },
  materials: { label: "Materials", icon: "Package" },
  equipment: { label: "Equipment", icon: "Truck" },
  project: { label: "Project/Development", icon: "Construction" },
};

/** Every unit the spec's price-first hard rule allows. `null` price is
 * never one of these — a missing price is modeled by `MarketplaceItem.price`
 * itself being `null`, gated separately by `CONTACT_FOR_PRICE_ALLOWED`. */
export type MarketplacePriceUnit =
  | "total"
  | "per_month"
  | "per_night"
  | "per_plot"
  | "per_hour"
  | "per_job"
  | "per_sqm"
  | "starting_from"
  | "range";

export interface MarketplacePrice {
  amount: number;
  currency: string;
  unit: MarketplacePriceUnit;
}

export interface MarketplaceMedia {
  url: string;
}

/**
 * The live read-shape every category's search result gets normalized into.
 * Mirrors the API contract the real `GET /api/marketplace/search` endpoint
 * will return — see `lib/mocks/marketplace.ts`'s doc comment for how this
 * mock stands in for that endpoint today.
 */
export interface MarketplaceItem {
  id: string;
  category: MarketplaceCategory;
  title: string;
  location: string;
  /** `null` only ever allowed when `category` is in `CONTACT_FOR_PRICE_ALLOWED`
   * — see that constant's own doc comment for the hard rule this enforces. */
  price: MarketplacePrice | null;
  media: MarketplaceMedia[];
  verified: boolean;
  /** Route to the source module's own detail page — Marketplace never owns
   * a competing detail view, it only ever links out to Properties/Stay/
   * Professionals/etc. */
  linkTo: string;
  /** Up to a few short category-specific facts rendered as a compact strip
   * under the title — e.g. `["3 Bed", "2 Bath", "120 sqm"]` for a property,
   * `["Unit: per bag", "Min. order: 50 bags"]` for materials. Keeps
   * `UniversalCard` a single component instead of ten bespoke ones while
   * still giving every category its own body. */
  facts?: string[];
  /** Equipment only — the spec calls this out as its own badge (distinct
   * from the generic `facts` strip), not folded into it. */
  saleOrHire?: "sale" | "hire";
}

/**
 * Hard rule from the spec: every eligible card MUST show a price with an
 * explicit unit. "Contact for Price" is never the default — only a category
 * on this explicit allow-list may return a `null` price. Keep this list
 * short and deliberate; adding a category here should be a product decision,
 * not a fallback for missing data.
 */
export const CONTACT_FOR_PRICE_ALLOWED: MarketplaceCategory[] = ["project"];

export function isContactForPriceAllowed(category: MarketplaceCategory): boolean {
  return CONTACT_FOR_PRICE_ALLOWED.includes(category);
}

const UNIT_LABEL: Record<MarketplacePriceUnit, string> = {
  total: "",
  per_month: "/month",
  per_night: "/night",
  per_plot: "/plot",
  per_hour: "/hour",
  per_job: "/job",
  per_sqm: "/sqm",
  starting_from: "",
  range: "",
};

/** The single place price+unit gets turned into display text — every card
 * and any future list/detail view should call this rather than formatting
 * a price inline, so the unit vocabulary never drifts across the app. */
export function formatMarketplacePrice(price: MarketplacePrice | null): string {
  if (!price) return "Contact for Price";
  const amount = `${price.currency} ${price.amount.toLocaleString()}`;
  if (price.unit === "starting_from") return `From ${amount}`;
  if (price.unit === "range") return `${amount}+`;
  const suffix = UNIT_LABEL[price.unit];
  return suffix ? `${amount} ${suffix}` : amount;
}
