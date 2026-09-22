import { Checkbox } from "@/components/ui/Checkbox";

interface TermsAgreementProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export function TermsAgreement({ id, checked, onChange, error }: TermsAgreementProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm leading-5 tracking-[0.15px] text-ink dark:text-white">
        By selecting &lsquo;I Agree&rsquo; below, I have reviewed and agree to the{" "}
        <span className="text-brand-900 underline underline-offset-2">Terms of Use</span> and
        acknowledged the{" "}
        <span className="text-brand-900 underline underline-offset-2">Privacy Notice</span>. I am
        at least 18 years of age
      </p>

      <div className="flex flex-col gap-2">
        <Checkbox
          id={id}
          label="I agree"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        {error && <p className="text-xs text-[#e73d1c]">{error}</p>}
      </div>
    </div>
  );
}
