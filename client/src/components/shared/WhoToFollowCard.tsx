import Image from "next/image";
import Link from "next/link";
import { comingSoonHref } from "@/lib/coming-soon";

export interface WhoToFollowPerson {
  name: string;
  role: string;
  avatar: string;
  avatarPlaceholder?: boolean;
  action: "Follow" | "Connect" | "Message" | "verified";
}

const PEOPLE: WhoToFollowPerson[] = [
  { name: "Andy Ansong", role: "Real Estate Consultant", avatar: "/icons/avatar-andy.png", action: "Follow" },
  { name: "Edwin Adu", role: "Sales Agent", avatar: "/icons/avatar-sample.jpg", action: "Connect" },
  { name: "Carlos Ramirez", role: "Software Engineer", avatar: "", avatarPlaceholder: true, action: "verified" },
];

export function WhoToFollowCard() {
  return (
    <div className="flex w-full flex-col gap-[15px] rounded-[15px] border border-[#e6d7ef] bg-white p-[11px]">
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-bold text-gray-700">Who to follow</p>
        <Link href={comingSoonHref("Who to Follow")} className="text-[12.5px] font-medium text-brand-600">
          View all
        </Link>
      </div>
      <ul className="flex flex-col gap-[15px]">
        {PEOPLE.map((person) => (
          <li key={person.name} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="relative block h-[61px] w-[101px] shrink-0 overflow-hidden rounded-2xl bg-[#eef2ff]">
                {person.avatarPlaceholder ? (
                  <span className="absolute left-1/2 top-1/2 block size-[30px] -translate-x-1/2 -translate-y-1/2">
                    <Image src="/icons/avatar-placeholder-user.svg" alt="" fill sizes="30px" />
                  </span>
                ) : (
                  <Image src={person.avatar} alt={person.name} fill className="object-cover" sizes="101px" />
                )}
              </span>
              <div className="flex flex-col">
                <p className="text-[11px] font-bold text-gray-700">{person.name}</p>
                <p className="text-[7.6px] text-gray-500">{person.role}</p>
              </div>
            </div>
            {person.action === "verified" ? (
              <span className="relative block size-[23px] shrink-0">
                <Image src="/icons/avatar-verified-3xl-alt.svg" alt="Verified" fill sizes="23px" />
              </span>
            ) : (
              <Link
                href={comingSoonHref("Connections")}
                className="flex h-[23px] w-[67px] shrink-0 items-center justify-center rounded-lg border border-brand-900 text-[11px] text-brand-900"
              >
                {person.action}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
