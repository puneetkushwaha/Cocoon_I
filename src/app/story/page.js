import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Our Story & Letter from Mehak | Cocoon Handcrafted Crochet",
  description: "Learn about Cocoon's artisanal philosophy: slow craftsmanship, zero-plastic packaging, and hand-knitted organic milk cotton heirloom creations by Mehak Agarwal.",
  alternates: {
    canonical: "https://www.gococoon.store/story",
  },
  openGraph: {
    title: "Our Story & Letter from Mehak | Cocoon",
    description: "We choose to slow down. Discover the story behind Cocoon's handcrafted crochet boutique in India.",
    url: "https://www.gococoon.store/story",
    type: "website",
  },
};

export default function StoryPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2623] font-sans selection:bg-[#F3D5CF] selection:text-[#5B2920]">
      <Header />

      <main className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 py-8 sm:py-12 text-left space-y-12 sm:space-y-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumbs" className="text-xs font-serif text-stone-500 space-x-2">
          <Link href="/" className="hover:text-[#B06B5B] underline">Home</Link>
          <span>/</span>
          <span className="text-stone-800 font-bold" aria-current="page">Our Story</span>
        </nav>

        {/* 1. EDITORIAL LETTER FROM MEHAK */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="text-[11px] font-sans uppercase tracking-[0.35em] text-[#B06B5B] font-bold block">
                Letter from Mehak
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-header font-light text-[#221F1F] leading-[1.12] tracking-tight">
                "We choose to slow down. Every knot is woven by hand with quiet intention and warmth."
              </h1>
            </div>

            <div className="space-y-5 text-sm sm:text-base text-[#2C2623]/80 leading-relaxed font-serif font-light max-w-2xl">
              <p>
                Cocoon started on a quiet afternoon with two bamboo crochet hooks and a basket of combed organic milk cotton. In an era rushing through fast trends, synthetic fibers, and industrial conveyor belts, I wanted to craft keepsakes that carry memory, identity, and personal touch.
              </p>
              <p>
                Every handbag, floral sleeve, and custom piece is looped knot-by-knot in our studio. No machines, no shortcuts, and no two pieces that are ever quite identical. When you hold a Cocoon piece, you hold days of slow craftsmanship made to be cherished for years.
              </p>
              <p>
                Our promise is simple: 100% hypoallergenic organic milk cotton, zero single-use plastic in our packaging, and true slow-fashion integrity that honors the art of needlework.
              </p>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-t border-[#EAE3D6]">
              <div>
                <div className="font-header italic text-4xl sm:text-5xl text-[#B06B5B] font-light tracking-wide leading-none select-none">
                  — Mehak
                </div>
                <p className="text-[11px] font-sans uppercase tracking-[0.25em] text-stone-500 font-semibold mt-2.5">
                  Founder &amp; Needlework Artist
                </p>
              </div>

              <Link
                href="/custom-order"
                className="inline-flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-widest text-[#221F1F] hover:text-[#B06B5B] transition-colors group"
              >
                <span>Request a Custom Piece</span>
                <span className="group-hover:translate-x-1.5 transition-transform duration-300">&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[3/4] sm:aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-[#E8DFC9] bg-[#F3EDE2] group">
              <img
                src="/products/items/chocolate-bow-handbag.jpg"
                alt="Handcrafted Heirloom Crochet by Mehak"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                <span className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#221F1F] shadow-sm">
                  Slow Craft &bull; Handmade
                </span>
                <span className="text-[11px] font-serif italic text-white/90 drop-shadow-md">
                  100% Milk Cotton
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. THREE CORE ATELIER PILLARS */}
        <section className="bg-white rounded-3xl p-8 sm:p-14 border border-[#EAE1D3] space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B06B5B] block">
              Our Ethos
            </span>
            <h2 className="text-2xl sm:text-4xl font-header font-bold text-[#2C2623]">
              The Three Pillars of Cocoon
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#EAE1D3] space-y-3">
              <span className="text-2xl">🌱</span>
              <h3 className="font-header font-bold text-lg text-[#2C2623]">100% Organic Milk Cotton</h3>
              <p className="text-xs sm:text-sm font-serif text-stone-600 leading-relaxed">
                Hypoallergenic, breathable, and ultra-gentle on sensitive skin and delicate hair cuticles. We say no to scratchy synthetic acrylics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#EAE1D3] space-y-3">
              <span className="text-2xl">⏳</span>
              <h3 className="font-header font-bold text-lg text-[#2C2623]">Knot-by-Knot Patience</h3>
              <p className="text-xs sm:text-sm font-serif text-stone-600 leading-relaxed">
                Every single loop requires deliberate manual tension. From small bow charms to detailed granny backpacks, no machines ever replace artisan touch.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#EAE1D3] space-y-3">
              <span className="text-2xl">📦</span>
              <h3 className="font-header font-bold text-lg text-[#2C2623]">Zero-Plastic Packaging</h3>
              <p className="text-xs sm:text-sm font-serif text-stone-600 leading-relaxed">
                Shipped in reusable organic cotton dust bags, recyclable cardboard craft boxes, and tied with cotton cords for an aesthetic unboxing.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
