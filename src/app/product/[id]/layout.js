import { PRODUCTS } from "@/data/products";

export async function generateMetadata({ params }) {
  const unwrappedParams = await params;
  const productId = Number(unwrappedParams.id);
  const product = PRODUCTS.find((p) => p.id === productId);

  if (!product) {
    return {
      title: "Handcrafted Crochet Treasure | COCOON",
      description: "Artisanal slow-fashion crochet piece handcrafted in India with pure organic milk cotton.",
    };
  }

  const title = `${product.name} | Handcrafted Crochet | COCOON`;
  const description = `${product.desc} Handcrafted knot-by-knot in India using 100% pure organic milk cotton. Price: ₹${product.price}. All-India express dispatch.`;
  const pageUrl = `https://www.gococoon.store/product/${product.id}`;
  const imageUrl = product.imgUrl?.startsWith("http")
    ? product.imgUrl
    : `https://www.gococoon.store${product.imgUrl}`;

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "COCOON",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailLayout({ children, params }) {
  const unwrappedParams = await params;
  const productId = Number(unwrappedParams.id);
  const product = PRODUCTS.find((p) => p.id === productId);

  const productSchema = product
    ? {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: product.name,
        image: product.imgUrl?.startsWith("http")
          ? product.imgUrl
          : `https://www.gococoon.store${product.imgUrl}`,
        description: product.desc,
        brand: {
          "@type": "Brand",
          name: "COCOON",
        },
        offers: {
          "@type": "Offer",
          url: `https://www.gococoon.store/product/${product.id}`,
          priceCurrency: "INR",
          price: product.price,
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: {
            "@type": "Organization",
            name: "COCOON",
          },
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          reviewCount: product.reviews || 16,
        },
      }
    : null;

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      {children}
    </>
  );
}
