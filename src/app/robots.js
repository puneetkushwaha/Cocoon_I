export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/cart", "/profile", "/shop"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/", "/products/", "/instagram-post.jpg", "/*.jpg", "/*.png", "/*.webp", "/*.svg"],
      },
      {
        userAgent: "Pinterestbot",
        allow: ["/", "/products/", "/category/", "/blog/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/admin/", "/api/", "/cart", "/profile", "/shop"],
      },
    ],
    sitemap: "https://www.gococoon.store/sitemap.xml",
    host: "https://www.gococoon.store",
  };
}
