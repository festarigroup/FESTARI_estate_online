"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { motion, useReducedMotion } from "framer-motion";
import { mockResendOtp } from "@/lib/mockApi";

const EASE = [0.22, 1, 0.36, 1] as const;

type ContactMethod = "email" | "phone";

function maskEmailDetailed(email: string) {
  const [user, domain] = email.split("@");
  if (!domain || !user) return null;
  if (user.length < 2) return `${user}@${domain}`;
  const first = user[0];
  const last = user[user.length - 1];
  const masked = "*".repeat(Math.max(user.length - 2, 3));
  return `${first}${masked}${last}@${domain}`;
}

function maskPhoneDetailed(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return null;
  const last2 = digits.slice(-2);
  const maskedLen = Math.max(digits.length - 2, 4);
  return `${"•".repeat(maskedLen)}${last2}`;
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0-.621.504-1.125 1.125-1.125h17.25c.621 0 1.125.504 1.125 1.125v10.5c0 .621-.504 1.125-1.125 1.125H3.375A1.125 1.125 0 012.25 17.25V6.75z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 6.5l9 6.5 9-6.5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="7" y="2.5" width="10" height="19" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" d="M11 18h2" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg className="h-4 w-6" fill="none" viewBox="0 0 24 16" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M23 8H1m0 0l6-6M1 8l6 6" />
    </svg>
  );
}

export default function ChangeContactMethod() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldReduceMotion = useReducedMotion();

  const email = searchParams.get("email") ?? "";
  const phone = searchParams.get("phone") ?? "";
  const maskedEmail = maskEmailDetailed(email);
  const maskedPhone = maskPhoneDetailed(phone);

  const [selected, setSelected] = useState<ContactMethod>("email");
  const [loading, setLoading] = useState(false);

  const backHref = `/verify-otp?${new URLSearchParams({ email, phone }).toString()}`;

  const handleApply = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await mockResendOtp();
      if (res.success) {
        toast.success(
          selected === "email"
            ? "A new code has been sent to your email."
            : "A new code has been sent to your mobile number."
        );
        router.push(backHref);
      } else {
        toast.error(res.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-white p-8">
      <div className="relative h-full w-full overflow-hidden rounded-[35px]">
        <Image
          src="/change-contact-hero.png"
          alt="Modern luxury residence at dusk"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/35" />

        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="absolute left-[clamp(1.5rem,3vw,3rem)] top-[clamp(1.25rem,3vh,2.1rem)] flex items-center gap-2"
        >
          <div className="relative h-[clamp(2.25rem,5vh,3.3rem)] w-[clamp(1.75rem,3.9vh,2.56rem)] shrink-0">
            <Image
              src="/auth-logo-mark.png"
              alt=""
              fill
              className="object-contain object-bottom [filter:brightness(0)_invert(1)]"
            />
          </div>
          <p className="text-[clamp(1rem,1.6vh+0.3vw,1.25rem)] font-bold leading-tight tracking-[-0.5px] text-white">
            Festari Estates
          </p>
        </motion.div>

        <div className="flex h-full w-full items-center justify-center p-[clamp(1rem,3vw,3rem)]">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="w-full max-w-[898px] rounded-[34px] border border-white/10 bg-white/10 p-[clamp(1.5rem,3vw,3rem)] backdrop-blur-xl"
          >
            <div className="flex flex-col gap-[clamp(1.25rem,3vh,1.5rem)]">
              <div className="flex flex-col gap-4 pb-[clamp(1rem,3vh,2rem)]">
                <Link
                  href={backHref}
                  className="flex items-center gap-2 text-[clamp(0.8125rem,0.9vh+0.2vw,1.125rem)] font-semibold tracking-[0.5px] text-white transition-opacity hover:opacity-80"
                >
                  <ArrowLeftIcon />
                  Back to Verification
                </Link>

                <h1 className="pt-[clamp(0.75rem,2vh,2rem)] text-[clamp(1.5rem,2vh+1.4vw,2.25rem)] font-semibold leading-tight text-white">
                  Change Contact Method
                </h1>

                <p className="text-[clamp(0.875rem,1vh+0.2vw,1.125rem)] leading-relaxed text-white/90">
                  To maintain the highest security standards for your Festari Estates account, please choose which
                  verified contact method you wish to update. This ensures your luxury portfolio remains accessible
                  only to you.
                </p>
              </div>

              <div className="flex flex-col gap-4 pb-[clamp(1rem,3vh,2rem)] sm:flex-row">
                <button
                  type="button"
                  onClick={() => setSelected("email")}
                  className={`flex flex-1 items-center gap-[clamp(1rem,2vw,1.5rem)] rounded-[24px] px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.9rem,2vh,1.125rem)] text-left transition-all ${
                    selected === "email"
                      ? "border-[3px] border-white bg-white/25"
                      : "border border-white/25 bg-white/10 hover:bg-white/15"
                  }`}
                >
                  <span className="flex size-[clamp(2.25rem,5vh,3.06rem)] shrink-0 items-center justify-center rounded-full bg-[rgba(240,237,237,0.3)] text-white">
                    <MailIcon />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="text-[clamp(0.9375rem,1vh+0.2vw,1.125rem)] font-semibold leading-tight text-[#0f1621]">
                      Update Email Address
                    </span>
                    <span className="truncate text-[clamp(0.8125rem,0.9vh,1rem)] text-[#0f1621]">
                      {maskedEmail ?? "No email on file"}
                    </span>
                  </span>
                  <ChevronRightIcon />
                </button>

                <button
                  type="button"
                  onClick={() => setSelected("phone")}
                  className={`flex flex-1 items-center gap-[clamp(1rem,2vw,1.5rem)] rounded-[24px] px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.9rem,2vh,1.125rem)] text-left transition-all ${
                    selected === "phone"
                      ? "border-[3px] border-white bg-white/25"
                      : "border border-white/25 bg-white/10 hover:bg-white/15"
                  }`}
                >
                  <span className="flex size-[clamp(2.25rem,5vh,3.06rem)] shrink-0 items-center justify-center rounded-full bg-[rgba(240,237,237,0.3)] text-white">
                    <PhoneIcon />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="text-[clamp(0.9375rem,1vh+0.2vw,1.125rem)] font-semibold leading-tight text-[#0f1621]">
                      Update Mobile Number
                    </span>
                    <span className="truncate text-[clamp(0.8125rem,0.9vh,1rem)] text-[#0f1621]">
                      {maskedPhone ?? "No mobile number on file"}
                    </span>
                  </span>
                  <ChevronRightIcon />
                </button>
              </div>

              <motion.button
                whileHover={shouldReduceMotion || loading ? undefined : { y: -1 }}
                whileTap={shouldReduceMotion || loading ? undefined : { scale: 0.98 }}
                type="button"
                onClick={handleApply}
                disabled={loading}
                className="flex h-[60px] w-full items-center justify-center gap-2 rounded-xl bg-[#be4d00] text-[18px] text-white transition-colors hover:bg-[#a54300] disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Spinner /> Applying…
                  </>
                ) : (
                  "Apply changes"
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
