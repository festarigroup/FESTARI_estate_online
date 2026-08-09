import { apiDelete, apiGet, apiPost, apiUpload } from "@/lib/api/client";
import type { ApiComment, ApiPost, ApiPostImage, ApiStory, Paginated } from "@/lib/api/types";

export function listPosts(params: { kind?: string; page?: number; limit?: number } = {}) {
  const query = new URLSearchParams();
  if (params.kind) query.set("kind", params.kind);
  if (params.page) query.set("current_page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  const qs = query.toString();
  return apiGet<Paginated<ApiPost>>(`/feed/posts${qs ? `?${qs}` : ""}`, false);
}

export function getPost(id: string) {
  return apiGet<ApiPost & { images: ApiPostImage[] }>(`/feed/posts/${id}`, false);
}

export interface CreatePostPayload {
  kind: "property" | "service" | "general";
  body: string;
  hashtags?: string;
  linked_property_id?: string;
  linked_artisan_id?: string;
}

export function createPost(payload: CreatePostPayload) {
  return apiPost<ApiPost>("/feed/posts", payload);
}

export function uploadPostImage(postId: string, file: File, position: number) {
  const form = new FormData();
  form.append("image", file);
  form.append("position", String(position));
  return apiUpload<ApiPostImage>(`/feed/posts/${postId}/images`, form);
}

export function likePost(postId: string) {
  return apiPost<null>(`/feed/posts/${postId}/like`);
}

export function unlikePost(postId: string) {
  return apiDelete<null>(`/feed/posts/${postId}/like`);
}

export function listComments(postId: string, page = 1, limit = 50) {
  return apiGet<{ items: ApiComment[]; total: number }>(
    `/feed/posts/${postId}/comments?current_page=${page}&limit=${limit}`,
    false,
  );
}

export function addComment(postId: string, body: string) {
  return apiPost<ApiComment>(`/feed/posts/${postId}/comments`, { body });
}

export function deleteComment(commentId: string) {
  return apiDelete<null>(`/feed/comments/${commentId}`);
}

export function sharePost(postId: string) {
  return apiPost<null>(`/feed/posts/${postId}/share`);
}

export function savePost(postId: string) {
  return apiPost<null>(`/feed/posts/${postId}/save`);
}

export function unsavePost(postId: string) {
  return apiDelete<null>(`/feed/posts/${postId}/save`);
}

export function listSavedPosts() {
  return apiGet<ApiPost[]>("/feed/saved");
}

export function listStories() {
  return apiGet<ApiStory[]>("/feed/stories", false);
}

export function createStory(file: File, caption?: string) {
  const form = new FormData();
  form.append("media", file);
  if (caption) form.append("caption", caption);
  return apiUpload<ApiStory>("/feed/stories", form);
}

export function viewStory(storyId: string) {
  return apiPost<null>(`/feed/stories/${storyId}/view`);
}

export function deleteStory(storyId: string) {
  return apiDelete<null>(`/feed/stories/${storyId}`);
}
