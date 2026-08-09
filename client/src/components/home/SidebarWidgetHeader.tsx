import Link from "next/link";

interface SidebarWidgetHeaderProps {
  title: string;
  seeAllHref: string;
}

/** Shared "Heading + See all" row used by every right-sidebar widget card. */
export function SidebarWidgetHeader({ title, seeAllHref }: SidebarWidgetHeaderProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <h3 className="font-heading text-sm text-ink">{title}</h3>
      <Link href={seeAllHref} className="text-xs font-semibold text-brand-navy hover:underline">
        See all
      </Link>
    </div>
  );
}
