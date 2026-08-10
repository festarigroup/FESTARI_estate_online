"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/cn";

const INPUT_CLASS =
  "w-full rounded-lg border border-border-subtle px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-2 focus:outline-brand-gold";

const ROLES = [
  { value: "buyer", label: "Buyer / Renter" },
  { value: "estate_manager", label: "Estate manager" },
  { value: "hotel_manager", label: "Hotel manager" },
  { value: "artisan", label: "Artisan / Service provider" },
];

// Reached after a Google sign-in/sign-up that didn't come with a role
// (a brand-new account, or a returning user who closed the app before
// finishing this step last time). We force this screen — no skipping —
// until the account has at least one role, then every later Google
// sign-in goes straight past it.
export default function ChooseRolePage() {
  const router = useRouter();
  const { user, loading, setRole: saveRole, logout } = useAuth();
  const [role, setRole] = useState("buyer");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    } else if (user.roles.length > 0) {
      router.replace("/");
    }
  }, [loading, user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await saveRole(role);
      toast.success("You're all set!");
      router.push("/");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't save your role.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSignOut() {
    await logout();
    router.push("/login");
  }

  if (loading || !user || user.roles.length > 0) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-[0px_4px_12px_0px_rgba(0,31,63,0.08)]">
        <div className="mb-6 flex flex-col items-center gap-2">
          <Image src="/images/logo-festari.png" alt="" width={37} height={54} className="h-10 w-auto" />
          <h1 className="font-heading text-xl text-ink">One last thing</h1>
          <p className="text-center text-sm text-muted">Tell us how you&apos;ll use Festari Estates.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-ink">I am a...</span>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={cn(INPUT_CLASS, "appearance-none pr-9")}
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <DynamicIcon
                name="ChevronDown"
                className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted"
              />
            </div>
          </label>

          <Button type="submit" variant="gold" disabled={submitting} className="mt-2 w-full">
            {submitting ? "Saving..." : "Continue"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Signed in as {user.email}.{" "}
          <button type="button" onClick={handleSignOut} className="font-semibold text-brand-navy hover:underline">
            Not you?
          </button>
        </p>
      </div>
    </div>
  );
}
