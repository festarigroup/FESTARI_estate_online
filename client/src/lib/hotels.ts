const HERO_IMAGES = ["/hotel/hotel-desert-retreat.jpg", "/hotel/hotel-suite-room.jpg", "/hotel/hotel-dusk-pool.jpg"];

export type Hotel = {
  id: number;
  name: string;
  tag: string;
  location: string;
  heroImage: string;
  pricePerNight: number;
  rating: number;
  beds: string;
  guests: string;
  baths: string;
};

export const HOTELS: Hotel[] = [
  { id: 1, name: "Labadi Seaside Suites", tag: "Beachfront", location: "Labadi, Accra", pricePerNight: 1150, rating: 4, beds: "1 King Bed", guests: "2 Guests", baths: "1 Bath" },
  { id: 2, name: "East Legon Grand Hotel", tag: "City Grand", location: "East Legon, Accra", pricePerNight: 1450, rating: 5, beds: "2 Queen Beds", guests: "4 Guests", baths: "2 Baths" },
  { id: 3, name: "Kumasi City Comfort Inn", tag: "City Comfort", location: "Adum, Kumasi", pricePerNight: 890, rating: 3, beds: "1 Queen Bed", guests: "2 Guests", baths: "1 Bath" },
  { id: 4, name: "Takoradi Palm Residences", tag: "Coastal Retreat", location: "Takoradi, Western Region", pricePerNight: 1050, rating: 4, beds: "1 King Bed", guests: "2 Guests", baths: "1 Bath" },
  { id: 5, name: "Cantonments Skyline Hotel", tag: "Skyline Exclusive", location: "Cantonments, Accra", pricePerNight: 1680, rating: 5, beds: "1 King Bed", guests: "2 Guests", baths: "1 Bath" },
  { id: 6, name: "Osu Boutique Stay", tag: "Boutique Stay", location: "Osu, Accra", pricePerNight: 980, rating: 4, beds: "1 Queen Bed", guests: "2 Guests", baths: "1 Bath" },
  { id: 7, name: "Ridge Executive Suites", tag: "Executive Suite", location: "Ridge, Accra", pricePerNight: 1320, rating: 4, beds: "2 Queen Beds", guests: "4 Guests", baths: "2 Baths" },
  { id: 8, name: "Airport City Inn", tag: "Business Ready", location: "Airport City, Accra", pricePerNight: 1090, rating: 4, beds: "1 King Bed", guests: "2 Guests", baths: "1 Bath" },
  { id: 9, name: "Koforidua Hillview Lodge", tag: "Hillview Lodge", location: "Koforidua, Eastern Region", pricePerNight: 760, rating: 3, beds: "1 Queen Bed", guests: "2 Guests", baths: "1 Bath" },
  { id: 10, name: "Tamale Heritage Hotel", tag: "Heritage Stay", location: "Tamale, Northern Region", pricePerNight: 870, rating: 3, beds: "1 Queen Bed", guests: "2 Guests", baths: "1 Bath" },
  { id: 11, name: "Cape Coast Ocean Breeze", tag: "Ocean Breeze", location: "Cape Coast, Central Region", pricePerNight: 1020, rating: 4, beds: "1 King Bed", guests: "2 Guests", baths: "1 Bath" },
  { id: 12, name: "Ho Garden Retreat", tag: "Garden Retreat", location: "Ho, Volta Region", pricePerNight: 700, rating: 3, beds: "1 Double Bed", guests: "2 Guests", baths: "1 Bath" },
].map((hotel, index) => ({ ...hotel, heroImage: HERO_IMAGES[index % HERO_IMAGES.length] }));

export function getHotelById(id: number): Hotel | undefined {
  return HOTELS.find((hotel) => hotel.id === id);
}

export function formatNightlyRate(value: number): string {
  return `GHS ${value.toLocaleString("en-US")}`;
}
