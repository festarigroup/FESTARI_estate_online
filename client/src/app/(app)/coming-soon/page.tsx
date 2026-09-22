"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AppShell } from "@/components/shared/AppShell";
import { NavIcon } from "@/components/shared/NavIcon";
import { Button } from "@/components/ui/Button";

function ComingSoonContent() {
  const searchParams = useSearchParams();
  const feature = searchParams.get("feature") || "This feature";

  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-5 rounded-[15px] border border-gray-200 bg-white p-8 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-[#eef2ff]">
        <NavIcon icon="/icons/timer-clock-watch.svg" color="brand" size={30} />
      </span>
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-night-900">{feature} is coming soon</h1>
        <p className="max-w-sm text-sm text-gray-500">
          We&rsquo;re still building this part of Biltlinx. Check back soon &mdash; in the meantime, head
          back to the feed.
        </p>
      </div>
      <Link href="/home">
        <Button variant="primary" className="w-auto px-6">
          Back to Feed
        </Button>
      </Link>
    </div>
  );
}

export default function ComingSoonPage() {
  return (
    <AppShell activeKey="feed">
      <Suspense fallback={null}>
        <ComingSoonContent />
      </Suspense>
    </AppShell>
  );
}
