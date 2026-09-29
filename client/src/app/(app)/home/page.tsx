import { AppShell } from "@/components/shared/AppShell";
import { FeedPreviewSection } from "@/components/shared/FeedPreviewSection";
import { FeedRightRail } from "@/components/shared/FeedRightRail";
import { FadeIn } from "@/components/motion/FadeIn";
import { HomeGreeting } from "@/components/shared/HomeGreeting";
import { MarketplaceSection } from "@/components/shared/MarketplaceSection";
import { NeedsAttentionSection } from "@/components/shared/NeedsAttentionSection";
import { StoriesRow } from "@/components/shared/StoriesRow";

export default function HomePage() {
  return (
    <AppShell activeKey="feed" activeChildKey="home" rightRail={<FeedRightRail />}>
      <div className="flex w-full flex-col gap-[23px]">
        <FadeIn delay={0}>
          <HomeGreeting />
        </FadeIn>
        <FadeIn delay={0.05}>
          <StoriesRow />
        </FadeIn>
        <FadeIn delay={0.1}>
          <NeedsAttentionSection />
        </FadeIn>
        <FadeIn delay={0.15}>
          <FeedPreviewSection />
        </FadeIn>
        <FadeIn delay={0.2}>
          <MarketplaceSection />
        </FadeIn>
      </div>
    </AppShell>
  );
}
