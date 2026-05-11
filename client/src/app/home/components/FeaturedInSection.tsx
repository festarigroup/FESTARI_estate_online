type FeaturedLogo = {
  name: string;
};

type FeaturedInSectionProps = {
  title?: string;
  logos?: FeaturedLogo[];
  sectionId?: string;
};

function LogoMark({ name }: { name: string }) {
  // Simple placeholder mark + name (swap with real SVGs later)
  return (
    <div className="flex items-center justify-center gap-2 text-gray-900">
      <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-gray-200">
        <span className="text-[10px] font-black tracking-tight">
          {name.slice(0, 1).toUpperCase()}
        </span>
      </span>
      <span className="text-xs font-semibold">{name}</span>
    </div>
  );
}

export default function FeaturedInSection({
  title = "Featured In",
  logos = [
    { name: "Webflow" },
    { name: "Relume" },
    { name: "Webflow" },
    { name: "Relume" },
    { name: "Webflow" },
    { name: "Relume" },
  ],
  sectionId = "featured-in",
}: FeaturedInSectionProps) {
  return (
    <section id={sectionId} className="w-full bg-white">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-12">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
          {title}
        </h2>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-x-12 gap-y-4">
          {logos.map((logo, idx) => (
            <div
              key={`${logo.name}-${idx}`}
              className="h-12 bg-gray-100 border border-gray-200 flex items-center justify-center"
            >
              <LogoMark name={logo.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

