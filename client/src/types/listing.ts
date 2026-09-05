import type { IconName } from "@/components/ui/DynamicIcon";

/**
 * My Listings & Property Portfolio — an owner's private workspace for
 * creating and managing their own property listings through an 11-step
 * wizard and a status lifecycle. Distinct from CreatePostModal's "tag a
 * feed post as a property" flow (a lightweight, one-shot attachment to a
 * social post) — this is the actual listing-management system a property
 * lives in before it ever shows up as a post or a Marketplace/Properties
 * card.
 */

export type ListingStatus =
  | "draft"
  | "pending_verification"
  | "pending_review"
  | "published"
  | "paused"
  | "under_offer"
  | "sold"
  | "rented"
  | "expired"
  | "rejected"
  | "archived";

export const LISTING_STATUSES: ListingStatus[] = [
  "draft",
  "pending_verification",
  "pending_review",
  "published",
  "paused",
  "under_offer",
  "sold",
  "rented",
  "expired",
  "rejected",
  "archived",
];

/** Label + badge color per status, one registry so a status never reads
 * differently between a summary card, a status tab, and a listing's own
 * badge. Enforcement of which transitions are legal is the backend's job
 * (per spec) — this is display-only. */
export const STATUS_META: Record<ListingStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-surface-muted text-ink" },
  pending_verification: { label: "Pending Verification", className: "bg-brand-gold/15 text-brand-navy" },
  pending_review: { label: "Pending Review", className: "bg-brand-gold/15 text-brand-navy" },
  published: { label: "Published", className: "bg-green-100 text-green-800" },
  paused: { label: "Paused", className: "bg-amber-100 text-amber-800" },
  under_offer: { label: "Under Offer", className: "bg-blue-100 text-blue-800" },
  sold: { label: "Sold", className: "bg-brand-navy text-white" },
  rented: { label: "Rented", className: "bg-brand-navy text-white" },
  expired: { label: "Expired", className: "bg-red-100 text-red-800" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-800" },
  archived: { label: "Archived", className: "bg-surface-muted-2 text-muted" },
};

/** Whether a listing in this status is actually live for the public —
 * gates the enquiry/viewing CTAs everywhere a listing renders (per spec:
 * "Publish/pause/status actions must immediately... gate the enquiry/
 * viewing CTAs shown on the listing everywhere it renders"). Only
 * `published` is live; every other status (including `under_offer`, which
 * still shouldn't take new enquiries) hides those actions. */
export function isListingLive(status: ListingStatus): boolean {
  return status === "published";
}

export type ListingPurpose = "sale" | "rent" | "lease";

export const LISTING_PURPOSES: { id: ListingPurpose; label: string }[] = [
  { id: "sale", label: "For Sale" },
  { id: "rent", label: "For Rent" },
  { id: "lease", label: "For Lease" },
];

export type PropertyCategory = "residential" | "land" | "commercial";

export const PROPERTY_CATEGORIES: { id: PropertyCategory; label: string; icon: IconName }[] = [
  { id: "residential", label: "Residential", icon: "Home" },
  { id: "land", label: "Land", icon: "Mountain" },
  { id: "commercial", label: "Commercial", icon: "Building" },
];

export type AddressPrecision = "exact" | "approximate" | "hidden";

export interface ListingLocation {
  address: string;
  area: string;
  city: string;
  region: string;
  lat?: number;
  lng?: number;
  /** Controls how much of the address is shown publicly — the spec's
   * "controlled public-address precision": `exact` shows the full street
   * address, `approximate` shows only area/city, `hidden` shows only the
   * city/region. Never affects what the owner sees in their own workspace,
   * only what PropertyDetailsView renders publicly. */
  precision: AddressPrecision;
}

/** Residential-only facts (Property Details step, residential branch). */
export interface ResidentialDetails {
  bedrooms?: number;
  bathrooms?: number;
  areaSqm?: number;
  parkingSpaces?: number;
  yearBuilt?: number;
  furnished?: boolean;
}

/** Land-only facts (Property Details step, land branch). */
export interface LandDetails {
  plotSize?: number;
  plotUnit?: "sqm" | "acres" | "plots";
  titleType?: string;
  topography?: string;
}

/** Commercial-only facts (Property Details step, commercial branch). */
export interface CommercialDetails {
  floorAreaSqm?: number;
  unitsCount?: number;
  zoning?: string;
  floorLevel?: string;
}

export interface ListingPricing {
  amount: number;
  currency: string;
  unit: "total" | "per_month" | "per_year" | "per_plot";
  negotiable: boolean;
}

export type ViewingMode = "by_appointment" | "open_house" | "virtual_tour";

export interface ViewingContact {
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  viewingMode: ViewingMode;
  preferredContactMethod: "phone" | "email" | "whatsapp";
}

export interface ListingMedia {
  url: string;
  type: "image" | "video";
}

/** Authority & Verification step is stubbed per spec — no real document
 * upload or verification logic, just a "pending" state to render. */
export interface AuthorityVerification {
  status: "pending";
}

export interface Listing {
  id: string;
  ownerId: string;
  status: ListingStatus;
  purpose: ListingPurpose | null;
  category: PropertyCategory | null;
  title: string;
  propertyType: string;
  location: ListingLocation;
  residential: ResidentialDetails;
  land: LandDetails;
  commercial: CommercialDetails;
  pricing: ListingPricing | null;
  features: string[];
  description: string;
  media: ListingMedia[];
  viewingContact: ViewingContact | null;
  authority: AuthorityVerification;
  /** Optional: when a live listing is due to lapse — backs the "Expiring
   * Soon" portfolio summary card with a real computed count rather than a
   * stub. */
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

/** A blank in-progress draft — every field optional/empty until the wizard
 * fills it in, but always a real object (never `undefined`) so every step
 * component can read from it without null-checking the whole draft. */
export function createEmptyListingDraft(): Omit<Listing, "id" | "ownerId" | "status" | "createdAt" | "updatedAt"> {
  return {
    purpose: null,
    category: null,
    title: "",
    propertyType: "",
    location: { address: "", area: "", city: "", region: "", precision: "approximate" },
    residential: {},
    land: {},
    commercial: {},
    pricing: null,
    features: [],
    description: "",
    media: [],
    viewingContact: null,
    authority: { status: "pending" },
  };
}

export const FEATURES: { id: string; label: string; icon: IconName }[] = [
  { id: "security", label: "24/7 Security", icon: "ShieldCheck" },
  { id: "borehole", label: "Borehole / Water Storage", icon: "Waves" },
  { id: "solar", label: "Solar Power", icon: "Wind" },
  { id: "cctv", label: "CCTV", icon: "Eye" },
  { id: "furnished", label: "Furnished", icon: "Home" },
  { id: "garden", label: "Garden", icon: "Mountain" },
  { id: "pool", label: "Swimming Pool", icon: "Waves" },
  { id: "gym", label: "Gym", icon: "Dumbbell" },
  { id: "parking", label: "Parking", icon: "ParkingCircle" },
  { id: "ac", label: "Air Conditioning", icon: "Wind" },
  { id: "pets", label: "Pets Allowed", icon: "Check" },
  { id: "wifi", label: "WiFi Ready", icon: "Wifi" },
];

export const VIEWING_MODES: { id: ViewingMode; label: string }[] = [
  { id: "by_appointment", label: "By Appointment" },
  { id: "open_house", label: "Open House" },
  { id: "virtual_tour", label: "Virtual Tour" },
];

/** A small denylist of clearly prohibited content patterns — enough to back
 * the Preview step's "prohibited content" blocking-error check per spec.
 * Real moderation is a backend concern; this is a UI-only guard against
 * the most obvious cases. */
const PROHIBITED_PATTERNS = [/\bwhatsapp me\b.*\bcash\b/i, /\bno agents?\s+fee\b.*\bguarantee/i];

/** The one place a listing's price+unit gets turned into display text —
 * PropertyDetailsView, the portfolio grid/table, and anywhere else a
 * listing's price shows should all call this rather than formatting a
 * price inline, so the unit vocabulary never drifts across the app. */
export function formatListingPrice(pricing: ListingPricing | null): string {
  if (!pricing) return "Contact for Price";
  const amount = `${pricing.currency} ${pricing.amount.toLocaleString()}`;
  const suffix =
    pricing.unit === "per_month" ? "/month" : pricing.unit === "per_year" ? "/year" : pricing.unit === "per_plot" ? "/plot" : "";
  return suffix ? `${amount} ${suffix}` : amount;
}

export interface ListingValidation {
  errors: string[];
  warnings: string[];
}

/** The Preview step's completion checklist — separates blocking errors
 * (spec: no price, invalid location, missing authority, prohibited
 * content) from warnings (low photo count, unusual price) exactly as
 * named in the spec. */
export function validateListing(draft: Listing): ListingValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!draft.pricing || !draft.pricing.amount || draft.pricing.amount <= 0) {
    errors.push("No price has been set.");
  }
  if (!draft.location.address.trim() || !draft.location.city.trim()) {
    errors.push("Location is incomplete or invalid — a street address and city are required.");
  }
  if (draft.authority.status !== "pending") {
    // Authority & Verification is stubbed — every draft sits at "pending"
    // until the (not-yet-built) real verification flow exists, so this
    // branch is here for when that lands, not reachable today.
    errors.push("Authority & Verification has not been completed.");
  }
  if (PROHIBITED_PATTERNS.some((pattern) => pattern.test(draft.description))) {
    errors.push("The description appears to contain prohibited content.");
  }

  if (draft.media.length < 3) {
    warnings.push("This listing has fewer than 3 photos — listings with more photos get more views.");
  }
  if (draft.pricing) {
    const amount = draft.pricing.amount;
    const isLand = draft.category === "land";
    const tooLow = isLand ? amount < 1000 : amount < 500;
    const tooHigh = amount > 50_000_000;
    if (tooLow || tooHigh) {
      warnings.push("This price looks unusual compared to similar listings — double-check it before publishing.");
    }
  }

  return { errors, warnings };
}
