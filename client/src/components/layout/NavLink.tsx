import Link from "next/link";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import type { NavItem } from "@/types/home";

interface NavLinkProps {
  item: NavItem;
  active: boolean;
  /** Icon-only rendering for the collapsed desktop sidebar (Figma has no
   * collapsed-state frame to match against, so the label-hiding + centered
   * icon + title-attribute-as-tooltip treatment here is this app's own
   * inferred behavior, not a pulled design). Always false on the mobile
   * drawer, which has no collapse control. */
  collapsed?: boolean;
}

/** One sidebar nav row: icon, label, optional unread-count badge, active
 * tab styling (Figma node 3393:17267, "Link - Active Tab"). The mobile
 * drawer and the desktop sidebar share the same white background now, so
 * this no longer needs one color set tuned to read on navy and another
 * tuned for white (Figma only ever specified the white one). */
export function NavLink({ item, active, collapsed }: NavLinkProps) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      title={collapsed ? item.label : undefined}
      className={cn(
        "relative flex w-full items-center gap-4 rounded-[11px] border-l-4 px-4 py-3 transition-colors",
        collapsed ? "justify-center" : "justify-between",
        active
          ? "border-brand-gold bg-brand-navy text-white"
          : "border-transparent text-muted hover:bg-surface-muted hover:text-ink",
      )}
    >
      <span className={cn("flex items-center gap-3", collapsed && "gap-0")}>
        <DynamicIcon name={item.icon} className="size-[18px] shrink-0" />
        {!collapsed && <span>{item.label}</span>}
      </span>
      {typeof item.badgeCount === "number" && !collapsed && (
        <Badge variant="count">{item.badgeCount}</Badge>
      )}
      {typeof item.badgeCount === "number" && collapsed && (
        <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-brand-rust" />
      )}
    </Link>
  );
}
