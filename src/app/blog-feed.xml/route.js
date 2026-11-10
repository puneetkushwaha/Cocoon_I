import { BLOG_POSTS } from "@/data/blogPosts";

export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

function escapeXml(unsafe) {
  if (!unsafe) return "";
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const baseUrl = "https://www.gococoon.store";

  const itemsXml = BLOG_POSTS.map((post) => {
    const link = `${baseUrl}/blog/${post.slug}`;
    const imageUrl = post.image.startsWith("http")
      ? post.image
      : `${baseUrl}${post.image}`;
    const pubDate = new Date(post.date).toUTCString();

    return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description><![CDATA[${post.excerpt || post.subtitle}]]></description>
      <pubDate>${pubDate}</pubDate>
      <author>Mehak Agarwal (Cocoon)</author>
      <enclosure url="${escapeXml(imageUrl)}" type="image/jpeg" length="0" />
      <media:content xmlns:media="http://search.yahoo.com/mrss/" url="${escapeXml(imageUrl)}" medium="image" />
    </item>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Cocoon Journal - Handcrafted Crochet Guides &amp; Stories</title>
    <link>${baseUrl}/blog</link>
    <description>Authentic artisan crochet wisdom, washing rituals, slow-fashion styling guides, and organic milk cotton stories from Cocoon India.</description>
    <language>en-IN</language>
    <atom:link href="${baseUrl}/blog-feed.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
    },
  });
}
