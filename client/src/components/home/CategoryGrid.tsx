import Link from "next/link";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { SidebarWidgetHeader } from "@/components/home/SidebarWidgetHeader";
import { CATEGORIES } from "@/lib/mock-data";

/** "Explore by Category" widget: a 4-column grid of category shortcuts. */
export function CategoryGrid() {
  return (
    <div className="flex w-full shrink-0 flex-col gap-6 rounded-[39px] border border-border bg-white p-6">
      <SidebarWidgetHeader title="Explore by Category" seeAllHref="/properties" />
      <div className="grid w-full grid-cols-4 gap-4">
        {CATEGORIES.map((category) => (
          <Link
            key={category.id}
            href={`/properties?category=${category.id}`}
            className="flex flex-col items-center gap-2"
          >
            <span className="flex size-12 items-center justify-center rounded-xl bg-surface-muted">
              <DynamicIcon name={category.icon} className="size-[18px] text-brand-navy" />
            </span>
            <span className="text-[10px] font-medium text-ink">{category.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
