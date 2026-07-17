import Image from "next/image";
import { montserrat } from "../landing-fonts";

function BookingIcon() {
  return (
    <svg width="24" height="27" viewBox="0 0 24 24" fill="none" className="text-[#be4d00]">
      <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 13.5 10 15.5 15 10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VenueIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#be4d00]">
      <path
        d="M12 2l2.6 5.9 6.4.6-4.9 4.3 1.5 6.3L12 15.8l-5.6 3.3 1.5-6.3-4.9-4.3 6.4-.6L12 2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArtisanIcon() {
  return (
    <svg width="27" height="27" viewBox="0 0 24 24" fill="none" className="text-[#be4d00]">
      <path
        d="M14.7 6.3 18 3l3 3-3.3 3.3M14.7 6.3 4 17v3h3L17.7 9.3M14.7 6.3l3 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const SERVICES = [
  {
    icon: <BookingIcon />,
    title: "Seamless Booking",
    description: "Exclusive access to global venues and five-star hotel partnerships for FEO members.",
  },
  {
    icon: <VenueIcon />,
    title: "Venue Services",
    description: "Book venues for weddings, conferences, parties, and special events.",
  },
  {
    icon: <ArtisanIcon />,
    title: "Artisan Network",
    description: "Curated matching with world-class interior designers, landscape architects, and craftsmen.",
  },
];

export default function HolisticServicesSection() {
  return (
    <section id="holistic-services" className="w-full bg-[#f6f3f2]">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-16 px-8 py-16 md:py-24 lg:grid-cols-2 lg:gap-24">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold uppercase tracking-[1.4px] text-[#be4d00]">Services</p>
            <h2 className={`${montserrat.className} text-[32px] font-semibold leading-tight text-[#00261b] md:text-[40px]`}>
              Beyond Real Estate: A Holistic Sanctuary
            </h2>
            <p className="text-lg text-[#414944]">
              Connecting properties, hospitality, venues, and trusted services in one seamless platform.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            {SERVICES.map((service) => (
              <div key={service.title} className="flex items-start gap-6">
                <span className="flex size-[54px] shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  {service.icon}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className={`${montserrat.className} text-2xl font-semibold text-[#00261b]`}>{service.title}</h3>
                  <p className="text-base text-[#414944]">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="relative h-[420px] w-full overflow-hidden rounded-3xl shadow-[0px_20px_40px_0px_rgba(26,26,26,0.08)] md:h-[560px]">
            <Image src="/landing/services-interior.jpg" alt="Holistic estate services" fill className="object-cover" />
          </div>
          <div className="relative -mt-16 ml-4 max-w-[320px] rounded-2xl border border-white/20 bg-[rgba(252,249,248,0.85)] p-8 shadow-xl backdrop-blur-md md:absolute md:bottom-[-40px] md:left-[-40px] md:mt-0">
            <div className="flex items-center gap-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-full border-2 border-white">
                <Image src="/landing/consultant-avatar.jpg" alt="Julianne Vose" fill className="object-cover" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.7px] text-[#00261b]">Julianne Vose</p>
                <p className="text-xs text-[#414944]">Senior Estate Consultant</p>
              </div>
            </div>
            <p className="mt-4 text-base italic text-[#00261b]">
              &ldquo;Our mission is to translate your architectural dreams into enduring legacies.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
