"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useAuth } from "@/context/AuthContext";
import { resendOtp } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

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
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-[0px_4px_12px_0px_rgba(0,31,63,0.08)]">
        <div className="mb-6 flex flex-col items-center gap-2">
          <Image src="/images/logo-festari.png" alt="" width={37} height={54} className="h-10 w-auto" />
          <h1 className="font-heading text-xl text-ink">
            {step === "form" ? "Create your account" : "Verify your email"}
          </h1>
        </div>

        {step === "form" ? (
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
              <select value={role} onChange={(e) => setRole(e.target.value)} className={INPUT_CLASS}>
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>

            <Button type="submit" variant="gold" disabled={submitting} className="mt-2 w-full">
              {submitting ? "Creating account..." : "Create account"}
            </Button>
          </form>
        ) : (
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
