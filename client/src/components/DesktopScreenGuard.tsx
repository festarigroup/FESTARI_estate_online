"use client";

import { useEffect, useState } from "react";

export default function DesktopScreenGuard({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Check on initial mount
    handleResize();
    
    // Add event listener for real-time resize detection
    window.addEventListener("resize", handleResize);
    
    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent hydration mismatch by returning children without transition classes before mounting
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Mobile Error Guard overlay with fade-in animation */}
      <div 
        className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-gray-50 p-6 text-center transition-all duration-500 ease-in-out ${
          isMobile ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="max-w-md transform transition-all duration-500 translate-y-0 bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 flex flex-col items-center gap-6">
          <div className="rounded-full bg-[#faeedb] p-4 text-[#BE4D00]">
            <svg 
              className="w-12 h-12" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">Desktop Device Required</h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-sm">
            This website is only available on desktop screens. Please switch to a larger device.
          </p>
        </div>
      </div>

      {/* Main Website Content */}
      <div 
        className={`transition-opacity duration-300 min-h-screen ${
          isMobile ? "max-h-screen overflow-hidden opacity-0" : "opacity-100"
        }`}
      >
        {children}
      </div>
    </>
  );
}
