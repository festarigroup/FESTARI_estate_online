import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface SocialAuthButtonProps {
  label: string;
  iconSrc: string;
  iconAlt: string;
  onClick: () => void;
  /** True for single-color (black) icons that need to flip to white in dark mode. */
  invertOnDark?: boolean;
}

export function SocialAuthButton({
  label,
  iconSrc,
  iconAlt,
  onClick,
  invertOnDark,
}: SocialAuthButtonProps) {
  return (
    <Button type="button" variant="social" onClick={onClick}>
      <span>{label}</span>
      <Image
        src={iconSrc}
        alt={iconAlt}
        width={24}
        height={24}
        className={cn("h-6 w-6 shrink-0", invertOnDark && "dark:invert")}
      />
    </Button>
  );
}
