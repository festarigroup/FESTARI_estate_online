export interface NavChildItem {
  key: string;
  label: string;
  icon: string;
  href: string;
}

export interface NavItem {
  key: string;
  label: string;
  icon: string;
  href: string;
  children?: NavChildItem[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    key: "feed",
    label: "Feed",
    icon: "/icons/grid-view.svg",
    href: "/home",
    children: [
      { key: "home", label: "Home", icon: "/icons/home-03.svg", href: "/home" },
      { key: "discover", label: "Discover", icon: "/icons/compass-01.svg", href: "#" },
    ],
  },
  {
    key: "people",
    label: "People",
    icon: "/icons/user-star-01.svg",
    href: "#",
    children: [
      { key: "professionals", label: "Professionals", icon: "/icons/briefcase-09.svg", href: "#" },
      { key: "artisans", label: "Artisans", icon: "/icons/hammer-01.svg", href: "#" },
    ],
  },
  {
    key: "services",
    label: "Services",
    icon: "/icons/timer-clock-watch.svg",
    href: "#",
    children: [
      { key: "services", label: "Services", icon: "/icons/settings-02.svg", href: "#" },
      { key: "request-board", label: "Request Board", icon: "/icons/clipboard-list-01.svg", href: "#" },
    ],
  },
  {
    key: "community",
    label: "Community",
    icon: "/icons/user-group.svg",
    href: "#",
    children: [
      { key: "communities", label: "Communities", icon: "/icons/message-03.svg", href: "#" },
      { key: "concierge", label: "Concierge", icon: "/icons/concierge-bell-01.svg", href: "#" },
    ],
  },
  {
    key: "stay",
    label: "Stay and Events",
    icon: "/icons/guest-house.svg",
    href: "#",
    children: [
      { key: "stay", label: "Stay", icon: "/icons/guest-house-sm.svg", href: "#" },
      { key: "events", label: "Events", icon: "/icons/calendar-01.svg", href: "#" },
    ],
  },
  {
    key: "you",
    label: "You",
    icon: "/icons/archive-add.svg",
    href: "#",
    children: [
      { key: "saved", label: "Saved", icon: "/icons/archive-save.svg", href: "#" },
      { key: "workspace", label: "My Workspace", icon: "/icons/folder-01.svg", href: "#" },
    ],
  },
];
