export type Property = {
  id: number;
  name: string;
  tag: string;
  location: string;
  neighborhood: string;
  heroImage: string;
  galleryImages: [string, string];
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  parking: number;
  description: string[];
};

export const AMENITIES = [
  "Private Infinity Pool",
  "State-of-the-art Gym",
  "Home Cinema Room",
  "Climate-controlled Cellar",
];

export const REVIEWS = [
  {
    name: "Elena Van Der Bilt",
    date: "March 2024",
    quote:
      "The attention to detail in this property is unmatched. FEO Estates provided a seamless viewing experience that truly showcased the architectural nuances of the home.",
  },
  {
    name: "Julian St. Claire",
    date: "January 2024",
    quote:
      "Absolute privacy and breathtaking views. This estate isn't just a home, it's a legacy piece. The integration of local artisans is evident in every room.",
  },
];

export const HOST = {
  name: "Marcus Vane",
  role: "Verified FEO Expert",
};

export const PROPERTIES: Property[] = [
  {
    id: 1,
    name: "Azure Cliffside Villa",
    tag: "Riviera Exclusive",
    location: "Cassis, French Riviera, France",
    neighborhood: "Calanques National Park, Cassis",
    heroImage: "/property/azure-cliffside-villa.jpg",
    galleryImages: ["/property/gallery-bedroom.jpg", "/property/gallery-bathroom.jpg"],
    price: 42_000_000,
    beds: 5,
    baths: 2,
    sqft: 3_068,
    parking: 3,
    description: [
      "Set into the limestone cliffs above the Calanques, Azure Cliffside Villa frames the Mediterranean through walls of glass that dissolve the boundary between terrace and sea. Every room turns toward the water.",
      "The estate pairs whitewashed stone with dark timber screens for shade, and a cantilevered pool deck extends the living space out over the coastline for uninterrupted sunset views.",
    ],
  },
  {
    id: 4,
    name: "Skyloft Penthouse",
    tag: "Airport Residential",
    location: "Airport City, Accra, Ghana",
    neighborhood: "Airport Residential Area, Accra",
    heroImage: "/property/skyloft-penthouse.jpg",
    galleryImages: ["/property/gallery-bedroom.jpg", "/property/gallery-bathroom.jpg"],
    price: 51_000_000,
    beds: 4,
    baths: 3,
    sqft: 2_368,
    parking: 2,
    description: [
      "Skyloft Penthouse occupies the upper floors of one of Airport City's most recognizable towers, with wraparound balconies that catch the evening light across the Accra skyline.",
      "Floor-to-ceiling glazing, a private elevator lobby, and a curated interior palette make this residence as suited to entertaining as it is to quiet mornings above the city.",
    ],
  },
  {
    id: 6,
    name: "Alpine Lake Retreat",
    tag: "Lakefront Reserve",
    location: "Lake Bosumtwi, Ashanti Region, Ghana",
    neighborhood: "Lake Bosumtwi Basin, Kumasi",
    heroImage: "/property/alpine-lake-retreat.jpg",
    galleryImages: ["/property/gallery-bedroom.jpg", "/property/gallery-bathroom.jpg"],
    price: 39_000_000,
    beds: 5,
    baths: 4,
    sqft: 3_337,
    parking: 4,
    description: [
      "Perched on a rocky outcrop above Lake Bosumtwi, this retreat was designed to disappear into its forested surroundings while opening fully toward the water on its lake-facing side.",
      "A stone-clad tower anchors the main house, with guest quarters and a boathouse connected by a series of terraces that follow the natural slope of the land.",
    ],
  },
  {
    id: 2,
    name: "The Sandstone Valleys",
    tag: "Featured Exclusive",
    location: "Campoamor, Costa Blanca, Spain",
    neighborhood: "Campoamor Golf & Beach, Costa Blanca",
    heroImage: "/landing/sandstone-valleys.jpg",
    galleryImages: ["/property/gallery-bedroom.jpg", "/property/gallery-bathroom.jpg"],
    price: 65_000_000,
    beds: 8,
    baths: 12,
    sqft: 12_400,
    parking: 6,
    description: [
      "A masterfully carved sanctuary where ancient geological beauty meets 21st-century architectural precision. The Sandstone Valleys is FEO's flagship listing on the Costa Blanca.",
      "Eight suites, a resident spa wing, and a motor court built for a serious collection make this the rare estate that scales from intimate family living to full-scale entertaining without compromise.",
    ],
  },
  {
    id: 5,
    name: "Chelsea Heights Penthouse",
    tag: "London Skyline",
    location: "Chelsea, London, UK",
    neighborhood: "King's Road, Chelsea",
    heroImage: "/landing/chelsea-heights.jpg",
    galleryImages: ["/property/gallery-bedroom.jpg", "/property/gallery-bathroom.jpg"],
    price: 48_000_000,
    beds: 3,
    baths: 2,
    sqft: 2_100,
    parking: 1,
    description: [
      "Chelsea Heights Penthouse sits above King's Road with a wraparound terrace and an uninterrupted line of sight across the rooftops toward the City skyline.",
      "The interior favours warm stone and brushed brass against a neutral palette, letting the view — rather than the finish — carry each room.",
    ],
  },
  {
    id: 7,
    name: "Uluwatu Cliffside Villa",
    tag: "Featured Exclusive",
    location: "Uluwatu, Bali, Indonesia",
    neighborhood: "Uluwatu Clifftop, Bali",
    heroImage: "/landing/uluwatu-villa.jpg",
    galleryImages: ["/property/gallery-bedroom.jpg", "/property/gallery-bathroom.jpg"],
    price: 33_000_000,
    beds: 4,
    baths: 5,
    sqft: 4_500,
    parking: 4,
    description: [
      "Perched on the majestic cliffs of Uluwatu, this estate is an architectural masterpiece that blurs the lines between indoor luxury and Bali's raw natural beauty, with a 270-degree view of the Indian Ocean.",
      "An infinity pool appears to merge with the horizon, while volcanic stone accents and hand-carved teak ceilings anchor the open-plan interiors in local craft.",
    ],
  },
];

export function getPropertyById(id: number): Property | undefined {
  return PROPERTIES.find((property) => property.id === id);
}

export function formatGHS(value: number): string {
  return `GHS ${value.toLocaleString("en-US")}`;
}

/** 30-year amortizing loan at a fixed 4.5% rate with 20% down. */
export function estimateMonthlyPayment(price: number): number {
  const loanAmount = price * 0.8;
  const monthlyRate = 0.045 / 12;
  const numPayments = 30 * 12;
  const factor = Math.pow(1 + monthlyRate, numPayments);
  return (loanAmount * monthlyRate * factor) / (factor - 1);
}
