export interface PropertyListing {
  id: string;
  /** Shown in the "Choose from My Listings" dropdown. */
  title: string;
  priceLine: string;
  priceSuffix?: string;
  /** Short listing type, e.g. "4 Bedroom Detached House". */
  subLine: string;
  location: string;
  beds: number;
  baths: number;
  /** Full photo set for the resulting post; first image doubles as the listing's cover. */
  images: string[];
}

// Reuses this app's existing high-resolution property photography (the
// post-property-*.jpg set) rather than sourcing new stock photos, since
// there's no real listings backend yet — the goal here is a believable
// "My Listings" picker, not real inventory.
const GALLERY = [
  "/images/post-property-exterior.jpg",
  "/images/post-property-living-room.jpg",
  "/images/post-property-kitchen.jpg",
  "/images/post-property-bedroom.jpg",
];

export const DUMMY_LISTINGS: PropertyListing[] = [
  {
    id: "listing-1",
    title: "4-Bedroom Detached House - East Legon",
    priceLine: "GHS 1,850.00",
    subLine: "4 Bedroom Detached House",
    location: "East Legon",
    beds: 4,
    baths: 2,
    images: GALLERY,
  },
  {
    id: "listing-2",
    title: "3-Bedroom Townhouse - Cantonments",
    priceLine: "GHS 1,250.00",
    subLine: "3 Bedroom Townhouse",
    location: "Cantonments",
    beds: 3,
    baths: 3,
    images: [GALLERY[1], GALLERY[0], GALLERY[3], GALLERY[2]],
  },
  {
    id: "listing-3",
    title: "2-Bedroom Apartment - Airport Residential",
    priceLine: "GHS 890.00",
    subLine: "2 Bedroom Apartment",
    location: "Airport Residential",
    beds: 2,
    baths: 2,
    images: [GALLERY[2], GALLERY[1], GALLERY[0], GALLERY[3]],
  },
  {
    id: "listing-4",
    title: "5-Bedroom Executive Villa - Trasacco Valley",
    priceLine: "GHS 3,200.00",
    subLine: "5 Bedroom Executive Villa",
    location: "Trasacco Valley",
    beds: 5,
    baths: 4,
    images: [GALLERY[3], GALLERY[0], GALLERY[1], GALLERY[2]],
  },
];
