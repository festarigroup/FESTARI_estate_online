import { apiGet, apiPost } from "@/lib/api/client";
import type { ApiProperty, ApiPropertyImage } from "@/lib/api/types";

export function getTrending(limit = 2) {
  return apiGet<ApiProperty[]>(`/properties/trending?limit=${limit}`, false);
}

/** GET /properties/:id — public (no `protect` middleware server-side), and
 * the one endpoint that actually joins in the property's images; every
 * other properties endpoint here returns the bare row. */
export function getProperty(id: string) {
  return apiGet<ApiProperty & { images: ApiPropertyImage[] }>(`/properties/${id}`, false);
}

export interface CreatePropertyPayload {
  title: string;
  description?: string;
  price: number;
  location: string;
  listing_type: "for_sale" | "for_rent" | "short_stay";
  property_type: "land" | "home" | "apartment" | "office";
  bedrooms?: number;
  bathrooms?: number;
  area_sqm?: number;
}

export function createProperty(payload: CreatePropertyPayload) {
  return apiPost<ApiProperty>("/properties", payload);
}
