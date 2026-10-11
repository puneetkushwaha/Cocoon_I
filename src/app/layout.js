import { ReactLenis } from "lenis/react";
import "./globals.css";

export const metadata = {
  title: {
    default: "COCOON | Handcrafted Crochet Boutique India",
    template: "%s | COCOON",
  },
  description: "Discover slow-crafted organic milk cotton crochet essentials, handbags, hair accessories, waist belts, bandanas, and bespoke heirloom gifts handmade knot-by-knot in India by Mehak.",
  keywords: [
    "crochet",
    "crochet bags India",
    "handcrafted crochet boutique",
    "COCOON crochet",
    "gococoon",
    "gococoon.store",
    "organic milk cotton crochet",
    "handmade gifts India",
    "crochet bandanas",
    "crochet hair ties",
    "sunflower crochet backpack",
    "bespoke crochet order",
    "crochet slow fashion",
  ],
  authors: [{ name: "Mehak Agarwal", url: "https://gococoon.store" }],
  creator: "Mehak Agarwal",
  publisher: "COCOON",
  metadataBase: new URL("https://gococoon.store"),
  alternates: {
    canonical: "https://gococoon.store",
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
    title: "COCOON | Handcrafted Crochet Boutique India",
    description: "Slow-crafted organic milk cotton crochet pieces made with care and patience.",
    url: "https://gococoon.store",
    siteName: "COCOON",
    images: [
      {
        url: "/instagram-post.jpg",
        width: 1200,
        height: 1600,
        alt: "COCOON Handcrafted Luxury Crochet Essentials",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "COCOON | Handcrafted Crochet Boutique",
    description: "100% Pure Organic Milk Cotton • Handmade with Care in India",
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
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "OnlineStore",
              name: "COCOON",
              url: "https://gococoon.store",
              logo: "https://gococoon.store/icon.svg",
              description: "Handcrafted Slow Crochet Essentials & Heirloom Boutique by Mehak Agarwal.",
              founder: {
                "@type": "Person",
                name: "Mehak Agarwal",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+91-8171902255",
                contactType: "Customer Service",
                areaServed: "IN",
                availableLanguage: ["English", "Hindi"],
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen w-full max-w-full overflow-x-hidden overflow-x-clip flex flex-col bg-[#FAF6F0] text-[#221F1F] antialiased">
        <ReactLenis root options={{ autoRaf: true, smoothTouch: false }}>
          {children}
        </ReactLenis>
        <CookieConsent />
      </body>
    </html>
  );
}
