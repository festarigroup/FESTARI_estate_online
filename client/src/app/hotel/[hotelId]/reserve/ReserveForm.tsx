"use client";

import { useState } from "react";
import Image from "next/image";

interface ReserveFormProps {
  numericId: number;
  title: string;
}

export default function ReserveForm({ numericId, title }: ReserveFormProps) {
  const [step, setStep] = useState(1);

  // Step 1 State
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  // Step 1 Validity
  const isStep1Valid = checkIn !== "" && checkOut !== "";

  // Step 2 State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");

  // Step 2 Validity
  const isStep2Valid = firstName !== "" && lastName !== "" && email !== "" && phone !== "" && dob !== "";

  // Step 3 State
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Step 4 State
  const [momoNumber, setMomoNumber] = useState("");
  const [provider, setProvider] = useState("MTN");

  const isStep4Valid = momoNumber.length >= 9;

  // Render Title
  const getTitle = () => {
    switch (step) {
      case 1: return "Select Dates and Guests";
      case 2: return "Primary Guest Details";
      case 3: return "Booking Summary";
      case 4: return "Booking Summary"; // Matches the image
      default: return "Payment";
    }
  };

  return (
    <section className="relative w-full min-h-[calc(100vh-64px)] flex items-center justify-center p-6 py-12 bg-gray-50">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/detailedhotelherosection.jpg"
          alt={title}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-4xl bg-white p-8 md:p-12 shadow-2xl">
        <h1 className="text-3xl md:text-4xl text-center mb-10 font-normal text-gray-900">
          {getTitle()}
        </h1>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Left Sidebar - Stepper */}
          <div className="w-full md:w-[280px] shrink-0 bg-[#FAFAFA] p-6 lg:p-8 rounded-sm">
            <div className="relative">
              {/* Step 1 */}
              <div className="flex items-start gap-4 mb-8 relative">
                <div className="flex flex-col items-center z-10 mt-1">
                  <div className="w-3 h-3 rounded-full bg-[#BE4D00]"></div>
                  <div className={`w-0.5 h-16 absolute top-3 ${step >= 2 ? "bg-[#BE4D00]" : "bg-[#BE4D00]"}`}></div>
                </div>
                <div>
                  <p className="text-gray-800 text-[15px]">Dates and Guests</p>
                  <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4 mb-8 relative">
                <div className="flex flex-col items-center z-10 mt-1">
                  <div className={`w-3 h-3 rounded-full ${step >= 2 ? "bg-[#BE4D00]" : "border-[1.5px] border-gray-200 bg-[#FAFAFA]"}`}></div>
                  <div className={`w-0.5 h-16 absolute top-3 ${step >= 3 ? "bg-[#BE4D00]" : "bg-gray-100"}`}></div>
                </div>
                <div>
                  <p className="text-gray-800 text-[15px]">Guest Details</p>
                  <p className="text-xs text-gray-400 mt-1">Today</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4 mb-8 relative">
                <div className="flex flex-col items-center z-10 mt-1">
                  <div className={`w-3 h-3 rounded-full ${step >= 3 ? "bg-[#BE4D00]" : "border-[1.5px] border-gray-200 bg-[#FAFAFA]"}`}></div>
                  <div className={`w-0.5 h-16 absolute top-3 ${step >= 4 ? "bg-[#BE4D00]" : "bg-gray-100"}`}></div>
                </div>
                <div>
                  <p className="text-gray-800 text-[15px]">Review</p>
                  <p className="text-xs text-gray-400 mt-1">Description</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-4 relative">
                <div className="flex flex-col items-center z-10 mt-1">
                  <div className={`w-3 h-3 rounded-full ${step >= 4 ? "border-[2.5px] border-[#BE4D00] bg-[#FAFAFA]" : "border-[1.5px] border-gray-200 bg-[#FAFAFA]"}`}></div>
                </div>
                <div>
                  <p className="text-gray-800 text-[15px]">Payment</p>
                  <p className="text-xs text-gray-400 mt-1">Description</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Form Fields */}
          <div className="flex-1 pt-2">
            
            {step === 1 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                  <div className="relative">
                    <label className="absolute -top-[9px] left-3 bg-white px-1.5 text-[11px] text-[#BE4D00] z-10">Check-in Date</label>
                    <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full px-4 py-3.5 border border-[#BE4D00] text-gray-900 text-sm focus:outline-none bg-transparent relative z-0" />
                  </div>
                  <div className="relative">
                    <label className="absolute -top-[9px] left-3 bg-white px-1.5 text-[11px] text-gray-400 z-10">Check-out Date</label>
                    <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full px-4 py-3.5 border border-gray-200 text-gray-900 text-sm focus:outline-none bg-transparent relative z-0" />
                  </div>
                  <div className="relative">
                    <label className="absolute -top-[9px] left-3 bg-white px-1.5 text-[11px] text-gray-400 z-10">Number of Guests</label>
                    <div className="relative">
                      <select className="w-full px-4 py-3.5 border border-gray-200 text-gray-900 text-sm focus:outline-none bg-transparent appearance-none relative z-0">
                        <option>2 Guests</option>
                        <option>1 Guest</option>
                        <option>3 Guests</option>
                        <option>4 Guests</option>
                      </select>
                      <svg className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                  <div className="relative">
                    <label className="absolute -top-[9px] left-3 bg-white px-1.5 text-[11px] text-gray-400 z-10">Number of Rooms</label>
                    <div className="relative">
                      <select className="w-full px-4 py-3.5 border border-gray-200 text-gray-900 text-sm focus:outline-none bg-transparent appearance-none relative z-0">
                        <option>1 Room</option>
                        <option>2 Rooms</option>
                        <option>3 Rooms</option>
                      </select>
                      <svg className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                  <div className="relative">
                    <label className="absolute -top-[9px] left-3 bg-white px-1.5 text-[11px] text-gray-400 z-10">Preferred Currency</label>
                    <input type="text" defaultValue="Gh cedis (GHS )" className="w-full px-4 py-3.5 border border-gray-200 text-gray-900 text-sm focus:outline-none bg-transparent relative z-0" />
                  </div>
                  <div className="relative">
                    <label className="absolute -top-[9px] left-3 bg-white px-1.5 text-[11px] text-gray-400 z-10">Promotional code</label>
                    <input type="text" placeholder="Enter promo code" className="w-full px-4 py-3.5 border border-gray-200 text-gray-900 text-sm focus:outline-none bg-transparent relative z-0" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => { if (isStep1Valid) setStep(2); }}
                  disabled={!isStep1Valid}
                  className={`w-full mt-10 py-4 text-[15px] transition-colors text-white ${isStep1Valid ? "bg-[#BE4D00] hover:bg-[#a54300] cursor-pointer" : "bg-[#F2DDD1] cursor-not-allowed"}`}
                >
                  Continue to guest details
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                  <div className="relative">
                    <label className="absolute -top-[9px] left-3 bg-white px-1.5 text-[11px] text-[#BE4D00] z-10">First Name</label>
                    <input type="text" placeholder="Enter first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-3.5 border border-[#BE4D00] text-gray-900 text-sm focus:outline-none bg-transparent relative z-0" />
                  </div>
                  <div className="relative">
                    <label className="absolute -top-[9px] left-3 bg-white px-1.5 text-[11px] text-gray-400 z-10">Last Name</label>
                    <input type="text" placeholder="Enter last name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-3.5 border border-gray-200 text-gray-900 text-sm focus:outline-none bg-transparent relative z-0" />
                  </div>
                  <div className="relative md:col-span-2">
                    <label className="absolute -top-[9px] left-3 bg-white px-1.5 text-[11px] text-gray-400 z-10">Email</label>
                    <input type="email" placeholder="e.g. edwin@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3.5 border border-gray-200 text-gray-900 text-sm focus:outline-none bg-transparent relative z-0" />
                  </div>
                  <div className="relative">
                    <label className="absolute -top-[9px] left-3 bg-white px-1.5 text-[11px] text-gray-400 z-10">Phone Number</label>
                    <input type="tel" placeholder="+233 111 1111" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3.5 border border-gray-200 text-gray-900 text-sm focus:outline-none bg-transparent relative z-0" />
                  </div>
                  <div className="relative">
                    <label className="absolute -top-[9px] left-3 bg-white px-1.5 text-[11px] text-gray-400 z-10">Date of Birth</label>
                    <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full px-4 py-3.5 border border-gray-200 text-gray-900 text-sm focus:outline-none bg-transparent relative z-0" />
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-10">
                  <button type="button" onClick={() => setStep(1)} className="py-4 px-6 text-[15px] border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Back</button>
                  <button
                    type="button"
                    onClick={() => { if (isStep2Valid) setStep(3); }}
                    disabled={!isStep2Valid}
                    className={`flex-1 py-4 text-[15px] transition-colors text-white ${isStep2Valid ? "bg-[#BE4D00] hover:bg-[#a54300] cursor-pointer" : "bg-[#F2DDD1] cursor-not-allowed"}`}
                  >
                    Continue to review details
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                {/* Information Card */}
                <div className="border border-gray-100 rounded-sm p-4 mb-8">
                  <div className="flex gap-4 items-center">
                    <div className="relative w-20 h-20 shrink-0">
                      <Image
                        src="/detailedhotelherosection.jpg"
                        alt={title}
                        fill
                        className="object-cover rounded-sm"
                        sizes="80px"
                      />
                    </div>
                    <div>
                      <h3 className="text-[#BE4D00] text-[15px] font-medium">{title}</h3>
                      <p className="text-xs text-gray-500 mt-1">Start exploring in a new, better way</p>
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 text-xs text-gray-700 border border-gray-100 rounded-sm">
                        <svg className="w-3.5 h-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                        5 Star
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary Table */}
                <div className="space-y-4 text-[15px] pb-6 border-b border-gray-100">
                  <div className="flex justify-between text-gray-600">
                    <span className="text-gray-700">Check-in</span>
                    <span>{checkIn ? new Date(checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Mar, 17, 2026"}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="text-gray-700">Check-out</span>
                    <span>{checkOut ? new Date(checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Mar, 18, 2026"}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="text-gray-700">Guests</span>
                    <span>2</span>
                  </div>
                  <div className="flex justify-between text-gray-600 pb-2 border-b border-gray-100">
                    <span className="text-gray-700">Rooms</span>
                    <span>1</span>
                  </div>
                  <div className="flex justify-between text-gray-600 pt-2">
                    <span className="text-gray-700">Name</span>
                    <span>{firstName && lastName ? `${firstName} ${lastName}` : "Edwin"}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="text-gray-700">Email</span>
                    <span>{email || "edwin@gmail.com"}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 pb-2 border-b border-gray-100">
                    <span className="text-gray-700">Number</span>
                    <span>{phone || "+233 111 11111"}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 pt-2">
                    <span className="text-gray-700">Subtotal</span>
                    <span>2,400.00</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="text-gray-700">Taxes & fees(1%)</span>
                    <span>24.00</span>
                  </div>
                  <div className="flex justify-between text-gray-600 pb-4">
                    <span className="text-gray-700">Service fee (.5%)</span>
                    <span>12.00</span>
                  </div>
                  <div className="flex justify-between text-lg text-gray-900 font-medium">
                    <span>Total</span>
                    <span className="text-[#BE4D00]">2,436.00</span>
                  </div>
                </div>

                <div className="mt-6 flex items-start gap-2 text-sm text-gray-500">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded-sm border-gray-300 text-[#BE4D00] focus:ring-[#BE4D00]"
                  />
                  <label htmlFor="terms">
                    I agree to the company&apos;s <span className="text-[#BE4D00]">Terms</span> and <span className="text-[#BE4D00]">Conditions</span>
                  </label>
                </div>

                <div className="flex items-center gap-4 mt-8">
                  <button type="button" onClick={() => setStep(2)} className="py-4 px-6 text-[15px] border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Back</button>
                  <button
                    type="button"
                    onClick={() => { if (termsAccepted) setStep(4); }}
                    disabled={!termsAccepted}
                    className={`flex-1 py-4 text-[15px] transition-colors text-white ${termsAccepted ? "bg-[#BE4D00] hover:bg-[#a54300] cursor-pointer" : "bg-[#F2DDD1] cursor-not-allowed"}`}
                  >
                    Continue
                  </button>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <div className="space-y-4 mb-10 w-full md:w-3/4">
                  {/* Payment Methods */}
                  <div className="flex items-center gap-4 p-3 bg-gray-100 rounded-sm">
                    <div className="w-8 h-6 bg-[#FFCC00] rounded-[2px] flex items-center justify-center shrink-0">
                      <div className="w-4 h-4 rounded-full bg-[#004C97] flex items-center justify-center">
                        <span className="text-white text-[8px] font-bold">M</span>
                      </div>
                    </div>
                    <span className="text-[15px] text-gray-800">MTN Mobile Money</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-sm cursor-pointer transition-colors">
                    <div className="w-8 h-6 bg-white border border-gray-200 rounded-[2px] flex items-center justify-center shrink-0 text-[#1A1F71] font-bold text-[10px] italic">
                      VISA
                    </div>
                    <span className="text-[15px] text-gray-800">Visa/MasterCard</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-sm cursor-pointer transition-colors">
                    <div className="w-8 h-6 bg-white border border-gray-200 rounded-[2px] flex items-center justify-center shrink-0 font-medium text-[10px]">
                      GPay
                    </div>
                    <span className="text-[15px] text-gray-800">Google pay</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-sm cursor-pointer transition-colors">
                    <div className="w-8 h-6 bg-white border border-gray-200 rounded-[2px] flex items-center justify-center shrink-0 font-medium text-[12px]">
                      Pay
                    </div>
                    <span className="text-[15px] text-gray-800">Apple pay</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-8">
                  <div className="p-3 bg-gray-100 rounded-sm shrink-0">
                    <svg className="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                      <line x1="12" y1="18" x2="12.01" y2="18"></line>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">
                      Enter your mobile money number<br/>and provider to start the payment
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">{email || "email123@gmail.com"}</p>
                    <p className="text-sm text-gray-500 mt-0.5">Pay <span className="text-emerald-500 font-medium">GHS 2,400</span></p>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Mobile Money Number */}
                  <div className="relative">
                    <label className="absolute -top-[9px] left-3 bg-white px-1.5 text-[11px] text-gray-400 z-10">
                      Mobile money number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="024 000 0000"
                        value={momoNumber}
                        onChange={(e) => setMomoNumber(e.target.value)}
                        className="w-full px-4 py-3.5 border border-gray-200 text-gray-900 text-sm focus:outline-none bg-transparent relative z-0"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-4 z-10 overflow-hidden shadow-sm">
                        <div className="h-1/3 bg-[#CE1126]"></div>
                        <div className="h-1/3 bg-[#FCD116] flex items-center justify-center">
                          <svg className="w-1.5 h-1.5 text-black" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        </div>
                        <div className="h-1/3 bg-[#006B3F]"></div>
                      </div>
                    </div>
                  </div>

                  {/* Provider */}
                  <div className="relative">
                    <label className="absolute -top-[9px] left-3 bg-white px-1.5 text-[11px] text-gray-400 z-10">
                      Provider
                    </label>
                    <div className="relative">
                      <select
                        value={provider}
                        onChange={(e) => setProvider(e.target.value)}
                        className="w-full px-4 py-3.5 border border-gray-200 text-gray-900 text-sm focus:outline-none bg-transparent appearance-none relative z-0"
                      >
                        <option>MTN</option>
                        <option>Vodafone</option>
                        <option>AirtelTigo</option>
                      </select>
                      <svg className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setStep(3)} className="py-4 px-6 text-[15px] border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Back</button>
                    <button
                      type="button"
                      onClick={() => { if (isStep4Valid) alert("Payment Successful!"); }}
                      disabled={!isStep4Valid}
                      className={`flex-1 py-4 text-[15px] transition-colors rounded-sm text-white ${isStep4Valid ? "bg-[#BE4D00] hover:bg-[#a54300] cursor-pointer" : "bg-[#F2DDD1] cursor-not-allowed"}`}
                    >
                      Confirm
                    </button>
                  </div>
                  <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed max-w-sm mx-auto">
                    An additional E-levy fee of 1% may apply<br/>to this payment. <a href="#" className="text-[#3b82f6] hover:underline">Learn more.</a>
                  </p>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
