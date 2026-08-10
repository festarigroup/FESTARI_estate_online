"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { useAuth } from "@/context/AuthContext";
import { resendOtp } from "@/lib/api/auth";
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

export default function RegisterPage() {
  const router = useRouter();
  const { register, verifyOtp } = useAuth();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register({ firstname, lastname, email, password, roles: [role] });
      toast.success("Check your email for a verification code.");
      setStep("otp");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't create your account.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await verifyOtp(email, otp);
      toast.success("Email verified. You can now sign in.");
      router.push("/login");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Invalid or expired code.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    try {
      await resendOtp(email, "email_verification");
      toast.success("A new code is on its way.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't resend the code.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-[0px_4px_12px_0px_rgba(0,31,63,0.08)]">
        <div className="mb-6 flex flex-col items-center gap-2">
          <Image src="/images/logo-festari.png" alt="" width={37} height={54} className="h-10 w-auto" />
          <h1 className="font-heading text-xl text-ink">
            {step === "form" ? "Create your account" : "Verify your email"}
          </h1>
        </div>

        {step === "form" && (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-ink">First name</span>
                <input
                  required
                  placeholder="e.g. Kwame"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className={INPUT_CLASS}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-ink">Last name</span>
                <input
                  required
                  placeholder="e.g. Mensah"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className={INPUT_CLASS}
                />
              </label>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink">Email</span>
              <input
                type="email"
                required
                placeholder="admin@festari.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={INPUT_CLASS}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink">Password</span>
              <PasswordInput
                required
                minLength={8}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={INPUT_CLASS}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink">I am a...</span>
              <div className="relative">
                {/* appearance-none drops the browser's own arrow (which sits
                    flush against the edge with no breathing room) so this
                    ChevronDown can take its place, inset the same way every
                    other icon-affordance in this app is -- pr-9 on the
                    select keeps its own text from running underneath it. */}
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
              {submitting ? "Creating account..." : "Create account"}
            </Button>
          </form>
        )}

        {step === "form" && (
          <>
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border-subtle" />
              <span className="text-xs text-muted">OR</span>
              <div className="h-px flex-1 bg-border-subtle" />
            </div>

            <GoogleAuthButton
              text="signup_with"
              onSuccess={(user) => {
                toast.success("Welcome to Festari Estates!");
                router.push(user.roles.length === 0 ? "/choose-role" : "/");
              }}
              onError={(message) => toast.error(message)}
            />
          </>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerify} className="flex flex-col gap-4">
            <p className="text-sm text-muted">
              Enter the verification code we sent to <span className="font-semibold text-ink">{email}</span>.
            </p>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink">Verification code</span>
              <input
                required
                placeholder="6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={INPUT_CLASS}
              />
            </label>
            <Button type="submit" variant="gold" disabled={submitting} className="w-full">
              {submitting ? "Verifying..." : "Verify email"}
            </Button>
            <button type="button" onClick={handleResend} className="text-sm font-semibold text-brand-navy hover:underline">
              Resend code
            </button>
          </form>
        )}

        {step === "form" && (
          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-brand-navy hover:underline">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
