export const metadata = {
  title: "Shopping Bag & Checkout | COCOON Handcrafted Crochet",
  description: "Review your handcrafted crochet items and complete your purchase with secure direct UPI or Card payment.",
  alternates: {
    canonical: "https://www.gococoon.store/cart",
  },
  robots: {
    index: false, // Don't index checkout bags
    follow: true,
  },
};

export default function CartLayout({ children }) {
  return children;
}
