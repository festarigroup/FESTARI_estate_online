"use client";

import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { STAY_CATEGORIES } from "@/lib/mock-data";
import { cn } from "@/lib/cn";
import type { StayCategory } from "@/types/home";

interface StayCategoryNavProps {
  active: StayCategory;
  onSelect: (category: StayCategory) => void;
}

/** "Navigation/Categories" tab row (Figma node 3387:8856) — filters the Stay
 * feed down to one category at a time, same "underline the active tab"
 * treatment Figma specifies rather than a pill/button style. */
export function StayCategoryNav({ active, onSelect }: StayCategoryNavProps) {
  return (
    <div className="flex w-full gap-4 overflow-x-auto pb-2">
      {STAY_CATEGORIES.map((category) => {
        const isActive = category.id === active;
        return (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={cn(
              "flex min-w-[80px] shrink-0 flex-col items-center gap-2 border-b-2 px-1 pt-2 pb-2.5",
              isActive ? "border-black text-ink" : "border-transparent text-[#44474e] hover:text-ink",
            )}
          >
            <DynamicIcon name={category.icon} className="size-[18px]" />
            <span className="text-xs font-semibold tracking-[0.24px] whitespace-nowrap">{category.label}</span>
          </button>
        );
      })}
    </div>
  );
}
