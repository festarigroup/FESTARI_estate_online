export const DISCOVER_TABS = ["For You", "Following", "Popular", "Featured", "Watch Later"] as const;
export type DiscoverTab = (typeof DISCOVER_TABS)[number];
