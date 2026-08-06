import Image from "next/image";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { MenuButton } from "@/components/layout/MenuButton";

interface TopNavBarProps {
  onMenuClick: () => void;
}

/** Persistent header ("Header - TopNavBar" in Figma): logo, search, and user actions. */
export function TopNavBar({ onMenuClick }: TopNavBarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-[73px] items-center justify-between gap-4 border-b border-brand-navy-light bg-brand-navy px-4 shadow-lg sm:px-6 lg:px-10">
      <div className="flex min-w-0 flex-1 items-center gap-4 lg:gap-[68px]">
        <MenuButton onClick={onMenuClick} />
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image src="/images/logo-festari.png" alt="" width={31} height={40} className="h-10 w-auto" />
          <span className="hidden font-display text-base font-bold tracking-[-0.5px] text-white sm:inline">
            Festari Estates
          </span>
        </Link>

        <div className="relative hidden max-w-[568px] min-w-0 flex-1 md:block">
          <DynamicIcon
            name="Search"
            className="absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-white/60"
          />
          <input
            type="search"
            placeholder="Search properties, people, services..."
            className="w-full rounded-full bg-white/10 py-2.5 pr-4 pl-11 text-sm text-white placeholder:text-white/50 focus:outline-2 focus:outline-brand-gold"
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-6">
        <button className="hidden items-center gap-2 rounded-full bg-white/10 px-6 py-2 text-sm text-white hover:bg-white/20 sm:flex">
          <DynamicIcon name="Plus" className="size-4" />
          Create Post
        </button>

        <button aria-label="Messages" className="relative text-white/80 hover:text-white">
          <DynamicIcon name="MessageSquare" className="size-5" />
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-brand-rust text-[10px] text-white">
            3
          </span>
        </button>
        <button aria-label="Notifications" className="relative text-white/80 hover:text-white">
          <DynamicIcon name="Bell" className="size-5" />
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-brand-rust text-[10px] text-white">
            7
          </span>
        </button>

        <button className="flex items-center gap-3">
          <Avatar src="/images/avatar-kwame-topnav.png" alt="Kwame" size={40} ring="gold" />
          <span className="hidden text-left leading-tight lg:block">
            <span className="block font-heading text-sm text-white">Kwame</span>
            <span className="block font-mono text-[10px] text-white/60">Professional</span>
          </span>
          <DynamicIcon name="ChevronDown" className="hidden size-3 text-white/60 lg:block" />
        </button>
      </div>
    </header>
  );
}
