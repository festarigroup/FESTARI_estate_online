"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { DynamicIcon, type IconName } from "@/components/ui/DynamicIcon";

interface ComingSoonPageProps {
  icon: IconName;
  title: string;
  description: string;
}

/**
 * Shared placeholder for every nav destination that doesn't have a real
 * screen yet. Renders as plain page content — the persistent TopNavBar/
 * SideNavBar chrome already comes from the `(app)` layout, so this doesn't
 * need its own navbar/footer the way a standalone landing page would.
 */
export function ComingSoonPage({ icon, title, description }: ComingSoonPageProps) {
  const [email, setEmail] = useState("");

  function handleNotify(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("We'll email you the moment this goes live.");
    setEmail("");
  }

  return (
    // No lg:px -- <main> already provides the sidebar clearance and right
    // margin, so this doesn't need to stack another lg:px-10 on top.
    <div className="mx-auto flex max-w-[900px] flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 lg:px-0">
      <span className="flex size-16 items-center justify-center rounded-full bg-surface-muted">
        <DynamicIcon name={icon} className="size-7 text-brand-navy" />
      </span>

      <span className="rounded-full bg-brand-gold/15 px-4 py-1.5 text-xs font-semibold tracking-[1.4px] text-brand-navy uppercase">
        Coming Soon
      </span>

      <h1 className="font-heading text-2xl text-ink">{title}</h1>
      <p className="max-w-md text-base text-muted">{description}</p>

      <form onSubmit={handleNotify} className="flex w-full max-w-md flex-col gap-3 pt-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="flex-1 rounded-full border border-border-subtle bg-white px-5 py-3 text-sm text-ink placeholder:text-muted focus:outline-2 focus:outline-brand-gold"
        />
        <Button type="submit" variant="gold" className="px-6">
          Notify me
        </Button>
      </form>

      <Link href="/" className="pt-2 text-sm font-semibold text-brand-navy hover:underline">
        Back to Home
      </Link>
    </div>
  );
}
