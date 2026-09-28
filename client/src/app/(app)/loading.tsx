import { AppShell } from "@/components/shared/AppShell";
import { PostCardSkeleton } from "@/components/shared/PostCardSkeleton";
import { Skeleton } from "@/components/ui/Skeleton";

// Next.js shows this automatically while a route segment under (app) is still
// loading (slow connection fetching the page's JS, initial data, etc), via
// the App Router's built-in Suspense boundary — no wiring needed per page.
export default function AppLoading() {
  return (
    <AppShell
      header={
        <div className="pb-[15px]">
          <Skeleton className="h-[42px] w-full rounded-[15px]" />
        </div>
      }
      rightRail={
        <div className="flex w-full flex-col gap-[15px]">
          <Skeleton className="h-[220px] w-full rounded-[15px]" />
          <Skeleton className="h-[180px] w-full rounded-[15px]" />
          <Skeleton className="h-[220px] w-full rounded-[15px]" />
        </div>
      }
    >
      <div className="flex w-full flex-col gap-[15px]">
        <Skeleton className="hidden h-[124px] w-full rounded-[15px] sm:block" />
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
      </div>
    </AppShell>
  );
}
