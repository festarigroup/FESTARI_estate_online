export interface MarketplaceListing {
  id: string;
  image: string;
  /** Category pill over the image's top-left corner. */
  category: string;
  verificationLabel: string;
  price: string;
  priceUnit: string;
  subLine: string;
  detailLine: string;
}

// There's no real marketplace backend yet.
export const MARKETPLACE_LISTINGS: MarketplaceListing[] = [
  {
    id: "listing-1",
    image: "/images/marketplace-land.jpg",
    category: "Land",
    verificationLabel: "Title Documents checked",
    price: "GHS 1,850.00",
    priceUnit: "plot",
    subLine: "Serviced plot, 70×100 ft",
    detailLine: "Oyibi, Greater Accra",
  },
  {
    id: "listing-2",
    image: "/images/marketplace-rental.jpg",
    category: "Land",
    verificationLabel: "Documents verified",
    price: "GHS 4,200",
    priceUnit: "month",
    subLine: "3 - Bed apartment, gated",
    detailLine: "Airport Residential, Accra",
  },
  {
    id: "listing-3",
    image: "/images/marketplace-materials.jpg",
    category: "Materials",
    verificationLabel: "Business Verified",
    price: "GHS 115",
    priceUnit: "bag",
    subLine: "Cement 42.5R, 50kg",
    detailLine: "Kasoa Building Supplies",
  },
  {
    id: "listing-4",
    image: "/images/marketplace-equipment.jpg",
    category: "Equipment",
    verificationLabel: "Business Verified",
    price: "GHS 2,500",
    priceUnit: "day",
    subLine: "20 - tonne excavator, with operator",
    detailLine: "Tema · delivers within 40 km",
  },
];
