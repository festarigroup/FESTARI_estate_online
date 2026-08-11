"use client";

import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { Calendar } from "@/components/ui/Calendar";
import { cn } from "@/lib/cn";

interface DateTimeInputProps {
  /** Only these two make sense here — matches the two native input types
   * this used to wrap. */
  type: "date" | "time";
  /** Same string formats a native date/time input's value has:
   * `YYYY-MM-DD` for `type="date"`, `HH:MM` (24-hour) for `type="time"` —
   * every caller's existing `value`/`onChange` state round-trips unchanged. */
  value: string;
  onChange: (e: { target: { value: string } }) => void;
  className?: string;
}

const TRIGGER_CLASS =
  "relative flex w-full items-center rounded-lg border border-border-subtle bg-white py-2 pr-3 pl-9 text-left text-sm text-ink focus:outline-2 focus:outline-brand-gold";

function formatDateDisplay(value: string) {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return value;
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function formatTimeDisplay(value: string) {
  const [h, m] = value.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return value;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

// Every half hour across the full day, the same range a native
// `<input type="time">` allows -- 00:00 through 23:30.
const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, "0");
  const m = i % 2 === 0 ? "00" : "30";
  return `${h}:${m}`;
});

/**
 * A fully custom date/time field — this used to dress a native
 * `<input type="date">`/`type="time">` (still-native picker popup, just a
 * restyled field) rather than reimplement the picker itself, reasoning
 * that a bespoke calendar/time widget was a worse trade for a form this
 * size than a well-tested native one. Revisited at explicit request:
 * every picker in this app is now custom-styled, dates and times
 * included, so this trades that native-picker reliability for full visual
 * consistency with the rest of the app instead.
 *
 * `value`/`onChange` still speak the exact same string formats a native
 * date/time input would have (`YYYY-MM-DD`, 24-hour `HH:MM`) — every
 * existing caller's own state and submit-time formatting keeps working
 * completely unchanged.
 */
export function DateTimeInput({ type, value, onChange, className }: DateTimeInputProps) {
  if (type === "date") {
    return (
      <Dropdown
        align="left"
        width={288}
        trigger={(bind) => (
          <button type="button" {...bind} className={cn(TRIGGER_CLASS, !value && "text-muted", className)}>
            <DynamicIcon name="Calendar" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
            {formatDateDisplay(value) ?? "Select a date"}
          </button>
        )}
      >
        <Calendar value={value} onSelect={(v) => onChange({ target: { value: v } })} />
      </Dropdown>
    );
  }

  return (
    <Dropdown
      align="left"
      matchTriggerWidth
      trigger={(bind) => (
        <button type="button" {...bind} className={cn(TRIGGER_CLASS, !value && "text-muted", className)}>
          <DynamicIcon name="Clock" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
          {value ? formatTimeDisplay(value) : "Select a time"}
        </button>
      )}
    >
      {/* no-scrollbar (see globals.css, same pattern StoryBar's rail uses)
          hides the visible scrollbar track/thumb -- still scrolls by
          wheel/touch/drag, just without the bar itself. */}
      <div className="no-scrollbar max-h-60 overflow-y-auto">
        {TIME_OPTIONS.map((t) => (
          <DropdownItem
            key={t}
            label={formatTimeDisplay(t)}
            onClick={() => onChange({ target: { value: t } })}
            className={t === value ? "bg-surface-muted font-semibold" : undefined}
          />
        ))}
      </div>
    </Dropdown>
  );
}
