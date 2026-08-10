import { apiPost } from "@/lib/api/client";
import type { ApiHotel, ApiHotelBooking } from "@/lib/api/types";

export interface CreateBookingPayload {
  check_in: string;
  check_out: string;
  guests?: number;
}

export function createBooking(hotelId: string, payload: CreateBookingPayload) {
  return apiPost<ApiHotelBooking>(`/hotels/${hotelId}/bookings`, payload);
}

export interface CreateHotelPayload {
  name: string;
  description?: string;
  location: string;
  amenities?: Record<string, boolean>;
  price_per_night: number;
  category: "hotel" | "resort" | "apartment" | "event_venue" | "short_stay";
  rooms?: number;
}

export function createHotel(payload: CreateHotelPayload) {
  return apiPost<ApiHotel>("/hotels", payload);
}
