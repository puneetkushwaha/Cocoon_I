import Link from "next/link";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Order Confirmed | Cocoon Handcrafted Crochet",
  description: "Thank you for your order at Cocoon. Your handcrafted slow-fashion treasures are being prepared with love.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function OrderConfirmationPage({ searchParams }) {
  const params = await searchParams;
  const orderId = params?.orderId || params?.order_id || `ORD-CNF-${Date.now().toString().slice(-6)}`;
  const email = params?.email || "customer@gococoon.store";
  const customerName = params?.name || "Cherished Customer";
  const amount = params?.amount || "";

  // Estimated delivery: 5 days from today
  const deliveryDateObj = new Date();
  deliveryDateObj.setDate(deliveryDateObj.getDate() + 5);
  const estimatedDeliveryDate = deliveryDateObj.toISOString().split("T")[0];

  const optInScript = `
    window.renderOptIn = function() {
      window.gapi.load('surveyoptin', function() {
        window.gapi.surveyoptin.render({
          "merchant_id": 5902941398,
          "order_id": "${orderId}",
          "email": "${email}",
          "delivery_country": "IN",
          "estimated_delivery_date": "${estimatedDeliveryDate}",
          "opt_in_style": "CENTER_DIALOG"
        });
      });
    };
  `;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2623] flex flex-col justify-between">
      {/* Google Customer Reviews Opt-In Integration */}
      <Script
        src="https://apis.google.com/js/platform.js?onload=renderOptIn"
        strategy="afterInteractive"
      />
      <Script
        id="google-customer-reviews-survey"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: optInScript }}
      />

      <Header />

      <main className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center space-y-8 flex-1">
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-md animate-bounce">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="space-y-3">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#B06B5B] block">
            Order Successfully Placed
          </span>
          <h1 className="text-3xl sm:text-4xl font-header font-bold text-[#2C2623]">
            Thank You, {customerName}!
          </h1>
          <p className="text-stone-600 font-serif text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
            Your order <strong>#{orderId}</strong> has been received by Mehak and the Cocoon atelier. Every stitch is slowly hand-knitted with pure organic milk cotton.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-[#EAE1D3] shadow-xs text-left space-y-4 max-w-md mx-auto">
          <div className="flex justify-between items-center pb-3 border-b border-stone-100 text-sm">
            <span className="text-stone-500 font-serif">Order Reference</span>
            <span className="font-mono font-bold text-stone-900">{orderId}</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-stone-100 text-sm">
            <span className="text-stone-500 font-serif">Confirmation Sent To</span>
            <span className="font-sans font-semibold text-stone-900">{email}</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-stone-100 text-sm">
            <span className="text-stone-500 font-serif">Estimated Dispatch</span>
            <span className="font-sans font-semibold text-[#526B57]">3 to 5 Business Days</span>
          </div>

          {amount && (
            <div className="flex justify-between items-center pt-1 text-sm">
              <span className="text-stone-700 font-bold">Total Amount</span>
              <span className="font-bold text-lg text-stone-900">₹{amount}</span>
            </div>
          )}
        </div>

        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-serif max-w-md mx-auto">
          Google Customer Reviews survey prompt will appear shortly. We truly appreciate your feedback on our handmade craft!
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link
            href="/profile"
            className="px-6 py-3 rounded-full bg-[#526B57] hover:bg-[#405444] text-white text-xs font-bold uppercase tracking-wider transition shadow-xs"
          >
            Track in My Account &rarr;
          </Link>
          <Link
            href="/#shop"
            className="px-6 py-3 rounded-full bg-white border border-[#EAE1D3] hover:border-[#B06B5B] text-stone-800 hover:text-[#B06B5B] text-xs font-bold uppercase tracking-wider transition shadow-2xs"
          >
            Continue Shopping
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
