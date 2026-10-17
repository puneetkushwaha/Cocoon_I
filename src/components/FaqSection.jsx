"use client";

import { useState } from "react";
import Link from "next/link";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "Are GoCocoon creations authentic 100% handmade in India?",
      a: "Yes, every single piece at GoCocoon is meticulously hand-crocheted knot-by-knot in India by Mehak Agarwal and artisanal craftswomen using pure, non-allergic organic milk cotton yarn. We do not use machine knitting or factory mass-production. Authentic crochet stitches cannot be replicated by industrial machine looms."
    },
    {
      q: "What makes 100% organic milk cotton superior to synthetic acrylic?",
      a: "Unlike cheap synthetic acrylic yarn that traps heat, builds up static, and pills rapidly under friction, milk cotton is a premium hybrid fiber combining combed cotton with milk casein protein. It is cloud-soft, hypoallergenic, gentle on sensitive skin and hair strands, breathable in Indian weather, and holds crisp structural stitch tension for everyday use."
    },
    {
      q: "How long does delivery take & is Cash on Delivery (COD) available?",
      a: "Yes! GoCocoon provides verified Cash on Delivery (COD) with real-time SMS/email OTP verification and express courier dispatch across all serviceable pin codes in India. Orders are prepared with care and dispatched via express courier partners (Shiprocket, Bluedart, Delhivery), arriving in 3 to 7 business days with live tracking updates."
    },
    {
      q: "How do I wash and care for handmade milk cotton crochet bags and accessories?",
      a: "Gently hand wash in cool water using mild liquid cleanser or baby shampoo for 2–3 minutes without scrubbing or wringing. Press excess moisture out in a clean dry towel, reshape the item with your fingers, and lay flat to dry in shade. Avoid hot water, bleaching, and hanging wet pieces by their straps."
    },
    {
      q: "Can I commission a custom bespoke piece or colorway?",
      a: "Yes! Through our Bespoke Atelier, you can consult directly with lead artisan Mehak Agarwal on WhatsApp (+91 8171902255) to share your Pinterest or Instagram reference photos, choose personalized yarn shades, and approve swatches before we hand-knit your heirloom piece. Zero advance deposit required to explore ideas."
    }
  ];

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 sm:py-24 bg-[#FAF7F2] border-t border-[#EAE0D2] relative overflow-hidden font-sans text-left">
      <div className="max-w-4xl mx-auto px-6 sm:px-10 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[11px] font-sans font-bold uppercase tracking-[0.28em] text-[#B06B5B] inline-block bg-[#FAF0ED] px-4 py-1.5 rounded-full border border-[#ECCEC7] shadow-2xs">
            Atelier Guidance &amp; Care
          </span>

          <h2 className="text-3xl sm:text-5xl font-light font-header text-[#2C2623] tracking-tight">
            Frequently Asked Questions
          </h2>

          <p className="text-xs sm:text-sm font-serif text-[#2C2623]/70 leading-relaxed">
            Everything you need to know about our slow-crafted crochet, organic materials, express India dispatch, and custom orders.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#EDE3D6] shadow-2xs overflow-hidden transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF7F2]/50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-header font-bold text-base sm:text-lg text-[#2C2623] leading-snug">
                    {faq.q}
                  </span>

                  <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                    isOpen
                      ? "bg-[#B06B5B] text-white border-[#B06B5B] rotate-180"
                      : "bg-[#FAF7F2] text-[#2C2623]/70 border-[#EDE3D6]"
                  }`}>
                    {isOpen ? (
                      <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    )}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#2C2623]/75 font-serif leading-relaxed border-t border-[#F5ECE1] animate-fadeIn">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Consultation Helper Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FAF5EE] via-white to-[#FAF0ED]/50 border border-[#E8DFC9] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="font-header font-bold text-lg text-[#2C2623]">
              Have a question not listed here?
            </h4>
            <p className="text-xs font-serif text-[#2C2623]/70">
              Mehak is active on WhatsApp to discuss custom sizes, bridal palettes, or order status.
            </p>
          </div>

          <a
            href="https://wa.me/918171902255?text=Hi%20Mehak!%20I%20have%20a%20question%20regarding%20GoCocoon%20crochet."
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold font-sans transition shadow-sm hover:shadow-md cursor-pointer shrink-0 inline-flex items-center gap-2"
          >
            <span>Ask on WhatsApp</span>
            <span>→</span>
          </a>
        </div>

      </div>
    </section>
  );
}
