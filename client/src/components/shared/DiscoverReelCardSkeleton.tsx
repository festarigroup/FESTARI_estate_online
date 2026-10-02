import { Skeleton } from "@/components/ui/Skeleton";

/** Mirrors DiscoverReelCard's two layouts so the stack doesn't jump when
 * reels arrive: a full-screen block below `xl:` (the mobile takeover), and
 * the three-column author | video | action-rail grid at `xl:` and up. Pure CSS
 * breakpoints — no hooks — so it can render as a server-side fallback. */
export function DiscoverReelCardSkeleton() {
  return (
    <>
      <div className="relative h-screen w-full bg-gray-300/60 xl:hidden">
        <Skeleton className="absolute left-4 top-[max(14px,env(safe-area-inset-top))] size-9 rounded-[16px]" />
        <div className="absolute inset-x-4 bottom-6 flex items-end justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <Skeleton className="size-9 rounded-full" />
              <Skeleton className="h-3.5 w-24 rounded" />
              <Skeleton className="h-[23px] w-[67px] rounded-lg" />
            </div>
            <Skeleton className="h-3 w-56 rounded" />
          </div>
          <div className="flex flex-col items-center gap-[18px]">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={index} className="size-[26px] rounded-full" />
            ))}
          </div>
        </div>
      </div>

      <div className="hidden min-h-[calc(100vh-67px)] items-center justify-center px-4 py-3 xl:flex">
        <div className="grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-0 pl-10">
          <div className="mr-1 flex w-full max-w-[293px] flex-col items-start justify-end gap-2 justify-self-end">
            <div className="flex w-full items-center gap-1.5">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <Skeleton className="h-3.5 w-24 rounded" />
              <Skeleton className="h-[23px] w-[67px] shrink-0 rounded-lg" />
            </div>
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-2/3 rounded" />
          </div>

          <Skeleton className="aspect-[402/716] h-[min(780px,calc(100vh-91px))] w-auto max-w-[402px] rounded-[16px]" />

          <div className="ml-[32px] flex flex-col items-center gap-4 self-end justify-self-start pb-[38px]">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="size-5 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
