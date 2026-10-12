export const metadata = {
  title: "Shop All Handcrafted Drops & Collections | COCOON",
  description: "Browse the complete collection of handcrafted crochet bags, totes, hair accessories, waist belts, bandanas, and lucky charms made with 100% pure organic milk cotton.",
  alternates: {
    canonical: "https://www.gococoon.store/shop",
  },
  openGraph: {
    title: "Shop All Handcrafted Drops & Collections | COCOON",
    description: "Browse artisanal slow-fashion crochet essentials handcrafted in India knot-by-knot.",
    url: "https://www.gococoon.store/shop",
    siteName: "COCOON",
    images: [
      {
        url: "https://www.gococoon.store/products/items/chocolate-bow-handbag.jpg",
        width: 800,
        height: 800,
        alt: "COCOON Handcrafted Crochet Collection",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop All Handcrafted Drops & Collections | COCOON",
    description: "Browse artisanal slow-fashion crochet essentials handcrafted in India knot-by-knot.",
    images: ["https://www.gococoon.store/products/items/chocolate-bow-handbag.jpg"],
  },
};

export default function ShopLayout({ children }) {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "COCOON Handcrafted Crochet Drops & Catalog",
    description: "Artisanal slow-fashion crochet essentials made with organic milk cotton.",
    url: "https://www.gococoon.store/shop",
    isPartOf: {
      "@type": "WebSite",
      name: "COCOON",
      url: "https://www.gococoon.store",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      {children}
    </>
  );
}
