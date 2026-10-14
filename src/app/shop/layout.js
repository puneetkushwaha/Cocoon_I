import { PRODUCTS } from "@/data/products";

export const metadata = {
  title: "Shop Handcrafted Crochet Drops & Collections | GoCocoon India",
  description: "Browse the complete collection of handcrafted crochet bags, totes, hair accessories, waist belts, bandanas, and bespoke lucky charms made with 100% pure organic milk cotton at GoCocoon.",
  keywords: [
    "GoCocoon shop",
    "buy crochet bags online India",
    "crochet tops India",
    "crochet accessories boutique",
    "handmade crochet tote",
    "milk cotton crochet",
    "slow fashion India",
    "crochet bandanas",
    "crochet belts"
  ],
  alternates: {
    canonical: "https://www.gococoon.store/shop",
  },
  openGraph: {
    title: "Shop Handcrafted Crochet Drops & Collections | GoCocoon India",
    description: "Browse artisanal slow-fashion crochet essentials handcrafted in India knot-by-knot.",
    url: "https://www.gococoon.store/shop",
    siteName: "GoCocoon",
    images: [
      {
        url: "https://www.gococoon.store/products/items/chocolate-bow-handbag.jpg",
        width: 800,
        height: 800,
        alt: "GoCocoon Handcrafted Crochet Collection",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop Handcrafted Crochet Drops & Collections | GoCocoon India",
    description: "Browse artisanal slow-fashion crochet essentials handcrafted in India knot-by-knot.",
    images: ["https://www.gococoon.store/products/items/chocolate-bow-handbag.jpg"],
  },
};

export default function ShopLayout({ children }) {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "GoCocoon Handcrafted Crochet Drops & Catalog",
    description: "Artisanal slow-fashion crochet essentials made with organic milk cotton in India by Mehak Agarwal.",
    url: "https://www.gococoon.store/shop",
    isPartOf: {
      "@type": "WebSite",
      name: "GoCocoon",
      url: "https://www.gococoon.store",
    },
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "GoCocoon Featured Crochet Handcrafted Catalog",
    description: "Bestselling handcrafted crochet bags, bandanas, scrunchies, and bespoke gifts.",
    url: "https://www.gococoon.store/shop",
    numberOfItems: PRODUCTS.length,
    itemListElement: PRODUCTS.slice(0, 20).map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://www.gococoon.store/product/${product.id}`,
      name: product.name,
      image: product.imgUrl?.startsWith("http")
        ? product.imgUrl
        : `https://www.gococoon.store${product.imgUrl}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      {children}
    </>
  );
}
