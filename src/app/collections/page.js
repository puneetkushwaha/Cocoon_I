import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CATEGORY_SEO_DATA } from "@/data/categories";
import { PRODUCTS } from "@/data/products";

export const metadata = {
  title: "All Handcrafted Crochet Collections | Cocoon India",
  description: "Browse all handcrafted crochet collections by Cocoon: artisanal handbags, macrame totes, waist belts, bandanas, plush scrunchies & lucky charms. 100% organic milk cotton.",
  alternates: {
    canonical: "https://www.gococoon.store/collections",
  },
  openGraph: {
    title: "All Handcrafted Crochet Collections | Cocoon",
    description: "Explore all artisanal crochet categories handcrafted in India with pure organic milk cotton.",
    url: "https://www.gococoon.store/collections",
    type: "website",
  },
};

export default function AllCollectionsPage() {
  const collections = Object.values(CATEGORY_SEO_DATA);

  // Top featured heirloom products to showcase below the circle categories
  const featuredProducts = PRODUCTS.filter((p) => [1, 15, 2, 4, 6, 17, 11, 22].includes(p.id));

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2623] font-sans selection:bg-[#F3D5CF] selection:text-[#5B2920]">
      <Header />

      <main className="max-w-7xl mx-auto px-6 sm:px-10 py-8 sm:py-12 text-left space-y-12 sm:space-y-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumbs" className="text-xs font-serif text-stone-500 space-x-2">
          <Link href="/" className="hover:text-[#B06B5B] underline">Home</Link>
          <span>/</span>
          <span className="text-stone-800 font-bold" aria-current="page">Collections</span>
        </nav>

        {/* Minimal Clean Header */}
        <div className="space-y-2 border-b border-[#EAE0D2] pb-6">
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#B06B5B]">
            Atelier Directory
          </span>
          <h1 className="text-3xl sm:text-5xl font-header font-bold text-[#2C2623] tracking-tight">
            Explore Handcrafted Collections
          </h1>
          <p className="text-stone-600 font-serif text-xs sm:text-sm max-w-2xl">
            Choose a category below to explore dedicated slow-crafted drops, woven knot-by-knot using 100% organic milk cotton.
          </p>
        </div>

        {/* 1. CIRCLE CATEGORY ICONS (Floating clean like homepage) */}
        <section className="py-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
            {collections.map((cat) => {
              const previewProduct = PRODUCTS.find((p) => p.category === cat.slug);
              const count = PRODUCTS.filter((p) => p.category === cat.slug).length;

              return (
                <Link
                  key={cat.slug}
                  href={`/collections/${cat.slug}`}
                  className="group flex flex-col items-center text-center cursor-pointer transition-transform hover:-translate-y-1.5"
                >
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-[#F5EFEB] border-2 border-[#EFE8DE] group-hover:border-[#B06B5B] shadow-sm group-hover:shadow-md transition-all duration-300 p-1">
                    <img
                      src={previewProduct?.imgUrl || "/instagram-post.jpg"}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-full transform group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="mt-4 text-xs font-bold uppercase tracking-widest text-[#2C2623] group-hover:text-[#B06B5B] transition leading-tight">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-[#2C2623]/60 font-sans font-medium mt-1">
                    {count} Pieces &bull; Tap to View &rarr;
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 2. FEATURED BESTSELLING TREASURES (Ache Products Showcase) */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#EAE0D2] pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B06B5B] block mb-1">
                Handpicked Favorites
              </span>
              <h2 className="text-2xl sm:text-3xl font-header font-bold text-[#2C2623]">
                Featured Heirloom Drops
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold uppercase tracking-widest text-[#B06B5B] hover:underline"
            >
              View Complete Catalog ({PRODUCTS.length}) &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => {
              const discountPercent = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

              return (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group bg-white rounded-3xl p-3 sm:p-3.5 border border-[#EAE1D3] hover:border-[#B06B5B] shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden bg-[#FAF5EE] relative mb-3">
                    <img
                      src={product.imgUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {product.badge && (
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[10px] font-bold uppercase tracking-wider text-[#B06B5B] shadow-2xs">
                        {product.badge}
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full bg-[#526B57] text-white text-[9px] font-bold tracking-wider">
                        {discountPercent}% OFF
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
                    <div className="flex items-baseline justify-between pt-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm sm:text-base font-bold text-[#2C2623]">
                          ₹{product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-stone-400 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                      {product.reviews && (
                        <span className="text-[11px] text-amber-700 font-bold">
                          ★ 5.0 ({product.reviews})
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
