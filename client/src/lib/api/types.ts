export interface ApiUser {
  id: string;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  phone: string | null;
  profile_picture: string | null;
  is_active: boolean;
  verified: boolean;
  roles: string[];
  created_at: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  sessionId?: string;
}

export interface ApiPostAuthor {
  id: string;
  firstname: string | null;
  lastname: string | null;
  profile_picture: string | null;
}

export interface ApiLinkedProperty {
  id: string;
  title: string;
  price: string;
  location: string;
  listing_type: "for_sale" | "for_rent" | "short_stay";
  property_type: "land" | "home" | "apartment" | "office";
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqm: number | null;
}

export interface ApiLinkedArtisan {
  id: string;
  service_type: string;
}

export interface ApiLinkedHotel {
  id: string;
  name: string;
  location: string;
  price_per_night: string;
  category: "hotel" | "resort" | "apartment" | "event_venue" | "short_stay";
  rooms: number | null;
  amenities: Record<string, boolean> | null;
  average_rating: number | null;
  review_count: number;
}

export interface ApiPostImage {
  id: string;
  post_id: string;
  image_url: string;
  position: number;
}

export interface ApiPost {
  id: string;
  author_id: string;
  kind: "property" | "service" | "general" | "venue";
  body: string;
  hashtags: string | null;
  linked_property_id: string | null;
  linked_artisan_id: string | null;
  linked_hotel_id: string | null;
  created_at: string;
  updated_at: string;
  author: ApiPostAuthor;
  linked_property: ApiLinkedProperty | null;
  linked_artisan: ApiLinkedArtisan | null;
  linked_hotel: ApiLinkedHotel | null;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_liked: boolean;
  is_saved: boolean;
  images: ApiPostImage[];
}

export interface ApiComment {
  id: string;
  post_id: string;
  body: string;
  created_at: string;
  author: ApiPostAuthor;
}

export interface ApiStory {
  id: string;
  author_id: string;
  media_url: string;
  caption: string | null;
  created_at: string;
  expires_at: string;
  author: { id: string; firstname: string | null; lastname: string | null; profile_picture: string | null };
}

export interface ApiFollowSuggestion {
  id: string;
  firstname: string | null;
  lastname: string | null;
  profile_picture: string | null;
}

export interface ApiProperty {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  price: string;
  location: string;
  listing_type: "for_sale" | "for_rent" | "short_stay";
  property_type: "land" | "home" | "apartment" | "office";
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqm: number | null;
  is_featured: boolean;
  status: "pending" | "approved" | "rejected";
  views_count: number;
  created_at: string;
}

export interface ApiArtisan {
  id: string;
  service_type: string;
  bio: string | null;
  location: string | null;
  status: "pending" | "approved" | "rejected";
  average_rating: number | null;
  review_count: number;
}

export interface ApiHotelImage {
  id: string;
  hotel_id: string;
  image_url: string;
  position: number;
}

export interface ApiHotel {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  location: string;
  amenities: Record<string, boolean> | null;
  price_per_night: string;
  category: "hotel" | "resort" | "apartment" | "event_venue" | "short_stay";
  rooms: number | null;
  average_rating: number | null;
  review_count: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  images?: ApiHotelImage[];
}

export interface ApiHotelBooking {
  id: string;
  hotel_id: string;
  user_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  total_price: string;
  created_at: string;
  updated_at: string;
}

export interface Paginated<T> {
  items: T[];
  metadata: { total: number; pages: number; current_page: number; limit: number };
}
