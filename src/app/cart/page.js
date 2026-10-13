"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { STORE } from "@/data/store";
import { PRODUCTS } from "@/data/products";
import { saveOrderToSupabase, validateCouponFromSupabase } from "@/lib/supabase";
import { captureLiveGpsAddress } from "@/lib/location";
import { generateOrderId } from "@/lib/orderUtils";

export default function CartPage() {
  const router = useRouter();

  // Cart & Product States
  const [cart, setCart] = useState([]);
  const [storeProducts, setStoreProducts] = useState(PRODUCTS);
  const [customerUser, setCustomerUser] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Coupon / Promo States
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  // Cash on Delivery Email OTP Verification States
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpToken, setOtpToken] = useState(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [isCodEmailVerified, setIsCodEmailVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Address & Checkout Form State
  const [customerForm, setCustomerForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    notes: ""
  });
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsSuccessNote, setGpsSuccessNote] = useState(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [placedOrderSummary, setPlacedOrderSummary] = useState(null);
  const [pendingOrderToken, setPendingOrderToken] = useState(null);
  const [isVerifyingManual, setIsVerifyingManual] = useState(false);

  // Multi-Address Selection States
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [saveAddressForFuture, setSaveAddressForFuture] = useState(false);
  const [newAddressTag, setNewAddressTag] = useState("Home");

  // Payment Mode (Direct UPI vs COD) States
  const [isCodAllowed, setIsCodAllowed] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("upi"); // "upi" or "cod"
  const [utrNumber, setUtrNumber] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isUtrSubmitting, setIsUtrSubmitting] = useState(false);

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

  // Sync Cart & Customer Data
  useEffect(() => {
    const loadCartData = () => {
      let items = [];
      try {
        const saved = sessionStorage.getItem("cocoon_temp_cart") || localStorage.getItem("cocoon_temp_cart");
        if (saved) items = JSON.parse(saved);
      } catch (e) {
        items = [];
      }
      setCart(Array.isArray(items) ? items : []);
      setStoreProducts(STORE.getProducts());

      try {
        const pendingRaw = localStorage.getItem("cocoon_pending_payment");
        if (pendingRaw) {
          const parsedPending = JSON.parse(pendingRaw);
          if (parsedPending && parsedPending.razorpayOrderId) {
            setPendingOrderToken(parsedPending);
          }
        }
      } catch (e) {}
    };

    const loadUserData = () => {
      try {
        setIsCodAllowed(STORE.isCodEnabled());

        const addrs = STORE.getAddresses();
        setSavedAddresses(addrs);

        const savedUser = localStorage.getItem("cocoon_customer_user");
        let parsed = null;
        if (savedUser) {
          parsed = JSON.parse(savedUser);
          setCustomerUser(parsed);
        }

        if (addrs && addrs.length > 0) {
          const defaultAddr = addrs.find((a) => a.isDefault) || addrs[0];
          setSelectedAddressId(defaultAddr.id);
          setCustomerForm((prev) => ({
            ...prev,
            name: defaultAddr.name || parsed?.name || "",
            phone: defaultAddr.phone || (parsed?.phone && !parsed.phone.includes("@") ? parsed.phone : ""),
            email: defaultAddr.email || parsed?.email || "",
            address: defaultAddr.address || "",
            city: defaultAddr.city || parsed?.city || "",
            pincode: defaultAddr.pincode || parsed?.pincode || ""
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
        }
      } catch (e) {}
    };

    loadCartData();
    loadUserData();
    STORE.fetchServerStoreData();

    // Check if viewInvoice or orderId is in URL to preview tax invoice
    if (typeof window !== "undefined") {
      try {
        const params = new URLSearchParams(window.location.search);
        const invoiceId = params.get("viewInvoice") || params.get("orderId");
        if (invoiceId) {
          const allOrders = STORE.getOrders();
          const targetOrder = allOrders.find((o) => o.id === invoiceId);
          if (targetOrder) {
            setPlacedOrderSummary(targetOrder);
          }
        }
      } catch (e) {}
    }

    window.addEventListener("cocoon_store_update", loadCartData);
    window.addEventListener("storage", loadCartData);
    return () => {
      window.removeEventListener("cocoon_store_update", loadCartData);
      window.removeEventListener("storage", loadCartData);
    };
  }, []);

  // Save Cart Helper
  const persistCart = (updatedCart) => {
    setCart(updatedCart);
    try {
      sessionStorage.setItem("cocoon_temp_cart", JSON.stringify(updatedCart));
      localStorage.setItem("cocoon_temp_cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("cocoon_store_update"));
    } catch (e) {}
  };

  // Reconcile pending mobile UPI payments (Google Pay, PhonePe, Paytm app switches)
  useEffect(() => {
    // 0. Handle direct server redirect callback (?paymentStatus=success or failed)
    if (typeof window !== "undefined") {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const pStatus = searchParams.get("paymentStatus");
        if (pStatus === "success") {
          const pId = searchParams.get("paymentId") || "";
          const oId = searchParams.get("orderId") || "";

          // Clear cart and pending tokens immediately
          sessionStorage.removeItem("cocoon_temp_cart");
          localStorage.removeItem("cocoon_temp_cart");
          localStorage.removeItem("cocoon_pending_payment");
          setCart([]);

          let cName = customerForm?.name || "Valued Customer";
          let cPhone = customerForm?.phone || "";
          let cEmail = customerForm?.email || "";
          let cAddr = customerForm?.address || "Studio Courier Delivery";
          let grandT = grandTotal || 1;

          try {
            const raw = localStorage.getItem("cocoon_pending_payment") || localStorage.getItem("cocoon_customer_user");
            if (raw) {
              const parsed = JSON.parse(raw);
              cName = parsed.customerForm?.name || parsed.name || cName;
              cPhone = parsed.customerForm?.phone || parsed.phone || cPhone;
              cEmail = parsed.customerForm?.email || parsed.email || cEmail;
              cAddr = parsed.customerForm?.address || parsed.address || cAddr;
              grandT = parsed.grandTotal || grandT;
            }
          } catch (e) {}

          const confirmedOrder = {
            id: oId || generateOrderId(),
            date: new Date().toISOString(),
            customerName: cName,
            customerPhone: cPhone,
            customerEmail: cEmail,
            address: cAddr,
            items: cart.length > 0 ? cart : [{ id: "crochet-item", name: "Handcrafted Crochet Item", price: grandT, quantity: 1, color: "Artisanal" }],
            totalAmount: grandT,
            paymentMethod: "Online Payment (Razorpay)",
            utr: pId,
            paymentStatus: `Paid via Razorpay (ID: ${pId})`,
            status: "Processing",
            notes: `Paid Online via Razorpay [Payment ID: ${pId}, Order ID: ${oId}]`
          };

          const existingOrders = STORE.getOrders();
          STORE.setOrders([confirmedOrder, ...existingOrders]);
          setIsSubmittingOrder(false);
          setPlacedOrderSummary(confirmedOrder);
          triggerToast(`Order confirmed for ${cName}! 🎉`);

          // Clean URL without refresh
          window.history.replaceState({}, document.title, window.location.pathname);
          return;
        } else if (pStatus === "failed") {
          const reason = searchParams.get("reason") || "Payment was declined or cancelled by bank.";
          setIsSubmittingOrder(false);
          triggerToast(`Payment Failed: ${reason}`);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (e) {
        console.warn("URL paymentStatus parse notice:", e);
      }
    }

    const reconcilePayments = async () => {
      // 1. Check local pending payment token
      try {
        const rawPending = localStorage.getItem("cocoon_pending_payment");
        if (rawPending) {
          const pending = JSON.parse(rawPending);
          if (pending && pending.razorpayOrderId) {
            // Only check if created in the last 45 minutes
            if (Date.now() - (pending.createdAt || 0) < 45 * 60 * 1000) {
              const res = await fetch(`/api/payment/check-order?orderId=${encodeURIComponent(pending.razorpayOrderId)}`);
              const checkData = await res.json();
              if (checkData && checkData.paid) {
                localStorage.removeItem("cocoon_pending_payment");
                sessionStorage.removeItem("cocoon_temp_cart");
                localStorage.removeItem("cocoon_temp_cart");
                setCart([]);

                const orderId = generateOrderId();
                const newOrder = {
                  id: orderId,
                  date: new Date().toISOString(),
                  customerName: pending.customerForm?.name || "Valued Customer",
                  customerPhone: pending.customerForm?.phone || "",
                  customerEmail: pending.customerForm?.email || "",
                  address: `${pending.customerForm?.address || ""}, ${pending.customerForm?.city || ""} - ${pending.customerForm?.pincode || ""}`.replace(/^,\s*|-\s*$/g, "").trim(),
                  items: (pending.cart || []).map((i) => ({
                    id: i.id,
                    name: i.name,
                    price: i.price,
                    quantity: i.quantity,
                    color: i.color || "Standard",
                    imgUrl: i.imgUrl
                  })),
                  totalAmount: pending.grandTotal || 0,
                  paymentMethod: "Online Payment (Razorpay)",
                  utr: checkData.paymentId,
                  paymentStatus: `Paid via Razorpay (ID: ${checkData.paymentId})`,
                  status: "Processing",
                  notes: (pending.customerForm?.notes ? pending.customerForm.notes.trim() + " • " : "") +
                    `Paid Online via Razorpay [Payment ID: ${checkData.paymentId}, Order: ${pending.razorpayOrderId}]`,
                  timestamp: Date.now()
                };

                const existingOrders = STORE.getOrders();
                STORE.setOrders([newOrder, ...existingOrders]);
                setIsSubmittingOrder(false);
                setPlacedOrderSummary(newOrder);
                triggerToast(`Order confirmed for ${newOrder.customerName}! 🎉`);

                saveOrderToSupabase(newOrder).catch((e) => console.warn("Supabase order sync warning:", e));
                try {
                  STORE.dispatchEmailNotification("order_placed", { order: newOrder });
                  STORE.sendWhatsAppNotification("order", newOrder);
                } catch (e) {}
                return;
              }
            } else {
              localStorage.removeItem("cocoon_pending_payment");
            }
          }
        }
      } catch (err) {
        console.warn("Reconcile pending payment error:", err);
      }

      // 2. Fallback check: If customer user has a captured order in the last 2 hours in Supabase but local cart is still full
      try {
        const savedUserRaw = localStorage.getItem("cocoon_customer_user");
        if (savedUserRaw) {
          const user = JSON.parse(savedUserRaw);
          const email = user?.email?.trim().toLowerCase();
          const phone = user?.phone?.replace(/\D/g, "");

          if (email || phone) {
            const res = await fetch(`/api/orders/my-orders?email=${encodeURIComponent(email || "")}&phone=${encodeURIComponent(phone || "")}`);
            if (res.ok) {
              const data = await res.json();
              const orders = data.orders || [];
              const recentPaid = orders.find((o) => {
                const orderTime = o.timestamp || new Date(o.date).getTime();
                const isRecent = Date.now() - orderTime < 3 * 60 * 60 * 1000;
                const isPaid = (o.status === "Processing" || o.status === "Delivered") && o.utr;
                return isRecent && isPaid;
              });

              if (recentPaid) {
                const sessionKey = `cocoon_shown_${recentPaid.id}`;
                if (!sessionStorage.getItem(sessionKey)) {
                  sessionStorage.setItem(sessionKey, "true");
                  sessionStorage.removeItem("cocoon_temp_cart");
                  localStorage.removeItem("cocoon_temp_cart");
                  setCart([]);

                  const recoveredOrder = {
                    id: recentPaid.id,
                    date: recentPaid.date,
                    customerName: recentPaid.customerName,
                    customerPhone: recentPaid.customerPhone,
                    customerEmail: recentPaid.customerEmail || "",
                    address: recentPaid.address,
                    items: recentPaid.items || [],
                    totalAmount: recentPaid.totalAmount,
                    paymentMethod: recentPaid.paymentMethod || "Online Payment (Razorpay)",
                    utr: recentPaid.utr,
                    paymentStatus: `Paid via Razorpay (ID: ${recentPaid.utr})`,
                    status: recentPaid.status || "Processing",
                    notes: recentPaid.notes || ""
                  };

                  setPlacedOrderSummary(recoveredOrder);
                  triggerToast(`Order confirmed for ${recentPaid.customerName}! 🎉`);
                }
              }
            }
          }
        }
      } catch (err) {
        console.warn("Reconcile recent paid orders error:", err);
      }
    };

    reconcilePayments();

    const handleResume = () => {
      if (document.visibilityState === "visible") {
        reconcilePayments();
      }
    };

    document.addEventListener("visibilitychange", handleResume);
    window.addEventListener("focus", handleResume);

    return () => {
      document.removeEventListener("visibilitychange", handleResume);
      window.removeEventListener("focus", handleResume);
    };
  }, []);

  // Update Item Quantity
  const handleUpdateQty = (id, color, delta) => {
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

  // Remove Item from Cart
  const handleRemoveItem = (id, color, name) => {
    const updated = cart.filter((item) => !(item.id === id && item.color === color));
    persistCart(updated);
    triggerToast(`Removed "${name || "Item"}" from your basket.`);
  };

  // Add Recommended Product to Cart
  const handleAddRecommended = (prod) => {
    const color = prod.colors ? prod.colors[0] : "Standard";
    const existingIndex = cart.findIndex((i) => i.id === prod.id && i.color === color);
    let updated;
    if (existingIndex > -1) {
      updated = [...cart];
      updated[existingIndex].quantity += 1;
    } else {
      updated = [...cart, { ...prod, color, quantity: 1 }];
    }
    persistCart(updated);
    triggerToast(`Added ${prod.name} to your basket!`);
  };

  // Live GPS Address Detection
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
        setGpsSuccessNote(`GPS Detected: ${loc.city}, ${loc.state} ${loc.pincode ? `(${loc.pincode})` : ""} • ±${loc.accuracy}m`);
        triggerToast("Live address auto-filled via GPS!");
      }
    } catch (err) {
      console.error(err);
      triggerToast(err.message || "Failed to fetch GPS location. Please check browser permissions.");
    } finally {
      setIsDetectingGps(false);
    }
  };

  // Select From Multiple Saved Addresses
  const handleSelectAddress = (addr) => {
    if (!addr) {
      setSelectedAddressId("new");
      setCustomerForm((prev) => ({
        ...prev,
        address: "",
        city: "",
        pincode: ""
      }));
      triggerToast("Enter new delivery address below");
      return;
    }
    setSelectedAddressId(addr.id);
    setCustomerForm((prev) => ({
      ...prev,
      name: addr.name || prev.name,
      phone: addr.phone || prev.phone,
      email: addr.email || prev.email,
      address: addr.address || "",
      city: addr.city || "",
      pincode: addr.pincode || ""
    }));
    triggerToast(`Selected ${addr.tag || "Home"} address`);
  };

  // Order Calculations with Coupon Discount
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  }, [cart]);

  // Dynamic coupon discount calculation (Percentage, Flat, BOGO)
  const couponDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    const calc = STORE.calculateCouponDiscount(appliedCoupon, cart, subtotal);
    if (calc && calc.valid) {
      return Number(calc.discount || 0);
    }
    return 0;
  }, [appliedCoupon, cart, subtotal]);

  const [isOnlineFreeDelivery, setIsOnlineFreeDelivery] = useState(true);

  useEffect(() => {
    const syncSettings = () => {
      try {
        setIsOnlineFreeDelivery(STORE.isOnlineFreeDeliveryEnabled());
      } catch (e) {}
    };
    syncSettings();
    window.addEventListener("cocoon_store_update", syncSettings);
    return () => window.removeEventListener("cocoon_store_update", syncSettings);
  }, []);

  const isOnlinePayment = paymentMethod === "upi" || paymentMethod === "online" || paymentMethod === "razorpay";

  const shippingCost = useMemo(() => {
    if (subtotal === 0) return 0;
    // Online Payment gives 100% Free Shipping when enabled by admin
    if (isOnlinePayment && isOnlineFreeDelivery) {
      return 0;
    }
    // Standard COD / offline shipping rule (Free above Rs. 999, else Rs. 80)
    return (subtotal - couponDiscount) >= 999 ? 0 : 80;
  }, [subtotal, couponDiscount, isOnlinePayment, isOnlineFreeDelivery]);

  const grandTotal = Math.max(0, subtotal - couponDiscount + shippingCost);

  // Coupon Handlers
  const handleApplyCoupon = async (e) => {
    if (e) e.preventDefault();
    const raw = couponInput.trim().toUpperCase();
    if (!raw) {
      setCouponError("Please enter a coupon code");
      return;
    }
    setCouponError("");

    // 1. Validate with central coupon engine (Supports Flat, %, BOGO)
    const result = STORE.validateCoupon(raw, cart, subtotal);
    if (result && result.valid) {
      setAppliedCoupon({
        ...result.coupon,
        discount: result.discount,
        type: result.type,
        message: result.message
      });
      triggerToast(`✓ ${result.message}`);
      return;
    }

    // 2. Fallback: check 1-time review coupons from Supabase
    try {
      const res = await validateCouponFromSupabase(raw);
      if (res && res.valid) {
        const discountVal = Math.round(subtotal * (Number(res.discountPercent || 15) / 100));
        setAppliedCoupon({
          code: raw,
          discountPercent: res.discountPercent || 15,
          discount: discountVal,
          type: "percentage"
        });
        triggerToast(`✓ Coupon ${raw} applied! Flat ${res.discountPercent || 15}% OFF`);
      } else {
        setCouponError(result?.error || res?.error || "Invalid coupon code.");
      }
    } catch (err) {
      setCouponError(result?.error || "Invalid or ineligible coupon code.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
    triggerToast("Coupon removed.");
  };

  // Cooldown timer for OTP Resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Trigger COD Email OTP (Resend)
  const handleTriggerCodOtp = async () => {
    const cleanEmail = customerForm.email.trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      triggerToast("Please enter your Email address to receive the COD verification code.");
      return;
    }

    setIsSendingOtp(true);
    setOtpError("");
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send",
          email: cleanEmail,
          customerName: customerForm.name.trim() || "Customer",
          totalAmount: grandTotal
        })
      });
      const data = await res.json();
      if (data.success) {
        setOtpToken(data.otpToken);
        setIsOtpModalOpen(true);
        setResendCooldown(60);
        triggerToast(`6-digit code dispatched to ${cleanEmail} via Resend ✉️`);
      } else {
        triggerToast(data.error || "Failed to dispatch verification email. Please verify your email.");
      }
    } catch (err) {
      triggerToast("Error connecting to verification server.");
    } finally {
      setIsSendingOtp(false);
      setIsSubmittingOrder(false);
    }
  };

  // Verify COD Email OTP
  const handleVerifyCodOtp = async (e) => {
    if (e) e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      setOtpError("Please enter the 6-digit verification code from your email");
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError("");
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          email: customerForm.email.trim(),
          otp: otpCode.trim(),
          otpToken
        })
      });
      const data = await res.json();
      if (data.success && data.verified) {
        setIsCodEmailVerified(true);
        setIsOtpModalOpen(false);
        triggerToast("✓ Email verified! Placing Cash on Delivery order...");
        executeOrderFinalization("COD");
      } else {
        setOtpError(data.error || "Incorrect or expired code. Please verify and try again.");
      }
    } catch (err) {
      setOtpError("Error verifying code. Please check your connection.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Order Finalization Execution Helper
  const executeOrderFinalization = async (chosenMethod = "Online Payment (Razorpay)", paymentId = null) => {
    setIsSubmittingOrder(true);
    try {
      const userProfile = {
        name: customerForm.name.trim(),
        phone: customerForm.phone.trim(),
        email: customerForm.email.trim(),
        address: customerForm.address.trim(),
        city: customerForm.city.trim(),
        pincode: customerForm.pincode.trim()
      };

      const addrParts = [userProfile.address];
      if (userProfile.city && !userProfile.address.toLowerCase().includes(userProfile.city.toLowerCase())) {
        addrParts.push(userProfile.city);
      }
      if (userProfile.pincode && !userProfile.address.includes(userProfile.pincode)) {
        addrParts.push(userProfile.pincode);
      }
      const orderDeliveryAddress = addrParts.filter(Boolean).join(", ");

      // Save user profile for next time
      try {
        localStorage.setItem("cocoon_customer_user", JSON.stringify(userProfile));
        if (saveAddressForFuture && userProfile.address) {
          STORE.saveAddress({
            name: userProfile.name,
            phone: userProfile.phone,
            email: userProfile.email,
            address: userProfile.address,
            city: userProfile.city,
            pincode: userProfile.pincode,
            tag: newAddressTag || "Home"
          });
        }
      } catch (e) {}

      const orderId = generateOrderId();
      const isOnlineOrder = chosenMethod.includes("Razorpay") || chosenMethod === "UPI" || chosenMethod.includes("Online");
      const isCodOrder = chosenMethod === "COD";
      const newOrder = {
        id: orderId,
        date: new Date().toISOString(),
        customerName: userProfile.name,
        customerPhone: userProfile.phone,
        customerEmail: userProfile.email || "",
        address: orderDeliveryAddress,
        items: cart.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          color: i.color || "Standard",
          imgUrl: i.imgUrl
        })),
        totalAmount: grandTotal,
        paymentMethod: isOnlineOrder ? "Online Payment (Razorpay)" : "COD",
        utr: paymentId || (utrNumber.trim() || null),
        paymentStatus: isOnlineOrder
          ? `Paid via Razorpay (ID: ${paymentId || "Online"})`
          : "Pending (Pay on Delivery - Email Verified)",
        status: "Processing",
        notes: (customerForm.notes ? customerForm.notes.trim() + " • " : "") +
          (appliedCoupon ? `Coupon: ${appliedCoupon.code} (-₹${couponDiscount}) • ` : "") +
          (isOnlineOrder
            ? `Paid Online via Razorpay [Payment ID: ${paymentId || "Online"}]`
            : `Cash on Delivery (Email OTP Verified)`),
        timestamp: Date.now()
      };

      // 1. Immediately store in local store and UI state so order is 100% saved
      const existingOrders = STORE.getOrders();
      STORE.setOrders([newOrder, ...existingOrders]);

      // 2. Clear cart immediately
      setCart([]);
      try {
        sessionStorage.removeItem("cocoon_temp_cart");
        localStorage.removeItem("cocoon_temp_cart");
        setTimeout(() => {
          window.dispatchEvent(new Event("cocoon_store_update"));
        }, 0);
      } catch (e) {}

      // 3. Immediately display Order Confirmed Screen
      setIsSubmittingOrder(false);
      setPlacedOrderSummary(newOrder);
      triggerToast(`Order placed successfully! Total: ₹${grandTotal}`);

      // 4. Background Database & Notification Syncs (Non-blocking)
      saveOrderToSupabase(newOrder).catch((e) => console.warn("Supabase order sync warning:", e));
      try {
        STORE.dispatchEmailNotification("order_placed", { order: newOrder });
      } catch (e) {}
      try {
        STORE.sendWhatsAppNotification("order", newOrder);
      } catch (e) {}
    } catch (err) {
      console.error("Order finalization error:", err);
      setIsSubmittingOrder(false);
      triggerToast("An error occurred while placing order. Please try again.");
    }
  };

  // Manually verify pending payment on user request
  const handleManualVerifyPending = async () => {
    setIsVerifyingManual(true);
    triggerToast("Checking your payment status with bank... ⏳");
    try {
      const raw = localStorage.getItem("cocoon_pending_payment");
      let pendingOrderId = null;
      let pendingObj = null;

      if (raw) {
        try {
          pendingObj = JSON.parse(raw);
          pendingOrderId = pendingObj?.razorpayOrderId;
        } catch (_) {}
      }

      if (pendingOrderId) {
        const checkRes = await fetch(`/api/payment/check-order?orderId=${encodeURIComponent(pendingOrderId)}`);
        const checkData = await checkRes.json();
        if (checkData && checkData.paid) {
          localStorage.removeItem("cocoon_pending_payment");
          sessionStorage.removeItem("cocoon_temp_cart");
          localStorage.removeItem("cocoon_temp_cart");
          setCart([]);
          setPendingOrderToken(null);

          const orderId = generateOrderId();
          const newOrder = {
            id: orderId,
            date: new Date().toISOString(),
            customerName: pendingObj?.customerForm?.name || customerForm.name || "Valued Customer",
            customerPhone: pendingObj?.customerForm?.phone || customerForm.phone || "",
            customerEmail: pendingObj?.customerForm?.email || customerForm.email || "",
            address: `${pendingObj?.customerForm?.address || customerForm.address || ""}, ${pendingObj?.customerForm?.city || customerForm.city || ""} - ${pendingObj?.customerForm?.pincode || customerForm.pincode || ""}`.replace(/^,\s*|-\s*$/g, "").trim(),
            items: (pendingObj?.cart && pendingObj.cart.length > 0) ? pendingObj.cart : (cart.length > 0 ? cart : [{ id: "crochet-item", name: "Handcrafted Crochet Item", price: 1, quantity: 1, color: "Artisanal" }]),
            totalAmount: pendingObj?.grandTotal || grandTotal || 1,
            paymentMethod: "Online Payment (Razorpay)",
            utr: checkData.paymentId,
            paymentStatus: `Paid via Razorpay (ID: ${checkData.paymentId})`,
            status: "Processing",
            notes: (pendingObj?.customerForm?.notes ? pendingObj.customerForm.notes.trim() + " • " : "") +
              `Paid Online via Razorpay [Payment ID: ${checkData.paymentId}, Order: ${pendingOrderId}]`,
            timestamp: Date.now()
          };

          const existingOrders = STORE.getOrders();
          STORE.setOrders([newOrder, ...existingOrders]);
          setPlacedOrderSummary(newOrder);
          triggerToast(`Payment verified! Order confirmed 🎉`);

          saveOrderToSupabase(newOrder).catch(console.warn);
          try {
            STORE.dispatchEmailNotification("order_placed", { order: newOrder });
            STORE.sendWhatsAppNotification("order", newOrder);
          } catch (e) {}
          return;
        }
      }

      // Secondary check: Find recent paid order for logged in user via my-orders
      const savedUserRaw = localStorage.getItem("cocoon_customer_user");
      let uEmail = customerForm.email || "";
      let uPhone = customerForm.phone || "";
      if (savedUserRaw) {
        try {
          const u = JSON.parse(savedUserRaw);
          uEmail = u.email || uEmail;
          uPhone = u.phone || uPhone;
        } catch (_) {}
      }

      if (uEmail || uPhone) {
        const res = await fetch(`/api/orders/my-orders?email=${encodeURIComponent(uEmail)}&phone=${encodeURIComponent(uPhone)}`);
        if (res.ok) {
          const data = await res.json();
          const paidOrder = data.orders?.find((o) => (o.status === "Processing" || o.status === "Delivered") && o.utr);
          if (paidOrder) {
            localStorage.removeItem("cocoon_pending_payment");
            sessionStorage.removeItem("cocoon_temp_cart");
            localStorage.removeItem("cocoon_temp_cart");
            setCart([]);
            setPlacedOrderSummary(paidOrder);
            setPendingOrderToken(null);
            triggerToast(`Order confirmed for ${paidOrder.customerName}! 🎉`);
            return;
          }
        }
      }

      triggerToast("Payment not detected yet by bank. If debited, please try again in a few seconds.");
    } catch (err) {
      console.error("Manual verify error:", err);
      triggerToast("Could not verify payment right now. Please check internet connection.");
    } finally {
      setIsVerifyingManual(false);
    }
  };

  // Update UTR from the Order Done Success Popup
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

  // Place Order Submit Handler
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      triggerToast("Your basket is empty");
      return;
    }

    if (!customerForm.name.trim() || !customerForm.phone.trim() || !customerForm.address.trim()) {
      triggerToast("Please provide your Name, WhatsApp/Phone, and Delivery Address");
      return;
    }

    if (customerForm.phone.replace(/\D/g, "").length < 10) {
      triggerToast("Please enter a valid 10-digit mobile number");
      return;
    }

    // COD Flow: Requires Email Verification via Resend OTP
    if (isCodAllowed && paymentMethod === "cod") {
      if (!isCodEmailVerified) {
        handleTriggerCodOtp();
        return;
      }
      executeOrderFinalization("COD");
      return;
    }

    // ONLINE RAZORPAY PAYMENT FLOW (UPI, Cards, NetBanking, Wallets)
    if (paymentMethod === "upi" || paymentMethod === "online") {
      setIsSubmittingOrder(true);
      triggerToast("Opening secure Razorpay payment gateway...");

      // Dynamically load Razorpay SDK
      const isLoaded = await new Promise((resolve) => {
        if (typeof window === "undefined") return resolve(false);
        if (window.Razorpay) return resolve(true);
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });

      if (!isLoaded) {
        triggerToast("Failed to load payment gateway. Please check your internet connection.");
        setIsSubmittingOrder(false);
        return;
      }

      try {
        // 1. Create Order on Razorpay Server
        const res = await fetch("/api/payment/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: grandTotal,
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
            notes: {
              customerName: customerForm.name,
              customerPhone: customerForm.phone,
              customerEmail: customerForm.email,
              itemCount: cart.length
            }
          })
        });

        const orderData = await res.json();
        const razorpayOrderId = orderData.id || orderData.orderId;
        if (!res.ok || !razorpayOrderId) {
          throw new Error(orderData.error || "Failed to initiate payment");
        }

        // Persist pending order to localStorage to survive mobile UPI app switches / page reloads
        try {
          const pendingOrderData = {
            razorpayOrderId,
            customerForm: { ...customerForm },
            cart: [...cart],
            grandTotal,
            appliedCoupon,
            couponDiscount,
            createdAt: Date.now()
          };
          localStorage.setItem("cocoon_pending_payment", JSON.stringify(pendingOrderData));
        } catch (e) {}

        let isOrderFinalized = false;
        let pollInterval = null;

        const finalizeAndClear = async (payId) => {
          if (isOrderFinalized) return;
          isOrderFinalized = true;
          if (pollInterval) clearInterval(pollInterval);
          try {
            localStorage.removeItem("cocoon_pending_payment");
          } catch (e) {}
          try {
            if (rzp) rzp.close();
          } catch (e) {}
          await executeOrderFinalization("Online Payment (Razorpay)", payId);
        };

        // 2. Open Razorpay Checkout Modal
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          name: "COCOON 🧶",
          description: "Stitched with love, packed with care 🌸✨",
          image: "https://www.gococoon.store/icon.svg",
          order_id: razorpayOrderId,
          callback_url: `${typeof window !== "undefined" ? window.location.origin : "https://www.gococoon.store"}/api/payment/callback`,
          redirect: true,
          prefill: {
            name: customerForm.name,
            email: customerForm.email || "",
            contact: customerForm.phone
          },
          notes: {
            customerName: customerForm.name,
            customerPhone: customerForm.phone,
            customerEmail: customerForm.email || "",
            address: `${customerForm.address || ""}${customerForm.city ? `, ${customerForm.city}` : ""}${customerForm.pincode ? ` - ${customerForm.pincode}` : ""}`.trim()
          },
          theme: {
            color: "#B06B5B"
          },
          handler: async function (response) {
            // 3. Verify Payment Signature on Server
            try {
              triggerToast("Verifying payment with bank... ⏳");
              const verifyRes = await fetch("/api/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id || razorpayOrderId,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                })
              });

              const verifyData = await verifyRes.json();
              if (verifyRes.ok && (verifyData.success || verifyData.verified)) {
                await finalizeAndClear(response.razorpay_payment_id || verifyData.paymentId);
                return;
              }

              // Fallback verification check directly from Razorpay API
              const checkRes = await fetch(`/api/payment/check-order?orderId=${razorpayOrderId}`);
              const checkData = await checkRes.json();
              if (checkData && checkData.paid) {
                await finalizeAndClear(checkData.paymentId || response.razorpay_payment_id);
                return;
              }

              triggerToast("Payment verification failed. Please contact studio WhatsApp.");
              setIsSubmittingOrder(false);
            } catch (err) {
              console.error("Verification error:", err);
              // Second fallback check
              try {
                const checkRes = await fetch(`/api/payment/check-order?orderId=${razorpayOrderId}`);
                const checkData = await checkRes.json();
                if (checkData && checkData.paid) {
                  await finalizeAndClear(checkData.paymentId || response.razorpay_payment_id);
                  return;
                }
              } catch (e) {}
              setIsSubmittingOrder(false);
              triggerToast("Unable to verify payment. Please contact studio support.");
            }
          },
          modal: {
            ondismiss: async function () {
              // Critical for mobile Google Pay / UPI intent app-switch:
              // When user returns to browser after paying in Google Pay, modal closes immediately.
              // Bank capture can take 1-3 seconds, so DO NOT ABORT polling immediately!
              try {
                triggerToast("Verifying payment with UPI/Bank... ⏳");
                setIsSubmittingOrder(true);
                // Active burst polling: check 8 times over 20 seconds
                for (let attempt = 1; attempt <= 8; attempt++) {
                  if (isOrderFinalized) return;
                  const checkRes = await fetch(`/api/payment/check-order?orderId=${razorpayOrderId}`);
                  const checkData = await checkRes.json();
                  if (checkData && checkData.paid) {
                    await finalizeAndClear(checkData.paymentId);
                    return;
                  }
                  // wait 2.5s before next attempt
                  await new Promise((r) => setTimeout(r, 2500));
                }
              } catch (e) {}

              if (!isOrderFinalized) {
                if (pollInterval) clearInterval(pollInterval);
                setIsSubmittingOrder(false);
                triggerToast("Payment not detected yet. If money was debited, click 'Verify Payment Now' above.");
              }
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (resp) {
          if (pollInterval) clearInterval(pollInterval);
          setIsSubmittingOrder(false);
          triggerToast(resp.error?.description || "Payment failed or declined. Please try again.");
        });
        rzp.open();

        // 3. Background Poller (Checks every 3s for 90s - catches app switches seamlessly)
        let pollCount = 0;
        pollInterval = setInterval(async () => {
          pollCount += 1;
          if (pollCount > 30 || isOrderFinalized) {
            clearInterval(pollInterval);
            return;
          }
          try {
            const checkRes = await fetch(`/api/payment/check-order?orderId=${razorpayOrderId}`);
            const checkData = await checkRes.json();
            if (checkData && checkData.paid) {
              clearInterval(pollInterval);
              await finalizeAndClear(checkData.paymentId);
            }
          } catch (e) {}
        }, 3000);
      } catch (err) {
        console.error("Payment initiation error:", err);
        triggerToast(err.message || "Failed to start payment. Please try again.");
        setIsSubmittingOrder(false);
      }
      return;
    }
  };

  // Recommended Products when cart is empty or below
  const recommendedProducts = useMemo(() => {
    const cartIds = cart.map((i) => i.id);
    return storeProducts.filter((p) => !cartIds.includes(p.id)).slice(0, 4);
  }, [cart, storeProducts]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2623] font-sans antialiased selection:bg-[#F3D5CF] selection:text-[#5B2920] flex flex-col justify-between">
      
      {/* Toast Notification (Top-Center for Clean Non-Intrusive Visibility) */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#2C2623] text-white px-6 py-3 rounded-full shadow-2xl text-xs font-serif flex items-center gap-2 border border-stone-700 animate-fadeIn">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. MASTER UNIFIED NAVBAR & TICKER */}
      <Header cartCountOverride={totalItems} />

      {/* 2. MAIN BASKET CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1 w-full text-left">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-serif text-stone-500 mb-6">
          <Link href="/" className="hover:text-[#B06B5B] transition">Home</Link>
          <span>/</span>
          <span className="text-stone-800 font-semibold">Your Shopping Basket</span>
        </div>

        {/* Page Title & Status */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b border-[#EFE8DD] gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#B06B5B] block">
              Handcrafted Crochet Shop
            </span>
            <h1 className="text-3xl sm:text-4xl font-header font-light text-[#2C2623] mt-1">
              Your Shopping Basket
            </h1>
          </div>

          {cart.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 rounded-full bg-[#FAF0ED] text-[#B06B5B] border border-[#ECCEC7] text-xs font-bold tracking-wider">
                {totalItems} {totalItems === 1 ? "Piece" : "Pieces"} Selected
              </span>
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to empty your entire basket?")) {
                    persistCart([]);
                    triggerToast("Basket emptied.");
                  }
                }}
                className="text-xs text-stone-400 hover:text-rose-600 transition underline cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* ================= IF BASKET IS EMPTY ================= */}
        {cart.length === 0 ? (
          <div className="py-16 text-center max-w-xl mx-auto space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-[#FAF0ED] border-2 border-[#ECCEC7] flex items-center justify-center text-stone-400 shadow-inner"><svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg></div>
            
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-header text-[#2C2623]">
                Your Basket is Currently Empty
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 font-serif leading-relaxed">
                Every piece at Cocoon is slow-knitted knot-by-knot using hypoallergenic milk cotton. Find a treasure to accompany your days.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/#p4-treasures"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#2C2623] hover:bg-[#B06B5B] text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md hover:scale-105"
              >
                <span>Explore Heirloom Catalog</span>
                <span>&rarr;</span>
              </Link>
            </div>

            {/* Recommended Products Grid */}
            {recommendedProducts.length > 0 && (
              <div className="pt-16 border-t border-[#EFE8DD] text-left">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#B06B5B] block mb-1">
                  Recommended For You
                </span>
                <h3 className="text-xl font-header font-bold text-[#2C2623] mb-6">
                  Popular Products You Might Love
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                  {recommendedProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-white rounded-2xl p-3 border border-[#E8DFC9] shadow-2xs hover:shadow-md transition flex flex-col justify-between"
                    >
                      <Link href={`/product/${prod.id}`} className="block group">
                        <div className="aspect-square rounded-xl overflow-hidden bg-stone-100 mb-2.5">
                          <img
                            src={prod.imgUrl}
                            alt={prod.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h4 className="font-header font-bold text-xs text-[#2C2623] line-clamp-1 group-hover:text-[#B06B5B] transition">
                          {prod.name}
                        </h4>
                        <p className="text-xs font-bold text-[#B06B5B] mt-0.5">₹{prod.price}</p>
                      </Link>

                      <button
                        onClick={() => handleAddRecommended(prod)}
                        className="mt-3 w-full py-2 rounded-xl bg-stone-100 hover:bg-[#2C2623] text-stone-800 hover:text-white text-[10px] font-bold uppercase tracking-wider transition cursor-pointer"
                      >
                        + Add to Basket
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ================= IF BASKET HAS ITEMS ================= */
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* LEFT COLUMN: BASKET ITEMS & DELIVERY DESTINATION (7 cols) */}
            <div className="lg:col-span-7 xl:col-span-7 space-y-6">

              {/* PENDING PAYMENT VERIFY BANNER (Surfaces if user paid in UPI app and returned) */}
              {pendingOrderToken && (
                <div className="bg-[#FAF7F2] border-2 border-[#B06B5B] rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-header font-bold text-sm text-[#2C2623] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block"></span>
                      Already Paid in Google Pay / UPI?
                    </p>
                    <p className="text-xs text-[#2C2623]/70 font-sans">
                      If money was deducted from your account, click here to verify & confirm your order immediately.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleManualVerifyPending}
                    disabled={isVerifyingManual}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#B06B5B] hover:bg-[#964B44] text-white text-xs font-bold rounded-full uppercase tracking-wider transition shadow cursor-pointer text-center"
                  >
                    {isVerifyingManual ? "Checking... ⏳" : "Verify Payment Now ✓"}
                  </button>
                </div>
              )}
              
              {/* 1. Basket Items List Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#FAF4ED]">
                  <h3 className="font-header text-lg sm:text-xl font-bold text-[#2C2623]">
                    Artisan Pieces ({totalItems})
                  </h3>
                  <span className="text-xs text-stone-400 font-serif">
                    All-India Express Dispatch
                  </span>
                </div>

                <div className="divide-y divide-[#FAF4ED] space-y-6">
                  {cart.map((item) => (
                    <div
                      key={`${item.id}-${item.color}`}
                      className="pt-6 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
                    >
                      {/* Product Thumbnail & Details */}
                      <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
                        <Link
                          href={`/product/${item.id}`}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/80 shadow-2xs group cursor-pointer block"
                        >
                          <img
                            src={item.imgUrl}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>

                        <div className="space-y-1 min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B06B5B] block">
                            {item.category || "Handmade Crochet"}
                          </span>
                          <Link
                            href={`/product/${item.id}`}
                            className="font-header font-bold text-base sm:text-lg text-[#2C2623] hover:text-[#B06B5B] transition truncate block"
                          >
                            {item.name}
                          </Link>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#FAF4ED] border border-[#EAE1D3] text-[10px] font-medium text-stone-600">
                              Color: {item.color || "Standard"}
                            </span>
                            <span className="text-xs font-bold text-stone-900">
                              ₹{item.price} each
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls & Line Total */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-stone-100">
                        {/* Stepper */}
                        <div className="flex items-center border border-stone-200 rounded-full bg-stone-50 overflow-hidden shadow-2xs">
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(item.id, item.color, -1)}
                            className="w-8 h-8 flex items-center justify-center text-sm font-bold text-stone-600 hover:bg-stone-200 transition cursor-pointer"
                            title="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-9 text-center text-xs font-bold font-sans text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(item.id, item.color, 1)}
                            className="w-8 h-8 flex items-center justify-center text-sm font-bold text-stone-600 hover:bg-stone-200 transition cursor-pointer"
                            title="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Line Total */}
                        <div className="text-right min-w-[70px]">
                          <span className="text-sm sm:text-base font-bold text-[#2C2623] block">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id, item.color, item.name)}
                          className="w-8 h-8 rounded-full hover:bg-rose-50 text-stone-400 hover:text-rose-600 flex items-center justify-center transition cursor-pointer"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-[#FAF4ED] flex items-center justify-between">
                  <Link
                    href="/#p4-treasures"
                    className="text-xs font-bold text-[#B06B5B] hover:underline flex items-center gap-1.5"
                  >
                    <span>&larr;</span>
                    <span>Continue Browsing Boutique</span>
                  </Link>

                  <span className="text-xs text-stone-500 font-serif">
                    Subtotal: <strong>₹{subtotal}</strong>
                  </span>
                </div>
              </div>

              {/* 2. Delivery Destination & Contact Details Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-xs space-y-5 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-[#FAF4ED]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#B06B5B] block">
                      Shipping Details
                    </span>
                    <h3 className="font-header text-lg sm:text-xl font-bold text-[#2C2623] mt-0.5">
                      Delivery Destination & Contact
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleFetchGpsAddress}
                    disabled={isDetectingGps}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold cursor-pointer disabled:opacity-50 transition"
                    title="Auto-fill address using device GPS"
                  >
                    <span>{isDetectingGps ? "Detecting GPS..." : "Auto-Detect GPS"}</span>
                  </button>
                </div>

                {gpsSuccessNote && (
                  <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
                    ✓ {gpsSuccessNote}
                  </div>
                )}

                {/* Multiple Saved Addresses Quick Selector */}
                {savedAddresses.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-[#FAF4ED] border border-[#E8DFC9] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#B06B5B]">
                        Deliver To Saved Address ({savedAddresses.length})
                      </span>
                      <Link
                        href="/profile"
                        className="text-[11px] font-bold text-stone-500 hover:text-[#B06B5B] underline"
                      >
                        Manage in Profile
                      </Link>
                    </div>

                    <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                      {savedAddresses.map((addr) => (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => handleSelectAddress(addr)}
                          className={`px-3.5 py-2.5 rounded-xl text-left border text-xs shrink-0 transition cursor-pointer max-w-[210px] ${
                            selectedAddressId === addr.id
                              ? "bg-white border-[#B06B5B] ring-2 ring-[#B06B5B]/20 shadow-xs"
                              : "bg-white/80 border-stone-200 text-stone-600 hover:bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="px-2 py-0.5 rounded text-[9px] uppercase font-bold bg-[#FAF0ED] text-[#B06B5B]">
                              {addr.tag || "Home"}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[9px] font-bold text-emerald-700">Default</span>
                            )}
                          </div>
                          <p className="truncate text-xs font-bold text-[#2C2623]">{addr.name}</p>
                          <p className="truncate text-[10px] text-stone-500 font-serif">{addr.address}</p>
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() => handleSelectAddress(null)}
                        className={`px-3.5 py-2.5 rounded-xl border text-xs shrink-0 transition cursor-pointer flex flex-col items-center justify-center min-w-[100px] ${
                          selectedAddressId === "new"
                            ? "bg-white border-[#B06B5B] text-[#B06B5B] font-bold shadow-xs"
                            : "bg-white/60 border-dashed border-stone-300 text-stone-500 hover:bg-white"
                        }`}
                      >
                        <span className="text-xs font-bold">+ New</span>
                        <span className="text-[10px] text-stone-400">Address</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Name & WhatsApp Phone in 2 Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerForm.name}
                      onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                      placeholder="e.g. Radhika Sharma"
                      className="w-full bg-[#FAF7F2] border border-[#E8DFC9] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2623] focus:outline-none focus:border-[#B06B5B]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      WhatsApp / Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerForm.phone}
                      onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                      placeholder="e.g. 9876543210 (For dispatch updates)"
                      className="w-full bg-[#FAF7F2] border border-[#E8DFC9] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2623] focus:outline-none focus:border-[#B06B5B]"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Email Address (For invoice & delivery receipt)
                  </label>
                  <input
                    type="email"
                    value={customerForm.email}
                    onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                    placeholder="e.g. radhika@gmail.com"
                    className="w-full bg-[#FAF7F2] border border-[#E8DFC9] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2623] focus:outline-none focus:border-[#B06B5B]"
                  />
                </div>

                {/* Street Address */}
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Delivery Address *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={customerForm.address}
                    onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                    placeholder="House / Flat No., Street, Landmark, Area"
                    className="w-full bg-[#FAF7F2] border border-[#E8DFC9] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2623] focus:outline-none focus:border-[#B06B5B]"
                  ></textarea>
                </div>

                {/* City & Pincode in 2 Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={customerForm.city}
                      onChange={(e) => setCustomerForm({ ...customerForm, city: e.target.value })}
                      placeholder="e.g. New Delhi / Mumbai / Bengaluru"
                      className="w-full bg-[#FAF7F2] border border-[#E8DFC9] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2623] focus:outline-none focus:border-[#B06B5B]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={customerForm.pincode}
                      onChange={(e) => setCustomerForm({ ...customerForm, pincode: e.target.value })}
                      placeholder="e.g. 282001"
                      className="w-full bg-[#FAF7F2] border border-[#E8DFC9] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2623] focus:outline-none focus:border-[#B06B5B]"
                    />
                  </div>
                </div>

                {/* Save Address Checkbox */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 pb-1 border-t border-[#FAF4ED]">
                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={saveAddressForFuture}
                      onChange={(e) => setSaveAddressForFuture(e.target.checked)}
                      className="accent-[#B06B5B] w-4 h-4 rounded cursor-pointer"
                    />
                    <span>Save this address for future orders</span>
                  </label>

                  {saveAddressForFuture && (
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-stone-500 text-[11px]">Tag as:</span>
                      {["Home", "Work", "Other"].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setNewAddressTag(tag)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition cursor-pointer ${
                            newAddressTag === tag
                              ? "bg-[#B06B5B] text-white shadow-2xs"
                              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Custom Note */}
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Custom Note / Gift Message (Optional)
                  </label>
                  <input
                    type="text"
                    value={customerForm.notes}
                    onChange={(e) => setCustomerForm({ ...customerForm, notes: e.target.value })}
                    placeholder="e.g. Please wrap with extra ribbon for birthday"
                    className="w-full bg-[#FAF7F2] border border-[#E8DFC9] rounded-xl px-3.5 py-2 text-xs text-[#2C2623] focus:outline-none focus:border-[#B06B5B]"
                  />
                </div>
              </div>

              {/* 3. Artisan Promise Card */}
              <div className="bg-[#FAF4ED] rounded-3xl p-6 border border-[#E8DFC9] flex flex-col sm:flex-row items-center gap-5 text-left">
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#ECCEC7] flex items-center justify-center text-[#B06B5B] shrink-0 shadow-xs">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h4 className="font-header font-bold text-sm text-[#2C2623]">
                    Slow-Knitted with Care & Patience
                  </h4>
                  <p className="text-xs text-stone-600 font-serif leading-relaxed">
                    Mehak hand-knits each knot from premium hypoallergenic milk cotton. Please allow 7 business days for creation before express courier dispatch.
                  </p>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: ORDER SUMMARY & PAYMENT CTA (5 cols) */}
            <div className="lg:col-span-5 xl:col-span-5 space-y-6 lg:sticky lg:top-24">
              
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-md space-y-6 text-left">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#B06B5B] block">
                    Express Checkout
                  </span>
                  <h3 className="text-2xl font-header font-light text-[#2C2623] mt-0.5">
                    Order Summary
                  </h3>
                </div>

                {/* Coupon / Promo Code Input Box */}
                <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E8DFC9] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#2C2623] flex items-center gap-1.5">
                      <span>🏷️ Have a Coupon Code?</span>
                    </span>
                    {appliedCoupon && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                        {appliedCoupon.code} Applied
                      </span>
                    )}
                  </div>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl text-xs text-emerald-900">
                      <div>
                        <strong>{appliedCoupon.code}</strong>{" "}
                        <span className="text-[11px] font-sans text-emerald-700">
                          {appliedCoupon.type === "bogo"
                            ? `(BOGO: -₹${couponDiscount})`
                            : appliedCoupon.type === "flat"
                            ? `(Flat ₹${appliedCoupon.discountAmount || couponDiscount} OFF)`
                            : `(Flat ${appliedCoupon.discountPercent}% OFF)`}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value.toUpperCase());
                          setCouponError("");
                        }}
                        placeholder="e.g. BOGO, FLAT100, COCOON10"
                        className="flex-1 bg-white border border-[#DDD3C4] rounded-xl px-3 py-1.5 text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-[#B06B5B]"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-3.5 py-1.5 bg-[#2C2623] hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                  )}

                  {couponError && (
                    <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>
                  )}
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-3 pb-5 border-b border-[#FAF4ED] text-xs font-serif">
                  <div className="flex justify-between text-stone-600">
                    <span>Items Subtotal ({totalItems}):</span>
                    <span className="font-sans font-bold text-stone-900">₹{subtotal}</span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200">
                      <span>Coupon Discount ({appliedCoupon?.code}):</span>
                      <span>-₹{couponDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-stone-600">
                    <span>Packaging:</span>
                    <span className="text-emerald-700 font-bold">Complimentary Dustbag (₹0)</span>
                  </div>

                  <div className="flex justify-between text-stone-600">
                    <span>Express Courier Transit:</span>
                    {shippingCost === 0 ? (
                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                        <span className="line-through text-stone-400 text-xs">₹80</span>
                        <span>FREE {isOnlinePayment && isOnlineFreeDelivery ? "(Online Payment Benefit) ✓" : "✓"}</span>
                      </div>
                    ) : (
                      <div className="text-right">
                        <span className="font-sans font-bold text-stone-900">₹{shippingCost}</span>
                        {isOnlineFreeDelivery && (
                          <span className="block text-[10px] text-emerald-600 font-bold">
                            (Select Online Payment to get ₹0 Free Delivery!)
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#FAF4ED] flex justify-between items-baseline">
                    <span className="font-sans font-bold text-stone-800 text-sm">Estimated Total:</span>
                    <span className="text-2xl font-header font-bold text-[#2C2623]">
                      ₹{grandTotal}
                    </span>
                  </div>
                </div>

                {/* Payment Method Selector (Dynamically Controlled by Admin) */}
                <div className="space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2C2623] uppercase tracking-wider">
                      Payment Method
                    </span>
                    {isCodAllowed ? (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        COD Available
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        Prepaid Only
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {/* Option 1: Instant Online Payment (Razorpay UPI, Cards, NetBanking) */}
                    <div
                      onClick={() => setPaymentMethod("upi")}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        paymentMethod === "upi"
                          ? "bg-white border-[#B06B5B] ring-2 ring-[#B06B5B]/20 shadow-xs"
                          : "bg-[#FAF7F2] border-[#E8DFC9] hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          paymentMethod === "upi" ? "border-[#B06B5B] bg-[#B06B5B]" : "border-stone-400 bg-white"
                        }`}>
                          {paymentMethod === "upi" && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#2C2623] flex items-center gap-1.5 flex-wrap">
                            <span>UPI & Card Payment</span>
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">Instant</span>
                            {isOnlineFreeDelivery && (
                              <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                                FREE Delivery (₹0)
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-stone-500 font-serif">GPay • PhonePe • Paytm • Cards • NetBanking</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#B06B5B] font-mono">₹{grandTotal}</span>
                    </div>

                    {/* Online Gateway Info Banner (Shown when UPI/Online is selected) */}
                    {paymentMethod === "upi" && (
                      <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E8DFC9] space-y-2 animate-fadeIn text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-xs">🔒</span>
                          <span className="text-xs font-bold text-stone-800 font-serif">100% Secured by Razorpay</span>
                          <span className="text-[9px] font-semibold bg-[#EFE8DD] text-stone-600 px-1.5 py-0.5 rounded ml-auto">Encrypted 256-Bit</span>
                        </div>
                        <p className="text-[11px] text-stone-600 font-serif leading-relaxed">
                          Pay directly with any UPI App (Google Pay, PhonePe, Paytm, BHIM) or Credit/Debit Card. Your order will be confirmed immediately once payment succeeds.
                        </p>
                        <div className="flex items-center gap-2 pt-1 flex-wrap">
                          <span className="text-[10px] bg-white border border-stone-200 px-2 py-0.5 rounded font-mono font-bold text-stone-700">UPI</span>
                          <span className="text-[10px] bg-white border border-stone-200 px-2 py-0.5 rounded font-mono font-bold text-stone-700">GPay</span>
                          <span className="text-[10px] bg-white border border-stone-200 px-2 py-0.5 rounded font-mono font-bold text-stone-700">PhonePe</span>
                          <span className="text-[10px] bg-white border border-stone-200 px-2 py-0.5 rounded font-mono font-bold text-stone-700">Paytm</span>
                          <span className="text-[10px] bg-white border border-stone-200 px-2 py-0.5 rounded font-mono font-bold text-stone-700">Cards</span>
                        </div>
                      </div>
                    )}

                    {/* Option 2: Cash on Delivery (COD) */}
                    {isCodAllowed && (
                      <div
                        onClick={() => setPaymentMethod("cod")}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          paymentMethod === "cod"
                            ? "bg-white border-[#B06B5B] ring-2 ring-[#B06B5B]/20 shadow-xs"
                            : "bg-[#FAF7F2] border-[#E8DFC9] hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            paymentMethod === "cod" ? "border-[#B06B5B] bg-[#B06B5B]" : "border-stone-400 bg-white"
                          }`}>
                            {paymentMethod === "cod" && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#2C2623]">Cash on Delivery (COD)</p>
                            <p className="text-[10px] text-stone-500 font-serif">Pay ₹{grandTotal} upon doorstep delivery</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full shrink-0">
                          Pay on Arrival
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Legal & Policy Agreement Consent */}
                <div className="pt-2 pb-1">
                  <label className="flex items-start gap-2.5 text-xs text-stone-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      required
                      defaultChecked
                      className="accent-[#B06B5B] w-4 h-4 rounded cursor-pointer shrink-0 mt-0.5"
                    />
                    <span className="font-serif leading-snug text-stone-600">
                      I agree to COCOON&apos;s{" "}
                      <Link href="/terms" target="_blank" className="text-[#B06B5B] font-sans font-semibold underline underline-offset-2 hover:text-[#964B44]">
                        Terms of Service
                      </Link>{" "}
                      &{" "}
                      <Link href="/privacy" target="_blank" className="text-[#B06B5B] font-sans font-semibold underline underline-offset-2 hover:text-[#964B44]">
                        Privacy Policy
                      </Link>.
                    </span>
                  </label>
                </div>

                {/* Submit CTA Button */}
                <div className="space-y-2.5">
                  <button
                    type="submit"
                    disabled={isSubmittingOrder}
                    className="w-full py-4 rounded-2xl bg-[#B06B5B] hover:bg-[#964B44] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>
                      {isSubmittingOrder
                        ? "Opening Payment Window..."
                        : (paymentMethod === "upi"
                            ? `🔒 Pay ₹${grandTotal} via UPI / Card & Confirm Order →`
                            : `Confirm COD Order (₹${grandTotal}) →`)}
                    </span>
                  </button>

                  <p className="text-[11px] text-center text-stone-500 font-serif leading-tight">
                    {paymentMethod === "upi"
                      ? `Secure Razorpay payment gateway • Order confirms immediately after payment.`
                      : `Cash payable upon delivery: ₹${grandTotal}. Order confirmation sent to WhatsApp & Email.`}
                  </p>
                </div>

                {/* Studio Guarantee Badges */}
                <div className="pt-4 border-t border-[#FAF4ED] grid grid-cols-2 gap-2 text-[10px] text-stone-500 font-serif">
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>100% Milk Cotton</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Plastic-Free Wrap</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>100% Handcrafted</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Direct UPI & COD Secured</span>
                  </div>
                </div>

              </div>

            </div>

          </form>
        )}

      </main>

      {/* ================= 3. PLACED ORDER SUCCESS MODAL ================= */}
      {placedOrderSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center space-y-5 shadow-2xl border border-[#EFE8DD]">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs"><svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg></div>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#B06B5B] block">
                Order Confirmed
              </span>
              <h3 className="text-2xl font-header font-bold text-[#2C2623]">
                Thank You, {placedOrderSummary.customerName}!
              </h3>
              <p className="text-xs text-stone-500 font-serif">
                Order <strong>{placedOrderSummary.id}</strong> has been received by Mehak. Slow-knitting begins knot-by-knot.
              </p>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-2xl text-left text-xs space-y-2 border border-[#EAE1D3]">
              {placedOrderSummary.paymentMethod === "COD" ? (
                <div className="space-y-1">
                  <div className="flex justify-between items-center font-bold text-stone-800">
                    <span>Payment Mode:</span>
                    <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-semibold">Cash on Delivery</span>
                  </div>
                  <div className="flex justify-between items-center text-stone-700 pt-1 border-t border-stone-200/60">
                    <span className="font-semibold">Payable upon Delivery:</span>
                    <span className="text-stone-900 font-bold text-sm">₹{placedOrderSummary.totalAmount}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex justify-between items-center font-bold text-stone-800">
                    <span>Payment Mode:</span>
                    <span className="text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                      Online Payment (Razorpay)
                    </span>
                  </div>
                  {placedOrderSummary.utr && (
                    <div className="flex justify-between items-center text-[11px] text-stone-600 bg-stone-50 p-2 rounded-xl border border-stone-200">
                      <strong>Payment Ref ID:</strong>
                      <span className="font-mono font-bold text-stone-900 select-all">{placedOrderSummary.utr}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-stone-700 pt-1 border-t border-stone-200/60">
                    <span className="font-semibold">Payment Status:</span>
                    <span className="text-emerald-700 font-bold text-xs">Paid Online ✓</span>
                  </div>
                  <div className="flex justify-between items-center text-stone-700 pt-1 border-t border-stone-200/60">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="text-emerald-700 font-bold text-sm">₹{placedOrderSummary.totalAmount} ✓</span>
                  </div>
                </div>
              )}
              {placedOrderSummary.awbCode && (
                <div className="flex justify-between items-center text-[11px] text-blue-900 bg-blue-50/80 p-2.5 rounded-xl border border-blue-200">
                  <div className="space-y-0.5 text-left">
                    <span className="font-bold block text-blue-950">🚚 Courier: {placedOrderSummary.courierName || "Express Dispatch"}</span>
                    <span className="font-mono text-[10px] text-blue-900">AWB No: <strong>{placedOrderSummary.awbCode}</strong></span>
                  </div>
                  <span className="text-[10px] bg-blue-600 text-white px-2.5 py-1 rounded-full font-bold">
                    Dispatched
                  </span>
                </div>
              )}
              <div className="text-[11px] text-stone-600">
                <strong>Items:</strong> {placedOrderSummary.items?.map((i) => `${i.name} (${i.color})`).join(", ")}
              </div>
              <div className="text-[11px] text-stone-500">
                <strong>Delivery to:</strong> {placedOrderSummary.address}
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-800 text-[11px] font-medium border border-emerald-200">
              Order confirmation and tracking updates have been sent to your registered contact details.
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>🖨️ Print / Save Tax Invoice</span>
              </button>
              <Link
                href="/profile"
                className="w-full py-3 rounded-xl bg-[#526B57] hover:bg-[#405444] text-white text-xs font-bold uppercase tracking-wider block text-center transition"
              >
                Track in My Account &rarr;
              </Link>
              <button
                onClick={() => setPlacedOrderSummary(null)}
                className="w-full py-2.5 rounded-xl text-stone-500 hover:text-stone-800 text-xs font-bold transition cursor-pointer"
              >
                Continue Browsing Boutique
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 4. CASH ON DELIVERY EMAIL OTP MODAL (VIA RESEND) ================= */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center space-y-5 shadow-2xl border border-[#EFE8DD]">
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 text-[#B06B5B] flex items-center justify-center border border-amber-200 text-2xl">
              ✉️
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#B06B5B] block">
                Verification Required
              </span>
              <h3 className="text-xl font-header font-bold text-[#2C2623]">
                Verify Your Email for COD
              </h3>
              <p className="text-xs text-stone-600 font-serif leading-relaxed">
                We sent a 6-digit code to <strong className="text-stone-900">{customerForm.email}</strong> to verify this Cash on Delivery order of <strong>₹{grandTotal}</strong>.
              </p>
            </div>

            <form onSubmit={handleVerifyCodOtp} className="space-y-4 pt-1">
              <div className="space-y-1">
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  required
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value.replace(/\D/g, ""));
                    setOtpError("");
                  }}
                  placeholder="• • • • • •"
                  className="w-full text-center text-2xl font-mono tracking-[0.4em] py-3 bg-[#FAF7F2] border-2 border-[#DDD3C4] rounded-2xl text-stone-900 focus:outline-none focus:border-[#B06B5B]"
                />
                {otpError && (
                  <p className="text-xs text-rose-600 font-medium pt-1">{otpError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isVerifyingOtp || otpCode.length !== 6}
                className="w-full py-3.5 rounded-xl bg-[#B06B5B] hover:bg-[#964B44] text-white text-xs font-bold uppercase tracking-wider shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                {isVerifyingOtp ? "Verifying Code..." : "Verify & Confirm COD Order →"}
              </button>

              <div className="flex items-center justify-between text-xs text-stone-500 pt-2">
                <button
                  type="button"
                  disabled={resendCooldown > 0 || isSendingOtp}
                  onClick={handleTriggerCodOtp}
                  className="hover:text-[#B06B5B] underline disabled:opacity-40 cursor-pointer"
                >
                  {resendCooldown > 0 ? `Resend Code (${resendCooldown}s)` : "Resend Code via Resend"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOtpModalOpen(false)}
                  className="text-stone-500 hover:text-stone-800 cursor-pointer"
                >
                  Cancel / Edit Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MASTER STUDIO FOOTER */}
      <Footer />

    </div>
  );
}
