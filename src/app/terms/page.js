import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms & Conditions | COCOON Handcrafted Crochet",
  description: "Terms of service, handmade craftsmanship policy, and order guidelines for COCOON Artisanal Studio.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF5EE] text-[#2C2623] font-sans selection:bg-[#B06B5B] selection:text-white">
      <Header />

      <main className="max-w-4xl mx-auto px-6 sm:px-10 py-16 sm:py-24 space-y-12 text-left">
        {/* Breadcrumb */}
        <div className="text-xs font-serif text-stone-500 space-x-2">
          <Link href="/" className="hover:text-[#B06B5B] underline">Home</Link>
          <span>/</span>
          <span className="text-stone-800 font-bold">Terms & Conditions</span>
        </div>

        {/* Title Header */}
        <div className="space-y-3 border-b border-[#E8DFC9] pb-8">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#B06B5B] block">
            Craftsmanship Agreement & Store Terms
          </span>
          <h1 className="text-3xl sm:text-5xl font-header font-bold text-[#2C2623] tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-xs text-stone-500 font-serif">
            Effective Date: October 1, 2026 • COCOON Artisanal Studio
          </p>
        </div>

        {/* Overview */}
        <section className="space-y-4 font-serif text-stone-700 leading-relaxed text-sm sm:text-base">
          <p>
            Welcome to <strong>COCOON</strong>, an independent slow-fashion crochet studio founded by <strong>Mehak Agarwal</strong> in India. By accessing our boutique, placing an order, or requesting custom commissions, you agree to be bound by the terms outlined below.
          </p>
        </section>

        {/* 1. Made-to-Order & Craftsmanship */}
        <section className="space-y-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-xs">
          <h2 className="text-xl font-header font-bold text-[#2C2623]">
            1. Authentic Handcrafted Artistry & Natural Variations
          </h2>
          <div className="text-xs sm:text-sm text-stone-700 font-serif space-y-3 leading-relaxed">
            <p>
              Every COCOON creation is made knot-by-knot using 100% premium organic milk-cotton yarn. Because our pieces are human-crafted without factory automation:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-stone-600">
              <li><strong>Subtle Uniqueness:</strong> Minor variations in knot tension, stitch texture, or millimeter dimensions (±1–2 cm) are the authentic hallmarks of human hands, not defects.</li>
              <li><strong>Color Accuracy:</strong> We photograph pieces in natural studio lighting. Slight tonal differences may occur across individual phone or computer display calibrations.</li>
              <li><strong>Care Requirement:</strong> Hand-wash gently in cold water with mild detergent; dry flat on a clean towel. Machine spinning or tumble drying will alter yarn shape.</li>
            </ul>
          </div>
        </section>

        {/* 2. Order Timelines & Craft Lead Time */}
        <section className="space-y-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-xs">
          <h2 className="text-xl font-header font-bold text-[#2C2623]">
            2. Craft Lead Times & Express Courier Shipping
          </h2>
          <div className="text-xs sm:text-sm text-stone-700 font-serif space-y-3 leading-relaxed">
            <p>
              Because each piece is crafted upon receiving your order:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-stone-600">
              <li><strong>Production Window:</strong> Standard crafting time is <strong>3 to 7 working days</strong> depending on stitch complexity.</li>
              <li><strong>Courier Dispatch:</strong> Once inspected, steamed, and gift-boxed, packages are picked up by our logistics partners (Delhivery, Xpressbees, Blue Dart) from our studio atelier.</li>
              <li><strong>Delivery Transit:</strong> Outstation courier transit takes approximately <strong>3 to 5 business days</strong> across India. Live AWB tracking is provided to you immediately upon pickup.</li>
            </ul>
          </div>
        </section>

        {/* 3. Pricing & Payments */}
        <section className="space-y-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-xs">
          <h2 className="text-xl font-header font-bold text-[#2C2623]">
            3. Pricing, Payments & Cash on Delivery (COD)
          </h2>
          <div className="text-xs sm:text-sm text-stone-700 font-serif space-y-3 leading-relaxed">
            <p>
              All prices are listed in Indian Rupees (₹ INR). We support Direct UPI to Mehak&apos;s verified studio ID (<code>8171902255@ibl</code>), Cards/NetBanking, and Cash on Delivery:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-stone-600">
              <li><strong>UPI Orders:</strong> Verified by matching the 12-digit UTR reference provided upon checkout.</li>
              <li><strong>COD Policy:</strong> Cash on Delivery requires mandatory 6-digit email OTP verification via Resend before dispatch to protect against fraudulent consignments.</li>
              <li><strong>Free Shipping:</strong> Complimentary standard shipping applies to all basket totals of ₹999 and above.</li>
              <li><strong>Non-Refundable Delivery Fees:</strong> Any courier shipping and transit charges incurred during dispatch are strictly non-refundable.</li>
            </ul>
          </div>
        </section>

        {/* 4. Intellectual Property & Image Rights */}
        <section className="space-y-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-xs">
          <h2 className="text-xl font-header font-bold text-[#2C2623]">
            4. Copyright, Photography & Intellectual Property
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-serif leading-relaxed">
            All photography, crochet designs, lookbooks, logos, patterns, and brand text published on this website and our Instagram (<code>@cocoon._.u</code>) are the exclusive intellectual property of <strong>Mehak Agarwal / COCOON</strong>. Unauthorized reproduction, commercial reselling, or digital redistribution without written consent is strictly prohibited under the Indian Copyright Act, 1957.
          </p>
        </section>

        {/* 5. Governing Law */}
        <section className="space-y-3 bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-[#EDE5DA]">
          <h2 className="text-lg font-header font-bold text-[#2C2623]">
            5. Governing Law & Jurisdiction
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-serif leading-relaxed">
            These terms are governed by the laws of India. Any legal disputes or claims arising out of the use of this website or orders fulfilled by COCOON shall be subject to the exclusive jurisdiction of the competent courts of India.
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
