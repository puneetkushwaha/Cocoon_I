import { PRODUCTS } from "@/data/products";

export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

const GOOGLE_CATEGORY_MAP = {
  bags: "Apparel & Accessories > Handbags, Wallets & Cases > Handbags",
  belts: "Apparel & Accessories > Clothing Accessories > Belts",
  bandanas: "Apparel & Accessories > Clothing Accessories > Bandanas & Headties",
  keychains: "Apparel & Accessories > Handbag & Wallet Accessories > Keychains",
  "hair-accessories": "Apparel & Accessories > Clothing Accessories > Hair Accessories",
  "phone-cases": "Electronics > Communications > Telephony > Mobile Phone Accessories > Mobile Phone Cases"
};

function escapeXml(unsafe) {
  if (!unsafe) return "";
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const baseUrl = "https://www.gococoon.store";

  const itemsXml = PRODUCTS.map((product) => {
    const title = product.targetKeyword
      ? `${product.name} - ${product.targetKeyword}`
      : `${product.name} | Handcrafted Crochet`;

    const description = product.desc
      ? `${product.desc} 100% handcrafted slow-fashion knitwear made with ${product.materials || "organic milk cotton"} in India by Mehak Agarwal. Cash on delivery and free shipping available.`
      : `${product.name} handcrafted by Cocoon.`;

    const link = `${baseUrl}/product/${product.id}`;
    const imageUrl = product.imgUrl?.startsWith("http")
      ? product.imgUrl
      : `${baseUrl}${product.imgUrl}`;

    const googleCategory = GOOGLE_CATEGORY_MAP[product.category] || "Apparel & Accessories";
    const primaryColor = product.colors && product.colors.length > 0 ? product.colors[0] : "Multicolor";
    const material = product.materials || "100% Organic Milk Cotton";

    const shippingFee = product.price >= 999 ? "0.00" : "80.00";

    return `    <item>
      <g:id>COCOON-${product.id}</g:id>
      <title><![CDATA[${title}]]></title>
      <description><![CDATA[${description}]]></description>
      <link>${escapeXml(link)}</link>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>
      <g:brand>Cocoon</g:brand>
      <g:condition>new</g:condition>
      <g:availability>in_stock</g:availability>
      <g:price>${product.price}.00 INR</g:price>
      <g:google_product_category><![CDATA[${googleCategory}]]></g:google_product_category>
      <g:product_type><![CDATA[Crochet > ${product.category}]]></g:product_type>
      <g:identifier_exists>no</g:identifier_exists>
      <g:color><![CDATA[${primaryColor}]]></g:color>
      <g:material><![CDATA[${material}]]></g:material>
      <g:shipping>
        <g:country>IN</g:country>
        <g:service>Standard Express Delivery</g:service>
        <g:price>${shippingFee} INR</g:price>
      </g:shipping>
      <g:tax>
        <g:country>IN</g:country>
        <g:rate>0</g:rate>
        <g:tax_ship>no</g:tax_ship>
      </g:tax>
    </item>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Cocoon Handcrafted Crochet Store Products Feed</title>
    <link>${baseUrl}</link>
    <description>Official Google Shopping &amp; Merchant Center automated product feed for Cocoon - Artisanal slow-fashion handcrafted crochet boutique in India.</description>
${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
    },
  });
}
