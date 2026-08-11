"use client";

import { useState } from "react";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { useDropdownClose } from "@/components/ui/Dropdown";
import { cn } from "@/lib/cn";

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** `YYYY-MM-DD`, built from local year/month/day rather than
 * `toISOString()` (UTC-based — shifts to the wrong day near midnight in
 * any timezone ahead of UTC) so it round-trips exactly like a native
 * `<input type="date">`'s own value. */
function toISODate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseISODate(value: string): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function isSameDay(a: Date, year: number, month: number, day: number) {
  return a.getFullYear() === year && a.getMonth() === month && a.getDate() === day;
}

interface CalendarProps {
  /** `""` or `YYYY-MM-DD`, same format a native date input's value has. */
  value: string;
  onSelect: (value: string) => void;
}

/**
 * Month-grid date picker — rendered as a Dropdown's `children`, so it calls
 * useDropdownClose() itself once a day's picked, the same way DropdownItem
 * does, rather than making every caller wire that up by hand.
 *
 * This exists instead of a native `<input type="date">`'s own picker
 * because that popup is OS/browser chrome no CSS can restyle — see
 * DateTimeInput's own doc comment for the trade-off that decision makes
 * (a bespoke calendar over a well-tested native one).
 */
export function Calendar({ value, onSelect }: CalendarProps) {
  const selected = parseISODate(value);
  const today = new Date();
  const [viewDate, setViewDate] = useState(selected ?? today);
  const close = useDropdownClose();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Leading blanks only (no trailing fill from next month) — simpler grid,
  // and which cells are blank is unambiguous without needing to dim
  // adjacent-month days to tell them apart from this month's own.
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function handleSelect(day: number) {
    onSelect(toISODate(new Date(year, month, day)));
    close();
  }

  return (
    <div className="p-3">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          className="flex size-7 items-center justify-center rounded-full text-muted hover:bg-surface-muted hover:text-ink"
        >
          <DynamicIcon name="ChevronLeft" className="size-4" />
        </button>
        <span className="text-sm font-semibold text-ink">
          {MONTH_LABELS[month]} {year}
        </span>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          className="flex size-7 items-center justify-center rounded-full text-muted hover:bg-surface-muted hover:text-ink"
        >
          <DynamicIcon name="ChevronRight" className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center text-[11px] font-semibold text-muted">
        {WEEKDAY_LABELS.map((label, i) => (
          // Index, not label, as the key -- Su/Mo/... aren't unique enough
          // on their own to rule out (there's only one of each here, but
          // keying positional data by position is the honest choice).
          <span key={i}>{label}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (day === null) return <span key={i} />;
          const isSelected = !!selected && isSameDay(selected, year, month, day);
          const isToday = isSameDay(today, year, month, day);
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(day)}
              className={cn(
                "mx-auto flex size-8 items-center justify-center rounded-full text-sm text-ink hover:bg-surface-muted",
                isSelected && "bg-brand-navy text-white hover:bg-brand-navy",
                !isSelected && isToday && "font-bold text-brand-gold-dark",
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
