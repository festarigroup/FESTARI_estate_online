import { apiGet, apiPost } from "@/lib/api/client";
import type { ApiProperty } from "@/lib/api/types";

export function getTrending(limit = 2) {
  return apiGet<ApiProperty[]>(`/properties/trending?limit=${limit}`, false);
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
