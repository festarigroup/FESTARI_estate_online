import { comingSoonHref } from "@/lib/coming-soon";

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

function childComingSoon(label: string, navKey: string, navChildKey: string) {
  return comingSoonHref(label, { navKey, navChildKey });
}

export const NAV_ITEMS: NavItem[] = [
  {
    key: "feed",
    label: "Feed",
    icon: "/icons/grid-view.svg",
    href: "#",
    children: [
      { key: "home", label: "Home", icon: "/icons/home-03.svg", href: "/home" },
      { key: "discover", label: "Discover", icon: "/icons/compass-01.svg", href: childComingSoon("Discover", "feed", "discover") },
    ],
  },
  {
    key: "people",
    label: "People",
    icon: "/icons/user-star-01.svg",
    href: "#",
    children: [
      { key: "professionals", label: "Professionals", icon: "/icons/briefcase-09.svg", href: childComingSoon("Professionals", "people", "professionals") },
      { key: "artisans", label: "Artisans", icon: "/icons/hammer-01.svg", href: childComingSoon("Artisans", "people", "artisans") },
    ],
  },
  {
    key: "services",
    label: "Services",
    icon: "/icons/timer-clock-watch.svg",
    href: "#",
    children: [
      { key: "services", label: "Services", icon: "/icons/settings-02.svg", href: childComingSoon("Services", "services", "services") },
      { key: "request-board", label: "Request Board", icon: "/icons/clipboard-list-01.svg", href: childComingSoon("Request Board", "services", "request-board") },
    ],
  },
  {
    key: "community",
    label: "Community",
    icon: "/icons/user-group.svg",
    href: "#",
    children: [
      { key: "communities", label: "Communities", icon: "/icons/message-03.svg", href: childComingSoon("Communities", "community", "communities") },
      { key: "concierge", label: "Concierge", icon: "/icons/concierge-bell-01.svg", href: childComingSoon("Concierge", "community", "concierge") },
    ],
  },
  {
    key: "stay",
    label: "Stay and Events",
    icon: "/icons/guest-house.svg",
    href: "#",
    children: [
      { key: "stay", label: "Stay", icon: "/icons/guest-house-sm.svg", href: childComingSoon("Stay", "stay", "stay") },
      { key: "events", label: "Events", icon: "/icons/calendar-01.svg", href: childComingSoon("Events", "stay", "events") },
    ],
  },
  {
    key: "you",
    label: "You",
    icon: "/icons/archive-add.svg",
    href: "#",
    children: [
      { key: "saved", label: "Saved", icon: "/icons/archive-save.svg", href: childComingSoon("Saved", "you", "saved") },
      { key: "workspace", label: "My Workspace", icon: "/icons/folder-01.svg", href: childComingSoon("My Workspace", "you", "workspace") },
    ],
  },
];
