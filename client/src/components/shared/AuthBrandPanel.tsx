import Image from "next/image";

const NAV_ROWS = [
  ["Properties", "People", "Projects", "Services"],
  ["Community", "And more"],
];

export function AuthBrandPanel() {
  return (
    <div className="hidden h-full w-full flex-col items-center overflow-hidden rounded-[38px] bg-gradient-to-r from-brand-gradient-from to-brand-gradient-to px-8 py-10 lg:flex">
      <Image src="/brand/hero-illustration.png" alt="Biltlinx" width={132} height={66} priority />

      <div className="flex flex-1 items-center justify-center">
        <h1 className="max-w-md text-center font-display text-[40px] font-semibold leading-[1.1] tracking-[-3.2px] text-white">
          <span className="text-[#cfdddd]">Connecting</span> the Built Environment
        </h1>
      </div>

      <nav aria-label="Site sections" className="flex flex-col items-center gap-2">
        {NAV_ROWS.map((row) => (
          <div key={row.join("-")} className="flex flex-wrap items-center justify-center gap-5">
            {row.map((link, index) => (
              <div key={link} className="flex items-center gap-5">
                {index > 0 && <span className="h-2 w-px rounded-full bg-[#cdced2]" />}
                <span className="whitespace-nowrap font-display text-base font-semibold tracking-[-1.28px] text-white">
                  {link}
                </span>
              </div>
            ))}
          </div>
        ))}
      </nav>
    </div>
  );
}
