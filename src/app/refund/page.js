import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Refund & Cancellation Policy | COCOON Handcrafted Crochet",
  description: "Transparent returns, transit replacement, and cancellation guidelines for COCOON Artisanal Studio.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF5EE] text-[#2C2623] font-sans selection:bg-[#B06B5B] selection:text-white">
      <Header />

      <main className="max-w-4xl mx-auto px-6 sm:px-10 py-16 sm:py-24 space-y-12 text-left">
        {/* Breadcrumb */}
        <div className="text-xs font-serif text-stone-500 space-x-2">
          <Link href="/" className="hover:text-[#B06B5B] underline">Home</Link>
          <span>/</span>
          <span className="text-stone-800 font-bold">Refund Policy</span>
        </div>

        {/* Title Header */}
        <div className="space-y-3 border-b border-[#E8DFC9] pb-8">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#B06B5B] block">
            Consumer Protection & Slow Craft Integrity
          </span>
          <h1 className="text-3xl sm:text-5xl font-header font-bold text-[#2C2623] tracking-tight">
            Refund & Cancellation Policy
          </h1>
          <p className="text-xs text-stone-500 font-serif">
            Effective Date: October 1, 2026 • COCOON Artisanal Studio
          </p>
        </div>

        {/* Made-to-Order Principle */}
        <section className="space-y-4 font-serif text-stone-700 leading-relaxed text-sm sm:text-base">
          <p>
            At <strong>COCOON</strong>, we do not operate on mass factory surplus. Each piece is slow-knitted stitch by stitch by <strong>Mehak Agarwal</strong> specifically for you upon receiving your order.
          </p>
          <p>
            We take immense pride in ensuring every treasure arrives in pristine, lovingly gift-wrapped condition. Please review our fair, transparent policies below.
          </p>
        </section>

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
              <li>Contact our studio on WhatsApp (<strong>+91 8171902255</strong>) or email <strong>cocoon.by.mehak@gmail.com</strong> with your Order ID.</li>
              <li>A 100% full refund will be processed back to your original source account within <strong>3 to 5 business days</strong>.</li>
              <li>After 24 hours, yarn selection, sizing, and active hand-knitting commence, making subsequent cancellations ineligible.</li>
            </ul>
          </div>
        </section>

        {/* 2. Transit Damage & Replacement */}
        <section className="space-y-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-xs">
          <h2 className="text-xl font-header font-bold text-[#2C2623] flex items-center gap-2">
            <span>2.</span>
            <span>Transit Damage or Defective Delivery Guarantee</span>
          </h2>
          <div className="text-xs sm:text-sm text-stone-700 font-serif space-y-3 leading-relaxed">
            <p>
              Your peace of mind is paramount. If your package arrives damaged in courier transit or an incorrect item was delivered:
            </p>
            <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-emerald-950 space-y-2">
              <strong className="block text-xs uppercase tracking-wider text-emerald-900">
                ✓ 100% Free Replacement or Full Refund:
              </strong>
              <p className="text-xs">
                Kindly record a short, continuous 360° unboxing video when opening the sealed outer box. If any transit tear or wrong product is found, share the video clip with us on WhatsApp within <strong>48 hours of delivery</strong>.
              </p>
              <p className="text-xs font-semibold">
                We will immediately expedite a priority hand-crafted replacement at zero extra cost, or issue a 100% refund.
              </p>
              <p className="text-[11px] text-stone-600 italic pt-1 border-t border-emerald-200/60">
                <strong>Statutory Protections:</strong> In accordance with the Consumer Protection (E-Commerce) Rules, 2020, if an item received is defective, deficient, or materially diverges from listed specifications, you are entitled to full replacement or refund. We will never unreasonably deny genuine consumer grievances.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Non-Refundable Delivery Fee & Return Policy */}
        <section className="space-y-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-xs">
          <h2 className="text-xl font-header font-bold text-[#2C2623] flex items-center gap-2">
            <span>3.</span>
            <span>Non-Refundable Shipping & Delivery Fees</span>
          </h2>
          <div className="text-xs sm:text-sm text-stone-700 font-serif space-y-3 leading-relaxed">
            <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 text-amber-950 space-y-1.5">
              <strong className="block text-xs uppercase tracking-wider text-amber-900 font-sans">
                ⚠️ Delivery Charges Notice:
              </strong>
              <p className="text-xs">
                Please note that all <strong>shipping and delivery fees are strictly non-refundable</strong> under all circumstances once an order has been dispatched from our studio.
              </p>
              <p className="text-xs text-amber-900/90">
                In the event of an approved product return or refund, only the product value (excluding courier logistics and freight charges) will be refunded to your original payment method.
              </p>
            </div>
            
            <p className="pt-2 font-bold text-[#2C2623]">Additional Non-Returnable Exceptions:</p>
            <p>Due to hygiene and personalized craftsmanship, returns are not accepted for:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-stone-600">
              <li>Wearables that have been worn, washed, or altered after delivery.</li>
              <li>Items damaged due to rough handling, snags on jewelry, or machine washing.</li>
              <li>Personalized heirloom orders crafted to custom sizing, monograms, or non-standard color palettes.</li>
            </ul>
          </div>
        </section>

        {/* 4. How to Request */}
        <section className="space-y-3 bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-[#EDE5DA]">
          <h2 className="text-lg font-header font-bold text-[#2C2623]">
            4. How to Initiate Support or Refund
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-serif leading-relaxed">
            For any queries, exchanges, or assistance, message our studio team directly:
          </p>
          <div className="text-xs text-stone-800 space-y-1 font-mono pt-1">
            <p><strong>Studio WhatsApp:</strong> <a href="https://wa.me/918171902255" className="text-[#B06B5B] underline">+91 8171902255</a> (10 AM – 7 PM IST)</p>
            <p><strong>Official Email:</strong> <a href="mailto:support@gococoon.store" className="text-[#B06B5B] underline">support@gococoon.store</a> (Alt: cocoon.by.mehak@gmail.com)</p>
            <p><strong>Registered Atelier:</strong> Agra, Uttar Pradesh - 282001, India</p>
            <p><strong>Grievance Officer:</strong> Mehak Agarwal</p>
          </div>
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
