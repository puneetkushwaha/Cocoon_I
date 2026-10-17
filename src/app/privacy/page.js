import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy | COCOON Handcrafted Crochet",
  description: "Privacy Policy and DPDP Act 2023 compliance for COCOON Artisanal Studio.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF5EE] text-[#2C2623] font-sans selection:bg-[#B06B5B] selection:text-white">
      <Header />

      <main className="max-w-4xl mx-auto px-6 sm:px-10 py-16 sm:py-24 space-y-12 text-left">
        {/* Breadcrumb */}
        <div className="text-xs font-serif text-stone-500 space-x-2">
          <Link href="/" className="hover:text-[#B06B5B] underline">Home</Link>
          <span>/</span>
          <span className="text-stone-800 font-bold">Privacy Policy</span>
        </div>

        {/* Title Header */}
        <div className="space-y-3 border-b border-[#E8DFC9] pb-8">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#B06B5B] block">
            DPDP Act 2023 & IT Act Compliant
          </span>
          <h1 className="text-3xl sm:text-5xl font-header font-bold text-[#2C2623] tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-stone-500 font-serif">
            Effective Date: October 1, 2026 • Last Updated: October 2026 • COCOON Artisanal Studio
          </p>
        </div>

        {/* Introduction */}
        <section className="space-y-4 font-serif text-stone-700 leading-relaxed text-sm sm:text-base">
          <p>
            Welcome to <strong>COCOON</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;), operated by <strong>Mehak Agarwal</strong> from our atelier in India. We slow-craft made-to-order crochet pieces and deeply respect your personal privacy.
          </p>
          <p>
            This Privacy Policy outlines how we collect, store, utilize, and protect your Personal Identifiable Information (PII) in strict compliance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> and the <strong>Information Technology (IT) Act, 2000</strong> of India.
          </p>
        </section>

        {/* 1. Only Necessary Data Collected */}
        <section className="space-y-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-xs">
          <h2 className="text-xl font-header font-bold text-[#2C2623] flex items-center gap-2">
            <span>1.</span>
            <span>Data Minimization — What We Collect</span>
          </h2>
          <p className="text-sm font-serif text-stone-600 leading-relaxed">
            In accordance with data minimization principles, we only collect the absolute minimum data required to craft, dispatch, and support your orders:
          </p>
          <ul className="list-disc list-inside text-xs sm:text-sm space-y-2 text-stone-700 font-serif pl-2">
            <li><strong>Contact Details:</strong> Your full name, delivery address, postal PIN code, telephone number, and email address.</li>
            <li><strong>Fulfillment & Courier Data:</strong> Delivery location coordinates or GPS pin (only when voluntarily shared for courier routing).</li>
            <li><strong>Payment References:</strong> Transaction identifiers such as UPI UTR numbers or payment gateway transaction IDs. <em>We never store credit card numbers, CVVs, or bank net banking passwords.</em></li>
            <li><strong>Custom Atelier Inputs:</strong> Measurements, color preferences, and reference images voluntarily submitted for bespoke heirlooms.</li>
          </ul>
        </section>

        {/* 2. Purpose of Collection */}
        <section className="space-y-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-xs">
          <h2 className="text-xl font-header font-bold text-[#2C2623] flex items-center gap-2">
            <span>2.</span>
            <span>Purpose of Processing & Legal Basis</span>
          </h2>
          <p className="text-sm font-serif text-stone-600 leading-relaxed">
            Your data is processed strictly for legitimate contractual and service purposes:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700">
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EDE5DA]">
              <strong className="block text-stone-900 mb-1">📦 Order Fulfillment:</strong>
              Hand-knitting your bespoke size, generating shipping labels, and dispatching via our logistics partner (Shiprocket / Delhivery / Xpressbees).
            </div>
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EDE5DA]">
              <strong className="block text-stone-900 mb-1">✉️ Status Notifications:</strong>
              Sending order confirmation emails, COD verification OTPs via Resend, and live AWB tracking links via WhatsApp and email.
            </div>
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EDE5DA]">
              <strong className="block text-stone-900 mb-1">🛡️ Fraud Prevention:</strong>
              Verifying COD email authenticity to avoid delivery failures and protecting buyer transaction safety.
            </div>
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EDE5DA]">
              <strong className="block text-stone-900 mb-1">⚖️ Statutory Compliance:</strong>
              Generating lawful tax receipts, GST / invoicing documentation, and accounting audit trails.
            </div>
          </div>
        </section>

        {/* 3. Third-Party Disclosures */}
        <section className="space-y-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-xs">
          <h2 className="text-xl font-header font-bold text-[#2C2623] flex items-center gap-2">
            <span>3.</span>
            <span>Third-Party Service Providers</span>
          </h2>
          <p className="text-sm font-serif text-stone-600 leading-relaxed">
            We never sell, rent, trade, or monetize your personal information to data brokers or advertising exchanges. Data is only shared with verified infrastructure partners who adhere to enterprise encryption:
          </p>
          <ul className="list-disc list-inside text-xs sm:text-sm space-y-2 text-stone-700 font-serif pl-2">
            <li><strong>Payment Gateway:</strong> Razorpay Software Pvt. Ltd. (PCI-DSS Level 1 compliant gateway processing UPI, Debit/Credit Cards, and NetBanking). We never handle, store, or view your banking passwords or card security codes (CVV).</li>
            <li><strong>Logistics:</strong> Shiprocket (BigFoot Retail Solutions Pvt. Ltd.) & assignees (Delhivery, Xpressbees, Blue Dart) solely to transport the parcel to your doorstep.</li>
            <li><strong>Database & Storage:</strong> Supabase (PostgreSQL with TLS in transit and AES-256 encryption at rest).</li>
            <li><strong>Email Communications:</strong> Resend Inc. for transactional dispatch notices and 6-digit verification codes.</li>
          </ul>
        </section>

        {/* 4. DPDP Act Rights */}
        <section className="space-y-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-xs">
          <h2 className="text-xl font-header font-bold text-[#2C2623] flex items-center gap-2">
            <span>4.</span>
            <span>Your Rights Under DPDP Act 2023</span>
          </h2>
          <p className="text-sm font-serif text-stone-600 leading-relaxed">
            As a data principal under Indian law, you have the following guaranteed rights:
          </p>
          <div className="space-y-2 text-xs sm:text-sm text-stone-700 font-serif">
            <p><strong>Right to Access:</strong> You can view all your orders, stored addresses, and submissions directly in your customer portal (<Link href="/profile" className="text-[#B06B5B] underline">My Profile</Link>).</p>
            <p><strong>Right to Correction:</strong> You may edit your contact numbers or delivery addresses at any time before shipment dispatch.</p>
            <p><strong>Right to Erasure (&ldquo;Right to be Forgotten&rdquo;):</strong> You may email us to permanently delete your customer profile and stored address records, subject to statutory tax retention periods.</p>
            <p><strong>Right to Grievance Redressal:</strong> Dedicated response within 48 hours by our Data Grievance Officer.</p>
          </div>
        </section>

        {/* 5. Grievance Officer & Contact */}
        <section className="space-y-3 bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-[#EDE5DA]">
          <h2 className="text-lg font-header font-bold text-[#2C2623]">
            5. Grievance Officer & Business Details
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-serif leading-relaxed">
            For privacy inquiries, rights requests, or feedback, contact our designated Grievance Officer under Rule 5(9) of the IT (Intermediary Guidelines and Digital Media Ethics Code) Rules and DPDP Act:
          </p>
          <div className="text-xs text-stone-800 space-y-1 font-mono pt-1">
            <p><strong>Attn:</strong> Mehak Agarwal (Founder & Data Controller)</p>
            <p><strong>Brand:</strong> COCOON (GoCocoon)</p>
            <p><strong>Registered Studio:</strong> Agra, Uttar Pradesh - 282001, India</p>
            <p><strong>Email:</strong> <a href="mailto:support@gococoon.store" className="text-[#B06B5B] underline font-bold">support@gococoon.store</a> (Alt: cocoon.by.mehak@gmail.com)</p>
            <p><strong>Studio WhatsApp:</strong> +91 8171902255</p>
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
