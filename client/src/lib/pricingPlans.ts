export type PricingFeature = {
  label: string;
  muted?: boolean;
};

export type PricingPlan = {
  id: string;
  name: string;
  price: number;
  cadence: string;
  features: PricingFeature[];
  cta: string;
  recommended?: boolean;
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "private",
    name: "Private",
    price: 0,
    cadence: "/per month",
    features: [
      { label: "Core access to Global Marketplace" },
      { label: "Basic property search filters" },
      { label: "Community networking access" },
      { label: "No priority support", muted: true },
    ],
    cta: "Get Started",
  },
  {
    id: "estate",
    name: "Estate",
    price: 95,
    cadence: "/per month",
    features: [
      { label: "Featured listing placement" },
      { label: "Priority Artisan booking" },
      { label: "Detailed market analytics & trends" },
      { label: "Dedicated 24/7 client support" },
    ],
    cta: "Secure this tier",
    recommended: true,
  },
  {
    id: "legacy",
    name: "Legacy",
    price: 250,
    cadence: "/per month",
    features: [
      { label: "Concierge Estate Management" },
      { label: "Off-market property access" },
      { label: "White-glove Artisan procurement" },
      { label: "Global networking event invites" },
    ],
    cta: "Contact private sales",
  },
];

export function formatPlanPrice(value: number): string {
  return `GHS ${value.toLocaleString("en-US")}`;
}
