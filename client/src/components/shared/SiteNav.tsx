import { cn } from "@/lib/utils";

const NAV_ROWS = [
  ["Properties", "People", "Projects", "Services"],
  ["Community", "And more"],
];

interface SiteNavProps {
  size?: "sm" | "base";
  /** "onDark" (white text, on a gradient/dark surface) or "onLight" (gray text, on a plain white surface). */
  tone?: "onDark" | "onLight";
}

const SIZE_STYLES = {
  sm: { text: "text-sm tracking-[-1.12px]", itemGap: "gap-2" },
  base: { text: "text-base tracking-[-1.28px]", itemGap: "gap-5" },
} as const;

const TONE_STYLES = {
  onDark: { text: "text-white", separator: "bg-[#cdced2]" },
  onLight: { text: "text-[#475568] dark:text-white", separator: "bg-black dark:bg-[#cdced2]" },
} as const;

export function SiteNav({ size = "base", tone = "onDark" }: SiteNavProps) {
  const { text: sizeText, itemGap } = SIZE_STYLES[size];
  const { text: toneText, separator } = TONE_STYLES[tone];

  return (
    <nav aria-label="Site sections" className="flex flex-col items-center gap-2">
      {NAV_ROWS.map((row) => (
        <div key={row.join("-")} className={cn("flex flex-wrap items-center justify-center", itemGap)}>
          {row.map((link, index) => (
            <div key={link} className={cn("flex items-center", itemGap)}>
              {index > 0 && <span className={cn("h-2 w-px rounded-full", separator)} />}
              <span className={cn("whitespace-nowrap font-display font-semibold", sizeText, toneText)}>
                {link}
              </span>
            </div>
          ))}
        </div>
      ))}
    </nav>
  );
}
