import Link from "next/link";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import type { NavItem } from "@/types/home";

interface NavLinkProps {
  item: NavItem;
  active: boolean;
}

/** One sidebar nav row: icon, label, optional unread-count badge, active tab styling. */
export function NavLink({ item, active }: NavLinkProps) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-[15px] border-l-4 px-4 py-3 transition-colors",
        active
          ? "border-brand-gold bg-brand-navy-light text-white"
          : "border-transparent text-[#6f85a8] hover:text-white",
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
