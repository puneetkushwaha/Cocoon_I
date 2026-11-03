"use client";

import { useState } from "react";
import Link from "next/link";

export default function CategoryReviewsSection({
  reviews = [],
  categoryName = "Bags",
  products = []
}) {
  const [filterRating, setFilterRating] = useState("all");

  const filteredReviews = filterRating === "all"
    ? reviews
    : reviews.filter((r) => Number(r.rating) === Number(filterRating));

  const averageRating = (
    reviews.reduce((acc, curr) => acc + (Number(curr.rating) || 5), 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-12 border border-[#EAE1D3] space-y-8 text-left">
      {/* Header with Loomsmith-style "Let customers speak for us" header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EAE1D3] pb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#B06B5B] block mb-1">
            Verified Customer Love
          </span>
          <h2 className="text-2xl sm:text-3xl font-header font-bold text-[#2C2623]">
            Let customers speak for us
          </h2>
          <div className="flex items-center gap-2 pt-2">
            <div className="flex text-amber-500 text-sm">
              {"★★★★★"}
            </div>
            <span className="text-sm font-bold text-[#2C2623]">{averageRating} out of 5.0</span>
            <span className="text-xs text-stone-400 font-serif">
              • Based on {reviews.length} authentic customer experiences
            </span>
          </div>
        </div>

        {/* Filter by Stars */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setFilterRating("all")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
              filterRating === "all"
                ? "bg-[#B06B5B] text-white"
                : "bg-[#FAF5EE] text-stone-600 border border-[#EAE1D3]"
            }`}
          >
            All Reviews
          </button>
          <button
            type="button"
            onClick={() => setFilterRating("5")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
              filterRating === "5"
                ? "bg-[#B06B5B] text-white"
                : "bg-[#FAF5EE] text-stone-600 border border-[#EAE1D3]"
            }`}
          >
            5 ★ Only
          </button>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredReviews.map((rev) => {
          return (
            <div
              key={rev.id}
              className="bg-[#FAF7F2]/60 rounded-2xl p-5 border border-[#EAE1D3] space-y-3 flex flex-col justify-between hover:border-[#B06B5B]/50 transition shadow-2xs"
            >
              <div className="space-y-2.5">
                {/* Rating Stars & Verified Pill */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-500 text-xs tracking-wider">
                    {"★".repeat(rev.rating || 5)}
                  </div>
                  {rev.verified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                      Verified Buyer
                    </span>
                  )}
                </div>

                {/* Review Text */}
                {rev.title && (
                  <h4 className="font-header font-bold text-base text-[#2C2623] leading-snug">
                    {rev.title}
                  </h4>
                )}
                <p className="text-xs sm:text-sm text-stone-600 font-serif leading-relaxed line-clamp-4">
                  "{rev.comment}"
                </p>
              </div>

              {/* Reviewer Details & Product Badge */}
              <div className="pt-3 border-t border-[#EAE1D3]/70 space-y-2">
                {rev.mediaUrl && (
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-[#EAE1D3]">
                    <img
                      src={rev.mediaUrl}
                      alt="Customer review photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800">{rev.customerName}</span>
                  <span className="text-[10px] font-mono text-stone-400">
                    {rev.date ? new Date(rev.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "Verified Order"}
                  </span>
                </div>

                {rev.productName && (
                  <Link
                    href={`/product/${rev.productId}`}
                    className="inline-block text-[11px] text-[#B06B5B] hover:underline font-bold truncate max-w-full"
                  >
                    Piece: {rev.productName} &rarr;
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
