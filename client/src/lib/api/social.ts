import { apiDelete, apiGet, apiPost } from "@/lib/api/client";
import type { ApiFollowSuggestion } from "@/lib/api/types";

export function getSuggestions(limit = 5) {
  return apiGet<ApiFollowSuggestion[]>(`/social/suggestions?limit=${limit}`);
}

export function followUser(userId: string) {
  return apiPost<null>(`/social/follow/${userId}`);
}

export function unfollowUser(userId: string) {
  return apiDelete<null>(`/social/follow/${userId}`);
}

export function getFollowing() {
  return apiGet<ApiFollowSuggestion[]>("/social/following");
}
