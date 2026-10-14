export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/cart", "/profile"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/", "/products/", "/instagram-post.jpg", "/*.jpg", "/*.png", "/*.webp", "/*.svg"],
      },
    ],
    sitemap: "https://www.gococoon.store/sitemap.xml",
    host: "https://www.gococoon.store",
  };
}
