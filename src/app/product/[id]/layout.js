import { PRODUCTS } from "@/data/products";

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    id: String(product.id),
  }));
}

export async function generateMetadata({ params }) {
  const unwrappedParams = await params;
  const productId = Number(unwrappedParams.id);
  const product = PRODUCTS.find((p) => p.id === productId);

  if (!product) {
    return {
      title: "Handcrafted Crochet Treasure",
      description: "Artisanal slow-fashion crochet piece handcrafted in India with pure organic milk cotton.",
    };
  }

  const categoryName = product.category ? (product.category.charAt(0).toUpperCase() + product.category.slice(1).replace("-", " ")) : "Crochet";
  const materialLabel = product.materials || "Handcrafted Cotton Cord";
  const title = `${product.name} | Handcrafted ${categoryName}`;
  const fullTitle = `${title} | Cocoon`;
  const description = `${product.desc} Artisanal slow-fashion handcrafted knot-by-knot in India (${materialLabel}). Price: ₹${product.price}. Express pan-India dispatch.`;
  const pageUrl = `https://www.gococoon.store/product/${product.id}`;
  const imageUrl = product.imgUrl?.startsWith("http")
    ? product.imgUrl
    : `https://www.gococoon.store${product.imgUrl}`;

  return {
    title,
    description,
    keywords: [
      product.name,
      `handmade ${product.name}`,
      `crochet ${categoryName}`,
      "Cocoon",
      "Cocoon store",
      "COCOON crochet",
      "organic milk cotton crochet",
      "crochet boutique India"
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: pageUrl,
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
  const productId = Number(unwrappedParams.id);
  const product = PRODUCTS.find((p) => p.id === productId);

  const categoryName = product?.category 
    ? (product.category.charAt(0).toUpperCase() + product.category.slice(1).replace("-", " ")) 
    : "Crochet";

  const breadcrumbSchema = product
    ? {
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
            item: `https://www.gococoon.store/product/${product.id}`
          }
        ]
      }
    : null;

  return (
    <>
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {children}
    </>
  );
}
