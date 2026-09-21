export interface NavItem {
  key: string;
  label: string;
  icon: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { key: "feed", label: "Feed", icon: "/icons/grid-view.svg", href: "/home" },
  { key: "people", label: "People", icon: "/icons/user-star-01.svg", href: "#" },
  { key: "services", label: "Services", icon: "/icons/timer-clock-watch.svg", href: "#" },
  { key: "community", label: "Community", icon: "/icons/user-group.svg", href: "#" },
  { key: "stay", label: "Stay and Events", icon: "/icons/guest-house.svg", href: "#" },
  { key: "you", label: "You", icon: "/icons/archive-add.svg", href: "#" },
];
