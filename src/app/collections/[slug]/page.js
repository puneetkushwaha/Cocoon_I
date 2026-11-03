import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CollectionFilterSort from "@/components/CollectionFilterSort";
import CategoryReviewsSection from "@/components/CategoryReviewsSection";
import { CATEGORY_SEO_DATA } from "@/data/categories";
import { PRODUCTS } from "@/data/products";
import { INITIAL_REVIEWS } from "@/data/store";

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

  const canonicalUrl = `https://www.gococoon.store/collections/${catData.slug}`;

  return {
    title: `${catData.name} | GoCocoon Handcrafted Crochet India`,
    description: catData.metaDescription || catData.intro,
    keywords: catData.keywords || [
      catData.name,
      `crochet ${catData.name.toLowerCase()} India`,
      `handmade ${catData.name.toLowerCase()}`,
      "GoCocoon",
      "organic milk cotton crochet",
      "slow fashion knitwear India"
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${catData.name} - Handcrafted Crochet Collection | GoCocoon`,
      description: catData.metaDescription || catData.intro,
      url: canonicalUrl,
      siteName: "GoCocoon",
      type: "website",
      images: [
        {
          url: "https://www.gococoon.store/instagram-post.jpg",
          width: 1200,
          height: 1200,
          alt: `${catData.name} by GoCocoon India`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${catData.name} | GoCocoon Handcrafted Crochet India`,
      description: catData.metaDescription || catData.intro,
    },
  };
}

export default async function CollectionPage({ params }) {
  const unwrappedParams = await params;
  const catData = CATEGORY_SEO_DATA[unwrappedParams.slug];

  if (!catData) {
    notFound();
  }

  const categoryProducts = PRODUCTS.filter((p) => p.category === catData.slug);
  const otherCategories = Object.values(CATEGORY_SEO_DATA).filter((c) => c.slug !== catData.slug);
  
  // Fetch matching reviews for products in this category
  const productIds = new Set(categoryProducts.map((p) => p.id));
  const categoryReviews = INITIAL_REVIEWS.filter((r) => productIds.has(Number(r.productId)));

  // Fallback to top general reviews if category has few
  const reviewsToShow = categoryReviews.length > 0
    ? categoryReviews
    : INITIAL_REVIEWS.slice(0, 6);

  // 1. BreadcrumbList Schema for Google Search Rich Snippets
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.gococoon.store",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Collections",
        item: "https://www.gococoon.store/collections",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: catData.name,
        item: `https://www.gococoon.store/collections/${catData.slug}`,
      },
    ],
  };

  // 2. CollectionPage with ItemList Schema
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: catData.name,
    headline: catData.h1,
    description: catData.metaDescription || catData.intro,
    url: `https://www.gococoon.store/collections/${catData.slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: categoryProducts.length,
      itemListElement: categoryProducts.map((p, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://www.gococoon.store/product/${p.id}`,
        name: p.name,
        image: p.imgUrl?.startsWith("http") ? p.imgUrl : `https://www.gococoon.store${p.imgUrl}`,
        offers: {
          "@type": "Offer",
          price: p.price,
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
        },
      })),
    },
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2623] font-sans selection:bg-[#F3D5CF] selection:text-[#5B2920]">
      {/* Search Engine Microdata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      
      <Header />

      <main className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-8 sm:py-12 text-left space-y-12 sm:space-y-16">
        
        {/* Minimal Loomsmith-style Top Header (Title + Breadcrumbs directly above product catalog) */}
        <div className="space-y-4 pt-2">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumbs" className="text-xs font-serif text-stone-500 space-x-2">
            <Link href="/" className="hover:text-[#B06B5B] underline">Home</Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-[#B06B5B] underline">Collections</Link>
            <span>/</span>
            <span className="text-stone-800 font-bold" aria-current="page">{catData.name}</span>
          </nav>

          {/* Clean Loomsmith-style H1 Heading */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#EAE1D3] pb-4">
            <h1 className="text-3xl sm:text-5xl font-header font-bold text-[#2C2623] tracking-tight">
              {catData.name}
            </h1>
            <span className="text-xs font-mono text-stone-500">
              {categoryProducts.length} Artisanal Pieces Available
            </span>
          </div>
        </div>

        {/* 1. TOP SECTION: PRODUCTS GRID WITH FILTERS & SORTING (Loomsmith Exact Layout) */}
        <section className="space-y-6">
          <CollectionFilterSort
            products={categoryProducts}
            subcategories={catData.subcategories || [{ id: "all", name: "All Pieces" }]}
            categoryName={catData.name}
            categorySlug={catData.slug}
          />
        </section>

        {/* 2. BOTTOM SECTION: LOOMSMITH-STYLE EDITORIAL SEO TEXT & BUYING GUIDE */}
        <section className="bg-white rounded-3xl p-8 sm:p-14 border border-[#EAE1D3] space-y-8 text-center max-w-4xl mx-auto">
          {/* Main Collection Intro Heading (Centered like Loomsmith) */}
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-4xl font-header font-bold text-[#2C2623]">
              {catData.h1}
            </h2>
            <div className="w-16 h-0.5 bg-[#B06B5B] mx-auto rounded-full" />
          </div>

          {/* Editorial Paragraphs */}
          <div className="space-y-4 text-stone-600 font-serif text-sm sm:text-base leading-relaxed text-justify sm:text-center">
            <p>{catData.intro}</p>
            {catData.buyingGuide?.paragraphs?.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {/* Subheading Block (like Loomsmith's 'Delightful Gift Idea' block) */}
          {catData.stylingTips?.length > 0 && (
            <div className="pt-6 border-t border-[#EAE1D3] space-y-4 text-left sm:text-center">
              <h3 className="font-header font-bold text-xl text-[#2C2623]">
                Delightful Styling Ideas &amp; Versatility
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {catData.stylingTips.map((tip, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE1D3] text-xs text-stone-600 font-serif leading-relaxed">
                    <span className="text-[#B06B5B] font-bold block mb-1">Idea 0{idx + 1}</span>
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 3. VERIFIED CUSTOMER REVIEWS ("Let customers speak for us" Section) */}
        <CategoryReviewsSection
          reviews={reviewsToShow}
          categoryName={catData.name}
          products={categoryProducts}
        />

        {/* 4. CATEGORY FAQ ACCORDION FOR GOOGLE RICH SNIPPETS */}
        {catData.faqs?.length > 0 && (
          <section className="bg-white rounded-3xl p-6 sm:p-12 border border-[#EAE1D3] space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B06B5B] block">
                Atelier Care &amp; Guidance
              </span>
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

        {/* 5. EXPLORE OTHER COLLECTIONS */}
        <section className="space-y-6 pt-4">
          <div className="flex items-baseline justify-between border-b border-[#EAE1D3] pb-3">
            <h2 className="text-xl sm:text-2xl font-header font-bold text-[#2C2623]">
              Explore Other Handcrafted Collections
            </h2>
            <Link href="/collections" className="text-xs font-bold text-[#B06B5B] hover:underline">
              View All Collections &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {otherCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/collections/${c.slug}`}
                className="p-4 rounded-2xl bg-white border border-[#EAE1D3] hover:border-[#B06B5B] shadow-2xs hover:shadow-sm text-center transition-all group"
              >
                <h4 className="font-header font-bold text-sm text-stone-800 group-hover:text-[#B06B5B] transition-colors line-clamp-1">
                  {c.name}
                </h4>
                <span className="text-[10px] text-stone-400 font-sans block mt-1">
                  Explore Pieces &rarr;
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
