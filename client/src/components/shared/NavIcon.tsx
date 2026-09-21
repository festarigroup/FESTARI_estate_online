import { cn } from "@/lib/utils";

interface NavIconProps {
  icon: string;
  color?: "night" | "brand" | "white";
  size?: number;
  className?: string;
}

const COLOR_CLASS: Record<NonNullable<NavIconProps["color"]>, string> = {
  night: "bg-night-700",
  brand: "bg-brand-600",
  white: "bg-white",
};

/**
 * Renders an icon as a CSS mask instead of an <img>, so its color can be
 * controlled here regardless of whatever fill/stroke color is baked into the
 * source SVG (several of our nav icons have inconsistent baked-in colors).
 */
export function NavIcon({ icon, color = "night", size = 20, className }: NavIconProps) {
  return (
    <span
      aria-hidden
      className={cn("block shrink-0", COLOR_CLASS[color], className)}
      style={{
        width: size,
        height: size,
        WebkitMaskImage: `url(${icon})`,
        maskImage: `url(${icon})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}
