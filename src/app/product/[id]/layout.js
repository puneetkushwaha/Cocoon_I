import { PRODUCTS } from "@/data/products";

export async function generateMetadata({ params }) {
  const unwrappedParams = await params;
  const productId = Number(unwrappedParams.id);
  const product = PRODUCTS.find((p) => p.id === productId);

  if (!product) {
    return {
      title: "Handcrafted Crochet Treasure | GoCocoon",
      description: "Artisanal slow-fashion crochet piece handcrafted in India with pure organic milk cotton.",
    };
  }

  const categoryName = product.category ? (product.category.charAt(0).toUpperCase() + product.category.slice(1).replace("-", " ")) : "Crochet";
  const title = `${product.name} | Handcrafted ${categoryName} | GoCocoon`;
  const description = `${product.desc} Handcrafted knot-by-knot in India using 100% pure organic milk cotton. Price: ₹${product.price}. All-India express delivery.`;
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
      "GoCocoon",
      "GoCocoon store",
      "COCOON crochet",
      "organic milk cotton crochet",
      "crochet boutique India"
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "GoCocoon",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: `${product.name} - Handcrafted Crochet by GoCocoon`,
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

  const categoryName = product?.category 
    ? (product.category.charAt(0).toUpperCase() + product.category.slice(1).replace("-", " ")) 
    : "Crochet";

  const productSchema = product
    ? {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: product.name,
        image: product.imgUrl?.startsWith("http")
          ? product.imgUrl
          : `https://www.gococoon.store${product.imgUrl}`,
        description: product.desc,
        sku: `COCOON-${product.id}`,
        mpn: `GC-PRD-${product.id}`,
        category: categoryName,
        material: product.materials || "100% Pure Organic Milk Cotton",
        color: product.colors?.join(", ") || "Artisanal Multi",
        countryOfOrigin: {
          "@type": "Country",
          name: "India"
        },
        brand: {
          "@type": "Brand",
          name: "GoCocoon",
          url: "https://www.gococoon.store"
        },
        offers: {
          "@type": "Offer",
          url: `https://www.gococoon.store/product/${product.id}`,
          priceCurrency: "INR",
          price: product.price,
          priceValidUntil: "2027-12-31",
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: {
            "@type": "Organization",
            name: "GoCocoon",
            url: "https://www.gococoon.store"
          },
          hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            applicableCountry: "IN",
            returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
            merchantReturnDays: 7,
            returnMethod: "https://schema.org/ReturnByMail",
            returnFees: "https://schema.org/FreeReturn"
          },
          shippingDetails: {
            "@type": "OfferShippingDetails",
            shippingRate: {
              "@type": "MonetaryAmount",
              value: "0",
              currency: "INR"
            },
            shippingDestination: {
              "@type": "DefinedRegion",
              addressCountry: "IN"
            },
            deliveryTime: {
              "@type": "ShippingDeliveryTime",
              handlingTime: {
                "@type": "QuantitativeValue",
                minValue: 1,
                maxValue: 2,
                unitCode: "d"
              },
              transitTime: {
                "@type": "QuantitativeValue",
                minValue: 2,
                maxValue: 5,
                unitCode: "d"
              }
            }
          }
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          reviewCount: product.reviews || 16,
        },
      }
    : null;

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
            name: "Shop All",
            item: "https://www.gococoon.store/#shop"
          },
          {
            "@type": "ListItem",
            position: 3,
            name: categoryName,
            item: `https://www.gococoon.store/category/${product.category || "bags"}`
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
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
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
