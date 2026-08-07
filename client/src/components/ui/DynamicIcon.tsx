import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bath,
  Bell,
  Bookmark,
  Building,
  Building2,
  Banknote,
  BedDouble,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Hammer,
  HardHat,
  Heart,
  History,
  Home,
  ImageIcon,
  Key,
  Mail,
  Menu,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Mountain,
  PencilRuler,
  Plus,
  Ruler,
  Search,
  Send,
  Settings2,
  Share2,
  Star,
  ThumbsUp,
  Users,
  Wrench,
  X,
  type LucideProps,
} from "lucide-react";

/**
 * Central registry mapping the icon keys used in data/content to their
 * Lucide component. Keeps data files free of JSX while still type-checking
 * icon names against a known set. Every glyph here was matched against the
 * Figma design as a generic line-icon substitute (see FIGMA_IMPLEMENTATION_GUIDE.md) —
 * photographic/illustrated assets are rendered from the real exported files instead.
 */
const ICONS = {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bath,
  Bell,
  Bookmark,
  Building,
  Building2,
  Banknote,
  BedDouble,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Hammer,
  HardHat,
  Heart,
  History,
  Home,
  ImageIcon,
  Key,
  Mail,
  Menu,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Mountain,
  PencilRuler,
  Plus,
  Ruler,
  Search,
  Send,
  Settings2,
  Share2,
  Star,
  ThumbsUp,
  Users,
  Wrench,
  X,
} as const;

export type IconName = keyof typeof ICONS;

export function DynamicIcon({ name, ...props }: { name: IconName } & LucideProps) {
  const Icon = ICONS[name];
  return <Icon {...props} />;
}
