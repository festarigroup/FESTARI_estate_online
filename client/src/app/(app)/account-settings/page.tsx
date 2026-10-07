"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/shared/AppShell";
import { showSuccessToast } from "@/components/shared/AppToast";
import { NavIcon } from "@/components/shared/NavIcon";
import { cn } from "@/lib/utils";

const TABS = ["Profile", "Security", "Billings", "General Settings"] as const;
type Tab = (typeof TABS)[number];

const PERSONAL_INFO = [
  { label: "First Name", value: "Madeline" },
  { label: "Last Name", value: "Price" },
  { label: "Email", value: "madelineprice@gmail.com" },
  { label: "Phone Number", value: "0246508595" },
  { label: "Account ID", value: "Personal" },
];

const ADDRESS = [
  { label: "Country", value: "Ghana" },
  { label: "Region/State", value: "Greater Accra" },
  { label: "City", value: "Accra" },
  { label: "Postal Code", value: "00233" },
];

const COMPLETION_STEPS = [
  { label: "Setup account", percent: 50, done: true },
  { label: "Upload your photo", percent: 5, done: true },
  { label: "Personal Info", percent: 25, done: true },
  { label: "Address", percent: 20, done: false },
];

const ACCOUNTS = [
  { name: "Madeline Price", email: "Madelinerrince@gmail.com", avatar: "/icons/avatar-sample.jpg" },
  { name: "Organization Name", email: "Madeline@amalitech.org" },
];

export default function AccountSettingsPage() {
  const [tab, setTab] = useState<Tab>("Profile");

  return (
    <AppShell contentFullWidth rightRail={<ProfileCompletionCard />}>
      <div className="mx-auto flex w-full max-w-[762px] flex-col gap-4 pb-6 pt-6 sm:pt-8">
        <ProfileBanner />
        <nav
          className="flex h-[43px] w-full items-stretch overflow-x-auto rounded-2xl border border-[#e6e7ec] bg-white pl-4 pr-2.5 no-scrollbar"
          aria-label="Account sections"
        >
          {TABS.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setTab(name)}
              aria-current={tab === name ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center justify-center whitespace-nowrap border-b px-4 text-[13px] leading-7",
                tab === name
                  ? "rounded-tl-2xl border-b-2 border-[#5d9afb] font-medium text-[#498cf8]"
                  : "border-[#e6e7ec] text-[#111826] hover:text-[#498cf8]",
              )}
            >
              {name}
            </button>
          ))}
        </nav>

        <div className="rounded-2xl border border-gray-200 bg-white p-3">
          {tab === "Profile" ? (
            <ProfileTab />
          ) : (
            <p className="px-4 py-16 text-center text-sm text-gray-500">{tab} is coming soon.</p>
          )}
        </div>

        <div className="xl:hidden">
          <ProfileCompletionCard />
        </div>
      </div>
    </AppShell>
  );
}

function ProfileBanner() {
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[181px] w-full overflow-hidden rounded-[32px] border-[10px] border-white/20 bg-[#1465e6]">
        <Image src="/icons/account-banner-star.svg" alt="" width={80} height={118} unoptimized className="absolute right-[16%] top-[112px]" />
        <Image src="/icons/account-banner-stars.svg" alt="" width={211} height={232} unoptimized className="absolute -top-[69px] left-[72%]" />
        <Image src="/icons/account-banner-stars.svg" alt="" width={211} height={232} unoptimized className="absolute -left-[39px] -top-[33px]" />
      </div>
      <div className="-mt-[68px] flex w-[calc(100%-24px)] sm:w-[calc(100%-54px)] items-center justify-between gap-2 rounded-2xl bg-gradient-to-b sm:rounded-[33px] from-[#cfddfa] via-white to-white p-3 sm:gap-3 shadow-[0px_20px_27px_0px_rgba(0,0,0,0.05)] backdrop-blur-[13.5px] sm:p-6">
        <IdentityBlock banner />
        <SwitchRoleMenu />
      </div>
    </div>
  );
}

function IdentityBlock({ compact = false, banner = false }: { compact?: boolean; banner?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className={cn("relative block shrink-0", banner ? "size-14 sm:size-[72px]" : "size-[67px]")}>
        <span className={cn("relative block size-full overflow-hidden", banner ? "rounded-[23px]" : "rounded-2xl")}>
          <Image src="/icons/avatar-sample.jpg" alt="Madeline Price" fill className="object-cover" sizes="72px" />
        </span>
        {banner ? (
          <span className="absolute -bottom-[2px] -right-[2px] flex items-center rounded-full border border-dashed border-[#ff8d28] bg-gradient-to-r from-[#ff8d28] via-[#e24bb9] to-[#983fe0] p-1 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.1)]">
            <Image src="/icons/account-banner-upload.svg" alt="Upload photo" width={10} height={10} unoptimized />
          </span>
        ) : (
          <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-gradient-to-br from-[#ff3d9a] to-[#a43dff] ring-2 ring-white">
            <NavIcon icon="/icons/file-verified.svg" color="night" size={10} className="bg-white" />
          </span>
        )}
      </span>
      <div className="flex min-w-0 flex-col items-start gap-0.5">
        <p className={cn("truncate font-semibold text-[#0f1621]", compact ? "text-sm" : "text-base leading-4")}>Madeline Price</p>
        <p className="flex items-center gap-1.5 text-[11px] text-[#0f1621]">
          <NavIcon icon="/icons/map-pin-02-sm.svg" color="night" size={12} />
          Accra , Ghana
        </p>
        <span className="flex h-4 w-fit shrink-0 items-center whitespace-nowrap rounded-full bg-[#e2e8f0] px-2 text-[10px] leading-4 text-[#1465e6]">ID Verified</span>
      </div>
    </div>
  );
}

function SwitchRoleMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex h-9 items-center gap-1.5 rounded-2xl bg-white px-3 text-xs sm:h-10 sm:gap-2 sm:rounded-[10px] sm:px-4 sm:text-sm text-[#404040] hover:bg-gray-50"
      >
        Switch role
        <NavIcon icon="/icons/poll-chevron-down.svg" color="night" size={10} />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-[266px] rounded-[26px] border border-[#e2e8f0] bg-white/10 p-2.5 shadow-[0px_24px_60px_-15px_rgba(0,0,0,0.15)] backdrop-blur-[8px]">
          <div className="flex flex-col gap-2.5 rounded-2xl bg-white/90 p-2.5">
            <p className="text-sm font-semibold leading-5 text-[#001f3f]">Switch account</p>
            <ul className="flex flex-col gap-1">
              {ACCOUNTS.map((account) => (
                <li key={account.name}>
                  <button type="button" className="flex w-full items-center gap-2 py-1 text-left" onClick={() => setOpen(false)}>
                    <span className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border-[0.4px] border-[#ebebeb] bg-white">
                      {account.avatar ? (
                        <Image src={account.avatar} alt="" fill className="object-cover" sizes="32px" />
                      ) : (
                        <NavIcon icon="/icons/org.svg" color="night" size={16} />
                      )}
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate text-[15px] font-medium leading-4 text-black">{account.name}</span>
                      <span className="truncate text-xs leading-4 text-gray-400">{account.email}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileTab() {
  return (
    <div className="flex flex-col gap-4 px-2 pb-2 sm:px-4 sm:pb-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-night-900">Profile</h1>
        <p className="text-[13px] text-gray-600">Account information from your authentication profile</p>
      </div>

      <div className="rounded-2xl border border-gray-200 p-4">
        <IdentityBlock compact />
      </div>

      <InfoCard title="Personal Information" fields={PERSONAL_INFO} />
      <InfoCard title="Address" fields={ADDRESS} />
    </div>
  );
}

function InfoCard({ title, fields }: { title: string; fields: { label: string; value: string }[] }) {
  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-gray-200 p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-medium text-night-900">{title}</h2>
        <button
          type="button"
          onClick={() => showSuccessToast("Editing is coming soon")}
          className="flex h-8 items-center gap-2 rounded-2xl border sm:rounded-lg border border-gray-200 px-3 text-xs text-night-900 hover:bg-gray-50"
        >
          Edit
          <NavIcon icon="/icons/poll-option-edit.svg" color="night" size={12} />
        </button>
      </div>
      <dl className="grid grid-cols-1 gap-x-12 gap-y-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.label} className="flex items-center justify-between gap-3 border-b border-gray-200 pb-2 text-[13px]">
            <dt className="text-gray-400">{field.label}</dt>
            <dd className="truncate text-night-900">{field.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function ProfileCompletionCard() {
  const total = COMPLETION_STEPS.reduce((sum, step) => sum + (step.done ? step.percent : 0), 0);

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white p-5">
      <span
        className="flex size-[56px] items-center justify-center rounded-full p-[3px]"
        style={{ background: `conic-gradient(#1465e6 ${total}%, #e2e8f0 0)` }}
      >
        <span className="relative block size-full overflow-hidden rounded-full border-2 border-white">
          <Image src="/icons/avatar-sample.jpg" alt="" fill className="object-cover" sizes="56px" />
        </span>
      </span>
      <div className="flex flex-col items-center gap-0.5 text-center">
        <p className="text-sm font-semibold text-night-900">Good Morning Madeline</p>
        <p className="text-[10px] text-night-900">
          Profile is <span className="text-brand-900">{total}%</span> Percent Complete.
        </p>
      </div>
      <ul className="flex w-full flex-col gap-1.5">
        {COMPLETION_STEPS.map((step) => (
          <li
            key={step.label}
            className={cn("flex items-center justify-between text-[10px]", step.done ? "text-night-900" : "text-gray-400")}
          >
            <span className="flex items-center gap-2">
              <span className="w-2.5">{step.done ? "✓" : ""}</span>
              {step.label}
            </span>
            <span>{step.percent}%</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => showSuccessToast("Profile setup is coming soon")}
        className="h-10 w-full rounded-2xl bg-brand-900 sm:rounded-lg text-[13px] text-white hover:bg-brand-900/90"
      >
        Complete profile
      </button>
    </div>
  );
}
