import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CollectionFilterSort from "@/components/CollectionFilterSort";
import { PRODUCTS } from "@/data/products";

export const metadata = {
  title: "All Drops & Handcrafted Vault | GoCocoon India",
  description: "Explore all authentic handcrafted crochet pieces by GoCocoon: bow knot handbags, floral bandanas, bohemian waist belts, phone sleeves, scrunchies & lucky charms.",
  alternates: {
    canonical: "https://www.gococoon.store/shop",
  },
  openGraph: {
    title: "All Drops & Handcrafted Vault | GoCocoon",
    description: "Explore all artisanal crochet creations handcrafted knot-by-knot in India with pure organic milk cotton.",
    url: "https://www.gococoon.store/shop",
    type: "website",
  },
};

export default function ShopAllDropsPage() {
  const allSubcategories = [
    { id: "all", name: "All Drops" },
    { id: "totes-handbags", name: "Handbags & Totes" },
    { id: "waist-scarves", name: "Waist Scarves & Belts" },
    { id: "bandanas", name: "Bandanas & Hair Scarves" },
    { id: "bow-keychains", name: "Bow Charms" },
    { id: "evil-eye", name: "Evil Eye Protectors" },
    { id: "scrunchies", name: "Hair Ties & Scrunchies" },
    { id: "phone-slings", name: "Phone Slings" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2623] font-sans selection:bg-[#F3D5CF] selection:text-[#5B2920]">
      <Header />

      <main className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 py-8 sm:py-12 text-left space-y-12 sm:space-y-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumbs" className="text-xs font-serif text-stone-500 space-x-2">
          <Link href="/" className="hover:text-[#B06B5B] underline">Home</Link>
          <span>/</span>
          <span className="text-stone-800 font-bold" aria-current="page">All Drops</span>
        </nav>

        {/* Minimal Clean Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#EAE0D2] pb-6">
          <div>
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#B06B5B] block mb-1">
              Atelier Vault
            </span>
            <h1 className="text-3xl sm:text-5xl font-header font-bold text-[#2C2623] tracking-tight">
              All Handcrafted Drops
            </h1>
            <p className="text-stone-600 font-serif text-xs sm:text-sm max-w-xl mt-1">
              Every piece is slowly hand-knitted knot-by-knot in India using 100% hypoallergenic organic milk cotton.
            </p>
          </div>
          <span className="text-xs font-mono text-stone-500 shrink-0">
            {PRODUCTS.length} Unique Pieces Available
          </span>
        </div>

        {/* Catalog Grid with Filters & Sort */}
        <CollectionFilterSort
          products={PRODUCTS}
          subcategories={allSubcategories}
          categoryName="Drops"
          categorySlug="shop"
        />
      </main>

      <Footer />
    </div>
  );
}
