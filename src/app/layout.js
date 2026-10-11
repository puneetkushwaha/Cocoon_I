import { Cormorant_Garamond, Nunito_Sans } from "next/font/google";
import { ReactLenis } from "lenis/react";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"]
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

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
    <html
      lang="en"
      className={`${cormorant.variable} ${nunitoSans.variable} scroll-smooth`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#221F1F] antialiased">
        <ReactLenis root>
          {children}
        </ReactLenis>
        <CookieConsent />
      </body>
    </html>
  );
}
