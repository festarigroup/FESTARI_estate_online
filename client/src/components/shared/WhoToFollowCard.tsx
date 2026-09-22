"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { comingSoonHref } from "@/lib/coming-soon";
import { cn } from "@/lib/utils";

export interface WhoToFollowPerson {
  name: string;
  role: string;
  avatar: string;
  avatarPlaceholder?: boolean;
  verified?: boolean;
}

const PEOPLE: WhoToFollowPerson[] = [
  { name: "Andy Ansong", role: "Real Estate Consultant", avatar: "/icons/avatar-andy.png", verified: true },
  { name: "Edwin Adu", role: "Sales Agent", avatar: "/icons/avatar-sample.jpg", verified: true },
  { name: "Carlos Ramirez", role: "Software Engineer", avatar: "", avatarPlaceholder: true, verified: true },
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
              <span className="relative block h-[61px] w-[101px] shrink-0">
                <span className="relative block size-full overflow-hidden rounded-2xl bg-[#eef2ff]">
                  {person.avatarPlaceholder ? (
                    <span className="absolute left-1/2 top-1/2 block size-[30px] -translate-x-1/2 -translate-y-1/2">
                      <Image src="/icons/avatar-placeholder-user.svg" alt="" fill sizes="30px" />
                    </span>
                  ) : (
                    <Image src={person.avatar} alt={person.name} fill className="object-cover" sizes="101px" />
                  )}
                </span>
                {person.verified && (
                  <span className="absolute -bottom-1 -right-1 block size-[15px]">
                    <Image src="/icons/avatar-verified-3xl-alt.svg" alt="Verified" fill sizes="15px" />
                  </span>
                )}
              </span>
              <div className="flex flex-col">
                <p className="text-[11px] font-bold text-gray-700">{person.name}</p>
                <p className="text-[7.6px] text-gray-500">{person.role}</p>
              </div>
            </div>
            <FollowButton name={person.name} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function FollowButton({ name }: { name: string }) {
  const [following, setFollowing] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setFollowing((v) => !v)}
      aria-pressed={following}
      aria-label={following ? `Unfollow ${name}` : `Follow ${name}`}
      className={cn(
        "flex h-[23px] w-[67px] shrink-0 items-center justify-center rounded-lg border text-[11px] transition-colors",
        following
          ? "border-brand-900 bg-brand-900 text-white hover:bg-brand-900/90"
          : "border-brand-900 bg-white text-brand-900 hover:bg-brand-900/5",
      )}
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}
