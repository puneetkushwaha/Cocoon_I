"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { STORE } from "@/data/store";
import { uploadMediaToSupabase } from "@/lib/supabase";

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard", "orders", "customizations", "products", "categories", "bestsellers", "hero", "ticker"
  
  // Admin Authentication State
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.authenticated && data.role === "admin") {
          setIsAdminAuthenticated(true);
          setIsCheckingAuth(false);
          return;
        }

        router.push("/login?redirect=/admin");
      } catch (err) {
        router.push("/login?redirect=/admin");
      }
    };
    verifyAuth();
  }, [router]);

  const handleAdminLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {}
    localStorage.removeItem("cocoon_admin_auth");
    setIsAdminAuthenticated(false);
    router.push("/login");
  };

  
  // Data states from persistent store
  const [orders, setOrders] = useState([]);
  const [customizations, setCustomizations] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [heroCards, setHeroCards] = useState([]);
  const [tickerList, setTickerList] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [offers, setOffers] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [broadcastLaunchChecked, setBroadcastLaunchChecked] = useState(true);
  const [isBroadcastingEmail, setIsBroadcastingEmail] = useState(false);
  const [newOfferForm, setNewOfferForm] = useState({
    title: "",
    badge: "Special Studio Offer",
    description: "",
    couponCode: "",
    link: "/#shop"
  });

  // Coupons & Promo Engine State (Percentage, Flat, BOGO)
  const [coupons, setCoupons] = useState([]);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [couponForm, setCouponForm] = useState({
    id: "",
    code: "",
    title: "",
    type: "percentage", // "percentage" | "flat" | "bogo"
    discountPercent: 15,
    discountAmount: 100,
    bogoBuyQty: 1,
    bogoFreeQty: 1,
    minOrderValue: 0,
    maxDiscount: 0,
    isActive: true
  });

  // COD setting state
  const [isCodEnabled, setIsCodEnabled] = useState(true);
  const [dbStatus, setDbStatus] = useState("checking");

  // Orders Verification Filter
  const [orderFilter, setOrderFilter] = useState("all"); // "all", "needs_verification", "verified", "upi", "cod"

  // Toast / feedback message
  const [adminToast, setAdminToast] = useState(null);

  // Shiprocket Courier Dispatch State
  const [shippingModalOrder, setShippingModalOrder] = useState(null);
  const [isBookingCourier, setIsBookingCourier] = useState(false);
  const [parcelDimensions, setParcelDimensions] = useState({
    weight: "0.25",
    length: "20",
    breadth: "15",
    height: "8",
    courierPreference: "auto",
    pickupDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
  });
  const [bookingSuccessModal, setBookingSuccessModal] = useState(null);
  const [availableCouriers, setAvailableCouriers] = useState([]);
  const [isLoadingRates, setIsLoadingRates] = useState(false);

  // Manual Courier / Porter Dispatch Modal State
  const [manualDispatchModalOrder, setManualDispatchModalOrder] = useState(null);
  const [manualCourierForm, setManualCourierForm] = useState({
    courierName: "Porter",
    trackingId: "",
    trackingUrl: "",
    notes: ""
  });

  // Edit / Add Modal States
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingHeroCard, setEditingHeroCard] = useState(null);
  const [newTickerText, setNewTickerText] = useState("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const handleProductPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      triggerToast("Please select an image file (JPG, PNG, WebP)");
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const localPreview = URL.createObjectURL(file);
      setEditingProduct((prev) => ({ ...prev, imgUrl: localPreview }));
      triggerToast("Uploading photo to storage... ⏳");

      const uploadedUrl = await uploadMediaToSupabase(file, "cocoon-media");
      if (uploadedUrl) {
        setEditingProduct((prev) => ({ ...prev, imgUrl: uploadedUrl }));
        triggerToast("Product photo updated successfully!");
      }
    } catch (err) {
      console.error(err);
      triggerToast("Photo set to preview.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleHeroPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      const localPreview = URL.createObjectURL(file);
      setEditingHeroCard((prev) => ({ ...prev, imgUrl: localPreview }));
      triggerToast("Uploading hero card image... ⏳");

      const uploadedUrl = await uploadMediaToSupabase(file, "cocoon-media");
      if (uploadedUrl) {
        setEditingHeroCard((prev) => ({ ...prev, imgUrl: uploadedUrl }));
        triggerToast("Hero image updated!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const triggerToast = (msg) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(null), 3500);
  };

  // Load from store and Supabase on mount
  const loadData = async () => {
    // 1. Initial local load
    setOrders(STORE.getOrders());
    setCustomizations(STORE.getCustomizations());
    setProducts(STORE.getProducts());
    setCategories(STORE.getCategories());
    setBestsellers(STORE.getBestsellers());
    setHeroCards(STORE.getHeroCards());
    setTickerList(STORE.getTicker());
    setReviews(STORE.getReviews());
    setOffers(STORE.getOffers());
    setCoupons(STORE.getCoupons());
    setSubscribers(STORE.getSubscribers());
    setIsCodEnabled(STORE.isCodEnabled());

    // Sync live store data from backend API
    try {
      const serverData = await STORE.fetchServerStoreData();
      if (serverData && serverData.success) {
        if (serverData.source === "supabase") {
          setDbStatus("connected");
        } else {
          setDbStatus("local_only");
        }
        if (serverData.source !== "initial_seed") {
          if (serverData.products) setProducts(serverData.products);
          if (serverData.categories) setCategories(serverData.categories);
          if (serverData.coupons) setCoupons(serverData.coupons);
          if (serverData.heroCards) setHeroCards(serverData.heroCards);
          if (serverData.ticker) setTickerList(serverData.ticker);
          if (serverData.bestsellers) setBestsellers(serverData.bestsellers);
        }
      }
    } catch (e) {
      setDbStatus("local_only");
    }

    // 2. Fetch live orders from Supabase across all devices
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        const local = STORE.getOrders();
        const map = new Map();
        local.forEach((o) => map.set(o.id, o));
        data.orders.forEach((o) => map.set(o.id, { ...map.get(o.id), ...o }));
        const merged = Array.from(map.values()).sort(
          (a, b) => new Date(b.date || b.timestamp || 0) - new Date(a.date || a.timestamp || 0)
        );
        setOrders(merged);
        STORE.setOrders(merged);
      }
    } catch (e) {
      console.warn("Live orders sync notice:", e);
    }

    // 3. Fetch live customizations from Supabase across all devices
    try {
      const res = await fetch("/api/admin/customizations");
      const data = await res.json();
      if (data.success && Array.isArray(data.customizations)) {
        setCustomizations(data.customizations);
        STORE.setCustomizations(data.customizations);
      }
    } catch (e) {
      console.warn("Live customizations sync notice:", e);
    }
  };

  const handleToggleCod = () => {
    const newState = STORE.toggleCod();
    setIsCodEnabled(newState);
    triggerToast(
      newState
        ? "Cash on Delivery (COD) turned ON. Buyers can now choose COD at checkout!"
        : "Cash on Delivery (COD) turned OFF. Store is now Prepaid Online Only."
    );
  };

  const deleteReview = (id) => {
    if (confirm("Are you sure you want to remove this customer review?")) {
      const updated = reviews.filter((r) => r.id !== id);
      setReviews(updated);
      STORE.setReviews(updated);
      triggerToast("Customer review removed.");
    }
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("cocoon_store_update", handleUpdate);
    return () => window.removeEventListener("cocoon_store_update", handleUpdate);
  }, []);

  // ANALYTICS CALCULATIONS
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter((o) => o.date && o.date.slice(0, 10) === todayStr);
  const processingOrders = orders.filter((o) => o.status === "Processing" || o.status === "Pending");
  const shippedOrders = orders.filter((o) => o.status === "Shipped");
  const deliveredOrders = orders.filter((o) => o.status === "Delivered");
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  // ORDER ACTIONS (With Email Notifications to Customer & Admin + DB Sync)
  const updateOrderStatus = async (orderId, newStatus) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    setOrders(updated);
    STORE.setOrders(updated);
    triggerToast(`Order ${orderId} status changed to "${newStatus}" ⏳`);

    // Sync to Supabase in background
    try {
      fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, updates: { status: newStatus } })
      });
    } catch (e) {}

    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      try {
        const res = await STORE.dispatchEmailNotification("order_status_update", {
          order: { ...targetOrder, status: newStatus },
          newStatus: newStatus
        });
        if (res?.success) {
          triggerToast(`Order updated & status email sent to customer and admin!`);
        } else {
          triggerToast(`Status changed to "${newStatus}".`);
        }
      } catch (e) {
        console.error("Status update email error:", e);
      }
    }
  };

  // UPI / Payment Verification Toggle (With Supabase Sync)
  const togglePaymentVerification = async (orderId) => {
    let newVerifiedState = false;
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        const isVerified = !o.paymentVerified;
        newVerifiedState = isVerified;
        return {
          ...o,
          paymentVerified: isVerified,
          paymentStatus: isVerified 
            ? "Payment Verified (Confirmed by Studio)" 
            : (o.paymentMethod === "UPI" ? "UPI Payment Submitted (Awaiting Verification)" : "Pending (Pay on Delivery)")
        };
      }
      return o;
    });

    setOrders(updated);
    STORE.setOrders(updated);

    // Sync to Supabase in background
    try {
      fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          updates: {
            notes: `Payment Verified: ${newVerifiedState ? "YES" : "NO"} by Admin`
          }
        })
      });
    } catch (e) {}

    const target = updated.find((o) => o.id === orderId);
    if (target) {
      triggerToast(
        target.paymentVerified 
          ? `✓ Payment Verified for Order ${orderId}!` 
          : `Order ${orderId} marked Unverified.`
      );
    }
  };

  // SHIPROCKET COURIER PICKUP ACTIONS
  const handleOpenCourierModal = async (order) => {
    setShippingModalOrder(order);
    const totalItemsCount = (order.items || []).reduce((acc, it) => acc + (Number(it.quantity) || 1), 0);
    const estimatedWeight = Math.max(0.2, totalItemsCount * 0.15).toFixed(2);
    setParcelDimensions((prev) => ({
      ...prev,
      weight: estimatedWeight,
      courierPreference: "auto",
      pickupDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10)
    }));

    const pinMatch = (order.address || "").match(/\b([1-9][0-9]{5})\b/);
    const pin = order.pincode || (pinMatch ? pinMatch[1] : "721302");
    const isCod = order.paymentMethod === "COD" ? 1 : 0;

    setIsLoadingRates(true);
    setAvailableCouriers([]);
    try {
      const res = await fetch(`/api/shipping/shiprocket?pincode=${pin}&weight=${estimatedWeight}&cod=${isCod}`);
      const data = await res.json();
      if (data?.success && Array.isArray(data.couriers) && data.couriers.length > 0) {
        setAvailableCouriers(data.couriers);
        // Pre-select the cheapest courier by default!
        setParcelDimensions((prev) => ({
          ...prev,
          courierPreference: String(data.couriers[0].id)
        }));
      }
    } catch (e) {
      console.warn("Notice loading courier rates:", e);
    } finally {
      setIsLoadingRates(false);
    }
  };

  const handleBookCourier = async (e) => {
    if (e) e.preventDefault();
    if (!shippingModalOrder) return;
    setIsBookingCourier(true);
    triggerToast("Booking Shiprocket courier pickup... ⏳");

    try {
      const res = await fetch("/api/shipping/shiprocket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: shippingModalOrder.id,
          order: shippingModalOrder,
          parcelDimensions: {
            weight: Number(parcelDimensions.weight) || 0.25,
            length: Number(parcelDimensions.length) || 20,
            breadth: Number(parcelDimensions.breadth) || 15,
            height: Number(parcelDimensions.height) || 8
          },
          pickupDate: parcelDimensions.pickupDate,
          courierPreference: parcelDimensions.courierPreference
        })
      });

      const data = await res.json();
      if (data.success && data.booking) {
        const updated = orders.map((o) => {
          if (o.id === shippingModalOrder.id) {
            return {
              ...o,
              status: "Shipped",
              courierName: data.booking.courierName,
              awbCode: data.booking.awbCode,
              shipmentId: data.booking.shipmentId,
              trackingUrl: data.booking.trackingUrl,
              labelUrl: data.booking.labelUrl,
              pickupScheduledAt: data.booking.pickupDate
            };
          }
          return o;
        });
        setOrders(updated);
        STORE.setOrders(updated);

        setBookingSuccessModal({
          order: shippingModalOrder,
          booking: data.booking
        });
        setShippingModalOrder(null);
        triggerToast(`🎉 Courier Assigned! AWB: ${data.booking.awbCode} (${data.booking.courierName})`);
      } else {
        triggerToast(`Notice: ${data.error || "Failed to book courier"}`);
      }
    } catch (err) {
      console.error("Courier booking error:", err);
      triggerToast("Network error contacting logistics server.");
    } finally {
      setIsBookingCourier(false);
    }
  };

  // MANUAL COURIER (PORTER, BLUEDART, DTDC, LOCAL) HANDLERS
  const handleOpenManualDispatch = (order) => {
    setManualDispatchModalOrder(order);
    setManualCourierForm({
      courierName: order.courierName || "Porter",
      trackingId: order.awbCode || "",
      trackingUrl: order.trackingUrl || "",
      notes: ""
    });
  };

  const handleSaveManualDispatch = async (e) => {
    if (e) e.preventDefault();
    if (!manualDispatchModalOrder) return;

    const courier = manualCourierForm.courierName.trim() || "Porter";
    const trackId = manualCourierForm.trackingId.trim();
    if (!trackId) {
      triggerToast("Please enter a Tracking ID / Order Reference");
      return;
    }

    // Generate or format tracking url
    let autoUrl = manualCourierForm.trackingUrl.trim();
    if (!autoUrl) {
      const lower = courier.toLowerCase();
      if (lower.includes("porter")) {
        autoUrl = `https://porter.in/track/${encodeURIComponent(trackId)}`;
      } else if (lower.includes("delhivery")) {
        autoUrl = `https://www.delhivery.com/track/package/${encodeURIComponent(trackId)}`;
      } else if (lower.includes("bluedart")) {
        autoUrl = `https://www.bluedart.com/tracking?handler=t&action=custtracking&pin=${encodeURIComponent(trackId)}`;
      } else if (lower.includes("dtdc")) {
        autoUrl = `https://www.dtdc.in/tracking/shipment-tracking.asp?strCnno=${encodeURIComponent(trackId)}`;
      } else if (lower.includes("post") || lower.includes("speed")) {
        autoUrl = `https://www.indiapost.gov.in/_layouts/15/dpt.cpt.trackconsignment/trackconsignment.aspx`;
      } else {
        autoUrl = `https://shiprocket.co/tracking/${encodeURIComponent(trackId)}`;
      }
    }

    const todayDateStr = new Date().toISOString().slice(0, 10);
    const updated = orders.map((o) => {
      if (o.id === manualDispatchModalOrder.id) {
        return {
          ...o,
          status: "Shipped",
          courierName: courier,
          awbCode: trackId,
          trackingUrl: autoUrl,
          pickupScheduledAt: todayDateStr,
          dispatchMode: "manual"
        };
      }
      return o;
    });

    setOrders(updated);
    STORE.setOrders(updated);

    // Sync to Supabase in background
    try {
      fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: manualDispatchModalOrder.id,
          updates: {
            status: "Shipped",
            notes: `Dispatched via ${courier} (Ref/AWB: ${trackId}). Tracking: ${autoUrl}`
          }
        })
      });
    } catch (e) {}

    // Dispatch status update email to customer
    const updatedOrder = updated.find((o) => o.id === manualDispatchModalOrder.id);
    if (updatedOrder) {
      try {
        STORE.dispatchEmailNotification("order_status_update", {
          order: updatedOrder,
          newStatus: "Shipped"
        });
      } catch (e) {}
    }

    triggerToast(`✓ Order ${manualDispatchModalOrder.id} dispatched via ${courier}! Tracking ID: ${trackId}`);
    setManualDispatchModalOrder(null);
  };

  // CUSTOMIZATION ACTIONS
  const updateCustomizationStatus = async (id, newStatus) => {
    const updated = customizations.map((c) => (c.id === id ? { ...c, status: newStatus } : c));
    setCustomizations(updated);
    STORE.setCustomizations(updated);
    triggerToast(`Custom inquiry status updated to "${newStatus}"`);
    try {
      await fetch("/api/admin/customizations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiryId: id, updates: { status: newStatus } })
      });
    } catch (e) {}
  };

  // PRODUCT LAUNCH BROADCAST
  const broadcastProductLaunch = async (prod) => {
    setIsBroadcastingEmail(true);
    triggerToast(`Dispatching product launch announcement to all patrons...`);
    const recipients = STORE.getAllCustomerEmails();
    try {
      const res = await STORE.dispatchEmailNotification("product_launch", {
        product: prod,
        recipients: recipients
      });
      if (res?.success) {
        triggerToast(`Launch email with direct product link sent to ${res.result?.count || recipients.length} customers & admin!`);
      } else {
        triggerToast(`Launch broadcast complete!`);
      }
    } catch (err) {
      console.error(err);
      triggerToast("Error dispatching product launch email.");
    } finally {
      setIsBroadcastingEmail(false);
    }
  };

  // PRODUCT ACTIONS
  const saveProduct = async (productData, shouldBroadcast = false) => {
    let updated;
    let savedProd;
    const isNew = !productData.id;
    if (productData.id) {
      savedProd = productData;
      updated = products.map((p) => (p.id === productData.id ? productData : p));
      triggerToast(`Product "${productData.name}" updated successfully!`);
    } else {
      const newId = Math.max(0, ...products.map((p) => p.id)) + 1;
      savedProd = { ...productData, id: newId };
      updated = [savedProd, ...products];
      triggerToast(`New product "${savedProd.name}" created!`);
    }
    setProducts(updated);
    STORE.setProducts(updated);
    setEditingProduct(null);

    // If new product and broadcast checkbox enabled, or manually requested
    if ((isNew && broadcastLaunchChecked) || shouldBroadcast) {
      await broadcastProductLaunch(savedProd);
    }
  };

  const deleteProduct = (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      STORE.setProducts(updated);
      triggerToast("Product removed from shop.");
    }
  };

  // PROMOTIONAL OFFER BROADCAST
  const broadcastOffer = async (offerData) => {
    setIsBroadcastingEmail(true);
    triggerToast(`Broadcasting promotional offer email to all patrons...`);
    const recipients = STORE.getAllCustomerEmails();
    try {
      const res = await STORE.dispatchEmailNotification("offer_broadcast", {
        offer: offerData,
        recipients: recipients
      });
      if (res?.success) {
        triggerToast(`Offer announcement sent to ${res.result?.count || recipients.length} customers & admin!`);
      } else {
        triggerToast(`Offer announcement complete!`);
      }
    } catch (err) {
      console.error(err);
      triggerToast("Error dispatching offer email.");
    } finally {
      setIsBroadcastingEmail(false);
    }
  };

  const saveOffer = async (offerData, sendBroadcast = true) => {
    if (!offerData.title) {
      triggerToast("Please enter an offer title");
      return;
    }
    const newOffer = {
      ...offerData,
      id: offerData.id || "OFFER-" + Date.now(),
      date: new Date().toISOString()
    };
    const updated = STORE.addOffer(newOffer);
    setOffers(updated);
    triggerToast(`Offer "${newOffer.title}" saved successfully!`);
    if (sendBroadcast) {
      await broadcastOffer(newOffer);
    }
    setNewOfferForm({
      title: "",
      badge: "Special Studio Offer",
      description: "",
      couponCode: "",
      link: "/#p4-treasures"
    });
  };

  const deleteOffer = (id) => {
    if (confirm("Delete this promotional offer?")) {
      const updated = offers.filter((o) => o.id !== id);
      setOffers(updated);
      STORE.setOffers(updated);
      triggerToast("Offer removed.");
    }
  };

  // CATEGORY ACTIONS
  const saveCategory = (catData) => {
    let updated;
    const exists = categories.some((c) => c.id === catData.id);
    if (exists) {
      updated = categories.map((c) => (c.id === catData.id ? catData : c));
      triggerToast(`Category "${catData.name}" updated!`);
    } else {
      updated = [...categories, catData];
      triggerToast(`New category "${catData.name}" added!`);
    }
    setCategories(updated);
    STORE.setCategories(updated);
    setEditingCategory(null);
  };

  const deleteCategory = (id) => {
    if (confirm("Delete this category?")) {
      const updated = categories.filter((c) => c.id !== id);
      setCategories(updated);
      STORE.setCategories(updated);
      triggerToast("Category deleted.");
    }
  };

  // TICKER ACTIONS (WITHOUT EMOJIS)
  const addTickerItem = () => {
    if (!newTickerText.trim()) return;
    // Clean emojis if user mistakenly pastes one
    const cleanText = newTickerText.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
    const updated = [...tickerList, cleanText];
    setTickerList(updated);
    STORE.setTicker(updated);
    setNewTickerText("");
    triggerToast("New announcement message added to top bar!");
  };

  const removeTickerItem = (idx) => {
    const updated = tickerList.filter((_, i) => i !== idx);
    setTickerList(updated);
    STORE.setTicker(updated);
    triggerToast("Announcement message removed.");
  };

  // HERO CARDS ACTIONS
  const saveHeroCard = (cardData) => {
    const updated = heroCards.map((c) => (c.id === cardData.id ? cardData : c));
    setHeroCards(updated);
    STORE.setHeroCards(updated);
    setEditingHeroCard(null);
    triggerToast("Hero showcase image & text updated!");
  };

  // BESTSELLER ACTIONS
  const updateBestseller = (idx, newProdId) => {
    const foundProd = products.find((p) => p.id === Number(newProdId));
    if (!foundProd) return;
    const updated = [...bestsellers];
    updated[idx] = {
      ...updated[idx],
      id: foundProd.id,
      title: foundProd.name,
      price: foundProd.price,
      originalPrice: foundProd.originalPrice,
      imgUrl: foundProd.imgUrl,
      desc: foundProd.desc
    };
    setBestsellers(updated);
    STORE.setBestsellers(updated);
    triggerToast(`Bestseller slot ${idx + 1} updated to "${foundProd.name}"!`);
  };

  // COUPON & DISCOUNT ENGINE ACTIONS
  const handleOpenAddCoupon = () => {
    setEditingCoupon(null);
    setCouponForm({
      id: "",
      code: "",
      title: "",
      type: "percentage",
      discountPercent: 15,
      discountAmount: 100,
      bogoBuyQty: 1,
      bogoFreeQty: 1,
      minOrderValue: 0,
      maxDiscount: 0,
      isActive: true
    });
    setIsCouponModalOpen(true);
  };

  const handleEditCoupon = (cpn) => {
    setEditingCoupon(cpn);
    setCouponForm({
      id: cpn.id,
      code: cpn.code,
      title: cpn.title || "",
      type: cpn.type || "percentage",
      discountPercent: cpn.discountPercent || 15,
      discountAmount: cpn.discountAmount || 100,
      bogoBuyQty: cpn.bogoBuyQty || 1,
      bogoFreeQty: cpn.bogoFreeQty || 1,
      minOrderValue: cpn.minOrderValue || 0,
      maxDiscount: cpn.maxDiscount || 0,
      isActive: cpn.isActive !== false
    });
    setIsCouponModalOpen(true);
  };

  const handleSaveCoupon = (e) => {
    if (e) e.preventDefault();
    const cleanCode = (couponForm.code || "").trim().toUpperCase();
    if (!cleanCode) {
      triggerToast("Please enter a valid coupon code");
      return;
    }

    const updated = STORE.addCoupon({
      ...couponForm,
      code: cleanCode,
      title: couponForm.title.trim() || `${cleanCode} Special Discount`,
      discountPercent: Number(couponForm.discountPercent) || 0,
      discountAmount: Number(couponForm.discountAmount) || 0,
      bogoBuyQty: Number(couponForm.bogoBuyQty) || 1,
      bogoFreeQty: Number(couponForm.bogoFreeQty) || 1,
      minOrderValue: Number(couponForm.minOrderValue) || 0,
      maxDiscount: Number(couponForm.maxDiscount) || 0
    });

    setCoupons(updated);
    setIsCouponModalOpen(false);
    triggerToast(`✓ Coupon "${cleanCode}" saved and published!`);
  };

  const handleDeleteCoupon = (id, code) => {
    if (confirm(`Are you sure you want to delete coupon ${code}?`)) {
      const updated = STORE.deleteCoupon(id);
      setCoupons(updated);
      triggerToast(`Coupon ${code} removed.`);
    }
  };

  const handleToggleCoupon = (id) => {
    const updated = STORE.toggleCoupon(id);
    setCoupons(updated);
    triggerToast("Coupon active status updated.");
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 text-xs font-serif text-stone-500">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin"></div>
          <span>Verifying Studio Access...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#2C2623] font-sans antialiased flex flex-col">
      
      {/* 1. TOP ADMIN BAR */}
      <header className="bg-[#221F1F] text-white border-b border-stone-800 sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2.5">
                <span className="font-header font-light text-2xl tracking-[0.25em] uppercase text-white">
                  COCOON
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-black uppercase tracking-wider border border-rose-500/30">
                  Studio Admin
                </span>
              </div>
              <p className="text-[11px] text-stone-400">Store Manager & Operations</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/918171902255"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30 transition"
              title="Official Studio Phone"
            >
              <span>WhatsApp: +91 8171902255</span>
            </a>

            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-800 text-stone-300 text-xs border border-stone-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>cocoon.by.mehak@gmail.com</span>
            </div>

            {dbStatus === "connected" ? (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold" title="Supabase Database is active and syncing across devices">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>DB Live & Synced</span>
              </div>
            ) : (
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/30 transition cursor-pointer"
                title="Supabase project is paused on free tier. Click to restore project on Supabase dashboard for multi-device sync."
              >
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Cloud DB Paused (Unpause) ↗</span>
              </a>
            )}
            <button
              onClick={handleAdminLogout}
              className="px-3.5 py-1.5 rounded-full bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white border border-rose-500/30 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
            >
              Sign Out
            </button>
            <Link
              href="/"
              className="px-4 py-2 rounded-full bg-white text-[#221F1F] hover:bg-rose-50 hover:text-rose-600 text-xs font-bold uppercase tracking-wider transition shadow-sm"
            >
              View Live Storefront &rarr;
            </Link>
          </div>

        </div>
      </header>

      {/* 2. ADMIN NAVIGATION TABS */}
      <div className="bg-white border-b border-[#E8DFC9] px-6 sticky top-[69px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-none text-xs font-bold uppercase tracking-wider">
          {[
            { id: "dashboard", label: "Dashboard & Analytics", icon: "" },
            { id: "orders", label: `Orders (${orders.length})`, icon: "" },
            { id: "coupons", label: `Coupons & BOGO (${coupons.length})`, icon: "🏷️" },
            { id: "reviews", label: `Reviews (${reviews.length})`, icon: "⭐" },
            { id: "customizations", label: `Custom Slips (${customizations.length})`, icon: "" },
            { id: "products", label: `Products (${products.length})`, icon: "" },
            { id: "categories", label: `Categories (${categories.length})`, icon: "" },
            { id: "bestsellers", label: "Top 3 Bestsellers", icon: "⭐" },
            { id: "hero", label: "Hero Collage (3 Images)", icon: "" },
            { id: "ticker", label: "Top Ticker Bar", icon: "" },
            { id: "offers", label: `Offers & Broadcasts (${offers.length})`, icon: "" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#B06B5B] text-white shadow-xs"
                  : "text-[#2C2623]/70 hover:bg-[#FAF4ED] hover:text-[#2C2623]"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CASH ON DELIVERY (COD) MASTER CONTROL BANNER */}
      <div className="bg-[#FAF5ED] border-b border-[#E8DFC9] px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#2C2623] uppercase tracking-wider text-[11px] font-sans">
              Store Payment Mode:
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              isCodEnabled 
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : "bg-rose-100 text-rose-800 border border-rose-300"
            }`}>
              <span className={`w-2 h-2 rounded-full ${isCodEnabled ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}></span>
              <span>{isCodEnabled ? "COD (Cash on Delivery) is ON" : "COD is OFF (Direct UPI Only)"}</span>
            </span>
            <span className="text-[11px] text-stone-500 hidden lg:inline">
              {isCodEnabled ? "Buyers can choose Cash on Delivery or Direct UPI (8171902255@ibl) at checkout." : "Checkout strictly requires Direct UPI Payment (8171902255@ibl)."}
            </span>
          </div>

          <button
            onClick={handleToggleCod}
            className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-xs cursor-pointer flex items-center gap-2 self-start sm:self-auto ${
              isCodEnabled
                ? "bg-rose-600 hover:bg-rose-700 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            <span>{isCodEnabled ? "Turn COD OFF (Direct UPI Only)" : "Turn COD ON (Enable Cash on Delivery)"}</span>
          </button>
        </div>
      </div>

      {/* 3. MAIN CONTENT CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        
        {/* ================= TAB 1: DASHBOARD & LIVE ORDER STATS ================= */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fadeIn text-left">
            <div>
              <h2 className="text-2xl font-header font-bold text-[#2C2623]">Store Overview & Today's Pulse</h2>
              <p className="text-xs text-[#2C2623]/60">Track today's orders, pending shipments, delivered heirlooms and revenue.</p>
            </div>

            {/* 5 KEY STAT CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              
              <div className="bg-white p-5 rounded-2xl border border-[#E8DFC9] shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">Today's Orders</span>
                <p className="text-3xl font-extrabold text-[#2C2623] mt-1">{todayOrders.length}</p>
                <p className="text-[11px] text-stone-500 mt-1">Orders placed today</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E8DFC9] shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">Under Process</span>
                <p className="text-3xl font-extrabold text-amber-600 mt-1">{processingOrders.length}</p>
                <p className="text-[11px] text-stone-500 mt-1">Need crafting & packing</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E8DFC9] shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">Out for Delivery</span>
                <p className="text-3xl font-extrabold text-blue-600 mt-1">{shippedOrders.length}</p>
                <p className="text-[11px] text-stone-500 mt-1">Dispatched with courier</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E8DFC9] shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Delivered</span>
                <p className="text-3xl font-extrabold text-emerald-600 mt-1">{deliveredOrders.length}</p>
                <p className="text-[11px] text-stone-500 mt-1">Successfully fulfilled</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E8DFC9] shadow-xs col-span-2 lg:col-span-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B06B5B] block">Total Revenue</span>
                <p className="text-2xl font-extrabold text-[#2C2623] mt-1">Rs. {totalRevenue.toLocaleString()}</p>
                <p className="text-[11px] text-stone-500 mt-1">{orders.length} total lifetime orders</p>
              </div>

            </div>

            {/* QUICK ACTIONS & RECENT ORDERS PREVIEW */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-[#E8DFC9] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#FAF4ED] pb-3">
                  <h3 className="font-header font-bold text-lg text-[#2C2623]">Recent Orders</h3>
                  <button onClick={() => setActiveTab("orders")} className="text-xs font-bold text-[#B06B5B] hover:underline">
                    View All ({orders.length}) &rarr;
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="py-8 text-center text-xs text-stone-400 font-serif">
                    No customer orders recorded yet. When buyers place orders on the website, they will appear here.
                  </div>
                ) : (
                  <div className="divide-y divide-stone-100">
                    {orders.slice(0, 4).map((order) => (
                      <div key={order.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#2C2623]">{order.id}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              order.status === "Delivered" ? "bg-emerald-100 text-emerald-700" :
                              order.status === "Shipped" ? "bg-blue-100 text-blue-700" :
                              order.status === "Processing" ? "bg-amber-100 text-amber-700" : "bg-stone-100 text-stone-700"
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 mt-0.5">{order.customerName} • {order.customerPhone}</p>
                          <p className="text-[11px] text-stone-400">{order.items.map(i => `${i.name} (${i.quantity})`).join(", ")}</p>
                        </div>

                        <div className="text-right flex sm:flex-col items-center sm:items-end justify-between gap-1">
                          <span className="font-bold text-sm text-[#2C2623]">Rs. {order.totalAmount}</span>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="text-[11px] bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 focus:outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* STUDIO WHATSAPP DISPATCH CARD */}
              <div className="lg:col-span-4 bg-[#FAF5EE] rounded-3xl p-6 border-2 border-dashed border-[#DDD3C4] space-y-4">
                <div className="flex items-center gap-2 text-[#526B57]">
                  
                  <h4 className="font-header font-bold text-base text-[#2C2623]">Studio WhatsApp Link</h4>
                </div>
                <p className="text-xs text-[#2C2623]/70 leading-relaxed">
                  All customer orders and custom heirloom requests trigger automatic structured notification alerts to Mehak's phone:
                </p>
                <div className="p-3 bg-white rounded-xl border border-[#EAE0D2] font-mono text-xs font-bold text-emerald-800 text-center">
                  +91 8171902255
                </div>
                <a
                  href="https://wa.me/918171902255"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-[#526B57] hover:bg-[#405444] text-white text-xs font-bold uppercase tracking-wider transition block text-center shadow-xs"
                >
                  Open Studio WhatsApp
                </a>
              </div>

            </div>
          </div>
        )}

        {/* ================= TAB 2: ORDERS MANAGER ================= */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-fadeIn text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFC9] pb-4">
              <div>
                <h2 className="text-2xl font-header font-bold text-[#2C2623]">Orders Fulfillment Center</h2>
                <p className="text-xs text-[#2C2623]/60">Manage order statuses: Pending &rarr; Processing &rarr; Shipped &rarr; Delivered</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#E8DFC9] shadow-xs overflow-hidden">
              {/* Order Verification & Status Checklist Filter Bar */}
              <div className="flex flex-wrap items-center gap-2 p-3.5 bg-[#FAF7F2] border-b border-[#E8DFC9]">
                <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider mr-1">Checklist Filter:</span>
                <button
                  onClick={() => setOrderFilter("all")}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                    orderFilter === "all" ? "bg-[#2C2623] text-white shadow-2xs" : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
                  }`}
                >
                  All ({orders.length})
                </button>
                <button
                  onClick={() => setOrderFilter("needs_verification")}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    orderFilter === "needs_verification" 
                      ? "bg-amber-600 text-white shadow-2xs" 
                      : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
                  }`}
                >
                  <span>⏳ Needs Verification</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    orderFilter === "needs_verification" ? "bg-amber-800 text-white" : "bg-amber-200 text-amber-900"
                  }`}>
                    {orders.filter((o) => o.paymentMethod === "UPI" && !o.paymentVerified).length}
                  </span>
                </button>
                <button
                  onClick={() => setOrderFilter("verified")}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    orderFilter === "verified" 
                      ? "bg-emerald-700 text-white shadow-2xs" 
                      : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                  }`}
                >
                  <span>✓ Verified</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    orderFilter === "verified" ? "bg-emerald-900 text-white" : "bg-emerald-200 text-emerald-900"
                  }`}>
                    {orders.filter((o) => o.paymentVerified).length}
                  </span>
                </button>
                <button
                  onClick={() => setOrderFilter("upi")}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                    orderFilter === "upi" ? "bg-[#B06B5B] text-white shadow-2xs" : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
                  }`}
                >
                  ⚡ Direct UPI ({orders.filter((o) => o.paymentMethod === "UPI").length})
                </button>
                <button
                  onClick={() => setOrderFilter("cod")}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                    orderFilter === "cod" ? "bg-stone-700 text-white shadow-2xs" : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
                  }`}
                >
                  📦 COD ({orders.filter((o) => o.paymentMethod === "COD").length})
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-16 px-4 space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-stone-100 flex items-center justify-center shadow-xs text-stone-400"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg></div>
                  <h3 className="font-header font-bold text-lg text-stone-800">No Orders in Atelier Yet</h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto font-serif leading-relaxed">
                    When buyers place orders on the website, they will appear here with customer contact details, ordered items, and WhatsApp tracking.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] text-[#2C2623]/70 uppercase tracking-wider font-bold border-b border-[#E8DFC9]">
                    <tr>
                      <th className="p-4">Order ID & Date</th>
                      <th className="p-4">Customer Details</th>
                      <th className="p-4">Items Ordered</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Payment & UTR Verification</th>
                      <th className="p-4 min-w-[210px]">Fulfillment & Courier</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders
                      .filter((o) => {
                        if (orderFilter === "needs_verification") return o.paymentMethod === "UPI" && !o.paymentVerified;
                        if (orderFilter === "verified") return !!o.paymentVerified;
                        if (orderFilter === "upi") return o.paymentMethod === "UPI";
                        if (orderFilter === "cod") return o.paymentMethod === "COD";
                        return true;
                      })
                      .map((order) => (
                      <tr key={order.id} className="hover:bg-stone-50/60 transition">
                        <td className="p-4 align-top">
                          <p className="font-bold text-[#2C2623]">{order.id}</p>
                          <p className="text-[10px] text-stone-400 mt-0.5">
                            {new Date(order.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </td>

                        <td className="p-4 align-top">
                          <p className="font-bold text-[#2C2623]">{order.customerName}</p>
                          <p className="text-stone-600 font-mono text-[11px]">{order.customerPhone}</p>
                          <p className="text-[11px] text-stone-400 truncate max-w-xs">{order.address}</p>
                          {order.notes && <p className="text-[10px] text-amber-800 bg-amber-50/80 p-1 rounded mt-1 border border-amber-200/60">Note: {order.notes}</p>}
                        </td>

                        <td className="p-4 align-top">
                          <div className="space-y-1">
                            {order.items.map((it, idx) => (
                              <p key={idx} className="text-stone-700">
                                • {it.name} <span className="font-bold">x{it.quantity}</span> ({it.color})
                              </p>
                            ))}
                          </div>
                        </td>

                        <td className="p-4 align-top font-bold text-sm text-[#2C2623]">
                          ₹{order.totalAmount}
                        </td>

                        {/* Payment & UTR Verification Column */}
                        <td className="p-4 align-top min-w-[170px]">
                          {order.paymentMethod === "UPI" ? (
                            <div className="space-y-2">
                              <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-purple-100 text-purple-900 border border-purple-200">
                                ⚡ Direct UPI (8171902255@ibl)
                              </span>

                              {/* UTR Reference Box */}
                              <div className="bg-[#FAF7F2] p-1.5 rounded-lg border border-[#E8DFC9] text-[11px]">
                                <span className="text-[9px] text-stone-500 font-semibold block uppercase tracking-wider">UTR / Ref:</span>
                                {order.utr ? (
                                  <span className="font-mono font-bold text-stone-900 select-all tracking-wider">
                                    {order.utr}
                                  </span>
                                ) : (
                                  <span className="text-amber-700 italic text-[10px]">Not entered by buyer</span>
                                )}
                              </div>

                              {/* 1-Click Verification Toggle Button / Badge */}
                              {order.paymentVerified ? (
                                <div className="flex items-center justify-between gap-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                                  <span className="text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                                    <span>✓</span>
                                    <span>Payment Verified</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => togglePaymentVerification(order.id)}
                                    className="text-[9px] text-stone-400 hover:text-stone-700 underline cursor-pointer"
                                    title="Mark unverified"
                                  >
                                    Undo
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => togglePaymentVerification(order.id)}
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-[10px] font-bold uppercase tracking-wider transition shadow-2xs hover:shadow-xs active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <span>✓ Verify Payment</span>
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200">
                                📦 Cash on Delivery
                              </span>

                              {order.paymentVerified ? (
                                <div className="flex items-center justify-between gap-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                                  <span className="text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                                    <span>✓</span>
                                    <span>Cash Collected</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => togglePaymentVerification(order.id)}
                                    className="text-[9px] text-stone-400 hover:text-stone-700 underline cursor-pointer"
                                  >
                                    Undo
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => togglePaymentVerification(order.id)}
                                  className="w-full px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-semibold transition border border-stone-300 cursor-pointer"
                                >
                                  Mark Collected
                                </button>
                              )}
                            </div>
                          )}
                        </td>

                        <td className="p-4 align-top min-w-[210px]">
                          <div className="space-y-2">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className={`w-full text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                                order.status === "Delivered" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                order.status === "Shipped" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                order.status === "Processing" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                "bg-stone-50 text-stone-700 border-stone-200"
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing (Crafting)</option>
                              <option value="Shipped">Shipped (In Transit)</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>

                            {/* Courier Dispatch Section: Shiprocket or Porter/Manual */}
                            {order.awbCode ? (
                              <div className="bg-blue-50/80 p-2.5 rounded-xl border border-blue-200 text-[11px] space-y-1.5 shadow-2xs">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-bold text-blue-950 truncate flex items-center gap-1">
                                    <span>🚚</span>
                                    <span>{order.courierName || "Express Courier"}</span>
                                  </span>
                                  <span className="text-[9px] bg-blue-200/80 text-blue-900 px-1.5 py-0.5 rounded font-mono font-bold shrink-0">
                                    {order.dispatchMode === "manual" ? "Self / Porter" : "Shiprocket"}
                                  </span>
                                </div>
                                <div className="font-mono text-[10px] text-blue-900 font-semibold select-all bg-white/80 px-1.5 py-0.5 rounded border border-blue-100 flex items-center justify-between">
                                  <span>ID: {order.awbCode}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenManualDispatch(order)}
                                    className="text-[9px] text-[#B06B5B] hover:underline font-sans font-bold cursor-pointer ml-1"
                                    title="Edit tracking ID or Courier"
                                  >
                                    Edit
                                  </button>
                                </div>
                                {order.pickupScheduledAt && (
                                  <div className="text-[10px] text-stone-600">
                                    Dispatched: <strong className="text-stone-800">{order.pickupScheduledAt}</strong>
                                  </div>
                                )}
                                <div className="pt-0.5 flex flex-wrap items-center gap-1.5">
                                  <a
                                    href={order.trackingUrl || `https://shiprocket.co/tracking/${order.awbCode}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold shadow-2xs"
                                  >
                                    📍 Track
                                  </a>
                                  <a
                                    href={`/cart?viewInvoice=${encodeURIComponent(order.id)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-2 py-1 rounded-lg bg-white hover:bg-stone-100 text-stone-700 text-[10px] font-bold border border-stone-200 shadow-2xs"
                                  >
                                    🖨️ Label
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1.5">
                                {/* Option 1: 1-Click Shiprocket Courier */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenCourierModal(order)}
                                  className="w-full px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#B06B5B] to-[#964B44] hover:opacity-95 text-white text-[10px] font-bold uppercase tracking-wider shadow-2xs hover:shadow-xs transition flex items-center justify-center gap-1 cursor-pointer"
                                  title="Schedule automated Shiprocket courier pickup"
                                >
                                  <span>⚡ Shiprocket (1-Click)</span>
                                </button>

                                {/* Option 2: Self / Porter / Local Courier */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenManualDispatch(order)}
                                  className="w-full px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#2C2623] border border-[#DDD3C4] hover:border-[#B06B5B] text-[10px] font-bold uppercase tracking-wider shadow-2xs transition flex items-center justify-center gap-1 cursor-pointer"
                                  title="Assign Porter or any local courier tracking ID"
                                >
                                  <span>🛵 Porter / Self Dispatch</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="p-4 align-top text-right space-y-1.5 min-w-[130px]">
                          {order.awbCode && (
                            <a
                              href={`https://wa.me/91${order.customerPhone}?text=${encodeURIComponent(`Hi ${order.customerName}! Your COCOON handcrafted order #${order.id} has been dispatched via ${order.courierName || 'Express Courier'}! 🚚 Track live parcel: ${order.trackingUrl || `https://shiprocket.co/tracking/${order.awbCode}`}`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-block px-2.5 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 text-[10px] font-bold w-full text-center"
                            >
                              📲 WhatsApp AWB
                            </a>
                          )}
                          <a
                            href={`https://wa.me/91${order.customerPhone}?text=${encodeURIComponent(`Hi ${order.customerName}! This is Mehak from Cocoon regarding your order ${order.id}. Current status: ${order.status}.`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block px-3 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-bold w-full text-center"
                          >
                            Chat Customer
                          </a>
                          <button
                            type="button"
                            onClick={() => STORE.sendWhatsAppNotification("order", order)}
                            className="text-[10px] text-stone-500 hover:text-stone-800 underline cursor-pointer block text-right w-full"
                          >
                            Send Alert to 8171902255
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 3: CUSTOMIZATION / INQUIRIES ================= */}
        {activeTab === "customizations" && (
          <div className="space-y-6 animate-fadeIn text-left">
            <div>
              <h2 className="text-2xl font-header font-bold text-[#2C2623]">Custom Heirloom Inquiries</h2>
              <p className="text-xs text-[#2C2623]/60">Customer requests submitted via the "Design Your Custom Piece" atelier form.</p>
            </div>

            {customizations.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-3 bg-white rounded-3xl border border-[#E8DFC9] shadow-xs">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF0ED] text-[#B06B5B] flex items-center justify-center shadow-xs"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></div>
                <h3 className="font-header font-bold text-lg text-stone-800">No Custom Slips Yet</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto font-serif leading-relaxed">
                  When customers submit bespoke heirloom requests with their design ideas, attached photos/videos, or Instagram reel links, they will be listed here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {customizations.map((c) => (
                <div key={c.id} className="bg-white rounded-3xl p-6 border border-[#E8DFC9] shadow-xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-[#FAF4ED] pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#B06B5B] block">{c.id}</span>
                        <h3 className="font-header font-bold text-lg text-[#2C2623]">{c.productName || c.category}</h3>
                      </div>
                      <select
                        value={c.status}
                        onChange={(e) => updateCustomizationStatus(c.id, e.target.value)}
                        className="text-xs font-bold px-3 py-1 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><strong className="text-stone-500">Customer:</strong> {c.name}</div>
                      <div><strong className="text-stone-500">Phone:</strong> {c.phone}</div>
                      {c.email && <div className="col-span-2"><strong className="text-stone-500">Email:</strong> {c.email}</div>}
                      <div className="col-span-2"><strong className="text-stone-500">Color Preference:</strong> {c.colorway || "Flexible"}</div>
                      {c.neededBy && <div><strong className="text-stone-500">Needed By:</strong> {c.neededBy}</div>}
                      {c.budget && <div><strong className="text-stone-500">Budget:</strong> {c.budget}</div>}
                    </div>

                    {c.idea && (
                      <div className="p-3 bg-[#FAF7F2] rounded-xl text-xs text-[#2C2623]/80 border border-[#EAE0D2]">
                        <strong className="block text-[10px] uppercase font-bold text-[#B06B5B] mb-1">Customer's Design Idea:</strong>
                        <p className="leading-relaxed">{c.idea}</p>
                      </div>
                    )}

                    {/* Media / Link previews */}
                    <div className="space-y-1.5 pt-1">
                      {c.mediaName && (
                        <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                          <span>Attached File:</span>
                          <span className="underline">{c.mediaName}</span>
                        </p>
                      )}
                      {c.mediaUrl && (
                        <div className="mt-2 rounded-xl overflow-hidden border border-stone-200 bg-stone-50 max-h-48 flex items-center justify-center">
                          {c.mediaType === "video" || (c.mediaName && c.mediaName.match(/\.(mp4|mov|webm)$/i)) ? (
                            <video src={c.mediaUrl} controls className="max-h-48 w-full object-contain" />
                          ) : (
                            <a href={c.mediaUrl} target="_blank" rel="noreferrer" className="block w-full">
                              <img src={c.mediaUrl} alt="Customer upload preview" className="max-h-48 w-full object-cover hover:opacity-90 transition" />
                            </a>
                          )}
                        </div>
                      )}
                      {c.socialLink && (
                        <p className="text-xs text-blue-600 truncate flex items-center gap-1.5">
                          <span>Reel / Pin Link:</span>
                          <a href={c.socialLink} target="_blank" rel="noreferrer" className="underline font-bold">
                            {c.socialLink}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#FAF4ED] flex items-center justify-between gap-3">
                    <a
                      href={`https://wa.me/91${c.phone}?text=${encodeURIComponent(`Hi ${c.name}! This is Mehak from Cocoon Studio regarding your custom inquiry for "${c.productName}". Let's discuss your yarn colors and size!`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1"
                    >
                      <span>Reply on WhatsApp</span>
                    </a>

                    <button
                      onClick={() => STORE.sendWhatsAppNotification("customization", c)}
                      className="text-xs text-stone-500 hover:text-stone-800 underline"
                    >
                      Send Alert to 8171902255
                    </button>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: PRODUCTS & PRICING ================= */}
        {activeTab === "products" && (
          <div className="space-y-6 animate-fadeIn text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFC9] pb-4">
              <div>
                <h2 className="text-2xl font-header font-bold text-[#2C2623]">Products & Inventory Catalog</h2>
                <p className="text-xs text-[#2C2623]/60">Add new handcrafted drops, edit prices, descriptions, and categories.</p>
              </div>
              <button
                onClick={() => setEditingProduct({
                  id: null,
                  name: "",
                  category: "bags",
                  subcategory: "totes-handbags",
                  price: 799,
                  originalPrice: 1199,
                  imgUrl: "/products/items/chocolate-bow-handbag.jpg",
                  badge: "New Drop",
                  desc: "Handcrafted pure milk cotton piece with reinforced artisan stitchwork.",
                  materials: "100% Milk Cotton Yarn",
                  colors: ["Pastel Rose", "Vanilla Cream"]
                })}
                className="px-4 py-2 rounded-xl bg-[#B06B5B] hover:bg-[#975647] text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-xs"
              >
                + Add New Product
              </button>
            </div>

            {/* PRODUCT GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl p-4 border border-[#E8DFC9] shadow-xs flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-100">
                      <img src={p.imgUrl} alt={p.name} className="w-full h-full object-cover" />
                      {p.badge && (
                        <span className="absolute top-2 left-2 bg-[#F8E5E1] text-[#7A3F34] text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border border-[#ECCEC7]">
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold uppercase text-[#B06B5B] tracking-wider block">
                      {p.category}
                    </span>
                    <h4 className="font-header font-bold text-sm text-[#2C2623] truncate" title={p.name}>
                      {p.name}
                    </h4>
                    <p className="text-[11px] text-stone-500 line-clamp-2">{p.desc}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="font-bold text-sm text-[#2C2623]">Rs. {p.price}</span>
                      {p.originalPrice > p.price && (
                        <span className="text-xs text-stone-400 line-through">Rs. {p.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
                    <button
                      onClick={() => broadcastProductLaunch(p)}
                      disabled={isBroadcastingEmail}
                      className="w-full py-1.5 rounded-lg bg-rose-50 hover:bg-[#FAF0ED] text-[#B06B5B] border border-rose-200 text-[11px] font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5"
                      title="Send product announcement email to all patrons"
                    >
                      <span>Broadcast via Email</span>
                    </button>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-[#FAF0ED] hover:text-[#B06B5B] text-xs font-bold transition cursor-pointer"
                      >
                        Edit Product
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-bold transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: CATEGORIES MANAGER ================= */}
        {activeTab === "categories" && (
          <div className="space-y-6 animate-fadeIn text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFC9] pb-4">
              <div>
                <h2 className="text-2xl font-header font-bold text-[#2C2623]">Store Categories Manager</h2>
                <p className="text-xs text-[#2C2623]/60">Create new departments, set minimum starting prices, and update cover photos.</p>
              </div>
              <button
                onClick={() => setEditingCategory({ id: "", name: "", itemCount: 0, minPrice: 299, imgUrl: "/products/items/sunflower-granny-backpack.jpg" })}
                className="px-4 py-2 rounded-xl bg-[#B06B5B] hover:bg-[#975647] text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-xs"
              >
                + Add New Category
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-white rounded-3xl p-5 border border-[#E8DFC9] shadow-xs flex items-center justify-between gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-[#EAE0D2]">
                    <img src={cat.imgUrl} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-header font-bold text-base text-[#2C2623] truncate">{cat.name}</h4>
                    <p className="text-xs text-stone-500">{cat.itemCount} Items Listed</p>
                    <p className="text-xs font-bold text-[#B06B5B] mt-0.5">From Rs. {cat.minPrice}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => setEditingCategory(cat)} className="text-xs font-bold text-stone-700 hover:text-[#B06B5B] underline">
                        Edit
                      </button>
                      <span className="text-stone-300">•</span>
                      <button onClick={() => deleteCategory(cat.id)} className="text-xs font-bold text-rose-600 hover:text-rose-800 underline">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 6: BESTSELLERS LOOKBOOK ATELIER ================= */}
        {activeTab === "bestsellers" && (
          <div className="space-y-6 animate-fadeIn text-left">
            <div>
              <h2 className="text-2xl font-header font-bold text-[#2C2623]">Lookbook Atelier: Top 3 Bestsellers</h2>
              <p className="text-xs text-[#2C2623]/60">Select which 3 pieces are featured in the luxury Lookbook section on the home page.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {bestsellers.map((item, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-5 border border-[#E8DFC9] shadow-xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100">
                      <img src={item.imgUrl} alt={item.title} className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 bg-white/95 px-3 py-1 rounded-full text-[10px] font-bold text-[#B06B5B] uppercase">
                        Slot {idx + 1}: {item.rank}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#B06B5B] tracking-wider block">{item.tag}</span>
                      <h4 className="font-header font-bold text-base text-[#2C2623]">{item.title}</h4>
                      <p className="text-xs font-bold text-[#2C2623] mt-1">Rs. {item.price}</p>
                      <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">{item.desc}</p>
                    </div>
                  </div>

                  {/* Switch Product Dropdown */}
                  <div className="pt-3 border-t border-stone-100">
                    <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">
                      Replace with different product:
                    </label>
                    <select
                      value={item.id}
                      onChange={(e) => updateBestseller(idx, e.target.value)}
                      className="w-full text-xs font-bold bg-stone-50 border border-stone-200 rounded-xl p-2 focus:outline-none cursor-pointer"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (Rs. {p.price})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 7: HERO COLLAGE 3 IMAGES ================= */}
        {activeTab === "hero" && (
          <div className="space-y-6 animate-fadeIn text-left">
            <div>
              <h2 className="text-2xl font-header font-bold text-[#2C2623]">Hero Scrapbook Collage (3 Cards)</h2>
              <p className="text-xs text-[#2C2623]/60">Customize the 3 Polaroid scrapbook cards shown on the home page hero section.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {heroCards.map((card, idx) => (
                <div key={card.id} className="bg-white rounded-3xl p-5 border border-[#E8DFC9] shadow-xs space-y-4">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-[#EAE0D2]">
                    <img src={card.imgUrl} alt={card.title} className="w-full h-full object-cover" />
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#B06B5B] tracking-wider block">
                      Card Position {idx + 1} ({idx === 0 ? "Left Floating Pin" : idx === 1 ? "Main Center Showcase" : "Right Tilt Card"})
                    </span>
                    <h4 className="font-header font-bold text-lg text-[#2C2623]">{card.title}</h4>
                    <p className="text-xs text-stone-600">{card.subtitle}</p>
                    <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-[#FAF0ED] text-[#B06B5B] text-[10px] font-bold border border-[#ECCEC7]">
                      {card.badge}
                    </span>
                  </div>

                  <button
                    onClick={() => setEditingHeroCard(card)}
                    className="w-full py-2 rounded-xl bg-stone-100 hover:bg-[#FAF0ED] hover:text-[#B06B5B] text-xs font-bold transition cursor-pointer"
                  >
                    Edit Photo & Title
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 8: TOP TICKER ANNOUNCEMENTS ================= */}
        {activeTab === "ticker" && (
          <div className="space-y-6 animate-fadeIn text-left">
            <div>
              <h2 className="text-2xl font-header font-bold text-[#2C2623]">Top Marquee Ticker Messages</h2>
              <p className="text-xs text-[#2C2623]/60">Manage the scrolling announcement bar at the top of the storefront (clean luxury text without emojis).</p>
            </div>

            {/* ADD NEW TICKER MESSAGE */}
            <div className="bg-white p-5 rounded-3xl border border-[#E8DFC9] shadow-xs flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newTickerText}
                onChange={(e) => setNewTickerText(e.target.value)}
                placeholder="Enter new announcement (e.g. Complimentary Studio Gift Box on Orders Above Rs. 1,499)..."
                className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#B06B5B]"
              />
              <button
                onClick={addTickerItem}
                className="px-5 py-2.5 rounded-xl bg-[#B06B5B] hover:bg-[#975647] text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer shrink-0"
              >
                + Add Message
              </button>
            </div>

            {/* TICKER ITEMS LIST */}
            <div className="bg-white rounded-3xl border border-[#E8DFC9] shadow-xs divide-y divide-stone-100">
              {tickerList.map((item, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#FAF0ED] text-[#B06B5B] text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-[#2C2623]">{item}</span>
                  </div>
                  <button
                    onClick={() => removeTickerItem(idx)}
                    className="text-xs text-rose-600 hover:text-rose-800 font-bold px-3 py-1 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                  >
                    Remove ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 9: CUSTOMER REVIEWS & MEDIA ================= */}
        {activeTab === "reviews" && (
          <div className="space-y-6 animate-fadeIn text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8DFC9]">
              <div>
                <h2 className="text-2xl font-header font-bold text-[#2C2623]">Customer Reviews & Unboxing Photos</h2>
                <p className="text-xs text-[#2C2623]/60">Manage authentic buyer ratings, unboxing videos/photos, and testimonials.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                  Total Reviews: {reviews.length}
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                  Avg Rating: {(reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / (reviews.length || 1)).toFixed(1)} ★
                </span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#E8DFC9] space-y-3">
                <span className="text-4xl block">⭐</span>
                <h3 className="font-header text-lg text-stone-800">No customer reviews yet</h3>
                <p className="text-xs text-stone-500 font-serif">When customers write reviews on the product or profile page, they will appear here with photos.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white rounded-3xl border border-[#E8DFC9] p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1 text-amber-500 text-sm">
                            {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                              <span key={i}>★</span>
                            ))}
                          </div>
                          <h4 className="font-header font-bold text-base text-[#2C2623] mt-1">{rev.title}</h4>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Verified Buyer
                        </span>
                      </div>

                      <p className="text-xs text-[#2C2623]/80 font-serif leading-relaxed italic">
                        "{rev.comment}"
                      </p>

                      {rev.mediaUrl && (
                        <div className="rounded-2xl overflow-hidden border border-[#EDE5DA] bg-[#FAF7F2] max-h-44">
                          {rev.mediaUrl.endsWith(".mp4") || rev.mediaUrl.includes("video") ? (
                            <video src={rev.mediaUrl} controls className="w-full h-44 object-cover" />
                          ) : (
                            <img src={rev.mediaUrl} alt="Review snapshot" className="w-full h-44 object-cover" />
                          )}
                        </div>
                      )}

                      <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#EFE8DE] space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#2C2623]">{rev.customerName || "Patron"}</span>
                          <span className="text-[11px] text-stone-400">{rev.date ? new Date(rev.date).toLocaleDateString() : "Recent"}</span>
                        </div>
                        {rev.customerPhone && (
                          <div className="text-[11px] text-stone-500">Phone: {rev.customerPhone}</div>
                        )}
                        <div className="text-[11px] text-[#B06B5B] font-bold">
                          Product: {rev.productName || `Item #${rev.productId}`}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#F4EFEA] flex items-center justify-between">
                      <Link
                        href={`/product/${rev.productId}`}
                        target="_blank"
                        className="text-xs text-[#B06B5B] font-bold hover:underline"
                      >
                        View on Product Page &rarr;
                      </Link>

                      <button
                        onClick={() => deleteReview(rev.id)}
                        className="px-3 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition cursor-pointer"
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

        {/* ================= TAB 10: OFFERS & EMAIL BROADCASTS ================= */}
        {activeTab === "offers" && (
          <div className="space-y-8 animate-fadeIn text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFC9] pb-4">
              <div>
                <h2 className="text-2xl font-header font-bold text-[#2C2623]">Offers & Email Broadcasts Center</h2>
                <p className="text-xs text-[#2C2623]/60">
                  Launch discount codes, festive celebrations, and product drops. Dispatches high-conversion emails with direct store links.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Resend Email Connected (dev2dev.online)</span>
                </span>
              </div>
            </div>

            {/* AUDIENCE REACH STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#E8DFC9] shadow-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B06B5B] block">Audience Reach</span>
                <p className="text-3xl font-extrabold text-[#2C2623]">{STORE.getAllCustomerEmails().length}</p>
                <p className="text-[11px] text-stone-500">Unique patrons from orders, custom inquiries & newsletter</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E8DFC9] shadow-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Admin Notification Inbox</span>
                <p className="text-xs font-mono font-bold text-[#2C2623] truncate pt-1.5">cocoon.by.mehak@gmail.com</p>
                <p className="text-[11px] text-stone-500">Receives duplicate notifications for all orders & broadcasts</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E8DFC9] shadow-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#526B57] block">Verified Sender Identity</span>
                <p className="text-xs font-mono font-bold text-[#2C2623] truncate pt-1.5">COCOON &lt;onboarding@dev2dev.online&gt;</p>
                <p className="text-[11px] text-stone-500">Authenticated domain via Resend</p>
              </div>
            </div>

            {/* CREATE & BROADCAST NEW OFFER FORM */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-xs space-y-6">
              <div className="border-b border-[#FAF4ED] pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#B06B5B] block">Campaign Composer</span>
                  <h3 className="font-header font-bold text-xl text-[#2C2623]">Create & Broadcast New Offer</h3>
                </div>
                {isBroadcastingEmail && (
                  <span className="text-xs text-[#B06B5B] font-bold animate-pulse flex items-center gap-1.5">
                    <span className="animate-spin text-sm">⏳</span>
                    <span>Broadcasting emails via Resend...</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Offer Title / Headline *</label>
                  <input
                    type="text"
                    value={newOfferForm.title}
                    onChange={(e) => setNewOfferForm({ ...newOfferForm, title: e.target.value })}
                    placeholder="e.g. Festive 20% OFF: Sunflower Backpacks & Belts"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:border-[#B06B5B]"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Tag / Badge</label>
                  <input
                    type="text"
                    value={newOfferForm.badge}
                    onChange={(e) => setNewOfferForm({ ...newOfferForm, badge: e.target.value })}
                    placeholder="e.g. Limited Festive Drop, Special Edition"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:border-[#B06B5B]"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Coupon Code (Optional)</label>
                  <input
                    type="text"
                    value={newOfferForm.couponCode}
                    onChange={(e) => setNewOfferForm({ ...newOfferForm, couponCode: e.target.value.toUpperCase() })}
                    placeholder="e.g. COCOON20 or FESTIVEFREE"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 font-mono font-bold uppercase focus:outline-none focus:border-[#B06B5B]"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Storefront Destination Link *</label>
                  <input
                    type="text"
                    value={newOfferForm.link}
                    onChange={(e) => setNewOfferForm({ ...newOfferForm, link: e.target.value })}
                    placeholder="e.g. /#p4-treasures or /product/15"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:border-[#B06B5B]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-bold text-stone-700 block mb-1">Offer Description / Message</label>
                  <textarea
                    rows={3}
                    value={newOfferForm.description}
                    onChange={(e) => setNewOfferForm({ ...newOfferForm, description: e.target.value })}
                    placeholder="Describe the offer — e.g. Enjoy 20% off on all made-to-order handcrafted crochet treasures this weekend."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:border-[#B06B5B]"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={isBroadcastingEmail || !newOfferForm.title}
                  onClick={() => saveOffer(newOfferForm, true)}
                  className="px-6 py-3 rounded-2xl bg-[#B06B5B] hover:bg-[#975647] text-white text-xs font-bold uppercase tracking-wider transition shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  <span>Save & Broadcast Offer via Email (with Link)</span>
                </button>

                <button
                  type="button"
                  disabled={!newOfferForm.title}
                  onClick={() => saveOffer(newOfferForm, false)}
                  className="px-5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  Save Offer Only (No Email)
                </button>
              </div>
            </div>

            {/* INSTANT PRODUCT LAUNCH BROADCAST SHORTCUT */}
            <div className="bg-[#FAF7F2] rounded-3xl p-6 border border-[#E8DFC9] shadow-xs space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#526B57] block">Quick Product Launch Broadcast</span>
                <h3 className="font-header font-bold text-lg text-[#2C2623]">Broadcast Any Existing Product to Customers</h3>
                <p className="text-xs text-stone-600 font-serif">
                  Select any product from your catalog to instantly email customer inboxes with product photograph, price, and direct link.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <select
                  id="product-broadcast-select"
                  className="flex-1 bg-white border border-[#DDD3C4] rounded-xl px-4 py-2.5 text-xs text-[#2C2623] focus:outline-none focus:border-[#B06B5B]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — Rs. {p.price} ({p.category})
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  disabled={isBroadcastingEmail}
                  onClick={() => {
                    const sel = document.getElementById("product-broadcast-select");
                    const prodId = Number(sel?.value);
                    const chosen = products.find((p) => p.id === prodId);
                    if (chosen) {
                      broadcastProductLaunch(chosen);
                    }
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#221F1F] hover:bg-[#B06B5B] text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer shrink-0 shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>Broadcast Selected Product &rarr;</span>
                </button>
              </div>
            </div>

            {/* ACTIVE & PAST OFFERS LIST */}
            <div className="space-y-4">
              <h3 className="font-header font-bold text-xl text-[#2C2623]">Active & Past Promotional Offers</h3>
              
              {offers.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-[#E8DFC9] text-center text-xs text-stone-500 font-serif">
                  No promotional offers created yet. Create one above to broadcast to patrons.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {offers.map((offer) => (
                    <div key={offer.id} className="bg-white rounded-2xl p-5 border border-[#E8DFC9] shadow-xs flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          {offer.badge && (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF0ED] text-[#B06B5B] text-[10px] font-bold uppercase tracking-wider border border-[#ECCEC7]">
                              {offer.badge}
                            </span>
                          )}
                          <span className="text-[10px] text-stone-400">
                            {offer.date ? new Date(offer.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : ""}
                          </span>
                        </div>

                        <h4 className="font-header font-bold text-base text-[#2C2623]">{offer.title}</h4>
                        <p className="text-xs text-stone-600 line-clamp-2">{offer.description}</p>

                        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                          {offer.couponCode && (
                            <span className="font-mono font-bold bg-stone-100 text-stone-800 px-2.5 py-1 rounded-lg border border-dashed border-stone-300">
                              Code: {offer.couponCode}
                            </span>
                          )}
                          <span className="text-stone-400 text-[11px] truncate max-w-xs">
                            Link: {offer.link}
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => broadcastOffer(offer)}
                          disabled={isBroadcastingEmail}
                          className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-[#FAF0ED] text-[#B06B5B] border border-rose-200 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                        >
                          <span>Re-Broadcast via Email</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteOffer(offer.id)}
                          className="text-xs text-stone-400 hover:text-rose-600 transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ================= TAB 11: COUPONS & BOGO DISCOUNT ENGINE ================= */}
        {activeTab === "coupons" && (
          <div className="space-y-8 animate-fadeIn text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFC9] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏷️</span>
                  <h2 className="text-2xl font-header font-bold text-[#2C2623]">Coupons & Promotional Engine</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                    {coupons.filter((c) => c.isActive).length} Active
                  </span>
                </div>
                <p className="text-xs text-[#2C2623]/60 mt-1">
                  Create Flat ₹ Off, Percentage % Off, and Buy 1 Get 1 / Buy 2 Get 1 (BOGO) automated discounts for your patrons.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddCoupon}
                className="px-5 py-2.5 rounded-xl bg-[#B06B5B] hover:bg-[#964B44] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
              >
                <span>+ Create New Coupon</span>
              </button>
            </div>

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="bg-white p-4 rounded-2xl border border-[#E8DFC9] shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Total Vouchers</span>
                <p className="text-2xl font-bold font-mono text-[#2C2623] mt-0.5">{coupons.length}</p>
                <p className="text-[11px] text-stone-500 font-serif mt-1">Across all promo campaigns</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#E8DFC9] shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Active Coupons</span>
                <p className="text-2xl font-bold font-mono text-emerald-700 mt-0.5">
                  {coupons.filter((c) => c.isActive).length}
                </p>
                <p className="text-[11px] text-stone-500 font-serif mt-1">Ready for customer checkout</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#E8DFC9] shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B06B5B]">Supported Types</span>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md font-bold">Flat ₹ Off</span>
                  <span className="text-[10px] bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-md font-bold">% Off</span>
                  <span className="text-[10px] bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-md font-bold">BOGO Free</span>
                </div>
              </div>
            </div>

            {/* COUPONS LIST GRID */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-header font-bold text-lg text-[#2C2623]">Active & Configured Coupons</h3>
                <span className="text-xs text-stone-400 font-serif">Click any code to copy</span>
              </div>

              {coupons.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 border border-[#E8DFC9] text-center space-y-3">
                  <span className="text-3xl">🏷️</span>
                  <h4 className="font-header text-lg font-bold text-stone-800">No Coupons Created Yet</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto font-serif">
                    Reward your buyers with special discounts! Click "Create New Coupon" to set up your first Flat ₹ Off, % Off, or Buy 1 Get 1 Free offer.
                  </p>
                  <button
                    onClick={handleOpenAddCoupon}
                    className="px-4 py-2 rounded-xl bg-[#2C2623] text-white text-xs font-bold uppercase tracking-wider"
                  >
                    + Create First Coupon
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {coupons.map((cpn) => (
                    <div
                      key={cpn.id}
                      className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-sm ${
                        cpn.isActive ? "border-[#E8DFC9]" : "border-stone-200 opacity-70 bg-stone-50/50"
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Top Row: Type Badge + Status */}
                        <div className="flex items-center justify-between gap-2">
                          {cpn.type === "bogo" ? (
                            <span className="text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 px-2.5 py-1 rounded-full border border-rose-200 flex items-center gap-1">
                              <span>🎁</span>
                              <span>Buy {cpn.bogoBuyQty || 1} Get {cpn.bogoFreeQty || 1} FREE</span>
                            </span>
                          ) : cpn.type === "flat" ? (
                            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                              <span>💰</span>
                              <span>Flat ₹{cpn.discountAmount} OFF</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-900 px-2.5 py-1 rounded-full border border-blue-200 flex items-center gap-1">
                              <span>🏷️</span>
                              <span>{cpn.discountPercent}% OFF</span>
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleToggleCoupon(cpn.id)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                              cpn.isActive
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200"
                                : "bg-stone-200 text-stone-600 border border-stone-300 hover:bg-stone-300"
                            }`}
                            title="Click to toggle Active/Inactive"
                          >
                            {cpn.isActive ? "● Active" : "○ Inactive"}
                          </button>
                        </div>

                        {/* Coupon Code Block */}
                        <div className="bg-[#FAF7F2] p-3 rounded-xl border border-dashed border-[#DDD3C4] flex items-center justify-between">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-stone-400 block tracking-wider">Coupon Code</span>
                            <span className="font-mono text-base font-extrabold text-[#2C2623] tracking-widest select-all">
                              {cpn.code}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              try {
                                navigator.clipboard.writeText(cpn.code);
                                triggerToast(`Copied code: ${cpn.code}`);
                              } catch (e) {
                                triggerToast(`Code: ${cpn.code}`);
                              }
                            }}
                            className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 hover:border-[#B06B5B] text-stone-700 hover:text-[#B06B5B] text-[10px] font-bold transition shadow-2xs cursor-pointer active:scale-95"
                          >
                            Copy
                          </button>
                        </div>

                        {/* Title & Conditions */}
                        <div>
                          <h4 className="font-header font-bold text-base text-[#2C2623] leading-snug">
                            {cpn.title}
                          </h4>
                          <div className="mt-2 space-y-1 text-[11px] text-stone-500 font-serif">
                            {cpn.type === "bogo" && (
                              <p className="text-[#B06B5B] font-sans font-bold">
                                ✨ Lowest priced {cpn.bogoFreeQty || 1} item(s) free per {Number(cpn.bogoBuyQty || 1) + Number(cpn.bogoFreeQty || 1)} items
                              </p>
                            )}
                            {cpn.minOrderValue > 0 ? (
                              <p>• Min Order: ₹{cpn.minOrderValue}</p>
                            ) : (
                              <p>• No minimum order required</p>
                            )}
                            {cpn.type === "percentage" && cpn.maxDiscount > 0 && (
                              <p>• Max discount cap: ₹{cpn.maxDiscount}</p>
                            )}
                            <p>• Redeemed {cpn.usedCount || 0} times</p>
                          </div>
                        </div>
                      </div>

                      {/* Card Action Footer */}
                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={() => handleEditCoupon(cpn)}
                          className="font-bold text-[#B06B5B] hover:underline cursor-pointer"
                        >
                          Edit Settings
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteCoupon(cpn.id, cpn.code)}
                          className="text-stone-400 hover:text-rose-600 transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* 4. MODALS FOR EDITING */}
      {/* C. COUPON CREATION & EDIT MODAL */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 text-left space-y-5 max-h-[92vh] overflow-y-auto shadow-2xl border border-[#EAE0D2]">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-header font-bold text-xl text-[#2C2623]">
                  {editingCoupon ? "Edit Coupon & Offer" : "Create New Coupon & Promo"}
                </h3>
                <p className="text-[11px] text-stone-500 font-serif">
                  Set up percentage discount, flat ₹ off, or Buy 1 Get 1 (BOGO)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCouponModalOpen(false)}
                className="text-stone-400 hover:text-stone-800 text-lg cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4 text-xs">
              {/* 1. Coupon Code */}
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Coupon Code * <span className="text-stone-400 font-normal">(What customer enters at checkout)</span>
                </label>
                <input
                  type="text"
                  required
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase().replace(/\s+/g, "") })}
                  placeholder="e.g. BOGO, FLAT100, MEHAK20"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 font-mono font-bold uppercase text-sm tracking-wider focus:outline-none focus:border-[#B06B5B]"
                />
              </div>

              {/* 2. Title */}
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Offer Title / Description *
                </label>
                <input
                  type="text"
                  required
                  value={couponForm.title}
                  onChange={(e) => setCouponForm({ ...couponForm, title: e.target.value })}
                  placeholder="e.g. Buy 1 Get 1 Free Special or Flat ₹100 Off"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:border-[#B06B5B]"
                />
              </div>

              {/* 3. Discount Type Selector */}
              <div>
                <label className="font-bold text-stone-700 block mb-1.5">
                  Choose Discount Type *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCouponForm({ ...couponForm, type: "percentage" })}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                      couponForm.type === "percentage"
                        ? "bg-[#FAF4ED] border-[#B06B5B] ring-2 ring-[#B06B5B]/20 text-[#B06B5B]"
                        : "bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700"
                    }`}
                  >
                    <span className="text-lg">🏷️</span>
                    <span className="font-bold text-xs">% Off</span>
                    <span className="text-[9px] text-stone-500">e.g. 15% / 20%</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCouponForm({ ...couponForm, type: "flat" })}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                      couponForm.type === "flat"
                        ? "bg-[#FAF4ED] border-[#B06B5B] ring-2 ring-[#B06B5B]/20 text-[#B06B5B]"
                        : "bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700"
                    }`}
                  >
                    <span className="text-lg">💰</span>
                    <span className="font-bold text-xs">Flat ₹ Off</span>
                    <span className="text-[9px] text-stone-500">e.g. ₹100 Off</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCouponForm({ ...couponForm, type: "bogo" })}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                      couponForm.type === "bogo"
                        ? "bg-[#FAF4ED] border-[#B06B5B] ring-2 ring-[#B06B5B]/20 text-[#B06B5B]"
                        : "bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700"
                    }`}
                  >
                    <span className="text-lg">🎁</span>
                    <span className="font-bold text-xs">BOGO Free</span>
                    <span className="text-[9px] text-stone-500">Buy X Get Y</span>
                  </button>
                </div>
              </div>

              {/* 4. Type Specific Dynamic Inputs */}
              {couponForm.type === "percentage" && (
                <div className="grid grid-cols-2 gap-3 p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200">
                  <div>
                    <label className="font-bold text-blue-950 block mb-1">Discount Percentage (%) *</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      required
                      value={couponForm.discountPercent}
                      onChange={(e) => setCouponForm({ ...couponForm, discountPercent: Number(e.target.value) })}
                      placeholder="e.g. 15"
                      className="w-full bg-white border border-blue-200 rounded-xl p-2.5 font-bold focus:outline-none focus:border-[#B06B5B]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-blue-950 block mb-1">Max Discount Cap (₹) <span className="font-normal">(Optional)</span></label>
                    <input
                      type="number"
                      min={0}
                      value={couponForm.maxDiscount}
                      onChange={(e) => setCouponForm({ ...couponForm, maxDiscount: Number(e.target.value) })}
                      placeholder="0 = No limit"
                      className="w-full bg-white border border-blue-200 rounded-xl p-2.5 focus:outline-none focus:border-[#B06B5B]"
                    />
                  </div>
                </div>
              )}

              {couponForm.type === "flat" && (
                <div className="grid grid-cols-2 gap-3 p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200">
                  <div>
                    <label className="font-bold text-amber-950 block mb-1">Discount Amount (₹) *</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={couponForm.discountAmount}
                      onChange={(e) => setCouponForm({ ...couponForm, discountAmount: Number(e.target.value) })}
                      placeholder="e.g. 100"
                      className="w-full bg-white border border-amber-200 rounded-xl p-2.5 font-bold focus:outline-none focus:border-[#B06B5B]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-amber-950 block mb-1">Min Order Value (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={couponForm.minOrderValue}
                      onChange={(e) => setCouponForm({ ...couponForm, minOrderValue: Number(e.target.value) })}
                      placeholder="e.g. 499 (0 = No min)"
                      className="w-full bg-white border border-amber-200 rounded-xl p-2.5 focus:outline-none focus:border-[#B06B5B]"
                    />
                  </div>
                </div>
              )}

              {couponForm.type === "bogo" && (
                <div className="p-3.5 bg-rose-50/70 rounded-2xl border border-rose-200 space-y-2.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-rose-950 block mb-1">Buy Quantity (X) *</label>
                      <select
                        value={couponForm.bogoBuyQty}
                        onChange={(e) => setCouponForm({ ...couponForm, bogoBuyQty: Number(e.target.value) })}
                        className="w-full bg-white border border-rose-200 rounded-xl p-2.5 font-bold focus:outline-none focus:border-[#B06B5B]"
                      >
                        <option value={1}>Buy 1</option>
                        <option value={2}>Buy 2</option>
                        <option value={3}>Buy 3</option>
                        <option value={4}>Buy 4</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-rose-950 block mb-1">Get Free Quantity (Y) *</label>
                      <select
                        value={couponForm.bogoFreeQty}
                        onChange={(e) => setCouponForm({ ...couponForm, bogoFreeQty: Number(e.target.value) })}
                        className="w-full bg-white border border-rose-200 rounded-xl p-2.5 font-bold focus:outline-none focus:border-[#B06B5B]"
                      >
                        <option value={1}>Get 1 Free</option>
                        <option value={2}>Get 2 Free</option>
                        <option value={3}>Get 3 Free</option>
                      </select>
                    </div>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-rose-200/80 text-[11px] text-rose-900 font-serif leading-relaxed">
                    💡 <strong>How it works:</strong> Customer adds at least ({couponForm.bogoBuyQty || 1} + {couponForm.bogoFreeQty || 1}) items to their basket, and the system automatically makes the lowest priced {couponForm.bogoFreeQty || 1} item(s) 100% free!
                  </div>
                </div>
              )}

              {/* 5. Minimum Order Requirement (for non-flat types) */}
              {couponForm.type !== "flat" && (
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Minimum Order Value (₹) <span className="font-normal text-stone-400">(0 = No minimum required)</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={couponForm.minOrderValue}
                    onChange={(e) => setCouponForm({ ...couponForm, minOrderValue: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:border-[#B06B5B]"
                  />
                </div>
              )}

              {/* 6. Active Toggle */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-stone-800 block">Active Status</span>
                  <span className="text-[11px] text-stone-500 font-serif">Allow customers to redeem this code immediately</span>
                </div>
                <input
                  type="checkbox"
                  checked={couponForm.isActive}
                  onChange={(e) => setCouponForm({ ...couponForm, isActive: e.target.checked })}
                  className="accent-[#B06B5B] w-5 h-5 rounded cursor-pointer"
                />
              </div>

              {/* Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#B06B5B] hover:bg-[#964B44] text-white font-bold tracking-wider uppercase transition shadow-md cursor-pointer"
                >
                  Save & Publish Coupon &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* A. PRODUCT EDIT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 text-left space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-[#EAE0D2]">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-header font-bold text-xl text-[#2C2623]">
                {editingProduct.id ? "Edit Product" : "Add New Product"}
              </h3>
              <button onClick={() => setEditingProduct(null)} className="text-stone-400 hover:text-stone-800">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Product Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-stone-50 border rounded-xl p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Selling Price (Rs.)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-stone-50 border rounded-xl p-2.5 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Original MRP (Rs.)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full bg-stone-50 border rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Category</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="w-full bg-stone-50 border rounded-xl p-2.5"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* PRODUCT PHOTO EDIT SECTION */}
              <div className="space-y-2.5 p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-stone-800 text-xs flex items-center gap-1.5">
                    <span>Product Photograph</span>
                  </label>
                  {isUploadingPhoto && (
                    <span className="text-[10px] text-[#B06B5B] font-bold animate-pulse flex items-center gap-1">
                      <div className="w-2.5 h-2.5 border-2 border-[#B06B5B] border-t-transparent rounded-full animate-spin"></div>
                      <span>Uploading to Supabase Storage...</span>
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-4">
                  {/* Photo Preview Thumbnail */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border border-stone-300 shrink-0 shadow-xs">
                    {editingProduct.imgUrl ? (
                      <img
                        src={editingProduct.imgUrl}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400 text-[10px] font-serif">
                        No Photo
                      </div>
                    )}
                  </div>

                  {/* Upload Actions */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#221F1F] hover:bg-[#B06B5B] text-white text-[11px] font-bold uppercase tracking-wider transition shadow-xs">
                        <span>Choose New Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProductPhotoUpload}
                          className="hidden"
                        />
                      </label>

                      {editingProduct.imgUrl && (
                        <button
                          type="button"
                          onClick={() => setEditingProduct({ ...editingProduct, imgUrl: "" })}
                          className="px-2.5 py-2 rounded-xl bg-stone-200 hover:bg-rose-100 hover:text-rose-700 text-stone-700 text-[11px] font-bold transition cursor-pointer"
                        >
                          ✕ Remove
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-stone-500 font-serif leading-tight">
                      Upload any photo from your phone or PC. It will automatically upload to Supabase Storage and link to this product.
                    </p>
                  </div>
                </div>

                {/* Direct Image URL input */}
                <div className="pt-2 border-t border-stone-200/80">
                  <label className="text-[10px] font-semibold text-stone-500 block mb-1">
                    Or Enter Image URL / Public File Path:
                  </label>
                  <input
                    type="text"
                    value={editingProduct.imgUrl || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, imgUrl: e.target.value })}
                    placeholder="https://... or /products/items/name.jpg"
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#B06B5B]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Badge (Optional)</label>
                <input
                  type="text"
                  value={editingProduct.badge || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                  placeholder="e.g. Bestseller, Cute, Handmade"
                  className="w-full bg-stone-50 border rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.desc}
                  onChange={(e) => setEditingProduct({ ...editingProduct, desc: e.target.value })}
                  className="w-full bg-stone-50 border rounded-xl p-2.5"
                />
              </div>
            </div>

            {!editingProduct.id && (
              <div className="p-3 bg-[#FAF4ED] rounded-xl border border-[#ECCEC7]">
                <label className="flex items-center gap-2.5 text-xs font-bold text-[#2C2623] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={broadcastLaunchChecked}
                    onChange={(e) => setBroadcastLaunchChecked(e.target.checked)}
                    className="w-4 h-4 accent-[#B06B5B] rounded cursor-pointer"
                  />
                  <span>Broadcast Launch Announcement with link to all patrons via Email</span>
                </label>
                <p className="text-[10px] text-stone-500 mt-1 pl-6">
                  Automatically dispatches announcement email with photo, price & direct purchase link to customer inboxes.
                </p>
              </div>
            )}

            <div className="pt-3 border-t flex justify-end gap-2">
              <button onClick={() => setEditingProduct(null)} className="px-4 py-2 rounded-xl bg-stone-100 text-xs font-bold">
                Cancel
              </button>
              <button
                onClick={() => saveProduct(editingProduct)}
                className="px-5 py-2 rounded-xl bg-[#B06B5B] text-white text-xs font-bold uppercase tracking-wider"
              >
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* B. CATEGORY EDIT MODAL */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-left space-y-4 shadow-2xl border border-[#EAE0D2]">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-header font-bold text-xl text-[#2C2623]">Category Details</h3>
              <button onClick={() => setEditingCategory(null)} className="text-stone-400 hover:text-stone-800">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Category ID (Slug)</label>
                <input
                  type="text"
                  value={editingCategory.id}
                  onChange={(e) => setEditingCategory({ ...editingCategory, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  placeholder="e.g. bags, phone-cases"
                  className="w-full bg-stone-50 border rounded-xl p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Category Title</label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full bg-stone-50 border rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Starting Price (Rs.)</label>
                <input
                  type="number"
                  value={editingCategory.minPrice}
                  onChange={(e) => setEditingCategory({ ...editingCategory, minPrice: Number(e.target.value) })}
                  className="w-full bg-stone-50 border rounded-xl p-2.5 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Cover Image Path</label>
                <input
                  type="text"
                  value={editingCategory.imgUrl}
                  onChange={(e) => setEditingCategory({ ...editingCategory, imgUrl: e.target.value })}
                  className="w-full bg-stone-50 border rounded-xl p-2.5"
                />
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end gap-2">
              <button onClick={() => setEditingCategory(null)} className="px-4 py-2 rounded-xl bg-stone-100 text-xs font-bold">
                Cancel
              </button>
              <button
                onClick={() => saveCategory(editingCategory)}
                className="px-5 py-2 rounded-xl bg-[#B06B5B] text-white text-xs font-bold uppercase tracking-wider"
              >
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* C. HERO CARD EDIT MODAL */}
      {editingHeroCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-left space-y-4 shadow-2xl border border-[#EAE0D2]">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-header font-bold text-xl text-[#2C2623]">Edit Hero Card Image & Text</h3>
              <button onClick={() => setEditingHeroCard(null)} className="text-stone-400 hover:text-stone-800">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Card Title</label>
                <input
                  type="text"
                  value={editingHeroCard.title}
                  onChange={(e) => setEditingHeroCard({ ...editingHeroCard, title: e.target.value })}
                  className="w-full bg-stone-50 border rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Subtitle / Price</label>
                <input
                  type="text"
                  value={editingHeroCard.subtitle}
                  onChange={(e) => setEditingHeroCard({ ...editingHeroCard, subtitle: e.target.value })}
                  className="w-full bg-stone-50 border rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={editingHeroCard.badge}
                  onChange={(e) => setEditingHeroCard({ ...editingHeroCard, badge: e.target.value })}
                  className="w-full bg-stone-50 border rounded-xl p-2.5"
                />
              </div>

              {/* HERO CARD PHOTO SECTION */}
              <div className="space-y-2 p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <label className="font-bold text-stone-700 block text-xs">Card Image</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-stone-300 shrink-0">
                    <img src={editingHeroCard.imgUrl} alt="Hero preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#221F1F] hover:bg-[#B06B5B] text-white text-[11px] font-bold uppercase tracking-wider transition shadow-xs">
                      <span>Upload Photo</span>
                      <input type="file" accept="image/*" onChange={handleHeroPhotoUpload} className="hidden" />
                    </label>
                    <p className="text-[10px] text-stone-500 font-serif">Upload from device or enter URL below.</p>
                  </div>
                </div>
                <input
                  type="text"
                  value={editingHeroCard.imgUrl}
                  onChange={(e) => setEditingHeroCard({ ...editingHeroCard, imgUrl: e.target.value })}
                  placeholder="/products/items/name.jpg"
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#B06B5B]"
                />
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end gap-2">
              <button onClick={() => setEditingHeroCard(null)} className="px-4 py-2 rounded-xl bg-stone-100 text-xs font-bold">
                Cancel
              </button>
              <button
                onClick={() => saveHeroCard(editingHeroCard)}
                className="px-5 py-2 rounded-xl bg-[#B06B5B] text-white text-xs font-bold uppercase tracking-wider"
              >
                Save Hero Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. SHIPROCKET COURIER PICKUP SCHEDULER MODAL */}
      {shippingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#E8DFC9] space-y-5 text-left max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#FAF4ED] pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B06B5B] block">
                  Logistics & Courier Dispatch
                </span>
                <h3 className="font-header font-bold text-xl text-[#2C2623]">
                  Schedule Shiprocket Pickup
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShippingModalOrder(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center text-sm font-bold transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Order Destination Summary Card */}
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EDE5DA] space-y-2 text-xs">
              <div className="flex justify-between items-center text-stone-600">
                <span>Order Ref: <strong className="text-stone-900 font-mono">{shippingModalOrder.id}</strong></span>
                <span className="font-bold text-stone-900">₹{shippingModalOrder.totalAmount} ({shippingModalOrder.paymentMethod})</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Recipient:</span>
                <span className="font-bold text-stone-900">{shippingModalOrder.customerName} • {shippingModalOrder.customerPhone}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Delivery Address:</span>
                <span className="text-stone-800 font-medium">{shippingModalOrder.address}</span>
              </div>
              <div className="pt-1 text-[11px] text-[#B06B5B] font-semibold border-t border-[#E8DFC9]/70">
                📦 Items: {shippingModalOrder.items?.map((it) => `${it.name} x${it.quantity}`).join(", ")}
              </div>
            </div>

            {/* Pickup Location Info */}
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 text-[11px] space-y-1 text-amber-900">
              <span className="font-bold block uppercase tracking-wider text-[10px] text-amber-800">
                📍 Pickup From (Mehak Agarwal's Agra Atelier):
              </span>
              <p className="font-serif">
                Near Tomar Dairy, 161/A-D, Sultanpura, Agra Cantt, Idgah Colony, Agra - 282001
              </p>
              <p className="text-[10px] text-amber-700/90 italic">
                The courier will arrive directly at your doorstep to pick up the boxed parcel.
              </p>
            </div>

            {/* Courier & Dimension Settings Form */}
            <form onSubmit={handleBookCourier} className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Weight */}
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Parcel Weight (Kg)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.1"
                    max="10"
                    required
                    value={parcelDimensions.weight}
                    onChange={(e) => setParcelDimensions({ ...parcelDimensions, weight: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono text-xs focus:outline-none focus:border-[#B06B5B]"
                  />
                  <span className="text-[9px] text-stone-400">Crochet piece avg: 0.25 kg</span>
                </div>

                {/* Pickup Date */}
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    required
                    value={parcelDimensions.pickupDate}
                    onChange={(e) => setParcelDimensions({ ...parcelDimensions, pickupDate: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono text-xs focus:outline-none focus:border-[#B06B5B]"
                  />
                  <span className="text-[9px] text-stone-400">When package is packed</span>
                </div>
              </div>

              {/* Dimensions */}
              <div className="space-y-1">
                <label className="font-bold text-stone-700 block text-xs">
                  Box Dimensions (cm) - L × B × H
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <input
                      type="number"
                      placeholder="Length"
                      value={parcelDimensions.length}
                      onChange={(e) => setParcelDimensions({ ...parcelDimensions, length: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2 text-xs font-mono text-center"
                    />
                    <span className="text-[9px] text-stone-400 block text-center">L (20 cm)</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Breadth"
                      value={parcelDimensions.breadth}
                      onChange={(e) => setParcelDimensions({ ...parcelDimensions, breadth: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2 text-xs font-mono text-center"
                    />
                    <span className="text-[9px] text-stone-400 block text-center">B (15 cm)</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Height"
                      value={parcelDimensions.height}
                      onChange={(e) => setParcelDimensions({ ...parcelDimensions, height: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2 text-xs font-mono text-center"
                    />
                    <span className="text-[9px] text-stone-400 block text-center">H (8 cm)</span>
                  </div>
                </div>
              </div>

              {/* Courier Partner Selection & Live Cheapest Rate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-stone-700 block text-xs">
                    Courier Partner (Sabse Sasta Auto-Selected)
                  </label>
                  {isLoadingRates && (
                    <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-1 animate-pulse">
                      <span>🔍 Checking live cheapest rates...</span>
                    </span>
                  )}
                </div>

                {/* Cheapest Highlight Card */}
                {availableCouriers.length > 0 && availableCouriers[0] && (
                  <div className="bg-emerald-50/90 border border-emerald-300 rounded-2xl p-3 flex items-center justify-between text-xs shadow-2xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-black text-emerald-800 tracking-wider flex items-center gap-1">
                        <span>🏆</span>
                        <span>Sabse Sasta Courier (Auto-Selected)</span>
                      </span>
                      <span className="font-bold text-stone-900 block text-sm">
                        {availableCouriers[0].name}
                      </span>
                      <span className="text-stone-500 text-[11px]">
                        Expected Delivery: <strong>{availableCouriers[0].etd}</strong>
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-800 font-bold text-base block font-mono">
                        ₹{availableCouriers[0].rate}
                      </span>
                      <span className="text-[9px] text-emerald-700 bg-emerald-100/90 border border-emerald-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        Lowest Rate
                      </span>
                    </div>
                  </div>
                )}

                <select
                  value={parcelDimensions.courierPreference}
                  onChange={(e) => setParcelDimensions({ ...parcelDimensions, courierPreference: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-[#B06B5B] cursor-pointer"
                >
                  {availableCouriers.length > 0 ? (
                    availableCouriers.map((c, idx) => (
                      <option key={c.id || idx} value={String(c.id)}>
                        {idx === 0 ? "🏆 [Sabse Sasta] " : "📦 "}
                        {c.name} — ₹{c.rate} (Delivery: {c.etd})
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="auto">🏆 Auto-Select Sabse Sasta Courier (Recommended)</option>
                      <option value="delhivery">Delhivery Surface Express</option>
                      <option value="bluedart">Blue Dart Air Express</option>
                      <option value="shadowfax">Shadowfax National</option>
                    </>
                  )}
                </select>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShippingModalOrder(null)}
                  disabled={isBookingCourier}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBookingCourier}
                  className="px-5 py-2.5 rounded-xl bg-[#B06B5B] hover:bg-[#964B44] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm hover:shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isBookingCourier ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Contacting Courier...</span>
                    </>
                  ) : (
                    <>
                      <span>🚚</span>
                      <span>Summon Courier Pickup</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5.5 MANUAL COURIER / PORTER DISPATCH MODAL */}
      {manualDispatchModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B06B5B] block">
                  Self / Porter / Local Dispatch
                </span>
                <h3 className="font-header font-bold text-xl text-[#2C2623]">
                  Order #{manualDispatchModalOrder.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setManualDispatchModalOrder(null)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Recipient Details */}
            <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EDE5DA] text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-stone-500 font-semibold">Customer:</span>
                <span className="font-bold text-stone-900">{manualDispatchModalOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 font-semibold">Phone:</span>
                <span className="font-bold text-stone-900">{manualDispatchModalOrder.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 font-semibold">Address:</span>
                <span className="font-bold text-stone-900 text-right line-clamp-1 max-w-[200px]" title={manualDispatchModalOrder.address}>
                  {manualDispatchModalOrder.address}
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveManualDispatch} className="space-y-4 text-left">
              {/* Courier Partner Selection */}
              <div className="space-y-1.5">
                <label className="font-bold text-stone-700 block text-xs">
                  Courier / Delivery Service
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Porter", "Delhivery", "BlueDart", "DTDC", "India Post", "Local Hand Delivery"].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setManualCourierForm({ ...manualCourierForm, courierName: c })}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition text-center cursor-pointer ${
                        manualCourierForm.courierName === c
                          ? "bg-[#221F1F] text-white border-[#221F1F] shadow-xs"
                          : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
                      }`}
                    >
                      {c === "Porter" ? "🛵 Porter" : c}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Or type custom courier name..."
                  value={manualCourierForm.courierName}
                  onChange={(e) => setManualCourierForm({ ...manualCourierForm, courierName: e.target.value })}
                  className="w-full mt-1.5 bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:border-[#B06B5B]"
                />
              </div>

              {/* Porter / Tracking ID */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-stone-700 block text-xs">
                    Tracking ID / Order Reference <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-stone-400 font-serif">Customer will see this live</span>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. CRN1234567, PORTER-8821, DL12345"
                  value={manualCourierForm.trackingId}
                  onChange={(e) => setManualCourierForm({ ...manualCourierForm, trackingId: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-mono font-bold focus:outline-none focus:border-[#B06B5B]"
                />
              </div>

              {/* Optional Tracking Link (Auto Generated if blank) */}
              <div className="space-y-1.5">
                <label className="font-bold text-stone-700 block text-xs">
                  Live Tracking URL <span className="text-stone-400 font-normal">(Optional - auto-generated)</span>
                </label>
                <input
                  type="url"
                  placeholder="Leave empty to auto-link to Porter/Courier track page"
                  value={manualCourierForm.trackingUrl}
                  onChange={(e) => setManualCourierForm({ ...manualCourierForm, trackingUrl: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2 text-xs font-mono text-stone-600 focus:outline-none focus:border-[#B06B5B]"
                />
                <p className="text-[10px] text-stone-400">
                  Customer profile &amp; email will have a direct 1-click button to track their package.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setManualDispatchModalOrder(null)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#231F20] hover:bg-[#B06B5B] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm hover:shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <span>✓ Save &amp; Dispatch Order</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. BOOKING CONFIRMATION & SHIPPING LABEL MODAL */}
      {bookingSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-emerald-200 space-y-4 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl shadow-inner">
              ✓
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-800 block">
                Pickup Scheduled Successfully
              </span>
              <h3 className="font-header font-bold text-xl text-[#2C2623]">
                Courier Dispatched!
              </h3>
              <p className="text-xs text-stone-600 font-serif leading-relaxed">
                {bookingSuccessModal.booking.courierName} will pick up the parcel from Mehak's Atelier Studio on <strong>{bookingSuccessModal.booking.pickupDate}</strong>.
              </p>
            </div>

            {/* AWB Card */}
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EDE5DA] text-left space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-[#E8DFC9]">
                <span className="text-stone-500 font-bold uppercase tracking-wider text-[10px]">AWB Tracking Code</span>
                <span className="font-mono font-bold text-base text-blue-900 select-all tracking-wider">
                  {bookingSuccessModal.booking.awbCode}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-stone-600">
                <span>Courier:</span>
                <span className="font-bold text-stone-900">{bookingSuccessModal.booking.courierName}</span>
              </div>
              <div className="flex justify-between text-[11px] text-stone-600">
                <span>Destination:</span>
                <span className="font-bold text-stone-900">{bookingSuccessModal.booking.destination}</span>
              </div>
              <div className="flex justify-between text-[11px] text-stone-600">
                <span>Parcel Weight:</span>
                <span className="font-bold text-stone-900">{bookingSuccessModal.booking.weight}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <a
                href={bookingSuccessModal.booking.labelUrl || `/cart?viewInvoice=${encodeURIComponent(bookingSuccessModal.order.id)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-[#221F1F] hover:bg-black text-white text-xs font-bold uppercase tracking-wider block text-center transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>🖨️ Print Shipping Label / Invoice</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={bookingSuccessModal.booking.trackingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold transition block text-center"
                >
                  📍 Live Tracking
                </a>
                <a
                  href={`https://wa.me/91${bookingSuccessModal.order.customerPhone}?text=${encodeURIComponent(`Hi ${bookingSuccessModal.order.customerName}! Your COCOON handcrafted order #${bookingSuccessModal.order.id} has been dispatched via ${bookingSuccessModal.booking.courierName}! 🚚 Live Tracking: ${bookingSuccessModal.booking.trackingUrl}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition block text-center"
                >
                  📲 Send WhatsApp
                </a>
              </div>

              <button
                type="button"
                onClick={() => setBookingSuccessModal(null)}
                className="w-full py-2 rounded-xl text-stone-500 hover:text-stone-800 text-xs font-bold transition cursor-pointer"
              >
                Close & Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. FLOATING ADMIN TOAST */}
      {adminToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#221F1F] text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold animate-fadeIn border border-white/20">
          {adminToast}
        </div>
      )}

    </div>
  );
}
