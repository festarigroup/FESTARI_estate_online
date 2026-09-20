import { cn } from "@/lib/utils";

const NAV_ROWS = [
  ["Properties", "People", "Projects", "Services"],
  ["Community", "And more"],
];

interface SiteNavProps {
  size?: "sm" | "base";
}

const SIZE_STYLES = {
  sm: { text: "text-sm tracking-[-1.12px]", itemGap: "gap-2" },
  base: { text: "text-base tracking-[-1.28px]", itemGap: "gap-5" },
} as const;

export function SiteNav({ size = "base" }: SiteNavProps) {
  const { text, itemGap } = SIZE_STYLES[size];

  return (
    <nav aria-label="Site sections" className="flex flex-col items-center gap-2">
      {NAV_ROWS.map((row) => (
        <div key={row.join("-")} className={cn("flex flex-wrap items-center justify-center", itemGap)}>
          {row.map((link, index) => (
            <div key={link} className={cn("flex items-center", itemGap)}>
              {index > 0 && <span className="h-2 w-px rounded-full bg-[#cdced2]" />}
              <span className={cn("whitespace-nowrap font-display font-semibold text-white", text)}>
                {link}
              </span>
            </div>
          ))}
        </div>
      ))}
    </nav>
  );
}
