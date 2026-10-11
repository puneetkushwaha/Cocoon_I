import { ReactLenis } from "lenis/react";
import "./globals.css";

export const metadata = {
  title: "COCOON | Luxury Handcrafted Crochet Boutique",
  description: "Discover slow-crafted organic milk cotton crochet essentials, handbags, apparel, and bespoke heirloom accessories handmade knot-by-knot.",
  metadataBase: new URL("https://gococoon.store"),
  icons: {
    icon: [
      { url: "/icon.svg?v=3", type: "image/svg+xml" },
      { url: "/favicon.ico?v=3", sizes: "32x32" },
    ],
    shortcut: "/favicon.ico?v=3",
    apple: "/icon.svg?v=3",
  },
  openGraph: {
    title: "COCOON | Luxury Handcrafted Crochet Boutique",
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
    description: "100% Pure Organic Milk Cotton • Handmade with Care",
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
