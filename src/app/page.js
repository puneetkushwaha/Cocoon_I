import Preset4 from "@/components/presets/Preset4";

export const metadata = {
  title: "GoCocoon | Handcrafted Crochet Boutique India - Bags, Tops & Accessories",
  description: "Shop authentic artisanal crochet bags, floral bandanas, waist wraps, bow keychains & hair accessories. 100% pure organic milk cotton, handmade knot-by-knot in India by Mehak Agarwal. Free pan-India delivery available.",
  keywords: [
    "GoCocoon",
    "GoCocoon store",
    "gococoon.store",
    "COCOON crochet",
    "handmade crochet bags India",
    "crochet boutique India",
    "crochet tops online",
    "organic milk cotton crochet",
    "sunflower crochet bag",
    "crochet bandanas",
    "crochet hair accessories",
    "handcrafted gifts India"
  ],
  alternates: {
    canonical: "https://www.gococoon.store",
  },
  openGraph: {
    title: "GoCocoon | Handcrafted Crochet Boutique India",
    description: "Slow-crafted organic milk cotton crochet essentials handmade knot-by-knot in India by Mehak Agarwal.",
    url: "https://www.gococoon.store",
    siteName: "GoCocoon",
    images: [
      {
        url: "https://www.gococoon.store/instagram-post.jpg",
        width: 1200,
        height: 1600,
        alt: "GoCocoon Handcrafted Luxury Crochet Essentials",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function HomePage() {
  const homeFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Are GoCocoon products 100% handmade in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, every single piece at GoCocoon is meticulously hand-crocheted knot-by-knot in India by Mehak Agarwal and artisanal craftswomen using pure, non-allergic organic milk cotton yarn. We do not use machine knitting or factory mass-production."
        }
      },
      {
        "@type": "Question",
        name: "What handcrafted crochet items are available at GoCocoon?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "GoCocoon curates a slow-fashion boutique collection of handcrafted crochet handbags, tote bags, floral headscarf bandanas, boho waist wrap belts, flower scrunchies, claw clips, evil eye keychains, and mobile protection sleeves."
        }
      },
      {
        "@type": "Question",
        name: "How long does shipping take across India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Orders are prepared with care and dispatched via express courier partners (Shiprocket, Bluedart, Delhivery) across India. Packages typically arrive within 3 to 7 business days with end-to-end real-time tracking updates sent to your contact details."
        }
      },
      {
        "@type": "Question",
        name: "What payment methods are accepted on GoCocoon?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "GoCocoon accepts 100% secure payments via Razorpay supporting UPI (Google Pay, PhonePe, Paytm, BHIM), debit & credit cards, net banking, as well as verified Cash on Delivery (COD) across serviceable pin codes in India."
        }
      },
      {
        "@type": "Question",
        name: "Can I request custom colors or bespoke crochet orders?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! We welcome custom colorways and personalized heirloom orders. You can submit your idea through our Custom Order form on the website or connect directly with Mehak on WhatsApp at +91 8171902255."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqSchema) }}
      />
      <Preset4 />
    </>
  );
}
