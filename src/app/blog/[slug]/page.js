import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BLOG_POSTS } from "@/data/blogPosts";
import { PRODUCTS } from "@/data/products";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }) {
  const unwrappedParams = await params;
  const post = BLOG_POSTS.find((p) => p.slug === unwrappedParams.slug);

  if (!post) {
    notFound();
  }

  const relatedProducts = PRODUCTS.filter((p) => p.category === post.relatedCategory).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2623] font-sans selection:bg-[#F3D5CF] selection:text-[#5B2920]">
      <Header />

      <article className="max-w-4xl mx-auto px-6 sm:px-10 py-16 sm:py-20 text-left space-y-12">
        {/* Breadcrumb */}
        <div className="text-xs font-serif text-stone-500 space-x-2">
          <Link href="/" className="hover:text-[#B06B5B] underline">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#B06B5B] underline">Artisan Journal</Link>
          <span>/</span>
          <span className="text-stone-800 font-bold line-clamp-1">{post.title}</span>
        </div>

        {/* Article Header */}
        <div className="space-y-4 border-b border-[#EAE1D3] pb-8">
          <div className="flex gap-2 flex-wrap">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-[#FAF0ED] text-[#B06B5B] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[#F3D5CF]"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-5xl font-header font-bold text-[#2C2623] tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-stone-600 font-serif leading-relaxed">
            {post.subtitle}
          </p>

          <div className="flex items-center gap-4 pt-4 text-xs font-sans text-stone-500 border-t border-[#EAE1D3]/60">
            <div className="w-10 h-10 rounded-full bg-[#B06B5B] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              M
            </div>
            <div>
              <p className="font-bold text-[#2C2623] text-sm">{post.author}</p>
              <p className="text-[11px] text-stone-500 font-serif">{post.authorRole} • {post.readTime}</p>
            </div>
            <div className="ml-auto text-[11px] text-stone-400 font-serif">
              {new Date(post.date).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="aspect-[16/9] rounded-3xl overflow-hidden bg-stone-100 shadow-md border border-[#EAE1D3]">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Main Content Body */}
        <div
          className="prose prose-stone max-w-none font-serif text-stone-800 leading-relaxed text-base sm:text-lg space-y-6 [&_h2]:font-header [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-bold [&_h2]:text-[#2C2623] [&_h2]:pt-6 [&_h3]:font-header [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#2C2623] [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:leading-relaxed [&_strong]:text-[#2C2623] [&_strong]:font-semibold"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Author Bio Box */}
        <div className="p-6 sm:p-8 bg-[#FAF5EE] rounded-3xl border border-[#EAE1D3] flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-[#B06B5B] text-white flex items-center justify-center text-2xl font-header font-bold shrink-0 shadow-md">
            M
          </div>
          <div className="space-y-1.5 text-center sm:text-left">
            <h4 className="font-header font-bold text-lg text-[#2C2623]">About Mehak Agarwal</h4>
            <p className="text-xs sm:text-sm text-stone-600 font-serif leading-relaxed">
              Mehak is the heart and hands behind GoCocoon. Dedicated to reviving slow artisanal needlework in India, she slow-knits made-to-order treasures using 100% pure organic milk cotton cord.
            </p>
          </div>
        </div>

        {/* Featured Handcrafted Pieces (Internal Linking Powerhouse) */}
        {relatedProducts.length > 0 && (
          <div className="pt-8 border-t border-[#EAE1D3] space-y-6">
            <div className="text-center sm:text-left">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B06B5B] block">Shop The Story</span>
              <h3 className="text-2xl font-header font-bold text-[#2C2623]">Featured Handcrafted Treasures</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((prod) => (
                <Link
                  key={prod.id}
                  href={`/product/${prod.id}`}
                  className="bg-white rounded-2xl p-4 border border-[#EAE1D3] shadow-xs hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="aspect-square rounded-xl overflow-hidden bg-stone-100">
                      <img
                        src={prod.imgUrl}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                    <h4 className="font-header font-bold text-sm text-[#2C2623] group-hover:text-[#B06B5B] transition-colors line-clamp-1">
                      {prod.name}
                    </h4>
                    <p className="text-xs font-bold text-stone-900">₹{prod.price}</p>
                  </div>
                  <span className="mt-3 w-full py-2 rounded-lg bg-stone-50 group-hover:bg-[#2C2623] group-hover:text-white text-stone-800 text-[10px] font-bold uppercase tracking-wider text-center transition block">
                    View Treasure &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="pt-6 flex justify-between items-center text-xs font-bold uppercase tracking-wider">
          <Link href="/blog" className="text-stone-600 hover:text-[#B06B5B] transition">
            &larr; Back to all Guides
          </Link>
          <Link href="/shop" className="text-[#B06B5B] hover:text-[#2C2623] transition">
            Explore All Collections &rarr;
          </Link>
        </div>
      </article>

      <Footer />
    </div>
  );
}
