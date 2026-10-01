import { AppShell } from "@/components/shared/AppShell";
import { DiscoverReelCardSkeleton } from "@/components/shared/DiscoverReelCardSkeleton";
import { Skeleton } from "@/components/ui/Skeleton";

// Overrides the shared `(app)/loading.tsx` for this route specifically —
// Discover has its own `topNav` (see page.tsx), so the generic fallback
// would otherwise flash the standard TopNav before this page's own
// search+filter bar swaps in.
export default function DiscoverLoading() {
  return (
    <AppShell
      topNav={
        <div className="flex h-[67px] w-full shrink-0 items-center gap-[15px] border-b border-gray-200 bg-white px-[15px] sm:px-[23px]">
          <Skeleton className="size-[34px] shrink-0 rounded sm:hidden" />
          <Skeleton className="hidden h-[36px] w-[72px] shrink-0 rounded sm:block" />
          <Skeleton className="h-[38px] w-full rounded-full sm:w-[256px]" />
          <Skeleton className="hidden h-[30px] w-[360px] rounded-full lg:block" />
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
    >
      <div className="pt-[15px] sm:pt-[23px]">
        <DiscoverReelCardSkeleton />
      </div>
    </AppShell>
  );
}
