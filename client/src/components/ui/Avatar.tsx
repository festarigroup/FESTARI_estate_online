import Image from "next/image";
import { cn } from "@/lib/cn";
import { DynamicIcon, type IconName } from "@/components/ui/DynamicIcon";

interface AvatarProps {
  /** Photo to render. Omit and pass `icon` instead when no real photo exists. */
  src?: string;
  alt: string;
  /** Fallback glyph shown on a neutral tinted circle when `src` is omitted
   * (e.g. a brand's exported logo asset failed to resolve from Figma). */
  icon?: IconName;
  size?: number;
  ring?: "gold" | "live" | "none";
  className?: string;
}

const RING_STYLES: Record<NonNullable<AvatarProps["ring"]>, string> = {
  gold: "border-2 border-brand-gold",
  live: "border-2 border-brand-rust",
  none: "",
};

/** Circular avatar image, optionally wrapped in a story-style colored ring. */
export function Avatar({ src, alt, icon, size = 40, ring = "none", className }: AvatarProps) {
  const image = src ? (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="size-full rounded-full object-cover"
    />
  ) : (
    <span
      className="flex size-full items-center justify-center rounded-full bg-surface-muted-2"
      title={alt}
    >
      <DynamicIcon name={icon ?? "Building2"} className="size-[42%] text-brand-navy" />
    </span>
  );

  if (ring === "none") {
    return (
      <div
        className={cn("shrink-0 overflow-hidden rounded-full", className)}
        style={{ width: size, height: size }}
      >
        {image}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "shrink-0 rounded-full p-0.5",
        RING_STYLES[ring],
        className,
      )}
      style={{ width: size + 8, height: size + 8 }}
    >
      <div className="size-full overflow-hidden rounded-full">{image}</div>
    </div>
  );
}
