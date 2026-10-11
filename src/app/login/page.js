"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!identifier.trim()) {
      setErrorMsg("Please enter your Admin Email address.");
      return;
    }

    if (!password.trim()) {
      setErrorMsg("Please enter your Admin Password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim(), password })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Authentication failed. Incorrect Admin credentials.");
        setLoading(false);
        return;
      }

      setSuccessMsg("Admin authentication verified! Redirecting to Studio Dashboard...");

      setTimeout(() => {
        router.push(data.redirect || redirectPath || "/admin");
      }, 400);
    } catch (err) {
      console.error(err);
      setErrorMsg("Unable to connect. Please check your network connection.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen bg-[#FDFBF7] text-[#2C2623] font-sans antialiased selection:bg-[#F3D5CF] selection:text-[#5B2920] flex flex-col justify-between overflow-x-hidden lg:overflow-hidden relative">
      
      {/* 1. TOP MARQUEE TICKER */}
      <div className="bg-[#221F1F] text-white py-1.5 overflow-hidden whitespace-nowrap text-[11px] font-semibold tracking-wider shrink-0 z-50">
        <div className="animate-marquee inline-flex items-center gap-10">
          <span>COCOON ARTISANAL STUDIO</span>
          <span className="text-rose-300">•</span>
          <span>ADMINISTRATOR & ATELIER PORTAL</span>
          <span className="text-rose-300">•</span>
          <span>AUTHORIZED PERSONNEL ACCESS ONLY</span>
          <span className="text-rose-300">•</span>
          <span>100% SECURE SESSION ENCRYPTION</span>
        </div>
      </div>

      {/* 2. BRAND HEADER */}
      <header className="px-6 sm:px-12 py-4 border-b border-[#EFE8DD] bg-white/80 backdrop-blur-md shrink-0 z-40 flex items-center justify-between">
        <Link href="/" className="group flex items-center select-none py-1 text-left">
          <span className="font-header text-3xl sm:text-4xl font-light tracking-[0.28em] uppercase text-[#231F20] group-hover:text-[#B06B5B] transition-colors duration-300 leading-none">
            COCOON
          </span>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#FAF0ED] text-stone-700 hover:text-[#B06B5B] border border-stone-200/80 text-xs font-bold uppercase tracking-wider transition shadow-2xs"
        >
          <span>&larr;</span>
          <span>Return to Boutique</span>
        </Link>
      </header>

      {/* 3. HERO EDITORIAL SPLIT SECTION */}
      <main className="flex-1 flex items-center justify-center px-6 sm:px-10 py-4 lg:py-6 relative">
        
        {/* Ambient atmospheric blurred glowing orbs */}
        <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-[#FCEEEA]/75 filter blur-3xl pointer-events-none -z-0"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#EDF3EE]/75 filter blur-3xl pointer-events-none -z-0"></div>

        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* ================= LEFT COLUMN: STUDIO SHOWCASE ================= */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-5 text-left pr-4">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-[#F8E5E1] px-3.5 py-1 rounded-full border border-[#ECCEC7] text-[11px] font-sans font-bold uppercase tracking-[0.25em] text-[#B06B5B] shadow-xs">
                <span>Admin Studio Portal</span>
              </div>

              <h2 className="text-3xl xl:text-4xl font-header font-light text-[#2C2623] leading-[1.2]">
                Oversee Slow Craft, <br />
                <span className="italic font-serif text-[#B06B5B] font-normal">Dispatches & Collections</span> <br />
                from one central studio hub.
              </h2>

              <p className="text-xs xl:text-sm text-[#2C2623]/75 font-serif max-w-md leading-relaxed font-light">
                Secure management system for Cocoon Artisanal Studio. Manage live orders, catalog drops, BOGO campaigns, and Shiprocket pickups.
              </p>
            </div>

            {/* ARTISAN POLAROID SCRAPBOOK COLLAGE */}
            <div className="relative h-56 w-full max-w-md flex items-center">
              
              {/* Back Card: Chocolate Bow Handbag */}
              <div className="absolute left-40 -top-2 w-44 bg-white p-2.5 rounded-2xl shadow-xl border border-stone-200/80 rotate-[7deg] transform hover:rotate-[4deg] transition duration-300">
                <div className="aspect-square rounded-xl overflow-hidden bg-stone-100 mb-1.5">
                  <img src="/products/items/chocolate-bow-handbag.jpg" alt="Bow Handbag" className="w-full h-full object-cover" />
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-header font-bold text-stone-900">Bow Handbag</span>
                  <span className="text-[#B06B5B] font-bold">Drop N° 01</span>
                </div>
              </div>

              {/* Main Center Card: Sunflower Granny Backpack */}
              <div className="relative z-10 w-56 bg-white p-3 rounded-3xl shadow-2xl border border-stone-200/90 rotate-[-4deg] transform hover:rotate-0 transition duration-300">
                <div className="aspect-square rounded-2xl overflow-hidden bg-stone-100 mb-2 relative">
                  <img src="/products/items/sunflower-granny-backpack.jpg" alt="Sunflower Backpack" className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                    Studio Management
                  </span>
                </div>
                <div className="text-left space-y-0.5">
                  <h4 className="font-header font-bold text-xs text-stone-900">Sunflower Mini Backpack</h4>
                  <p className="text-[10px] text-stone-500 font-serif">Catalog & Inventory Management</p>
                </div>
              </div>

              {/* Front Accent Card: Rose Hair Bud Tie */}
              <div className="absolute right-0 bottom-1 z-20 w-32 bg-white p-2 rounded-xl shadow-lg border border-stone-200/80 rotate-[11deg] transform hover:rotate-[6deg] transition duration-300">
                <div className="aspect-square rounded-lg overflow-hidden bg-stone-100 mb-1">
                  <img src="/products/items/rose-ponytail-tie-pink.jpg" alt="Rose Ponytail Tie" className="w-full h-full object-cover" />
                </div>
                <span className="text-[9px] font-bold text-rose-500 block text-center">Studio Desk</span>
              </div>

            </div>

            {/* THREE STUDIO ASSURANCES */}
            <div className="flex items-center gap-5 pt-3 border-t border-[#EFE8DD] text-xs font-serif text-stone-600">
              <div className="flex items-center gap-1.5">
                <span>🔐 256-Bit Signed Tokens</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <span>📦 1-Click Shiprocket Dispatch</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <span>✉️ Instant Resend Alert Dispatch</span>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: ADMIN LOGIN STATIONERY CARD ================= */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-[30px] border border-[#E8DFC9] shadow-2xl p-7 sm:p-8 text-left relative overflow-hidden transition-all">
              
              {/* Top Accent line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#ECCEC7] via-[#B06B5B] to-[#ECCEC7]"></div>

              <div className="text-left space-y-2 mb-6">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF4ED] border border-[#ECCEC7]/80 text-[#B06B5B] text-[10px] font-bold uppercase tracking-widest shadow-2xs">
                    <span>👑 Admin Only</span>
                  </div>
                  <span className="text-[11px] font-serif italic text-stone-400">Cocoon Atelier</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-header font-bold text-[#2C2623] tracking-wide">
                  Admin Sign In
                </h1>
                <p className="text-xs font-serif text-stone-500 leading-relaxed font-light">
                  Sign in with your studio administrator credentials to manage orders, products, coupons and dispatches.
                </p>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-fadeIn flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-fadeIn flex items-center gap-2">
                  <span>✅</span>
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#2C2623] block">
                    Admin Email Address <span className="text-[#B06B5B]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="cocoon.by.mehak@gmail.com"
                      required
                      className="w-full bg-[#FAF8F5] border border-[#DDD3C4] focus:border-[#B06B5B] focus:ring-2 focus:ring-[#B06B5B]/15 rounded-xl px-4 py-2.5 text-xs font-sans focus:outline-none transition shadow-2xs"
                    />
                    <span className="absolute right-3.5 top-3 text-stone-400 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#2C2623] block">
                      Admin Password <span className="text-[#B06B5B]">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-stone-400 hover:text-[#B06B5B] transition font-medium cursor-pointer"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full bg-[#FAF8F5] border border-[#DDD3C4] focus:border-[#B06B5B] focus:ring-2 focus:ring-[#B06B5B]/15 rounded-xl px-4 py-2.5 text-xs font-sans focus:outline-none transition shadow-2xs"
                    />
                    <span className="absolute right-3.5 top-3 text-stone-400 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-[#221F1F] hover:bg-[#B06B5B] text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                      <span>Verifying Admin Credentials...</span>
                    </span>
                  ) : (
                    <span>Sign In to Admin Dashboard →</span>
                  )}
                </button>

              </form>

              <div className="mt-6 pt-4 border-t border-[#F2ECE1] text-center text-[11px] text-stone-400 font-serif">
                Protected with encrypted HMAC-SHA256 session tokens • Studio Admin © 2026
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* 4. FOOTER */}
      <footer className="py-4 px-6 text-center text-xs text-stone-500 border-t border-[#EFE8DD] bg-[#FAF8F5] shrink-0 font-serif">
        <p>COCOON Artisanal Studio Management • Agra, Uttar Pradesh</p>
      </footer>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-[#FDFBF7] flex items-center justify-center text-xs font-serif text-stone-500">Loading Cocoon Studio Portal...</div>}>
      <LoginForm />
    </Suspense>
  );
}
