"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getCraftStats } from "@/lib/orderUtils";

export default function CollectionFilterSort({
  products = [],
  subcategories = [],
  categoryName = "Collection",
  categorySlug = ""
}) {
  const [selectedSubcat, setSelectedSubcat] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [wishlist, setWishlist] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("cocoon_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const toggleWishlist = (product) => {
    let updated;
    if (wishlist.includes(product.id)) {
      updated = wishlist.filter((id) => id !== product.id);
    } else {
      updated = [...wishlist, product.id];
    }
    setWishlist(updated);
    try {
      localStorage.setItem("cocoon_wishlist", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
    } catch (e) {}
  };

  const handleAddToCart = (product) => {
    try {
      const savedCart = sessionStorage.getItem("cocoon_temp_cart");
      let currentCart = savedCart ? JSON.parse(savedCart) : [];
      const existing = currentCart.find((i) => i.id === product.id);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        currentCart.push({ ...product, quantity: 1, selectedColor: product.colors?.[0] || "Standard" });
      }
      sessionStorage.setItem("cocoon_temp_cart", JSON.stringify(currentCart));
      window.dispatchEvent(new Event("storage"));
      alert(`Added "${product.name}" to your shopping basket!`);
    } catch (e) {}
  };

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by subcategory if specified
    if (selectedSubcat !== "all") {
      list = list.filter((p) => p.subcategory === selectedSubcat);
    }

    // Sort
    if (sortBy === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "reviews") {
      list.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    } else {
      // Default / popular: Keep original order
      list = list;
    }

    return list;
  }, [products, selectedSubcat, sortBy]);

  return (
    <div className="space-y-8">
      {/* Interactive Controls Bar: Subcategory Filter Pills & Sort Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE1D3]">
        
        {/* Subcategory Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-left">
          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 shrink-0 mr-1 hidden sm:inline">
            Filter:
          </span>
          {subcategories.map((sub) => {
            const isActive = selectedSubcat === sub.id;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSelectedSubcat(sub.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-[#B06B5B] text-white shadow-xs"
                    : "bg-[#FAF5EE] text-stone-700 hover:bg-[#F2EAE0] border border-[#EAE1D3]"
                }`}
              >
                {sub.name}
              </button>
            );
          })}
        </div>

        {/* Counter & Sort By Dropdown */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EAE1D3]/60">
          <span className="text-xs font-serif text-stone-500">
            Showing <strong className="text-stone-800">{filteredProducts.length}</strong> items
          </span>

          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs text-stone-500 font-mono hidden sm:inline">
              Sort:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#FAF5EE] border border-[#EAE1D3] text-stone-800 text-xs font-bold rounded-full px-3.5 py-1.5 focus:outline-none focus:border-[#B06B5B] cursor-pointer"
            >
              <option value="popular">Featured / Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="reviews">Top Customer Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid - Exactly matching Landing Page card design */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6 text-left">
          {filteredProducts.map((product) => {
            const isFav = wishlist.includes(product.id);
            const craft = getCraftStats(product);

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-3 sm:p-4 border border-[#EAE1D3] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-[#FAF6F0] mb-2.5">
                    {/* Wishlist Heart Button */}
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product)}
                      className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center transition cursor-pointer backdrop-blur-xs shadow-xs ${
                        isFav ? "bg-[#B06B5B] text-white" : "bg-white/90 text-stone-500 hover:text-[#B06B5B]"
                      }`}
                    >
                      ♥
                    </button>

                    {/* Badge */}
                    {product.badge && (
                      <span className="absolute top-2 left-2 z-10 bg-[#F8E5E1]/95 backdrop-blur-xs text-[#7A3F34] border border-[#ECCEC7] text-[8px] sm:text-[9px] font-sans font-bold uppercase px-2 py-0.5 rounded-full shadow-2xs">
                        {product.badge}
                      </span>
                    )}

                    <Link href={`/product/${product.id}`} prefetch={true} className="block w-full h-full">
                      <img
                        src={product.imgUrl}
                        alt={`${product.name} - Handcrafted Crochet by GoCocoon`}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                        loading="lazy"
                      />
                    </Link>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[9px] sm:text-[10px] font-sans font-bold uppercase text-[#B06B5B] tracking-wider block truncate">
                        {product.subcategory ? product.subcategory.replace('-', ' ') : product.category}
                      </span>
                      <span className="text-[8px] sm:text-[9px] font-bold text-[#7A3F34] bg-[#FAF4EE] px-1.5 py-0.5 rounded border border-[#EDE2D5] shrink-0">
                        {craft.hours}
                      </span>
                    </div>
                    
                    <Link href={`/product/${product.id}`} prefetch={true} className="block">
                      <h3
                        className="font-header font-bold text-xs sm:text-base text-[#2C2623] line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] leading-snug group-hover:text-[#B06B5B] transition cursor-pointer"
                        title={product.name}
                      >
                        {product.name}
                      </h3>
                    </Link>
                    
                    <p className="text-[10px] sm:text-[11px] font-sans text-[#2C2623]/60 truncate hidden sm:block">
                      {craft.knots} • {product.materials || "Handcrafted Milk Cotton"}
                    </p>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-[#FAF6F0] flex flex-col gap-2 mt-2.5">
                  <div className="flex items-baseline justify-between gap-1.5 flex-wrap">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-sans font-extrabold text-sm sm:text-base text-[#2C2623]">Rs. {product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-[10px] sm:text-xs font-sans text-stone-400 line-through">Rs. {product.originalPrice}</span>
                      )}
                    </div>
                    <span className="text-[8px] sm:text-[9px] font-sans font-bold text-[#8B483B] bg-[#FDF0ED] px-1.5 py-0.5 rounded border border-[#F5D5CE]">
                      10% OFF
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className="w-full py-2 px-3 rounded-xl bg-[#FAF5EE] hover:bg-[#B06B5B] text-[#2C2623] hover:text-white border border-[#E0D5C1] hover:border-[#B06B5B] font-sans text-[11px] font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                  >
                    <span>+ Add to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#EAE1D3] space-y-3">
          <p className="font-header text-xl text-stone-700">No pieces currently listed in this specific filter.</p>
          <p className="text-xs text-stone-500 font-serif">Try selecting "All {categoryName}" or request a bespoke commission.</p>
          <button
            type="button"
            onClick={() => setSelectedSubcat("all")}
            className="inline-block mt-2 px-6 py-2 rounded-full bg-[#FAF5EE] text-[#B06B5B] border border-[#B06B5B]/30 text-xs font-bold hover:bg-[#B06B5B] hover:text-white transition cursor-pointer"
          >
            Show All {categoryName}
          </button>
        </div>
      )}
    </div>
  );
}
