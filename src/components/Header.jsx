"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { STORE } from "@/data/store";

export default function Header({ onOpenCart, cartCountOverride }) {
  const router = useRouter();

  const [tickerList, setTickerList] = useState([
    "100% Handcrafted with Organic Milk Cotton",
    "Complimentary Organic Cotton Packaging",
    "Free Shipping on Orders Above Rs. 999",
    "Bespoke Heirloom Custom Pieces",
    "Hypoallergenic Premium Milk Cotton Cord"
  ]);

  const [customerUser, setCustomerUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  // Sync Header Data across all pages
  useEffect(() => {
    const syncHeader = () => {
      // Sync Categories
      try {
        const storedCats = STORE.getCategories();
        if (storedCats && storedCats.length > 0) {
          setCategories(storedCats);
        }
      } catch (e) {}
      // Sync Ticker
      try {
        const storedTicker = STORE.getTicker();
        if (storedTicker && storedTicker.length > 0) {
          setTickerList(storedTicker);
        }
      } catch (e) {}

      // Sync Customer User
      try {
        const savedUser = localStorage.getItem("cocoon_customer_user");
        if (savedUser) {
          setCustomerUser(JSON.parse(savedUser));
        } else {
          setCustomerUser(null);
        }
      } catch (e) {}

      // Sync Wishlist Count
      try {
        const savedWish = localStorage.getItem("cocoon_wishlist");
        if (savedWish) {
          const parsed = JSON.parse(savedWish);
          setWishlistCount(Array.isArray(parsed) ? parsed.length : 0);
        } else {
          setWishlistCount(0);
        }
      } catch (e) {}

      // Sync Cart Count
      try {
        const savedCart = sessionStorage.getItem("cocoon_temp_cart");
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          const totalQty = Array.isArray(parsed)
            ? parsed.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0)
            : 0;
          setCartCount(totalQty);
        } else {
          setCartCount(0);
        }
      } catch (e) {}
    };

    syncHeader();

    const asyncSync = () => {
      setTimeout(syncHeader, 0);
    };

    window.addEventListener("cocoon_store_update", asyncSync);
    window.addEventListener("storage", asyncSync);
    return () => {
      window.removeEventListener("cocoon_store_update", asyncSync);
      window.removeEventListener("storage", asyncSync);
    };
  }, []);

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const effectiveCartCount = cartCountOverride !== undefined ? cartCountOverride : cartCount;

  return (
    <>
      {/* 1. MASTER ANNOUNCEMENT TICKER (Consistent Across All Pages) */}
      <div className="w-full max-w-full overflow-hidden bg-[#221F1F] text-white py-2 whitespace-nowrap text-[11px] font-semibold tracking-wider relative z-50" style={{ contain: "paint" }}>
        <div className="animate-marquee inline-flex items-center gap-10">
          {tickerList.map((msg, idx) => (
            <span key={idx} className="inline-flex items-center gap-10">
              <span>{msg}</span>
              <span className="text-rose-300 font-bold">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* 2. MASTER STICKY GLASS NAVBAR (Consistent Across All Pages) */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/65 backdrop-blur-xl backdrop-saturate-180 border-b border-[#EAE0D2]/50 shadow-[0_8px_32px_0_rgba(44,38,35,0.04)] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Brand Wordmark: Cocoon */}
            <Link href="/" className="group flex items-center select-none py-1 text-left">
              <span className="font-header text-3xl sm:text-4xl font-light tracking-[0.28em] uppercase text-[#231F20] group-hover:text-[#B06B5B] transition-colors duration-300 leading-none">
                COCOON
              </span>
            </Link>

            {/* Nav links with Glass Pill container */}
            <nav className="hidden md:flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2C2623] bg-white/40 backdrop-blur-md p-1.5 rounded-full border border-white/70 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
              <Link href="/#shop" className="px-4 py-2 rounded-full hover:bg-white/80 hover:text-stone-900 transition-all duration-200">
                All Drops
              </Link>
              <Link href="/#categories" className="px-4 py-2 rounded-full hover:bg-white/80 hover:text-stone-900 transition-all duration-200">
                Categories
              </Link>
              <Link href="/#custom-order" className="px-4 py-2 rounded-full hover:bg-white/80 hover:text-stone-900 transition-all duration-200">
                Custom Order
              </Link>
              <Link href="/#our-story" className="px-4 py-2 rounded-full hover:bg-white/80 text-[#B06B5B] transition-all duration-200 flex items-center gap-1">
                Letter from Mehak
              </Link>
            </nav>

            {/* Actions: Wishlist, Cart & Profile/Login (Desktop) + Minimal Menu (Mobile) */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              
              {/* Dedicated Full Wishlist Icon Button (Desktop Only) */}
              <Link
                href="/wishlist"
                className="hidden md:flex relative w-10 h-10 rounded-full bg-white/50 backdrop-blur-md hover:bg-white/85 text-stone-700 hover:text-rose-600 border border-white/70 shadow-xs transition-all items-center justify-center cursor-pointer group hover:scale-105"
                title="Wishlist"
                aria-label="Wishlist"
              >
                <svg
                  className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                    wishlistCount > 0 ? "fill-rose-500 text-rose-500" : "fill-none stroke-current"
                  }`}
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Dedicated Shopping Bag Icon Button (Desktop Only) */}
              <Link
                href="/cart"
                className="hidden md:flex relative w-10 h-10 rounded-full bg-[#231F20]/90 backdrop-blur-md hover:bg-[#B06B5B] text-white shadow-xs transition-all items-center justify-center cursor-pointer group hover:scale-105 border border-white/20"
                title="Shopping Bag"
                aria-label="Shopping Bag"
              >
                <svg
                  className="w-5 h-5 transition-transform group-hover:scale-110"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
                  />
                </svg>
                {effectiveCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#B06B5B] text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs border border-white">
                    {effectiveCartCount}
                  </span>
                )}
              </Link>

              {/* Customer Account / Login Link (Desktop & Mobile) */}
              {customerUser ? (
                <Link
                  href="/profile"
                  className="hidden md:flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full bg-white/90 hover:bg-white text-[#2C2623] border border-[#B06B5B]/30 shadow-xs hover:shadow-md transition-all hover:scale-105 cursor-pointer group"
                  title={`My Account (${customerUser.name || "Customer"})`}
                  aria-label="My Account"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#B06B5B] to-[#975647] text-white flex items-center justify-center font-header font-bold text-xs shadow-xs">
                    {(customerUser.name?.trim() || customerUser.email?.trim() || "C").charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2C2623] group-hover:text-[#B06B5B] transition-colors max-w-[110px] truncate">
                    {customerUser.name?.split(" ")[0] || "Account"}
                  </span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#B06B5B] via-[#9F5647] to-[#8C4537] hover:from-[#9F5647] hover:to-[#7A3629] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-[#B06B5B]/30 hover:shadow-lg hover:shadow-[#B06B5B]/40 hover:scale-105 active:scale-95 transition-all duration-200 border border-white/30"
                  title="Sign In to Cocoon"
                >
                  <svg className="w-3.5 h-3.5 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span>Login</span>
                </Link>
              )}

              {/* Mobile Standout Quick Login / Profile Pill */}
              <Link
                href={customerUser ? "/profile" : "/login"}
                className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#B06B5B] to-[#8C4537] text-white text-[11px] font-bold uppercase tracking-wider shadow-xs hover:scale-105 active:scale-95 transition border border-white/20"
                title={customerUser ? "Account" : "Sign In"}
                aria-label={customerUser ? "Account" : "Sign In"}
              >
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <span>{customerUser ? (customerUser.name?.split(" ")[0] || "Profile") : "Login"}</span>
              </Link>

              {/* Mobile Luxury Minimalist Menu Pill Button (Mobile Phone Only) */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-[#EAE0D2] text-[#2C2623] hover:text-[#B06B5B] hover:border-[#B06B5B]/40 transition-all cursor-pointer active:scale-95 shadow-xs"
                aria-label="Open boutique menu"
              >
                <span className="text-[10px] font-sans font-bold tracking-[0.22em] uppercase">
                  Menu
                </span>
                {effectiveCartCount > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B06B5B]"></span>
                )}
                <div className="w-3.5 flex flex-col gap-1 items-end">
                  <span className="w-full h-[1.5px] bg-[#2C2623] rounded-full"></span>
                  <span className="w-2.5 h-[1.5px] bg-[#2C2623] rounded-full"></span>
                </div>
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Full-Screen Luxury Atelier Mobile Navigation Sheet */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[999] bg-[#FAF7F2] flex flex-col justify-between overflow-y-auto animate-fadeIn select-none text-left">
          
          {/* 1. Atelier Top Navigation Bar */}
          <div className="w-full px-5 py-4 flex items-center justify-between border-b border-[#EAE0D2] bg-[#FAF7F2]/95 backdrop-blur-md sticky top-0 z-30 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2"
            >
              <span className="font-header text-2xl tracking-[0.26em] uppercase text-[#231F20] font-light">
                COCOON
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] font-sans font-black text-[#B06B5B] px-2 py-0.5 rounded-full bg-[#FAF0ED] border border-[#F3D5CF]">
                Atelier
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#231F20] text-white hover:bg-[#B06B5B] transition-all text-[11px] font-sans font-bold uppercase tracking-wider cursor-pointer active:scale-95 shadow-xs"
              aria-label="Close menu"
            >
              <span>Close</span>
              <span className="text-sm font-light leading-none">&times;</span>
            </button>
          </div>

          {/* 2. Scrollable Editorial Body */}
          <div className="flex-1 px-5 py-6 space-y-7 max-w-lg mx-auto w-full">
            
            {/* Curated Categories Horizontal Visual Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-sans font-black uppercase tracking-[0.26em] text-[#B06B5B]">
                  Shop By Category
                </span>
                <Link
                  href="/#shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[11px] font-sans font-bold text-stone-500 hover:text-[#B06B5B] tracking-wide"
                >
                  View All &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {(categories.length > 0 ? categories : [
                  { id: "bags", name: "Bags & Totes", minPrice: 799, imgUrl: "/products/items/sunflower-granny-backpack.jpg" },
                  { id: "phone-cases", name: "Phone Sleeves", minPrice: 499, imgUrl: "/products/items/pastel-cherry-bow-phone-cases.jpg" },
                  { id: "hair-accessories", name: "Hair Ties", minPrice: 149, imgUrl: "/products/items/rose-ponytail-tie-pink.jpg" },
                  { id: "belts", name: "Belts & Wraps", minPrice: 449, imgUrl: "/products/items/white-lace-waist-belt.jpg" },
                  { id: "bandanas", name: "Bandanas", minPrice: 299, imgUrl: "/products/items/burgundy-triangle-bandana.jpg" },
                  { id: "keychains", name: "Lucky Charms", minPrice: 199, imgUrl: "/products/items/solo-evil-eye-keychain.jpg" }
                ]).map((cat) => (
                  <Link
                    key={cat.id}
                    href="/#shop"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      try {
                        const target = document.getElementById("shop") || document.getElementById("p4-treasures");
                        if (target) target.scrollIntoView({ behavior: "smooth" });
                      } catch (e) {}
                    }}
                    className="group bg-white rounded-2xl p-2.5 border border-[#EAE0D2] hover:border-[#B06B5B]/50 transition-all text-center flex flex-col items-center shadow-2xs hover:shadow-xs active:scale-95"
                  >
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-[#FAF6F0] border border-[#EAE0D2] mb-2 p-0.5">
                      <img
                        src={cat.imgUrl}
                        alt={cat.name}
                        className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-[11px] font-sans font-bold text-[#231F20] group-hover:text-[#B06B5B] transition-colors leading-tight line-clamp-1">
                      {cat.name}
                    </span>
                    <span className="text-[10px] font-sans text-stone-400 mt-0.5">
                      ₹{cat.minPrice}+
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Atelier Editorial Experiences (Curated Story Links) */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-sans font-black uppercase tracking-[0.26em] text-stone-400 block mb-2">
                Boutique Experiences
              </span>

              <div className="space-y-2">
                <Link
                  href="/#shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#EAE0D2] hover:border-[#B06B5B]/40 transition-all shadow-2xs group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#FAF0ED] text-[#B06B5B] flex items-center justify-center font-bold text-xs">
                      01
                    </div>
                    <div>
                      <h4 className="font-header text-lg font-medium text-[#231F20] group-hover:text-[#B06B5B] transition-colors leading-tight">
                        All Drops &amp; Curated Vault
                      </h4>
                      <p className="text-[11px] font-sans text-stone-400">
                        Explore complete limited collection
                      </p>
                    </div>
                  </div>
                  <span className="text-stone-400 group-hover:text-[#B06B5B] group-hover:translate-x-1 transition-transform text-sm">
                    &rarr;
                  </span>
                </Link>

                <Link
                  href="/#custom-order"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#EAE0D2] hover:border-[#B06B5B]/40 transition-all shadow-2xs group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#EAF0EC] text-[#2E4836] flex items-center justify-center font-bold text-xs">
                      02
                    </div>
                    <div>
                      <h4 className="font-header text-lg font-medium text-[#231F20] group-hover:text-[#2E4836] transition-colors leading-tight">
                        Bespoke Custom Orders
                      </h4>
                      <p className="text-[11px] font-sans text-stone-400">
                        Commission custom colorways &amp; initials
                      </p>
                    </div>
                  </div>
                  <span className="text-stone-400 group-hover:text-[#2E4836] group-hover:translate-x-1 transition-transform text-sm">
                    &rarr;
                  </span>
                </Link>

                <Link
                  href="/#our-story"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF0ED]/60 border border-[#F3D5CF] hover:border-[#B06B5B] transition-all shadow-2xs group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#B06B5B] text-white flex items-center justify-center font-serif italic text-sm">
                      M
                    </div>
                    <div>
                      <h4 className="font-header text-lg font-medium text-[#B06B5B] leading-tight">
                        Letter from Mehak
                      </h4>
                      <p className="text-[11px] font-sans text-[#B06B5B]/80 font-serif italic">
                        The philosophy of slow-knitting
                      </p>
                    </div>
                  </div>
                  <span className="text-[#B06B5B] group-hover:translate-x-1 transition-transform text-sm">
                    &rarr;
                  </span>
                </Link>
              </div>
            </div>

            {/* Client Bag & Wishlist Interactive Dock */}
            <div className="space-y-2.5 pt-1">
              <span className="text-[10px] font-sans font-black uppercase tracking-[0.26em] text-stone-400 block">
                Your Atelier Bag &amp; Saved
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/cart"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3.5 rounded-2xl bg-white border border-[#EAE0D2] hover:border-[#B06B5B] transition-all flex items-center justify-between shadow-2xs"
                >
                  <div>
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-400 block">
                      Bag
                    </span>
                    <span className="font-header font-bold text-base text-[#2C2623]">
                      {effectiveCartCount} {effectiveCartCount === 1 ? "Item" : "Items"}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#2C2623]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                    </svg>
                  </div>
                </Link>

                <Link
                  href="/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3.5 rounded-2xl bg-white border border-[#EAE0D2] hover:border-[#B06B5B] transition-all flex items-center justify-between shadow-2xs"
                >
                  <div>
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-400 block">
                      Wishlist
                    </span>
                    <span className="font-header font-bold text-base text-[#2C2623]">
                      {wishlistCount} Saved
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                    <svg className="w-4 h-4 fill-none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </div>
                </Link>
              </div>

              {/* Account / Login Pill */}
              <Link
                href={customerUser ? "/profile" : "/login"}
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#B06B5B] via-[#9F5647] to-[#8C4537] hover:from-[#9F5647] hover:to-[#7A3629] text-white flex items-center justify-between transition-all shadow-md shadow-[#B06B5B]/25 border border-white/20 active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xs font-bold border border-white/30">
                    {(customerUser?.name?.trim() || customerUser?.email?.trim() || "C").charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-rose-100 block">
                      {customerUser ? "Signed In Customer" : "Studio Access"}
                    </span>
                    <span className="text-xs font-sans font-bold text-white leading-tight">
                      {customerUser ? `My Account (${customerUser.name || "Customer"})` : "Login / Register"}
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-white text-[#B06B5B] text-xs font-black tracking-wider shadow-xs">
                  {customerUser ? "View" : "Sign In"} &rarr;
                </span>
              </Link>
            </div>

          </div>

          {/* 3. Luxury Bottom Footer & WhatsApp Concierge */}
          <div className="w-full px-5 py-4 border-t border-[#EAE0D2] bg-white/60 backdrop-blur-md text-stone-500 font-sans text-xs space-y-2 max-w-lg mx-auto">
            <div className="flex items-center justify-between">
              <a
                href="https://wa.me/918171902255"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#EBF5ED] text-[#236338] hover:bg-[#236338] hover:text-white transition-all font-bold text-[11px]"
              >
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
                WhatsApp Concierge
              </a>
              <a
                href="https://www.instagram.com/cocoon._.u/"
                target="_blank"
                rel="noreferrer"
                className="text-stone-700 hover:text-[#B06B5B] font-bold text-[11px] underline underline-offset-4"
              >
                @cocoon._.u
              </a>
            </div>
            <p className="text-[10px] text-stone-400 text-center pt-1 font-serif">
              Handcrafted Knot-by-Knot • 100% Organic Milk Cotton • Free Shipping over ₹999
            </p>
          </div>

        </div>
      )}
    </>
  );
}
