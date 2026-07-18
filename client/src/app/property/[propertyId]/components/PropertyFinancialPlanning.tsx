import { montserrat } from "@/app/home/landing-fonts";
import { estimateMonthlyPayment, formatGHS, type Property } from "@/lib/properties";

const INTEREST_RATE = 4.5;
const DOWN_PAYMENT_PERCENT = 20;

export default function PropertyFinancialPlanning({ property }: { property: Property }) {
  const monthlyPayment = estimateMonthlyPayment(property.price);

  return (
    <div className="flex flex-col gap-8 rounded-[24px] border border-[rgba(89,112,97,0.2)] bg-white p-8 md:p-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className={`${montserrat.className} text-2xl font-semibold text-[#00261b]`}>Financial Planning</h2>
        <div className="rounded-full bg-[rgba(66,53,53,0.1)] px-5 py-3 text-right">
          <p className="text-base font-bold text-[#00261b]">{formatGHS(property.price)}</p>
          <p className="text-xs text-[#00261b]/70">Asking Price</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-[#717974]">Estimated Monthly</p>
          <p className="text-[40px] font-bold text-[#fb7933]">{formatGHS(Math.round(monthlyPayment))}</p>
        </div>

        <div className="flex flex-col justify-center gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm font-semibold text-[#00261b]">
              <span>Interest Rate</span>
              <span>{INTEREST_RATE}%</span>
            </div>
            <div className="h-1 w-full rounded-full bg-black/5">
              <div className="h-1 rounded-full bg-[#fb7933]" style={{ width: `${(INTEREST_RATE / 10) * 100}%` }} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm font-semibold text-[#00261b]">
              <span>Down Payment</span>
              <span>{DOWN_PAYMENT_PERCENT}%</span>
            </div>
            <div className="h-1 w-full rounded-full bg-black/5">
              <div className="h-1 rounded-full bg-[#fb7933]" style={{ width: `${(DOWN_PAYMENT_PERCENT / 40) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="flex items-center md:justify-end">
          <button
            type="button"
            className="w-full rounded-xl bg-[#fb7933] px-6 py-4 text-base font-semibold text-[#00261b] transition-colors hover:bg-[#e56a28] md:w-auto"
          >
            Request Full Report
          </button>
        </div>
      </div>
    </div>
  );
}
