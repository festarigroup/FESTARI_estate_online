"use client";

import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { montserrat } from "@/app/home/landing-fonts";
import { mockSendInquiry } from "@/lib/mockApi";
import SelectField from "@/components/ui/SelectField";
import Reveal from "@/components/motion/Reveal";

const SUBJECTS = ["Real Estate Inquiry", "Hotel Reservation", "Artisan Commission", "Membership & Pricing", "General Question"];

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com", icon: "/facebook.png" },
  { label: "Instagram", href: "https://instagram.com", icon: "/instagram.png" },
  { label: "X", href: "https://x.com", icon: "/x.png" },
];

function MailBadgeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#be4d00]">
      <path
        d="M3 5h18v14H3V5Zm0 0 9 7 9-7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M3 20l18-8L3 4v6l12 2-12 2v6Z" fill="currentColor" />
    </svg>
  );
}

export default function ContactFormSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await mockSendInquiry(name, email, `[${subject}] ${message}`);
      if (res.success) {
        toast.success("Message sent! Our concierge team will be in touch shortly.");
        setName("");
        setEmail("");
        setMessage("");
        setSubject(SUBJECTS[0]);
      } else {
        toast.error(res.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-[#f0eded] px-5 py-16 md:px-16 md:py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col items-start gap-12 lg:flex-row">
        <Reveal x={-24} y={0} className="flex flex-1 flex-col gap-6 pt-2">
          <p className="text-sm font-semibold uppercase tracking-[1.4px] text-[#be4d00]">Support Channels</p>
          <h2 className={`${montserrat.className} text-[36px] font-semibold leading-[1.1] text-[#00261b] md:text-[48px] lg:text-[56px]`}>
            We are always ready to help you thrive.
          </h2>
          <p className="max-w-[448px] text-lg text-[#414944]">
            Experience the pinnacle of hospitality management. Our dedicated concierges are standing by to curate
            your next international acquisition or service request.
          </p>

          <a
            href="mailto:team@festariestate.com"
            className="flex items-center gap-4 pt-2 transition-opacity hover:opacity-80"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
              <MailBadgeIcon />
            </span>
            <span className="text-base font-medium text-[#0f1621]">team@festariestate.com</span>
          </a>

          <div className="flex items-center gap-3 pt-1">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex size-12 items-center justify-center rounded-full border border-[#be4d00]/30 bg-white/60 backdrop-blur-md transition-colors hover:bg-white"
              >
                <Image src={social.icon} alt="" width={16} height={16} className="opacity-80" />
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal
          x={24}
          y={0}
          delay={0.1}
          className="w-full flex-1 rounded-[32px] border border-white/40 bg-white/70 p-8 shadow-[0px_25px_50px_-33px_rgba(0,0,0,0.25)] backdrop-blur-[10px] md:p-10"
        >
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-1.5">
              <h3 className={`${montserrat.className} text-2xl font-semibold text-[#00261b]`}>Get in Touch</h3>
              <p className="text-base text-[#414944]">
                Define your goals and let us add value to your property search.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-name" className="text-sm font-semibold tracking-[0.35px] text-[#414944]">
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alexander Festari"
                    disabled={loading}
                    className="rounded-xl border border-[#c0c8c3]/50 bg-white/50 px-4 py-3.5 text-base text-[#0f1621] placeholder:text-[#6b7280] focus:outline-none focus:ring-1 focus:ring-[#be4d00] disabled:opacity-70"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-email" className="text-sm font-semibold tracking-[0.35px] text-[#414944]">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@domain.com"
                    disabled={loading}
                    className="rounded-xl border border-[#c0c8c3]/50 bg-white/50 px-4 py-3.5 text-base text-[#0f1621] placeholder:text-[#6b7280] focus:outline-none focus:ring-1 focus:ring-[#be4d00] disabled:opacity-70"
                  />
                </div>
              </div>

              <SelectField label="Subject" value={subject} options={SUBJECTS} onChange={setSubject} />

              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-message" className="text-sm font-semibold tracking-[0.35px] text-[#414944]">
                  Your Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist you today?"
                  disabled={loading}
                  className="resize-none rounded-xl border border-[#c0c8c3]/50 bg-white/50 px-4 py-3.5 text-base text-[#0f1621] placeholder:text-[#6b7280] focus:outline-none focus:ring-1 focus:ring-[#be4d00] disabled:opacity-70"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#be4d00] py-4 text-sm font-semibold tracking-[0.7px] text-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] transition-colors hover:bg-[#a54300] disabled:opacity-70"
              >
                {loading ? "Sending…" : "Send Message"}
                {!loading && <SendIcon />}
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
