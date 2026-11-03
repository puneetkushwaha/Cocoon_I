import Preset4 from "@/components/presets/Preset4";

export const metadata = {
  title: "Cocoon | Handcrafted Crochet Bags, Belts & Accessories India",
  description: "Shop authentic artisanal crochet bags, floral bandanas, waist wraps, bow keychains & hair accessories. Slow-crafted knot-by-knot in India by Mehak Agarwal. Free all-India express delivery.",
  keywords: [
    "crochet bags",
    "crochet handbags",
    "crochet purse",
    "crochet tote",
    "crochet tote bag",
    "crochet sleeves",
    "crochet accessories",
    "crochet cotton",
    "cotton thread",
    "organic cotton",
    "crochet yarn",
    "crochet crossbody bag",
    "needle and thread",
    "cotton yarn for crochet",
    "milk cotton yarn",
    "crochet belt",
    "crochet shoulder bag",
    "cotton yarn",
    "organic cotton yarn",
    "granny square",
    "crochet needle",
    "handmade crochet bags",
    "cotton cord",
    "crochet thread",
    "milk cotton",
    "crochet pouch",
    "crochet sling bag",
    "crochet hooks",
    "crochet hand bag",
    "crochet shop",
    "pink crochet bag",
    "crochet scarf",
    "crochet cotton thread",
    "mercerized cotton yarn",
    "granny crochet",
    "crochet headband",
    "granny square crochet",
    "crochet granny square",
    "Cocoon",
    "Cocoon store",
    "gococoon.store",
    "COCOON crochet"
],
  alternates: {
    canonical: "https://www.gococoon.store",
  },
  openGraph: {
    title: "Cocoon | Handcrafted Crochet Boutique India",
    description: "Slow-crafted artisanal crochet bags, waist belts, bandanas & heirloom accessories handmade knot-by-knot in India by Mehak Agarwal.",
    url: "https://www.gococoon.store",
    siteName: "Cocoon",
    images: [
      {
        url: "https://www.gococoon.store/instagram-post.jpg",
        width: 1200,
        height: 1600,
        alt: "Cocoon Handcrafted Luxury Crochet Essentials",
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
        name: "Are Cocoon products 100% handmade in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, every single piece at Cocoon is meticulously hand-crocheted knot-by-knot in India by Mehak Agarwal and artisanal craftswomen using pure, non-allergic organic milk cotton yarn. We do not use machine knitting or factory mass-production."
        }
      },
      {
        "@type": "Question",
        name: "What handcrafted crochet items are available at Cocoon?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cocoon curates a slow-fashion boutique collection of handcrafted crochet handbags, tote bags, floral headscarf bandanas, boho waist wrap belts, flower scrunchies, claw clips, evil eye keychains, and mobile protection sleeves."
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
        name: "What payment methods are accepted on Cocoon?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cocoon accepts 100% secure payments via Razorpay supporting UPI (Google Pay, PhonePe, Paytm, BHIM), debit & credit cards, net banking, as well as verified Cash on Delivery (COD) across serviceable pin codes in India."
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
