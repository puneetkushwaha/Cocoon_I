import { BLOG_POSTS } from "@/data/blogPosts";

export async function generateMetadata({ params }) {
  const unwrappedParams = await params;
  const post = BLOG_POSTS.find((p) => p.slug === unwrappedParams.slug);

  if (!post) {
    return {
      title: "Artisan Guide | GoCocoon",
      description: "Crochet stories and craftsmanship guides from GoCocoon.",
    };
  }

  const title = `${post.title} | GoCocoon Journal`;
  const pageUrl = `https://www.gococoon.store/blog/${post.slug}`;
  const imageUrl = `https://www.gococoon.store${post.image}`;

  return {
    title,
    description: post.metaDescription,
    keywords: [
      ...post.tags,
      "crochet guide",
      "GoCocoon journal",
      "handmade crochet India",
      "milk cotton crochet"
    ],
    authors: [{ name: post.author }],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description: post.metaDescription,
      url: pageUrl,
      siteName: "GoCocoon",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: post.title,
        },
      ],
      locale: "en_IN",
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: post.metaDescription,
      images: [imageUrl],
    },
  };
}

export default async function BlogPostLayout({ children, params }) {
  const unwrappedParams = await params;
  const post = BLOG_POSTS.find((p) => p.slug === unwrappedParams.slug);

  const blogSchema = post
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.metaDescription,
        image: `https://www.gococoon.store${post.image}`,
        datePublished: post.date,
        dateModified: post.date,
        author: {
          "@type": "Person",
          name: post.author,
          jobTitle: post.authorRole,
          url: "https://www.gococoon.store",
        },
        publisher: {
          "@type": "Organization",
          name: "GoCocoon",
          logo: {
            "@type": "ImageObject",
            url: "https://www.gococoon.store/icon.svg",
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://www.gococoon.store/blog/${post.slug}`,
        },
      }
    : null;

  return (
    <>
      {blogSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
        />
      )}
      {children}
    </>
  );
}
