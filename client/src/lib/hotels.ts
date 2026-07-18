const HERO_IMAGES = ["/hotel/hotel-desert-retreat.jpg", "/hotel/hotel-suite-room.jpg", "/hotel/hotel-dusk-pool.jpg"];
const GALLERY_IMAGES: [string, string] = ["/hotel/hotel-suite-room.jpg", "/hotel/hotel-desert-retreat.jpg"];

export const HOTEL_AMENITIES = [
  "Private Infinity Pool",
  "State-of-the-art Gym",
  "Home Cinema Room",
  "Climate-controlled Cellar",
];

export const HOTEL_HOST = {
  name: "Ama & Kwabena",
  role: "Superhost",
  yearsHosting: 6,
  bio: "We personally inspect every stay in our portfolio and are on call throughout your visit — usually reachable within the hour.",
};

export type Hotel = {
  id: number;
  name: string;
  tag: string;
  location: string;
  heroImage: string;
  galleryImages: [string, string];
  pricePerNight: number;
  rating: number;
  beds: string;
  guests: string;
  baths: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  parking: number;
  description: string[];
};

type HotelSeed = Omit<Hotel, "heroImage" | "galleryImages">;

const HOTEL_SEEDS: HotelSeed[] = [
  {
    id: 1,
    name: "Labadi Seaside Suites",
    tag: "Beachfront",
    location: "Labadi, Accra",
    pricePerNight: 1150,
    rating: 4,
    beds: "1 King Bed",
    guests: "2 Guests",
    baths: "1 Bath",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 1200,
    parking: 1,
    description: [
      "Set steps from the Labadi shoreline, this suite pairs whitewashed interiors with wraparound sea views, framed by louvred timber screens that soften the coastal light.",
      "A private balcony, a plunge pool deck, and a dedicated concierge make it equally suited to a quiet weekend or an extended stay.",
    ],
  },
  {
    id: 2,
    name: "East Legon Grand Hotel",
    tag: "City Grand",
    location: "East Legon, Accra",
    pricePerNight: 1450,
    rating: 5,
    beds: "2 Queen Beds",
    guests: "4 Guests",
    baths: "2 Baths",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1800,
    parking: 2,
    description: [
      "A grand two-bedroom residence in the heart of East Legon, built for guests who expect a hotel's service with the privacy of a private home.",
      "Marble finishes, a curated art collection, and a dedicated butler service anchor every stay.",
    ],
  },
  {
    id: 3,
    name: "Kumasi City Comfort Inn",
    tag: "City Comfort",
    location: "Adum, Kumasi",
    pricePerNight: 890,
    rating: 3,
    beds: "1 Queen Bed",
    guests: "2 Guests",
    baths: "1 Bath",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 950,
    parking: 1,
    description: [
      "A comfortable, well-appointed base in the middle of Kumasi's Adum district, ideal for guests balancing business and leisure.",
      "Warm timber accents and soft textiles give the room a relaxed, residential feel after a day in the city.",
    ],
  },
  {
    id: 4,
    name: "Takoradi Palm Residences",
    tag: "Coastal Retreat",
    location: "Takoradi, Western Region",
    pricePerNight: 1050,
    rating: 4,
    beds: "1 King Bed",
    guests: "2 Guests",
    baths: "1 Bath",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 1100,
    parking: 1,
    description: [
      "Palm-lined grounds and a slower coastal pace define this residence, just minutes from Takoradi's harbor.",
      "Every room opens onto a private terrace, with sea breezes carrying through the open-plan living space.",
    ],
  },
  {
    id: 5,
    name: "Cantonments Skyline Hotel",
    tag: "Skyline Exclusive",
    location: "Cantonments, Accra",
    pricePerNight: 1680,
    rating: 5,
    beds: "1 King Bed",
    guests: "2 Guests",
    baths: "1 Bath",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 1300,
    parking: 1,
    description: [
      "Perched above Cantonments with an uninterrupted skyline view, this suite is built for guests who want the city at a distance, not underfoot.",
      "Floor-to-ceiling glazing and a private balcony make the evening skyline part of the room itself.",
    ],
  },
  {
    id: 6,
    name: "Osu Boutique Stay",
    tag: "Boutique Stay",
    location: "Osu, Accra",
    pricePerNight: 980,
    rating: 4,
    beds: "1 Queen Bed",
    guests: "2 Guests",
    baths: "1 Bath",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 1000,
    parking: 1,
    description: [
      "A boutique stay tucked into Osu's most walkable stretch, close to the neighborhood's best cafés and galleries.",
      "The room favours a quiet, considered palette, letting the neighborhood's energy stay just outside the door.",
    ],
  },
  {
    id: 7,
    name: "Ridge Executive Suites",
    tag: "Executive Suite",
    location: "Ridge, Accra",
    pricePerNight: 1320,
    rating: 4,
    beds: "2 Queen Beds",
    guests: "4 Guests",
    baths: "2 Baths",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1750,
    parking: 2,
    description: [
      "Set in leafy Ridge, this executive suite gives traveling teams and families room to spread out without leaving the comfort of a single stay.",
      "A dedicated workspace and a private dining nook make it as functional for business as it is for rest.",
    ],
  },
  {
    id: 8,
    name: "Airport City Inn",
    tag: "Business Ready",
    location: "Airport City, Accra",
    pricePerNight: 1090,
    rating: 4,
    beds: "1 King Bed",
    guests: "2 Guests",
    baths: "1 Bath",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 1150,
    parking: 1,
    description: [
      "Minutes from Kotoka International, this inn is built for the traveler who needs speed without sacrificing comfort.",
      "A calm, uncluttered room and a fast checkout process make early flights and late arrivals painless.",
    ],
  },
  {
    id: 9,
    name: "Koforidua Hillview Lodge",
    tag: "Hillview Lodge",
    location: "Koforidua, Eastern Region",
    pricePerNight: 760,
    rating: 3,
    beds: "1 Queen Bed",
    guests: "2 Guests",
    baths: "1 Bath",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 900,
    parking: 1,
    description: [
      "A hillside lodge overlooking Koforidua, with cool evening air and long views across the Eastern Region.",
      "Simple, natural materials throughout keep the focus on the landscape outside the window.",
    ],
  },
  {
    id: 10,
    name: "Tamale Heritage Hotel",
    tag: "Heritage Stay",
    location: "Tamale, Northern Region",
    pricePerNight: 870,
    rating: 3,
    beds: "1 Queen Bed",
    guests: "2 Guests",
    baths: "1 Bath",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 950,
    parking: 1,
    description: [
      "A heritage-style stay in Tamale, blending Northern architectural motifs with modern comfort.",
      "Locally woven textiles and hand-finished woodwork give every room a distinct sense of place.",
    ],
  },
  {
    id: 11,
    name: "Cape Coast Ocean Breeze",
    tag: "Ocean Breeze",
    location: "Cape Coast, Central Region",
    pricePerNight: 1020,
    rating: 4,
    beds: "1 King Bed",
    guests: "2 Guests",
    baths: "1 Bath",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 1200,
    parking: 1,
    description: [
      "Positioned to catch the Atlantic breeze off Cape Coast, this room trades city noise for the sound of the shoreline.",
      "A private terrace and an outdoor shower extend the room into the coastal air.",
    ],
  },
  {
    id: 12,
    name: "Ho Garden Retreat",
    tag: "Garden Retreat",
    location: "Ho, Volta Region",
    pricePerNight: 700,
    rating: 3,
    beds: "1 Double Bed",
    guests: "2 Guests",
    baths: "1 Bath",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 850,
    parking: 1,
    description: [
      "A garden retreat on the edge of Ho, surrounded by planted grounds that keep the pace slow and the air clean.",
      "Mornings here start on a private porch overlooking the garden, with the Volta hills visible beyond the treeline.",
    ],
  },
];

export const HOTELS: Hotel[] = HOTEL_SEEDS.map((hotel, index) => ({
  ...hotel,
  heroImage: HERO_IMAGES[index % HERO_IMAGES.length],
  galleryImages: GALLERY_IMAGES,
}));

export function getHotelById(id: number): Hotel | undefined {
  return HOTELS.find((hotel) => hotel.id === id);
}

export function formatNightlyRate(value: number): string {
  return `GHS ${value.toLocaleString("en-US")}`;
}
