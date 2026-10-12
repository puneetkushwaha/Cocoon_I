export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/cart", "/profile"],
      },
    ],
    sitemap: "https://www.gococoon.store/sitemap.xml",
  };
}
