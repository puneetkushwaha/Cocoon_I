"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { STORE } from "@/data/store";
import { saveOrderToSupabase, saveCustomizationToSupabase, uploadMediaToSupabase } from "@/lib/supabase";
import { captureLiveGpsAddress } from "@/lib/location";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InstagramShowcase from "@/components/InstagramShowcase";
import FaqSection from "@/components/FaqSection";
import { generateOrderId, getCraftStats } from "@/lib/orderUtils";

export default function Preset4() {
  const router = useRouter();
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [storeProducts, setStoreProducts] = useState(() => STORE.getProducts());
  const [storeCategories, setStoreCategories] = useState(() => STORE.getCategories());
  const [storeHeroCards, setStoreHeroCards] = useState(() => STORE.getHeroCards());
  const [storeTicker, setStoreTicker] = useState(() => STORE.getTicker());
  const [storeBestsellers, setStoreBestsellers] = useState(() => STORE.getBestsellers());

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");

  const [formData, setFormData] = useState({
    productName: "",
    category: "Handbag / Backpack",
    colorway: "",
    name: "",
    email: "",
    phone: "",
    idea: "",
    socialLink: "",
    neededBy: "",
    budget: "Rs. 1,000 - Rs. 2,000",
    mediaFile: null,
    mediaPreview: null,
    mediaType: null
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // Customer Auth & Checkout Login States
  const [customerUser, setCustomerUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("checkout"); // "checkout" | "login" | "profile"
  const [authTab, setAuthTab] = useState("customer"); // "customer" | "admin"
  const [customerForm, setCustomerForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    notes: ""
  });
  const [placedOrderSummary, setPlacedOrderSummary] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isUtrSubmitting, setIsUtrSubmitting] = useState(false);

  const handleCopyUpi = () => {
    try {
      navigator.clipboard.writeText("8171902255@ibl");
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    } catch (e) {
      triggerToast("UPI ID: 8171902255@ibl");
    }
  };

  const handleUpdateUtr = async (orderId, newUtr) => {
    const clean = (newUtr || "").trim().replace(/[^a-zA-Z0-9]/g, "");
    if (!clean || clean.length < 6) {
      triggerToast("Please enter a valid 12-digit UTR Number");
      return;
    }

    setIsUtrSubmitting(true);
    try {
      const allOrders = STORE.getOrders();
      const updatedList = allOrders.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            utr: clean,
            paymentStatus: `Paid via UPI (UTR: ${clean})`,
            notes: (o.notes ? o.notes.replace(/\[UTR:.*?\]/g, "").trim() + " • " : "") + `[UTR: ${clean}]`
          };
        }
        return o;
      });

      STORE.setOrders(updatedList);
      const updatedOrder = updatedList.find((o) => o.id === orderId);
      if (updatedOrder) {
        await saveOrderToSupabase(updatedOrder);
        setPlacedOrderSummary(updatedOrder);
      }
      triggerToast("✓ UTR Number saved & submitted for verification!");
    } catch (err) {
      console.error("UTR update error:", err);
      triggerToast("Could not update UTR. You can also send it via WhatsApp.");
    } finally {
      setIsUtrSubmitting(false);
    }
  };

  // Sync customer session
  useEffect(() => {
    try {
      const savedCust = localStorage.getItem("cocoon_customer_user");
      if (savedCust) {
        const parsed = JSON.parse(savedCust);
        setCustomerUser(parsed);
        setCustomerForm((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {}
  }, []);


  // Sync with persistent store and admin panel
  useEffect(() => {
    const syncData = () => {
      setStoreProducts(STORE.getProducts());
      setStoreCategories(STORE.getCategories());
      setStoreHeroCards(STORE.getHeroCards());
      setStoreTicker(STORE.getTicker());
      setStoreBestsellers(STORE.getBestsellers());
      try {
        const savedCart = sessionStorage.getItem("cocoon_temp_cart") || localStorage.getItem("cocoon_temp_cart");
        if (savedCart) setCart(JSON.parse(savedCart));
      } catch (e) {}
      try {
        const savedWish = localStorage.getItem("cocoon_wishlist");
        if (savedWish) setWishlist(JSON.parse(savedWish));
      } catch (e) {}
    };
    syncData();
    STORE.fetchServerStoreData().then((serverData) => {
      if (serverData) {
        if (Array.isArray(serverData.products)) setStoreProducts(serverData.products);
        if (Array.isArray(serverData.categories)) setStoreCategories(serverData.categories);
        if (Array.isArray(serverData.bestsellers)) setStoreBestsellers(serverData.bestsellers);
        if (Array.isArray(serverData.heroCards)) setStoreHeroCards(serverData.heroCards);
        if (Array.isArray(serverData.ticker)) setStoreTicker(serverData.ticker);
      }
    });
    window.addEventListener("cocoon_store_update", syncData);
    window.addEventListener("storage", syncData);
    return () => {
      window.removeEventListener("cocoon_store_update", syncData);
      window.removeEventListener("storage", syncData);
    };
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFetchGpsAddress = async () => {
    setIsDetectingGps(true);
    triggerToast("Accessing device GPS & fetching live address...");
    try {
      const loc = await captureLiveGpsAddress();
      if (loc && loc.success) {
        setCustomerForm((prev) => ({
          ...prev,
          address: loc.fullDisplayAddress || loc.address,
          city: loc.city || prev.city,
          pincode: loc.pincode || prev.pincode
        }));
        triggerToast(`Live GPS detected: ${loc.city} (${loc.pincode || "Near"})`);
      }
    } catch (err) {
      console.error(err);
      triggerToast(err.message || "Failed to fetch GPS address.");
    } finally {
      setIsDetectingGps(false);
    }
  };

  const handleMediaUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isImage && !isVideo) {
      triggerToast("Please upload an image or video file");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      mediaFile: file,
      mediaPreview: previewUrl,
      mediaType: isVideo ? "video" : "image"
    }));
    triggerToast(`Attached: ${file.name}`);
  };

  const removeMedia = () => {
    if (formData.mediaPreview) {
      URL.revokeObjectURL(formData.mediaPreview);
    }
    setFormData((prev) => ({
      ...prev,
      mediaFile: null,
      mediaPreview: null,
      mediaType: null
    }));
  };

  const persistCart = (updated) => {
    setCart(updated);
    try {
      sessionStorage.setItem("cocoon_temp_cart", JSON.stringify(updated));
      localStorage.setItem("cocoon_temp_cart", JSON.stringify(updated));
      setTimeout(() => {
        window.dispatchEvent(new Event("cocoon_store_update"));
      }, 0);
    } catch (e) {}
  };

  const addToCart = (product, color = "") => {
    const finalColor = color || (product.colors ? product.colors[0] : "Standard");
    const idx = cart.findIndex((i) => i.id === product.id && i.color === finalColor);
    let updated;
    if (idx > -1) {
      updated = [...cart];
      updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
    } else {
      updated = [...cart, { ...product, color: finalColor, quantity: 1 }];
    }
    persistCart(updated);
    triggerToast(`Added to your basket: ${product.name}`);
    if (quickViewProduct) setQuickViewProduct(null);
    try {
      window.dispatchEvent(
        new CustomEvent("cocoon_item_added_to_cart", {
          detail: {
            name: product.name,
            price: product.price,
            image: product.images?.[0] || product.image || product.imgUrl || "",
            quantity: 1
          }
        })
      );
    } catch (e) {}
  };

  const removeFromCart = (id, color) => {
    const updated = cart.filter((i) => !(i.id === id && i.color === color));
    persistCart(updated);
  };

  const updateQty = (id, color, delta) => {
    const updated = cart
      .map((i) => {
        if (i.id === id && i.color === color) {
          const q = i.quantity + delta;
          return q > 0 ? { ...i, quantity: q } : null;
        }
        return i;
      })
      .filter(Boolean);
    persistCart(updated);
  };

  const toggleWishlist = (product) => {
    const exists = wishlist.includes(product.id);
    let updated;
    if (exists) {
      updated = wishlist.filter((id) => id !== product.id);
      triggerToast(`Removed "${product.name}" from saved treasures`);
    } else {
      updated = [...wishlist, product.id];
      triggerToast(`Saved "${product.name}" to Wishlist!`);
    }
    setWishlist(updated);
    try {
      localStorage.setItem("cocoon_wishlist", JSON.stringify(updated));
      setTimeout(() => {
        window.dispatchEvent(new Event("cocoon_store_update"));
      }, 0);
    } catch (e) {}
  };

  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredProducts = useMemo(() => {
    let list = [...storeProducts];

    if (activeCategory !== "all") {
      list = list.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.desc?.toLowerCase().includes(q));
    }

    if (sortBy === "price-low") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") list.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));

    return list;
  }, [activeCategory, searchQuery, sortBy, storeProducts]);

  const under199Products = useMemo(() => {
    return (storeProducts || []).filter((p) => Number(p.price) <= 199).slice(0, 4);
  }, [storeProducts]);

  const openQuickView = (product) => {
    if (product?.id) {
      router.push(`/product/${product.id}`);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden overflow-x-clip bg-[#FDFBF7] text-[#2C2623] font-sans antialiased selection:bg-[#F3D5CF] selection:text-[#5B2920]">
      
      {/* 1 & 2. UNIFIED MASTER ATELIER HEADER & TICKER */}
      <Header cartCountOverride={totalQty} />

      {/* 3. HERO: VINTAGE COTTAGE SCRAPBOOK & NEEDLEWORK */}
      <section className="py-14 lg:py-20 border-b border-[#EFE8DD] relative overflow-hidden bg-gradient-to-b from-[#FDFBF7] via-[#FAF4EE] to-[#FDFBF7] max-w-full" style={{ contain: "paint" }}>
        <div className="absolute top-10 left-10 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-[#FCEEEA]/70 filter blur-3xl pointer-events-none -z-0"></div>
        <div className="absolute bottom-10 right-0 sm:right-10 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-[#EDF3EE]/70 filter blur-3xl pointer-events-none -z-0"></div>

        <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light font-header text-[#2C2623] leading-[1.06] tracking-tight">
                Handcrafted Crochet where <span className="italic font-normal text-[#B06B5B] underline decoration-[#F3D5CF] decoration-wavy">art</span> meets needle and thread.
              </h1>

              <p className="text-base text-[#2C2623]/75 font-light leading-relaxed max-w-lg font-serif">
                Welcome to <strong>GoCocoon</strong>, an artisanal slow-fashion boutique by <strong>Mehak Agarwal</strong>. Explore handcrafted crochet handbags, statement bandanas, waist wraps, and bespoke heirloom gifts woven knot-by-knot with pure organic milk cotton.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#shop"
                  className="px-8 py-3.5 rounded-full bg-[#B06B5B] hover:bg-[#975647] text-white font-sans text-xs uppercase tracking-[0.2em] font-bold shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  Shop the Treasures &rarr;
                </a>
                <a
                  href="#our-story"
                  className="px-7 py-3.5 rounded-full bg-white hover:bg-[#FAF4EF] text-[#2C2623] font-sans text-xs uppercase tracking-[0.2em] font-bold border border-[#DDD3C4] shadow-xs hover:border-[#B06B5B] transition-all cursor-pointer"
                >
                  Our Story
                </a>
              </div>

              {/* 3 Risk-Removal Trust Badges */}
              <div className="pt-6 border-t border-[#EFE8DD] grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left">
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/80 border border-[#EAE1D3] shadow-2xs">
                  <svg className="w-4 h-4 text-[#B06B5B] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25" />
                  </svg>
                  <div>
                    <p className="text-[11px] font-bold text-[#2C2623] leading-none">Free Express Transit</p>
                    <p className="text-[9px] text-stone-500 font-serif mt-0.5">Free on Online Orders</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/80 border border-[#EAE1D3] shadow-2xs">
                  <svg className="w-4 h-4 text-[#B06B5B] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6H2.25m0 0H3m0 0v1.5m0-1.5h18m-18 0a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 4.5v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 16.5V6z" />
                  </svg>
                  <div>
                    <p className="text-[11px] font-bold text-[#2C2623] leading-none">Cash on Delivery</p>
                    <p className="text-[9px] text-stone-500 font-serif mt-0.5">Pay at Doorstep</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/80 border border-[#EAE1D3] shadow-2xs">
                  <svg className="w-4 h-4 text-[#B06B5B] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m0-18c-3 3-5 7-5 11 0 3 2 5 5 7m0-18c3 3 5 7 5 11 0 3-2 5-5 7" />
                  </svg>
                  <div>
                    <p className="text-[11px] font-bold text-[#2C2623] leading-none">100% Milk Cotton</p>
                    <p className="text-[9px] text-stone-500 font-serif mt-0.5">Gentle, Zero Plastic</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Polaroid Vintage Scrapbook Collage (3 Cards from Admin) */}
            <div className="lg:col-span-6 relative flex justify-center py-6 max-w-full overflow-hidden sm:overflow-visible">
              <div className="relative w-full max-w-md">
                
                {/* Clothespin */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                  <div className="w-4 h-9 bg-gradient-to-b from-[#C49E72] to-[#9E7348] rounded-t-sm rounded-b-md shadow-md border border-[#855F37] flex items-center justify-center">
                    <div className="w-2.5 h-1 bg-[#4A3B2C] rounded-full" />
                  </div>
                </div>

                {/* Wax Seal */}
                <div className="absolute -top-5 right-1 sm:-right-8 z-30 w-16 h-16 sm:w-22 sm:h-22 rounded-full bg-[#B06B5B] text-[#FFFDF9] p-1.5 sm:p-2 shadow-xl flex items-center justify-center border-2 sm:border-4 border-[#FAF5EE] pointer-events-none">
                  <div className="w-full h-full rounded-full border border-dashed border-[#F3D5CF] flex flex-col items-center justify-center">
                    <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-center leading-none">HANDMADE</span>
                    <span className="text-[6px] sm:text-[7px] tracking-widest text-center leading-none mt-0.5 sm:mt-1">COCOON</span>
                  </div>
                </div>

                {/* 1. Main Center Card */}
                {storeHeroCards[1] && (
                  <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xl border border-[#EAE1D3] transform -rotate-2 hover:rotate-0 transition-transform duration-500 select-none group">
                    <div className="aspect-[4/4] rounded-xl overflow-hidden bg-[#FAF6F0] mb-4 relative shadow-inner">
                      <img
                        src={storeHeroCards[1].imgUrl}
                        alt={storeHeroCards[1].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <span className="absolute top-3 left-3 bg-[#B06B5B] text-white text-[9px] font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                        {storeHeroCards[1].badge || "Bestseller"}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-left">
                      <div>
                        <p className="font-header font-bold text-lg text-[#2C2623]">{storeHeroCards[1].title}</p>
                        <p className="text-[11px] font-sans font-bold text-[#B06B5B]">{storeHeroCards[1].subtitle}</p>
                      </div>
                      <a
                        href="#shop"
                        className="px-4 py-2 rounded-full bg-[#526B57] hover:bg-[#435747] text-white text-[11px] font-sans uppercase tracking-wider font-bold transition cursor-pointer shadow-sm hover:scale-105"
                      >
                        Explore &rarr;
                      </a>
                    </div>
                  </div>
                )}

                {/* 2. Bottom Right Card */}
                {storeHeroCards[2] && (
                  <div className="absolute -bottom-6 right-1 sm:-bottom-8 sm:-right-8 w-36 sm:w-56 bg-white p-2.5 sm:p-3 rounded-2xl shadow-2xl border border-[#EAE1D3] transform rotate-1 sm:rotate-6 hover:rotate-2 transition-transform duration-500 select-none">
                    <div className="aspect-square rounded-lg overflow-hidden bg-[#FAF6F0] mb-2 shadow-inner">
                      <img
                        src={storeHeroCards[2].imgUrl}
                        alt={storeHeroCards[2].title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between text-left">
                      <div className="min-w-0 pr-1">
                        <p className="font-header font-bold text-xs text-[#2C2623] truncate">{storeHeroCards[2].title}</p>
                        <p className="text-[10px] font-sans font-bold text-[#B06B5B]">{storeHeroCards[2].subtitle}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Top Left Mini Card */}
                {storeHeroCards[0] && (
                  <div className="absolute -top-6 -left-4 sm:-left-8 w-32 sm:w-36 bg-white p-2 rounded-xl shadow-lg border border-[#EAE1D3] transform -rotate-6 hover:rotate-0 transition-transform duration-500 select-none hidden sm:block text-left">
                    <div className="aspect-square rounded-md overflow-hidden bg-[#FAF6F0] mb-1">
                      <img
                        src={storeHeroCards[0].imgUrl}
                        alt={storeHeroCards[0].title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-header text-[10px] text-[#2C2623] font-bold truncate">{storeHeroCards[0].title}</p>
                    <p className="text-[9px] font-sans font-bold text-[#526B57]">{storeHeroCards[0].subtitle}</p>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>

        <div className="w-full max-w-full overflow-hidden mt-12 py-2 flex items-center justify-center" style={{ contain: "paint" }}>
          <svg className="w-full h-3 max-w-7xl px-6 sm:px-10 overflow-hidden" preserveAspectRatio="none">
            <line x1="0" y1="2" x2="100%" y2="2" stroke="#B06B5B" strokeWidth="2.5" strokeDasharray="10 8" className="running-stitch opacity-60" />
          </svg>
        </div>
      </section>

      {/* 4. SHOP BY CATEGORY (Dynamic from Admin) */}
      <section id="categories" className="py-16 bg-[#FAF7F2] border-b border-[#EFE8DD] relative">
        <span id="p4-chapters" className="sr-only" />
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-[#EAE0D2]">
            <div className="text-left">
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#B06B5B]">Curated Collections</span>
              <h2 className="text-3xl sm:text-4xl font-light font-header text-[#2C2623] mt-1">Shop Our Categories</h2>
            </div>
            <button
              onClick={() => { setActiveCategory("all"); (document.getElementById("shop") || document.getElementById("p4-treasures"))?.scrollIntoView({ behavior: "smooth" }); }}
              className="text-xs font-bold uppercase tracking-widest text-[#2C2623] hover:text-[#B06B5B] transition flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({storeProducts.length || STORE.products.length})</span>
              <span>&rarr;</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
            {storeCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); (document.getElementById("shop") || document.getElementById("p4-treasures"))?.scrollIntoView({ behavior: "smooth" }); }}
                className="group flex flex-col items-center text-center cursor-pointer transition-transform hover:-translate-y-1"
              >
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-[#F5EFEB] border-2 border-[#EFE8DE] group-hover:border-[#B06B5B] shadow-sm group-hover:shadow-md transition-all duration-300 p-1">
                  <img src={cat.imgUrl} alt={cat.name} className="w-full h-full object-cover rounded-full transform group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h4 className="mt-4 text-xs font-bold uppercase tracking-widest text-[#2C2623] group-hover:text-[#B06B5B] transition">{cat.name}</h4>
                <p className="text-[11px] text-[#2C2623]/60 font-sans font-medium mt-0.5">{cat.itemCount || 0} Items • From Rs. {cat.minPrice}</p>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 4.2 IMPULSE HOOK: UNDER ₹199 • YOUR FIRST CROCHET TREASURE */}
      <section id="under-199" className="py-16 bg-gradient-to-b from-[#FDFBF7] to-[#FAF5EE] border-b border-[#EAE0D2] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-[#EAE0D2] gap-4">
            <div className="text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0EA] border border-[#F3D5CF] text-[10px] font-black uppercase tracking-[0.25em] text-[#B06B5B] mb-2">
                <span>Pocket-Friendly Delights</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light font-header text-[#2C2623] tracking-tight">
                Under ₹199 • Your First Crochet Treasure
              </h2>
              <p className="text-xs sm:text-sm font-serif text-[#2C2623]/70 font-light mt-1">
                Experience authentic hand-knitted milk cotton luxury without hesitating. Perfect for hair, bags & quick gifting.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8B483B] bg-white px-3.5 py-1.5 rounded-full border border-[#ECCEC7] shadow-xs shrink-0 self-start sm:self-auto">
              <span>Extra 10% OFF with code</span>
              <span className="font-mono font-black text-[#B06B5B] bg-[#FAF0EA] px-2 py-0.5 rounded">COCOON10</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-left">
            {under199Products.map((p) => {
              const isFav = wishlist.includes(p.id);
              const craft = getCraftStats(p);
              const effectivePrice = Math.round(p.price * 0.9);
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl p-3 sm:p-4 border border-[#EAE1D3] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div>
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-[#FAF6F0] mb-3">
                      <button
                        onClick={() => toggleWishlist(p)}
                        className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center transition cursor-pointer backdrop-blur-xs shadow-xs ${
                          isFav ? "bg-[#B06B5B] text-white" : "bg-white/90 text-stone-500 hover:text-[#B06B5B]"
                        }`}
                        title="Save to Wishlist"
                      >
                        ♥
                      </button>

                      <span className="absolute top-2 left-2 z-10 bg-[#2C2623]/85 backdrop-blur-xs text-white text-[8px] sm:text-[9px] font-sans font-bold px-2 py-0.5 rounded-full shadow-2xs">
                        {craft.hours} Craft
                      </span>

                      <Link href={`/product/${p.id}`} prefetch={true} className="block w-full h-full">
                        <img
                          src={p.imgUrl}
                          alt={`${p.name} - Handcrafted Crochet Under 199`}
                          className="w-full h-full object-cover transform group-hover:scale-106 transition-transform duration-500 cursor-pointer"
                          loading="lazy"
                        />
                      </Link>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-sans font-bold uppercase text-[#B06B5B] tracking-wider block">
                        {p.subcategory ? p.subcategory.replace('-', ' ') : p.category}
                      </span>
                      <Link href={`/product/${p.id}`} prefetch={true} className="block">
                        <h3 className="font-header font-bold text-xs sm:text-sm text-[#2C2623] line-clamp-2 min-h-[2rem] leading-snug group-hover:text-[#B06B5B] transition cursor-pointer">
                          {p.name}
                        </h3>
                      </Link>
                      <div className="text-[10px] text-stone-500 font-sans flex items-center gap-1">
                        <span>{craft.knots}</span>
                        <span>•</span>
                        <span>100% Milk Cotton</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#FAF6F0] flex flex-col gap-2 mt-3">
                    <div className="flex items-baseline justify-between gap-1 flex-wrap">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-sans font-extrabold text-sm sm:text-base text-[#2C2623]">Rs. {p.price}</span>
                        {p.originalPrice > p.price && (
                          <span className="text-[10px] sm:text-xs font-sans text-stone-400 line-through">Rs. {p.originalPrice}</span>
                        )}
                      </div>
                      <span className="text-[9px] font-sans font-bold text-[#2D5A37] bg-[#EBF5ED] px-1.5 py-0.5 rounded border border-[#CDE5D2]">
                        ₹{effectivePrice} with code
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(p)}
                      className="w-full py-2 px-3 rounded-xl bg-[#FAF5EE] hover:bg-[#B06B5B] text-[#2C2623] hover:text-white border border-[#E0D5C1] hover:border-[#B06B5B] font-sans text-[11px] font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                    >
                      <span>+ Add to Cart</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4.5 EDITORIAL LOOKBOOK ATELIER - TOP 3 BESTSELLERS (Admin Configurable) */}
      <section id="p4-lookbook" className="py-20 bg-[#F5EFEB] border-b border-[#E8DFC9] relative overflow-hidden text-center">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#F8E5E1]/50 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
          
          <div className="max-w-2xl mx-auto space-y-2 mb-14 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EE] border border-[#E0D5C1] text-[10px] font-bold uppercase tracking-[0.35em] text-[#B06B5B]">
              <span>Featured Bestsellers</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-light font-header text-[#2C2623] tracking-tight">
              Everyday Handcrafted Essentials
            </h2>
            <p className="text-xs sm:text-sm font-serif text-[#2C2623]/70 font-light leading-relaxed">
              Explore how Mehak's slow-knitted accessories style seamlessly with raw denim, linen shirts, and cottagecore silhouettes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {storeBestsellers.map((item, idx) => {
              const product = storeProducts.find((p) => p.id === item.id) || { id: item.id, name: item.title, price: item.price, imgUrl: item.imgUrl };
              const isFav = wishlist.includes(item.id);
              const craft = getCraftStats(product);

              return (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-3xl border border-[#E5DDD0] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5 text-left"
                >
                  <div>
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#FAF6F0] mb-4 shadow-inner">
                      <span className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[9px] font-black uppercase tracking-wider text-[#B06B5B] shadow-xs">
                        {item.rank || `N° 0${idx + 1} • Bestseller`}
                      </span>

                      <div className="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded-full bg-[#2C2623]/85 backdrop-blur-md text-[9px] font-bold text-white shadow-xs flex items-center gap-1.5">
                        <span>{craft.hours} Hand-knitted</span>
                        <span>•</span>
                        <span>{craft.knots}</span>
                      </div>

                      <button
                        onClick={() => toggleWishlist(product)}
                        className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer backdrop-blur-md shadow-xs ${
                          isFav ? "bg-[#B06B5B] text-white" : "bg-white/90 text-stone-500 hover:text-[#B06B5B]"
                        }`}
                        title="Save to Wishlist"
                      >
                        ♥
                      </button>

                      <Link href={`/product/${product.id}`} prefetch={true} className="block w-full h-full">
                        <img
                          src={item.imgUrl}
                          alt={`${item.title} - Handcrafted Crochet Bestseller GoCocoon`}
                          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 cursor-pointer"
                          loading="lazy"
                        />

                        <div className="absolute inset-0 bg-[#2C2623]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                          <span className="bg-white text-[#2C2623] text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-md hover:bg-[#B06B5B] hover:text-white transition">
                            Quick View
                          </span>
                        </div>
                      </Link>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black uppercase text-[#B06B5B] tracking-widest block">
                        {item.lookNote || item.tag}
                      </span>
                      <Link href={`/product/${product.id}`} prefetch={true} className="block">
                        <h4 className="text-lg font-bold font-header text-[#2C2623] group-hover:text-[#B06B5B] transition cursor-pointer">
                          {item.title}
                        </h4>
                      </Link>
                      <p className="text-xs text-[#2C2623]/65 font-serif font-light leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#F2ECE1]">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-sans font-bold text-lg text-[#2C2623]">Rs. {item.price}</span>
                        {item.originalPrice > item.price && (
                          <span className="text-xs font-sans text-stone-400 line-through">Rs. {item.originalPrice}</span>
                        )}
                      </div>
                      <span className="text-[9px] font-bold text-[#8B483B] bg-[#FDF0ED] px-2 py-0.5 rounded-full border border-[#F5D5CE] inline-block mt-1">
                        10% OFF with COCOON10
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className="px-4 py-2 rounded-full bg-[#2C2623] hover:bg-[#B06B5B] text-white text-xs font-sans uppercase tracking-wider font-bold transition-all duration-300 cursor-pointer shadow-xs hover:scale-105"
                    >
                      + Add to Basket
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. MAIN CATALOG: "What's New in the Shop" */}
      <section id="shop" className="py-20 relative">
        <span id="p4-treasures" className="sr-only" />
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 text-left border-b border-[#EFE8DD] pb-6">
            <div>
              <span className="text-[11px] font-sans font-bold uppercase tracking-[0.3em] text-[#B06B5B]">Fresh Off The Needles</span>
              <h2 className="text-4xl sm:text-5xl font-light font-header text-[#2C2623] mt-1">What's New in the Shop</h2>
              <p className="text-xs font-serif text-[#2C2623]/60 mt-1">Explore all {filteredProducts.length || storeProducts.length || 30} handmade heirloom pieces created by Mehak</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full sm:w-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full sm:w-56 px-4 py-2 rounded-full bg-white border border-[#DDD3C4] text-xs font-sans focus:outline-none focus:border-[#B06B5B] shadow-2xs"
              />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 rounded-full bg-white border border-[#DDD3C4] text-xs font-sans text-[#2C2623] focus:outline-none cursor-pointer shadow-2xs"
              >
                <option value="featured">Featured Treasures</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Most Loved & Reviewed</option>
              </select>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none font-sans text-xs max-w-full">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-full whitespace-nowrap shrink-0 transition-all font-medium cursor-pointer ${
                activeCategory === "all"
                  ? "bg-[#B06B5B] text-white shadow-xs font-bold"
                  : "bg-white text-[#2C2623]/75 border border-[#EAE0D2] hover:bg-[#FAF0ED]"
              }`}
            >
              All Treasures ({storeProducts.length || STORE.products.length})
            </button>
            {storeCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap shrink-0 transition-all font-medium cursor-pointer ${
                  activeCategory === c.id
                    ? "bg-[#B06B5B] text-white shadow-xs font-bold"
                    : "bg-white text-[#2C2623]/75 border border-[#EAE0D2] hover:bg-[#FAF0ED]"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* 4-Column Product Cards Grid */}
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
                      <button
                        onClick={() => toggleWishlist(product)}
                        className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center transition cursor-pointer backdrop-blur-xs shadow-xs ${
                          isFav ? "bg-[#B06B5B] text-white" : "bg-white/90 text-stone-500 hover:text-[#B06B5B]"
                        }`}
                      >
                        ♥
                      </button>

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
                      onClick={() => addToCart(product)}
                      className="w-full py-2 px-3 rounded-xl bg-[#FAF5EE] hover:bg-[#B06B5B] text-[#2C2623] hover:text-white border border-[#E0D5C1] hover:border-[#B06B5B] font-sans text-[11px] font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                    >
                      <span>+ Add to Cart</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5.5 HEARTFELT NOTES • REAL CUSTOMER UNBOXING (Nimisha Agarwal Spotlight) */}
      <section id="gifting-experience" className="py-20 bg-[#FAF6F1] border-b border-[#EAE0D2] relative overflow-hidden text-left">
        {/* Hanging Crochet Ribbon Ladi Garland across top */}
        <div className="absolute -top-1 left-0 right-0 h-10 overflow-hidden pointer-events-none flex justify-center opacity-70">
          <svg className="w-full max-w-7xl h-10" viewBox="0 0 1200 40" fill="none" preserveAspectRatio="none">
            <path d="M 0,5 Q 100,28 200,8 Q 300,28 400,8 Q 500,28 600,8 Q 700,28 800,8 Q 900,28 1000,8 Q 1100,28 1200,5" stroke="#CBB4A7" strokeWidth="1.5" strokeDasharray="4 3" />
            {[200, 400, 600, 800, 1000].map((x) => (
              <g key={x} transform={`translate(${x}, 8)`}>
                <circle cx="0" cy="0" r="2.5" fill="#B06B5B" />
                <path d="M 0,0 C -6,-5 -10,-1 -7,3 C -4,5 -1,1 0,0 Z" fill="#B06B5B" opacity="0.85" />
                <path d="M 0,0 C 6,-5 10,-1 7,3 C 4,5 1,1 0,0 Z" fill="#B06B5B" opacity="0.85" />
                <path d="M -1,2 Q -3,8 -4,12" stroke="#B06B5B" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M 1,2 Q 3,8 4,12" stroke="#B06B5B" strokeWidth="1.2" strokeLinecap="round" />
              </g>
            ))}
          </svg>
        </div>

        {/* Left Side Hanging Ribbon Ladi (Decorative Streamer) */}
        <div className="hidden xl:block absolute top-8 left-8 pointer-events-none opacity-60">
          <svg width="60" height="260" viewBox="0 0 60 260" fill="none">
            <path d="M 30,0 Q 20,40 32,80 Q 42,120 28,160 Q 18,200 30,240" stroke="#CBB4A7" strokeWidth="1.5" strokeDasharray="3 3" />
            <g transform="translate(32, 80)">
              <circle cx="0" cy="0" r="2.5" fill="#B06B5B" />
              <path d="M 0,0 C -7,-5 -12,-1 -9,4 C -6,6 -2,2 0,0 Z" fill="#B06B5B" opacity="0.85" />
              <path d="M 0,0 C 7,-5 12,-1 9,4 C 6,6 2,2 0,0 Z" fill="#B06B5B" opacity="0.85" />
              <path d="M -1,2 Q -4,10 -6,16" stroke="#B06B5B" strokeWidth="1.3" strokeLinecap="round" />
              <path d="M 1,2 Q 4,10 6,16" stroke="#B06B5B" strokeWidth="1.3" strokeLinecap="round" />
            </g>
            <g transform="translate(28, 160)">
              <circle cx="0" cy="0" r="2.5" fill="#C48073" />
              <path d="M 0,0 C -7,-5 -12,-1 -9,4 C -6,6 -2,2 0,0 Z" fill="#C48073" opacity="0.85" />
              <path d="M 0,0 C 7,-5 12,-1 9,4 C 6,6 2,2 0,0 Z" fill="#C48073" opacity="0.85" />
              <path d="M -1,2 Q -4,10 -5,15" stroke="#C48073" strokeWidth="1.3" strokeLinecap="round" />
              <path d="M 1,2 Q 4,10 5,15" stroke="#C48073" strokeWidth="1.3" strokeLinecap="round" />
            </g>
            <g transform="translate(30, 240)">
              <circle cx="0" cy="0" r="2.5" fill="#B06B5B" />
              <path d="M 0,0 C -6,-4 -10,-1 -8,3 C -5,5 -1,1 0,0 Z" fill="#B06B5B" opacity="0.8" />
              <path d="M 0,0 C 6,-4 10,-1 8,3 C 5,5 1,1 0,0 Z" fill="#B06B5B" opacity="0.8" />
              <circle cx="0" cy="10" r="3.5" fill="#FAF0EA" stroke="#B06B5B" strokeWidth="1.2" />
            </g>
          </svg>
        </div>

        {/* Right Side Hanging Ribbon Ladi (Decorative Streamer) */}
        <div className="hidden xl:block absolute top-8 right-8 pointer-events-none opacity-60">
          <svg width="60" height="260" viewBox="0 0 60 260" fill="none">
            <path d="M 30,0 Q 40,40 28,80 Q 18,120 32,160 Q 42,200 30,240" stroke="#CBB4A7" strokeWidth="1.5" strokeDasharray="3 3" />
            <g transform="translate(28, 80)">
              <circle cx="0" cy="0" r="2.5" fill="#B06B5B" />
              <path d="M 0,0 C -7,-5 -12,-1 -9,4 C -6,6 -2,2 0,0 Z" fill="#B06B5B" opacity="0.85" />
              <path d="M 0,0 C 7,-5 12,-1 9,4 C 6,6 2,2 0,0 Z" fill="#B06B5B" opacity="0.85" />
              <path d="M -1,2 Q -4,10 -6,16" stroke="#B06B5B" strokeWidth="1.3" strokeLinecap="round" />
              <path d="M 1,2 Q 4,10 6,16" stroke="#B06B5B" strokeWidth="1.3" strokeLinecap="round" />
            </g>
            <g transform="translate(32, 160)">
              <circle cx="0" cy="0" r="2.5" fill="#C48073" />
              <path d="M 0,0 C -7,-5 -12,-1 -9,4 C -6,6 -2,2 0,0 Z" fill="#C48073" opacity="0.85" />
              <path d="M 0,0 C 7,-5 12,-1 9,4 C 6,6 2,2 0,0 Z" fill="#C48073" opacity="0.85" />
              <path d="M -1,2 Q -4,10 -5,15" stroke="#C48073" strokeWidth="1.3" strokeLinecap="round" />
              <path d="M 1,2 Q 4,10 5,15" stroke="#C48073" strokeWidth="1.3" strokeLinecap="round" />
            </g>
            <g transform="translate(30, 240)">
              <circle cx="0" cy="0" r="2.5" fill="#B06B5B" />
              <path d="M 0,0 C -6,-4 -10,-1 -8,3 C -5,5 -1,1 0,0 Z" fill="#B06B5B" opacity="0.8" />
              <path d="M 0,0 C 6,-4 10,-1 8,3 C 5,5 1,1 0,0 Z" fill="#B06B5B" opacity="0.8" />
              <circle cx="0" cy="10" r="3.5" fill="#FAF0EA" stroke="#B06B5B" strokeWidth="1.2" />
            </g>
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-6 sm:px-10 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Real Customer Photo presented in full 16:9.5 uncropped landscape ratio */}
            <div className="lg:col-span-6">
              <div className="relative bg-white p-3 sm:p-4 rounded-2xl border border-[#E8DFC9] shadow-sm">
                {/* Handcrafted Ribbon Bow on Polaroid Card */}
                <div className="absolute -top-3.5 -left-3.5 z-20 pointer-events-none drop-shadow-xs">
                  <svg className="w-8 h-8 text-[#B06B5B]" viewBox="0 0 36 36" fill="currentColor">
                    <ellipse cx="18" cy="14" rx="3.5" ry="3" />
                    <path d="M 18,14 C 12,6 4,9 6,15 C 8,19 15,16 18,14 Z" opacity="0.9" />
                    <path d="M 18,14 C 24,6 32,9 30,15 C 28,19 21,16 18,14 Z" opacity="0.9" />
                    <path d="M 16,16 Q 12,24 9,28 Q 13,27 15,22 Q 17,17 16,16 Z" opacity="0.85" />
                    <path d="M 20,16 Q 24,24 27,28 Q 23,27 21,22 Q 19,17 20,16 Z" opacity="0.85" />
                  </svg>
                </div>

                <div className="aspect-[1024/608] w-full rounded-xl overflow-hidden bg-[#FAF6F0] border border-[#F2ECE1]">
                  <img
                    src="/reviews/nimisha-agarwal-rose-clips-bow.jpg"
                    alt="Handcrafted Rose Hair Accessories unboxed by Nimisha Agarwal"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="pt-3 text-center">
                  <p className="text-xs font-serif text-[#2C2623]/75 italic">
                    Rose clips &amp; pearl bow unboxed by Nimisha
                  </p>
                  <span className="text-[10px] font-sans text-stone-400 uppercase tracking-wider block mt-0.5">
                    Surprise Gift Recipient
                  </span>
                </div>
              </div>
            </div>

            {/* Editorial Quote & Minimal Note */}
            <div className="lg:col-span-6 space-y-5">
              <span className="text-[11px] font-sans font-bold uppercase tracking-[0.25em] text-[#B06B5B] block">
                Heartfelt Moments
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light font-header text-[#2C2623] leading-snug">
                &ldquo;Your efforts are visible in each and every thing.&rdquo;
              </h2>

              <blockquote className="text-sm sm:text-base font-serif italic text-[#2C2623]/80 leading-relaxed border-l-2 border-[#B06B5B]/40 pl-4 py-1">
                &ldquo;Thank you very much ...all these are really very beautiful and this gift was totally unexpected...I&apos;m really happy ...your efforts are visible in each and every thing ...thank you for the gift.&rdquo;
              </blockquote>

              <div className="text-xs text-[#2C2623]/70 font-sans pt-1">
                <span className="font-bold text-[#2C2623]">Nimisha Agarwal</span>
                <span className="mx-2 text-stone-300">•</span>
                <span className="text-stone-500 font-serif">Verified Customer Note</span>
              </div>

              <div className="pt-4 border-t border-[#EAE0D2] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs font-serif text-[#2C2623]/65 leading-relaxed max-w-sm">
                  Every piece is sent in our signature butter paper wrap with a complimentary handwritten, wax-sealed note.
                </p>

                <button
                  onClick={() => {
                    const shop = document.getElementById("shop") || document.getElementById("p4-treasures");
                    shop?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#B06B5B] hover:text-[#964B44] transition shrink-0 cursor-pointer"
                >
                  <span>Explore Gifts &rarr;</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 6. A LETTER FROM THE MAKER (Minimalist Luxury • Zara / Jacquemus Vibe) */}
      <section id="our-story" className="py-24 sm:py-32 bg-[#FAF7F2] border-y border-[#EAE3D6] relative overflow-hidden text-left">
        <span id="p4-maker-letter" className="sr-only" />
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* LEFT: EDITORIAL TYPOGRAPHY & LETTER (7 COLS) */}
            <div className="lg:col-span-7 space-y-8">
              
              <div className="space-y-4">
                <span className="text-[11px] font-sans uppercase tracking-[0.35em] text-[#B06B5B] font-bold block">
                  Letter from Mehak
                </span>
                
                <h2 className="text-3xl sm:text-5xl lg:text-[52px] font-header font-light text-[#221F1F] leading-[1.14] tracking-tight">
                  "We choose to slow down. Every knot is woven by hand with quiet intention and warmth."
                </h2>
              </div>

              <div className="space-y-5 text-sm sm:text-base text-[#2C2623]/80 leading-relaxed font-serif font-light max-w-2xl">
                <p>
                  Cocoon started on a quiet afternoon with two bamboo crochet hooks and a basket of combed organic milk cotton. In an era rushing through fast trends, synthetic fibers, and industrial conveyor belts, I wanted to craft keepsakes that carry memory, identity, and personal touch.
                </p>
                <p>
                  Every handbag, floral sleeve, and custom piece is looped knot-by-knot in our studio. No machines, no shortcuts, and no two pieces that are ever quite identical. When you hold a Cocoon piece, you hold days of slow craftsmanship made to be cherished for years.
                </p>
              </div>

              {/* ARTISTIC SIGNATURE & ACTION */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-t border-[#EAE3D6]">
                <div>
                  <div className="font-header italic text-4xl sm:text-5xl text-[#B06B5B] font-light tracking-wide leading-none select-none">
                    — Mehak
                  </div>
                  <p className="text-[11px] font-sans uppercase tracking-[0.25em] text-stone-500 font-semibold mt-2.5">
                    Founder & Needlework Artist
                  </p>
                </div>

                <a
                  href="#custom-order"
                  className="inline-flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-widest text-[#221F1F] hover:text-[#B06B5B] transition-colors group cursor-pointer"
                >
                  <span>Request a Custom Piece</span>
                  <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                </a>
              </div>

            </div>

            {/* RIGHT: HIGH-FASHION MINIMALIST VISUAL (5 COLS) */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[3/4] sm:aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-[#E8DFC9] bg-[#F3EDE2] group">
                <img
                  src="/products/items/chocolate-bow-handbag.jpg"
                  alt="Handcrafted Heirloom Crochet by Mehak"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Minimalist Floating Corner Tag */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                  <span className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#221F1F] shadow-sm">
                    Slow Craft • Handmade
                  </span>
                  <span className="text-[11px] font-serif italic text-white/90 drop-shadow-md">
                    100% Milk Cotton
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6.5 SOCIAL SHOWCASE: "Follow Our Instagram Journey" */}
      <InstagramShowcase />

      {/* 7. BESPOKE STUDIO ORDER: COMMISSION A CUSTOM HEIRLOOM */}
      <section id="custom-order" className="pt-16 pb-16 sm:pt-20 sm:pb-20 bg-[#FAF7F2] border-t border-[#EAE0D2] relative overflow-hidden font-sans">
        <span id="p4-commission-slip" className="sr-only" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#F8E5E1]/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#EDF3EE]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 sm:px-10 relative z-10 text-left">
          
          {/* HEADER */}
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-[11px] font-sans font-bold uppercase tracking-[0.28em] text-[#B06B5B] inline-block bg-[#FAF0ED] px-4 py-1.5 rounded-full border border-[#ECCEC7] shadow-2xs">
              ✦ Made-To-Order Atelier
            </span>
            <h2 className="text-3xl sm:text-5xl font-light font-header text-[#2C2623] tracking-tight">
              Design Your Bespoke Heirloom
            </h2>
            <p className="text-xs sm:text-sm font-serif text-[#2C2623]/70 leading-relaxed max-w-lg mx-auto">
              Have a dream colorway, an outfit to match, or a Pinterest look you adore? Mehak hand-knits your vision stitch-by-stitch with premium artisan yarns.
            </p>
          </div>

          {/* 4 MOODBOARD INSPIRATION PILLS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-12">
            {[
              {
                title: "Custom Palettes",
                desc: "Match your favorite outfit or aesthetic with curated milk cotton yarn shades.",
                iconSvg: (
                  <svg className="w-5 h-5 text-[#B06B5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 10 10 0 0 0 9.5-6.8" />
                    <circle cx="8" cy="10" r="1.2" fill="currentColor" />
                    <circle cx="12" cy="7" r="1.2" fill="currentColor" />
                    <circle cx="16" cy="10" r="1.2" fill="currentColor" />
                  </svg>
                )
              },
              {
                title: "Motif & Petal Swaps",
                desc: "Personalize with 3D daisies, sunflowers, roses, or evil eye charms.",
                iconSvg: (
                  <svg className="w-5 h-5 text-[#B06B5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V3m4.5 9a4.5 4.5 0 1 1-4.5 4.5M16.5 12H21m-9 4.5a4.5 4.5 0 1 1-4.5-4.5M12 16.5V21m-4.5-9H3" />
                  </svg>
                )
              },
              {
                title: "Tailored Sizing",
                desc: "Custom strap lengths, specific phone models, and adjustable waist wraps.",
                iconSvg: (
                  <svg className="w-5 h-5 text-[#B06B5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M21.3 8.7 8.7 21.3c-1 1-2.5 1-3.5 0l-2.5-2.5c-1-1-1-2.5 0-3.5L15.3 2.7c1-1 2.5-1 3.5 0l2.5 2.5c1 1 1 2.5 0 3.5z" />
                    <path d="m14.5 6.5 2 2M11.5 9.5l2 2M8.5 12.5l2 2M5.5 15.5l2 2" />
                  </svg>
                )
              },
              {
                title: "Bridal & Occasions",
                desc: "Romantic ivory, champagne, and blush palettes with delicate pearl beadwork.",
                iconSvg: (
                  <svg className="w-5 h-5 text-[#B06B5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                )
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-[#EDE3D6] shadow-2xs space-y-2 hover:border-[#B06B5B]/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-xl bg-[#FAF0ED] flex items-center justify-center">
                  {item.iconSvg}
                </div>
                <p className="font-header font-bold text-sm text-[#2C2623]">{item.title}</p>
                <p className="text-[11px] font-serif text-[#2C2623]/65 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* TWO MAIN INTERACTIVE PATHS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* PATH 1: THE VIP WHATSAPP ATELIER CONCIERGE (FASTEST & EASIEST) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#FAF5EE] via-white to-[#FAF0ED]/40 rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-md space-y-6 lg:sticky lg:top-28">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#FAF4ED]">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#B06B5B] text-white flex items-center justify-center font-header font-bold text-lg shadow-xs">
                    M
                  </div>
                  <div>
                    <h3 className="font-header font-bold text-base text-[#2C2623] leading-tight">Chat with Mehak</h3>
                    <p className="text-[11px] text-[#8B5E3C] font-sans font-bold flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#B06B5B] animate-pulse"></span>
                      Studio Online • Fast Reply
                    </p>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-[#FAF0ED] text-[#B06B5B] border border-[#ECCEC7] px-2.5 py-0.5 rounded-full shadow-2xs">
                  Fastest
                </span>
              </div>

              <div className="space-y-3 text-left">
                <h4 className="font-header font-bold text-lg text-[#2C2623] leading-snug">
                  Skip the form! Just send your photo on WhatsApp
                </h4>
                <p className="text-xs font-serif text-[#2C2623]/70 leading-relaxed">
                  Got a Pinterest screenshot, an Instagram Reel, or a color swatch? Message Mehak directly. She will discuss your design, share live yarn shade photos, and quote you right away.
                </p>
              </div>

              {/* WHATSAPP ACTION BUTTON */}
              <a
                href="https://wa.me/918171902255?text=Hi%20Mehak!%20I%20want%20to%20discuss%20a%20custom%20crochet%20order%20with%20you.%20Here%20is%20my%20idea:"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl bg-[#2C2623] hover:bg-[#B06B5B] text-white font-sans text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer text-center group"
              >
                <svg className="w-5 h-5 fill-current shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>Chat on WhatsApp (+91 8171902255)</span>
              </a>

              {/* THREE REASSURANCES */}
              <div className="pt-2 border-t border-[#FAF4ED] space-y-2 text-xs font-serif text-[#2C2623]/75">
                <div className="flex items-center gap-2">
                  <span className="text-[#B06B5B] font-bold">✓</span>
                  <span>Personal yarn advice & live shade confirmation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#B06B5B] font-bold">✓</span>
                  <span>Zero deposit required to explore ideas & quotes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#B06B5B] font-bold">✓</span>
                  <span>Lovingly crafted in 4–7 days with luxury gift packaging</span>
                </div>
              </div>

            </div>

            {/* PATH 2: THE MODERN STREAMLINED BESPOKE INQUIRY SLIP */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-9 border border-[#EAE0D2] shadow-sm space-y-6">
              
              <div className="border-b border-[#FAF4ED] pb-3.5">
                <span className="text-[10px] font-sans uppercase font-bold tracking-widest text-[#B06B5B] block">
                  Online Inquiry Slip
                </span>
                <h3 className="font-header font-bold text-2xl text-[#2C2623]">
                  Tell Us About Your Vision
                </h3>
                <p className="text-xs font-serif text-[#2C2623]/60 mt-0.5">
                  Mehak will review your details and send you a personalized quote with yarn swatches.
                </p>
              </div>

              {/* STEP 1: CHOOSE PIECE TYPE */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#2C2623] block">
                  What piece would you like created?
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Handbag / Tote" },
                    { label: "Phone Sleeve" },
                    { label: "Waist Belt / Scarf" },
                    { label: "Charms & Bows" },
                    { label: "Other Dream Idea" }
                  ].map((cat) => {
                    const isSelected = formData.category === cat.label;
                    return (
                      <button
                        key={cat.label}
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          category: cat.label,
                          productName: formData.productName || cat.label
                        })}
                        className={`px-4 py-2 rounded-full text-xs font-sans transition cursor-pointer border ${
                          isSelected
                            ? "bg-[#B06B5B] text-white border-[#B06B5B] shadow-xs font-bold"
                            : "bg-[#FAF7F2] text-[#2C2623]/80 border-[#EDE3D6] hover:bg-white font-medium"
                        }`}
                      >
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 2: YOUR VISION, COLORS & REFERENCE */}
              <div className="space-y-3 pt-2 border-t border-[#F5ECE1]">
                <div>
                  <label className="text-xs font-bold text-[#2C2623] block mb-1">
                    Describe your vision (Colors, motifs, size, or occasion)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.idea}
                    onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
                    placeholder="e.g. Sage green and vanilla cream daisy tote bag, or matching phone pouch with blush pink bows..."
                    className="w-full bg-[#FAF7F2] focus:bg-white border border-[#DDD3C4] focus:border-[#B06B5B] rounded-2xl p-3.5 text-xs font-sans focus:outline-none transition shadow-2xs resize-none"
                  />
                </div>

                {/* MEDIA ATTACHMENT OR LINK */}
                <div className="space-y-2">
                  <input
                    type="file"
                    id="bespoke-media-file"
                    accept="image/*,video/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                  />

                  {formData.mediaPreview ? (
                    <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#B06B5B]/30 flex items-center justify-between gap-3 shadow-2xs animate-fadeIn">
                      <div className="flex items-center gap-3 min-w-0">
                        {formData.mediaType === "image" ? (
                          <img
                            src={formData.mediaPreview}
                            alt="Reference"
                            className="w-12 h-12 rounded-xl object-cover border border-[#EAE0D2]"
                          />
                        ) : (
                          <video
                            src={formData.mediaPreview}
                            className="w-12 h-12 rounded-xl object-cover border border-[#EAE0D2] bg-black"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#2C2623] truncate">
                            {formData.mediaFile?.name || "Reference Media"}
                          </p>
                          <span className="text-[10px] text-[#526B57] font-semibold">
                            Attached successfully
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={removeMedia}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <label
                        htmlFor="bespoke-media-file"
                        className="px-4 py-2.5 rounded-xl border border-dashed border-[#DDD3C4] hover:border-[#B06B5B] bg-[#FAF7F2] hover:bg-white transition flex items-center justify-center gap-2 cursor-pointer text-xs font-medium text-[#2C2623]/80 shrink-0"
                      >
                        <svg className="w-4 h-4 text-[#B06B5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                        </svg>
                        <span>Attach Reference Photo</span>
                      </label>
                      <input
                        type="url"
                        value={formData.socialLink}
                        onChange={(e) => setFormData({ ...formData, socialLink: e.target.value })}
                        placeholder="Or paste Instagram Reel / Pinterest URL..."
                        className="w-full bg-[#FAF7F2] focus:bg-white border border-[#DDD3C4] focus:border-[#B06B5B] rounded-xl px-3.5 py-2 text-xs font-sans focus:outline-none transition"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* STEP 3: CONTACT & TIMELINE */}
              <div className="space-y-3 pt-2 border-t border-[#F5ECE1]">
                <label className="text-xs font-bold text-[#2C2623] block">
                  Where should Mehak send your quote & yarn swatches? <span className="text-[#B06B5B]">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your Name *"
                    className="w-full bg-[#FAF7F2] focus:bg-white border border-[#DDD3C4] focus:border-[#B06B5B] rounded-xl px-3.5 py-2.5 text-xs font-sans focus:outline-none transition"
                  />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="WhatsApp / Phone Number *"
                    className="w-full bg-[#FAF7F2] focus:bg-white border border-[#DDD3C4] focus:border-[#B06B5B] rounded-xl px-3.5 py-2.5 text-xs font-sans focus:outline-none transition"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email Address (Optional)"
                    className="w-full bg-[#FAF7F2] focus:bg-white border border-[#DDD3C4] focus:border-[#B06B5B] rounded-xl px-3.5 py-2.5 text-xs font-sans focus:outline-none transition"
                  />
                  <input
                    type="text"
                    value={formData.neededBy}
                    onChange={(e) => setFormData({ ...formData, neededBy: e.target.value })}
                    placeholder="Needed by date (e.g. 25th Oct, or No rush)"
                    className="w-full bg-[#FAF7F2] focus:bg-white border border-[#DDD3C4] focus:border-[#B06B5B] rounded-xl px-3.5 py-2.5 text-xs font-sans focus:outline-none transition"
                  />
                </div>
              </div>

              {/* ACTION SUBMIT */}
              <div className="pt-2 space-y-2.5">
                <button
                  type="button"
                  onClick={async () => {
                    if (!formData.name && !formData.phone) {
                      triggerToast("Please enter your name and phone number");
                      return;
                    }
                    let uploadedUrl = null;
                    if (formData.mediaFile) {
                      triggerToast("Uploading reference photo...");
                      uploadedUrl = await uploadMediaToSupabase(formData.mediaFile);
                    }
                    const custItem = {
                      id: "CUST-" + Math.floor(100 + Math.random() * 900),
                      date: new Date().toISOString(),
                      name: formData.name || "Customer",
                      phone: formData.phone || "N/A",
                      email: formData.email || "",
                      productName: formData.productName || formData.category,
                      category: formData.category,
                      colorway: formData.colorway,
                      idea: formData.idea,
                      neededBy: formData.neededBy,
                      budget: formData.budget,
                      socialLink: formData.socialLink,
                      mediaName: formData.mediaFile ? formData.mediaFile.name : "",
                      mediaUrl: uploadedUrl,
                      status: "New"
                    };
                    const existing = STORE.getCustomizations();
                    STORE.setCustomizations([custItem, ...existing]);
                    await saveCustomizationToSupabase(custItem);

                    // Dispatch notifications
                    STORE.dispatchEmailNotification("custom_inquiry", { inquiry: custItem });
                    STORE.sendWhatsAppNotification("customization", custItem);

                    setShowSuccessModal(true);
                    triggerToast("Bespoke inquiry submitted! Mehak will reach out on WhatsApp.");
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#B06B5B] hover:bg-[#975647] text-white font-sans text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
                >
                  <span>Submit Bespoke Inquiry</span>
                  <span className="text-base font-normal">→</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 text-[11px] text-[#2C2623]/65 font-serif pt-1 text-center">
                <span>Zero advance fee to inquire</span>
                <span>•</span>
                <span>Personal WhatsApp confirmation</span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 7.5 ATELIER FREQUENTLY ASKED QUESTIONS */}
      <FaqSection />

      {/* 8. MASTER STUDIO FOOTER */}
      <Footer />





      {/* 11. QUICK VIEW MODAL */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C2623]/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 text-left relative border border-[#EFE8DD]">
            <button onClick={() => setQuickViewProduct(null)} className="absolute top-3.5 right-3.5 z-20 text-stone-400 hover:text-stone-800">✕</button>
            <div className="aspect-square bg-[#FAF6F0]">
              <img src={quickViewProduct.imgUrl} alt={quickViewProduct.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#B06B5B]">{quickViewProduct.subcategory || quickViewProduct.category}</span>
                <h3 className="text-2xl font-light font-header text-[#2C2623]">{quickViewProduct.name}</h3>
                <p className="text-lg font-sans font-bold text-[#2C2623]">Rs. {quickViewProduct.price}</p>
                <p className="text-xs text-[#2C2623]/70 font-sans leading-relaxed font-light">{quickViewProduct.desc}</p>
              </div>
              <button onClick={() => addToCart(quickViewProduct, selectedColor)} className="w-full py-3.5 rounded-full bg-[#B06B5B] hover:bg-[#975647] text-white font-sans text-xs uppercase tracking-widest font-bold">
                Add to Basket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 12. SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C2623]/60 p-4 animate-fadeIn font-serif">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center space-y-4 border border-[#EFE8DD] font-sans">
            <div className="w-16 h-16 rounded-full bg-[#FAF0ED] text-[#B06B5B] flex items-center justify-center text-2xl font-bold mx-auto shadow-xs border border-[#ECCEC7]">
              ✓
            </div>
            <h3 className="text-2xl font-header font-bold text-[#2C2623]">Commission Inquiry Received</h3>
            <p className="text-xs text-[#2C2623]/75 leading-relaxed font-normal">
              Thank you <strong className="text-[#2C2623]">{formData.name || "friend"}</strong>! Mehak has received your custom inquiry for <strong className="text-[#B06B5B]">{formData.productName || formData.category}</strong>.
            </p>
            <p className="text-[11px] text-[#526B57] bg-[#EDF3EE] p-3 rounded-xl border border-[#DCE7DE] font-semibold">
              Notification sent to Mehak (+91 8171902255). We will reach out on your WhatsApp within 24 hours.
            </p>
            <button onClick={() => setShowSuccessModal(false)} className="w-full py-3 rounded-full bg-[#526B57] hover:bg-[#405444] text-white text-xs uppercase tracking-wider font-bold transition cursor-pointer">
              Back to Shop
            </button>
          </div>
        </div>
      )}

      {/* 13. FLOATING ACTION TOAST */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2C2623] text-white px-5 py-3 rounded-full shadow-2xl text-xs font-sans font-bold animate-fadeIn">
          {toastMessage}
        </div>
      )}

    
      {/* 12. CUSTOMER AUTHENTICATION & ORDER CHECKOUT MODAL */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C2623]/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6 sm:p-8 relative border border-[#EFE8DD] text-left space-y-5 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 text-lg cursor-pointer"
            >
              ✕
            </button>

            {/* A. CHECKOUT MODE (When customer is placing an order) */}
            {authModalMode === "checkout" && (
              <div className="space-y-4">
                <div className="border-b border-[#FAF4ED] pb-3">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#B06B5B] block">
                    Customer Sign-In & Delivery Details
                  </span>
                  <h3 className="text-2xl font-header font-bold text-[#2C2623] mt-0.5">
                    Complete Your Order
                  </h3>
                  <p className="text-xs text-stone-500 font-serif mt-1">
                    Please provide your contact & address so Mehak can hand-knit and ship your heirloom pieces.
                  </p>
                </div>

                <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#EAE0D2] flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-[#2C2623] block">{totalQty} Handcrafted Treasures</span>
                    <span className="text-stone-500">Cart Total</span>
                  </div>
                  <span className="text-base font-bold text-[#B06B5B]">Rs. {subtotal}</span>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (cart.length === 0) {
                      triggerToast("Your basket is empty");
                      return;
                    }

                    if (!customerForm.name?.trim() || !customerForm.phone?.trim() || !customerForm.address?.trim()) {
                      triggerToast("Please fill in your name, phone, and delivery address");
                      return;
                    }

                    if (customerForm.phone.replace(/\D/g, "").length < 10) {
                      triggerToast("Please enter a valid 10-digit mobile number");
                      return;
                    }

                    setIsProcessingPayment(true);
                    triggerToast("Opening secure Razorpay payment gateway... ⏳");

                    const isLoaded = await new Promise((resolve) => {
                      if (typeof window !== "undefined" && window.Razorpay) return resolve(true);
                      const script = document.createElement("script");
                      script.src = "https://checkout.razorpay.com/v1/checkout.js";
                      script.onload = () => resolve(true);
                      script.onerror = () => resolve(false);
                      document.body.appendChild(script);
                    });

                    if (!isLoaded) {
                      setIsProcessingPayment(false);
                      triggerToast("Failed to load payment gateway. Please check your internet connection.");
                      return;
                    }

                    const custData = {
                      name: customerForm.name.trim(),
                      phone: customerForm.phone.trim(),
                      email: customerForm.email.trim(),
                      address: customerForm.address.trim(),
                      city: customerForm.city.trim() || "India",
                      pincode: customerForm.pincode.trim() || "",
                      notes: customerForm.notes.trim()
                    };

                    setCustomerUser(custData);
                    try {
                      localStorage.setItem("cocoon_customer_user", JSON.stringify(custData));
                    } catch (err) {}

                    try {
                      const res = await fetch("/api/payment/create-order", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          amount: subtotal,
                          receipt: "rcpt_" + Date.now(),
                          notes: {
                            customerName: custData.name,
                            customerPhone: custData.phone,
                            itemsCount: cart.length
                          }
                        })
                      });

                      const orderData = await res.json();
                      const razorpayOrderId = orderData.orderId || orderData.id;
                      if (!orderData.success || !razorpayOrderId) {
                        setIsProcessingPayment(false);
                        triggerToast(orderData.error || "Unable to initiate payment. Please try again.");
                        return;
                      }

                      let orderFinalized = false;
                      let pollTimer = null;

                      const finalizePresetOrder = (paymentId) => {
                        if (orderFinalized) return;
                        orderFinalized = true;
                        if (pollTimer) clearInterval(pollTimer);

                        const newOrder = {
                          id: generateOrderId(),
                          date: new Date().toISOString(),
                          customerName: custData.name,
                          customerPhone: custData.phone,
                          customerEmail: custData.email || "",
                          address: `${custData.address}, ${custData.city} - ${custData.pincode}`,
                          items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, color: i.color })),
                          totalAmount: subtotal,
                          status: "Processing",
                          paymentMethod: "Online Payment (Razorpay)",
                          utr: paymentId,
                          paymentStatus: `Paid via Razorpay (ID: ${paymentId})`,
                          notes: (custData.notes ? custData.notes + " • " : "") + `Paid Online via Razorpay [Payment ID: ${paymentId}]`
                        };

                        // 1. Immediately update UI & Cart so customer sees instant confirmation
                        const existingOrders = STORE.getOrders();
                        STORE.setOrders([newOrder, ...existingOrders]);
                        setIsProcessingPayment(false);
                        setPlacedOrderSummary(newOrder);
                        setCart([]);
                        persistCart([]);
                        setIsAuthModalOpen(false);
                        triggerToast(`Order confirmed for ${custData.name}!`);

                        // 2. Background non-blocking persistence and notifications
                        (async () => {
                          try {
                            await saveOrderToSupabase(newOrder);
                          } catch (e) {
                            console.warn("Background order sync warning:", e);
                          }
                          try {
                            STORE.dispatchEmailNotification("order_placed", { order: newOrder });
                            STORE.sendWhatsAppNotification("order", newOrder);
                          } catch (e) {
                            console.warn("Background notification warning:", e);
                          }
                        })();
                      };

                      // Background polling for Google Pay / UPI intent app-switch
                      pollTimer = setInterval(async () => {
                        if (orderFinalized) {
                          clearInterval(pollTimer);
                          return;
                        }
                        try {
                          const pollRes = await fetch(`/api/payment/check-order?orderId=${encodeURIComponent(razorpayOrderId)}`);
                          const pollData = await pollRes.json();
                          if (pollData.success && pollData.paid) {
                            finalizePresetOrder(pollData.paymentId);
                          }
                        } catch (_) {}
                      }, 3500);

                      setTimeout(() => {
                        if (pollTimer) clearInterval(pollTimer);
                      }, 240000);

                      const options = {
                        key: orderData.keyId,
                        amount: orderData.amount,
                        currency: orderData.currency || "INR",
                        name: "COCOON",
                        description: "Stitched with love, packed with care",
                        image: "https://www.gococoon.store/icon.svg",
                        order_id: razorpayOrderId,
                        callback_url: `${typeof window !== "undefined" ? window.location.origin : "https://www.gococoon.store"}/api/payment/callback`,
                        redirect: true,
                        prefill: {
                          name: custData.name,
                          contact: custData.phone,
                          email: custData.email || ""
                        },
                        notes: {
                          customerName: custData.name,
                          customerPhone: custData.phone,
                          customerEmail: custData.email || "",
                          address: `${custData.address || ""}${custData.city ? `, ${custData.city}` : ""}${custData.pincode ? ` - ${custData.pincode}` : ""}`.trim()
                        },
                        theme: {
                          color: "#B06B5B"
                        },
                        handler: async function (response) {
                          try {
                            triggerToast("Verifying payment with bank... ⏳");
                            const verifyRes = await fetch("/api/payment/verify", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id || razorpayOrderId,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature || ""
                              })
                            });

                            const verifyData = await verifyRes.json();
                            if (verifyData.success) {
                              finalizePresetOrder(response.razorpay_payment_id);
                              return;
                            }

                            // Secondary fallback check directly with Razorpay
                            const fbRes = await fetch(`/api/payment/check-order?orderId=${encodeURIComponent(razorpayOrderId)}`);
                            const fbData = await fbRes.json();
                            if (fbData.success && fbData.paid) {
                              finalizePresetOrder(fbData.paymentId || response.razorpay_payment_id);
                              return;
                            }

                            setIsProcessingPayment(false);
                            triggerToast("Payment verification failed. Please contact studio.");
                          } catch (err) {
                            console.error("Verification error:", err);
                            // Last ditch status check
                            try {
                              const lastCheck = await fetch(`/api/payment/check-order?orderId=${encodeURIComponent(razorpayOrderId)}`);
                              const lastData = await lastCheck.json();
                              if (lastData.success && lastData.paid) {
                                finalizePresetOrder(lastData.paymentId || response?.razorpay_payment_id);
                                return;
                              }
                            } catch (_) {}
                            setIsProcessingPayment(false);
                            triggerToast("Payment verification failed.");
                          }
                        },
                        modal: {
                          ondismiss: async function () {
                            if (orderFinalized) return;
                            if (pollTimer) clearInterval(pollTimer);

                            // Inspect if the payment actually went through before declaring cancelled
                            try {
                              const chkRes = await fetch(`/api/payment/check-order?orderId=${encodeURIComponent(razorpayOrderId)}`);
                              const chkData = await chkRes.json();
                              if (chkData.success && chkData.paid) {
                                finalizePresetOrder(chkData.paymentId);
                                return;
                              }
                            } catch (e) {
                              console.warn("Dismiss check error:", e);
                            }

                            setIsProcessingPayment(false);
                            triggerToast("Payment cancelled. Order was not placed.");
                          }
                        }
                      };

                      const rzp = new window.Razorpay(options);
                      rzp.on("payment.failed", function (resp) {
                        setIsProcessingPayment(false);
                        triggerToast(resp.error?.description || "Payment failed. Please try again.");
                      });
                      rzp.open();
                    } catch (err) {
                      console.error("Order error:", err);
                      setIsProcessingPayment(false);
                      triggerToast("Error placing order. Please try again.");
                    }
                  }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        value={customerForm.name}
                        onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                        placeholder="e.g. Rhea Singhania"
                        required
                        className="w-full bg-stone-50 border border-stone-200 focus:border-[#B06B5B] rounded-xl px-3.5 py-2.5 text-xs font-sans focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">WhatsApp / Phone *</label>
                      <input
                        type="tel"
                        value={customerForm.phone}
                        onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                        placeholder="e.g. 9811223344"
                        required
                        className="w-full bg-stone-50 border border-stone-200 focus:border-[#B06B5B] rounded-xl px-3.5 py-2.5 text-xs font-sans focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-stone-700 block">Complete Delivery Address *</label>
                      <button
                        type="button"
                        onClick={handleFetchGpsAddress}
                        disabled={isDetectingGps}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold cursor-pointer disabled:opacity-50 transition"
                      >
                        <span>{isDetectingGps ? "Detecting GPS..." : "Auto-Detect GPS"}</span>
                        {isDetectingGps && <span className="animate-spin text-[9px]">⏳</span>}
                      </button>
                    </div>
                    <textarea
                      rows="2"
                      value={customerForm.address}
                      onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                      placeholder="House/Flat No., Street, Landmark, Area"
                      required
                      className="w-full bg-stone-50 border border-stone-200 focus:border-[#B06B5B] rounded-xl px-3.5 py-2 text-xs font-sans focus:outline-none"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">City</label>
                      <input
                        type="text"
                        value={customerForm.city}
                        onChange={(e) => setCustomerForm({ ...customerForm, city: e.target.value })}
                        placeholder="City"
                        className="w-full bg-stone-50 border border-stone-200 focus:border-[#B06B5B] rounded-xl px-3.5 py-2 text-xs font-sans focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">Pincode</label>
                      <input
                        type="text"
                        value={customerForm.pincode}
                        onChange={(e) => setCustomerForm({ ...customerForm, pincode: e.target.value })}
                        placeholder="Pincode"
                        className="w-full bg-stone-50 border border-stone-200 focus:border-[#B06B5B] rounded-xl px-3.5 py-2 text-xs font-sans focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Email (Optional)</label>
                    <input
                      type="email"
                      value={customerForm.email}
                      onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                      placeholder="For tracking receipt"
                      className="w-full bg-stone-50 border border-stone-200 focus:border-[#B06B5B] rounded-xl px-3.5 py-2 text-xs font-sans focus:outline-none"
                    />
                  </div>

                  {/* Online Payment Info Banner */}
                  <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E8DFC9] space-y-1 text-left">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                      <svg className="w-3.5 h-3.5 text-[#526B57]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      <span>100% Secured by Razorpay</span>
                    </div>
                    <p className="text-[11px] text-stone-600 font-serif leading-relaxed">
                      Pay securely with Google Pay, PhonePe, Paytm, Cards, or NetBanking. Order confirms instantly.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className="w-full py-3.5 rounded-2xl bg-[#B06B5B] hover:bg-[#975647] text-white text-xs font-bold uppercase tracking-wider transition shadow-md cursor-pointer mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessingPayment ? (
                      <span>Opening Payment Window...</span>
                    ) : (
                      <span>Pay ₹{subtotal} via UPI / Card & Confirm Order →</span>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-stone-500 pt-1">
                    <span className="text-emerald-700 font-bold">Instant Order Confirmation</span>
                    <span>•</span>
                    <span>Razorpay 256-Bit SSL Encrypted</span>
                  </div>
                </form>
              </div>
            )}

            {/* B. PROFILE MODE (When logged-in customer clicks their name) */}
            {authModalMode === "profile" && customerUser && (
              <div className="space-y-4">
                <div className="border-b border-[#FAF4ED] pb-3">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-emerald-700 block">
                    Active Customer Profile
                  </span>
                  <h3 className="text-2xl font-header font-bold text-[#2C2623] mt-0.5">
                    {customerUser.name}
                  </h3>
                  <p className="text-xs text-stone-500 font-serif">{customerUser.phone}</p>
                </div>

                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs space-y-2">
                  <div><strong>Saved Address:</strong> {customerUser.address || "Not specified"}</div>
                  <div><strong>City / Pincode:</strong> {customerUser.city} - {customerUser.pincode}</div>
                  {customerUser.email && <div><strong>Email:</strong> {customerUser.email}</div>}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      localStorage.removeItem("cocoon_customer_user");
                      setCustomerUser(null);
                      setIsAuthModalOpen(false);
                      triggerToast("Signed out of customer account.");
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                  >
                    Sign Out
                  </button>
                  <button
                    onClick={() => setIsAuthModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 13. PLACED ORDER CONFIRMATION MODAL */}
      {placedOrderSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C2623]/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 sm:p-8 text-center space-y-5 border border-[#EFE8DD]">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs"><svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg></div>
            <div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-emerald-700 block">
                Order Confirmed & Alert Dispatched
              </span>
              <h3 className="text-2xl font-header font-bold text-[#2C2623] mt-1">
                Thank You, {placedOrderSummary.customerName}!
              </h3>
              <p className="text-xs text-stone-500 font-serif mt-1">
                Your heirloom treasures are being prepped with organic milk cotton in our artisan studio.
              </p>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EAE0D2] text-left text-xs space-y-1.5 font-sans">
              <div className="flex justify-between font-bold">
                <span>Order Reference:</span>
                <span className="text-[#B06B5B]">{placedOrderSummary.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-bold text-[#2C2623]">Rs. {placedOrderSummary.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                  Processing
                </span>
              </div>
              {placedOrderSummary.utr && (
                <div className="flex justify-between items-center bg-stone-50 p-2 rounded-lg border border-stone-200">
                  <span className="font-bold">Payment ID:</span>
                  <span className="font-mono font-bold select-all text-stone-900">{placedOrderSummary.utr}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-[11px] text-stone-700 pt-1 border-t border-stone-200/60">
                <span className="font-semibold">Payment Status:</span>
                <span className="text-emerald-700 font-bold">Paid Online ✓</span>
              </div>
              <div className="pt-2 border-t border-[#E8DFC9] text-stone-600 text-[11px]">
                <strong>Delivery To:</strong> {placedOrderSummary.address}
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-800 text-[11px] font-medium border border-emerald-200 text-left">
              Direct order notification sent to phone: <strong>+91 8171902255</strong>. Mehak will review and reach out on your WhatsApp for dispatch tracking.
            </div>

            <button
              onClick={() => setPlacedOrderSummary(null)}
              className="w-full py-3.5 rounded-full bg-[#221F1F] hover:bg-[#B06B5B] text-white text-xs font-bold uppercase tracking-wider transition shadow-md cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}



    </div>
  );
}
