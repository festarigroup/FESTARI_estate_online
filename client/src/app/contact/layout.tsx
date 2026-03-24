import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Contact | Festari Estate",
  description: "Contact Festari Estate for support or partnership.",
};

export default function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      
      <div className="flex flex-col p-8">
      {/* HERO SECTION */}
      
            <div className="w-full h-screen shadow-sm rounded-lg bg-cover bg-center relative" style={{ backgroundImage: "url('/services.jpg')" }}>
              <div className="p-8 px-32">{children}</div>
              <div className="absolute bottom-8 left-8">
                <h2 className="text-4xl font-bold text-white uppercase">Contact</h2>
              </div>
            </div>
            <p className="mt-12">We're here to assist you with all your real estate needs.
            Reach out to us via phone, email, or our contact form, and we'll
            be happy to help!</p>
            <h2 className="text-5xl font-bold mt-12">Contact Us</h2>
          <div className="mt-12 flex gap-12 items-center">
            {/* LEFT - FORM */}
            <div className="flex-1 space-y-6">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="First name"
                  className="w-1/2 border border-gray-300 p-3 text-sm"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  className="w-1/2 border border-gray-300 p-3 text-sm"
                />
              </div>

              <input
                type="email"
                placeholder="Email"
                className="w-full border border-gray-300 p-3 text-sm"
              />

              <textarea
                placeholder="Type here your message"
                rows={5}
                className="w-full border border-gray-300 p-3 text-sm resize-none"
              ></textarea>

              <button className="bg-[#BE4D00] text-white px-6 py-3 text-sm font-medium hover:bg-[#a63d00]">
                Contact us
              </button>
            </div>

            {/* RIGHT - IMAGE */}
            <div className="flex-1 relative">
              <Image
                src="/support-team.png"
                alt="Support Team"
                width={500}
                height={500}
                className="w-full"
              />

              <div className="absolute top-8 left-8 bg-white px-4 py-2 rounded-full shadow-sm text-sm">
                We are always here to help
              </div>

              <div className="absolute top-16 right-8 bg-white px-4 py-2 rounded-full shadow-sm text-sm">
                Hello There !
              </div>
            </div>
          </div>
        
      {/* GET IN TOUCH SECTION */}
      <div className="mt-20">
        <h2 className="text-5xl font-bold">Get in touch</h2>
        <p className="text-gray-600 mt-3 text-lg">
          Have questions or want to partner with us? We're here to help
        </p>

        <div className="flex gap-12 items-start mt-12">
          {/* LEFT */}
          <div className="flex-1 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📧</span>
                <h3 className="text-xl font-bold">Email</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Send us a message
              </p>
              <p className="text-gray-800 text-sm">
                support@festariestate.com
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📞</span>
                <h3 className="text-xl font-bold">Phone</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Call us during business hours
              </p>
              <p className="text-gray-800 text-sm">
                +233 000 0000
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex-1">
            <Image
              src="/contact-image.jpg"
              alt="Contact"
              width={600}
              height={400}
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
