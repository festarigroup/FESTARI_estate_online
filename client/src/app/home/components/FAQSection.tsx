import Link from "next/link";

type FAQ = {
  question: string;
  answer: string;
};

type FAQSectionProps = {
  title?: string;
  subtitle?: string;
  faqs?: FAQ[];
  helpTitle?: string;
  helpDescription?: string;
  helpCta?: { label: string; href: string };
  sectionId?: string;
};

export default function FAQSection({
  title = "FAQ",
  subtitle = "Find answers to the questions most people ask about the platform",
  faqs = [
    {
      question: "How do I list a property?",
      answer:
        "Create an account, upload your property details with photos, and set your price. Your listing goes live within hours. Buyers can contact you directly through the platform.",
    },
    {
      question: "Is there a fee to join?",
      answer:
        "No. Joining is free. You only pay when you use premium features like featured listings or advanced analytics. Basic listing and browsing are always free.",
    },
    {
      question: "How are artisans verified?",
      answer:
        "Every artisan goes through background checks and portfolio review before joining. We verify credentials and check references to ensure quality work.",
    },
    {
      question: "Can I book a venue directly?",
      answer:
        "Yes. Browse available venues, check dates and pricing, then book directly through the platform. Payments are secure and handled through our system.",
    },
    {
      question: "What if I have a dispute?",
      answer:
        "Our support team mediates disputes between users. We have a clear resolution process and protect both parties. Most issues are resolved within 48 hours.",
    },
    {
      question: "How do I contact a seller?",
      answer:
        "Use the messaging system on the property listing. You can ask questions, request viewings, or make offers directly without sharing personal contact details.",
    },
  ],
  helpTitle = "Need more help?",
  helpDescription =
    "Our support team is ready to answer any question about the platform",
  helpCta = { label: "Read about us", href: "/about" },
  sectionId = "faq",
}: FAQSectionProps) {
  return (
    <section id={sectionId} className="w-full bg-white">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-12">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
          {title}
        </h2>
        <p className="mt-3 text-sm text-gray-500">{subtitle}</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-10">
          {faqs.map((f) => (
            <div key={f.question}>
              <h3 className="text-sm font-semibold text-gray-900">
                {f.question}
              </h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                {f.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h3 className="text-xl font-extrabold tracking-tight text-gray-900">
            {helpTitle}
          </h3>
          <p className="mt-2 text-sm text-gray-500">{helpDescription}</p>
          <Link
            href={helpCta.href}
            className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-gray-200 bg-gray-50 text-gray-900 text-xs font-semibold
                       hover:bg-gray-100 transition-colors"
          >
            {helpCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}

