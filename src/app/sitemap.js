import { PRODUCTS } from "@/data/products";

export default function sitemap() {
  const baseUrl = "https://www.gococoon.store";

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
      images: [`${baseUrl}/instagram-post.jpg`, `${baseUrl}/icon.svg`],
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/wishlist`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/refund`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const categories = [
    "bags",
    "belts",
    "bandanas",
    "keychains",
    "hair-accessories",
    "phone-cases",
  ];

  const categoryPages = categories.map((cat) => ({
    url: `${baseUrl}/shop?category=${cat}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.85,
  }));

  const productPages = PRODUCTS.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
    images: [
      product.imgUrl?.startsWith("http")
        ? product.imgUrl
        : `${baseUrl}${product.imgUrl}`
    ],
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
