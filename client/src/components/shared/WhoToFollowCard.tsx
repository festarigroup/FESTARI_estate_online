import Image from "next/image";

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
    <div className="flex w-full flex-col gap-4 rounded-2xl border border-[#e6d7ef] bg-white p-3">
      <div className="flex items-center justify-between">
        <p className="text-base font-bold text-gray-700">Who to follow</p>
        <button type="button" className="text-[13px] font-medium text-brand-600">
          View all
        </button>
      </div>
      <ul className="flex flex-col gap-4">
        {PEOPLE.map((person) => (
          <li key={person.name} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="relative block h-16 w-[106px] shrink-0 overflow-hidden rounded-2xl bg-[#eef2ff]">
                {person.avatarPlaceholder ? (
                  <span className="absolute left-1/2 top-1/2 block size-8 -translate-x-1/2 -translate-y-1/2">
                    <Image src="/icons/avatar-placeholder-user.svg" alt="" fill sizes="32px" />
                  </span>
                ) : (
                  <Image src={person.avatar} alt={person.name} fill className="object-cover" sizes="106px" />
                )}
              </span>
              <div className="flex flex-col">
                <p className="text-xs font-bold text-gray-700">{person.name}</p>
                <p className="text-[8px] text-gray-500">{person.role}</p>
              </div>
            </div>
            {person.action === "verified" ? (
              <span className="relative block size-6 shrink-0">
                <Image src="/icons/avatar-verified-3xl-alt.svg" alt="Verified" fill sizes="24px" />
              </span>
            ) : (
              <button
                type="button"
                className="flex h-6 w-[70px] shrink-0 items-center justify-center rounded-lg border border-brand-900 text-xs text-brand-900"
              >
                {person.action}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
