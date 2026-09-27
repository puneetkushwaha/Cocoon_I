"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/data/products";
import { STORE } from "@/data/store";
import { initiateRazorpayPayment } from "@/lib/razorpay";
import { saveOrderToSupabase, validateCouponFromSupabase, markCouponAsUsedInSupabase } from "@/lib/supabase";
import { captureLiveGpsAddress, lookupPincode } from "@/lib/location";

const POPULAR_CITIES = [
  "Agra", "New Delhi", "Delhi", "Noida", "Greater Noida", "Gurugram", "Ghaziabad", "Faridabad",
  "Lucknow", "Kanpur", "Jaipur", "Mumbai", "Pune", "Bengaluru", "Hyderabad", "Kolkata", "Chennai", 
  "Ahmedabad", "Surat", "Indore", "Bhopal", "Varanasi", "Prayagraj", "Mathura", "Aligarh", "Firozabad", 
  "Bareilly", "Meerut", "Moradabad", "Chandigarh", "Ludhiana", "Amritsar", "Dehradun", "Patna", "Ranchi", 
  "Nagpur", "Nashik", "Vadodara", "Rajkot", "Coimbatore", "Kochi", "Visakhapatnam", "Guwahati", "Bhubaneswar", 
  "Jodhpur", "Udaipur", "Kota", "Gwalior", "Jabalpur", "Raipur", "Shimla", "Jammu", "Srinagar"
];

export default function StandaloneShopPage() {
  // Navigation / View State: "catalog" | "checkout" | "success"
  const [activeView, setActiveView] = useState("catalog");

  // Catalog States
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");

  // Payment & Checkout States
  const [paymentMethod, setPaymentMethod] = useState("online"); // "online" (10% OFF) or "cod"
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsSuccessNote, setGpsSuccessNote] = useState(null);
  const [gpsErrorNote, setGpsErrorNote] = useState(null);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [isLookingUpPincode, setIsLookingUpPincode] = useState(false);

  // 1-Time Review Coupon States
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discountPercent }
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState(null);

  // Customer Form
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    notes: ""
  });

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Live GPS Address Detection (Manual Button or Auto-trigger)
  const handleFetchGpsAddress = async (isManualClick = false) => {
    setIsDetectingGps(true);
    setGpsErrorNote(null);

    try {
      const loc = await captureLiveGpsAddress();
      if (loc && loc.success) {
        setForm((prev) => ({
          ...prev,
          // Preserve any house number user already typed, or populate with detected locality/road
          address: prev.address && prev.address.trim().length > 0 ? prev.address : (loc.address || ""),
          city: loc.city || prev.city,
          pincode: loc.pincode || prev.pincode
        }));
        const label = [loc.city, loc.pincode].filter(Boolean).join(" - ");
        setGpsSuccessNote(label || "Live Location Detected");
        triggerToast(`📍 Location detected: ${loc.city || "Success"}`);
      } else if (isManualClick) {
        setGpsErrorNote("Could not detect exact coordinates. Please enter manually.");
      }
    } catch (err) {
      console.warn("GPS detection notice:", err);
      if (isManualClick) {
        setGpsErrorNote(err.message || "Location access unavailable. Please enter address manually.");
        triggerToast("Location permission unavailable. Enter manually.");
      }
    } finally {
      setIsDetectingGps(false);
    }
  };

  // Instant Pincode Lookup (India Post API)
  const handlePincodeChange = async (val) => {
    const cleanPin = val.replace(/\D/g, "").slice(0, 6);
    setForm((prev) => ({ ...prev, pincode: cleanPin }));

    if (cleanPin.length === 6) {
      setIsLookingUpPincode(true);
      try {
        const pinData = await lookupPincode(cleanPin);
        if (pinData && pinData.city) {
          setForm((prev) => ({
            ...prev,
            city: prev.city && prev.city.trim() ? prev.city : pinData.city
          }));
          triggerToast(`City found for ${cleanPin}: ${pinData.city}`);
        }
      } catch (e) {
        console.warn("Pincode lookup error:", e);
      } finally {
        setIsLookingUpPincode(false);
      }
    }
  };

  // City Auto-Suggestions Filter
  const filteredCities = useMemo(() => {
    if (!form.city || !form.city.trim()) return POPULAR_CITIES.slice(0, 8);
    const q = form.city.trim().toLowerCase();
    const matches = POPULAR_CITIES.filter((c) => c.toLowerCase().includes(q));
    return matches.length > 0 ? matches.slice(0, 8) : POPULAR_CITIES.slice(0, 6);
  }, [form.city]);

  const handleSelectCity = (cityName) => {
    setForm((prev) => ({ ...prev, city: cityName }));
    setShowCitySuggestions(false);
  };

  // Validate and Apply 1-Time Coupon from Supabase DB / Store
  const handleApplyCoupon = async (codeOverride = null) => {
    const targetCode = (codeOverride || couponInput || "").trim().toUpperCase();
    if (!targetCode) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    setIsValidatingCoupon(true);
    setCouponError(null);

    try {
      const res = await validateCouponFromSupabase(targetCode);
      if (res.valid) {
        setAppliedCoupon({
          code: res.code,
          discountPercent: res.discountPercent || 15
        });
        setCouponInput(res.code);
        setCouponError(null);
        triggerToast(`✓ Coupon '${res.code}' applied!`);
      } else {
        setAppliedCoupon(null);
        setCouponError(res.error || "Invalid coupon code.");
        triggerToast(res.error || "Invalid coupon code.");
      }
    } catch (e) {
      console.warn("Coupon check error:", e);
      setCouponError("Could not validate coupon. Please try again.");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
    triggerToast("Coupon removed.");
  };

  // Auto-detect coupon from URL query (e.g. from /review redirect)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlCoupon = params.get("coupon");
      if (urlCoupon) {
        const clean = urlCoupon.trim().toUpperCase();
        setCouponInput(clean);
        handleApplyCoupon(clean);
      }
    }
  }, []);

  // Pre-load saved customer user if any
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("cocoon_customer_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setForm((prev) => ({
          ...prev,
          name: parsed.name || "",
          phone: parsed.phone || "",
          email: parsed.email || "",
          address: parsed.address || "",
          city: parsed.city || "",
          pincode: parsed.pincode || ""
        }));
      }
    } catch (e) {}
  }, []);

  // Scroll to top when view changes & Auto-detect GPS when entering checkout
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (activeView === "checkout") {
      handleFetchGpsAddress();
    }
  }, [activeView]);

  // Categories
  const categories = [
    { id: "all", label: "All Items" },
    { id: "keychains", label: "Keychains & Charms" },
    { id: "bags", label: "Bags & Totes" },
    { id: "hair-accessories", label: "Hair Accessories" },
    { id: "belts", label: "Belts & Wraps" },
    { id: "bandanas", label: "Bandanas" }
  ];

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      const matchCat = selectedCategory === "all" || item.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Open Checkout Page View for a product
  const handleOpenCheckout = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setSelectedColor(product.colors?.[0] || "Standard");
    setActiveView("checkout");
  };

  // Pricing Calculations with 15% Review Coupon & 10% Online Payment Discount
  const itemPrice = selectedProduct?.price || 0;
  const subtotal = itemPrice * quantity;
  const reviewDiscount = appliedCoupon
    ? Math.round(subtotal * ((appliedCoupon.discountPercent || 15) / 100))
    : 0;
  const amountAfterReviewDiscount = Math.max(0, subtotal - reviewDiscount);
  const onlineDiscount = paymentMethod === "online" ? Math.round(amountAfterReviewDiscount * 0.10) : 0;
  const shipping = 60; // Flat ₹60 Courier Delivery
  const grandTotal = Math.max(0, amountAfterReviewDiscount - onlineDiscount + shipping);

  // Handle Order Submit (Razorpay Online vs COD)
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim() || !form.city.trim() || !form.pincode.trim()) {
      triggerToast("Please enter Name, WhatsApp, House/Gali, City & Pincode");
      return;
    }

    if (form.phone.replace(/\D/g, "").length < 10) {
      triggerToast("Please enter a valid 10-digit WhatsApp number");
      return;
    }

    if (form.pincode.replace(/\D/g, "").length < 6) {
      triggerToast("Please enter a valid 6-digit Pincode");
      return;
    }

    setIsSubmitting(true);

    const fullDeliveryAddress = [
      form.address.trim(),
      form.city.trim(),
      form.pincode.trim()
    ].filter(Boolean).join(", ");

    const orderId = "ORD-" + Math.floor(1000 + Math.random() * 9000);
    const orderItems = [
      {
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        quantity: quantity,
        color: selectedColor || "Standard",
        imgUrl: selectedProduct.imgUrl
      }
    ];

    const baseOrderPayload = {
      id: orderId,
      date: new Date().toISOString(),
      customerName: form.name.trim(),
      customerPhone: form.phone.trim(),
      customerEmail: form.email.trim() || "",
      address: fullDeliveryAddress,
      items: orderItems,
      subtotalAmount: subtotal,
      reviewCoupon: appliedCoupon ? appliedCoupon.code : null,
      reviewDiscount: reviewDiscount,
      onlineDiscount: onlineDiscount,
      shippingAmount: shipping,
      totalAmount: grandTotal,
      notes: (form.notes ? form.notes.trim() + " • " : "") + 
        (appliedCoupon ? `[1-Time Review Coupon: ${appliedCoupon.code} (-₹${reviewDiscount})] • ` : "") +
        (paymentMethod === "online" ? "10% Online Prepaid Discount" : "Cash on Delivery"),
      timestamp: Date.now()
    };

    // Save user info for future convenience
    try {
      localStorage.setItem("cocoon_customer_user", JSON.stringify({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        pincode: form.pincode.trim()
      }));
    } catch (e) {}

    // 1. CASH ON DELIVERY (COD) FLOW
    if (paymentMethod === "cod") {
      try {
        const codOrder = {
          ...baseOrderPayload,
          paymentMethod: "COD",
          paymentStatus: "Pending (Pay on Delivery)",
          status: "Processing"
        };

        const existing = STORE.getOrders();
        STORE.setOrders([codOrder, ...existing]);
        await saveOrderToSupabase(codOrder);

        // Mark 1-Time Coupon as Used in Supabase & Store (Prevents Reuse)
        if (appliedCoupon) {
          await markCouponAsUsedInSupabase(appliedCoupon.code, orderId);
        }

        // Dispatch Email to Customer & Admin
        STORE.dispatchEmailNotification("order_placed", { order: codOrder });

        setIsSubmitting(false);
        setPlacedOrder(codOrder);
        setActiveView("success");
        triggerToast("Order placed successfully via Cash on Delivery!");
      } catch (err) {
        console.error("COD save error:", err);
        setIsSubmitting(false);
        triggerToast("Error placing order. Please try again.");
      }
      return;
    }

    // 2. ONLINE PAYMENT FLOW VIA RAZORPAY (10% DISCOUNTED)
    try {
      triggerToast("Opening secure Razorpay gateway (10% OFF applied)...");
      await initiateRazorpayPayment({
        amount: grandTotal,
        customer: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          address: fullDeliveryAddress,
          city: form.city.trim()
        },
        notes: {
          itemsSummary: `${selectedProduct.name} (x${quantity})`,
          customerNotes: form.notes || "None",
          discount: "10% Online Prepaid Discount"
        },
        onSuccess: async (paymentResult) => {
          try {
            const onlineOrder = {
              ...baseOrderPayload,
              paymentMethod: "Razorpay (Online 10% OFF)",
              paymentStatus: "Paid Online",
              status: "Processing (Paid)",
              razorpayPaymentId: paymentResult.paymentId,
              razorpayOrderId: paymentResult.orderId,
              notes: baseOrderPayload.notes + ` • Razorpay ID: ${paymentResult.paymentId}`
            };

            const existing = STORE.getOrders();
            STORE.setOrders([onlineOrder, ...existing]);
            await saveOrderToSupabase(onlineOrder);

            // Mark 1-Time Coupon as Used in Supabase & Store (Prevents Reuse)
            if (appliedCoupon) {
              await markCouponAsUsedInSupabase(appliedCoupon.code, orderId);
            }

            // Dispatch Email to Customer & Admin
            STORE.dispatchEmailNotification("order_placed", { order: onlineOrder });

            setIsSubmitting(false);
            setPlacedOrder(onlineOrder);
            setActiveView("success");
            triggerToast("Payment Verified! Order confirmed with 10% discount.");
          } catch (saveErr) {
            console.error("Order save error:", saveErr);
            setIsSubmitting(false);
            setPlacedOrder(baseOrderPayload);
            setActiveView("success");
          }
        },
        onFailure: (errMsg) => {
          setIsSubmitting(false);
          triggerToast(errMsg || "Payment was not completed. Please try again.");
        },
        onDismiss: () => {
          setIsSubmitting(false);
          triggerToast("Payment cancelled. You can retry anytime.");
        }
      });
    } catch (payErr) {
      console.error(payErr);
      setIsSubmitting(false);
      triggerToast("Error launching payment gateway.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2623] font-sans antialiased selection:bg-[#F3D5CF] selection:text-[#5B2920] pb-24">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#2C2623] text-white px-5 py-2.5 rounded-full shadow-2xl text-xs font-serif border border-stone-700 animate-fadeIn">
          {toastMessage}
        </div>
      )}

      {/* TOP BIO BRAND BAR (Present across all views) */}
      <header className="sticky top-0 z-30 bg-[#FAF7F2]/90 backdrop-blur-xl border-b border-[#EAE0D2]/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div 
            onClick={() => setActiveView("catalog")}
            className="cursor-pointer group flex items-center select-none py-1"
          >
            <span className="font-header text-2xl sm:text-3xl font-light tracking-[0.28em] uppercase text-[#231F20] group-hover:text-[#B06B5B] transition-colors duration-300 leading-none">
              COCOON
            </span>
          </div>

          <a
            href="https://www.instagram.com/cocoon._.u/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-stone-50 border border-[#DDD3C4] text-[11px] font-bold text-[#2C2623] transition shadow-2xs"
          >
            <span>@cocoon._.u</span>
            <span className="text-[10px] text-stone-400">↗</span>
          </a>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 1. VIEW: CATALOG (DEFAULT FULL PRODUCTS LISTING)                           */}
      {/* ========================================================================= */}
      {activeView === "catalog" && (
        <div className="animate-fadeIn">
          {/* SPECIAL 10% DISCOUNT HERO BANNER */}
          <div className="max-w-2xl mx-auto px-4 pt-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#F7EBE8] via-[#FAF3ED] to-[#F1E9DF] border border-[#E8D4CC] shadow-xs text-center space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B06B5B] text-white text-[10px] font-bold uppercase tracking-wider shadow-2xs">
                Limited Time Offer
              </div>
              <h2 className="text-base sm:text-lg font-header font-bold text-[#2C2623]">
                Instant 10% OFF on Online Payments
              </h2>
              <p className="text-xs text-stone-600 font-serif leading-relaxed">
                Pay online via UPI, Cards, or NetBanking to claim <strong>flat 10% off</strong> on your order. Cash on Delivery (COD) is also available across India!
              </p>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="max-w-2xl mx-auto px-4 pt-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search keychains, bags, hair accessories..."
                className="w-full bg-white border border-[#DDD3C4] rounded-xl px-4 py-2.5 text-xs text-[#2C2623] placeholder:text-stone-400 focus:outline-none focus:border-[#B06B5B] shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* CATEGORY FILTER PILLS (HORIZONTAL SCROLLABLE) */}
          <div className="max-w-2xl mx-auto px-4 pt-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                    selectedCategory === cat.id
                      ? "bg-[#2C2623] text-white shadow-xs"
                      : "bg-white text-stone-700 border border-[#E4DACD] hover:bg-[#FAF5EE]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* PRODUCTS GRID */}
          <main className="max-w-2xl mx-auto px-4 pt-4">
            <div className="flex items-center justify-between text-xs text-stone-500 pb-2">
              <span>Showing {filteredProducts.length} handcrafted treasures</span>
              <span className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                10% Off Online Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-1">
              {filteredProducts.map((product) => {
                const onlinePrice = Math.round(product.price * 0.90);
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-[#EDE4D8] overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-md transition group"
                  >
                    <div onClick={() => handleOpenCheckout(product)} className="cursor-pointer">
                      <div className="relative aspect-square overflow-hidden bg-[#FAF7F2]">
                        <img
                          src={product.imgUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        {product.badge && (
                          <span className="absolute top-2 left-2 bg-[#2C2623]/85 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-xs">
                            {product.badge}
                          </span>
                        )}
                      </div>

                      <div className="p-3 space-y-1">
                        <h3 className="font-header font-bold text-xs sm:text-sm text-[#2C2623] line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-[10px] text-stone-500 font-serif line-clamp-2 leading-snug">
                          {product.desc}
                        </p>

                        {/* Dual Pricing Display */}
                        <div className="pt-1.5 space-y-0.5">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-bold text-[#2C2623]">₹{product.price}</span>
                            {product.originalPrice && (
                              <span className="text-[11px] text-stone-400 line-through">₹{product.originalPrice}</span>
                            )}
                          </div>
                          <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded inline-block">
                            ₹{onlinePrice} with 10% Online OFF
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 pt-0">
                      <button
                        onClick={() => handleOpenCheckout(product)}
                        className="w-full py-2.5 rounded-xl bg-[#B06B5B] hover:bg-[#975647] text-white text-xs font-bold uppercase tracking-wider transition shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>Order Now</span>
                        <span className="text-[11px]">→</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 p-6 space-y-2">
                <p className="font-header text-base text-[#2C2623]">No pieces found</p>
                <p className="text-xs text-stone-500">Try changing your search or category filter</p>
                <button
                  onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}
                  className="text-xs font-bold text-[#B06B5B] underline"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </main>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. VIEW: FULL CHECKOUT PAGE (NO POPUP CARD • FULL NATURAL SCROLLING)       */}
      {/* ========================================================================= */}
      {activeView === "checkout" && selectedProduct && (
        <main className="max-w-2xl mx-auto px-4 pt-4 animate-fadeIn space-y-6">
          
          {/* Back to Products Navigation Bar */}
          <div className="flex items-center justify-between pb-2 border-b border-[#EFE8DD]">
            <button
              onClick={() => setActiveView("catalog")}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B06B5B] hover:text-[#975647] transition cursor-pointer"
            >
              <span>← Back to Products</span>
            </button>
            <span className="text-xs text-stone-500 font-medium">Checkout Step</span>
          </div>

          {/* Selected Product Card */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EAE1D3] shadow-xs flex items-center gap-4">
            <img
              src={selectedProduct.imgUrl}
              alt={selectedProduct.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-stone-200 shrink-0"
            />
            <div className="flex-1 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B06B5B] bg-[#FAF0ED] px-2 py-0.5 rounded-full inline-block">
                {selectedProduct.badge || "Handcrafted"}
              </span>
              <h2 className="font-header font-bold text-base sm:text-lg text-[#2C2623] leading-snug">
                {selectedProduct.name}
              </h2>
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-bold text-[#2C2623]">₹{selectedProduct.price} each</span>
                
                {/* Quantity Controls */}
                <div className="flex items-center gap-2.5 bg-[#FAF7F2] rounded-xl border border-stone-300 px-2.5 py-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-sm font-bold text-stone-600 hover:text-stone-900 w-4 text-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-[#2C2623]">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-sm font-bold text-stone-600 hover:text-stone-900 w-4 text-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Colorway Selection */}
              {selectedProduct.colors && selectedProduct.colors.length > 1 && (
                <div className="text-[11px] text-stone-600 flex items-center gap-2 pt-1">
                  <span className="font-semibold">Color:</span>
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="bg-[#FAF7F2] border border-stone-300 rounded-lg px-2 py-1 text-xs text-stone-800"
                  >
                    {selectedProduct.colors.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* PAYMENT METHOD SELECTOR (WITH 10% DISCOUNT ON ONLINE) */}
          <div className="bg-white rounded-3xl p-5 border border-[#EAE1D3] shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Select Payment Method
            </h3>

            {/* Online Payment Option (10% OFF Applied) */}
            <div
              onClick={() => setPaymentMethod("online")}
              className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-start gap-3.5 ${
                paymentMethod === "online"
                  ? "bg-emerald-50/60 border-emerald-600 shadow-xs"
                  : "bg-[#FAF7F2] border-stone-200 hover:border-stone-300"
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "online"}
                onChange={() => setPaymentMethod("online")}
                className="mt-1 accent-emerald-600 w-4 h-4 cursor-pointer"
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm text-[#2C2623]">
                    Online Payment (UPI, Cards, NetBanking)
                  </span>
                  <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                    10% Instant Off
                  </span>
                </div>
                <p className="text-xs text-stone-600 font-serif">
                  Pay securely via Razorpay and get flat <strong>10% instant discount</strong> on your total.
                </p>
              </div>
            </div>

            {/* Cash on Delivery (COD) Option (Clean, no negative text) */}
            <div
              onClick={() => setPaymentMethod("cod")}
              className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-start gap-3.5 ${
                paymentMethod === "cod"
                  ? "bg-amber-50/60 border-amber-600 shadow-xs"
                  : "bg-[#FAF7F2] border-stone-200 hover:border-stone-300"
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
                className="mt-1 accent-amber-600 w-4 h-4 cursor-pointer"
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm text-[#2C2623]">
                    Cash on Delivery (COD)
                  </span>
                  <span className="text-[10px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
                    Pay on Arrival
                  </span>
                </div>
                <p className="text-xs text-stone-600 font-serif">
                  Pay in cash or via UPI directly to the courier partner upon doorstep delivery.
                </p>
              </div>
            </div>
          </div>

          {/* CUSTOMER DELIVERY DETAILS FORM */}
          <form onSubmit={handleSubmitOrder} className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE1D3] shadow-xs space-y-4">
            {/* Header with Detect My Location Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#FAF4ED]">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Delivery Address & Contact
                </h3>
                <p className="text-[10px] text-stone-500 font-serif">
                  Auto-detect location or enter manually with City Auto-Suggest
                </p>
              </div>

              {/* Detect My Location Button */}
              <button
                type="button"
                onClick={() => handleFetchGpsAddress(true)}
                disabled={isDetectingGps}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 text-emerald-900 border border-emerald-300 text-xs font-bold transition shadow-2xs active:scale-98 cursor-pointer disabled:opacity-60 shrink-0"
                title="Detect City & Pincode using device GPS"
              >
                {isDetectingGps ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-emerald-700 animate-spin shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Detecting Location...</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm">📍</span>
                    <span>Detect My Location</span>
                  </>
                )}
              </button>
            </div>

            {/* Success Feedback Banner */}
            {gpsSuccessNote && (
              <div className="px-3.5 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-2 truncate">
                  <svg className="w-4 h-4 text-emerald-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="truncate">
                    <strong>Location detected:</strong> {gpsSuccessNote} — Please enter House/Gali No.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setGpsSuccessNote(null)}
                  className="text-emerald-700 hover:text-emerald-900 text-xs font-bold ml-2 cursor-pointer"
                  title="Dismiss note"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Error Feedback Banner */}
            {gpsErrorNote && (
              <div className="px-3.5 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-amber-600 shrink-0">⚠️</span>
                  <span className="truncate">{gpsErrorNote}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setGpsErrorNote(null)}
                  className="text-amber-700 hover:text-amber-900 text-xs font-bold ml-2 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">Full Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter your full name"
                className="w-full bg-[#FAF7F2] border border-[#DDD3C4] rounded-xl px-4 py-2.5 text-xs text-[#2C2623] focus:outline-none focus:border-[#B06B5B]"
              />
            </div>

            {/* WhatsApp Number & Optional Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-700 block">WhatsApp Number *</label>
                  <span className="text-[10px] text-emerald-700 font-semibold">Dispatch Updates</span>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-stone-500 select-none">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                    placeholder="10-digit mobile number"
                    className="w-full bg-[#FAF7F2] border border-[#DDD3C4] rounded-xl pl-16 pr-4 py-2.5 text-xs text-[#2C2623] focus:outline-none focus:border-[#B06B5B]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">Email Address (Optional)</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="For digital invoice & receipt"
                  className="w-full bg-[#FAF7F2] border border-[#DDD3C4] rounded-xl px-4 py-2.5 text-xs text-[#2C2623] focus:outline-none focus:border-[#B06B5B]"
                />
              </div>
            </div>

            {/* Manual Street: House/Flat, Gali/Street */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700 block">
                  House / Flat No., Gali / Road / Street Address *
                </label>
                <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-semibold">
                  Manual Street
                </span>
              </div>
              <textarea
                required
                rows={2}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="e.g. House No. 42, Gali No. 3, Near Radha Krishna Mandir"
                className="w-full bg-[#FAF7F2] border border-[#DDD3C4] rounded-xl px-4 py-2.5 text-xs text-[#2C2623] focus:outline-none focus:border-[#B06B5B]"
              />
              <p className="text-[10px] text-stone-500 font-serif">
                Enter your exact door number, building, and street/gali for courier delivery.
              </p>
            </div>

            {/* City Auto-Suggest & Pincode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* City with Auto-Suggest */}
              <div className="relative space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-700 block">City *</label>
                  <span className="text-[10px] text-stone-500 font-medium">Auto-Suggest</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={form.city}
                    onFocus={() => setShowCitySuggestions(true)}
                    onChange={(e) => {
                      setForm({ ...form, city: e.target.value });
                      setShowCitySuggestions(true);
                    }}
                    placeholder="Type or select City"
                    className="w-full bg-[#FAF7F2] border border-[#DDD3C4] rounded-xl px-4 py-2.5 text-xs text-[#2C2623] focus:outline-none focus:border-[#B06B5B]"
                    autoComplete="off"
                  />
                  {form.city ? (
                    <button
                      type="button"
                      onClick={() => {
                        setForm({ ...form, city: "" });
                        setShowCitySuggestions(true);
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs p-1"
                      title="Clear city"
                    >
                      ✕
                    </button>
                  ) : null}
                </div>

                {/* Auto-Suggest Dropdown */}
                {showCitySuggestions && (
                  <>
                    <div 
                      className="fixed inset-0 z-20" 
                      onClick={() => setShowCitySuggestions(false)} 
                    />
                    <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#EAE0D2] rounded-2xl shadow-xl z-30 max-h-52 overflow-y-auto p-1.5 space-y-0.5">
                      <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        Suggested Cities
                      </div>
                      {filteredCities.map((cityName) => (
                        <button
                          key={cityName}
                          type="button"
                          onClick={() => handleSelectCity(cityName)}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs text-stone-800 hover:bg-[#FAF4ED] hover:text-[#B06B5B] font-medium flex items-center justify-between transition cursor-pointer"
                        >
                          <span>{cityName}</span>
                          {form.city?.toLowerCase() === cityName.toLowerCase() && (
                            <span className="text-[#B06B5B] text-xs font-bold">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Pincode with Auto-Lookup */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-700 block">Pincode *</label>
                  {isLookingUpPincode ? (
                    <span className="text-[10px] text-amber-700 font-semibold animate-pulse">Finding City...</span>
                  ) : (
                    <span className="text-[10px] text-stone-500 font-medium">6 Digits</span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={form.pincode}
                    onChange={(e) => handlePincodeChange(e.target.value)}
                    placeholder="6-digit pincode"
                    className="w-full bg-[#FAF7F2] border border-[#DDD3C4] rounded-xl px-4 py-2.5 text-xs text-[#2C2623] focus:outline-none focus:border-[#B06B5B]"
                  />
                  {isLookingUpPincode && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg className="w-3.5 h-3.5 text-[#B06B5B] animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Gift Note / Special Instructions */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">Gift Note / Special Request (Optional)</label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="e.g. Please wrap with extra ribbon for birthday"
                className="w-full bg-[#FAF7F2] border border-[#DDD3C4] rounded-xl px-4 py-2.5 text-xs text-[#2C2623] focus:outline-none focus:border-[#B06B5B]"
              />
            </div>

            {/* Coupon Code Input Box */}
            <div className="p-4 bg-gradient-to-r from-amber-50/70 to-orange-50/40 rounded-2xl border border-amber-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <span>🎟️</span>
                  <span>Have a Coupon Code?</span>
                </span>
                {appliedCoupon && (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 animate-fadeIn">
                    ✓ Coupon Applied
                  </span>
                )}
              </div>

              {!appliedCoupon ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase().trim());
                      setCouponError(null);
                    }}
                    placeholder="Enter coupon code"
                    className="flex-1 bg-white border border-[#DDD3C4] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2623] uppercase font-mono tracking-wider focus:outline-none focus:border-[#B06B5B]"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    disabled={isValidatingCoupon || !couponInput.trim()}
                    className="px-4 py-2.5 rounded-xl bg-[#2C2623] hover:bg-[#B06B5B] text-white text-xs font-bold tracking-wider uppercase transition shadow-2xs cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {isValidatingCoupon ? "Checking..." : "Apply"}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-white border border-emerald-300 rounded-xl px-3.5 py-2.5 text-xs text-emerald-900 font-medium shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#B06B5B] tracking-wider">{appliedCoupon.code}</span>
                    <span className="text-emerald-700 text-[11px] font-semibold">(Coupon Discount Applied)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-stone-400 hover:text-red-600 text-xs font-bold cursor-pointer transition px-1"
                    title="Remove coupon"
                  >
                    ✕ Remove
                  </button>
                </div>
              )}

              {couponError && (
                <p className="text-[11px] text-red-600 font-medium animate-fadeIn">
                  ⚠️ {couponError}
                </p>
              )}
            </div>

            {/* Transparent Price Summary Card */}
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EAE1D3] space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal ({quantity} item{quantity > 1 ? "s" : ""}):</span>
                <span>₹{subtotal}</span>
              </div>
              {reviewDiscount > 0 && (
                <div className="flex justify-between font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                  <span>Coupon Discount:</span>
                  <span>-₹{reviewDiscount}</span>
                </div>
              )}
              {paymentMethod === "online" && (
                <div className="flex justify-between font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                  <span>10% Instant Online Payment Discount:</span>
                  <span>-₹{onlineDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Express Courier Delivery:</span>
                <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#2C2623] pt-2 border-t border-stone-200">
                <span>Total Amount Payable:</span>
                <span className="text-base text-[#2C2623]">₹{grandTotal}</span>
              </div>
            </div>

            {/* Big Action Submit CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-[#B06B5B] hover:bg-[#975647] text-white font-bold text-xs uppercase tracking-wider transition shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer text-center"
            >
              {isSubmitting ? (
                "Processing Your Order..."
              ) : paymentMethod === "online" ? (
                `Pay ₹${grandTotal} via Razorpay (10% Discount Applied)`
              ) : (
                `Confirm Cash on Delivery Order (₹${grandTotal})`
              )}
            </button>
          </form>

        </main>
      )}

      {/* ========================================================================= */}
      {/* 3. VIEW: ORDER SUCCESS / CONFIRMED FULL PAGE                              */}
      {/* ========================================================================= */}
      {activeView === "success" && placedOrder && (
        <main className="max-w-2xl mx-auto px-4 pt-8 animate-fadeIn text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#B06B5B] block">
              Order Confirmed
            </span>
            <h2 className="text-2xl font-header font-bold text-[#2C2623]">
              Thank You, {placedOrder.customerName}!
            </h2>
            <p className="text-xs text-stone-500 font-serif">
              Order <strong>{placedOrder.id}</strong> has been received by COCOON Studio.
            </p>
          </div>

          {/* Order Details Receipt Box */}
          <div className="bg-white rounded-3xl p-5 text-left text-xs space-y-2.5 border border-[#EAE1D3] shadow-xs">
            <div className="flex justify-between items-center font-bold text-stone-800">
              <span>Payment Mode:</span>
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                placedOrder.paymentMethod === "COD" 
                  ? "text-amber-800 bg-amber-50 border border-amber-200"
                  : "text-emerald-800 bg-emerald-50 border border-emerald-200"
              }`}>
                {placedOrder.paymentMethod}
              </span>
            </div>
            {placedOrder.reviewCoupon && (
              <div className="flex justify-between items-center text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 text-[11px] font-semibold">
                <span>Coupon Applied ({placedOrder.reviewCoupon}):</span>
                <span>-₹{placedOrder.reviewDiscount || 0}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-stone-700 pt-1.5 border-t border-stone-200/60">
              <span className="font-semibold">
                {placedOrder.paymentMethod === "COD" ? "Payable on Delivery:" : "Amount Paid:"}
              </span>
              <span className="text-stone-900 font-bold text-base">₹{placedOrder.totalAmount}</span>
            </div>
            <div className="text-[11px] text-stone-600">
              <strong>Item:</strong> {placedOrder.items?.map((i) => `${i.name} (x${i.quantity})`).join(", ")}
            </div>
            <div className="text-[11px] text-stone-500">
              <strong>Delivery to:</strong> {placedOrder.address}
            </div>
          </div>

          {/* Email Notification Notice */}
          <div className="p-3.5 bg-emerald-50 rounded-2xl text-emerald-800 text-xs font-medium border border-emerald-200 text-left space-y-1">
            <p className="font-bold">Order receipt dispatched to email!</p>
            <p className="text-stone-600 text-[11px]">
              Confirmation details have been automatically dispatched to your contact and the studio desk.
            </p>
          </div>

          {/* 1-Click WhatsApp Button (Pre-filled message, NO phone number disclosed on screen) */}
          <div className="pt-2">
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918171902255"}?text=${encodeURIComponent(
                `Hello COCOON! I just placed an order #${placedOrder.id} on the boutique shop.\n\n` +
                `Item: ${placedOrder.items?.map((i) => `${i.name} (x${i.quantity})`).join(", ")}\n` +
                `Total: ₹${placedOrder.totalAmount} (${placedOrder.paymentMethod})\n` +
                `Deliver To: ${placedOrder.customerName}, ${placedOrder.address}\n\n` +
                `Please confirm crafting & delivery timeline.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition shadow-md cursor-pointer"
            >
              <span>📲 Track / Confirm on WhatsApp</span>
            </a>
          </div>

          {/* Post-Delivery Rating & 15% OFF Promise Card */}
          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50/60 rounded-2xl border border-amber-200 text-left space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-amber-900 text-xs font-bold">
              <span>⭐</span>
              <span>Rate Your Order Later & Get Flat 15% OFF!</span>
            </div>
            <p className="text-[11px] text-stone-600 font-serif leading-relaxed">
              Once your package arrives, leave a quick review with a photo or video to unlock your exclusive <strong>15% OFF coupon</strong> for your next purchase.
            </p>
            <Link
              href={`/review?orderId=${placedOrder.id}&name=${encodeURIComponent(placedOrder.customerName || '')}`}
              className="inline-block text-[11px] font-bold text-[#B06B5B] hover:underline pt-0.5"
            >
              Write Review & Claim 15% Coupon &rarr;
            </Link>
          </div>

          {/* Return to Shop Button */}
          <button
            onClick={() => {
              setPlacedOrder(null);
              setSelectedProduct(null);
              setActiveView("catalog");
            }}
            className="w-full py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition cursor-pointer"
          >
            ← Continue Browsing Shop
          </button>
        </main>
      )}

      {/* FOOTER */}
      <footer className="max-w-2xl mx-auto px-4 pt-12 text-center space-y-2 border-t border-[#EAE0D2]/60 mt-12">
        <p className="text-xs font-bold tracking-widest uppercase text-stone-600">
          COCOON
        </p>
        <p className="text-[11px] text-stone-500 font-serif">
          100% Organic Milk Cotton • Hypoallergenic & Handmade with Care
        </p>
        <div className="pt-1 flex items-center justify-center flex-wrap gap-3 sm:gap-4 text-[11px] text-stone-600">
          <Link href="/review" className="hover:text-[#B06B5B] font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 px-2.5 py-0.5 rounded-full border border-stone-200">
            Rate & Review
          </Link>
          <span>•</span>
          <a href="https://www.instagram.com/cocoon._.u/" target="_blank" rel="noreferrer" className="hover:text-[#B06B5B] underline">
            Instagram @cocoon._.u
          </a>
        </div>
        <p className="text-[10px] text-stone-400 pt-2">
          © 2026 COCOON. All rights reserved.
        </p>
      </footer>

    </div>
  );
}
