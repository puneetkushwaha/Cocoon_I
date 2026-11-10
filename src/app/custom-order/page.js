"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CustomOrderPage() {
  const [formData, setFormData] = useState({
    productName: "",
    category: "Handbag / Backpack",
    colorway: "",
    name: "",
    email: "",
    phone: "",
    idea: "",
    budget: "Rs. 1,000 - Rs. 2,000",
    neededBy: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("Please provide your name and WhatsApp phone number.");
      return;
    }
    setIsSubmitting(true);
    try {
      // Create WhatsApp message string
      const waText = encodeURIComponent(
        `Hi Mehak! I want to commission a custom crochet piece.\n\n` +
        `• Name: ${formData.name}\n` +
        `• Category: ${formData.category}\n` +
        `• Colorway: ${formData.colorway || "Standard"}\n` +
        `• Budget: ${formData.budget}\n` +
        `• Needed By: ${formData.neededBy || "Standard Dispatch"}\n` +
        `• Idea/Details: ${formData.idea}`
      );
      window.open(`https://wa.me/918171902255?text=${waText}`, "_blank");
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2623] font-sans selection:bg-[#F3D5CF] selection:text-[#5B2920]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:px-10 py-8 sm:py-12 text-left space-y-12 sm:space-y-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumbs" className="text-xs font-serif text-stone-500 space-x-2">
          <Link href="/" className="hover:text-[#B06B5B] underline">Home</Link>
          <span>/</span>
          <span className="text-stone-800 font-bold" aria-current="page">Custom Order</span>
        </nav>

        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] font-sans font-bold uppercase tracking-[0.28em] text-[#B06B5B] inline-block bg-[#FAF0ED] px-4 py-1.5 rounded-full border border-[#ECCEC7] shadow-2xs">
            ✦ Made-To-Order Atelier
          </span>
          <h1 className="text-3xl sm:text-5xl font-light font-header text-[#2C2623] tracking-tight">
            Design Your Bespoke Heirloom
          </h1>
          <p className="text-xs sm:text-sm font-serif text-[#2C2623]/70 leading-relaxed max-w-lg mx-auto">
            Have a dream colorway, an outfit to match, or a Pinterest look you adore? Mehak hand-knits your vision stitch-by-stitch with premium artisan milk cotton yarns.
          </p>
        </div>

        {/* 4 MOODBOARD INSPIRATION PILLS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {[
            {
              title: "Custom Palettes",
              desc: "Match your favorite outfit with curated milk cotton yarn shades."
            },
            {
              title: "Motif & Petal Swaps",
              desc: "Personalize with 3D daisies, sunflowers, roses, or evil eye charms."
            },
            {
              title: "Tailored Sizing",
              desc: "Custom strap lengths, specific phone models, and adjustable waist wraps."
            },
            {
              title: "Bridal & Occasions",
              desc: "Romantic ivory, champagne, and blush palettes with delicate pearl beadwork."
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-[#EDE3D6] shadow-2xs space-y-1.5 hover:border-[#B06B5B]/40 transition"
            >
              <span className="text-xs font-bold text-[#B06B5B] block font-mono">0{idx + 1}.</span>
              <p className="font-header font-bold text-sm text-[#2C2623]">{item.title}</p>
              <p className="text-[11px] font-serif text-[#2C2623]/65 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* TWO PATHWAYS: WHATSAPP CONCIERGE & DETAILED FORM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Path 1: WhatsApp Concierge */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#FAF5EE] via-white to-[#FAF0ED]/40 rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-sm space-y-6 lg:sticky lg:top-28">
            <div className="flex items-center justify-between pb-4 border-b border-[#FAF4ED]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#B06B5B] text-white flex items-center justify-center font-header font-bold text-lg shadow-xs">
                  M
                </div>
                <div>
                  <h3 className="font-header font-bold text-base text-[#2C2623] leading-tight">Chat with Mehak</h3>
                  <p className="text-[11px] text-[#8B5E3C] font-sans font-bold flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-[#B06B5B] animate-pulse"></span>
                    Studio Online • Fast Reply
                  </p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-[#FAF0ED] text-[#B06B5B] border border-[#ECCEC7] px-2.5 py-0.5 rounded-full">
                Fastest
              </span>
            </div>

            <div className="space-y-3 text-left">
              <h4 className="font-header font-bold text-lg text-[#2C2623] leading-snug">
                Skip the form! Just send your photo on WhatsApp
              </h4>
              <p className="text-xs font-serif text-[#2C2623]/70 leading-relaxed">
                Got a Pinterest screenshot, an Instagram Reel, or a color swatch? Message Mehak directly. She will discuss your design, share live yarn shade photos, and quote you right away.
              </p>
            </div>

            <a
              href="https://wa.me/918171902255?text=Hi%20Mehak!%20I%20want%20to%20discuss%20a%20custom%20crochet%20order%20with%20you.%20Here%20is%20my%20idea:"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-[#2C2623] hover:bg-[#B06B5B] text-white font-sans text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer text-center group"
            >
              <span>Direct WhatsApp Concierge &rarr;</span>
            </a>
          </div>

          {/* Path 2: Structured Commission Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-[#EAE1D3] shadow-sm space-y-6">
            <div className="border-b border-[#EAE1D3] pb-4">
              <h3 className="font-header font-bold text-xl text-[#2C2623]">
                Bespoke Commission Slip
              </h3>
              <p className="text-xs font-serif text-stone-500 mt-0.5">
                Tell us what you have in mind. We will connect back with design mockups.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nimisha Agarwal"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#FAF5EE] border border-[#EAE1D3] focus:outline-none focus:border-[#B06B5B]"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#FAF5EE] border border-[#EAE1D3] focus:outline-none focus:border-[#B06B5B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Product Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#FAF5EE] border border-[#EAE1D3] focus:outline-none focus:border-[#B06B5B]"
                  >
                    <option>Handbag / Shoulder Bag</option>
                    <option>Mini Backpack</option>
                    <option>Waist Belt / Hip Wrap</option>
                    <option>Floral Hair Accessories</option>
                    <option>Bandana / Headscarf</option>
                    <option>Phone Pouch / Sling</option>
                    <option>Bespoke Keepsake / Keychain</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Preferred Colorway</label>
                  <input
                    type="text"
                    placeholder="e.g. Mocha Brown + Cream Vanilla"
                    value={formData.colorway}
                    onChange={(e) => setFormData({ ...formData, colorway: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#FAF5EE] border border-[#EAE1D3] focus:outline-none focus:border-[#B06B5B]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Describe Your Vision / Reference</label>
                <textarea
                  rows="4"
                  placeholder="Tell Mehak about the dimensions, flower motifs, strap length, or outfit you are matching..."
                  value={formData.idea}
                  onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#FAF5EE] border border-[#EAE1D3] focus:outline-none focus:border-[#B06B5B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Estimated Budget</label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#FAF5EE] border border-[#EAE1D3] focus:outline-none focus:border-[#B06B5B]"
                  >
                    <option>Under Rs. 500 (Hairwear / Charms)</option>
                    <option>Rs. 500 - Rs. 1,000</option>
                    <option>Rs. 1,000 - Rs. 2,000 (Bags / Wraps)</option>
                    <option>Above Rs. 2,000 (Bridal / Complex Backpacks)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Needed By Date (Optional)</label>
                  <input
                    type="date"
                    value={formData.neededBy}
                    onChange={(e) => setFormData({ ...formData, neededBy: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#FAF5EE] border border-[#EAE1D3] focus:outline-none focus:border-[#B06B5B]"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#EDE5DA] text-[11px] text-stone-600 font-serif leading-relaxed">
                <strong className="block text-stone-900 font-sans mb-0.5">✦ Artisan &amp; Statutory Policy:</strong>
                Custom pieces are made-to-order based on your chosen measurements and colorways. Under the Indian Consumer Protection (E-Commerce) Rules 2020, bespoke personalized goods are exempt from return/exchange once crafted, except in cases of transit damage or defects (which are 100% protected under our 7-day guarantee).
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-full bg-[#B06B5B] hover:bg-[#975647] text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-md"
              >
                {isSubmitting ? "Opening WhatsApp..." : "Submit & Discuss on WhatsApp →"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
