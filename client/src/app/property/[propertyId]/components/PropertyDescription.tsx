import { montserrat } from "@/app/home/landing-fonts";
import type { Property } from "@/lib/properties";

export default function PropertyDescription({ property }: { property: Property }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className={`${montserrat.className} text-2xl font-semibold text-[#00261b]`}>Property Description</h2>
      {property.description.map((paragraph, index) => (
        <p key={index} className="text-lg leading-[29px] text-[#0f1621]">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
