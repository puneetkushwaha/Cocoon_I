import { ReactLenis } from "lenis/react";
import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: {
    default: "Cocoon | Handcrafted Crochet Bags, Belts & Accessories India",
    template: "%s | Cocoon",
  },
  description: "Discover authentic handcrafted crochet bags, statement totes, hair accessories, waist wraps, bandanas & heirloom gifts at Cocoon. Artisanal slow-fashion hand-crocheted knot-by-knot in India by Mehak Agarwal. All-India express delivery.",
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
  authors: [{ name: "Mehak Agarwal", url: "https://www.gococoon.store" }],
  creator: "Mehak Agarwal",
  publisher: "Cocoon",
  metadataBase: new URL("https://www.gococoon.store"),
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
    other: {
      "msvalidate.01": "03F5A5A02DCA945B4D9EBACC8CFEC530",
      "p:domain_verify": "e48294a85e7b8892830350c1f28c1bf0",
    },
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
    title: "Cocoon | Handcrafted Crochet Boutique India",
    description: "Slow-crafted organic milk cotton crochet essentials, handbags, hair accessories & bespoke gifts handmade knot-by-knot in India by Mehak Agarwal.",
    url: "https://www.gococoon.store",
    siteName: "Cocoon",
    images: [
      {
        url: "/instagram-post.jpg",
        width: 1200,
        height: 1600,
        alt: "Cocoon Handcrafted Luxury Crochet Essentials",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cocoon | Handcrafted Crochet Boutique India",
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
      name: "Cocoon",
      alternateName: ["COCOON", "Cocoon Crochet", "Cocoon Store", "COCOON Handcrafted Crochet"],
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
      name: "Cocoon",
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
    }
  ];

  return (
    <html lang="en" className="max-w-full overflow-x-hidden overflow-x-clip">
      <head>
        <meta name="p:domain_verify" content="e48294a85e7b8892830350c1f28c1bf0" />
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
