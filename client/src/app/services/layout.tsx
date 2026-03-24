import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Services | Festari Estate",
  description: "Explore our real estate services.",
};

const serviceCards = [
  {
    icon: "🏠",
    title: "Sell Property",
    description: "Sell your properties with festari Estates",
    buttonText: "List a property",
  },
  {
    icon: "🔨",
    title: "Artisan Services",
    description: "Become and Artisan on my platform",
    buttonText: "Offer your service",
  },
  {
    icon: "⭐",
    title: "Venue Services",
    description: "Find guests on our platform",
    buttonText: "List a venue",
  },
];

const whoItsFFor = [
  "Buyers and Rentals",
  "Landlords and Agents",
  "Artisans and Service Providers",
  "Hotels and Events Managers",
];

const howItWorks = [
  "Create an account",
  "Start using the platform",
];

const propertyListings = [
  {
    id: 1,
    price: "GHS 2,400",
    period: "/month",
    title: "Large 4-room apartment with a beautiful terrace",
    location: "Airport Residential, Accra",
    beds: "King Size Bed",
    persons: "1-2 Persons",
    bath: "Bath1",
  },
  {
    id: 2,
    price: "GHS 2,400",
    period: "/month",
    title: "Large 4-room apartment with a beautiful terrace",
    location: "Airport Residential, Accra",
    beds: "King Size Bed",
    persons: "1-2 Persons",
    bath: "Bath1",
  },
  {
    id: 3,
    price: "GHS 2,400",
    period: "/month",
    title: "Large 4-room apartment with a beautiful terrace",
    location: "Airport Residential, Accra",
    beds: "King Size Bed",
    persons: "1-2 Persons",
    bath: "Bath1",
  },
];

const artisans = [
  {
    id: 1,
    name: "Samuel Ray",
    verified: true,
    rating: 5.0,
    reviews: 4,
    title: "Electrician",
    location: "Tarkwa, Within 10km",
    phone: "0244 000 000",
  },
  {
    id: 2,
    name: "Mr John",
    verified: false,
    rating: 5.0,
    reviews: 4,
    title: "Plumber",
    location: "Tarkwa, Within 10km",
    phone: "0244 000 000",
  },
  {
    id: 3,
    name: "Miss Helina",
    verified: false,
    rating: 5.0,
    reviews: 4,
    title: "Contractor",
    location: "Tarkwa, Within 10km",
    phone: "0244 000 000",
  },
];

const hotels = [
  {
    id: 1,
    price: "GHS 600",
    nights: "/2 nights",
    stars: 2,
    title: "Large 4-room apartment with a beautiful terrace",
    location: "Airport Residential, Accra",
    beds: "King Size Bed",
    persons: "1-2 Persons",
    bath: "Bath1",
  },
  {
    id: 2,
    price: "GHS 600",
    nights: "/2 nights",
    stars: 3,
    title: "Large 4-room apartment with a beautiful terrace",
    location: "Airport Residential, Accra",
    beds: "King Size Bed",
    persons: "1-2 Persons",
    bath: "Bath1",
  },
  {
    id: 3,
    price: "GHS 600",
    nights: "/2 nights",
    stars: 3,
    title: "Large 4-room apartment with a beautiful terrace",
    location: "Airport Residential, Accra",
    beds: "King Size Bed",
    persons: "1-2 Persons",
    bath: "Bath1",
  },
];

const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Property seller",
    text: "I sold my property in three weeks. The platform made it simple and straightforward.",
    rating: 5,
  },
  {
    id: 2,
    name: "James Chen",
    role: "Homeowner",
    text: "Finding the right artisan was effortless. I got three quotes within days.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emma Roberts",
    role: "Venue host",
    text: "My venue bookings doubled since I joined. The platform brings serious clients.",
    rating: 5,
  },
];

const faqs = [
  {
    id: 1,
    icon: "💬",
    question: "What makes this platform different?",
    answer: "We bring together sellers, buyers, artisans, and venue hosters in one place with tools built for each user type.",
  },
  {
    id: 2,
    icon: "📋",
    question: "How long does listing take?",
    answer: "Most listings go live within an hour of submission. You'll receive confirmation once your property is visible to buyers.",
  },
  {
    id: 3,
    icon: "🛡️",
    question: "Are transactions secure?",
    answer: "Yes. All payments are encrypted and processed through secure payment gateways. We never hold your financial information.",
  },
  {
    id: 4,
    icon: "✏️",
    question: "Can I edit my listing later?",
    answer: "Absolutely. Update photos, descriptions, pricing, or availability anytime from your dashboard.",
  },
  {
    id: 5,
    icon: "🔒",
    question: "What about privacy?",
    answer: "Your personal information stays private. We only share what's necessary for transactions and never sell data to third parties.",
  },
  {
    id: 6,
    icon: "🌐",
    question: "Do you offer customer support?",
    answer: "Yes. Email support is available 24/7. Premium users get priority response times and direct phone support.",
  },
];

export default function ServicesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col p-8">
      <div className="w-full h-screen shadow-sm rounded-lg bg-cover bg-center relative" style={{ backgroundImage: "url('/services.jpg')" }}>
        <div className="p-8 px-32">{children}</div>
        <div className="absolute bottom-8 left-8">
          <h2 className="text-4xl font-bold text-white uppercase">Services</h2>
        </div>
      </div>
      <p className="mt-12">Everything to buy, sell, manage, or offer property services—homes, hotels, and trusted artisans, all in one place</p>
      <h2 className="text-5xl font-bold mt-12">Our Services</h2>
      
      <div className="grid grid-cols-3 gap-6 mt-8">
        {serviceCards.map((card) => (
          <div key={card.title} className="border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="text-4xl mb-4">{card.icon}</div>
            <h3 className="text-2xl font-bold mb-2">{card.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{card.description}</p>
            <button className="bg-[#BE4D00] text-white px-4 py-2 text-sm font-medium hover:bg-[#a63d00]">
              {card.buttonText} →
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-5xl font-bold mt-16">Who it's for</h2>
      <div className="mt-6 space-y-4">
        {whoItsFFor.map((item) => (
          <p key={item} className="text-lg text-gray-800">{item}</p>
        ))}
      </div>

      <h2 className="text-5xl font-bold mt-16">How it works</h2>
      <p className="text-[#BE4D00] font-italic mt-4">If I choose a service, what happens next?</p>
      <div className="mt-20 flex gap-12 items-center">
        <div className="flex-1">
          <Image src="/whoweare.png" alt="Who we are" width={500} height={500} className="w-full" />
        </div>
        <div className="flex-1">
          <h2 className="text-5xl font-bold">FESTARI ESTATE</h2>
          <p className="text-[#BE4D00] font-semibold mt-2 tracking-widest">SEARCH. SECURE. SETTLE</p>
          <p className="text-gray-700 mt-6 leading-relaxed">
            Explore properties for sale, hire trusted artisans, and discover venues through one simple, interactive platform.
          </p>
          
          <div className="flex gap-8 mt-8">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏠</span>
              <p className="text-gray-800">Sell Property</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">👨‍🔧</span>
              <p className="text-gray-800">Become Artisan</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">⭐</span>
              <p className="text-gray-800">Venue Services</p>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button className="bg-[#BE4D00] text-white px-6 py-3 font-medium hover:bg-[#a63d00]">
              Browse properties
            </button>
            <button className="border-2 border-[#BE4D00] text-[#BE4D00] px-6 py-3 font-medium hover:bg-[#BE4D00] hover:text-white">
              Become host
            </button>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-5xl font-bold">Property listings</h2>
          <button className="border-2 border-[#BE4D00] text-[#BE4D00] px-6 py-2 font-medium hover:bg-[#BE4D00] hover:text-white">
            View more
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {propertyListings.map((property) => (
            <div key={property.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition">
              <div className="h-64 bg-gray-200 flex items-center justify-center">
                {/* Image placeholder - to be filled later */}
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{property.price}<span className="text-sm text-gray-500">{property.period}</span></p>
                  </div>
                  <button className="text-gray-400 hover:text-red-500">❤️</button>
                </div>

                <p className="text-gray-700 text-sm mb-2">{property.title}</p>
                <p className="text-gray-500 text-xs mb-4">{property.location}</p>

                <div className="flex justify-between items-center text-gray-600 text-xs">
                  <div className="flex items-center gap-1">
                    <span>🛏️</span>
                    <span>{property.beds}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>👤</span>
                    <span>{property.persons}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>🚿</span>
                    <span>{property.bath}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-5xl font-bold">Artisan</h2>
          <button className="border-2 border-[#BE4D00] text-[#BE4D00] px-6 py-2 font-medium hover:bg-[#BE4D00] hover:text-white">
            View more
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {artisans.map((artisan) => (
            <div key={artisan.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition">
              <div className="h-64 bg-gray-200 flex items-center justify-center relative">
                {/* Image placeholder - to be filled later */}
                <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500">❤️</button>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">{artisan.name}</h3>
                      {artisan.verified && <span className="text-green-500">✓</span>}
                    </div>
                    <p className="text-gray-600 text-sm">{artisan.title}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-yellow-500">⭐{artisan.rating}</span>
                  <span className="text-gray-500 text-xs">({artisan.reviews})</span>
                </div>

                <p className="text-gray-600 text-xs mb-1">{artisan.location}</p>
                <p className="text-gray-600 text-xs mb-4">{artisan.phone}</p>

                <div className="flex gap-2">
                  <button className="flex-1 bg-[#BE4D00] text-white px-4 py-2 text-sm font-medium hover:bg-[#a63d00]">
                    Hire Artisan
                  </button>
                  <button className="flex-1 border-2 border-[#BE4D00] text-[#BE4D00] px-4 py-2 text-sm font-medium hover:bg-[#BE4D00] hover:text-white">
                    View profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-5xl font-bold">Hotels/Guesthouse</h2>
          <button className="border-2 border-[#BE4D00] text-[#BE4D00] px-6 py-2 font-medium hover:bg-[#BE4D00] hover:text-white">
            View more
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition">
              <div className="h-64 bg-gray-200 flex items-center justify-center relative">
                {/* Image placeholder - to be filled later */}
                <div className="absolute top-4 left-4 flex items-center gap-1">
                  {[...Array(hotel.stars)].map((_, i) => (
                    <span key={i} className="text-gray-600">★</span>
                  ))}
                </div>
                <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500">❤️</button>
              </div>
              
              <div className="p-4">
                <div className="mb-3">
                  <p className="text-xl font-bold text-gray-900">{hotel.price}<span className="text-sm text-gray-500">{hotel.nights}</span></p>
                </div>

                <p className="text-gray-700 text-sm mb-2">{hotel.title}</p>
                <p className="text-gray-500 text-xs mb-4">{hotel.location}</p>

                <div className="flex justify-between items-center text-gray-600 text-xs">
                  <div className="flex items-center gap-1">
                    <span>🛏️</span>
                    <span>{hotel.beds}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>👤</span>
                    <span>{hotel.persons}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>🚿</span>
                    <span>{hotel.bath}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-5xl font-bold">Real voices</h2>
        <p className="text-gray-600 mt-3 text-lg">Hear from sellers, buyers, artisans, and venue hosters</p>

        <div className="grid grid-cols-3 gap-6 mt-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-100 rounded-lg p-6 border border-gray-200">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-gray-800">★</span>
                ))}
              </div>

              <p className="text-gray-800 italic mb-4">"{testimonial.text}"</p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
                  {/* Avatar placeholder */}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-5xl font-bold">FAQ</h2>
        <p className="text-gray-600 mt-3 text-lg">Quick answers to common questions about using the marketplace</p>

        <div className="grid grid-cols-3 gap-8 mt-8">
          {faqs.map((faq) => (
            <div key={faq.id} className="text-center">
              <div className="text-5xl mb-4">{faq.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.question}</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-700 mb-6">Reach out to our support team anytime</p>
          <button className="bg-[#BE4D00] text-white px-6 py-3 font-medium hover:bg-[#a63d00]">
            Contact
          </button>
        </div>
      </div>

      <div className="mt-20 flex gap-12 items-center">
        <div className="flex-1">
          <h2 className="text-5xl font-bold mb-4">Ready to begin your journey</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Join thousands of users already buying, selling, and building on the platform
          </p>
          <div className="flex gap-4">
            <button className="bg-[#BE4D00] text-white px-6 py-3 font-medium hover:bg-[#a63d00]">
              Join
            </button>
            <button className="border-2 border-[#BE4D00] text-[#BE4D00] px-6 py-3 font-medium hover:bg-[#BE4D00] hover:text-white">
              Learn
            </button>
          </div>
        </div>
        <div className="flex-1">
          <Image src="/journey.jpg" alt="Ready to begin your journey" width={600} height={400} className="w-full rounded-lg" />
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-5xl font-bold mb-4">Get in touch</h2>
        <p className="text-gray-700 mb-6">Have questions or want to partner with us? We're here to help</p>

        <div className="flex gap-12 items-start mt-8">
          <div className="flex-1 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📧</span>
                <h3 className="text-xl font-bold text-gray-900">Email</h3>
              </div>
              <p className="text-gray-700 text-sm">Send us a message</p>
              <p className="text-gray-700 text-sm">support@festariesstate.com</p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📞</span>
                <h3 className="text-xl font-bold text-gray-900">Phone</h3>
              </div>
              <p className="text-gray-700 text-sm">Call us during business hours</p>
              <p className="text-gray-700 text-sm">+233 000 0000</p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📍</span>
                <h3 className="text-xl font-bold text-gray-900">Office</h3>
              </div>
              <p className="text-gray-700 text-sm">Level 5, 123 Pitt Street, Sydney NSW 2000</p>
              <a href="#" className="text-[#BE4D00] text-sm underline">Get directions →</a>
            </div>
          </div>

          <div className="flex-1">
            <Image src="/contact.jpg" alt="Get in touch" width={600} height={400} className="w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
