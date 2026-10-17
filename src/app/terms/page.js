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
              Every COCOON creation is made knot-by-knot using premium hand-selected yarns and artisan fibers (including ultra-soft milk cotton, breathable cotton-linen blends, plush chenille, and durable polyester cord as individually specified on each product listing). Because our pieces are human-crafted without factory automation:
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
              All prices are listed in Indian Rupees (₹ INR) inclusive of all applicable taxes. We accept online payments through our certified Razorpay gateway (UPI, Credit/Debit Cards, NetBanking) and Cash on Delivery:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-stone-600">
              <li><strong>Prepaid Orders:</strong> Processed instantly and securely via Razorpay with 256-bit SSL encryption. We never handle or store your banking credentials.</li>
              <li><strong>COD Policy:</strong> Cash on Delivery orders require mandatory 6-digit email OTP verification before shipment dispatch to ensure authenticity.</li>
              <li><strong>Free Shipping:</strong> Complimentary standard shipping applies to all basket orders of ₹999 and above across India, as well as on all prepaid orders placed online via Razorpay.</li>
              <li><strong>Standard Delivery Fees:</strong> For COD orders under ₹999, a nominal delivery fee applies. Courier dispatch fees incurred are non-refundable once an order is shipped.</li>
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
            These terms are governed by the laws of India. Any legal disputes or claims arising out of the use of this website or orders fulfilled by COCOON shall be subject to the exclusive jurisdiction of the competent courts in Agra, Uttar Pradesh, India.
          </p>
        </section>

        {/* 6. Grievance Officer & Nodal Contact */}
        <section className="space-y-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-xs">
          <h2 className="text-xl font-header font-bold text-[#2C2623]">
            6. Consumer Grievance Redressal & Statutory Disclosures
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-serif leading-relaxed">
            In compliance with the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>, the details of the designated Grievance Officer and our registered atelier are:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700 font-serif pt-1">
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EDE5DA] space-y-1">
              <span className="font-bold text-[#2C2623] block text-sm">Grievance Officer:</span>
              <p><strong>Name:</strong> Mehak Agarwal</p>
              <p><strong>Designation:</strong> Founder & Head Artisan</p>
              <p><strong>Email:</strong> <a href="mailto:support@gococoon.store" className="text-[#B06B5B] underline">support@gococoon.store</a></p>
              <p><strong>WhatsApp / Helpdesk:</strong> <a href="https://wa.me/918171902255" className="text-[#B06B5B] underline">+91 8171902255</a></p>
            </div>
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EDE5DA] space-y-1">
              <span className="font-bold text-[#2C2623] block text-sm">Registered Studio Atelier:</span>
              <p><strong>Brand:</strong> COCOON (GoCocoon)</p>
              <p><strong>Location:</strong> Agra, Uttar Pradesh - 282001, India</p>
              <p><strong>Operating Hours:</strong> Mon - Sat, 10:00 AM - 7:00 PM IST</p>
              <p><strong>Redressal Timeline:</strong> Acknowledged within 48 hours; resolved within 1 month.</p>
            </div>
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
