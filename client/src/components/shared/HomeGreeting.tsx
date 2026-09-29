"use client";

import { useEffect, useState } from "react";

function timeOfDayGreeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatToday(now: Date) {
  return now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}

/** Personalized dashboard header — greeting + today's date. Both depend on
 * the viewer's local clock, so they're read after mount (same pattern
 * AppShell uses for its collapsed-sidebar override) rather than at render
 * time, which would risk a server/client hydration mismatch. */
export function HomeGreeting() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  return (
    <div className="flex w-full flex-col gap-1 pt-2">
      <h1 className="text-[24px] font-bold leading-tight text-night-900">
        {now ? timeOfDayGreeting(now.getHours()) : "Good day"}, Madeline
      </h1>
      <p className="text-[13px] leading-tight text-gray-500">{now ? `${formatToday(now)} · Accra` : "Accra"}</p>
    </div>
  );
}
