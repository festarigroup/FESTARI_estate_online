import { apiGet } from "@/lib/api/client";
import type { ApiUser } from "@/lib/api/types";

export function getCurrentUser() {
  return apiGet<{ user: ApiUser }>("/users/me");
}
