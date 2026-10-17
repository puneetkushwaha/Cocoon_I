export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/cart", "/wishlist", "/profile", "/login", "/review"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/", "/products/", "/instagram-post.jpg", "/*.jpg", "/*.png", "/*.webp", "/*.svg"],
      },
      {
        userAgent: "Pinterestbot",
        allow: ["/", "/products/", "/category/", "/blog/", "/shop"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/admin/", "/api/", "/cart", "/wishlist", "/profile", "/login", "/review"],
      },
    ],
    sitemap: "https://www.gococoon.store/sitemap.xml",
    host: "https://www.gococoon.store",
  };
}
