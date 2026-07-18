import Image from "next/image";
import Link from "next/link";
import { montserrat } from "../landing-fonts";

const NAVIGATION_LINKS = [
  { label: "Real Estate", href: "/property" },
  { label: "Luxury Hotels", href: "/hotel" },
  { label: "Event Venues", href: "/services" },
  { label: "Artisan Services", href: "/services" },
];

const RESOURCE_LINKS = [
  { label: "Investment Guide", href: "/gallery" },
  { label: "Market Reports", href: "/gallery" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com", icon: "/facebook.png" },
  { label: "Instagram", href: "https://instagram.com", icon: "/instagram.png" },
  { label: "X", href: "https://x.com", icon: "/x.png" },
];

function MailIcon() {
  return (
    <svg width="14" height="11" viewBox="0 0 24 24" fill="none">
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

function PhoneIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
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

function PinIcon() {
  return (
    <svg width="10" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C7.6 2 4 5.6 4 10c0 5.6 6.6 11.3 7 11.6.3.3.7.3 1 0 .4-.3 7-6 7-11.6 0-4.4-3.6-8-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
    </svg>
  );
}

export default function LandingFooter() {
  return (
    <footer className="w-full bg-[#00261b]">
      <div className="mx-auto max-w-[1280px] px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-6">
            <h2 className={`${montserrat.className} text-2xl font-bold text-white`}>FESTARI ESTATES</h2>
            <p className="text-base text-white/80">
              Defining the future of luxury living through a lens of architectural precision and digital innovation.
            </p>
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex size-10 items-center justify-center rounded-full border border-white/20 transition-colors hover:bg-white/10"
                >
                  <Image
                    src={social.icon}
                    alt=""
                    width={14}
                    height={14}
                    className="opacity-80 [filter:brightness(0)_invert(1)]"
                  />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <h4 className="text-sm font-semibold uppercase tracking-[1.4px] text-[#ffe088]">Navigation</h4>
            <ul className="flex flex-col gap-4">
              {NAVIGATION_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-base text-white/80 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-8">
            <h4 className="text-sm font-semibold uppercase tracking-[1.4px] text-[#ffe088]">Resources</h4>
            <ul className="flex flex-col gap-4">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-base text-white/80 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-8">
            <h4 className="text-sm font-semibold uppercase tracking-[1.4px] text-[#ffe088]">Contact</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-center gap-3 text-base text-white/80">
                <MailIcon />
                contact@feoestates.online
              </li>
              <li className="flex items-center gap-3 text-base text-white/80">
                <PhoneIcon />
                +233 (0)24650 8595
              </li>
              <li className="flex items-center gap-3 text-base text-white/80">
                <PinIcon />
                WESTERN, TARKWA
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 text-center text-base tracking-[0.7px] text-white/40">
          © 2026 Festari Estates Online. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
