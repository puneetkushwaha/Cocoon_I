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

export async function generateMetadata({ params }) {
  const unwrappedParams = await params;
  const catData = CATEGORY_SEO_DATA[unwrappedParams.slug];

  if (!catData) {
    return {
      title: "Handcrafted Crochet Collections | GoCocoon",
      description: "Explore authentic organic milk cotton crochet essentials handmade in India.",
    };
  }

  return {
    title: `${catData.metaTitle || catData.name} | GoCocoon Handcrafted Crochet`,
    description: catData.metaDescription || catData.intro,
    keywords: [
      catData.name,
      `crochet ${catData.name.toLowerCase()} India`,
      `handmade ${catData.name.toLowerCase()}`,
      "GoCocoon",
      "organic milk cotton crochet",
      "slow fashion knitwear India"
    ],
    alternates: {
      canonical: `https://www.gococoon.store/category/${catData.slug}`,
    },
    openGraph: {
      title: `${catData.name} - Handcrafted Crochet Collection | GoCocoon`,
      description: catData.metaDescription || catData.intro,
      url: `https://www.gococoon.store/category/${catData.slug}`,
      siteName: "GoCocoon",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${catData.name} | GoCocoon Handcrafted Crochet India`,
      description: catData.metaDescription || catData.intro,
    },
  };
}

export default async function CategoryPage({ params }) {
  const unwrappedParams = await params;
  const catData = CATEGORY_SEO_DATA[unwrappedParams.slug];

  if (!catData) {
    notFound();
  }

  const categoryProducts = PRODUCTS.filter((p) => p.category === catData.slug);
  const otherCategories = Object.values(CATEGORY_SEO_DATA).filter((c) => c.slug !== catData.slug);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: catData.name,
    description: catData.metaDescription || catData.intro,
    url: `https://www.gococoon.store/category/${catData.slug}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: categoryProducts.map((p, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://www.gococoon.store/product/${p.id}`,
        name: p.name,
        image: p.imgUrl?.startsWith("http") ? p.imgUrl : `https://www.gococoon.store${p.imgUrl}`,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2623] font-sans selection:bg-[#F3D5CF] selection:text-[#5B2920]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      
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
            <svg className="w-3.5 h-3.5 text-[#B06B5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9"/>
              <path d="M12 3a9 9 0 0 1 9 9M12 21a9 9 0 0 1-9-9"/>
            </svg>
            <span>{catData.heroBadge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-header font-bold text-[#2C2623] tracking-tight leading-tight max-w-4xl">
            {catData.h1}
          </h1>

          <p className="text-stone-600 font-serif text-sm sm:text-base leading-relaxed max-w-3xl">
            {catData.intro}
          </p>
        </div>

        {/* Product Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#EAE1D3] pb-4">
            <h2 className="font-header text-2xl font-bold text-[#2C2623]">
              {catData.name} ({categoryProducts.length} Pieces)
            </h2>
            <span className="text-xs font-mono text-stone-500">
              100% Organic Milk Cotton
            </span>
          </div>

          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categoryProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group bg-white rounded-3xl p-3 border border-[#EAE1D3] hover:border-[#B06B5B] shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden bg-[#FAF5EE] relative mb-3">
                    <img
                      src={product.imgUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.badge && (
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-bold uppercase tracking-wider text-[#B06B5B]">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 p-1 text-left">
                    <h3 className="font-header font-bold text-base text-[#2C2623] group-hover:text-[#B06B5B] transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-stone-500 font-serif line-clamp-2 leading-relaxed">
                      {product.desc}
                    </p>
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-sm font-bold text-[#2C2623]">
                        Rs. {product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-stone-400 line-through">
                          Rs. {product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#EAE1D3] space-y-3">
              <p className="font-header text-xl text-stone-700">New drops weaving in the atelier.</p>
              <p className="text-xs text-stone-500 font-serif">Check back shortly or request a custom order.</p>
              <Link href="/#custom-order" className="inline-block mt-2 px-6 py-2.5 rounded-full bg-[#B06B5B] text-white text-xs font-bold">
                Commission Custom {catData.name}
              </Link>
            </div>
          )}
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
