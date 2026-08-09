"use client";

import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

const PILL_INPUT_CLASS =
  "flex h-9 items-center gap-2 rounded-full border border-[#e9ecef] bg-white px-4 text-xs font-semibold text-ink placeholder:text-[#44474e] placeholder:font-semibold focus:outline-2 focus:outline-brand-gold";

interface FilterPillButtonProps {
  label: string;
  bind: { onClick: () => void; "aria-expanded": boolean };
}

/** Exported so StayBrowser's own Price Range dropdown (rendered as a
 * separate sibling — see StayFilterRow's doc comment for why) can reuse
 * the exact same pill chrome without duplicating it. */
export function FilterPillButton({ label, bind }: FilterPillButtonProps) {
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
}

/** "Filter Row" (Figma node 3384:8235), minus Price Range — "Where to?"
 * narrows by venue name/location, "Guests" narrows by a preset band
 * (StayBrowser owns the actual matching logic, same split
 * PropertiesFilterRow/PropertiesBrowser use). "Add dates" has no real
 * availability data behind it yet — kept as a plain input for visual
 * fidelity with Figma, not wired to any filter.
 *
 * Price Range is deliberately NOT rendered here, even though Figma shows
 * it in the same row — per explicit request, only Where to?/Guests/Add
 * dates stick on scroll, and Chromium only reliably clamps
 * `position: sticky` on an element that's a *direct* flex/grid-column
 * child of a container with real extra height to offer (confirmed by
 * isolated testing: wrapping it even one extra div deep, or making it a
 * flex/grid item of anything shorter, and the sticky offset is silently
 * ignored — the element just scrolls with the page). This component's own
 * root *is* that sticky element, so StayBrowser renders Price Range as a
 * separate top-level sibling instead of passing it in here — the tradeoff
 * is that it sits on its own line rather than sharing this exact row. */
export function StayFilterRow({
  whereTo,
  onWhereToChange,
  dates,
  onDatesChange,
  guests,
  guestOptions,
  onGuestsChange,
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
    </div>
  );
}
