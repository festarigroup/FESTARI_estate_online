"use client";

import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { HOST } from "@/lib/properties";
import { mockSendInquiry } from "@/lib/mockApi";

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M3 20l18-8L3 4v6l12 2-12 2v6Z" fill="currentColor" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M6.6 10.8c1.5 2.9 3.9 5.3 6.8 6.8l2.3-2.3c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .5 1 1v3.6c0 .6-.5 1-1 1C9.9 21.3 2.7 14.1 2.7 4.9c0-.6.5-1 1-1H7.2c.6 0 1 .5 1 1 0 1.2.2 2.4.6 3.5.1.3.1.8-.2 1L6.6 10.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsappIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.4A10 10 0 1 0 12 2Zm0 2a8 8 0 0 1 6.9 12.1l-.3.5.7 2.6-2.6-.7-.5.3A8 8 0 1 1 12 4Zm-3 3.5c-.2 0-.5 0-.6.3-.2.3-.7.9-.7 2s.7 2.3 1 2.7c.3.4 1.9 3 4.7 4.1 2.3.9 2.8.7 3.3.7.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.1.1-1.3-.1-.1-.4-.2-.8-.4l-1.9-.9c-.3-.1-.5-.1-.7.1l-.5.6c-.2.2-.4.2-.6.1-.4-.2-1.6-.6-2.7-1.9-.6-.7-1-1.4-1.1-1.7-.1-.2 0-.4.1-.5l.5-.6c.2-.2.2-.4.1-.7L9.6 8c-.1-.3-.3-.5-.6-.5H9Z" />
    </svg>
  );
}

export default function PropertyAgentCard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await mockSendInquiry(name, email, message);
      if (res.success) {
        toast.success("Inquiry sent! The agent will reach out shortly.");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        toast.error(res.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 rounded-[24px] border border-[rgba(89,112,97,0.2)] bg-white p-8">
      <div className="flex items-center gap-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl">
          <Image src="/landing/consultant-avatar.jpg" alt={HOST.name} fill className="object-cover" />
          <span className="absolute bottom-0 right-0 size-6 rounded-full border-4 border-white bg-[#22c55e]" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[1.2px] text-[#be4d00]">Host</p>
          <p className="text-2xl font-bold text-[#00261b]">{HOST.name}</p>
          <p className="text-sm text-[#717974]">{HOST.role}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="agent-name" className="text-sm font-semibold text-[#00261b]">
            Full Name
          </label>
          <input
            id="agent-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            disabled={loading}
            className="rounded-xl border border-[#c0c8c3] px-4 py-3 text-base text-[#0f1621] placeholder:text-[#a3a3a3] focus:outline-none focus:ring-1 focus:ring-[#be4d00] disabled:opacity-70"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="agent-email" className="text-sm font-semibold text-[#00261b]">
            Email Address
          </label>
          <input
            id="agent-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            disabled={loading}
            className="rounded-xl border border-[#c0c8c3] px-4 py-3 text-base text-[#0f1621] placeholder:text-[#a3a3a3] focus:outline-none focus:ring-1 focus:ring-[#be4d00] disabled:opacity-70"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="agent-message" className="text-sm font-semibold text-[#00261b]">
            Message
          </label>
          <textarea
            id="agent-message"
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="I'm interested in viewing this property..."
            disabled={loading}
            className="resize-none rounded-xl border border-[#c0c8c3] px-4 py-3 text-base text-[#0f1621] placeholder:text-[#a3a3a3] focus:outline-none focus:ring-1 focus:ring-[#be4d00] disabled:opacity-70"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#be4d00] px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-[#a54300] disabled:opacity-70"
        >
          {loading ? "Sending…" : "Send Inquiry"}
          {!loading && <SendIcon />}
        </button>

        <div className="grid grid-cols-2 gap-4">
          <a
            href="tel:+233246508595"
            className="flex items-center justify-center gap-2 rounded-xl border border-[#c0c8c3] bg-[#f8fafc] px-4 py-3 text-sm font-semibold text-[#00261b] transition-colors hover:bg-[#eef1f0]"
          >
            <PhoneIcon />
            Call now
          </a>
          <a
            href="https://wa.me/233246508595"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#25d366] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1fb959]"
          >
            <WhatsappIcon />
            Whatsapp
          </a>
        </div>
      </form>
    </div>
  );
}
