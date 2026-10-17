import { ReactLenis } from "lenis/react";
import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: {
    default: "GoCocoon | Handcrafted Crochet Bags, Belts & Accessories India",
    template: "%s | GoCocoon Crochet Boutique",
  },
  description: "Discover authentic handcrafted crochet bags, statement totes, hair accessories, waist wraps, bandanas & heirloom gifts at GoCocoon. Artisanal slow-fashion hand-crocheted knot-by-knot in India by Mehak Agarwal. All-India express delivery.",
  keywords: [
    "GoCocoon",
    "GoCocoon store",
    "gococoon.store",
    "COCOON crochet",
    "cocoon crochet boutique",
    "handmade crochet bags India",
    "crochet handbag online India",
    "crochet waist belt India",
    "chunky crochet bag",
    "crochet bow knot handbag",
    "crochet bandanas India",
    "crochet waist scarf belt",
    "crochet hair scrunchies",
    "crochet claw clip",
    "sunflower crochet backpack",
    "crochet phone pouch sling",
    "evil eye crochet keychain",
    "organic milk cotton crochet",
    "slow fashion knitwear India",
    "handmade crochet gifts India",
    "artisanal crochet boutique",
    "bespoke custom crochet orders"
  ],
  authors: [{ name: "Mehak Agarwal", url: "https://www.gococoon.store" }],
  creator: "Mehak Agarwal",
  publisher: "GoCocoon",
  metadataBase: new URL("https://www.gococoon.store"),
  alternates: {
    canonical: "https://www.gococoon.store",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "googleaa021cb5a04c5bfc",
  },
  icons: {
    icon: [
      { url: "/icon.svg?v=3", type: "image/svg+xml" },
      { url: "/favicon.ico?v=3", sizes: "32x32" },
    ],
    shortcut: "/favicon.ico?v=3",
    apple: "/icon.svg?v=3",
  },
  openGraph: {
    title: "GoCocoon | Handcrafted Crochet Boutique India",
    description: "Slow-crafted organic milk cotton crochet essentials, handbags, hair accessories & bespoke gifts handmade knot-by-knot in India by Mehak Agarwal.",
    url: "https://www.gococoon.store",
    siteName: "GoCocoon",
    images: [
      {
        url: "/instagram-post.jpg",
        width: 1200,
        height: 1600,
        alt: "GoCocoon Handcrafted Luxury Crochet Essentials",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GoCocoon | Handcrafted Crochet Boutique India",
    description: "100% Pure Organic Milk Cotton • Handmade with Care in India by Mehak",
    images: ["/instagram-post.jpg"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

import CookieConsent from "@/components/CookieConsent";

export default function RootLayout({ children }) {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://www.gococoon.store/#website",
      name: "GoCocoon",
      alternateName: ["COCOON", "GoCocoon Crochet", "GoCocoon Store", "COCOON Handcrafted Crochet"],
      url: "https://www.gococoon.store",
      description: "Authentic handcrafted crochet boutique in India specializing in slow-crafted organic milk cotton bags, bandanas, belts & accessories.",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://www.gococoon.store/#shop"
        },
        "query-input": "required name=search_term_string"
      },
      inLanguage: "en-IN"
    },
    {
      "@context": "https://schema.org",
      "@type": "ClothingStore",
      "@id": "https://www.gococoon.store/#store",
      name: "GoCocoon",
      alternateName: "COCOON Handcrafted Crochet Boutique",
      url: "https://www.gococoon.store",
      logo: "https://www.gococoon.store/icon.svg",
      image: "https://www.gococoon.store/instagram-post.jpg",
      description: "Slow-crafted organic milk cotton crochet essentials, handbags, hair accessories, waist belts, bandanas, and bespoke heirloom gifts handmade knot-by-knot in India by Mehak Agarwal.",
      founder: {
        "@type": "Person",
        name: "Mehak Agarwal",
        jobTitle: "Lead Artisan & Founder",
        url: "https://www.gococoon.store"
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Agra",
        addressRegion: "Uttar Pradesh",
        postalCode: "282001",
        addressCountry: "IN"
      },
      email: "support@gococoon.store",
      telephone: "+91-8171902255",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-8171902255",
        contactType: "Customer Support",
        email: "support@gococoon.store",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"]
      },
      sameAs: [
        "https://www.instagram.com/cocoon._.u/",
        "https://wa.me/918171902255"
      ],
      knowsAbout: [
        "Handcrafted Crochet Bags",
        "Crochet Waist Belts",
        "Bohemian Bandanas",
        "Zero-Damage Crochet Hairwear",
        "Slow Fashion Knitwear India"
      ],
      priceRange: "₹ - ₹₹₹",
      currenciesAccepted: "INR",
      paymentAccepted: "Cash on Delivery, UPI, Credit Card, Debit Card, Net Banking",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "148",
        bestRating: "5",
        worstRating: "1"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": "https://www.gococoon.store/#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "Are GoCocoon products authentic handmade crochet?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, every single GoCocoon handbag, tote, phone pouch, bandana, and waist belt is 100% hand-knitted knot-by-knot in India by Mehak Agarwal using premium organic milk cotton. Authentic crochet cannot be replicated by industrial machine looms."
          }
        },
        {
          "@type": "Question",
          name: "Is Cash on Delivery (COD) available across India?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, GoCocoon provides verified Cash on Delivery (COD) with real-time SMS/email OTP verification and express courier dispatch across all serviceable pin codes in India."
          }
        },
        {
          "@type": "Question",
          name: "What yarn materials does GoCocoon use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We exclusively craft with 100% premium organic milk cotton yarn. It is breathable, ultra-soft, hypoallergenic, skin-friendly, anti-pilling, and holds crisp structural stitch tension for everyday use."
          }
        },
        {
          "@type": "Question",
          name: "How do I care for and wash handmade crochet bags and accessories?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Gently hand wash in cool or lukewarm water using mild liquid cleanser or baby shampoo. Press excess water out in a dry cotton towel without wringing, reshape the piece gently, and lay flat to dry in shade."
          }
        },
        {
          "@type": "Question",
          name: "Can I place a custom bespoke crochet commission?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes! Through our Bespoke Atelier, you can consult directly with lead artisan Mehak Agarwal on WhatsApp (+91 8171902255) to share Pinterest or Instagram references, choose custom shade palettes, and approve yarn swatches before crafting."
          }
        }
      ]
    }
  ];

  return (
    <html lang="en" className="max-w-full overflow-x-hidden overflow-x-clip">
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg?v=3" />
        <link rel="alternate icon" href="/favicon.ico?v=3" />
        <link rel="apple-touch-icon" href="/icon.svg?v=3" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Nunito+Sans:wght@300;400;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className="min-h-screen w-full max-w-full overflow-x-hidden overflow-x-clip flex flex-col bg-[#FAF6F0] text-[#221F1F] antialiased">
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-NKN54560S4"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-NKN54560S4', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        <ReactLenis root options={{ autoRaf: true, smoothTouch: false }}>
          {children}
        </ReactLenis>
        <CookieConsent />
      </body>
    </html>
  );
}
