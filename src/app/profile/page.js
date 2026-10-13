"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { STORE } from "@/data/store";
import { PRODUCTS } from "@/data/products";
import { saveReviewToSupabase, uploadMediaToSupabase } from "@/lib/supabase";
import { captureLiveGpsAddress } from "@/lib/location";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CustomerProfilePage() {
  const router = useRouter();

  // Active Profile Navigation Tab: "orders" | "reviews" | "wishlist" | "recent" | "details"
  const [activeTab, setActiveTab] = useState("orders");

  // Customer State
  const [customerUser, setCustomerUser] = useState(null);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsSuccessNote, setGpsSuccessNote] = useState(null);
  const [detailsForm, setDetailsForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: ""
  });

  // Multiple Saved Addresses State
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    tag: "Home",
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    isDefault: false
  });

  // Store Data States
  const [allOrders, setAllOrders] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [storeProducts, setStoreProducts] = useState(PRODUCTS);

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewTargetItem, setReviewTargetItem] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: "",
    comment: "",
    mediaFile: null,
    mediaPreview: null
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState(null);
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load Customer & Store Data
  useEffect(() => {
    const loadSession = () => {
      try {
        const saved = localStorage.getItem("cocoon_customer_user");
        if (saved) {
          const parsed = JSON.parse(saved);
          // Sanitize: never allow email in phone field
          let cleanPhone = parsed.phone || "";
          let cleanEmail = parsed.email || "";
          if (cleanPhone.includes("@")) {
            if (!cleanEmail) cleanEmail = cleanPhone;
            cleanPhone = "";
            parsed.phone = "";
            parsed.email = cleanEmail;
            localStorage.setItem("cocoon_customer_user", JSON.stringify(parsed));
          }

          setCustomerUser(parsed);
          setDetailsForm({
            name: parsed.name || "",
            phone: cleanPhone,
            email: cleanEmail,
            address: parsed.address || "",
            city: parsed.city || "",
            pincode: parsed.pincode || ""
          });
        }
      } catch (e) {
        console.error(e);
      }
    };

    const loadData = () => {
      setAllOrders(STORE.getOrders());
      setAllReviews(STORE.getReviews());
      setRecentlyViewed(STORE.getRecentlyViewed());
      setStoreProducts(STORE.getProducts());
      setSavedAddresses(STORE.getAddresses());

      // Merge verified live orders from server/database
      fetch("/api/admin/orders")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.orders) {
            const serverOrders = data.orders.map((o) => ({
              id: o.order_id || `ORD-${o.id}`,
              date: o.created_at,
              customerName: o.customer_name,
              customerPhone: o.customer_phone,
              customerEmail: o.customer_email || "",
              address: o.address,
              items: o.items || [],
              totalAmount: o.total_amount,
              paymentMethod: o.payment_method,
              utr: o.utr,
              paymentStatus: o.utr ? `Paid via Razorpay (ID: ${o.utr})` : "Pending",
              status: o.status || "Processing",
              notes: o.notes || ""
            }));
            const local = STORE.getOrders();
            const mergedMap = new Map();
            [...local, ...serverOrders].forEach((item) => mergedMap.set(item.id, item));
            setAllOrders(Array.from(mergedMap.values()));
          }
        })
        .catch(() => {});

      try {
        const savedWish = localStorage.getItem("cocoon_wishlist");
        if (savedWish) setWishlist(JSON.parse(savedWish));
      } catch (e) {}
    };

    loadSession();
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener("cocoon_store_update", handleUpdate);
    return () => window.removeEventListener("cocoon_store_update", handleUpdate);
  }, []);

  // Filter Customer Orders (Strict privacy: Only match by verified Phone or Email)
  const customerOrders = allOrders.filter((order) => {
    if (!customerUser) return false;
    const cleanUserPhone = (customerUser.phone || "").replace(/\D/g, "");
    const cleanOrderPhone = (order.customerPhone || "").replace(/\D/g, "");
    const matchPhone = cleanUserPhone.length >= 10 && cleanOrderPhone.endsWith(cleanUserPhone.slice(-10));

    const cleanUserEmail = (customerUser.email || "").trim().toLowerCase();
    const cleanOrderEmail = (order.customerEmail || "").trim().toLowerCase();
    const matchEmail = cleanUserEmail && cleanUserEmail === cleanOrderEmail;

    return Boolean(matchPhone || matchEmail);
  });

  // Filter Customer Reviews
  const customerReviews = allReviews.filter((r) => {
    if (!customerUser) return false;
    const cleanUserPhone = (customerUser.phone || "").replace(/\D/g, "");
    const cleanRevPhone = (r.customerPhone || "").replace(/\D/g, "");
    return cleanUserPhone.length >= 10 && cleanRevPhone.endsWith(cleanUserPhone.slice(-10));
  });

  // Open Address Modal for Adding New Address
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      tag: "Home",
      name: customerUser?.name || "",
      phone: (customerUser?.phone && !customerUser.phone.includes("@")) ? customerUser.phone : "",
      email: customerUser?.email || "",
      address: "",
      city: "",
      pincode: "",
      isDefault: savedAddresses.length === 0
    });
    setGpsSuccessNote(null);
    setIsAddressModalOpen(true);
  };

  // Open Address Modal for Editing Existing Address
  const handleOpenEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      tag: addr.tag || "Home",
      name: addr.name || "",
      phone: addr.phone || "",
      email: addr.email || "",
      address: addr.address || "",
      city: addr.city || "",
      pincode: addr.pincode || "",
      isDefault: Boolean(addr.isDefault)
    });
    setGpsSuccessNote(null);
    setIsAddressModalOpen(true);
  };

  // Save Address (Add or Update)
  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addressForm.name.trim()) {
      triggerToast("Please provide recipient name");
      return;
    }
    if (!addressForm.phone.trim() || addressForm.phone.replace(/[^0-9]/g, "").length < 10) {
      triggerToast("Please provide a valid 10-digit mobile number");
      return;
    }
    if (!addressForm.address.trim()) {
      triggerToast("Please provide complete delivery address");
      return;
    }

    const payload = {
      ...addressForm,
      id: editingAddressId || `addr_${Date.now()}`
    };

    const updatedList = STORE.saveAddress(payload);
    setSavedAddresses(updatedList);
    setIsAddressModalOpen(false);

    // Sync default address to customer profile
    if (payload.isDefault || updatedList.length === 1) {
      const updatedUser = {
        ...customerUser,
        name: payload.name,
        phone: payload.phone,
        email: payload.email || customerUser?.email || "",
        address: payload.address,
        city: payload.city,
        pincode: payload.pincode
      };
      setCustomerUser(updatedUser);
      localStorage.setItem("cocoon_customer_user", JSON.stringify(updatedUser));
    }

    triggerToast(editingAddressId ? "Address updated successfully!" : "New delivery address saved!");
  };

  // Delete Address
  const handleDeleteAddress = (id) => {
    const updated = STORE.deleteAddress(id);
    setSavedAddresses(updated);
    triggerToast("Address deleted");
  };

  // Set Default Address
  const handleSetDefaultAddress = (id) => {
    const updated = STORE.setDefaultAddress(id);
    setSavedAddresses(updated);
    const def = updated.find((a) => a.id === id);
    if (def && customerUser) {
      const updatedUser = {
        ...customerUser,
        name: def.name,
        phone: def.phone,
        address: def.address,
        city: def.city,
        pincode: def.pincode
      };
      setCustomerUser(updatedUser);
      localStorage.setItem("cocoon_customer_user", JSON.stringify(updatedUser));
    }
    triggerToast("Default delivery address updated");
  };

  // Live GPS Geolocation Capture
  const handleFetchGpsAddress = async () => {
    setIsDetectingGps(true);
    setGpsSuccessNote(null);
    triggerToast("Connecting to live GPS & fetching street address...");

    try {
      const loc = await captureLiveGpsAddress();
      if (loc && loc.success) {
        setAddressForm((prev) => ({
          ...prev,
          address: loc.fullDisplayAddress || loc.address,
          city: loc.city || prev.city,
          pincode: loc.pincode || prev.pincode
        }));
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

  // Sign Out
  const handleSignOut = () => {
    localStorage.removeItem("cocoon_customer_user");
    setCustomerUser(null);
    triggerToast("Logged out of customer account.");
    router.push("/");
  };

  // Open Review Modal for an Ordered Item
  const openReviewModalForItem = (item, orderId) => {
    setReviewTargetItem({ ...item, orderId });
    setReviewForm({
      rating: 5,
      title: "",
      comment: "",
      mediaFile: null,
      mediaPreview: null
    });
    setIsReviewModalOpen(true);
  };

  // Handle Review Media Upload
  const handleReviewMediaChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isImage && !isVideo) {
      triggerToast("Please upload a photo (JPG, PNG) or video (MP4)");
      return;
    }

    setReviewForm((prev) => ({
      ...prev,
      mediaFile: file,
      mediaPreview: URL.createObjectURL(file)
    }));
  };

  // Submit Review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) {
      triggerToast("Please share your thoughts on the craftsmanship");
      return;
    }

    setIsSubmittingReview(true);
    let finalMediaUrl = reviewForm.mediaPreview;

    try {
      if (reviewForm.mediaFile) {
        triggerToast("Uploading review photo/video... ⏳");
        const uploaded = await uploadMediaToSupabase(reviewForm.mediaFile, "cocoon-media");
        if (uploaded) finalMediaUrl = uploaded;
      }

      const newReview = {
        id: `REV-${Date.now().toString().slice(-4)}`,
        productId: Number(reviewTargetItem.id || reviewTargetItem.productId || 1),
        productName: reviewTargetItem.name || reviewTargetItem.title,
        customerName: customerUser?.name || "Verified Customer",
        customerPhone: customerUser?.phone || "",
        rating: Number(reviewForm.rating),
        title: reviewForm.title || "Handcrafted Perfection",
        comment: reviewForm.comment,
        date: new Date().toISOString(),
        verified: true,
        mediaUrl: finalMediaUrl || null,
        orderId: reviewTargetItem.orderId || null
      };

      // Save to Supabase and Store
      STORE.addReview(newReview);
      await saveReviewToSupabase(newReview);

      setAllReviews((prev) => [newReview, ...prev]);
      setIsReviewModalOpen(false);
      triggerToast("Thank you! Your verified review has been published ⭐");
    } catch (err) {
      console.error(err);
      triggerToast("Review saved locally!");
      setIsReviewModalOpen(false);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Track on WhatsApp Helper
  const trackOrderOnWhatsApp = (order) => {
    const message =
      `*ORDER STATUS INQUIRY*\n\n` +
      `Hello Mehak, I would like an update on my handcrafted Cocoon order:\n\n` +
      `*Order ID:* ${order.id}\n` +
      `*Customer:* ${order.customerName}\n` +
      `*Phone:* ${order.customerPhone}\n` +
      `*Total Amount:* Rs. ${order.totalAmount}\n` +
      `*Items:* ${order.items?.map((i) => i.name).join(", ")}\n\n` +
      `Kindly let me know the current crafting/dispatch status. Thank you!`;
    window.open(`https://wa.me/918171902255?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2623] font-sans antialiased selection:bg-[#F3D5CF] selection:text-[#5B2920]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2C2623] text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-serif flex items-center gap-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. MASTER UNIFIED NAVBAR & TICKER */}
      <Header />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full text-left">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-serif text-stone-500 mb-6">
          <Link href="/" className="hover:text-[#B06B5B] transition">Home</Link>
          <span>/</span>
          <span className="text-stone-800 font-semibold">My Account</span>
        </div>

        {/* Profile Welcome Banner */}
        <div className="bg-gradient-to-r from-[#FAF4ED] via-[#F8EBE6] to-[#FAF4ED] rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 text-left relative overflow-hidden">
          <div className="flex items-center gap-4 sm:gap-6 relative z-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border-2 border-[#ECCEC7] shadow-sm flex items-center justify-center text-3xl font-header text-[#B06B5B] shrink-0">
              {customerUser?.name ? customerUser.name.charAt(0).toUpperCase() : "C"}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/80 border border-[#ECCEC7] text-[10px] font-black uppercase tracking-widest text-[#B06B5B] mb-1">
                <span>Verified Customer</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-header font-light text-[#2C2623]">
                {customerUser?.name ? `Welcome back, ${customerUser.name}` : "Welcome to Your Account"}
              </h1>
              <p className="text-xs text-[#2C2623]/70 font-serif mt-0.5">
                {customerUser?.phone && !customerUser.phone.includes("@")
                  ? `Registered Phone: ${customerUser.phone} • Express All-India Courier`
                  : customerUser?.email
                    ? `Registered Email: ${customerUser.email} • Express All-India Courier`
                    : "Manage your handcrafted orders, track live delivery, and leave verified reviews."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 relative z-10 shrink-0 flex-wrap">
            <button
              onClick={() => setActiveTab("details")}
              className="px-4 py-2 rounded-full bg-white text-[#2C2623] hover:text-[#B06B5B] border border-[#DDD3C4] text-xs font-bold uppercase tracking-wider shadow-2xs transition cursor-pointer"
            >
              Edit Address
            </button>
            <a
              href="https://wa.me/918171902255"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider shadow-xs transition flex items-center gap-1"
            >
              <span>WhatsApp Support</span>
            </a>
            {customerUser && (
              <button
                onClick={handleSignOut}
                className="px-4 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-[#EFE8DD] text-xs font-bold uppercase tracking-wider scrollbar-none">
          {[
            { id: "orders", label: `My Orders (${customerOrders.length})`, icon: "" },
            { id: "reviews", label: `My Reviews (${customerReviews.length})`, icon: "" },
            { id: "wishlist", label: `Wishlist (${wishlist.length})`, icon: "" },
            { id: "recent", label: `Recently Viewed (${recentlyViewed.length})`, icon: "" },
            { id: "details", label: "Saved Address", icon: "" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-2xl transition flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#2C2623] text-white shadow-md"
                  : "bg-white text-[#2C2623]/70 hover:bg-[#FAF4ED] hover:text-[#2C2623] border border-[#EAE1D3]"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ================= TAB 1: ORDER HISTORY ================= */}
        {activeTab === "orders" && (
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-[#EFE8DD]">
              <div>
                <h2 className="text-xl sm:text-2xl font-header font-light text-[#2C2623]">My Orders</h2>
                <p className="text-xs text-[#2C2623]/60">Track your orders and check delivery status.</p>
              </div>
              <span className="text-xs font-bold text-[#B06B5B] bg-[#F8E5E1] px-3 py-1 rounded-full">
                {customerOrders.length} {customerOrders.length === 1 ? "Order" : "Orders"}
              </span>
            </div>

            {customerOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border border-[#EAE1D3] text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 flex items-center justify-center mb-3 text-stone-400 font-serif text-xl">C</div>
                <h3 className="text-xl font-header text-[#2C2623]">No orders yet</h3>
                <p className="text-xs font-serif text-[#2C2623]/70 max-w-md mx-auto">
                  You have not placed any orders yet. Explore our handcrafted collection to find something you love.
                </p>
                <Link
                  href="/#p4-treasures"
                  className="inline-block px-6 py-2.5 rounded-full bg-[#B06B5B] hover:bg-[#964B44] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm"
                >
                  Shop All Products &rarr;
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {customerOrders.map((order) => {
                  const statusColors = {
                    Pending: "bg-amber-50 text-amber-800 border-amber-200",
                    Processing: "bg-blue-50 text-blue-800 border-blue-200",
                    Shipped: "bg-indigo-50 text-indigo-800 border-indigo-200",
                    Delivered: "bg-emerald-50 text-emerald-800 border-emerald-200"
                  };

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl border border-[#EAE1D3] p-6 shadow-xs hover:shadow-md transition space-y-6"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F4EFEA] gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="font-sans font-bold text-base text-[#2C2623]">{order.id}</span>
                            <span
                              className={`px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                                statusColors[order.status] || "bg-stone-50 text-stone-700 border-stone-200"
                              }`}
                            >
                              {order.status || "Processing"}
                            </span>
                          </div>
                          <p className="text-xs text-[#2C2623]/60 font-serif">
                            Placed on {order.date ? new Date(order.date).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "Recently"} • Payment: {order.paymentMethod || "Direct UPI"}{order.utr ? ` (UTR: ${order.utr})` : ""}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => trackOrderOnWhatsApp(order)}
                            className="px-4 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>Track on WhatsApp</span>
                            
                          </button>
                        </div>
                      </div>

                      {/* Order Progress Bar */}
                      <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EDE5DA] space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#2C2623]">
                          <span className="flex items-center gap-1 text-[#B06B5B]">
                            <span>Handcrafted with Care</span>
                          </span>
                          <span>Delivery via Express Courier</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[10px] font-sans">
                          <div className={`p-1.5 rounded-lg border ${order.status ? "bg-white border-[#B06B5B] text-[#B06B5B] font-bold" : "bg-stone-100 text-stone-400 border-stone-200"}`}>
                            1. Order Confirmed ✓
                          </div>
                          <div className={`p-1.5 rounded-lg border ${["Processing", "Shipped", "Delivered"].includes(order.status) ? "bg-white border-[#B06B5B] text-[#B06B5B] font-bold" : "bg-stone-100 text-stone-400 border-stone-200"}`}>
                            2. Hand-Knitting
                          </div>
                          <div className={`p-1.5 rounded-lg border ${["Shipped", "Delivered"].includes(order.status) ? "bg-white border-[#B06B5B] text-[#B06B5B] font-bold" : "bg-stone-100 text-stone-400 border-stone-200"}`}>
                            3. Dispatched
                          </div>
                          <div className={`p-1.5 rounded-lg border ${order.status === "Delivered" ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold" : "bg-stone-100 text-stone-400 border-stone-200"}`}>
                            4. Delivered
                          </div>
                        </div>
                      </div>

                      {/* Courier Tracking Badge (Shiprocket or Porter / Self Dispatch) */}
                      {order.awbCode && (
                        <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
                          <div className="space-y-1">
                            <span className="font-bold text-blue-950 flex items-center gap-1.5 text-sm">
                              <span>🚚 Dispatched via {order.courierName || "Express Courier"}</span>
                              {order.dispatchMode === "manual" && (
                                <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold uppercase tracking-wider font-sans">
                                  Live Delivery
                                </span>
                              )}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-blue-900 text-xs font-bold select-all bg-white px-2 py-0.5 rounded border border-blue-200">
                                Tracking ID: {order.awbCode}
                              </span>
                            </div>
                            {order.pickupScheduledAt && (
                              <span className="text-[11px] text-stone-500 block">
                                Dispatched on: <strong>{order.pickupScheduledAt}</strong>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={order.trackingUrl || (order.courierName?.toLowerCase().includes("porter") ? `https://porter.in/track/${order.awbCode}` : `https://shiprocket.co/tracking/${order.awbCode}`)}
                              target="_blank"
                              rel="noreferrer"
                              className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-xs flex items-center gap-1.5 active:scale-95"
                            >
                              <span>📍 Live Track Parcel</span>
                              <span>&rarr;</span>
                            </a>
                            <a
                              href={`/cart?viewInvoice=${encodeURIComponent(order.id)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3.5 py-2 rounded-full bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 font-bold text-xs transition shadow-2xs"
                            >
                              <span>🖨️ Invoice</span>
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Ordered Items List */}
                      <div className="divide-y divide-[#F4EFEA]">
                        {order.items?.map((item, idx) => {
                          const itemProdId = item.id || item.productId || 1;
                          return (
                            <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#FAF4ED] border border-[#EAE1D3] shrink-0">
                                  <img
                                    src={item.imgUrl || "/products/items/chocolate-bow-handbag.jpg"}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="space-y-0.5">
                                  <Link
                                    href={`/product/${itemProdId}`}
                                    className="font-header font-bold text-sm text-[#2C2623] hover:text-[#B06B5B] transition"
                                  >
                                    {item.name} &rarr;
                                  </Link>
                                  <p className="text-xs text-[#2C2623]/60 font-serif">
                                    Qty: {item.quantity} • Color: {item.color || "Standard Palette"}
                                  </p>
                                  <span className="font-sans font-bold text-xs text-[#2C2623]">
                                    Rs. {item.price} each (Total: Rs. {item.price * item.quantity})
                                  </span>
                                </div>
                              </div>

                              {/* Write a Review Button for each ordered item! */}
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/product/${itemProdId}`}
                                  className="px-3.5 py-1.5 rounded-full border border-[#DDD3C4] text-[11px] font-bold uppercase tracking-wider text-[#2C2623] hover:bg-[#FAF4ED] transition"
                                >
                                  View Item
                                </Link>
                                <button
                                  onClick={() => openReviewModalForItem(item, order.id)}
                                  className="px-4 py-1.5 rounded-full bg-[#B06B5B] hover:bg-[#964B44] text-white text-[11px] font-bold uppercase tracking-wider transition shadow-2xs flex items-center gap-1 cursor-pointer"
                                >
                                  <span>Write a Review</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Order Footer & Shipping Destination */}
                      <div className="pt-4 border-t border-[#F4EFEA] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#2C2623]/70 gap-2">
                        <div>
                          <span className="font-bold text-[#2C2623]">Delivering To: </span>
                          <span>{order.address || [customerUser?.address, customerUser?.city, customerUser?.pincode].filter(Boolean).join(", ") || "Address on File"}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-sans text-stone-500 mr-2">Grand Total:</span>
                          <span className="font-sans font-bold text-lg text-[#2C2623]">Rs. {order.totalAmount}</span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: MY REVIEWS ================= */}
        {activeTab === "reviews" && (
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-[#EFE8DD]">
              <div>
                <h2 className="text-xl sm:text-2xl font-header font-light text-[#2C2623]">My Verified Reviews & Photos</h2>
                <p className="text-xs text-[#2C2623]/60">Reviews you have shared with the Cocoon artisan community.</p>
              </div>
              <span className="text-xs font-bold text-[#B06B5B] bg-[#F8E5E1] px-3 py-1 rounded-full">
                {customerReviews.length} {customerReviews.length === 1 ? "Review" : "Reviews"}
              </span>
            </div>

            {customerReviews.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border border-[#EAE1D3] text-center space-y-4">
                <span className="text-5xl block">⭐</span>
                <h3 className="text-xl font-header text-[#2C2623]">No reviews shared yet</h3>
                <p className="text-xs font-serif text-[#2C2623]/70 max-w-md mx-auto">
                  Once your handcrafted piece arrives, share your photos and impressions here! Your feedback supports slow artisan knitting.
                </p>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="px-6 py-2.5 rounded-full bg-[#B06B5B] hover:bg-[#964B44] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
                >
                  Review from Past Orders &rarr;
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {customerReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white rounded-3xl border border-[#EAE1D3] p-6 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-1 text-amber-500 text-sm">
                            {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                              <span key={i}>★</span>
                            ))}
                          </div>
                          <h4 className="font-header font-bold text-base text-[#2C2623] mt-1">{rev.title}</h4>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-[#B06B5B] bg-[#FAF4ED] px-2.5 py-1 rounded-full border border-[#EAE0D2]">
                          Verified Buyer ✓
                        </span>
                      </div>

                      <p className="text-xs text-[#2C2623]/80 font-serif leading-relaxed italic">
                        "{rev.comment}"
                      </p>

                      {/* Customer Photo / Video Attachment */}
                      {rev.mediaUrl && (
                        <div className="mt-3 rounded-2xl overflow-hidden border border-[#EDE5DA] bg-[#FAF7F2] max-h-48">
                          {rev.mediaUrl.endsWith(".mp4") || rev.mediaUrl.includes("video") ? (
                            <video src={rev.mediaUrl} controls className="w-full h-48 object-cover" />
                          ) : (
                            <img src={rev.mediaUrl} alt="Review snapshot" className="w-full h-48 object-cover" />
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#F4EFEA] flex items-center justify-between text-xs text-[#2C2623]/60">
                      <span>Reviewed: {rev.productName || "Handcrafted Piece"}</span>
                      <Link
                        href={`/product/${rev.productId}`}
                        className="text-[#B06B5B] font-bold hover:underline"
                      >
                        View Product &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: WISHLIST ================= */}
        {activeTab === "wishlist" && (
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-[#EFE8DD]">
              <div>
                <h2 className="text-xl sm:text-2xl font-header font-light text-[#2C2623]">Wishlist</h2>
                <p className="text-xs text-[#2C2623]/60">Handmade treasures saved for future special occasions.</p>
              </div>
              <span className="text-xs font-bold text-[#B06B5B] bg-[#F8E5E1] px-3 py-1 rounded-full">
                {wishlist.length} Items Saved
              </span>
            </div>

            {wishlist.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border border-[#EAE1D3] text-center space-y-4">
                <svg className="w-16 h-16 mx-auto text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                <h3 className="text-xl font-header text-[#2C2623]">Your wishlist is empty</h3>
                <p className="text-xs font-serif text-[#2C2623]/70 max-w-md mx-auto">
                  Click the heart icon on any slow-knitted bag, scarf, or bonnet to keep it saved here.
                </p>
                <Link
                  href="/#p4-treasures"
                  className="inline-block px-6 py-2.5 rounded-full bg-[#B06B5B] hover:bg-[#964B44] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm"
                >
                  Browse Drops &rarr;
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlist.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-4 border border-[#EAE1D3] shadow-xs hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-[#FAF4ED] mb-3">
                        <img src={item.imgUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <h4 className="font-header font-bold text-sm text-[#2C2623] truncate">{item.name}</h4>
                      <p className="text-xs font-sans font-bold text-[#B06B5B] mt-1">Rs. {item.price}</p>
                    </div>

                    <div className="pt-3 border-t border-[#F4EFEA] flex items-center justify-between gap-2 mt-3">
                      <Link
                        href={`/product/${item.id}`}
                        className="flex-1 py-1.5 rounded-lg bg-[#2C2623] hover:bg-rose-600 text-white text-center text-xs font-bold uppercase tracking-wider transition"
                      >
                        View &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: RECENTLY VIEWED ================= */}
        {activeTab === "recent" && (
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-[#EFE8DD]">
              <div>
                <h2 className="text-xl sm:text-2xl font-header font-light text-[#2C2623]">Recently Viewed Pieces</h2>
                <p className="text-xs text-[#2C2623]/60">Pick up right where you left off browsing.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {recentlyViewed.map((prodId) => {
                const prod = storeProducts.find((p) => p.id === Number(prodId));
                if (!prod) return null;

                return (
                  <Link
                    key={prod.id}
                    href={`/product/${prod.id}`}
                    className="group bg-white rounded-2xl p-4 border border-[#EAE1D3] shadow-xs hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-[#FAF4ED] mb-3">
                        <img
                          src={prod.imgUrl}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      </div>
                      <span className="text-[10px] uppercase font-bold text-[#B06B5B] tracking-wider block">
                        {prod.category}
                      </span>
                      <h4 className="font-header font-bold text-sm text-[#2C2623] group-hover:text-[#B06B5B] transition truncate mt-0.5">
                        {prod.name}
                      </h4>
                      <p className="text-xs font-sans font-bold text-[#2C2623] mt-1">Rs. {prod.price}</p>
                    </div>

                    <div className="pt-3 border-t border-[#F4EFEA] mt-3 text-right">
                      <span className="text-[11px] font-bold text-[#B06B5B] group-hover:underline">
                        Explore Details &rarr;
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 5: MULTIPLE SAVED ADDRESSES ================= */}
        {activeTab === "details" && (
          <div className="space-y-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EFE8DD] gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#B06B5B] block">
                  Delivery Destination
                </span>
                <h2 className="text-xl sm:text-2xl font-header font-light text-[#2C2623] mt-0.5">
                  Saved Addresses ({savedAddresses.length})
                </h2>
                <p className="text-xs text-[#2C2623]/60 font-serif">
                  Manage multiple delivery addresses (Home, Work, etc.) for effortless checkout.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddAddress}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[#B06B5B] hover:bg-[#964B44] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer self-start sm:self-auto"
              >
                <span>+ Add New Address</span>
              </button>
            </div>

            {savedAddresses.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border border-[#EAE1D3] text-center space-y-4 max-w-xl mx-auto">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF0ED] text-[#B06B5B] flex items-center justify-center">
                  <svg className="w-7 h-7 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-header text-[#2C2623]">No saved addresses yet</h3>
                <p className="text-xs font-serif text-[#2C2623]/70 max-w-sm mx-auto">
                  Save your home, work, or family delivery addresses so you never have to re-type them during checkout.
                </p>
                <button
                  type="button"
                  onClick={handleOpenAddAddress}
                  className="px-6 py-2.5 rounded-full bg-[#B06B5B] hover:bg-[#964B44] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
                >
                  + Add Your First Address
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`bg-white rounded-3xl border p-5 shadow-xs transition relative flex flex-col justify-between ${
                      addr.isDefault
                        ? "border-[#B06B5B] ring-1 ring-[#B06B5B]/30 bg-[#FFFDFB]"
                        : "border-[#EAE1D3] hover:border-[#DDD3C4]"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#FAF0ED] border border-[#ECCEC7] text-[10px] font-bold uppercase tracking-wider text-[#B06B5B]">
                            {addr.tag || "Home"}
                          </span>
                          {addr.isDefault && (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-800">
                              Default Address
                            </span>
                          )}
                        </div>

                        {!addr.isDefault && (
                          <button
                            type="button"
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="text-[11px] font-bold text-stone-500 hover:text-[#B06B5B] transition cursor-pointer"
                          >
                            Set as Default
                          </button>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-header font-bold text-sm text-[#2C2623]">{addr.name}</h4>
                        <p className="text-xs text-stone-600 font-sans font-medium">
                          Phone: <span className="text-[#2C2623] font-bold">{addr.phone}</span>
                        </p>
                        {addr.email && (
                          <p className="text-xs text-stone-500 font-sans">
                            Email: {addr.email}
                          </p>
                        )}
                        <p className="text-xs text-stone-600 font-serif leading-relaxed pt-1">
                          {addr.address}, {addr.city} - <span className="font-bold text-stone-800">{addr.pincode}</span>
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#F4EFEA] mt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleOpenEditAddress(addr)}
                        className="text-xs font-bold text-[#B06B5B] hover:underline cursor-pointer"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* ================= WRITE REVIEW MODAL ================= */}
      {isReviewModalOpen && reviewTargetItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E8DFC9] shadow-2xl space-y-6 text-left animate-fadeIn">
            
            <div className="flex items-start justify-between pb-3 border-b border-[#F4EFEA]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#B06B5B] block">
                  Artisan Feedback
                </span>
                <h3 className="text-xl font-header font-light text-[#2C2623]">
                  Review: {reviewTargetItem.name}
                </h3>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              
              {/* Star Rating Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#2C2623]/70 block mb-1.5">
                  Your Rating *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className={`text-2xl transition cursor-pointer ${
                        star <= reviewForm.rating ? "text-amber-400 scale-110" : "text-stone-300 hover:text-amber-200"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-xs font-bold text-stone-600 ml-2">
                    {reviewForm.rating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Review Headline */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#2C2623]/70 block mb-1">
                  Headline / Title
                </label>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                  placeholder="e.g. Gorgeous craftsmanship & soft milk cotton!"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DDD3C4] text-xs font-sans focus:outline-none focus:border-[#B06B5B]"
                />
              </div>

              {/* Review Comments */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#2C2623]/70 block mb-1">
                  Your Review & Experience *
                </label>
                <textarea
                  rows={4}
                  required
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="How does it feel? How did you style it? Share your sincere feedback for Mehak's needles..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DDD3C4] text-xs font-sans focus:outline-none focus:border-[#B06B5B]"
                />
              </div>

              {/* Photo / Video Upload */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#2C2623]/70 block mb-1">
                  Attach Photo or Video (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleReviewMediaChange}
                  className="w-full text-xs font-sans text-stone-600 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#FAF4ED] file:text-[#B06B5B] hover:file:bg-[#F3E5E1] cursor-pointer"
                />
                {reviewForm.mediaPreview && (
                  <div className="mt-2 w-24 h-24 rounded-xl overflow-hidden border border-[#DDD3C4]">
                    <img src={reviewForm.mediaPreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#F4EFEA]">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-stone-300 text-xs font-bold uppercase tracking-wider text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-6 py-2 rounded-full bg-[#B06B5B] hover:bg-[#964B44] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingReview ? "Submitting..." : "Publish Review"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ================= ADD / EDIT ADDRESS MODAL ================= */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E8DFC9] shadow-2xl space-y-5 text-left animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-[#F4EFEA]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#B06B5B] block">
                  Delivery Destination
                </span>
                <h3 className="text-xl font-header font-bold text-[#2C2623] mt-0.5">
                  {editingAddressId ? "Edit Delivery Address" : "Add New Delivery Address"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              {/* Tag selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1.5">
                  Address Label
                </label>
                <div className="flex gap-2">
                  {["Home", "Work", "Other"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setAddressForm({ ...addressForm, tag })}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                        addressForm.tag === tag
                          ? "bg-[#B06B5B] text-white shadow-2xs"
                          : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.name}
                    onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                    placeholder="e.g. Puneet Kushwaha"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C4] text-xs font-sans focus:outline-none focus:border-[#B06B5B]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-stone-500 text-xs font-bold select-none">+91</span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value.replace(/[^0-9]/g, "") })}
                      placeholder="9876543210"
                      className="w-full pl-11 pr-3.5 py-2.5 rounded-xl border border-[#DDD3C4] text-xs font-sans focus:outline-none focus:border-[#B06B5B]"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={addressForm.email}
                  onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })}
                  placeholder="e.g. puneet@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C4] text-xs font-sans focus:outline-none focus:border-[#B06B5B]"
                />
              </div>

              {/* Street Address & GPS */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-700 block">
                    House / Flat / Street Address *
                  </label>
                  <button
                    type="button"
                    onClick={handleFetchGpsAddress}
                    disabled={isDetectingGps}
                    className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer disabled:opacity-50"
                  >
                    {isDetectingGps ? "Detecting GPS..." : "Auto-Detect Live GPS"}
                  </button>
                </div>

                {gpsSuccessNote && (
                  <div className="mb-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800">
                    ✓ {gpsSuccessNote}
                  </div>
                )}

                <textarea
                  rows={2}
                  required
                  value={addressForm.address}
                  onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                  placeholder="Flat 402, Lotus Apartments, MG Road..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C4] text-xs font-sans focus:outline-none focus:border-[#B06B5B]"
                />
              </div>

              {/* City & Pincode */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C4] text-xs font-sans focus:outline-none focus:border-[#B06B5B]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value.replace(/[^0-9]/g, "") })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD3C4] text-xs font-sans focus:outline-none focus:border-[#B06B5B]"
                  />
                </div>
              </div>

              {/* Default checkbox */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="accent-[#B06B5B] w-4 h-4 rounded"
                />
                <span className="text-xs text-stone-700 font-medium">Make this my default delivery address</span>
              </label>

              {/* Actions */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#F4EFEA]">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-5 py-2 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#B06B5B] hover:bg-[#964B44] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MASTER STUDIO FOOTER */}
      <Footer />

    </div>
  );
}
