import Link from "next/link";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReturnExchangePortalClient from "./ReturnExchangePortalClient";

export const metadata = {
  title: "Return, Exchange & Refund Policy",
  description: "Official 7-Day Return & Exchange Portal, defect replacement policy, and Consumer Protection (E-Commerce) Rules 2020 compliance for COCOON Artisanal Studio.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF5EE] text-[#2C2623] font-sans selection:bg-[#B06B5B] selection:text-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12 text-left">
        {/* Breadcrumb */}
        <div className="text-xs font-serif text-stone-500 space-x-2">
          <Link href="/" className="hover:text-[#B06B5B] underline">Home</Link>
          <span>/</span>
          <span className="text-stone-800 font-bold">Return &amp; Exchange Policy</span>
        </div>

        {/* Title Header */}
        <div className="space-y-3 border-b border-[#E8DFC9] pb-8">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#B06B5B] block">
            Consumer Protection (E-Commerce) Rules, 2020 Compliant
          </span>
          <h1 className="text-3xl sm:text-5xl font-header font-bold text-[#2C2623] tracking-tight">
            Return, Exchange &amp; Cancellation Policy
          </h1>
          <p className="text-xs text-stone-500 font-serif">
            Effective Date: October 1, 2026 • Last Reviewed &amp; Updated: 2026 • COCOON Artisanal Studio
          </p>
        </div>

        {/* Made-to-Order Slow Craft Principle */}
        <section className="space-y-4 font-serif text-stone-700 leading-relaxed text-sm sm:text-base">
          <p>
            At <strong>COCOON</strong>, we do not operate on factory mass surplus. Each heirloom piece is slow-knitted stitch-by-stitch by lead artisan <strong>Mehak Agarwal</strong> using hypoallergenic, ultra-soft organic milk cotton upon receiving your order.
          </p>
          <p>
            We take immense pride in ensuring every package arrives in pristine, lovingly gift-wrapped condition. If you ever experience transit damage, an incorrect item, or need a wearable size adjustment, our interactive portal below allows you to file an instant request.
          </p>
        </section>

        {/* ================= INTERACTIVE RETURN & EXCHANGE ENGINE PORTAL ================= */}
        <section id="portal" className="scroll-mt-24">
          <Suspense fallback={
            <div className="p-12 text-center bg-white rounded-3xl border border-[#E8DFC9] space-y-3">
              <div className="w-8 h-8 mx-auto border-2 border-[#B06B5B] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-serif text-stone-500">Loading Return &amp; Exchange Request Portal...</p>
            </div>
          }>
            <ReturnExchangePortalClient />
          </Suspense>
        </section>

        {/* ================= POLICY SECTIONS (LEGAL DISCLOSURES) ================= */}

        {/* 1. Cancellation Window */}
        <section className="space-y-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-xs">
          <h2 className="text-xl font-header font-bold text-[#2C2623] flex items-center gap-2">
            <span>1.</span>
            <span>Order Cancellation Window (24 Hours)</span>
          </h2>
          <div className="text-xs sm:text-sm text-stone-700 font-serif space-y-2 leading-relaxed">
            <p>
              You may cancel an order free of charge within <strong>24 hours</strong> of placement:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-stone-600">
              <li>Submit a cancellation request via WhatsApp (<strong>+91 8171902255</strong>) or email <strong>support@gococoon.store</strong> with your Order ID.</li>
              <li>A 100% full refund (including delivery fees) will be processed back to your original source account within <strong>3 to 5 business days</strong> via Razorpay.</li>
              <li>After 24 hours, yarn cutting, color matching, and active slow hand-knitting commence, making subsequent cancellations ineligible.</li>
            </ul>
          </div>
        </section>

        {/* 2. Transit Damage & Replacement Guarantee */}
        <section className="space-y-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-xs">
          <h2 className="text-xl font-header font-bold text-[#2C2623] flex items-center gap-2">
            <span>2.</span>
            <span>7-Day Transit Damage &amp; Defective Delivery Guarantee</span>
          </h2>
          <div className="text-xs sm:text-sm text-stone-700 font-serif space-y-3 leading-relaxed">
            <p>
              Your peace of mind is paramount. If your package arrives damaged during courier transit, has a manufacturing stitch defect, or an incorrect item was delivered:
            </p>
            <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-emerald-950 space-y-2">
              <strong className="block text-xs uppercase tracking-wider text-emerald-900 font-sans">
                ✓ 100% Free Replacement or Full Refund:
              </strong>
              <p className="text-xs">
                Kindly record a short, continuous 360° unboxing video when opening the sealed outer courier package. If any transit tear, crushed box, or wrong product is found, submit your request through the portal above or on WhatsApp within <strong>7 days of delivery</strong>.
              </p>
              <p className="text-xs font-semibold">
                We will immediately expedite a priority hand-crafted replacement at zero extra courier cost, or issue a 100% refund.
              </p>
              <p className="text-[11px] text-stone-600 italic pt-1 border-t border-emerald-200/60">
                <strong>Statutory Protection:</strong> Under the Indian Consumer Protection (E-Commerce) Rules, 2020, if goods delivered are defective, deficient, spurious, or do not match advertised characteristics, consumers have the legal right to full replacement or refund.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Wearable Size Exchange Policy */}
        <section className="space-y-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-xs">
          <h2 className="text-xl font-header font-bold text-[#2C2623] flex items-center gap-2">
            <span>3.</span>
            <span>Size &amp; Fit Exchange Policy for Wearables</span>
          </h2>
          <div className="text-xs sm:text-sm text-stone-700 font-serif space-y-3 leading-relaxed">
            <p>
              We understand that fit is essential. We offer <strong>1 Free Size / Length Exchange</strong> on qualifying catalog wearables:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#EDE5DA] space-y-1">
                <strong className="text-stone-900 font-sans block">Eligible Wearables:</strong>
                <p>Crochet Waist Belts, Hip Scarves, Floral Headscarf Bandanas.</p>
                <p className="text-stone-500 text-[11px]">Must be reported within <strong>7 days of delivery</strong> in unwashed, unworn condition with all tags and original cotton box.</p>
              </div>
              <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#EDE5DA] space-y-1">
                <strong className="text-stone-900 font-sans block">How Size Exchange Works:</strong>
                <p>Submit your desired waist/length measurement in the portal above. Our courier partner will arrange doorstep pickup, and Mehak will prioritize crafting your adjusted piece.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Non-Returnable Items & Statutory Exemptions */}
        <section className="space-y-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-xs">
          <h2 className="text-xl font-header font-bold text-[#2C2623] flex items-center gap-2">
            <span>4.</span>
            <span>Non-Returnable Exceptions (Slow Craft &amp; Hygiene Standards)</span>
          </h2>
          <div className="text-xs sm:text-sm text-stone-700 font-serif space-y-3 leading-relaxed">
            <p>
              In accordance with standard slow-fashion practices and statutory consumer guidelines:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-stone-600">
              <li>
                <strong>Bespoke Custom Personalized Orders:</strong> Items custom-knitted to buyer-specified non-standard measurements, initials, or bespoke colorways are non-returnable once crafted, unless delivered with transit damage.
              </li>
              <li>
                <strong>Hygiene &amp; Hair Accessories:</strong> Hand-crocheted scrunchies and hair ties once unsealed/worn cannot be returned for intimate hygiene reasons, unless received defective upon delivery.
              </li>
              <li>
                <strong>Worn, Altered, or Washed Goods:</strong> Items with perfume scents, makeup smudges, stretched knots from rough handling, or machine-washed pieces.
              </li>
            </ul>
          </div>
        </section>

        {/* 5. Shipping Charges & Refund Timelines */}
        <section className="space-y-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-xs">
          <h2 className="text-xl font-header font-bold text-[#2C2623] flex items-center gap-2">
            <span>5.</span>
            <span>Shipping Fees &amp; Transparent Refund Timelines</span>
          </h2>
          <div className="text-xs sm:text-sm text-stone-700 font-serif space-y-3 leading-relaxed">
            <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 text-amber-950 space-y-1.5">
              <strong className="block text-xs uppercase tracking-wider text-amber-900 font-sans">
                Standard Shipping Policy Across India:
              </strong>
              <p className="text-xs">
                • <strong>Prepaid / Online Orders:</strong> 100% Free Delivery across India.<br />
                • <strong>Orders ₹999 and above:</strong> 100% Free Delivery (Prepaid or COD).<br />
                • <strong>COD Orders under ₹999:</strong> Flat ₹80 standard courier delivery fee.<br />
                • Courier dispatch fees are non-refundable once an order is dispatched, except in cases where a defective or incorrect item was delivered by our studio.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EDE5DA] space-y-1">
                <span className="font-bold text-stone-900 font-sans block">Prepaid Razorpay Refunds:</span>
                <p>Credited back to the original source card, UPI, or NetBanking account within <strong>3 to 5 business days</strong> of approval.</p>
              </div>
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EDE5DA] space-y-1">
                <span className="font-bold text-stone-900 font-sans block">Cash on Delivery (COD) Refunds:</span>
                <p>Disbursed directly to customer&apos;s verified UPI ID or Bank Account via NEFT/IMPS within <strong>5 to 7 business days</strong> of receiving and inspecting returned goods.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Grievance Officer & Statutory Disclosures */}
        <section className="space-y-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-xs">
          <h2 className="text-xl font-header font-bold text-[#2C2623] flex items-center gap-2">
            <span>6.</span>
            <span>Consumer Grievance Officer Disclosures</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-serif leading-relaxed">
            In compliance with Rule 5(9) of the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>, the contact details of the designated Grievance Redressal Officer for COCOON are:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700 font-serif pt-1">
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EDE5DA] space-y-1.5">
              <span className="font-bold text-[#2C2623] block text-sm font-sans">Grievance Redressal Officer:</span>
              <p><strong>Name:</strong> Mehak Agarwal</p>
              <p><strong>Designation:</strong> Founder &amp; Head Artisan / Grievance Officer</p>
              <p><strong>Official Email:</strong> <a href="mailto:support@gococoon.store" className="text-[#B06B5B] underline font-bold">support@gococoon.store</a></p>
              <p><strong>Studio WhatsApp / Helpline:</strong> <a href="https://wa.me/918171902255" className="text-[#B06B5B] underline font-bold">+91 8171902255</a></p>
            </div>
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EDE5DA] space-y-1.5">
              <span className="font-bold text-[#2C2623] block text-sm font-sans">Statutory Resolution Timeline:</span>
              <p><strong>Registered Studio:</strong> Agra, Uttar Pradesh - 282001, India</p>
              <p><strong>Acknowledgment Time:</strong> Within <strong>48 hours</strong> of receipt</p>
              <p><strong>Grievance Resolution:</strong> Within <strong>15 days</strong> (statutory mandate)</p>
              <p><strong>Studio Desk Hours:</strong> Monday – Saturday, 10:00 AM – 7:00 PM IST</p>
            </div>
          </div>
        </section>

        {/* Back Link */}
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
