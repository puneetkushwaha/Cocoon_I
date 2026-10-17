import { PRODUCTS } from "@/data/products";
import { BLOG_POSTS } from "@/data/blogPosts";

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
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
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

  const categoryLandingPages = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  const blogPages = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "weekly",
    priority: 0.8,
    images: [`${baseUrl}${post.image}`],
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

  return [...staticPages, ...categoryLandingPages, ...blogPages, ...productPages];
}
