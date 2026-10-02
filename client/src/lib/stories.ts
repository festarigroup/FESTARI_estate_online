import type { MyStory } from "@/types/story";

export const STORY_LIFETIME_MS = 24 * 60 * 60 * 1000;

export function makeStoryId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `story-${Date.now()}`;
}

export function isStoryActive(story: MyStory, now: number = Date.now()): boolean {
  return now - story.postedAt < STORY_LIFETIME_MS;
}
