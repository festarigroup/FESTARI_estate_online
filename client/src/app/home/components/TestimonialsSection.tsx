type Testimonial = {
  quote: string;
  name: string;
  role: string;
  rating?: number; // 0-5
};

type TestimonialsSectionProps = {
  title?: string;
  subtitle?: string;
  testimonials?: Testimonial[];
  sectionId?: string;
};

function Stars({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex items-center gap-1 text-gray-900">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="w-3 h-3"
          viewBox="0 0 20 20"
          fill={i < rating ? "#111827" : "#E5E7EB"}
          aria-hidden="true"
        >
          <path d="M10 1.5l2.5 5.1 5.6.8-4 3.9.9 5.6L10 14.2 5 16.9l.9-5.6-4-3.9 5.6-.8L10 1.5z" />
        </svg>
      ))}
    </div>
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
    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-700">
      {initials}
    </div>
  );
}

export default function TestimonialsSection({
  title = "Real voices",
  subtitle = "Hear from sellers, buyers, artisans, and venue hosters",
  testimonials = [
    {
      quote:
        '"I sold my property in three weeks. The platform made it simple and straightforward."',
      name: "Sarah Mitchell",
      role: "Property seller",
      rating: 5,
    },
    {
      quote:
        '"Finding the right artisan was effortless. I got three quotes within days."',
      name: "James Chen",
      role: "Homeowner",
      rating: 5,
    },
    {
      quote:
        '"My venue bookings doubled since I joined. The platform brings serious clients."',
      name: "Emma Roberts",
      role: "Venue host",
      rating: 5,
    },
  ],
  sectionId = "testimonials",
}: TestimonialsSectionProps) {
  return (
    <section id={sectionId} className="w-full bg-white">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-12">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
          {title}
        </h2>
        <p className="mt-3 text-sm text-gray-500">{subtitle}</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-gray-100 border border-gray-200 p-6"
            >
              <Stars rating={t.rating ?? 5} />
              <p className="mt-4 text-sm text-gray-800 leading-relaxed">
                {t.quote}
              </p>

              <div className="mt-5 flex items-center gap-3">
                <AvatarFallback name={t.name} />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-[11px] text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

