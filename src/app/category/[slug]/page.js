import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CATEGORY_SEO_DATA } from "@/data/categories";
import { PRODUCTS } from "@/data/products";

export function generateStaticParams() {
  return Object.keys(CATEGORY_SEO_DATA).map((slug) => ({
    slug,
  }));
}

export default async function CategoryPage({ params }) {
  const unwrappedParams = await params;
  const catData = CATEGORY_SEO_DATA[unwrappedParams.slug];

  if (!catData) {
    notFound();
  }

  const categoryProducts = PRODUCTS.filter((p) => p.category === catData.slug);
  const otherCategories = Object.values(CATEGORY_SEO_DATA).filter((c) => c.slug !== catData.slug);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2623] font-sans selection:bg-[#F3D5CF] selection:text-[#5B2920]">
      <Header />

      <main className="max-w-7xl mx-auto px-6 sm:px-10 py-16 sm:py-20 text-left space-y-16">
        {/* Breadcrumb */}
        <div className="text-xs font-serif text-stone-500 space-x-2">
          <Link href="/" className="hover:text-[#B06B5B] underline">Home</Link>
          <span>/</span>
          <Link href="/#shop" className="hover:text-[#B06B5B] underline">Shop</Link>
          <span>/</span>
          <span className="text-stone-800 font-bold">{catData.name}</span>
        </div>

        {/* Category Hero Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#FAF5EE] via-[#FCEEEA]/40 to-[#FAF5EE] border border-[#EAE1D3] space-y-4 relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#F3D5CF] text-[#B06B5B] text-xs font-bold uppercase tracking-[0.2em]">
            <span>🧶</span>
            <span>{catData.heroBadge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-header font-bold text-[#2C2623] tracking-tight leading-tight max-w-4xl">
            {catData.h1}
          </h1>

          <p className="text-stone-600 font-serif text-sm sm:text-base leading-relaxed max-w-3xl">
            {catData.intro}
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-sans text-stone-500">
            <span>✨ Pure Artisan Fibers & Yarns</span>
            <span>•</span>
            <span>📦 All-India Express Dispatch</span>
            <span>•</span>
            <span>🌸 Made Knot-by-Knot by Mehak</span>
          </div>
        </div>

        {/* Product Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#EAE1D3] pb-4">
            <h2 className="text-2xl font-header font-bold text-[#2C2623]">
              Available Treasures ({categoryProducts.length})
            </h2>
            <Link href="/#shop" className="text-xs font-bold uppercase tracking-wider text-[#B06B5B] hover:text-stone-900 transition">
              View All Catalog &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryProducts.map((prod) => (
              <Link
                key={prod.id}
                href={`/product/${prod.id}`}
                className="group bg-white rounded-3xl p-4 border border-[#EAE1D3] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-stone-100 relative">
                    <img
                      src={prod.imgUrl}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {prod.badge && (
                      <span className="absolute top-2 left-2 bg-[#B06B5B] text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                        {prod.badge}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-[#B06B5B] tracking-wider block">
                      {catData.name}
                    </span>
                    <h3 className="font-header font-bold text-base text-[#2C2623] line-clamp-1 group-hover:text-[#B06B5B] transition-colors">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-stone-500 font-serif line-clamp-2 leading-relaxed">
                      {prod.desc}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-sm font-bold text-stone-900">₹{prod.price}</span>
                      {prod.originalPrice && (
                        <span className="text-xs text-stone-400 line-through">₹{prod.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </div>

                <span className="mt-4 w-full py-2.5 rounded-xl bg-[#FAF5EE] group-hover:bg-[#2C2623] group-hover:text-white text-stone-800 text-[11px] font-bold uppercase tracking-wider text-center transition block">
                  Select &amp; Customise &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Category FAQ Accordion Section */}
        {catData.faqs?.length > 0 && (
          <section className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EAE1D3] space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B06B5B] block">Atelier Care &amp; Guidance</span>
              <h2 className="text-2xl sm:text-3xl font-header font-bold text-[#2C2623]">
                Frequently Asked Questions about {catData.name}
              </h2>
            </div>

            <div className="divide-y divide-[#EAE1D3]">
              {catData.faqs.map((faq, index) => (
                <div key={index} className="py-5 space-y-2">
                  <h3 className="text-base font-header font-bold text-[#2C2623]">
                    {faq.q}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 font-serif leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Explore Other Curated Categories */}
        <section className="space-y-6 pt-4">
          <h2 className="text-2xl font-header font-bold text-[#2C2623]">
            Explore More Handcrafted Collections
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {otherCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="p-4 rounded-2xl bg-white border border-[#EAE1D3] hover:border-[#B06B5B] shadow-2xs hover:shadow-sm text-center transition-all group"
              >
                <h4 className="font-header font-bold text-sm text-stone-800 group-hover:text-[#B06B5B] transition-colors">
                  {c.name}
                </h4>
                <span className="text-[10px] text-stone-400 font-sans block mt-1">
                  View Collection &rarr;
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
