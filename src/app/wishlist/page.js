"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { STORE } from "@/data/store";
import { PRODUCTS } from "@/data/products";

export default function WishlistPage() {
  const router = useRouter();

  const [wishlist, setWishlist] = useState([]);
  const [storeProducts, setStoreProducts] = useState(PRODUCTS);
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync wishlist & products
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const saved = localStorage.getItem("cocoon_wishlist");
        if (saved) {
          const parsed = JSON.parse(saved);
          setWishlist(Array.isArray(parsed) ? parsed : []);
        } else {
          setWishlist([]);
        }
      } catch (e) {
        setWishlist([]);
      }
      setStoreProducts(STORE.getProducts());
    };

    loadWishlist();

    window.addEventListener("cocoon_store_update", loadWishlist);
    window.addEventListener("storage", loadWishlist);
    return () => {
      window.removeEventListener("cocoon_store_update", loadWishlist);
      window.removeEventListener("storage", loadWishlist);
    };
  }, []);

  // Map wishlist IDs to full product objects
  const wishlistedItems = useMemo(() => {
    return wishlist
      .map((entry) => {
        if (typeof entry === "object" && entry?.id) return entry;
        return storeProducts.find((p) => p.id === Number(entry));
      })
      .filter(Boolean);
  }, [wishlist, storeProducts]);

  // Remove from Wishlist
  const handleRemove = (productId) => {
    const updated = wishlist.filter((entry) => {
      const id = typeof entry === "object" ? entry.id : Number(entry);
      return id !== productId;
    });
    setWishlist(updated);
    try {
      localStorage.setItem("cocoon_wishlist", JSON.stringify(updated));
      window.dispatchEvent(new Event("cocoon_store_update"));
    } catch (e) {}
    triggerToast("Item removed from your wishlist.");
  };

  // Add to Bag
  const handleAddToBag = (product) => {
    try {
      const savedCart = sessionStorage.getItem("cocoon_temp_cart") || localStorage.getItem("cocoon_temp_cart");
      let currentCart = savedCart ? JSON.parse(savedCart) : [];
      const itemColor = product.colors ? product.colors[0] : "Standard";

      const existingIndex = currentCart.findIndex((i) => i.id === product.id && i.color === itemColor);
      if (existingIndex > -1) {
        currentCart[existingIndex].quantity += 1;
      } else {
        currentCart.push({ ...product, color: itemColor, quantity: 1 });
      }

      sessionStorage.setItem("cocoon_temp_cart", JSON.stringify(currentCart));
      localStorage.setItem("cocoon_temp_cart", JSON.stringify(currentCart));
      window.dispatchEvent(new Event("cocoon_store_update"));
      triggerToast(`Added "${product.name}" to your basket!`);
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2623] font-sans antialiased selection:bg-[#F3D5CF] selection:text-[#5B2920] flex flex-col justify-between">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2C2623] text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-serif flex items-center gap-2 animate-bounce">
          
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. MASTER UNIFIED NAVBAR */}
      <Header />

      {/* 2. MAIN WISHLIST CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full text-left">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-serif text-stone-500 mb-6">
          <Link href="/" className="hover:text-[#B06B5B] transition">Home</Link>
          <span>/</span>
          <span className="text-stone-800 font-semibold">Wishlist</span>
        </div>

        {/* Wishlist Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b border-[#EFE8DD] gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#B06B5B] block">
              Personal Collection
            </span>
            <h1 className="text-3xl sm:text-4xl font-header font-light text-[#2C2623] mt-1">
              My Wishlist
            </h1>
            <p className="text-xs text-[#2C2623]/60 font-serif mt-1">
              Every piece is lovingly hand-knitted using pure organic milk cotton.
            </p>
          </div>

          <span className="px-4 py-1.5 rounded-full bg-[#FAF0ED] text-[#B06B5B] border border-[#ECCEC7] text-xs font-bold uppercase tracking-wider shrink-0 self-start sm:self-auto">
            {wishlistedItems.length} {wishlistedItems.length === 1 ? "Treasure" : "Treasures"} Saved
          </span>
        </div>

        {/* 3. WISHLIST PRODUCT GRID */}
        {wishlistedItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 sm:p-16 border border-[#E8DFC9] text-center space-y-4 max-w-2xl mx-auto my-12 shadow-xs">
            <svg className="w-16 h-16 mx-auto text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            <h2 className="text-2xl font-header text-[#2C2623]">Your wishlist is currently empty</h2>
            <p className="text-xs text-[#2C2623]/70 font-serif max-w-md mx-auto leading-relaxed">
              Explore our slow handcrafted accessories, handbags, and heirloom scarves. Tap the heart on any piece to save it here.
            </p>
            <div className="pt-2">
              <Link
                href="/#p4-treasures"
                className="inline-block px-7 py-3 rounded-full bg-[#B06B5B] hover:bg-[#975647] text-white text-xs font-bold uppercase tracking-wider transition shadow-md hover:scale-105"
              >
                Shop All Products &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {wishlistedItems.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EAE1D3] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  {/* Product Image Clickable to /product/[id] */}
                  <Link
                    href={`/product/${product.id}`}
                    className="block relative aspect-square rounded-2xl overflow-hidden bg-[#FAF6F0] mb-4 cursor-pointer"
                  >
                    <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[9px] font-black uppercase tracking-wider text-[#B06B5B] shadow-2xs">
                      Handcrafted
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemove(product.id);
                      }}
                      className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/95 text-rose-500 hover:bg-rose-50 flex items-center justify-center transition shadow-2xs cursor-pointer"
                      title="Remove from Wishlist"
                    >
                      ✕
                    </button>

                    <img
                      src={product.imgUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                    />
                  </Link>

                  {/* Title & Category Clickable to /product/[id] */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-sans font-bold uppercase text-[#B06B5B] tracking-wider block">
                      {product.category}
                    </span>
                    <Link
                      href={`/product/${product.id}`}
                      className="font-header font-bold text-base text-[#2C2623] hover:text-[#B06B5B] transition block line-clamp-1"
                      title={product.name}
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-[#2C2623]/60 font-serif line-clamp-2">
                      {product.desc}
                    </p>
                  </div>
                </div>

                {/* Price & Action Buttons */}
                <div className="pt-4 mt-4 border-t border-[#F4EFEA] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-sans font-bold text-lg text-[#2C2623]">Rs. {product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs font-sans text-stone-400 line-through ml-2">
                          Rs. {product.originalPrice}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      In Stock
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/product/${product.id}`}
                      className="py-2.5 rounded-xl border border-stone-300 hover:border-[#2C2623] text-stone-800 text-center text-xs font-bold uppercase tracking-wider transition"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleAddToBag(product)}
                      className="py-2.5 rounded-xl bg-[#2C2623] hover:bg-[#B06B5B] text-white text-xs font-bold uppercase tracking-wider transition shadow-2xs cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>+ Bag</span>
                      
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>

      {/* 4. MASTER STUDIO FOOTER */}
      <Footer />

    </div>
  );
}
