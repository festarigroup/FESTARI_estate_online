import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-8 bg-white px-6 py-12 text-center dark:bg-night-900">
      <Logo className="h-9 w-auto" />

      <div className="flex flex-col items-center gap-3">
        <p className="text-[64px] font-bold leading-none tracking-[-1.92px] text-brand-900">404</p>
        <h1 className="text-2xl font-bold text-black dark:text-white">Page not found</h1>
        <p className="max-w-sm text-sm leading-5 text-gray-500 dark:text-muted-300">
          The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved. Let&rsquo;s get you
          back on track.
        </p>
      </div>

      <div className="flex w-full max-w-xs flex-col gap-3">
        <Link href="/home">
          <Button variant="primary">Back to Feed</Button>
        </Link>
        <Link href="/auth">
          <Button variant="outline">Go to Sign In</Button>
        </Link>
      </div>
    </div>
  );
}
