import { apiGet, apiPost } from "@/lib/api/client";
import type { ApiUser } from "@/lib/api/types";

export function getCurrentUser() {
  return apiGet<{ user: ApiUser }>("/users/me");
}

export function setUserRole(role: string) {
  return apiPost<{ user: ApiUser }>("/users/me/role", { role });
}
