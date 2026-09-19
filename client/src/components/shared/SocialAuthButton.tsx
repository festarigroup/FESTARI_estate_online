import Image from "next/image";
import { Button } from "@/components/ui/Button";

interface SocialAuthButtonProps {
  label: string;
  iconSrc: string;
  iconAlt: string;
  onClick: () => void;
}

export function SocialAuthButton({ label, iconSrc, iconAlt, onClick }: SocialAuthButtonProps) {
  return (
    <Button type="button" variant="social" onClick={onClick}>
      <span>{label}</span>
      <Image src={iconSrc} alt={iconAlt} width={24} height={24} className="h-6 w-6 shrink-0" />
    </Button>
  );
}
