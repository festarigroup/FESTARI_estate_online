import { ConciergeCard } from "@/components/shared/ConciergeCard";
import { TrendingHashtagsCard } from "@/components/shared/TrendingHashtagsCard";
import { TrendingPropertiesCard } from "@/components/shared/TrendingPropertiesCard";
import { UpcomingOpenHousesCard } from "@/components/shared/UpcomingOpenHousesCard";
import { WhoToFollowCard } from "@/components/shared/WhoToFollowCard";

/** Shared right rail for both "/home" and "/feed" — same promo/discovery cards on either page. */
export function FeedRightRail() {
  return (
    <div className="flex w-full flex-col gap-[15px]">
      <ConciergeCard />
      <WhoToFollowCard />
      <TrendingPropertiesCard />
      <UpcomingOpenHousesCard />
      <TrendingHashtagsCard />
    </div>
  );
}
