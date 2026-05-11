type GettingStartedStep = {
  title: string;
  description: string;
  icon?: React.ReactNode;
};

type GettingStartedSectionProps = {
  title?: string;
  subtitle?: string;
  steps?: GettingStartedStep[];
  sectionId?: string;
};

function CubeIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-gray-900"
    >
      <path
        d="M12 2 21 7v10l-9 5-9-5V7l9-5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 2v10l9 5M12 12 3 17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function GettingStartedSection({
  title = "How to get started",
  subtitle = "Four straightforward steps to begin your journey",
  steps = [
    {
      title: "Sellers list and\nwait",
      description: "Create your account and upload\nproperty details",
      icon: <CubeIcon />,
    },
    {
      title: "Buyers search and\nfind",
      description: "Browse available properties and\ncontact sellers",
      icon: <CubeIcon />,
    },
    {
      title: "Artisans offer\ntheir skills",
      description: "Set your rates and wait for project\nrequests",
      icon: <CubeIcon />,
    },
    {
      title: "Venue hosters\nshowcase spaces",
      description: "Upload photos and availability for\nbookings",
      icon: <CubeIcon />,
    },
  ],
  sectionId = "getting-started",
}: GettingStartedSectionProps) {
  return (
    <section id={sectionId} className="w-full bg-white">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-4 md:py-5">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
          {title}
        </h2>
        <p className="mt-3 text-sm text-gray-500">{subtitle}</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
          {steps.map((step, idx) => (
            <div
              key={`${step.title}-${idx}`}
              className="bg-gray-100 px-7 py-9 border-y border-white/50 lg:border-y-0 lg:border-x border-white/70"
            >
              <div className="w-10 h-10 rounded bg-white/70 inline-flex items-center justify-center">
                {step.icon ?? <CubeIcon />}
              </div>

              <h3 className="mt-4 text-2xl font-extrabold leading-tight text-gray-900 whitespace-pre-line">
                {step.title}
              </h3>
              <p className="mt-3 text-sm text-gray-400 whitespace-pre-line">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

