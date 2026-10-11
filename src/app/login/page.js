"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const [isCustomerSignUp, setIsCustomerSignUp] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
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

    if (isCustomerSignUp) {
      if (!name.trim()) {
        setErrorMsg("Please enter your full name.");
        return;
      }
      if (!phone.trim() || phone.trim().length < 10) {
        setErrorMsg("Please enter a valid 10-digit mobile / WhatsApp number.");
        return;
      }
      if (!email.trim() || !email.includes("@")) {
        setErrorMsg("Please enter a valid email address.");
        return;
      }
    } else {
      if (!identifier.trim()) {
        setErrorMsg("Please enter your email or phone number.");
        return;
      }
    }

    if (!password.trim()) {
      setErrorMsg("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const payload = isCustomerSignUp
        ? { identifier: email.trim(), email: email.trim(), phone: phone.trim(), name: name.trim(), password }
        : { identifier: identifier.trim(), password };

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Authentication failed. Please verify your details.");
        setLoading(false);
        return;
      }

      setSuccessMsg(data.message || (isCustomerSignUp ? "Account created successfully!" : "Signing you in..."));

      if (data.role === "admin") {
        setTimeout(() => {
          router.push(data.redirect || "/admin");
        }, 300);
      } else {
        let existingUser = null;
        try {
          existingUser = JSON.parse(localStorage.getItem("cocoon_customer_user") || "null");
        } catch (e) {}

        const isEmail = (payload.identifier || "").includes("@");
        const customerProfile = {
          name: isCustomerSignUp
            ? name.trim()
            : data.user?.name || existingUser?.name || (isEmail ? payload.identifier.split("@")[0] : "Customer"),
          email: isCustomerSignUp
            ? email.trim().toLowerCase()
            : isEmail ? payload.identifier.toLowerCase() : (data.user?.email || existingUser?.email || ""),
          phone: isCustomerSignUp
            ? phone.trim()
            : !isEmail ? payload.identifier : (data.user?.phone || existingUser?.phone || "")
        };

        // Guarantee phone never contains email
        if (customerProfile.phone && customerProfile.phone.includes("@")) {
          if (!customerProfile.email) customerProfile.email = customerProfile.phone;
          customerProfile.phone = "";
        }

        localStorage.setItem("cocoon_customer_user", JSON.stringify(customerProfile));
        window.dispatchEvent(new Event("cocoon_store_update"));
        setTimeout(() => {
          router.push(redirectPath === "/admin" || redirectPath === "/" ? "/profile" : redirectPath);
        }, 300);
      }
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
          <span>100% Handcrafted by Mehak</span>
          <span className="text-rose-300">•</span>
          <span>Complimentary Organic Cotton Packaging</span>
          <span className="text-rose-300">•</span>
          <span>Bespoke Heirloom Custom Pieces</span>
          <span className="text-rose-300">•</span>
          <span>Free Shipping on Orders Above Rs. 999</span>
          <span className="text-rose-300">•</span>
          <span>Hypoallergenic Premium Milk Cotton</span>
          <span className="text-rose-300">•</span>
          <span>100% Handcrafted by Mehak</span>
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

      {/* 3. HERO EDITORIAL SPLIT SECTION (Properly spaced, rich visual feel) */}
      <main className="flex-1 flex items-center justify-center px-6 sm:px-10 py-4 lg:py-6 relative">
        
        {/* Ambient atmospheric blurred glowing orbs */}
        <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-[#FCEEEA]/75 filter blur-3xl pointer-events-none -z-0"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#EDF3EE]/75 filter blur-3xl pointer-events-none -z-0"></div>

        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* ================= LEFT COLUMN: VINTAGE COTTAGE LOOKBOOK & SCRAPBOOK ================= */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-5 text-left pr-4">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-[#F8E5E1] px-3.5 py-1 rounded-full border border-[#ECCEC7] text-[11px] font-sans font-bold uppercase tracking-[0.25em] text-[#B06B5B] shadow-xs">
                <span>The Artisan Studio</span>
              </div>

              <h2 className="text-3xl xl:text-4xl font-header font-light text-[#2C2623] leading-[1.2]">
                Where slow hands <br />
                <span className="italic font-serif text-[#B06B5B] font-normal">weave timeless stories</span> <br />
                into every knot.
              </h2>

              <p className="text-xs xl:text-sm text-[#2C2623]/75 font-serif max-w-md leading-relaxed font-light">
                Sign in to track your hand-knit treasures, review bespoke studio slips, or oversee heirloom catalog collections directly with Mehak.
              </p>
            </div>

            {/* ARTISAN POLAROID SCRAPBOOK COLLAGE (Full Rich 3-Card Stack) */}
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
                    Heirloom Knit
                  </span>
                </div>
                <div className="text-left space-y-0.5">
                  <h4 className="font-header font-bold text-xs text-stone-900">Sunflower Mini Backpack</h4>
                  <p className="text-[10px] text-stone-500 font-serif">100% Organic Milk Cotton Cord</p>
                </div>
              </div>

              {/* Front Accent Card: Rose Hair Bud Tie */}
              <div className="absolute right-0 bottom-1 z-20 w-32 bg-white p-2 rounded-xl shadow-lg border border-stone-200/80 rotate-[11deg] transform hover:rotate-[6deg] transition duration-300">
                <div className="aspect-square rounded-lg overflow-hidden bg-stone-100 mb-1">
                  <img src="/products/items/rose-ponytail-tie-pink.jpg" alt="Rose Ponytail Tie" className="w-full h-full object-cover" />
                </div>
                <span className="text-[9px] font-bold text-rose-500 block text-center">Petal Keepsake</span>
              </div>

            </div>

            {/* THREE STUDIO ASSURANCES */}
            <div className="flex items-center gap-5 pt-3 border-t border-[#EFE8DD] text-xs font-serif text-stone-600">
              <div className="flex items-center gap-1.5">
                
                <span>Zero Machine Shortcuts</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                
                <span>Hypoallergenic Cotton</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                
                <span>Eco Studio Packaging</span>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: LUXURY SIGN-IN STATIONERY CARD ================= */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-[30px] border border-[#E8DFC9] shadow-2xl p-7 sm:p-8 text-left relative overflow-hidden transition-all">
              
              {/* Subtle vintage lace top accent border */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#ECCEC7] via-[#B06B5B] to-[#ECCEC7]"></div>

              <div className="text-left space-y-2 mb-5">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF4ED] border border-[#ECCEC7]/80 text-[#B06B5B] text-[10px] font-bold uppercase tracking-widest shadow-2xs">
                    <span>Studio Access</span>
                  </div>
                  <span className="text-[11px] font-serif italic text-stone-400">Atelier Sign-In</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-header font-bold text-[#2C2623] tracking-wide">
                  Welcome to Cocoon
                </h1>
                <p className="text-xs font-serif text-stone-500 leading-relaxed font-light">
                  Please enter your credentials to open your atelier portal and view order dispatches.
                </p>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-fadeIn flex items-center gap-2">
                  
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-fadeIn flex items-center gap-2">
                  
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                
                {isCustomerSignUp ? (
                  <>
                    <div className="space-y-1 animate-fadeIn">
                      <label className="text-xs font-bold text-[#2C2623] block">
                        Full Name <span className="text-[#B06B5B]">*</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Puneet Kushwaha"
                        required
                        className="w-full bg-[#FAF8F5] border border-[#DDD3C4] focus:border-[#B06B5B] focus:ring-2 focus:ring-[#B06B5B]/15 rounded-xl px-4 py-2.5 text-xs font-sans focus:outline-none transition shadow-2xs"
                      />
                    </div>

                    <div className="space-y-1 animate-fadeIn">
                      <label className="text-xs font-bold text-[#2C2623] block">
                        Mobile / WhatsApp Number <span className="text-[#B06B5B]">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-stone-500 text-xs font-bold pointer-events-none select-none">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                          placeholder="9876543210"
                          required
                          className="w-full bg-[#FAF8F5] border border-[#DDD3C4] focus:border-[#B06B5B] focus:ring-2 focus:ring-[#B06B5B]/15 rounded-xl pl-12 pr-4 py-2.5 text-xs font-sans focus:outline-none transition shadow-2xs"
                        />
                      </div>
                      <p className="text-[10px] text-stone-500 font-serif">Used for live dispatch tracking & delivery updates.</p>
                    </div>

                    <div className="space-y-1 animate-fadeIn">
                      <label className="text-xs font-bold text-[#2C2623] block">
                        Email Address <span className="text-[#B06B5B]">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          required
                          className="w-full bg-[#FAF8F5] border border-[#DDD3C4] focus:border-[#B06B5B] focus:ring-2 focus:ring-[#B06B5B]/15 rounded-xl px-4 py-2.5 text-xs font-sans focus:outline-none transition shadow-2xs"
                        />
                        <span className="absolute right-3.5 top-3 text-stone-400 pointer-events-none"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#2C2623] block">
                      Email Address or Mobile Number <span className="text-[#B06B5B]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="name@example.com or phone number"
                        required
                        className="w-full bg-[#FAF8F5] border border-[#DDD3C4] focus:border-[#B06B5B] focus:ring-2 focus:ring-[#B06B5B]/15 rounded-xl px-4 py-2.5 text-xs font-sans focus:outline-none transition shadow-2xs"
                      />
                      <span className="absolute right-3.5 top-3 text-stone-400 pointer-events-none"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></span>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#2C2623] block">
                      Password <span className="text-[#B06B5B]">*</span>
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
                      placeholder="••••••••"
                      required
                      className="w-full bg-[#FAF8F5] border border-[#DDD3C4] focus:border-[#B06B5B] focus:ring-2 focus:ring-[#B06B5B]/15 rounded-xl px-4 py-2.5 text-xs font-sans focus:outline-none transition shadow-2xs"
                    />
                    <span className="absolute right-3.5 top-3 text-stone-400 pointer-events-none"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></span>
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
                      <span>{isCustomerSignUp ? "Creating Account..." : "Verifying..."}</span>
                    </span>
                  ) : (
                    <span>{isCustomerSignUp ? "Create Account & Sign In →" : "Sign In →"}</span>
                  )}
                </button>

              </form>

              {/* Bottom toggle between quick shopper entry and registered member */}
              <div className="mt-5 pt-4 border-t border-[#F2ECE1] flex flex-col items-center gap-2 text-xs text-stone-500 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomerSignUp(!isCustomerSignUp);
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="text-[#B06B5B] font-bold hover:underline cursor-pointer"
                >
                  {isCustomerSignUp
                    ? "Already have an account? Sign In"
                    : "New to Cocoon? Create an account with phone number"}
                </button>
                
                <p className="text-[10px] text-stone-400 font-serif">
                  Protected with encrypted session tokens • Mehak's Studio © 2026
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* 4. FOOTER */}
      <footer className="py-4 px-6 text-center text-xs text-stone-500 border-t border-[#EFE8DD] bg-[#FAF8F5] shrink-0 font-serif">
        <p>100% Handcrafted with Pure Milk Cotton • Made-to-Order Studio • WhatsApp: +91 8171902255</p>
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
