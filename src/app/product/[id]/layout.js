import { PRODUCTS } from "@/data/products";
import { permanentRedirect, notFound } from "next/navigation";

export async function generateStaticParams() {
  return PRODUCTS.filter((product) => product.slug).map((product) => ({
    id: product.slug,
  }));
}

export async function generateMetadata({ params }) {
  const unwrappedParams = await params;
  const rawId = unwrappedParams.id;
  const product = PRODUCTS.find((p) => p.slug === rawId || String(p.id) === String(rawId));

  if (!product) {
    return {
      title: "Handcrafted Crochet Treasure",
      description: "Artisanal slow-fashion crochet piece handcrafted in India with pure organic milk cotton.",
    };
  }

  const categoryName = product.category ? (product.category.charAt(0).toUpperCase() + product.category.slice(1).replace("-", " ")) : "Crochet";
  const materialLabel = product.materials || "Handcrafted Cotton Cord";
  const title = product.targetKeyword
    ? `${product.name} - ${product.targetKeyword}`
    : `${product.name} | Handcrafted ${categoryName}`;
  const fullTitle = `${title} | Cocoon`;
  const description = product.targetKeyword
    ? `${product.desc} Buy ${product.targetKeyword} online. 100% handmade in India (${materialLabel}). Price: ₹${product.price}. Cash on Delivery & fast dispatch.`
    : `${product.desc} Artisanal slow-fashion handcrafted knot-by-knot in India (${materialLabel}). Price: ₹${product.price}. Express pan-India dispatch.`;
  const canonicalUrl = `https://www.gococoon.store/product/${product.slug || product.id}`;
  const imageUrl = product.imgUrl?.startsWith("http")
    ? product.imgUrl
    : `https://www.gococoon.store${product.imgUrl}`;

  return {
    title,
    description,
    keywords: [
      product.name,
      product.targetKeyword,
      ...(product.secondaryKeywords || []),
      `handmade ${product.name}`,
      `crochet ${categoryName}`,
      "crochet bags in india",
      "best crochet bags",
      "Cocoon",
      "Cocoon store",
      "COCOON crochet",
      "organic milk cotton crochet",
      "crochet boutique India"
    ].filter(Boolean),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: "Cocoon",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: `${product.name} - Handcrafted Crochet by Cocoon`,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailLayout({ children, params }) {
  const unwrappedParams = await params;
  const rawId = unwrappedParams.id;
  const product = PRODUCTS.find((p) => p.slug === rawId || String(p.id) === String(rawId));

  if (!product) {
    notFound();
  }

  // Backward compatibility: If accessed via numeric ID or uncanonical slug, permanent 301/308 redirect
  if (product.slug && rawId !== product.slug) {
    permanentRedirect(`/product/${product.slug}`);
  }

  const categoryName = product.category 
    ? (product.category.charAt(0).toUpperCase() + product.category.slice(1).replace("-", " ")) 
    : "Crochet";

  const canonicalUrl = `https://www.gococoon.store/product/${product.slug || product.id}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.gococoon.store"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Collections",
        item: "https://www.gococoon.store/collections"
      },
      {
        "@type": "ListItem",
        position: 3,
        name: categoryName,
        item: `https://www.gococoon.store/collections/${product.category || "bags"}`
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: canonicalUrl
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
