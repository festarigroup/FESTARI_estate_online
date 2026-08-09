"use client";

import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

const PILL_INPUT_CLASS =
  "flex h-9 items-center gap-2 rounded-full border border-[#e9ecef] bg-white px-4 text-xs font-semibold text-ink placeholder:text-[#44474e] placeholder:font-semibold focus:outline-2 focus:outline-brand-gold";

interface FilterPillButtonProps {
  label: string;
  bind: { onClick: () => void; "aria-expanded": boolean };
}

function FilterPillButton({ label, bind }: FilterPillButtonProps) {
  return (
    <button
      {...bind}
      className="flex h-9 items-center gap-2 rounded-full border border-[#e9ecef] bg-white px-4 text-xs font-semibold text-ink"
    >
      {label}
      <DynamicIcon name="ChevronDown" className="size-3" />
    </button>
  );
}

interface StayFilterRowProps {
  whereTo: string;
  onWhereToChange: (value: string) => void;
  dates: string;
  onDatesChange: (value: string) => void;
  guests: string;
  guestOptions: string[];
  onGuestsChange: (value: string) => void;
  priceRange: string;
  priceRangeOptions: string[];
  onPriceRangeChange: (value: string) => void;
}

/** "Filter Row" (Figma node 3384:8235) — "Where to?" narrows by venue name/
 * location, "Guests"/"Price Range" narrow by preset bands (StayBrowser owns
 * the actual matching logic, same split PropertiesFilterRow/PropertiesBrowser
 * use). "Add dates" has no real availability data behind it yet — kept as a
 * plain input for visual fidelity with Figma, not wired to any filter.
 *
 * This component's own root *is* the sticky element — positioned the same
 * way as PropertiesFilterRow, all four pills sticking together as one row.
 * (An earlier pass tried splitting Price Range out onto its own line so
 * only three of the four pills stuck; that's reverted here in favor of
 * matching Properties' layout exactly — one consolidated sticky bar.) */
export function StayFilterRow({
  whereTo,
  onWhereToChange,
  dates,
  onDatesChange,
  guests,
  guestOptions,
  onGuestsChange,
  priceRange,
  priceRangeOptions,
  onPriceRangeChange,
}: StayFilterRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 bg-background lg:sticky lg:top-16 lg:z-10 lg:py-1">
      <label className={PILL_INPUT_CLASS}>
        <DynamicIcon name="MapPin" className="size-4 text-[#44474e]" />
        <input
          value={whereTo}
          onChange={(e) => onWhereToChange(e.target.value)}
          placeholder="Where to?"
          className="w-28 bg-transparent outline-none placeholder:text-[#44474e]"
        />
      </label>

      <Dropdown align="left" trigger={(bind) => <FilterPillButton label={guests} bind={bind} />}>
        {guestOptions.map((option) => (
          <DropdownItem key={option} label={option} onClick={() => onGuestsChange(option)} />
        ))}
      </Dropdown>

      <label className={PILL_INPUT_CLASS}>
        <DynamicIcon name="Calendar" className="size-4 text-[#44474e]" />
        <input
          value={dates}
          onChange={(e) => onDatesChange(e.target.value)}
          placeholder="Add dates"
          className="w-20 bg-transparent outline-none placeholder:text-[#44474e]"
        />
      </label>

      <Dropdown align="left" trigger={(bind) => <FilterPillButton label={priceRange} bind={bind} />}>
        {priceRangeOptions.map((option) => (
          <DropdownItem key={option} label={option} onClick={() => onPriceRangeChange(option)} />
        ))}
      </Dropdown>
    </div>
  );
}
