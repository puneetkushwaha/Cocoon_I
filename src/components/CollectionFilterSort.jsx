"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export default function CollectionFilterSort({
  products = [],
  subcategories = [],
  categoryName = "Collection",
  categorySlug = ""
}) {
  const [selectedSubcat, setSelectedSubcat] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

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
      <div className="bg-white/80 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-[#EAE1D3] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Subcategory Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-left">
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
                    ? "bg-[#B06B5B] text-white shadow-xs scale-102"
                    : "bg-[#FAF5EE] text-stone-700 hover:bg-[#F2EAE0] border border-[#EAE1D3]"
                }`}
              >
                {sub.name}
              </button>
            );
          })}
        </div>

        {/* Counter & Sort By Dropdown */}
        <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#EAE1D3]/60">
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

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => {
            const discountPercent = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;

            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group bg-white rounded-3xl p-3 sm:p-3.5 border border-[#EAE1D3] hover:border-[#B06B5B] shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="aspect-square rounded-2xl overflow-hidden bg-[#FAF5EE] relative mb-3">
                  <img
                    src={product.imgUrl}
                    alt={`${product.name} - Handcrafted Crochet by GoCocoon`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                    {product.badge && (
                      <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[10px] font-bold uppercase tracking-wider text-[#B06B5B] shadow-2xs">
                        {product.badge}
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[#526B57] text-white text-[9px] font-bold tracking-wider">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {/* Free Delivery Pill */}
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-white/90 text-stone-600 text-[9px] font-mono tracking-tight shadow-2xs">
                    Free Delivery ₹999+
                  </div>
                </div>

                <div className="space-y-1.5 p-1 text-left">
                  <h3 className="font-header font-bold text-base text-[#2C2623] group-hover:text-[#B06B5B] transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  
                  <p className="text-xs text-stone-500 font-serif line-clamp-2 leading-relaxed">
                    {product.desc}
                  </p>

                  <div className="flex items-baseline justify-between pt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm sm:text-base font-bold text-[#2C2623]">
                        ₹{product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-stone-400 line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                    {product.reviews && (
                      <span className="text-[11px] text-amber-700 font-bold flex items-center gap-0.5">
                        ★ 5.0 <span className="text-stone-400 text-[9px]">({product.reviews})</span>
                      </span>
                    )}
                  </div>
                </div>
              </Link>
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
            className="inline-block mt-2 px-6 py-2 rounded-full bg-[#FAF5EE] text-[#B06B5B] border border-[#B06B5B]/30 text-xs font-bold hover:bg-[#B06B5B] hover:text-white transition"
          >
            Show All {categoryName}
          </button>
        </div>
      )}
    </div>
  );
}
