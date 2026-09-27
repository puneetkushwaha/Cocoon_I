import { Cormorant_Garamond, Nunito_Sans } from "next/font/google";
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
  title: "COCOON | Handcrafted Crochet Studio",
  description: "Discover uniquely designed and intricately woven handcrafted crochet essentials made with 100% organic milk cotton.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${nunitoSans.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2C2623] antialiased">
        {children}
      </body>
    </html>
  );
}
