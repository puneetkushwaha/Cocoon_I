"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a cookie choice
    try {
      const consent = localStorage.getItem("cocoon_cookie_consent");
      if (!consent) {
        // Show after a brief delay for smooth entrance
        const timer = setTimeout(() => setShowBanner(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // Ignore localStorage errors in private browsing
    }
  }, []);

  const handleAccept = (type) => {
    try {
      localStorage.setItem("cocoon_cookie_consent", type);
    } catch (e) {}
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <aside
      role="region"
      aria-label="Cookie consent banner"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-fadeIn"
    >
      <div className="bg-[#FAF5EE]/95 backdrop-blur-md border border-[#EAE0D2] shadow-2xl rounded-2xl p-5 sm:p-6 text-[#2C2623] relative">
        <button
          onClick={() => handleAccept("essential")}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 transition p-1"
          aria-label="Close cookie notice"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-[#F4EBE1] border border-[#E5D7C7] flex items-center justify-center shrink-0 text-[#B06B5B]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="space-y-1.5 pr-4">
            <h3 className="font-header font-bold text-sm tracking-wide uppercase text-[#2C2623]">
              Your Privacy & Cookie Choices
            </h3>
            <p className="text-xs text-stone-600 font-serif leading-relaxed">
              We use essential cookies to keep your shopping basket intact and safeguard secure checkout. We respect your digital privacy under India&apos;s DPDP Act 2023.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#EAE0D2]/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 text-xs">
          <Link
            href="/cookies"
            className="text-[11px] text-[#B06B5B] hover:underline font-sans font-medium text-center sm:text-left self-center sm:self-auto"
          >
            Read Cookie Policy →
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAccept("essential")}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl border border-[#DDD3C4] hover:bg-white text-stone-700 font-sans font-semibold text-xs transition cursor-pointer"
            >
              Essential Only
            </button>
            <button
              onClick={() => handleAccept("all")}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#B06B5B] hover:bg-[#975647] text-white font-sans font-bold text-xs transition cursor-pointer shadow-xs"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
