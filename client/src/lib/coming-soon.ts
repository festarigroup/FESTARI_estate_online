interface ComingSoonNav {
  /** Sidebar/bottom-nav parent key to highlight as active on the Coming Soon screen. */
  navKey?: string;
  /** Sidebar/bottom-nav child key to highlight as active, if the feature has one. */
  navChildKey?: string;
}

export function comingSoonHref(feature: string, nav?: ComingSoonNav) {
  const params = new URLSearchParams({ feature });
  if (nav?.navKey) params.set("nav", nav.navKey);
  if (nav?.navChildKey) params.set("child", nav.navChildKey);
  return `/coming-soon?${params.toString()}`;
}
