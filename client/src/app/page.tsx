"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SplashScreen } from "@/components/shared/SplashScreen";

const DESKTOP_QUERY = "(min-width: 1024px)";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (window.matchMedia(DESKTOP_QUERY).matches) {
      router.replace("/auth");
    }
  }, [router]);

  return (
    <div className="lg:hidden">
      <SplashScreen onGetStarted={() => router.push("/auth")} />
    </div>
  );
}
