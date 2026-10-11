import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Cookies Policy | COCOON Handcrafted Crochet",
  description: "Learn how COCOON uses essential and functional cookies to preserve your basket and secure checkout.",
};

export default function CookiesPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF5EE] text-[#2C2623] font-sans selection:bg-[#B06B5B] selection:text-white">
      <Header />

      <main className="max-w-4xl mx-auto px-6 sm:px-10 py-16 sm:py-24 space-y-12 text-left">
        {/* Breadcrumb */}
        <div className="text-xs font-serif text-stone-500 space-x-2">
          <Link href="/" className="hover:text-[#B06B5B] underline">Home</Link>
          <span>/</span>
          <span className="text-stone-800 font-bold">Cookies Policy</span>
        </div>

        {/* Title Header */}
        <div className="space-y-3 border-b border-[#E8DFC9] pb-8">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#B06B5B] block">
            Transparent Data Storage
          </span>
          <h1 className="text-3xl sm:text-5xl font-header font-bold text-[#2C2623] tracking-tight">
            Cookies Policy
          </h1>
          <p className="text-xs text-stone-500 font-serif">
            Effective Date: October 1, 2026 • COCOON Artisanal Studio
          </p>
        </div>

        {/* Overview */}
        <section className="space-y-4 font-serif text-stone-700 leading-relaxed text-sm sm:text-base">
          <p>
            This Cookie Policy explains how <strong>COCOON</strong> uses cookies and local browser storage to enable seamless shopping on our handcrafted crochet boutique.
          </p>
          <p>
            <strong>Our Pledge:</strong> We do NOT use invasive third-party cross-site behavioral tracking cookies or sell your browsing history.
          </p>
        </section>

        {/* 1. Types of Cookies Used */}
        <section className="space-y-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-xs">
          <h2 className="text-xl font-header font-bold text-[#2C2623]">
            1. Categories of Cookies We Use
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-stone-700 font-serif">
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EDE5DA]">
              <strong className="block text-stone-900 text-sm mb-1">
                🔒 Strictly Essential &amp; Security Cookies
              </strong>
              <p className="text-stone-600">
                Required for our boutique to function. These maintain your active session token (<code>cocoon_session</code>), secure admin HMAC authentication, and guard against cross-site request forgery (CSRF).
              </p>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EDE5DA]">
              <strong className="block text-stone-900 text-sm mb-1">
                🛍️ Functional &amp; Cart State Storage
              </strong>
              <p className="text-stone-600">
                Preserves items in your shopping basket (<code>cocoon_temp_cart</code>), saved delivery addresses, applied coupons, and sound/theme preferences so you don&apos;t lose items when switching pages.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Managing Your Preferences */}
        <section className="space-y-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-xs">
          <h2 className="text-xl font-header font-bold text-[#2C2623]">
            2. Managing &amp; Clearing Cookies
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-serif leading-relaxed">
            You can configure your browser (Chrome, Safari, Edge, Firefox) to block or delete cookies at any time via your browser settings. Please note that disabling essential cookies may prevent items from remaining in your basket during checkout.
          </p>
        </section>

        <div className="pt-4 text-center">
          <Link
            href="/"
            className="inline-block px-8 py-3.5 rounded-full bg-[#2C2623] hover:bg-[#B06B5B] text-white text-xs uppercase tracking-widest font-bold transition shadow-xs"
          >
            &larr; Return to COCOON Boutique
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
