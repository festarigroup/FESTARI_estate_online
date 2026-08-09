import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { cn } from "@/lib/cn";

interface DateTimeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Only these two make sense here — a native date/time input's own
   * picker is what this wraps, not a general-purpose text field. */
  type: "date" | "time";
}

/**
 * A native date/time input dressed to match the rest of the app's form
 * fields — plain `<input type="date">`/`type="time"` render with the
 * browser's own generic chrome (no rounded border, no focus ring, a bare
 * calendar/clock glyph) that clashed with every styled field around it.
 *
 * Still the real native input under the hood — its picker popup is
 * OS/browser-rendered and can't be restyled from CSS, and reimplementing a
 * calendar widget from scratch would trade a well-tested, keyboard- and
 * mobile-native picker for a bespoke one, a worse trade for a form this
 * size. What *is* stylable: the field itself (border, focus ring, height,
 * padding — matched to every other input here) and a leading icon that
 * signals what the field is for, same convention search bars use.
 *
 * `[color-scheme:light]` pins the native picker popup to a light theme
 * regardless of OS setting — this app has no dark mode, so a
 * system-dark-mode picker would be the one jarring dark surface in an
 * otherwise all-light UI. The `[&::-webkit-calendar-picker-indicator]`
 * rules just dim the browser's own icon at rest and bring it to full
 * opacity on hover, so it doesn't visually compete with the leading icon.
 */
export function DateTimeInput({ type, className, ...props }: DateTimeInputProps) {
  return (
    <div className="relative">
      <DynamicIcon
        name={type === "date" ? "Calendar" : "Clock"}
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
      />
      <input
        type={type}
        className={cn(
          "w-full rounded-lg border border-border-subtle bg-white py-2 pr-3 pl-9 text-sm text-ink",
          "placeholder:text-muted focus:outline-2 focus:outline-brand-gold",
          "[color-scheme:light]",
          "[&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-100",
          className,
        )}
        {...props}
      />
    </div>
  );
}
