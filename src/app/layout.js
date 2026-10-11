import { ReactLenis } from "lenis/react";
import "./globals.css";

export const metadata = {
  title: "COCOON | Luxury Handcrafted Crochet Boutique",
  description: "Discover slow-crafted organic milk cotton crochet essentials, handbags, apparel, and bespoke heirloom accessories handmade knot-by-knot.",
  metadataBase: new URL("https://cocoon-psi.vercel.app"),
  openGraph: {
    title: "COCOON | Luxury Handcrafted Crochet Boutique",
    description: "Slow-crafted organic milk cotton crochet pieces made with care and patience.",
    url: "https://cocoon-psi.vercel.app",
    siteName: "COCOON",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 800,
        alt: "COCOON Handcrafted Crochet",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "COCOON | Handcrafted Crochet Boutique",
    description: "100% Pure Organic Milk Cotton • Handmade with Care",
    images: ["/logo.jpg"],
  },
};

import CookieConsent from "@/components/CookieConsent";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Nunito+Sans:wght@300;400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#221F1F] antialiased">
        <ReactLenis root>
          {children}
        </ReactLenis>
        <CookieConsent />
      </body>
    </html>
  );
}
