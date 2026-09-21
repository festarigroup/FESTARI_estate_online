import Image from "next/image";

interface TrendingProperty {
  title: string;
  location: string;
  price: string;
  likes: number;
  image: string;
}

const PROPERTIES: TrendingProperty[] = [
  {
    title: "5 Bedroom House",
    location: "East Legon, Accra",
    price: "GHS 6,500,000",
    likes: 200,
    image: "/images/trending-property-1.jpg",
  },
  {
    title: "3 Bedroom Apartment",
    location: "Airport Residential Area",
    price: "GHS 3,500 / month",
    likes: 190,
    image: "/images/trending-property-2.jpg",
  },
  {
    title: "Land for sale",
    location: "Trassaco Valley, Accra",
    price: "GHS 500,000",
    likes: 214,
    image: "/images/trending-property-3.jpg",
  },
];

export function TrendingPropertiesCard() {
  return (
    <div className="flex w-full flex-col gap-[15px] rounded-[15px] border border-[#e6d7ef] bg-white p-[11px]">
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-bold text-gray-700">Trending Properties</p>
        <button type="button" className="text-[12.5px] font-medium text-brand-600">
          View all
        </button>
      </div>
      <ul className="flex flex-col gap-[15px]">
        {PROPERTIES.map((property) => (
          <li key={property.title} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="relative block h-[61px] w-[101px] shrink-0 overflow-hidden rounded-2xl">
                <Image src={property.image} alt={property.title} fill className="object-cover" sizes="101px" />
              </span>
              <div className="flex flex-col gap-0.5">
                <p className="text-[11px] font-bold text-gray-700">{property.title}</p>
                <p className="text-[8.5px] text-gray-500">{property.location}</p>
                <p className="text-[9.5px] font-bold text-gray-700">{property.price}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <span className="relative block size-[13px]">
                <Image src="/icons/heart-like.svg" alt="" fill sizes="13px" />
              </span>
              <span className="text-[9.5px] font-bold text-brand-900">{property.likes}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
