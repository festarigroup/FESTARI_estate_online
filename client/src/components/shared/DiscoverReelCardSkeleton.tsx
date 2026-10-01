import { Skeleton } from "@/components/ui/Skeleton";

/** Mirrors DiscoverReelCard's layout so the stack doesn't jump when reels arrive. */
export function DiscoverReelCardSkeleton() {
  return (
    <div className="flex w-full items-start gap-[32px]">
      <div className="flex w-full flex-col items-start gap-[8px]">
        <div className="flex w-full items-center gap-2">
          <Skeleton className="size-[40px] shrink-0 rounded-full" />
          <Skeleton className="h-3 w-24 rounded" />
          <Skeleton className="h-[23px] w-[67px] shrink-0 rounded-lg" />
        </div>
        <Skeleton className="h-[500px] w-full rounded-[30px] sm:h-[600px]" />
        <Skeleton className="h-3 w-2/3 rounded" />
      </div>
      <div className="hidden shrink-0 flex-col items-center gap-[16px] pb-[38px] sm:flex">
        <Skeleton className="size-[24px] rounded-full" />
        <Skeleton className="size-[24px] rounded-full" />
        <Skeleton className="size-[24px] rounded-full" />
        <Skeleton className="size-[24px] rounded-full" />
      </div>
    </div>
  );
}
