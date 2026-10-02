import { AppShell } from "@/components/shared/AppShell";
import { DiscoverReelCardSkeleton } from "@/components/shared/DiscoverReelCardSkeleton";
import { Skeleton } from "@/components/ui/Skeleton";

// Overrides the shared `(app)/loading.tsx` for this route specifically —
// Discover has its own `topNav` (see page.tsx), so the generic fallback
// would otherwise flash the standard TopNav before this page's own
// search+filter bar swaps in. Uses the same shell options as the real page
// (full-width, no padding, nav bar hidden below `xl:`) so nothing shifts.
export default function DiscoverLoading() {
  return (
    <AppShell
      topNav={
        <div className="hidden h-[67px] w-full shrink-0 items-center gap-[15px] border-b border-gray-200 bg-white px-[23px] xl:flex">
          <Skeleton className="h-[36px] w-[72px] shrink-0 rounded" />
          <Skeleton className="h-[38px] w-[256px] rounded-full" />
          <Skeleton className="h-[30px] w-[360px] rounded-full" />
        </div>
      }
      rightRail={
        <div className="flex h-full w-[59px] flex-col items-center gap-[16px] border-l border-gray-200 bg-white py-[24px]">
          <Skeleton className="size-[32px] rounded-full" />
          <Skeleton className="size-[32px] rounded-full" />
          <Skeleton className="size-[32px] rounded-full" />
          <Skeleton className="size-[32px] rounded-full" />
          <Skeleton className="size-[32px] rounded-full" />
          <Skeleton className="size-[48px] rounded-full" />
        </div>
      }
      rightRailBare
      contentFullWidth
      contentPadding="px-0 pb-0"
    >
      <DiscoverReelCardSkeleton />
    </AppShell>
  );
}
