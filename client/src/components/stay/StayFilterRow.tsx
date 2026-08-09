"use client";

import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

const PILL_INPUT_CLASS =
  "flex h-9 shrink-0 items-center gap-2 rounded-full border border-[#e9ecef] bg-white px-4 text-xs font-semibold text-ink placeholder:text-[#44474e] placeholder:font-semibold focus:outline-2 focus:outline-brand-gold";

interface FilterPillButtonProps {
  label: string;
  bind: { onClick: () => void; "aria-expanded": boolean };
}

function FilterPillButton({ label, bind }: FilterPillButtonProps) {
  return (
    <button
      {...bind}
      className="flex h-9 shrink-0 items-center gap-2 rounded-full border border-[#e9ecef] bg-white px-4 text-xs font-semibold text-ink"
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

/** "Filter Row" (Figma node 3384:8235) — positioned exactly like
 * PropertiesFilterRow: `sticky` unconditionally (not gated to `lg:`), with
 * a mobile top offset matching TopNavBar's mobile height (73px) and a
 * desktop one matching its desktop height (64px). This component's own
 * root *is* the sticky element, one row, no nested wrapper — see
 * StayBrowser's own doc comment for why that structural detail matters.
 *
 * "Where to?" narrows by venue name/location, "Guests"/"Price Range"
 * narrow by preset bands (StayBrowser owns the actual matching logic, same
 * split PropertiesFilterRow/PropertiesBrowser use). "Add dates" has no
 * real availability data behind it yet — kept as a plain input for visual
 * fidelity with Figma, not wired to any filter.
 *
 * flex-nowrap + overflow-x-auto rather than flex-wrap, so all four pills
 * stay on the one row Figma shows: flex-wrap was dropping the last pill
 * onto its own line once the feed column got narrower than ~1200px wide. */
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
    <div className="sticky top-[73px] z-10 flex flex-nowrap items-center gap-3 overflow-x-auto bg-background py-3 lg:top-16">
      <label className={PILL_INPUT_CLASS}>
        <DynamicIcon name="MapPin" className="size-4 text-[#44474e]" />
        <input
          value={whereTo}
          onChange={(e) => onWhereToChange(e.target.value)}
          placeholder="Where to?"
          className="w-28 bg-transparent outline-none placeholder:text-[#44474e]"
        />
      </label>

      <div className="shrink-0">
        <Dropdown align="left" trigger={(bind) => <FilterPillButton label={guests} bind={bind} />}>
          {guestOptions.map((option) => (
            <DropdownItem key={option} label={option} onClick={() => onGuestsChange(option)} />
          ))}
        </Dropdown>
      </div>

      <label className={PILL_INPUT_CLASS}>
        <DynamicIcon name="Calendar" className="size-4 text-[#44474e]" />
        <input
          value={dates}
          onChange={(e) => onDatesChange(e.target.value)}
          placeholder="Add dates"
          className="w-20 bg-transparent outline-none placeholder:text-[#44474e]"
        />
      </label>

      <div className="shrink-0">
        <Dropdown align="left" trigger={(bind) => <FilterPillButton label={priceRange} bind={bind} />}>
          {priceRangeOptions.map((option) => (
            <DropdownItem key={option} label={option} onClick={() => onPriceRangeChange(option)} />
          ))}
        </Dropdown>
      </div>
    </div>
  );
}
