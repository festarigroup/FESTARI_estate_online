import { Skeleton } from "@/components/ui/Skeleton";

/** Mirrors PostCard's layout so the feed doesn't jump when real posts arrive. */
export function PostCardSkeleton() {
  return (
    <div className="flex w-full flex-col gap-[15px] rounded-[29px] border border-gray-200 bg-white p-[15px] sm:rounded-[15px]">
      <div className="flex w-full items-center gap-2">
        <Skeleton className="size-[46px] shrink-0 rounded-full" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3 w-28 rounded" />
          <Skeleton className="h-2.5 w-20 rounded" />
        </div>
      </div>

      <div className="h-px w-full bg-gray-200" />

      <div className="flex w-full flex-col gap-[15px]">
        <Skeleton className="h-3.5 w-full rounded" />
        <Skeleton className="h-3.5 w-2/3 rounded" />
        <Skeleton className="h-[285px] w-full rounded-[29px] sm:rounded-[15px]" />
      </div>

      <div className="h-px w-full bg-gray-200" />

      <div className="flex w-full items-center gap-6">
        <Skeleton className="h-3 w-16 rounded" />
        <Skeleton className="h-3 w-20 rounded" />
        <Skeleton className="h-3 w-14 rounded" />
      </div>
    </div>
  );
}
