"use client";

import { useState, useEffect, useMemo, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { STORE } from "@/data/store";
import { PRODUCTS } from "@/data/products";
import { saveOrderToSupabase, uploadMediaToSupabase, saveReviewToSupabase, fetchReviewsFromSupabase } from "@/lib/supabase";
import { captureLiveGpsAddress } from "@/lib/location";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { generateOrderId, getCraftStats } from "@/lib/orderUtils";

export default function ProductDetailPage({ params }) {
  const unwrappedParams = use(params);
  const productId = Number(unwrappedParams.id);
  const router = useRouter();

  // Instant synchronous initialization from static catalog
  const initialProduct = useMemo(() => {
    return PRODUCTS.find((p) => Number(p.id) === productId) || null;
  }, [productId]);

  // Find product from store or fallback
  const [storeProducts, setStoreProducts] = useState(PRODUCTS);
  const [product, setProduct] = useState(initialProduct);

  // UI States
  const [selectedColor, setSelectedColor] = useState(
    () => (initialProduct?.colors ? initialProduct.colors[0] : "Standard")
  );
  const [selectedImage, setSelectedImage] = useState(() => (initialProduct?.imgUrl || ""));
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState("desc"); // "desc", "craft", "policy"
  const [toastMessage, setToastMessage] = useState(null);

  // Delivery Pincode Checker
  const [pincode, setPincode] = useState("282001");
  const [pincodeResult, setPincodeResult] = useState(null);

  // Reviews States (initialized synchronously with local store + initial seed)
  const [reviews, setReviews] = useState(() => STORE.getReviews(productId));
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: "",
    comment: "",
    name: "",
    phone: "",
    mediaFile: null,
    mediaPreview: null
  });
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const reviewsWithMedia = useMemo(() => {
    return reviews.filter((r) => Boolean(r.mediaUrl));
  }, [reviews]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight" && reviewsWithMedia.length > 1) {
        setLightboxIndex((prev) => (prev + 1) % reviewsWithMedia.length);
      }
      if (e.key === "ArrowLeft" && reviewsWithMedia.length > 1) {
        setLightboxIndex((prev) => (prev - 1 + reviewsWithMedia.length) % reviewsWithMedia.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, reviewsWithMedia.length]);

  // Cart & Customer States
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerUser, setCustomerUser] = useState(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
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
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsSuccessNote, setGpsSuccessNote] = useState(null);

  // Multi-Address Selection States
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [saveAddressForFuture, setSaveAddressForFuture] = useState(false);
  const [newAddressTag, setNewAddressTag] = useState("Home");

  // Payment Mode (Direct UPI vs COD)
  const [paymentMethod, setPaymentMethod] = useState("upi"); // "upi" or "cod"
  const [utrNumber, setUtrNumber] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleCopyUpi = () => {
    try {
      navigator.clipboard.writeText("8171902255@ibl");
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    } catch (e) {
      triggerToast("UPI ID: 8171902255@ibl");
    }
  };

  // Load product data & sync live from store & server
  useEffect(() => {
    const syncProductData = () => {
      const prods = STORE.getProducts();
      setStoreProducts(prods);

      const found = prods.find((p) => Number(p.id) === productId) || PRODUCTS.find((p) => Number(p.id) === productId);
      if (found) {
        setProduct(found);
        setSelectedImage((prev) => prev || found.imgUrl);
        setSelectedColor((prev) => prev || (found.colors ? found.colors[0] : "Standard"));
        STORE.addRecentlyViewed(found.id);
      }
    };

    syncProductData();

    // Fetch live product updates from server (captures admin price updates & edits)
    STORE.fetchServerStoreData().then((serverData) => {
      if (serverData && Array.isArray(serverData.products)) {
        setStoreProducts(serverData.products);
        const updated = serverData.products.find((p) => Number(p.id) === productId);
        if (updated) {
          setProduct(updated);
        }
      }
    });

    window.addEventListener("cocoon_store_update", syncProductData);

    // Load reviews for this product from store, then sync from Supabase DB
    const initialReviews = STORE.getReviews(productId);
    setReviews(initialReviews);

    const syncDbReviews = async () => {
      try {
        const dbReviews = await fetchReviewsFromSupabase(productId);
        if (dbReviews && dbReviews.length > 0) {
          setReviews((prev) => {
            const map = new Map();
            dbReviews.forEach((r) => map.set(r.id, r));
            prev.forEach((r) => {
              if (!map.has(r.id)) map.set(r.id, r);
            });
            return Array.from(map.values());
          });
        }
      } catch (err) {
        console.warn("DB reviews sync notice:", err);
      }
    };
    syncDbReviews();

    return () => {
      window.removeEventListener("cocoon_store_update", syncProductData);
    };
  }, [productId]);

  useEffect(() => {

    // Load addresses & customer profile
    try {
      const addrs = STORE.getAddresses();
      setSavedAddresses(addrs);

      const saved = localStorage.getItem("cocoon_customer_user");
      let parsed = null;
      if (saved) {
        parsed = JSON.parse(saved);
        setCustomerUser(parsed);
      }

      if (addrs && addrs.length > 0) {
        const defaultAddr = addrs.find((a) => a.isDefault) || addrs[0];
        setSelectedAddressId(defaultAddr.id);
        setCustomerForm({
          name: defaultAddr.name || parsed?.name || "",
          phone: defaultAddr.phone || (parsed?.phone && !parsed.phone.includes("@") ? parsed.phone : ""),
          email: defaultAddr.email || parsed?.email || "",
          address: defaultAddr.address || "",
          city: defaultAddr.city || "",
          pincode: defaultAddr.pincode || "",
          notes: ""
        });
        setReviewForm((prev) => ({
          ...prev,
          name: defaultAddr.name || parsed?.name || "",
          phone: defaultAddr.phone || parsed?.phone || ""
        }));
      } else if (parsed) {
        const cleanPhone = (parsed.phone && !parsed.phone.includes("@")) ? parsed.phone : "";
        const cleanEmail = parsed.email || (parsed.phone?.includes("@") ? parsed.phone : "");
        setCustomerForm((prev) => ({
          ...prev,
          name: parsed.name || "",
          phone: cleanPhone,
          email: cleanEmail,
          address: parsed.address || "",
          city: parsed.city || "",
          pincode: parsed.pincode || ""
        }));
        setReviewForm((prev) => ({ ...prev, name: parsed.name, phone: cleanPhone }));
      }
    } catch (e) {}

    // Load cart from session
    try {
      const savedCart = sessionStorage.getItem("cocoon_temp_cart");
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch (e) {}

    // Instant pincode & delivery estimate calculation (0ms lag)
    const autoInitPincode = () => {
      let pin = "282001";
      try {
        const saved = localStorage.getItem("cocoon_customer_user");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.pincode && String(parsed.pincode).length === 6) {
            pin = String(parsed.pincode);
          }
        }
      } catch (e) {}

      if (pin === "282001") {
        try {
          const savedPin = localStorage.getItem("cocoon_auto_pincode");
          if (savedPin && savedPin.length === 6) pin = savedPin;
        } catch (e) {}
      }

      setPincode(pin);
      setPincodeResult(calculateDeliveryEstimate(pin));
    };

    autoInitPincode();
  }, [productId]);

  // Helper to format expected date range using actual working days
  const getExpectedDateRange = (minWorkDays, maxWorkDays) => {
    const addWorkingDays = (days) => {
      let cur = new Date();
      let added = 0;
      while (added < days) {
        cur.setDate(cur.getDate() + 1);
        if (cur.getDay() !== 0) added++; // Skip Sundays
      }
      return cur;
    };

    const minDate = addWorkingDays(minWorkDays);
    const maxDate = addWorkingDays(maxWorkDays);

    const options = { month: "short", day: "numeric" };
    const minStr = minDate.toLocaleDateString("en-IN", options);
    const maxStr = maxDate.toLocaleDateString("en-IN", options);
    return `${minStr} – ${maxStr}`;
  };

  // Agra Origin Crafting (3–5 working days) + Delivery Transit Calculation Logic
  const calculateDeliveryEstimate = (pin) => {
    if (!pin) return null;
    const cleanPin = String(pin).trim();
    if (cleanPin.length < 6) return null;

    const isAgraOrUP = cleanPin.startsWith("282") || cleanPin.startsWith("20") || cleanPin.startsWith("22");
    const isDelhiNCR = cleanPin.startsWith("110") || cleanPin.startsWith("12") || cleanPin.startsWith("201");

    const craftingDays = 4; // 3 to 5 working days hand-knitting by Mehak
    let courierDaysMin = 3;
    let courierDaysMax = 5;
    let hub = "Dispatched via Express Courier";

    if (isAgraOrUP) {
      courierDaysMin = 1;
      courierDaysMax = 2;
      hub = "Regional Express Transit";
    } else if (isDelhiNCR) {
      courierDaysMin = 2;
      courierDaysMax = 3;
      hub = "Express Courier Corridor";
    }

    const totalMin = craftingDays + courierDaysMin;
    const totalMax = craftingDays + courierDaysMax;
    const dateRange = getExpectedDateRange(totalMin, totalMax);

    return {
      success: true,
      totalDays: `${totalMin}–${totalMax} working days`,
      craftingDays: "3–5 days",
      courierDays: `${courierDaysMin}–${courierDaysMax} days`,
      dateRange,
      hub,
      cod: true
    };
  };

  // Handle Pincode Check (Manual submit or auto)
  const handlePincodeCheck = (e) => {
    if (e) e.preventDefault();
    if (!pincode || pincode.trim().length < 6) {
      triggerToast("Please enter a valid 6-digit Indian pincode");
      return;
    }
    const res = calculateDeliveryEstimate(pincode);
    setPincodeResult(res);
  };

  const handlePincodeChange = (val) => {
    const clean = val.replace(/\D/g, "").slice(0, 6);
    setPincode(clean);
    if (clean.length === 6) {
      const res = calculateDeliveryEstimate(clean);
      setPincodeResult(res);
      try { localStorage.setItem("cocoon_auto_pincode", clean); } catch (e) {}
    }
  };

  // Live GPS Address Detection for Checkout Modal
  const handleFetchGpsAddress = async () => {
    setIsDetectingGps(true);
    setGpsSuccessNote(null);
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
        if (loc.pincode) {
          setPincode(loc.pincode);
          setPincodeResult(calculateDeliveryEstimate(loc.pincode));
        }
        setGpsSuccessNote(`Live GPS: ${loc.city}, ${loc.state} ${loc.pincode ? `(${loc.pincode})` : ""} • ±${loc.accuracy}m`);
        triggerToast("Live address auto-filled via GPS!");
      }
    } catch (err) {
      console.error(err);
      triggerToast(err.message || "Failed to fetch GPS location.");
    } finally {
      setIsDetectingGps(false);
    }
  };

  // Cart operations
  const addToCart = (prod, color = selectedColor, qty = quantity) => {
    if (!prod) return;
    const itemColor = color || (prod.colors ? prod.colors[0] : "Standard");
    const existing = [...cart];
    const idx = existing.findIndex((i) => i.id === prod.id && i.color === itemColor);
    let updated;
    if (idx > -1) {
      existing[idx] = { ...existing[idx], quantity: existing[idx].quantity + qty };
      updated = existing;
    } else {
      updated = [...existing, { ...prod, color: itemColor, quantity: qty }];
    }
    persistCart(updated);
    triggerToast(`Added ${qty}x ${prod.name} to your basket!`);
    try {
      window.dispatchEvent(
        new CustomEvent("cocoon_item_added_to_cart", {
          detail: {
            name: prod.name,
            price: prod.price,
            image: prod.images?.[0] || prod.image || "",
            quantity: qty
          }
        })
      );
    } catch (e) {}
  };

  const persistCart = (updatedCart) => {
    setCart(updatedCart);
    try {
      sessionStorage.setItem("cocoon_temp_cart", JSON.stringify(updatedCart));
      localStorage.setItem("cocoon_temp_cart", JSON.stringify(updatedCart));
      setTimeout(() => {
        window.dispatchEvent(new Event("cocoon_store_update"));
      }, 0);
    } catch (e) {}
  };

  const updateCartQty = (id, color, delta) => {
    const updated = cart
      .map((item) => {
        if (item.id === id && item.color === color) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);
    persistCart(updated);
  };

  const removeFromCart = (id, color) => {
    const updated = cart.filter((i) => !(i.id === id && i.color === color));
    persistCart(updated);
    triggerToast("Item removed from your basket");
  };

  const buyNow = () => {
    addToCart(product, selectedColor, quantity);
    router.push("/cart");
  };

  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cocoon_wishlist");
      if (saved) {
        const parsed = JSON.parse(saved);
        const hasIt = parsed.some((item) =>
          typeof item === "object" ? item.id === productId : Number(item) === productId
        );
        setIsWishlisted(hasIt);
      }
    } catch (e) {}
  }, [productId]);

  const handleToggleWishlist = () => {
    try {
      const saved = localStorage.getItem("cocoon_wishlist");
      let current = saved ? JSON.parse(saved) : [];
      const hasIt = current.some((item) =>
        typeof item === "object" ? item.id === productId : Number(item) === productId
      );
      let updated;
      if (hasIt) {
        updated = current.filter((item) =>
          typeof item === "object" ? item.id !== productId : Number(item) !== productId
        );
        setIsWishlisted(false);
        triggerToast("Removed from your wishlist.");
      } else {
        updated = [...current, productId];
        setIsWishlisted(true);
        triggerToast("Saved to your Wishlist!");
      }
      localStorage.setItem("cocoon_wishlist", JSON.stringify(updated));
      setTimeout(() => {
        window.dispatchEvent(new Event("cocoon_store_update"));
      }, 0);
    } catch (e) {}
  };

  const [isUtrSubmitting, setIsUtrSubmitting] = useState(false);

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

  const finalizeProductOrder = async (custData, totalAmount, paymentMethodChosen, paymentId = null) => {
    const orderItems = [{ ...product, color: selectedColor, quantity: quantity }];
    const isOnline = paymentMethodChosen.includes("Razorpay") || paymentMethodChosen === "UPI";
    try {
      const newOrder = {
        id: generateOrderId(),
        date: new Date().toISOString(),
        customerName: custData.name,
        customerPhone: custData.phone,
        customerEmail: custData.email || "",
        address: `${custData.address}, ${custData.city} - ${custData.pincode}`,
        items: orderItems.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, color: i.color, imgUrl: i.imgUrl })),
        totalAmount: totalAmount,
        status: "Processing",
        paymentMethod: isOnline ? "Online Payment (Razorpay)" : "COD",
        utr: paymentId || null,
        paymentStatus: isOnline 
          ? `Paid via Razorpay (ID: ${paymentId || "Online"})` 
          : "Pending (Pay on Delivery)",
        notes: (custData.notes ? custData.notes.trim() + " • " : "") + 
          (isOnline ? `Paid Online via Razorpay [Payment ID: ${paymentId || "Online"}]` : "Cash on Delivery"),
        timestamp: Date.now()
      };

      const existingOrders = STORE.getOrders();
      STORE.setOrders([newOrder, ...existingOrders]);
      await saveOrderToSupabase(newOrder);

      STORE.dispatchEmailNotification("order_placed", { order: newOrder });
      STORE.sendWhatsAppNotification("order", newOrder);

      setPlacedOrderSummary(newOrder);
      setIsCheckoutModalOpen(false);
      triggerToast(isOnline ? `Order placed & verified! Total: ₹${totalAmount}` : `Order confirmed! Cash on Delivery: ₹${totalAmount}`);
    } catch (saveErr) {
      console.error("Order save error:", saveErr);
      triggerToast("Error placing order. Please try again.");
    }
  };

  const processOrderPlacement = async (custData) => {
    const totalAmount = product.price * quantity;
    const isOnline = paymentMethod === "upi" || paymentMethod === "online";

    if (isOnline) {
      triggerToast("Opening secure Razorpay payment gateway...");

      const isLoaded = await new Promise((resolve) => {
        if (typeof window !== "undefined" && window.Razorpay) return resolve(true);
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });

      if (!isLoaded) {
        triggerToast("Failed to load payment gateway. Please check your internet connection.");
        return;
      }

      try {
        const res = await fetch("/api/payment/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: totalAmount,
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
            notes: {
              customerName: custData.name,
              customerPhone: custData.phone,
              customerEmail: custData.email,
              productId: product.id,
              productName: product.name
            }
          })
        });

        const orderData = await res.json();
        const razorpayOrderId = orderData.id || orderData.orderId;
        if (!res.ok || !razorpayOrderId) {
          throw new Error(orderData.error || "Failed to initiate payment");
        }

        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          name: "COCOON Handcrafted Studio",
          description: `Order for ${product.name}`,
          image: "https://www.gococoon.store/icon.svg",
          order_id: razorpayOrderId,
          prefill: {
            name: custData.name,
            email: custData.email || "",
            contact: custData.phone
          },
          theme: {
            color: "#B06B5B"
          },
          handler: async function (response) {
            try {
              triggerToast("Verifying payment...");
              const verifyRes = await fetch("/api/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                })
              });

              const verifyData = await verifyRes.json();
              if (!verifyRes.ok || (!verifyData.success && !verifyData.verified)) {
                triggerToast("Payment verification failed. Please contact support.");
                return;
              }

              await finalizeProductOrder(custData, totalAmount, "Online Payment (Razorpay)", response.razorpay_payment_id);
            } catch (err) {
              console.error("Verification error:", err);
              triggerToast("Payment verification error. Please contact studio.");
            }
          },
          modal: {
            ondismiss: function () {
              triggerToast("Payment cancelled. Order was not placed.");
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (resp) {
          triggerToast(resp.error?.description || "Payment failed. Please try again.");
        });
        rzp.open();
      } catch (err) {
        console.error("Payment initiation error:", err);
        triggerToast(err.message || "Failed to start payment.");
      }
      return;
    }

    await finalizeProductOrder(custData, totalAmount, "COD", null);
  };

  // Review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim() || !reviewForm.name.trim()) {
      triggerToast("Please provide your name and review feedback");
      return;
    }

    setIsUploadingMedia(true);
    let uploadedMediaUrl = null;
    if (reviewForm.mediaFile) {
      triggerToast("Uploading photo/video to storage... ⏳");
      uploadedMediaUrl = await uploadMediaToSupabase(reviewForm.mediaFile, "cocoon-media");
    }

    const newRev = {
      id: "REV-" + Math.floor(1000 + Math.random() * 9000),
      productId: product.id,
      productName: product.name,
      customerName: reviewForm.name.trim(),
      customerPhone: reviewForm.phone.trim() || null,
      rating: Number(reviewForm.rating),
      title: reviewForm.title.trim() || "Verified Heirloom Piece",
      comment: reviewForm.comment.trim(),
      mediaUrl: uploadedMediaUrl || reviewForm.mediaPreview,
      date: new Date().toISOString(),
      verified: true
    };

    STORE.addReview(newRev);
    await saveReviewToSupabase(newRev);

    setReviews((prev) => [newRev, ...prev]);
    setIsReviewModalOpen(false);
    setIsUploadingMedia(false);
    setReviewForm({ rating: 5, title: "", comment: "", name: customerUser?.name || "", phone: customerUser?.phone || "", mediaFile: null, mediaPreview: null });
    triggerToast("Thank you for your review! Your review has been published.");
  };

  // Calculation for review rating breakdown
  const reviewStats = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return { avg: "0.0", count: 0, breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    }
    const count = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
    const avg = (sum / count).toFixed(1);

    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5)));
      counts[star] = (counts[star] || 0) + 1;
    });

    const breakdown = {
      5: Math.round((counts[5] / count) * 100),
      4: Math.round((counts[4] / count) * 100),
      3: Math.round((counts[3] / count) * 100),
      2: Math.round((counts[2] / count) * 100),
      1: Math.round((counts[1] / count) * 100)
    };

    return { avg, count, breakdown };
  }, [reviews]);

  // Related products
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return storeProducts
      .filter((p) => p.id !== product.id && (p.category === product.category || p.badge === "Bestseller"))
      .slice(0, 4);
  }, [product, storeProducts]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-3 border-stone-300 border-t-[#B06B5B] rounded-full animate-spin"></div>
        <p className="font-header text-lg text-stone-700">Loading Product...</p>
        <Link href="/" className="text-xs text-[#B06B5B] underline">&larr; Back to Cocoon Storefront</Link>
      </div>
    );
  }

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const craftStats = useMemo(() => getCraftStats(product), [product]);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.imgUrl?.startsWith("http")
      ? product.imgUrl
      : `https://www.gococoon.store${product.imgUrl}`,
    description: product.desc || `${product.name} handcrafted with 100% pure organic milk cotton by Mehak Agarwal at GoCocoon.`,
    sku: `GC-${product.id}`,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: "GoCocoon"
    },
    material: "100% Organic Milk Cotton",
    offers: {
      "@type": "Offer",
      url: `https://www.gococoon.store/product/${product.id}`,
      priceCurrency: "INR",
      price: product.price,
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "GoCocoon"
      }
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: reviewStats.count > 0 ? reviewStats.avg : "4.9",
      reviewCount: reviewStats.count > 0 ? String(reviewStats.count) : "14"
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2623] font-sans antialiased selection:bg-[#F3D5CF] selection:text-[#5B2920]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      
      {/* 1 & 2. UNIFIED MASTER ATELIER HEADER & TICKER */}
      <Header cartCountOverride={cart.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0)} />

      {/* 3. BREADCRUMBS & TOP BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between text-xs text-stone-500 font-serif border-b border-[#EFE8DD]">
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-stone-900 hover:underline">Home</Link>
          <span>/</span>
          <Link href={`/#${product.category}`} className="capitalize hover:text-stone-900 hover:underline">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[#2C2623] font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: product.name, url: window.location.href });
            } else {
              navigator.clipboard.writeText(window.location.href);
              triggerToast("Product link copied to clipboard!");
            }
          }}
          className="flex items-center gap-1 text-stone-600 hover:text-stone-900 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
          title="Share Product"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>

      {/* 4. MAIN PRODUCT DETAIL SHOWCASE (MATCHING USER SCREENSHOTS) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* ================= LEFT COLUMN: IMAGES & GALLERY ================= */}
          <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-36">
            
            {/* Main Featured Photo Box */}
            <div className="relative rounded-3xl overflow-hidden bg-[#FAF7F2] border border-[#E8DFC9] shadow-xl aspect-square flex items-center justify-center group">
              <img
                src={selectedImage || product.imgUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#B06B5B] text-white text-[11px] font-sans font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                  {product.badge}
                </span>
              )}

              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-stone-200 text-[10px] font-bold text-stone-800 shadow-xs flex items-center gap-1.5">
                <span>100% Handcrafted</span>
                <span className="text-rose-400">•</span>
                <span>{product.materials?.includes("Milk Cotton") ? "Pure Milk Cotton" : (product.materials || "Handcrafted Cotton Cord")}</span>
              </div>
            </div>

            {/* Thumbnail Gallery Strip */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {[product.imgUrl, product.hoverImgUrl || product.imgUrl].filter(Boolean).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                    selectedImage === img ? "border-[#B06B5B] shadow-md scale-95" : "border-stone-200 opacity-80 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

          </div>

          {/* ================= RIGHT COLUMN: PRODUCT DETAILS & BUYING ================= */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Title & Reviews summary */}
            <div className="space-y-2 border-b border-[#EFE8DD] pb-4">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#B06B5B]">
                  {product.subcategory || product.category}
                </span>
                <span className="text-stone-300">•</span>
                {Number(reviewStats.count) > 0 ? (
                  <a href="#reviews" className="text-xs font-semibold text-amber-700 hover:underline flex items-center gap-1">
                    <span>★</span>
                    <span>{reviewStats.avg}</span>
                    <span className="text-stone-400">({reviewStats.count} reviews)</span>
                  </a>
                ) : (
                  <a href="#reviews" className="text-xs font-semibold text-[#B06B5B] hover:underline">
                    New Atelier Drop • Be first to review
                  </a>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-header font-bold text-[#2C2623] leading-tight">
                {product.name}
              </h1>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-3xl font-header font-bold text-[#2C2623]">
                  ₹{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-stone-400 line-through font-serif">
                    ₹{product.originalPrice}
                  </span>
                )}
                {discountPercent && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 font-serif">
                Incl. of all taxes • Handcrafted upon order
              </p>

              {/* Special Studio 10% Off Offer Box (Max ₹50 on 1 item, ₹80 on bulk orders) */}
              <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-[#FAF5EE] via-[#FDF3F0] to-[#FAF5EE] border border-[#F3D5CF] flex items-center justify-between gap-3 text-left">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-[#B06B5B] text-white tracking-wider">
                      COCOON10
                    </span>
                    <span className="text-xs font-bold text-[#2C2623]">
                      10% OFF with Code at Checkout
                    </span>
                  </div>
                  <p className="text-[11px] font-serif text-[#7A3F34] leading-relaxed">
                    Effective Price: <strong className="font-sans font-bold text-emerald-800 text-xs">₹{Math.max(0, product.price - Math.min(Math.round(product.price * 0.1), 50))}</strong> • Save up to ₹50 on this item (Save up to ₹80 on 2+ items)
                  </p>
                </div>
                <Link
                  href="/cart"
                  className="shrink-0 px-3 py-1.5 rounded-xl bg-white text-[#B06B5B] hover:bg-[#B06B5B] hover:text-white border border-[#F3D5CF] text-[10px] font-bold uppercase tracking-wider transition shadow-2xs"
                >
                  Apply &rarr;
                </Link>
              </div>

              {/* Artisan Labor Meter (Price Justification) */}
              <div className="mt-2.5 p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE1D3] flex items-center justify-between text-left">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">⏱️</span>
                  <div>
                    <p className="text-xs font-bold text-[#2C2623] flex items-center gap-1.5 flex-wrap">
                      <span>{craftStats.hours} of Artisan Hand-Knitting</span>
                      <span className="text-[9px] text-[#B06B5B] bg-[#FDF0ED] px-2 py-0.5 rounded-full border border-[#F5D5CE] font-bold">
                        {craftStats.tag}
                      </span>
                    </p>
                    <p className="text-[11px] text-stone-500 font-serif mt-0.5">
                      {craftStats.knots} • 100% Organic Milk Cotton • Zero Machine Work
                    </p>
                  </div>
                </div>
              </div>

              {/* Complimentary Gifting Unboxing Guarantee */}
              <div className="mt-2.5 p-3 rounded-2xl bg-gradient-to-r from-[#FFFDF9] to-[#FAF5EE] border border-[#EAE0D2] flex items-center gap-3 text-left">
                <span className="text-xl">🎁</span>
                <div>
                  <p className="text-xs font-bold text-[#2C2623]">
                    Ready to Gift • Complimentary Aesthetic Box
                  </p>
                  <p className="text-[11px] text-stone-500 font-serif mt-0.5">
                    Arrives wrapped in butter paper inside our signature reusable vintage gift box with a handwritten wax-sealed card.
                  </p>
                </div>
              </div>
            </div>

            {/* Color Palette Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#2C2623] block">
                  Colorway: <span className="text-[#B06B5B] font-semibold">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                        selectedColor === color
                          ? "bg-[#221F1F] text-white border-[#221F1F] shadow-xs"
                          : "bg-white text-stone-700 border-stone-300 hover:border-stone-500"
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-[#B06B5B]"></span>
                      <span>{color}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-1">
              <span className="text-xs font-bold text-[#2C2623]">Quantity:</span>
              <div className="inline-flex items-center border border-stone-300 rounded-xl bg-white shadow-2xs">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-sm font-bold text-stone-600 hover:bg-stone-100 rounded-l-xl transition cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold text-[#2C2623]">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1.5 text-sm font-bold text-stone-600 hover:bg-stone-100 rounded-r-xl transition cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* ACTION BUTTONS: ADD TO CART, BUY NOW & SAVE TO WISHLIST */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => addToCart(product, selectedColor, quantity)}
                  className="w-full py-4 rounded-2xl bg-white hover:bg-[#FAF4ED] text-[#2C2623] border-2 border-[#2C2623] text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Add To Cart</span>
                </button>

                <button
                  onClick={buyNow}
                  className="w-full py-4 rounded-2xl bg-[#B06B5B] hover:bg-[#975647] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Wishlist Button */}
              <button
                onClick={handleToggleWishlist}
                className={`w-full py-3.5 rounded-2xl border text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 ${
                  isWishlisted
                    ? "bg-rose-50 text-rose-700 border-rose-300 shadow-2xs"
                    : "bg-white hover:bg-rose-50/40 text-stone-700 border-stone-200"
                }`}
              >
                <span className={isWishlisted ? "text-rose-500 text-sm font-bold" : "text-stone-400 text-sm"}>
                  {isWishlisted ? "♥" : "♡"}
                </span>
                <span>{isWishlisted ? "Saved in Your Wishlist ♥ (Click to Remove)" : "Save to Wishlist  ♥"}</span>
              </button>
            </div>

            {/* TRUST BADGES ROW (Matching Screenshot) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#EFE8DD] text-center text-[10px] text-stone-600 font-serif">
              <div className="p-2.5 rounded-xl bg-white border border-[#EAE0D2] space-y-1">
                
                <span className="font-bold block text-stone-800">Secure Payments</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-[#EAE0D2] space-y-1">
                
                <span className="font-bold block text-stone-800">Assured Quality</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-[#EAE0D2] space-y-1">
                <span className="font-bold block text-stone-800">100% Handcrafted</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-[#EAE0D2] space-y-1">
                
                <span className="font-bold block text-stone-800">Timely Delivery</span>
              </div>
            </div>

            {/* ================= DELIVERY PINCODE ESTIMATOR ================= */}
            <div className="p-5 rounded-2xl bg-[#FAF6F0] border border-[#E5DAC8] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2C2623] flex items-center gap-1.5">
                  <span>Delivery Checker</span>
                </span>
                <span className="text-[10px] text-[#B06B5B] font-bold">Express Courier Dispatch</span>
              </div>

              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                  placeholder="Enter 6-digit Pincode (e.g. 110001 or 400001)"
                  className="flex-1 bg-white border border-stone-300 rounded-xl px-4 py-2.5 text-xs font-bold tracking-wider text-[#2C2623] focus:outline-none focus:border-[#B06B5B]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#221F1F] hover:bg-[#B06B5B] text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  Check
                </button>
              </form>

              {pincodeResult ? (
                <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-xs space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between text-emerald-950 font-bold">
                    <div className="flex items-center gap-2">
                      
                      <div>
                        <span className="text-[10px] text-stone-500 font-sans block uppercase tracking-wider">
                          Estimated Delivery
                        </span>
                        <span className="text-sm font-black text-[#B06B5B]">
                          Delivered in {pincodeResult.totalDays} (by {pincodeResult.dateRange})
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-2.5 py-0.5 rounded-full font-bold">
                      Express Courier Dispatch ✓
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-emerald-900 font-semibold pt-1 border-t border-emerald-200/60">
                    <span>✓ Free Delivery Above ₹999</span>
                    <span>•</span>
                    <span>✓ Secure Online Checkout (UPI & Cards) & Verified COD</span>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-stone-500 font-serif">
                  All heirloom pieces are made to order with curated artisan fibers. Enter pincode to view estimated delivery date.
                </p>
              )}
            </div>

            {/* ================= ACCORDIONS: DETAILS, CRAFT STORY, RETURN POLICY ================= */}
            <div className="border-t border-[#EFE8DD] divide-y divide-[#EFE8DD] text-xs">
              
              {/* Accordion 1: Description */}
              <div>
                <button
                  onClick={() => setActiveAccordion(activeAccordion === "desc" ? "" : "desc")}
                  className="w-full py-4 flex items-center justify-between font-bold text-[#2C2623] cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    
                    <span>Product Description & Materials</span>
                  </span>
                  <span>{activeAccordion === "desc" ? "▲" : "▼"}</span>
                </button>
                {activeAccordion === "desc" && (
                  <div className="pb-4 text-stone-600 font-serif leading-relaxed space-y-2">
                    <p>{product.desc}</p>
                    <div className="p-3 bg-white rounded-xl border border-[#EFE8DD] text-[11px] space-y-1">
                      <div><strong>Material:</strong> {product.materials || "Handcrafted Cotton Cord"}</div>
                      <div><strong>Size / Dimensions:</strong> {product.sizes ? product.sizes[0] : "Artisan Handcrafted Silhouette"}</div>
                      <div><strong>Technique:</strong> Zero machine shortcuts. Hand-knitted knot-by-knot.</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: Maker's Story */}
              <div>
                <button
                  onClick={() => setActiveAccordion(activeAccordion === "craft" ? "" : "craft")}
                  className="w-full py-4 flex items-center justify-between font-bold text-[#2C2623] cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    
                    <span>Artisan Craftsmanship & Made-to-Order Story</span>
                  </span>
                  <span>{activeAccordion === "craft" ? "▲" : "▼"}</span>
                </button>
                {activeAccordion === "craft" && (
                  <div className="pb-4 text-stone-600 font-serif leading-relaxed space-y-2">
                    <p>
                      Every piece from Cocoon is lovingly hand-crafted by Mehak using artisan fibers and high-grade cords specified for each design. Unlike mass-market knitwear, our slow-crafted pieces retain their shape, softness, and unique human warmth for years.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 3: Return & Care Policy */}
              <div>
                <button
                  onClick={() => setActiveAccordion(activeAccordion === "policy" ? "" : "policy")}
                  className="w-full py-4 flex items-center justify-between font-bold text-[#2C2623] cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    
                    <span>Care Guidelines & Exchange Policy</span>
                  </span>
                  <span>{activeAccordion === "policy" ? "▲" : "▼"}</span>
                </button>
                {activeAccordion === "policy" && (
                  <div className="pb-4 text-stone-600 font-serif leading-relaxed space-y-2">
                    <p>
                      <strong>Care:</strong> Spot clean with cold water and mild detergent. Lay flat on a towel in the shade to dry. Do not wring or machine-wash.
                    </p>
                    <p>
                      <strong>Exchange:</strong> Since each treasure is handcrafted individually, orders are eligible for free replacement if damaged in transit.
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* ================= 5. CUSTOMER REVIEWS SECTION (SCREENSHOT 4 STYLE) ================= */}
        <section id="reviews" className="mt-16 pt-12 border-t border-[#EFE8DD] text-left">
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-header font-bold text-[#2C2623]">Customer Reviews</h2>
                <p className="text-xs text-stone-500 font-serif mt-1">
                  Genuine verified heirloom impressions from Cocoon collectors across India.
                </p>
              </div>

              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="px-6 py-3 rounded-full bg-[#B06B5B] hover:bg-[#975647] text-white text-xs font-bold uppercase tracking-wider transition shadow-md cursor-pointer self-start sm:self-auto"
              >
                Write A Review
              </button>
            </div>

            {/* Rating Breakdown Card */}
            {Number(reviewStats.count) > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                <div className="md:col-span-4 text-center md:border-r border-[#EFE8DD] md:pr-6 space-y-2">
                  <span className="text-5xl font-header font-bold text-[#2C2623] block">{reviewStats.avg}</span>
                  <div className="text-amber-500 text-lg">★★★★★</div>
                  <p className="text-xs text-stone-500 font-serif">Based on {reviewStats.count} verified reviews</p>
                </div>

                <div className="md:col-span-8 space-y-2 text-xs">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <div key={stars} className="flex items-center gap-3">
                      <span className="w-12 text-stone-600 font-semibold">{stars} star</span>
                      <div className="flex-1 h-3 rounded-full bg-stone-100 overflow-hidden border border-stone-200">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${reviewStats.breakdown[stars]}%` }}
                        ></div>
                      </div>
                      <span className="w-10 text-right text-stone-400 font-mono text-[11px]">
                        {reviewStats.breakdown[stars]}%
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border border-[#E8DFC9] text-xs text-stone-500 space-y-2">
                  <p className="font-header font-bold text-base text-stone-800">Be the first to review this treasure!</p>
                  <p className="font-serif">Share your thoughts, photo or video with fellow crochet lovers.</p>
                  <button
                    onClick={() => setIsReviewModalOpen(true)}
                    className="mt-2 text-[#B06B5B] font-bold underline cursor-pointer"
                  >
                    Write a Review now &rarr;
                  </button>
                </div>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="bg-white rounded-2xl p-6 border border-[#E8DFC9] shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-[#FAF0ED] text-[#B06B5B] font-bold text-xs flex items-center justify-center">
                          {rev.customerName.charAt(0)}
                        </span>
                        <div>
                          <span className="font-bold text-xs text-stone-900 block">{rev.customerName}</span>
                          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                            ✓ Verified Buyer
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] text-stone-400 font-serif">
                        {new Date(rev.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>

                    <div className="text-amber-500 text-sm">
                      {"★".repeat(rev.rating)}
                      {"☆".repeat(5 - rev.rating)}
                    </div>

                    {rev.title && <h4 className="font-header font-bold text-sm text-[#2C2623]">{rev.title}</h4>}
                    <p className="text-xs text-stone-600 font-serif leading-relaxed">{rev.comment}</p>

                    {rev.mediaUrl && (
                      <div
                        onClick={() => {
                          const idx = reviewsWithMedia.findIndex((m) => m.id === rev.id);
                          if (idx !== -1) setLightboxIndex(idx);
                        }}
                        className="mt-3 w-32 h-32 rounded-2xl overflow-hidden border-2 border-[#E8DFC9] bg-stone-50 cursor-pointer group/photo relative shadow-xs hover:border-[#B06B5B] hover:shadow-md transition-all duration-300"
                        title="Click to view full photo and review gallery"
                      >
                        {rev.mediaUrl.endsWith(".mp4") || rev.mediaUrl.includes("video") ? (
                          <video src={rev.mediaUrl} className="w-full h-full object-cover group-hover/photo:scale-105 transition duration-300" />
                        ) : (
                          <img
                            src={rev.mediaUrl}
                            alt="Customer review attachment"
                            className="w-full h-full object-cover group-hover/photo:scale-105 transition duration-300"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white text-[11px] font-bold">
                          
                          <span>Open Photo</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

          </div>
        </section>

        {/* ================= 6. YOU MAY ALSO LIKE (SCREENSHOT 5 STYLE) ================= */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-[#EFE8DD] text-center">
            <h2 className="text-3xl font-header font-bold text-[#2C2623] tracking-wide mb-8">
              You May Also Like
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/product/${rel.id}`}
                  prefetch={true}
                  className="group bg-white rounded-3xl p-4 border border-[#E8DFC9] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-stone-100 relative">
                      <img
                        src={rel.imgUrl}
                        alt={rel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {rel.badge && (
                        <span className="absolute top-2 left-2 bg-[#B06B5B] text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                          {rel.badge}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-[#B06B5B] tracking-wider block">
                        {rel.category}
                      </span>
                      <h4 className="font-header font-bold text-sm text-[#2C2623] line-clamp-1 group-hover:text-[#B06B5B] transition-colors">
                        {rel.name}
                      </h4>
                      <p className="text-xs font-bold text-[#2C2623]">₹{rel.price}</p>
                    </div>
                  </div>

                  <span className="mt-3 w-full py-2.5 rounded-xl bg-stone-100 group-hover:bg-[#221F1F] group-hover:text-white text-stone-800 text-[11px] font-bold uppercase tracking-wider text-center transition block">
                    View Treasure &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* ================= 7. WRITE A REVIEW MODAL ================= */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 text-left space-y-4 shadow-2xl border border-[#EAE0D2] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 text-lg cursor-pointer"
            >
              ✕
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B06B5B] block">
                Customer Reviews
              </span>
              <h3 className="text-2xl font-header font-bold text-[#2C2623]">
                Review "{product.name}"
              </h3>
              <p className="text-xs text-stone-500 font-serif">
                Share your handcrafted heirloom experience with Mehak and other buyers.
              </p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              
              {/* Star Rating Selector */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Your Rating *</label>
                <div className="flex items-center gap-1.5 text-2xl text-amber-400 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="hover:scale-125 transition-transform"
                    >
                      {star <= reviewForm.rating ? "★" : "☆"}
                    </button>
                  ))}
                  <span className="text-xs text-stone-500 font-sans ml-2 font-bold">
                    {reviewForm.rating} / 5 Stars
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Your Name *</label>
                  <input
                    type="text"
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                    placeholder="e.g. Rhea Singhania"
                    required
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#B06B5B]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">WhatsApp / Phone</label>
                  <input
                    type="tel"
                    value={reviewForm.phone}
                    onChange={(e) => setReviewForm({ ...reviewForm, phone: e.target.value })}
                    placeholder="For verified buyer badge"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#B06B5B]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Review Headline</label>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                  placeholder="e.g. Beautiful stitch tension & quick delivery!"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#B06B5B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Your Detailed Experience *</label>
                <textarea
                  rows={3}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="How does the milk cotton yarn feel? Does it hold its shape? How was the packaging?"
                  required
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#B06B5B]"
                ></textarea>
              </div>

              {/* Photo Upload for Review */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <label className="text-xs font-bold text-stone-700 block">
                  Attach Photo / Video Reference (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setReviewForm({
                        ...reviewForm,
                        mediaFile: file,
                        mediaPreview: URL.createObjectURL(file)
                      });
                    }
                  }}
                  className="text-xs text-stone-500"
                />
                {reviewForm.mediaPreview && (
                  <div className="w-24 h-24 rounded-xl overflow-hidden border border-stone-300 mt-2 bg-black/5">
                    {reviewForm.mediaFile?.type?.startsWith("video/") ? (
                      <video src={reviewForm.mediaPreview} className="w-full h-full object-cover" controls />
                    ) : (
                      <img src={reviewForm.mediaPreview} alt="Preview" className="w-full h-full object-cover" />
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isUploadingMedia}
                className="w-full py-3.5 rounded-2xl bg-[#B06B5B] hover:bg-[#975647] text-white text-xs font-bold uppercase tracking-wider transition shadow-md cursor-pointer disabled:opacity-60"
              >
                {isUploadingMedia ? "Publishing Review..." : "Submit Verified Review"}
              </button>
            </form>
          </div>
        </div>
      )}



      {/* ================= 8. CHECKOUT LOGIN MODAL ================= */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-left space-y-4 shadow-2xl border border-[#EAE0D2] relative">
            <button onClick={() => setIsCheckoutModalOpen(false)} className="absolute top-4 right-4 text-stone-400">✕</button>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B06B5B] block">Express Checkout</span>
              <h3 className="text-2xl font-header font-bold text-[#2C2623]">Confirm Delivery Details</h3>
              <p className="text-xs text-stone-500 font-serif">Enter your address to complete your order.</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!customerForm.name || !customerForm.phone || !customerForm.address) {
                  triggerToast("Please provide your name, phone, and address");
                  return;
                }
                const user = {
                  name: customerForm.name.trim(),
                  phone: customerForm.phone.trim(),
                  email: customerForm.email.trim(),
                  address: customerForm.address.trim(),
                  city: customerForm.city.trim() || "India",
                  pincode: customerForm.pincode.trim() || ""
                };
                setCustomerUser(user);
                try {
                  localStorage.setItem("cocoon_customer_user", JSON.stringify(user));
                } catch (err) {}
                processOrderPlacement(user);
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  value={customerForm.name}
                  onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                  placeholder="Your Name"
                  required
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#B06B5B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">WhatsApp / Phone *</label>
                <input
                  type="tel"
                  value={customerForm.phone}
                  onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                  placeholder="To receive live dispatch tracking"
                  required
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#B06B5B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Email Address (For order confirmation & updates)</label>
                <input
                  type="email"
                  value={customerForm.email}
                  onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                  placeholder="e.g. yourname@gmail.com"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#B06B5B]"
                />
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
                {gpsSuccessNote && (
                  <div className="mb-2 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-800 font-medium">
                    ✓ {gpsSuccessNote}
                  </div>
                )}
                <textarea
                  rows={2}
                  value={customerForm.address}
                  onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                  placeholder="House/Flat No., Street, Landmark, Area"
                  required
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#B06B5B]"
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
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Pincode</label>
                  <input
                    type="text"
                    value={customerForm.pincode}
                    onChange={(e) => setCustomerForm({ ...customerForm, pincode: e.target.value })}
                    placeholder="Pincode"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs"
                  />
                </div>
              </div>

              {/* Payment Mode Selector (Direct UPI vs COD) */}
              <div className="space-y-2 pt-1 text-left">
                <label className="text-xs font-bold text-stone-700 block">Select Payment Mode *</label>
                <div className="grid grid-cols-2 gap-2">
                  <div
                    onClick={() => setPaymentMethod("upi")}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      paymentMethod === "upi"
                        ? "border-[#B06B5B] bg-[#FAF5F2] ring-2 ring-[#B06B5B]/20"
                        : "border-stone-200 bg-stone-50 hover:bg-white"
                    }`}
                  >
                    <span className="text-xs font-bold text-stone-900 flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full border-2 border-[#B06B5B] flex items-center justify-center">
                        {paymentMethod === "upi" && <span className="w-1.5 h-1.5 rounded-full bg-[#B06B5B]" />}
                      </span>
                      UPI & Cards
                    </span>
                    <span className="text-[9px] text-stone-500 font-sans mt-0.5">Razorpay Instant</span>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      paymentMethod === "cod"
                        ? "border-[#B06B5B] bg-[#FAF5F2] ring-2 ring-[#B06B5B]/20"
                        : "border-stone-200 bg-stone-50 hover:bg-white"
                    }`}
                  >
                    <span className="text-xs font-bold text-stone-900 flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full border-2 border-[#B06B5B] flex items-center justify-center">
                        {paymentMethod === "cod" && <span className="w-1.5 h-1.5 rounded-full bg-[#B06B5B]" />}
                      </span>
                      Cash on Delivery
                    </span>
                    <span className="text-[9px] text-stone-500 font-sans mt-0.5">Pay upon arrival</span>
                  </div>
                </div>
              </div>

              {/* Online Payment Info Banner */}
              {paymentMethod === "upi" && (
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFC9] space-y-1.5 text-left animate-fadeIn">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                    <span>🔒</span>
                    <span>Secured by Razorpay</span>
                  </div>
                  <p className="text-[11px] text-stone-600 font-serif leading-relaxed">
                    Pay securely using Google Pay, PhonePe, Paytm, Cards, or NetBanking. Order confirms instantly.
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#B06B5B] hover:bg-[#964B44] text-white text-xs font-bold uppercase tracking-wider transition shadow-md cursor-pointer mt-1 flex items-center justify-center gap-1.5"
              >
                <span>
                  {paymentMethod === "upi"
                    ? `🔒 Pay ₹${product.price * quantity} via UPI / Card →`
                    : `Confirm Cash on Delivery (₹${product.price * quantity}) →`}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= 9. PLACED ORDER POPUP ================= */}
      {placedOrderSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center space-y-4 shadow-2xl border border-[#EFE8DD]">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg></div>
            <h3 className="text-2xl font-header font-bold text-[#2C2623]">Thank You, {placedOrderSummary.customerName}!</h3>
            <p className="text-xs text-stone-500 font-serif">
              Your order <strong>{placedOrderSummary.id}</strong> is prepped for slow-crafting in our artisan studio.
            </p>
            <div className="p-3 bg-[#FAF7F2] rounded-xl text-left text-xs space-y-1.5">
              <div className="flex justify-between items-center font-bold">
                <span>Payment Mode:</span>
                <span className="text-emerald-700 font-semibold">
                  {placedOrderSummary.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment (Razorpay)"}
                </span>
              </div>
              {placedOrderSummary.utr && (
                <div className="flex justify-between items-center text-[11px] text-stone-600 bg-stone-50 p-2 rounded-lg border border-stone-200">
                  <strong>Payment Ref ID:</strong>
                  <span className="font-mono font-bold select-all text-stone-900">{placedOrderSummary.utr}</span>
                </div>
              )}
              {placedOrderSummary.paymentMethod !== "COD" && (
                <div className="flex justify-between items-center text-[11px] text-stone-700 pt-1 border-t border-stone-200/60">
                  <span className="font-semibold">Payment Status:</span>
                  <span className="text-emerald-700 font-bold">Paid Online ✓</span>
                </div>
              )}
              <div className="flex justify-between font-bold pt-1 border-t border-stone-200">
                <span>Total Amount:</span>
                <span className="text-emerald-700 font-bold">₹{placedOrderSummary.totalAmount} ✓</span>
              </div>
              <div className="text-[11px] text-stone-500">
                Delivery to: {placedOrderSummary.address}
              </div>
            </div>
            
            <a
              href={`https://wa.me/918171902255?text=${encodeURIComponent(
                `Hi Cocoon Studio, I placed Order #${placedOrderSummary.id} for ₹${placedOrderSummary.totalAmount} (${placedOrderSummary.paymentMethod}).\n` +
                (placedOrderSummary.utr ? `UTR: ${placedOrderSummary.utr}\n` : "") +
                `Deliver to: ${placedOrderSummary.customerName}, ${placedOrderSummary.address}\n\n` +
                `Here is my payment confirmation receipt!`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold uppercase tracking-wider block transition text-center"
            >
              Share Receipt on WhatsApp &rarr;
            </a>

            <button
              onClick={() => setPlacedOrderSummary(null)}
              className="w-full py-2.5 rounded-xl text-stone-500 hover:text-stone-800 text-xs font-bold transition cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* 9.5 REVIEW PHOTO & STORY FULLSCREEN LIGHTBOX MODAL */}
      {lightboxIndex !== null && reviewsWithMedia[lightboxIndex] && (() => {
        const currentMediaReview = reviewsWithMedia[lightboxIndex];
        const isVideo = currentMediaReview.mediaUrl?.endsWith(".mp4") || currentMediaReview.mediaUrl?.includes("video");

        return (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn select-none">
            
            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center text-lg transition cursor-pointer"
              title="Close (Esc)"
            >
              ✕
            </button>

            {/* Prev Button */}
            {reviewsWithMedia.length > 1 && (
              <button
                onClick={() => setLightboxIndex((prev) => (prev - 1 + reviewsWithMedia.length) % reviewsWithMedia.length)}
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center text-2xl sm:text-3xl transition cursor-pointer backdrop-blur-xs shadow-lg"
                title="Previous Review (Left Arrow)"
              >
                ‹
              </button>
            )}

            {/* Next Button */}
            {reviewsWithMedia.length > 1 && (
              <button
                onClick={() => setLightboxIndex((prev) => (prev + 1) % reviewsWithMedia.length)}
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center text-2xl sm:text-3xl transition cursor-pointer backdrop-blur-xs shadow-lg"
                title="Next Review (Right Arrow)"
              >
                ›
              </button>
            )}

            {/* Main Lightbox Content Card */}
            <div className="max-w-4xl w-full max-h-[90vh] bg-stone-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row relative">
              
              {/* Media Container */}
              <div className="flex-1 bg-black flex items-center justify-center relative min-h-[300px] max-h-[480px] md:max-h-[620px] p-3">
                {isVideo ? (
                  <video
                    src={currentMediaReview.mediaUrl}
                    controls
                    autoPlay
                    className="max-h-full max-w-full object-contain rounded-2xl"
                  />
                ) : (
                  <img
                    src={currentMediaReview.mediaUrl}
                    alt={currentMediaReview.title || "Customer Review"}
                    className="max-h-full max-w-full object-contain rounded-2xl"
                  />
                )}

                {/* Counter Pill */}
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-white/90 border border-white/15">
                  Photo {lightboxIndex + 1} of {reviewsWithMedia.length}
                </div>
              </div>

              {/* Review Sidebar */}
              <div className="w-full md:w-80 p-6 bg-[#FAF7F2] text-[#2C2623] flex flex-col justify-between overflow-y-auto max-h-[42vh] md:max-h-[620px] text-left">
                <div className="space-y-4">
                  
                  <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DD]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#FAF0ED] text-[#B06B5B] font-bold flex items-center justify-center text-sm border border-[#ECCEC7]">
                        {currentMediaReview.customerName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-header font-bold text-sm block leading-tight">
                          {currentMediaReview.customerName}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-bold">
                          ✓ Verified Buyer
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="text-amber-500 text-sm">
                    {"★".repeat(currentMediaReview.rating || 5)}
                    {"☆".repeat(5 - (currentMediaReview.rating || 5))}
                  </div>

                  {/* Title & Comment */}
                  <div className="space-y-1.5">
                    {currentMediaReview.title && (
                      <h4 className="font-header font-bold text-base text-[#2C2623] leading-snug">
                        {currentMediaReview.title}
                      </h4>
                    )}
                    <p className="text-xs text-stone-700 font-serif leading-relaxed italic">
                      "{currentMediaReview.comment}"
                    </p>
                  </div>

                  <div className="text-[11px] text-stone-400 font-serif pt-2 border-t border-[#EFE8DD]">
                    Reviewed on {new Date(currentMediaReview.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                  </div>

                </div>

                {/* Footer Controls with Prev / Next Buttons */}
                {reviewsWithMedia.length > 1 && (
                  <div className="pt-4 mt-4 border-t border-[#EFE8DD] flex items-center justify-between text-xs font-bold text-[#B06B5B]">
                    <button
                      onClick={() => setLightboxIndex((prev) => (prev - 1 + reviewsWithMedia.length) % reviewsWithMedia.length)}
                      className="hover:underline flex items-center gap-1 cursor-pointer py-1 px-2 rounded-lg hover:bg-stone-100"
                    >
                      <span>‹</span> Previous
                    </button>
                    <span className="text-stone-400 font-mono text-[11px]">
                      {lightboxIndex + 1} / {reviewsWithMedia.length}
                    </span>
                    <button
                      onClick={() => setLightboxIndex((prev) => (prev + 1) % reviewsWithMedia.length)}
                      className="hover:underline flex items-center gap-1 cursor-pointer py-1 px-2 rounded-lg hover:bg-stone-100"
                    >
                      Next <span>›</span>
                    </button>
                  </div>
                )}

              </div>

            </div>

          </div>
        );
      })()}



      {/* 11. TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#221F1F] text-white px-6 py-3 rounded-2xl shadow-2xl text-xs font-bold animate-fadeIn border border-white/20">
          {toastMessage}
        </div>
      )}

      {/* 12. MASTER STUDIO FOOTER */}
      <Footer />

    </div>
  );
}
