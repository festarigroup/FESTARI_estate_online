"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/cn";

const INPUT_CLASS =
  "w-full rounded-lg border border-border-subtle px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-2 focus:outline-brand-gold";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // Surfaced inline under the password field, not just as a toast that
  // disappears after a few seconds — the backend intentionally returns the
  // same "Invalid email or password" for both a wrong email and a wrong
  // password (so a failed attempt never reveals whether that email even
  // has an account), so this stays generic rather than pretending to know
  // which field was actually wrong.
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't sign you in.";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-[0px_4px_12px_0px_rgba(0,31,63,0.08)]">
        <div className="mb-6 flex flex-col items-center gap-2">
          <Image src="/images/logo-festari.png" alt="" width={37} height={54} className="h-10 w-auto" />
          <h1 className="font-heading text-xl text-ink">Sign in to Festari Estates</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-ink">Email</span>
            <input
              type="email"
              required
              placeholder="admin@festari.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              aria-invalid={!!error}
              className={cn(INPUT_CLASS, error && "border-brand-rust focus:outline-brand-rust")}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-ink">Password</span>
            <PasswordInput
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              aria-invalid={!!error}
              className={cn(INPUT_CLASS, error && "border-brand-rust focus:outline-brand-rust")}
            />
            {error && (
              <p role="alert" className="text-xs text-brand-rust">
                {error}
              </p>
            )}
          </label>

          <Button type="submit" variant="gold" disabled={submitting} className="mt-2 w-full">
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-brand-navy hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
