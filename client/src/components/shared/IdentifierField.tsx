"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";

type Method = "email" | "phone";

const METHOD_CONFIG: Record<Method, { tab: string; label: string; placeholder: string; type: string }> = {
  email: { tab: "Email", label: "Email Address", placeholder: "Useraccount@gmail.com", type: "email" },
  phone: { tab: "Phone", label: "Phone Number", placeholder: "0208 000 000", type: "tel" },
};

interface IdentifierFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function IdentifierField({ value, onChange }: IdentifierFieldProps) {
  const [method, setMethod] = useState<Method>("email");
  const config = METHOD_CONFIG[method];

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex gap-2">
        {(Object.keys(METHOD_CONFIG) as Method[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setMethod(key)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              method === key ? "bg-brand-900 text-white" : "bg-surface-button text-ink",
            )}
          >
            {METHOD_CONFIG[key].tab}
          </button>
        ))}
      </div>
      <Input
        id="identifier"
        label={config.label}
        type={config.type}
        placeholder={config.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
