import {
  type Listing,
  type ListingStatus,
  type PropertyCategory,
  createEmptyListingDraft,
} from "@/types/listing";

/**
 * Mock stand-in for the real listing-lifecycle endpoints (server side,
 * Phase 1 — not built in this branch):
 *   POST   /api/listings                  -> createListing
 *   PATCH  /api/listings/:id               -> updateListing
 *   POST   /api/listings/:id/submit        -> submitListing
 *   POST   /api/listings/:id/publish       -> publishListing
 *   POST   /api/listings/:id/pause         -> pauseListing
 *   POST   /api/listings/:id/status        -> setListingStatus
 *   GET    /api/listings/:id/preview       -> getListingPreview
 *   GET    /api/listings?owner=me          -> listMyListings
 *
 * Every function here is the ONE swap point for its matching endpoint —
 * nothing outside this file should import MOCK_LISTINGS directly. When the
 * backend lands, each function's body is the only thing that needs to
 * change, same convention lib/mocks/marketplace.ts already established.
 *
 * The in-memory array is mutated in place (not replaced) so every caller
 * sees create/edit/publish/pause/status changes reflected immediately,
 * matching the spec's "Publish/pause/status actions must immediately
 * update the visible status tab" requirement even against mock data.
 */

const CURRENT_OWNER_ID = "me";
const LATENCY_MS = 250;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

function nowIso(): string {
  return new Date().toISOString();
}

function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

function seedListing(overrides: Partial<Listing> & Pick<Listing, "id" | "status" | "title">): Listing {
  const base = createEmptyListingDraft();
  return {
    ...base,
    ownerId: CURRENT_OWNER_ID,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    purpose: "sale",
    category: "residential",
    propertyType: "Detached House",
    location: { address: "12 Ridge Ave", area: "East Legon", city: "Accra", region: "Greater Accra", precision: "approximate" },
    residential: { bedrooms: 4, bathrooms: 3, areaSqm: 320, parkingSpaces: 2, yearBuilt: 2019 },
    pricing: { amount: 850000, currency: "GHS", unit: "total", negotiable: true },
    features: ["security", "parking"],
    description: "A well-maintained family home in a quiet, secure neighborhood.",
    media: [{ url: "/images/post-house-main.jpg", type: "image" }, { url: "/images/post-house-thumb-1.jpg", type: "image" }],
    viewingContact: {
      contactName: "You",
      contactPhone: "+233 20 000 0000",
      contactEmail: "owner@example.com",
      viewingMode: "by_appointment",
      preferredContactMethod: "phone",
    },
    ...overrides,
  };
}

const MOCK_LISTINGS: Listing[] = [
  seedListing({
    id: "listing-draft-1",
    status: "draft",
    title: "3 Bedroom House, Adenta (draft)",
    propertyType: "Semi-Detached House",
    pricing: null,
    media: [],
    description: "",
  }),
  seedListing({
    id: "listing-pending-verification-1",
    status: "pending_verification",
    title: "2 Bedroom Apartment, Osu",
    propertyType: "Apartment",
    purpose: "rent",
    pricing: { amount: 3200, currency: "GHS", unit: "per_month", negotiable: false },
  }),
  seedListing({
    id: "listing-pending-review-1",
    status: "pending_review",
    title: "Registered Plot, Kasoa",
    category: "land",
    propertyType: "Residential Plot",
    residential: {},
    land: { plotSize: 100, plotUnit: "plots", titleType: "Registered", topography: "Flat" },
    pricing: { amount: 45000, currency: "GHS", unit: "per_plot", negotiable: true },
  }),
  seedListing({
    id: "listing-published-1",
    status: "published",
    title: "4 Bedroom Detached House, East Legon",
    expiresAt: daysFromNow(45),
  }),
  seedListing({
    id: "listing-published-2",
    status: "published",
    title: "Studio Apartment, Osu",
    propertyType: "Studio Apartment",
    purpose: "rent",
    pricing: { amount: 3200, currency: "GHS", unit: "per_month", negotiable: false },
    expiresAt: daysFromNow(5),
  }),
  seedListing({
    id: "listing-paused-1",
    status: "paused",
    title: "Office Suite, Airport City",
    category: "commercial",
    propertyType: "Office Suite",
    purpose: "lease",
    residential: {},
    commercial: { floorAreaSqm: 180, unitsCount: 1, zoning: "Commercial", floorLevel: "3rd Floor" },
    pricing: { amount: 12000, currency: "GHS", unit: "per_month", negotiable: true },
  }),
  seedListing({
    id: "listing-under-offer-1",
    status: "under_offer",
    title: "3 Bedroom Semi-Detached, Airport Residential",
    propertyType: "Semi-Detached House",
  }),
  seedListing({
    id: "listing-sold-1",
    status: "sold",
    title: "5 Bedroom House, Trasacco Valley",
    pricing: { amount: 1_650_000, currency: "GHS", unit: "total", negotiable: false },
  }),
  seedListing({
    id: "listing-rented-1",
    status: "rented",
    title: "2 Bedroom Apartment, Cantonments",
    propertyType: "Apartment",
    purpose: "rent",
    pricing: { amount: 5500, currency: "GHS", unit: "per_month", negotiable: false },
  }),
  seedListing({
    id: "listing-expired-1",
    status: "expired",
    title: "Beachfront Land, Ada",
    category: "land",
    propertyType: "Coastal Plot",
    residential: {},
    land: { plotSize: 2, plotUnit: "plots", titleType: "Indenture", topography: "Coastal" },
    pricing: { amount: 180000, currency: "GHS", unit: "per_plot", negotiable: true },
  }),
  seedListing({
    id: "listing-rejected-1",
    status: "rejected",
    title: "Land Parcel, Kumasi Ridge",
    category: "land",
    propertyType: "Residential Plot",
    residential: {},
    land: { plotSize: 1, plotUnit: "plots", titleType: "Unregistered", topography: "Sloped" },
    pricing: { amount: 30000, currency: "GHS", unit: "per_plot", negotiable: true },
  }),
  seedListing({
    id: "listing-archived-1",
    status: "archived",
    title: "1 Bedroom Apartment, Dansoman",
    propertyType: "Apartment",
    purpose: "rent",
    pricing: { amount: 1800, currency: "GHS", unit: "per_month", negotiable: false },
  }),
];

let nextId = MOCK_LISTINGS.length + 1;

export function countsByStatus(items: Listing[]): Record<ListingStatus, number> {
  const counts = {
    draft: 0,
    pending_verification: 0,
    pending_review: 0,
    published: 0,
    paused: 0,
    under_offer: 0,
    sold: 0,
    rented: 0,
    expired: 0,
    rejected: 0,
    archived: 0,
  } as Record<ListingStatus, number>;
  for (const item of items) counts[item.status]++;
  return counts;
}

export interface ListMyListingsResult {
  items: Listing[];
  countsByStatus: Record<ListingStatus, number>;
}

export function listMyListings(params: { owner?: string } = {}): Promise<ListMyListingsResult> {
  const owner = params.owner ?? CURRENT_OWNER_ID;
  const items = MOCK_LISTINGS.filter((listing) => listing.ownerId === owner);
  return delay({ items: [...items], countsByStatus: countsByStatus(items) });
}

export function getListing(id: string): Promise<Listing | null> {
  return delay(MOCK_LISTINGS.find((listing) => listing.id === id) ?? null);
}

/** Same shape as `getListing` — kept as its own named function because it
 * maps to its own real endpoint (`GET /api/listings/:id/preview`), which
 * may end up resolving a denormalized public-facing projection rather
 * than the raw owner-side record once a real backend exists. */
export function getListingPreview(id: string): Promise<Listing | null> {
  return getListing(id);
}

type NewListingInput = Partial<Omit<Listing, "id" | "ownerId" | "status" | "createdAt" | "updatedAt">>;

export function createListing(input: NewListingInput = {}): Promise<Listing> {
  const listing: Listing = {
    ...createEmptyListingDraft(),
    ...input,
    id: `listing-${nextId++}`,
    ownerId: CURRENT_OWNER_ID,
    status: "draft",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  MOCK_LISTINGS.unshift(listing);
  return delay(listing);
}

export function updateListing(id: string, patch: Partial<Listing>): Promise<Listing> {
  const index = MOCK_LISTINGS.findIndex((listing) => listing.id === id);
  if (index === -1) return Promise.reject(new Error(`Listing "${id}" not found`));
  const updated: Listing = { ...MOCK_LISTINGS[index], ...patch, id, ownerId: CURRENT_OWNER_ID, updatedAt: nowIso() };
  MOCK_LISTINGS[index] = updated;
  return delay(updated);
}

function transition(id: string, status: ListingStatus): Promise<Listing> {
  return updateListing(id, { status });
}

/** POST /api/listings/:id/submit — Draft -> Pending Review, per the
 * contract's own documented response shape (`{ status: "pending_review" }`).
 * The spec's status model also names a separate "Pending Verification"
 * stage; since Authority & Verification is stubbed with no real check to
 * gate on, every submission goes straight to Pending Review, matching the
 * contract literally rather than inventing an unstubbed verification gate. */
export function submitListing(id: string): Promise<Listing> {
  return transition(id, "pending_review");
}

export function publishListing(id: string): Promise<Listing> {
  return transition(id, "published");
}

export function pauseListing(id: string): Promise<Listing> {
  return transition(id, "paused");
}

/** POST /api/listings/:id/status — the one generic transition every other
 * status change (Under Offer, Sold, Rented, Expired, Rejected, Archived)
 * goes through. Accepts any `ListingStatus` rather than the contract's own
 * narrower literal union: per spec, enforcing which transitions are legal
 * is the backend's job, not the frontend's — this just reflects whatever
 * status comes back. */
export function setListingStatus(id: string, status: ListingStatus): Promise<Listing> {
  return transition(id, status);
}

export interface DuplicateCheckInput {
  address: string;
  city: string;
  category: PropertyCategory | null;
  excludeId?: string;
}

/** UI-only duplicate-property warning (per spec) — a same-address,
 * same-category match against this owner's own other listings. Synchronous
 * and not routed through `delay()`: it's meant to run live as the Location
 * step's address fields are typed, not to simulate a network round trip. */
export function findDuplicateListing({ address, city, category, excludeId }: DuplicateCheckInput): Listing | undefined {
  const normalizedAddress = address.trim().toLowerCase();
  const normalizedCity = city.trim().toLowerCase();
  if (!normalizedAddress || !normalizedCity) return undefined;

  return MOCK_LISTINGS.find(
    (listing) =>
      listing.id !== excludeId &&
      listing.ownerId === CURRENT_OWNER_ID &&
      listing.category === category &&
      listing.location.address.trim().toLowerCase() === normalizedAddress &&
      listing.location.city.trim().toLowerCase() === normalizedCity,
  );
}
