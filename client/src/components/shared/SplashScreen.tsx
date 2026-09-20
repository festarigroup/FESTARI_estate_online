import Image from "next/image";

const NAV_ROWS = [
  ["Properties", "People", "Projects", "Services"],
  ["Community", "And more"],
];

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10M8.5 3.5 13 8l-4.5 4.5"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronsRightIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2.00012 6L8.00037 12.0002L1.99658 18.004M8.99963 6L14.9999 12.0002L8.99609 18.004M15.9996 6L21.9999 12.0002L15.9961 18.004"
        stroke="#CBD5E0"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface SplashScreenProps {
  onGetStarted: () => void;
}

export function SplashScreen({ onGetStarted }: SplashScreenProps) {
  return (
    <div className="flex h-screen w-full flex-col gap-3 bg-white p-4">
      <div className="relative flex flex-1 flex-col overflow-hidden rounded-[38px] bg-gradient-to-r from-brand-gradient-from to-brand-gradient-to px-6 pb-8 pt-8">
        <Image src="/brand/hero-illustration.png" alt="Biltlinx" width={80} height={40} priority />

        <div className="flex flex-1 flex-col justify-end gap-3 pb-10">
          <h1 className="font-display text-[40px] font-semibold leading-[1.05] tracking-[-0.94px] text-white">
            <span className="text-[#cfdddd]">Connecting</span> the Built Environment
          </h1>
          <p className="max-w-[280px] text-[13px] leading-[1.23] tracking-[-0.39px] text-[#f8fafc]">
            Where people, places, and possibilities come together.
          </p>
        </div>

        <nav aria-label="Site sections" className="flex flex-col items-center gap-2 pb-2">
          {NAV_ROWS.map((row) => (
            <div key={row.join("-")} className="flex flex-wrap items-center justify-center gap-2">
              {row.map((link, index) => (
                <div key={link} className="flex items-center gap-2">
                  {index > 0 && <span className="h-2 w-px rounded-full bg-[#cdced2]" />}
                  <span className="whitespace-nowrap font-display text-sm font-semibold tracking-[-1.12px] text-white">
                    {link}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </nav>
      </div>

      <button
        type="button"
        onClick={onGetStarted}
        className="flex shrink-0 items-center justify-between rounded-full border border-muted-300 bg-[#f1f5f9] p-2.5"
      >
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-900">
          <ArrowRightIcon />
        </span>
        <span className="font-display text-lg font-medium tracking-[-0.44px] text-muted-300">
          Get Started
        </span>
        <ChevronsRightIcon />
      </button>
    </div>
  );
}
