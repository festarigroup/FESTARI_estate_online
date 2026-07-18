import { montserrat } from "@/app/home/landing-fonts";
import { REVIEWS } from "@/lib/properties";

function StarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="#fed65b">
      <path d="M10 1.5l2.5 5.1 5.6.8-4 3.9.9 5.6L10 14.2l-5 2.7.9-5.6-4-3.9 5.6-.8L10 1.5z" />
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

export default function PropertyReviews() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className={`${montserrat.className} text-2xl font-semibold text-[#00261b]`}>What People Say</h2>
        <div className="flex items-center gap-1.5">
          <StarIcon />
          <span className="text-base font-bold text-[#00261b]">4.9</span>
          <span className="text-sm text-[#717974]">(28 reviews)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {REVIEWS.map((review) => (
          <div key={review.name} className="flex flex-col gap-4 rounded-[24px] border border-[rgba(89,112,97,0.2)] bg-white p-6">
            <div className="flex items-center gap-3">
              <AvatarFallback name={review.name} />
              <div>
                <p className="text-base font-bold text-[#00261b]">{review.name}</p>
                <p className="text-xs text-[#717974]">{review.date}</p>
              </div>
            </div>
            <p className="text-base italic leading-relaxed text-[#717974]">{review.quote}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
