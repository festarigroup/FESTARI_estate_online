export interface MarketplaceListing {
  id: string;
  image: string;
  /** Category pill over the image's top-left corner. */
  category: string;
  /** "Sponsored" pill over the image's top-right corner, shown for promoted listings. */
  sponsored?: boolean;
  verificationLabel: string;
  price: string;
  priceUnit: string;
  subLine: string;
  detailLine: string;
}

// Reuses this app's existing photography (see dummy-listings.ts) — there's no
// real marketplace backend yet.
export const MARKETPLACE_LISTINGS: MarketplaceListing[] = [
  {
    id: "listing-1",
    image: "/images/trending-property-3.jpg",
    category: "Land",
    verificationLabel: "Title Documents checked",
    price: "GHS 1,850.00",
    priceUnit: "plot",
    subLine: "Serviced plot, 70x100 ft",
    detailLine: "Dzibi, Greater Accra",
  },
  {
    id: "listing-2",
    image: "/images/post-property-kitchen.jpg",
    category: "Rental",
    sponsored: true,
    verificationLabel: "Documents verified",
    price: "GHS 4,200.00",
    priceUnit: "month",
    subLine: "3-bed apartment, gated",
    detailLine: "Airport Residential, Accra",
  },
  {
    id: "listing-3",
    image: "/images/post-building-01.jpg",
    category: "Materials",
    verificationLabel: "Business Verified",
    price: "GHS 115.00",
    priceUnit: "bag",
    subLine: "Cement 42.5R, 50 kg",
    detailLine: "Kasoa Building Supplies",
  },
  {
    id: "listing-4",
    image: "/images/post-property-exterior.jpg",
    category: "Equipment",
    verificationLabel: "Business Verified",
    price: "GHS 2,500.00",
    priceUnit: "day",
    subLine: "20-tonne excavator with operator",
    detailLine: "Tema Heavy Equipment Ltd",
  },
];
