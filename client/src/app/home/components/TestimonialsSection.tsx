import { montserrat } from "../landing-fonts";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  location: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "They tailored their marketing to our estate's specific buyers and closed within three weeks.",
    name: "Sarah Mitchell",
    role: "Property Seller",
    location: "Accra, Ghana",
  },
  {
    quote: "Finding a vetted interior designer was effortless — three quotes within days, no back and forth.",
    name: "James Chen",
    role: "Homeowner",
    location: "London, UK",
  },
  {
    quote: "Our venue bookings doubled since joining. The platform brings serious, qualified clients.",
    name: "Emma Roberts",
    role: "Venue Host",
    location: "Cape Coast, Ghana",
  },
  {
    quote: "Working with the artisan network was a genuinely great experience from first call to handover.",
    name: "Kwame Boateng",
    role: "Artisan Partner",
    location: "Kumasi, Ghana",
  },
];

function QuoteMarkIcon() {
  return (
    <svg width="28" height="22" viewBox="0 0 28 22" fill="none" className="text-[#c0c8c3]">
      <path
        d="M0 22V13.75C0 9.4375 1.1875 6.1875 3.5625 4C5.9375 1.8125 8.75 0.5 12 0V4.5C10 5.125 8.5 6.0625 7.5 7.3125C6.5 8.5625 6 10.0625 6 11.8125H12V22H0ZM16 22V13.75C16 9.4375 17.1875 6.1875 19.5625 4C21.9375 1.8125 24.75 0.5 28 0V4.5C26 5.125 24.5 6.0625 23.5 7.3125C22.5 8.5625 22 10.0625 22 11.8125H28V22H16Z"
        fill="currentColor"
      />
    </svg>
  );
}

function AvatarFallback({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#f6f3f2] text-sm font-bold text-[#be4d00]">
      {initials}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex w-[360px] shrink-0 flex-col gap-6 rounded-2xl bg-white p-8 shadow-[0px_20px_40px_0px_rgba(26,26,26,0.06)]">
      <div className="flex items-center justify-between">
        <AvatarFallback name={testimonial.name} />
        <span className="rounded-full bg-[#f6f3f2] px-3 py-1.5 text-xs font-semibold tracking-[0.7px] text-[#414944]">
          {testimonial.role}
        </span>
      </div>
      <QuoteMarkIcon />
      <p className="min-h-[80px] text-lg font-medium leading-relaxed text-[#00261b]">{testimonial.quote}</p>
      <div>
        <p className="text-sm font-semibold tracking-[0.7px] text-[#00261b]">{testimonial.name}</p>
        <p className="text-sm text-[#717974]">{testimonial.location}</p>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const cards = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section id="testimonials" className="w-full overflow-hidden bg-[#fcf9f8]">
      <div className="mx-auto max-w-[1280px] px-8 py-16 md:py-24">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold uppercase tracking-[1.4px] text-[#be4d00]">Our Reviews</p>
            <h2 className={`${montserrat.className} text-[32px] font-semibold text-[#00261b] md:text-[40px]`}>
              What Our Clients Say
            </h2>
          </div>
          <div className="hidden items-center gap-4 sm:flex" aria-hidden="true">
            <span className="flex size-12 items-center justify-center rounded-full border-2 border-[#c0c8c3] text-[#c0c8c3]">
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
                <path d="M7 1 1 6l6 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="flex size-12 items-center justify-center rounded-full bg-[#be4d00] text-white">
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
                <path d="M1 1l6 5-6 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div className="w-full pb-16 md:pb-24">
        <div className="animate-marquee-slow flex w-max gap-6 px-8 py-4">
          {cards.map((testimonial, i) => (
            <TestimonialCard key={`${testimonial.name}-${i}`} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
