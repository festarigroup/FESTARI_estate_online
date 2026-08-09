import { apiGet, apiPost } from "@/lib/api/client";
import type { ApiArtisan } from "@/lib/api/types";

export function getTop(limit = 4) {
  return apiGet<ApiArtisan[]>(`/artisans/top?limit=${limit}`, false);
}

export function hireArtisan(artisanId: string, message: string) {
  return apiPost<null>(`/artisans/${artisanId}/hire`, { message });
}
