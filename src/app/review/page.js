"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PRODUCTS } from "@/data/products";
import { STORE } from "@/data/store";
import { saveReviewToSupabase, uploadMediaToSupabase, saveCouponToSupabase } from "@/lib/supabase";

function ReviewContent() {
  const searchParams = useSearchParams();

  const paramOrderId = searchParams.get("orderId") || "";
  const paramProductId = searchParams.get("productId") || "";
  const paramProductName = searchParams.get("productName") || "";
  const paramName = searchParams.get("name") || "";
  const paramPhone = searchParams.get("phone") || "";

  // Selected product
  const [selectedProductId, setSelectedProductId] = useState(
    paramProductId ? Number(paramProductId) : (PRODUCTS[0]?.id || 1)
  );

  const activeProduct = PRODUCTS.find((p) => Number(p.id) === Number(selectedProductId)) || PRODUCTS[0];

  // Review form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [customerName, setCustomerName] = useState(paramName);
  const [customerPhone, setCustomerPhone] = useState(paramPhone);
  const [orderId, setOrderId] = useState(paramOrderId);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  // Media state (Image and Video support)
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null); // "image" | "video"

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedCoupon, setGeneratedCoupon] = useState("");
  const [couponCopied, setCouponCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Pre-load customer details from localStorage if not provided in URL
  useEffect(() => {
    if (!customerName || !customerPhone) {
      try {
        const saved = localStorage.getItem("cocoon_customer_user");
        if (saved) {
          const user = JSON.parse(saved);
          if (!customerName && user.name) setCustomerName(user.name);
          if (!customerPhone && user.phone) setCustomerPhone(user.phone);
        }
      } catch (e) {}
    }
  }, []);

  // Handle Media Select (Photo or Video)
  const handleMediaChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 25MB for videos/photos
    if (file.size > 25 * 1024 * 1024) {
      triggerToast("File size too large. Please select a file under 25MB.");
      return;
    }

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    if (!isVideo && !isImage) {
      triggerToast("Please upload an image (JPG, PNG, WebP) or video (MP4, MOV).");
      return;
    }

    setMediaFile(file);
    setMediaType(isVideo ? "video" : "image");
    setMediaPreview(URL.createObjectURL(file));
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
  };

  // Submit Review to Supabase & Store
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      triggerToast("Please enter your name");
      return;
    }

    if (!comment.trim()) {
      triggerToast("Please write a few words about your experience");
      return;
    }

    setIsSubmitting(true);
    triggerToast("Submitting your review to the atelier...");

    try {
      let uploadedMediaUrl = null;

      if (mediaFile) {
        uploadedMediaUrl = await uploadMediaToSupabase(mediaFile, "cocoon-media");
      }

      const reviewPayload = {
        id: `REV-${Date.now()}`,
        productId: Number(activeProduct.id),
        productName: activeProduct.name,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim() || null,
        rating: Number(rating),
        title: title.trim() || "Verified Handcrafted Review",
        comment: comment.trim(),
        mediaUrl: uploadedMediaUrl,
        orderId: orderId.trim() || null,
        date: new Date().toISOString(),
        verified: true,
        status: "Approved"
      };

      // 1. Generate unique random single-use coupon code
      const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
      const newCouponCode = `REV15-${randomSuffix}`;

      // 2. Save to Supabase DB 'reviews'
      await saveReviewToSupabase(reviewPayload);

      // 3. Save to local STORE for instant availability across the site
      STORE.addReview(reviewPayload);

      // 4. Register unique 1-time coupon in Supabase DB & Store
      await saveCouponToSupabase({
        code: newCouponCode,
        discountPercent: 15,
        orderId: orderId.trim() || null,
        reviewId: reviewPayload.id,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim() || null,
        createdAt: new Date().toISOString()
      });

      setGeneratedCoupon(newCouponCode);

      // Trigger global update event
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cocoon_store_update"));
      }

      setIsSuccess(true);
      triggerToast("Review published successfully! 🌸");
    } catch (err) {
      console.error("Error submitting review:", err);
      triggerToast("Could not submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCoupon = () => {
    const codeToCopy = generatedCoupon || "REV15";
    navigator.clipboard.writeText(codeToCopy);
    setCouponCopied(true);
    triggerToast(`Coupon code '${codeToCopy}' copied to clipboard! 🎉`);
    setTimeout(() => setCouponCopied(false), 3000);
  };

  const ratingDescriptions = {
    1: "Poor - Not satisfied",
    2: "Fair - Needs improvement",
    3: "Good - Average piece",
    4: "Very Good - Loved the crochet!",
    5: "Exceptional - Heirloom masterpiece! ✨"
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2623] font-sans antialiased pb-16">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#2C2623] text-white text-xs px-4 py-2.5 rounded-full shadow-lg border border-[#EAE0D2]/20 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* TOP HEADER (Exact typography as website) */}
      <header className="sticky top-0 z-30 bg-[#FAF7F2]/90 backdrop-blur-xl border-b border-[#EAE0D2]/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="group flex items-center select-none py-1">
            <span className="font-header text-2xl sm:text-3xl font-light tracking-[0.28em] uppercase text-[#231F20] group-hover:text-[#B06B5B] transition-colors duration-300 leading-none">
              COCOON
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white hover:bg-stone-50 border border-[#DDD3C4] text-[11px] font-bold text-[#2C2623] transition shadow-2xs"
          >
            <span>← Back to Shop</span>
          </Link>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-xl mx-auto px-4 pt-6">
        {!isSuccess ? (
          <div className="space-y-6">
            {/* INCENTIVE HERO BANNER */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-[#F7EBE8] via-[#FAF3ED] to-[#F1E9DF] border border-[#E8D4CC] shadow-xs text-center space-y-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#B06B5B] text-white text-[10px] font-bold uppercase tracking-wider shadow-2xs">
                ⭐ Verified Buyer Reward
              </span>
              <h1 className="text-xl sm:text-2xl font-header font-bold text-[#2C2623]">
                Rate Your Handcrafted Piece
              </h1>
              <p className="text-xs text-stone-600 font-serif leading-relaxed">
                Every knot was knitted with care in our studio. Share your honest feedback with a photo or video to unlock an instant <strong>flat 15% OFF discount voucher</strong> on your next purchase!
              </p>
            </div>

            {/* REVIEW FORM */}
            <form onSubmit={handleSubmitReview} className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE1D3] shadow-xs space-y-5">
              {/* Product Selection */}
              <div className="space-y-1.5 pb-4 border-b border-[#FAF4ED]">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                  Select Product You Received:
                </label>
                <div className="flex items-center gap-3 bg-[#FAF7F2] p-2.5 rounded-2xl border border-[#EAE1D3]">
                  <img
                    src={activeProduct.imgUrl}
                    alt={activeProduct.name}
                    className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <select
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(Number(e.target.value))}
                      className="w-full bg-white border border-[#DDD3C4] rounded-xl px-3 py-1.5 text-xs text-[#2C2623] font-semibold focus:outline-none focus:border-[#B06B5B]"
                    >
                      {PRODUCTS.map((prod) => (
                        <option key={prod.id} value={prod.id}>
                          {prod.name} (₹{prod.price})
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-stone-500 font-serif mt-1 truncate">
                      {activeProduct.category?.toUpperCase()} • {activeProduct.desc?.slice(0, 50)}...
                    </p>
                  </div>
                </div>
              </div>

              {/* Star Rating Picker */}
              <div className="space-y-1 text-center py-2 bg-[#FAF7F2] rounded-2xl border border-[#EAE1D3] p-4">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                  Your Overall Rating *
                </label>
                <div className="flex items-center justify-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="text-3xl sm:text-4xl transition-transform hover:scale-110 active:scale-95 cursor-pointer focus:outline-none"
                    >
                      <span className={star <= (hoverRating || rating) ? "text-amber-400" : "text-stone-300"}>
                        ★
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-xs font-semibold text-[#B06B5B] pt-1">
                  {ratingDescriptions[hoverRating || rating]}
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-[#FAF7F2] border border-[#DDD3C4] rounded-xl px-4 py-2.5 text-xs text-[#2C2623] focus:outline-none focus:border-[#B06B5B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">Mobile / WhatsApp (Optional)</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="For verified buyer badge"
                    className="w-full bg-[#FAF7F2] border border-[#DDD3C4] rounded-xl px-4 py-2.5 text-xs text-[#2C2623] focus:outline-none focus:border-[#B06B5B]"
                  />
                </div>
              </div>

              {/* Order ID Reference */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">Order ID (Optional)</label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. ORD-1234 (From your confirmation email)"
                  className="w-full bg-[#FAF7F2] border border-[#DDD3C4] rounded-xl px-4 py-2.5 text-xs text-[#2C2623] focus:outline-none focus:border-[#B06B5B]"
                />
              </div>

              {/* Review Headline */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">Review Headline</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. In love with the color and milk cotton feel!"
                  className="w-full bg-[#FAF7F2] border border-[#DDD3C4] rounded-xl px-4 py-2.5 text-xs text-[#2C2623] focus:outline-none focus:border-[#B06B5B]"
                />
              </div>

              {/* Review Comment */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">Detailed Review & Experience *</label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="How is the stitch tension? How are you styling it with your bags or keys? How was the packaging?"
                  className="w-full bg-[#FAF7F2] border border-[#DDD3C4] rounded-xl px-4 py-2.5 text-xs text-[#2C2623] focus:outline-none focus:border-[#B06B5B]"
                />
              </div>

              {/* PHOTO & VIDEO MEDIA ATTACHMENT */}
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EAE1D3] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block">
                      Attach Photo or Video Review (Optional)
                    </label>
                    <p className="text-[10px] text-stone-500 font-serif">
                      Supports JPG, PNG, MP4, MOV videos up to 25MB
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Photos & Videos
                  </span>
                </div>

                {!mediaPreview ? (
                  <label className="border-2 border-dashed border-[#DDD3C4] hover:border-[#B06B5B] rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition bg-white/60 hover:bg-white group">
                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">📸 🎥</span>
                    <span className="text-xs font-bold text-[#2C2623]">Click to upload Photo or Video</span>
                    <span className="text-[10px] text-stone-400 mt-0.5">Showcase your piece in natural light</span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleMediaChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden border border-stone-300 bg-black/5 p-2">
                    <button
                      type="button"
                      onClick={handleRemoveMedia}
                      className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-[#2C2623] text-white flex items-center justify-center text-xs font-bold shadow-md hover:bg-red-600 transition cursor-pointer"
                      title="Remove media"
                    >
                      ✕
                    </button>

                    {mediaType === "video" ? (
                      <div className="space-y-1">
                        <video
                          src={mediaPreview}
                          controls
                          className="w-full max-h-60 rounded-xl object-contain bg-black"
                        />
                        <span className="text-[10px] text-stone-500 font-semibold block text-center">
                          🎥 Video attached ({mediaFile?.name})
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <img
                          src={mediaPreview}
                          alt="Review preview"
                          className="w-full max-h-60 rounded-xl object-contain bg-stone-100"
                        />
                        <span className="text-[10px] text-stone-500 font-semibold block text-center">
                          📸 Photo attached ({mediaFile?.name})
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-[#B06B5B] hover:bg-[#975647] text-white font-bold text-xs uppercase tracking-wider transition shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer text-center"
              >
                {isSubmitting ? "Uploading & Publishing Review..." : "Submit Review & Unlock 15% OFF"}
              </button>
            </form>
          </div>
        ) : (
          /* ========================================================================= */
          /* SUCCESS STATE: 15% DISCOUNT VOUCHER CELEBRATION                          */
          /* ========================================================================= */
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE1D3] shadow-md text-center space-y-5 animate-fadeIn">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#B06B5B] block">
                Feedback Recorded
              </span>
              <h2 className="text-2xl font-header font-bold text-[#2C2623]">
                Thank You, {customerName}! 💖
              </h2>
              <p className="text-xs text-stone-600 font-serif leading-relaxed max-w-md mx-auto">
                Your review has been saved and will inspire other crochet lovers when the store drops new collections.
              </p>
            </div>

            {/* EXCLUSIVE 15% OFF COUPON CARD */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#FFF8F5] via-[#FCF3EC] to-[#F7EBE8] border-2 border-dashed border-[#B06B5B]/50 shadow-xs space-y-3">
              <div className="flex items-center justify-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B06B5B]">
                  Your Exclusive Reward
                </span>
                <span className="text-[9px] font-black uppercase tracking-wider bg-[#B06B5B] text-white px-2 py-0.5 rounded-full">
                  1-Time Use Only
                </span>
              </div>
              <h3 className="text-lg font-header font-bold text-[#2C2623]">
                Flat 15% OFF On Your Next Order
              </h3>
              
              <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
                <div className="px-5 py-3 rounded-2xl bg-white border border-[#B06B5B] text-base font-black tracking-[0.2em] text-[#B06B5B] shadow-2xs font-mono select-all">
                  {generatedCoupon || "REV15-XXXXX"}
                </div>
                <button
                  type="button"
                  onClick={handleCopyCoupon}
                  className="px-4 py-3 rounded-2xl bg-[#2C2623] hover:bg-[#B06B5B] text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
                >
                  {couponCopied ? "✓ Copied!" : "Copy Code"}
                </button>
              </div>

              <p className="text-[11px] text-stone-600 font-serif">
                This unique voucher is linked to your review and order. Valid for a single checkout across all handcrafted drops.
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-2 pt-2">
              <Link
                href={`/?coupon=${encodeURIComponent(generatedCoupon || '')}`}
                className="w-full py-3.5 rounded-2xl bg-[#B06B5B] hover:bg-[#975647] text-white font-bold text-xs uppercase tracking-wider block transition shadow-md"
              >
                🛍️ Apply 15% OFF & Continue Shopping &rarr;
              </Link>
              <Link
                href="/"
                className="w-full py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs block transition"
              >
                Visit Shop
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="max-w-xl mx-auto px-4 pt-12 text-center space-y-2 border-t border-[#EAE0D2]/60 mt-12">
        <p className="text-xs font-bold tracking-widest uppercase text-stone-600">
          COCOON
        </p>
        <p className="text-[11px] text-stone-500 font-serif">
          100% Organic Milk Cotton • Hypoallergenic & Handmade with Care
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-[11px] text-stone-600">
          <Link href="/" className="hover:text-[#B06B5B] font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 px-3 py-1 rounded-full border border-stone-200 transition">
            Shop Catalog
          </Link>
          <a href="mailto:cocoon.by.mehak@gmail.com" className="hover:text-[#B06B5B] bg-stone-100/70 hover:bg-stone-200/80 px-3 py-1 rounded-full border border-stone-200/80 transition">
            cocoon.by.mehak@gmail.com
          </a>
          <a href="https://www.instagram.com/cocoon._.u/" target="_blank" rel="noreferrer" className="hover:text-[#B06B5B] bg-stone-100/70 hover:bg-stone-200/80 px-3 py-1 rounded-full border border-stone-200/80 transition">
            Instagram @cocoon._.u ↗
          </a>
        </div>
        <p className="text-[10px] text-stone-400 pt-1">
          © 2026 COCOON. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-stone-300 border-t-[#B06B5B] rounded-full animate-spin"></div>
      </div>
    }>
      <ReviewContent />
    </Suspense>
  );
}
