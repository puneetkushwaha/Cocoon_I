"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#FAF5EE] border-t border-[#EAE0D2] pt-20 pb-16 sm:pb-20 relative overflow-hidden text-left font-sans mt-20">
      {/* Background Ambience Blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F8E5E1]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#EDF3EE]/50 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Luxury Giant Background Brand Monogram */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center items-end pointer-events-none select-none overflow-hidden z-0 opacity-[0.14] sm:opacity-[0.18] translate-y-[6%]">
        <span className="font-header text-[14vw] font-black tracking-[0.12em] uppercase text-[#B06B5B] leading-none whitespace-nowrap">
          COCOON
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-16 border-b border-[#EAE0D2]">
          
          {/* Column 1: Brand & Heritage */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <h4 className="font-header font-light text-3xl sm:text-4xl text-[#2C2623] tracking-[0.28em] uppercase">
                COCOON
              </h4>
            </div>

            <p className="text-sm text-[#2C2623]/80 font-serif leading-relaxed">
              A gentle sanctuary of handcrafted crochet treasures. Every knot is woven by hand with pure organic milk cotton, creating heirloom pieces of slow, timeless beauty.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs text-[#526B57] font-semibold">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF3EE] border border-[#D5E2D7]">
                <span>Handcrafted with Care</span>
              </span>
              <span>•</span>
              <span className="text-stone-600">All-India Express Dispatch</span>
            </div>

            {/* Online Payment Trust Notice */}
            <div className="pt-1 flex items-center gap-2 text-[11px] text-[#8C827A] font-medium">
              <span className="text-emerald-700 font-bold">100% Secure Online Payment</span>
              <span>•</span>
              <span>UPI, Cards & NetBanking</span>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div className="lg:col-span-2 space-y-3.5">
            <h5 className="font-header font-bold text-base uppercase tracking-wider text-[#2C2623]">
              Categories
            </h5>
            <ul className="space-y-2.5 text-sm text-[#2C2623]/75 font-serif">
              <li>
                <Link href="/#p4-treasures" className="hover:text-[#B06B5B] transition">
                  All Drops
                </Link>
              </li>
              <li>
                <Link href="/#p4-chapters" className="hover:text-[#B06B5B] transition">
                  Handbags & Totes
                </Link>
              </li>
              <li>
                <Link href="/#p4-chapters" className="hover:text-[#B06B5B] transition">
                  Everlasting Flowers
                </Link>
              </li>
              <li>
                <Link href="/#p4-chapters" className="hover:text-[#B06B5B] transition">
                  Wearables & Cardigans
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-[#B06B5B] transition text-rose-600">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-[#B06B5B] transition">
                  Shopping Basket
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Maker's Desk */}
          <div className="lg:col-span-3 space-y-3.5">
            <h5 className="font-header font-bold text-base uppercase tracking-wider text-[#2C2623]">
              Maker's Desk
            </h5>
            <div className="space-y-3 text-sm text-[#2C2623]/80 font-serif">
              <p className="flex items-center gap-2">
                <span className="text-[#526B57] font-sans font-bold">WhatsApp:</span>
                <a href="https://wa.me/918171902255" target="_blank" rel="noreferrer" className="hover:text-[#B06B5B] font-sans font-bold underline underline-offset-2">
                  +91 8171902255
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#B06B5B] font-sans font-bold">Instagram:</span>
                <a href="https://www.instagram.com/cocoon._.u/" target="_blank" rel="noreferrer" className="hover:text-[#B06B5B] font-sans font-bold underline underline-offset-2">
                  @cocoon._.u
                </a>
              </p>
              <div className="p-3 bg-[#FAF2EB] rounded-xl border border-[#EFE4D6] text-xs space-y-1 font-sans text-stone-700">
                <p className="font-bold text-[#2C2623]">Handcrafted Atelier:</p>
                <p>Artisanal Slow-Fashion Studio, India</p>
                <p className="text-[11px] text-stone-500 pt-0.5">Slow-knitted made-to-order treasures. 100% Prepaid Online.</p>
              </div>
            </div>
          </div>

          {/* Column 4: Postcard & Bespoke Updates */}
          <div className="lg:col-span-3 space-y-3.5">
            <h5 className="font-header font-bold text-base uppercase tracking-wider text-[#2C2623]">
              Studio Notes
            </h5>
            <p className="text-sm text-[#2C2623]/75 font-serif leading-relaxed">
              Join our needlework circle for secret drops, yarn stories, and early bespoke collection previews.
            </p>
            
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target;
                const emailInput = form.querySelector('input[type="email"]');
                const email = emailInput?.value?.trim();
                if (email) {
                  try {
                    const { STORE } = await import("@/data/store");
                    STORE.addSubscriber(email);
                    STORE.dispatchEmailNotification("newsletter_signup", { email });
                  } catch (err) {}
                  emailInput.value = "";
                  alert("Welcome to COCOON's needlework circle! A confirmation note has been dispatched to your email.");
                }
              }}
              className="flex items-center gap-2 pt-1"
            >
              <input
                type="email"
                required
                placeholder="Your email address..."
                className="w-full bg-white border border-[#DDD3C4] focus:border-[#B06B5B] rounded-xl px-4 py-3 text-xs focus:outline-none shadow-xs text-stone-800"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-[#B06B5B] hover:bg-[#975647] text-white text-xs uppercase tracking-wider font-bold transition cursor-pointer shrink-0 shadow-xs"
              >
                Join
              </button>
            </form>
            <p className="text-[11px] text-[#2C2623]/55 italic font-serif">Gentle notes only, no spam ever.</p>
          </div>

        </div>

        {/* Compliance & Legal Navigation */}
        <div className="pt-6 pb-4 border-b border-[#EAE0D2]/60 flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2 text-xs text-[#2C2623]/75 font-sans font-medium">
          <Link href="/privacy" className="hover:text-[#B06B5B] transition underline-offset-4 hover:underline">
            Privacy Policy
          </Link>
          <span className="text-[#DDD3C4]">•</span>
          <Link href="/terms" className="hover:text-[#B06B5B] transition underline-offset-4 hover:underline">
            Terms & Conditions
          </Link>
          <span className="text-[#DDD3C4]">•</span>
          <Link href="/refund" className="hover:text-[#B06B5B] transition underline-offset-4 hover:underline">
            Refund & Cancellation Policy
          </Link>
          <span className="text-[#DDD3C4]">•</span>
          <Link href="/cookies" className="hover:text-[#B06B5B] transition underline-offset-4 hover:underline">
            Cookie Policy
          </Link>
        </div>

        <div className="pt-6 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-[#2C2623]/70 font-serif">
          <p>© 2026 COCOON • ALL RIGHTS RESERVED • CRAFTED WITH LOVE & YARN</p>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-xs text-[#B06B5B] hover:text-[#2C2623] transition flex items-center gap-1.5 cursor-pointer font-bold font-sans uppercase tracking-wider"
          >
            <span>↑ Back to Top</span>
          </button>
        </div>

      </div>
    </footer>
  );
}
