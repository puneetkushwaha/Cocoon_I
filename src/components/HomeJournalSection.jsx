import Link from "next/link";
import { BLOG_POSTS } from "@/data/blogPosts";

export default function HomeJournalSection() {
  if (!BLOG_POSTS || BLOG_POSTS.length === 0) return null;

  const newestPost = BLOG_POSTS[0];
  const otherPosts = BLOG_POSTS.slice(1, 3);

  return (
    <section className="py-20 sm:py-28 bg-[#FDFBF7] border-t border-[#EAE1D3] text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#EAE1D3] pb-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0ED] border border-[#F3D5CF] text-[#B06B5B] text-xs font-bold uppercase tracking-[0.2em]">
              <svg className="w-3.5 h-3.5 text-[#B06B5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
              <span>The Artisan Journal</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-header font-bold text-[#2C2623] tracking-tight">
              Stories, Styling Guides & Yarn Care
            </h2>
            <p className="text-stone-600 font-serif text-sm sm:text-base leading-relaxed">
              Explore mindful essays on organic milk cotton, hair health, and slow-crafted heirlooms written by founder Mehak Agarwal.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#EAE1D3] text-[#2C2623] hover:text-[#B06B5B] hover:border-[#B06B5B] text-xs font-bold uppercase tracking-wider shadow-2xs hover:shadow-md transition-all self-start md:self-auto"
          >
            <span>Explore All Guides ({BLOG_POSTS.length})</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {/* Layout: Newest Post (Hero Spotlight) + Recent Posts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Newest Post (Span 7) */}
          <article className="lg:col-span-7 bg-white rounded-3xl border border-[#EAE1D3] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="aspect-[16/10] overflow-hidden bg-stone-100 relative">
                <img
                  src={newestPost.image}
                  alt={newestPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                  <span className="bg-[#B06B5B] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                    Latest Guide
                  </span>
                  {newestPost.tags && newestPost.tags[0] && (
                    <span className="bg-white/95 backdrop-blur-xs text-[#2C2623] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-2xs">
                      {newestPost.tags[0]}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-3 text-xs font-sans text-stone-500">
                  <span className="font-bold text-[#B06B5B]">{newestPost.author}</span>
                  <span>•</span>
                  <span>{newestPost.readTime}</span>
                  <span>•</span>
                  <span>{new Date(newestPost.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-header font-bold text-[#2C2623] group-hover:text-[#B06B5B] transition-colors leading-snug">
                  <Link href={`/blog/${newestPost.slug}`}>
                    {newestPost.title}
                  </Link>
                </h3>

                <p className="text-stone-600 font-serif text-sm sm:text-base leading-relaxed line-clamp-3">
                  {newestPost.excerpt || newestPost.subtitle}
                </p>
              </div>
            </div>

            <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-2">
              <Link
                href={`/blog/${newestPost.slug}`}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B06B5B] hover:text-[#2C2623] transition-colors"
              >
                <span>Read Full Story</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </article>

          {/* Recent Side Posts (Span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            {otherPosts.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-3xl border border-[#EAE1D3] p-5 sm:p-6 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row gap-5 group"
              >
                <div className="w-full sm:w-36 h-36 rounded-2xl overflow-hidden bg-stone-100 shrink-0">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex flex-col justify-between space-y-2">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[11px] font-sans text-stone-400">
                      <span>{post.readTime}</span>
                      <span>•</span>
                      <span>{new Date(post.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</span>
                    </div>
                    <h4 className="font-header font-bold text-base sm:text-lg text-[#2C2623] group-hover:text-[#B06B5B] transition-colors line-clamp-2 leading-snug">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h4>
                    <p className="text-stone-500 font-serif text-xs line-clamp-2 leading-relaxed">
                      {post.excerpt || post.subtitle}
                    </p>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-[11px] font-bold uppercase tracking-wider text-[#B06B5B] hover:text-[#2C2623] transition inline-block pt-1"
                  >
                    Read Guide &rarr;
                  </Link>
                </div>
              </article>
            ))}

            {/* Newsletter / Custom Advice Banner */}
            <div className="bg-[#FAF5EE] rounded-3xl border border-[#EAE1D3] p-6 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B06B5B] block">Bespoke Inquiries</span>
              <h4 className="font-header font-bold text-lg text-[#2C2623]">Have a Custom Idea in Mind?</h4>
              <p className="text-xs text-stone-600 font-serif leading-relaxed">
                Connect directly with Mehak on WhatsApp to craft a custom colorway, size, or pattern.
              </p>
              <Link
                href="/custom-order"
                className="text-xs font-bold uppercase tracking-wider text-[#2C2623] hover:text-[#B06B5B] underline inline-block pt-1"
              >
                Inquire for Custom Craft &rarr;
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
