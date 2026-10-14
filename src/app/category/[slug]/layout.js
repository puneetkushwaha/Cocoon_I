import { CATEGORY_SEO_DATA } from "@/data/categories";

export async function generateMetadata({ params }) {
  const unwrappedParams = await params;
  const catData = CATEGORY_SEO_DATA[unwrappedParams.slug];

  if (!catData) {
    return {
      title: "Handcrafted Crochet Collection | GoCocoon",
      description: "Artisanal crochet pieces handcrafted in India with pure organic milk cotton.",
    };
  }

  const pageUrl = `https://www.gococoon.store/category/${catData.slug}`;

  return {
    title: catData.metaTitle,
    description: catData.metaDescription,
    keywords: catData.keywords,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: catData.metaTitle,
      description: catData.metaDescription,
      url: pageUrl,
      siteName: "GoCocoon",
      images: [
        {
          url: "https://www.gococoon.store/products/items/chocolate-bow-handbag.jpg",
          width: 800,
          height: 800,
          alt: catData.name,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: catData.metaTitle,
      description: catData.metaDescription,
      images: ["https://www.gococoon.store/products/items/chocolate-bow-handbag.jpg"],
    },
  };
}

export default async function CategoryLayout({ children, params }) {
  const unwrappedParams = await params;
  const catData = CATEGORY_SEO_DATA[unwrappedParams.slug];

  const collectionSchema = catData
    ? {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: catData.h1,
        description: catData.metaDescription,
        url: `https://www.gococoon.store/category/${catData.slug}`,
        isPartOf: {
          "@type": "WebSite",
          name: "GoCocoon",
          url: "https://www.gococoon.store",
        },
      }
    : null;

  const breadcrumbSchema = catData
    ? {
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
            name: "Shop All",
            item: "https://www.gococoon.store/shop",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: catData.name,
            item: `https://www.gococoon.store/category/${catData.slug}`,
          },
        ],
      }
    : null;

  const faqSchema = catData?.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: catData.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a,
          },
        })),
      }
    : null;

  return (
    <>
      {collectionSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {children}
    </>
  );
}
