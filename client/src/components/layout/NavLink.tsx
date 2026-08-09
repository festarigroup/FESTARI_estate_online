import Link from "next/link";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import type { NavItem } from "@/types/home";

interface NavLinkProps {
  item: NavItem;
  active: boolean;
}

/** One sidebar nav row: icon, label, optional unread-count badge, active tab
 * styling. Active gets rounded-[20px] (keeping its gold left accent),
 * inactive gets a smaller rounded-[8px] (node 3379:5496/5504) — previously
 * both were `rounded-r-none` (square). The invisible `border-l-4
 * border-transparent` on inactive rows isn't in that Figma pull (plain
 * rows there have no left border at all), but it's kept here so the
 * icon/label doesn't visibly shift left by 4px when a row's active state
 * changes. */
export function NavLink({ item, active }: NavLinkProps) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex w-full items-center justify-between gap-3 py-3 pr-4 pl-5 text-white transition-colors",
        active
          ? "rounded-[20px] border-l-4 border-brand-gold bg-brand-navy-light"
          : "rounded-[8px] border-l-4 border-transparent opacity-60 hover:opacity-100",
      )}
    >
      <span className="flex items-center gap-3">
        <DynamicIcon name={item.icon} className="size-[18px]" />
        <span>{item.label}</span>
      </span>
      {typeof item.badgeCount === "number" && (
        <Badge variant="count">{item.badgeCount}</Badge>
      )}
    </Link>
  );
}
