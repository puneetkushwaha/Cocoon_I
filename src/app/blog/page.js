import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BLOG_POSTS } from "@/data/blogPosts";

export const metadata = {
  title: "Artisan Crochet Journal, Care Guides & Styling Tips | GoCocoon India",
  description: "Read artisan guides on washing handcrafted crochet bags, styling bandanas & waist wraps, and the tactile beauty of milk cotton yarn. Written by Mehak Agarwal.",
  keywords: [
    "crochet care guide",
    "how to wash crochet bags",
    "crochet styling tips India",
    "milk cotton crochet",
    "slow fashion knitwear guide",
    "crochet bandana styling"
  ],
  alternates: {
    canonical: "https://www.gococoon.store/blog",
  },
  openGraph: {
    title: "Artisan Crochet Journal & Craftsmanship Guides | GoCocoon",
    description: "Expert advice on washing, preserving, and styling handcrafted crochet essentials.",
    url: "https://www.gococoon.store/blog",
    siteName: "GoCocoon",
    images: [
      {
        url: "https://www.gococoon.store/instagram-post.jpg",
        width: 1200,
        height: 1600,
        alt: "The GoCocoon Journal - Handcrafted Crochet Guides",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Artisan Crochet Journal & Guides | GoCocoon India",
    description: "Expert tips on caring for and styling handmade crochet pieces.",
    images: ["https://www.gococoon.store/instagram-post.jpg"],
  },
};

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2623] font-sans selection:bg-[#F3D5CF] selection:text-[#5B2920]">
      <Header />

      <main className="max-w-7xl mx-auto px-6 sm:px-10 py-16 sm:py-24 space-y-16 text-left">
        {/* Breadcrumb */}
        <div className="text-xs font-serif text-stone-500 space-x-2">
          <Link href="/" className="hover:text-[#B06B5B] underline">Home</Link>
          <span>/</span>
          <span className="text-stone-800 font-bold">Artisan Journal & Guides</span>
        </div>

        {/* Hero Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF0EA] border border-[#F3D5CF] text-[#B06B5B] text-xs font-bold uppercase tracking-[0.2em]">
            <span>📖</span>
            <span>The GoCocoon Journal</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-header font-bold text-[#2C2623] tracking-tight">
            Crochet Wisdom, Styling Guides & Yarn Stories
          </h1>
          <p className="text-stone-600 font-serif text-sm sm:text-base leading-relaxed">
            Written by <strong>Mehak Agarwal</strong> and the GoCocoon atelier. Delve into the gentle world of slow-knitted heirlooms, milk cotton care, and effortless styling.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.slug}
              className="bg-white rounded-3xl overflow-hidden border border-[#EAE1D3] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden bg-stone-100 relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-white/90 backdrop-blur-xs text-[#B06B5B] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 sm:p-7 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-stone-500 font-serif">
                    <span>{new Date(post.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h2 className="text-xl font-header font-bold text-[#2C2623] group-hover:text-[#B06B5B] transition-colors leading-snug">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-xs text-stone-600 font-serif leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 sm:p-7 sm:pt-0">
                <Link
                  href={`/blog/${post.slug}`}
                  className="w-full py-3 rounded-xl bg-[#FAF5EE] hover:bg-[#2C2623] text-stone-800 hover:text-white text-xs font-bold uppercase tracking-wider text-center transition block"
                >
                  Read Full Guide &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
