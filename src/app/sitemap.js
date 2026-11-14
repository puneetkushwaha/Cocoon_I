import { PRODUCTS } from "@/data/products";
import { BLOG_POSTS } from "@/data/blogPosts";
import { CATEGORY_SEO_DATA } from "@/data/categories";

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
      priority: 0.95,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/custom-order`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/story`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
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

  const categories = Object.keys(CATEGORY_SEO_DATA);

  // High-priority dedicated collection authority landing pages (Loomsmith SEO model)
  const collectionPages = categories.map((cat) => {
    const previewProduct = PRODUCTS.find((p) => p.category === cat);
    return {
      url: `${baseUrl}/collections/${cat}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
      images: [
        previewProduct?.imgUrl?.startsWith("http")
          ? previewProduct.imgUrl
          : `${baseUrl}${previewProduct?.imgUrl || "/instagram-post.jpg"}`,
      ],
    };
  });

  const blogPages = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "weekly",
    priority: 0.8,
    images: [`${baseUrl}${post.image}`],
  }));

  const productPages = PRODUCTS.map((product) => ({
    url: `${baseUrl}/product/${product.slug || product.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
    images: [
      product.imgUrl?.startsWith("http")
        ? product.imgUrl
        : `${baseUrl}${product.imgUrl}`,
    ],
  }));

  return [
    ...staticPages,
    ...collectionPages,
    ...blogPages,
    ...productPages,
  ];
}
