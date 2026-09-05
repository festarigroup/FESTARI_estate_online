import { publishListing, pauseListing, setListingStatus } from "@/lib/mocks/listings";
import type { Listing } from "@/types/listing";

export interface ListingAction {
  label: string;
  run: (listing: Listing) => Promise<Listing>;
  /** Destructive/terminal actions render with a lighter, less prominent
   * style than the primary lifecycle action for that status. */
  variant?: "primary" | "secondary";
}

/**
 * Which status actions apply to a listing right now — one place both the
 * grid and table views of My Listings read from, so an action available on
 * a card is never missing from the equivalent table row or vice versa.
 * Real transition legality is the backend's job (per spec); this only
 * decides which buttons make sense to *offer* given the status shown.
 */
export function listingActions(listing: Listing): ListingAction[] {
  switch (listing.status) {
    case "draft":
      return [];
    case "pending_verification":
    case "pending_review":
      // Standing in for what a real review process would otherwise
      // trigger — Authority & Verification has no real backend check to
      // gate on yet, so the owner can move their own listing forward.
      return [{ label: "Publish", run: (l) => publishListing(l.id), variant: "primary" }];
    case "published":
      return [
        { label: "Pause", run: (l) => pauseListing(l.id), variant: "secondary" },
        { label: "Mark Under Offer", run: (l) => setListingStatus(l.id, "under_offer"), variant: "secondary" },
        {
          label: listing.purpose === "sale" ? "Mark as Sold" : "Mark as Rented",
          run: (l) => setListingStatus(l.id, listing.purpose === "sale" ? "sold" : "rented"),
          variant: "primary",
        },
      ];
    case "paused":
      return [{ label: "Resume (Publish)", run: (l) => publishListing(l.id), variant: "primary" }];
    case "under_offer":
      return [
        { label: "Revert to Published", run: (l) => setListingStatus(l.id, "published"), variant: "secondary" },
        {
          label: listing.purpose === "sale" ? "Mark as Sold" : "Mark as Rented",
          run: (l) => setListingStatus(l.id, listing.purpose === "sale" ? "sold" : "rented"),
          variant: "primary",
        },
      ];
    case "sold":
    case "rented":
    case "expired":
    case "rejected":
      return [{ label: "Archive", run: (l) => setListingStatus(l.id, "archived"), variant: "secondary" }];
    case "archived":
      return [];
  }
}
