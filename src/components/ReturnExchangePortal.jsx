"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { STORE } from "@/data/store";
import { uploadMediaToSupabase } from "@/lib/supabase";

export default function ReturnExchangePortal({ initialOrderId = "" }) {
  const [activePortalTab, setActivePortalTab] = useState("submit"); // "submit" | "track" | "eligibility"
  
  // Lookup / Step State
  const [orderIdInput, setOrderIdInput] = useState(initialOrderId);
  const [contactInput, setContactInput] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [foundOrder, setFoundOrder] = useState(null);
  const [lookupAttempted, setLookupAttempted] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [requestType, setRequestType] = useState("exchange"); // "exchange" | "replacement" | "refund"
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [customItemText, setCustomItemText] = useState("");
  const [reason, setReason] = useState("Damaged in courier transit / Outer packaging torn");
  const [description, setDescription] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // COD Refund Details
  const [refundMethod, setRefundMethod] = useState("upi"); // "upi" | "bank"
  const [upiId, setUpiId] = useState("");
  const [bankAccount, setBankAccount] = useState({
    accountHolder: "",
    accountNo: "",
    confirmAccountNo: "",
    ifsc: "",
    bankName: ""
  });

  // Submission Results
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  // Tracking Existing Request State
  const [trackQuery, setTrackQuery] = useState("");
  const [trackedRequest, setTrackedRequest] = useState(null);
  const [trackAttempted, setTrackAttempted] = useState(false);

  // Toast / Status Message
  const [toastMessage, setToastMessage] = useState(null);
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Pre-load user session & orderId from query if provided
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("cocoon_customer_user");
      if (savedUser) {
        const u = JSON.parse(savedUser);
        if (u.name) setCustomerName(u.name);
        if (u.email) setCustomerEmail(u.email);
        if (u.phone) {
          setCustomerPhone(u.phone);
          if (!contactInput) setContactInput(u.phone);
        } else if (u.email && !contactInput) {
          setContactInput(u.email);
        }
      }
    } catch (e) {}

    if (initialOrderId) {
      setOrderIdInput(initialOrderId);
      handleFindOrder(initialOrderId);
    }
  }, [initialOrderId]);

  // Order Finder Logic
  const handleFindOrder = async (overrideId) => {
    const targetId = (overrideId || orderIdInput || "").trim();
    if (!targetId) {
      triggerToast("Please enter an Order ID (e.g. ORD-...)");
      return;
    }
    setIsLookingUp(true);
    setLookupAttempted(true);

    try {
      // 1. Direct local store lookup
      let order = STORE.findOrderById(targetId);

      // 2. Fallback search through all orders in local store
      if (!order) {
        const all = STORE.getOrders();
        order = all.find(
          (o) =>
            o.id?.toLowerCase() === targetId.toLowerCase() ||
            o.id?.replace(/\D/g, "") === targetId.replace(/\D/g, "")
        );
      }

      // 3. Fallback search through server API database
      if (!order) {
        try {
          const res = await fetch(`/api/orders/my-orders?orderId=${encodeURIComponent(targetId)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.orders) && data.orders.length > 0) {
              order = data.orders[0];
              const cur = STORE.getOrders();
              if (!cur.some((o) => o.id === order.id)) {
                STORE.setOrders([order, ...cur]);
              }
            }
          }
        } catch (apiErr) {
          console.warn("Server order lookup fallback notice:", apiErr);
        }
      }

      if (order) {
        setFoundOrder(order);
        if (order.customerName && !customerName) setCustomerName(order.customerName);
        if (order.customerEmail && !customerEmail) setCustomerEmail(order.customerEmail);
        if (order.customerPhone && !customerPhone) setCustomerPhone(order.customerPhone);

        // Preselect all items by default
        if (Array.isArray(order.items) && order.items.length > 0) {
          setSelectedItemIds(order.items.map((_, i) => i));
        }

        // If order was COD, default to refund method UPI
        if (order.paymentMethod?.toLowerCase().includes("cod") || order.paymentMethod?.toLowerCase().includes("cash")) {
          setRequestType("exchange");
        }
        triggerToast("✓ Order details successfully retrieved!");
      } else {
        setFoundOrder(null);
        triggerToast("Order not found in instant cache. You can still file with your order details below.");
      }
    } catch (err) {
      console.warn("Order lookup error:", err);
    } finally {
      setIsLookingUp(false);
    }
  };

  // Media File Handling (Unboxing Video / Defect Photos)
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Validate size (max 25MB each)
    const validFiles = [];
    const previews = [...mediaPreviews];

    for (const f of files) {
      if (f.size > 25 * 1024 * 1024) {
        triggerToast(`File "${f.name}" is over 25MB limit. Please choose a smaller clip.`);
        continue;
      }
      validFiles.push(f);
      previews.push({
        name: f.name,
        type: f.type.startsWith("video") ? "video" : "image",
        url: URL.createObjectURL(f),
        file: f
      });
    }

    setMediaFiles((prev) => [...prev, ...validFiles]);
    setMediaPreviews(previews);
  };

  const removeMedia = (index) => {
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Item Checkbox Toggle
  const toggleItemSelection = (index) => {
    setSelectedItemIds((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Submission Handler
  const handleSubmitReturn = async (e) => {
    e.preventDefault();

    const cleanOrderId = (foundOrder?.id || orderIdInput || "").trim();
    if (!cleanOrderId) {
      triggerToast("Please provide a valid Order ID");
      return;
    }
    if (!customerName.trim()) {
      triggerToast("Please provide your name");
      return;
    }
    if (!customerEmail.trim() && !customerPhone.trim()) {
      triggerToast("Please provide an email or phone number for updates");
      return;
    }

    // Determine target items
    let targetItems = [];
    if (foundOrder && Array.isArray(foundOrder.items)) {
      targetItems = foundOrder.items.filter((_, idx) => selectedItemIds.includes(idx));
      if (targetItems.length === 0 && !customItemText.trim()) {
        triggerToast("Please select at least one item from your order");
        return;
      }
    } else {
      if (!customItemText.trim()) {
        triggerToast("Please specify which item you wish to return or exchange");
        return;
      }
      targetItems = [{ name: customItemText.trim(), quantity: 1 }];
    }

    // COD refund validation
    let refundInfo = null;
    if (requestType === "refund") {
      if (refundMethod === "upi") {
        if (!upiId.trim() || !upiId.includes("@")) {
          triggerToast("Please enter a valid UPI ID (e.g. yourname@oksbi or 9876543210@paytm)");
          return;
        }
        refundInfo = { method: "upi", upiId: upiId.trim() };
      } else {
        if (!bankAccount.accountNo || bankAccount.accountNo !== bankAccount.confirmAccountNo) {
          triggerToast("Bank account numbers do not match");
          return;
        }
        if (!bankAccount.ifsc || !bankAccount.accountHolder) {
          triggerToast("Please enter complete Bank Account details and IFSC code");
          return;
        }
        refundInfo = {
          method: "bank",
          accountHolder: bankAccount.accountHolder.trim(),
          accountNo: bankAccount.accountNo.trim(),
          ifsc: bankAccount.ifsc.trim().toUpperCase(),
          bankName: bankAccount.bankName.trim()
        };
      }
    }

    setIsSubmitting(true);
    setIsUploading(true);

    try {
      // 1. Upload media files if any
      const uploadedProofUrls = [];
      for (const item of mediaPreviews) {
        if (item.file) {
          try {
            const url = await uploadMediaToSupabase(item.file);
            if (url) uploadedProofUrls.push(url);
          } catch (upErr) {
            console.warn("Upload proof error:", upErr);
          }
        }
      }

      // 2. Create and store Return Request
      const ticketId = `RET-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      
      const newRequest = {
        id: ticketId,
        orderId: cleanOrderId,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        requestType,
        items: targetItems,
        reason,
        description: description.trim(),
        proofUrls: uploadedProofUrls,
        preferredResolution: requestType,
        refundDetails: refundInfo,
        status: "Under Review"
      };

      STORE.addReturnRequest(newRequest);

      // 3. Dispatch Email Notification via /api/email/send
      try {
        await fetch("/api/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "return_request",
            payload: { returnRequest: newRequest }
          })
        });
      } catch (mailErr) {
        console.warn("Email dispatch error:", mailErr);
      }

      setSubmittedTicket(newRequest);
      triggerToast("✓ Request registered! Lead artisan Mehak will review within 48 hours.");
    } catch (err) {
      console.error("Submission failed:", err);
      triggerToast("An error occurred while submitting your request. Please message our studio WhatsApp.");
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  // Track Request Handler
  const handleTrackRequest = async (e) => {
    if (e) e.preventDefault();
    const q = trackQuery.trim().toUpperCase();
    if (!q) {
      triggerToast("Please enter a Ticket ID (RET-...) or Order ID");
      return;
    }
    setTrackAttempted(true);
    let all = STORE.getReturnRequests();
    let match = all.find(
      (r) =>
        r.id?.toUpperCase() === q ||
        r.orderId?.toUpperCase() === q ||
        r.id?.replace(/\D/g, "") === q.replace(/\D/g, "")
    );

    if (!match) {
      try {
        const res = await fetch("/api/store/data?type=returns");
        if (res.ok) {
          const data = await res.json();
          const serverReturns = data.returns || [];
          if (Array.isArray(serverReturns) && serverReturns.length > 0) {
            STORE.setReturnRequests(serverReturns);
            match = serverReturns.find(
              (r) =>
                r.id?.toUpperCase() === q ||
                r.orderId?.toUpperCase() === q ||
                r.id?.replace(/\D/g, "") === q.replace(/\D/g, "")
            );
          }
        }
      } catch (err) {
        console.warn("Returns tracking sync error:", err);
      }
    }

    setTrackedRequest(match || null);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8DFC9] shadow-sm overflow-hidden text-left font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2C2623] text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-medium animate-fadeIn border border-[#B06B5B]/30 flex items-center gap-2">
          <span>🌸</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Portal Navigation Tabs */}
      <div className="bg-[#FAF7F2] border-b border-[#E8DFC9] px-6 sm:px-8 pt-6 pb-0 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-sans font-black uppercase tracking-[0.25em] text-[#B06B5B] block mb-1">
            Artisan Support &amp; Protection
          </span>
          <h2 className="text-xl sm:text-2xl font-header font-bold text-[#2C2623]">
            Return, Replacement &amp; Exchange Engine
          </h2>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-200/60 rounded-2xl text-xs font-bold uppercase tracking-wider font-sans mb-4 sm:mb-0">
          <button
            type="button"
            onClick={() => setActivePortalTab("submit")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activePortalTab === "submit"
                ? "bg-white text-[#2C2623] shadow-xs"
                : "text-stone-600 hover:text-[#2C2623]"
            }`}
          >
            Submit Request
          </button>
          <button
            type="button"
            onClick={() => setActivePortalTab("track")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activePortalTab === "track"
                ? "bg-white text-[#2C2623] shadow-xs"
                : "text-stone-600 hover:text-[#2C2623]"
            }`}
          >
            Track Status
          </button>
          <button
            type="button"
            onClick={() => setActivePortalTab("eligibility")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activePortalTab === "eligibility"
                ? "bg-white text-[#2C2623] shadow-xs"
                : "text-stone-600 hover:text-[#2C2623]"
            }`}
          >
            Eligibility Guide
          </button>
        </div>
      </div>

      {/* ================= TAB 1: SUBMIT NEW REQUEST ================= */}
      {activePortalTab === "submit" && (
        <div className="p-6 sm:p-10 space-y-8">
          {submittedTicket ? (
            /* SUCCESS CONFIRMATION SCREEN */
            <div className="max-w-2xl mx-auto text-center space-y-6 py-6 animate-fadeIn">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl shadow-inner">
                ✓
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-sans font-bold uppercase tracking-[0.25em] text-[#B06B5B] block">
                  Request Dispatched to Artisan Desk
                </span>
                <h3 className="text-2xl sm:text-3xl font-header font-bold text-[#2C2623]">
                  Thank You, {submittedTicket.customerName}!
                </h3>
                <p className="text-sm font-serif text-stone-600">
                  Your request has been registered under Reference ID:
                </p>
                <div className="inline-block p-3 px-6 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC9] font-mono font-bold text-lg text-stone-900 tracking-wider">
                  {submittedTicket.id}
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-[#FAF7F2] rounded-2xl p-6 border border-[#EDE5DA] text-left text-xs space-y-2 text-stone-700 font-serif">
                <p><strong>Original Order:</strong> #{submittedTicket.orderId}</p>
                <p><strong>Type of Request:</strong> {submittedTicket.requestType.toUpperCase()}</p>
                <p><strong>Reason:</strong> {submittedTicket.reason}</p>
                <p><strong>Items:</strong> {submittedTicket.items?.map((it) => it.name).join(", ")}</p>
                <p className="pt-2 text-stone-500 border-t border-[#E5DACD]">
                  A confirmation email with next steps has been dispatched to <strong>{submittedTicket.customerEmail || "your email"}</strong>.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={`https://wa.me/918171902255?text=${encodeURIComponent(
                    `Hi Mehak! I have submitted a Return/Exchange request on Cocoon studio.\n\n` +
                    `• Ticket ID: ${submittedTicket.id}\n` +
                    `• Order ID: ${submittedTicket.orderId}\n` +
                    `• Customer: ${submittedTicket.customerName}\n` +
                    `• Request Type: ${submittedTicket.requestType}\n` +
                    `• Reason: ${submittedTicket.reason}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#526B57] hover:bg-[#415545] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Chat with Mehak on WhatsApp</span>
                  <span>&rarr;</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedTicket(null);
                    setFoundOrder(null);
                    setOrderIdInput("");
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 text-xs font-bold uppercase tracking-wider transition"
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          ) : (
            /* INTERACTIVE SUBMISSION FORM */
            <form onSubmit={handleSubmitReturn} className="space-y-8">
              {/* STEP 1: ORDER LOOKUP */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-header font-bold text-[#2C2623]">
                  <span className="w-6 h-6 rounded-full bg-[#B06B5B] text-white text-xs flex items-center justify-center font-sans">
                    1
                  </span>
                  <span>Locate Your Order</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-8">
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Order ID <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={orderIdInput}
                      onChange={(e) => setOrderIdInput(e.target.value)}
                      placeholder="e.g. ORD-1731234567 or your order number"
                      className="w-full px-4 py-3 rounded-xl border border-[#DDD3C4] focus:border-[#B06B5B] text-xs focus:outline-none bg-[#FAF7F2]/40"
                    />
                  </div>
                  <div className="sm:col-span-4 flex items-end">
                    <button
                      type="button"
                      onClick={() => handleFindOrder()}
                      disabled={isLookingUp}
                      className="w-full py-3 px-4 rounded-xl bg-[#2C2623] hover:bg-[#B06B5B] text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer disabled:opacity-50"
                    >
                      {isLookingUp ? "Searching..." : "Find My Order"}
                    </button>
                  </div>
                </div>

                {/* Found Order Preview Banner */}
                {foundOrder && (
                  <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-emerald-950 space-y-3 animate-fadeIn text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/80 pb-2">
                      <span className="font-bold">
                        ✓ Order Found: #{foundOrder.id} • Placed {new Date(foundOrder.date || Date.now()).toLocaleDateString("en-IN")}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-200/70 text-emerald-900 font-bold uppercase tracking-wider text-[10px]">
                        {foundOrder.paymentMethod || "Verified Order"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="font-bold text-emerald-900">
                        Select which item(s) you wish to exchange or return:
                      </p>
                      <div className="space-y-2 pt-1">
                        {foundOrder.items?.map((item, idx) => {
                          const isSelected = selectedItemIds.includes(idx);
                          return (
                            <label
                              key={idx}
                              onClick={() => toggleItemSelection(idx)}
                              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                isSelected
                                  ? "bg-white border-[#B06B5B] shadow-2xs"
                                  : "bg-white/60 border-emerald-200/60 opacity-75"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}}
                                className="w-4 h-4 text-[#B06B5B] rounded accent-[#B06B5B]"
                              />
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                                <img
                                  src={item.imgUrl || item.image || "/products/items/chocolate-bow-handbag.jpg"}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 text-xs">
                                <p className="font-bold text-[#2C2623]">{item.name}</p>
                                <p className="text-stone-500 text-[11px]">
                                  Qty: {item.quantity} • ₹{item.price} each • Color: {item.color || "Standard"}
                                </p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {lookupAttempted && !foundOrder && (
                  <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs space-y-1">
                    <p className="font-bold">Order not in instant device storage?</p>
                    <p className="text-amber-800">
                      No problem! Please specify the item name and your contact details below. Our artisan desk will verify your order number in our central ledger.
                    </p>
                    <div className="pt-2">
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">
                        Item Name / Description <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={customItemText}
                        onChange={(e) => setCustomItemText(e.target.value)}
                        placeholder="e.g. White Lace Waist Belt or Chocolate Bow Handbag"
                        className="w-full px-3 py-2 rounded-lg border border-amber-300 text-xs bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 2: REQUEST TYPE & RESOLUTION */}
              <div className="space-y-4 pt-4 border-t border-[#EFE8DD]">
                <div className="flex items-center gap-2 text-sm font-header font-bold text-[#2C2623]">
                  <span className="w-6 h-6 rounded-full bg-[#B06B5B] text-white text-xs flex items-center justify-center font-sans">
                    2
                  </span>
                  <span>Select Request Type</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Option 1: Size Exchange */}
                  <div
                    onClick={() => setRequestType("exchange")}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      requestType === "exchange"
                        ? "bg-[#FAF5F2] border-[#B06B5B] ring-2 ring-[#B06B5B]/20"
                        : "bg-white border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <input
                        type="radio"
                        name="requestType"
                        checked={requestType === "exchange"}
                        onChange={() => setRequestType("exchange")}
                        className="accent-[#B06B5B]"
                      />
                      <span className="font-bold text-xs text-[#2C2623]">
                        Size / Fit Exchange
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 font-serif leading-relaxed">
                      Recommended for wearables (waist belts, headscarves, bandanas). One free size swap within 7 days of delivery.
                    </p>
                  </div>

                  {/* Option 2: Transit Damage Replacement */}
                  <div
                    onClick={() => setRequestType("replacement")}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      requestType === "replacement"
                        ? "bg-[#FAF5F2] border-[#B06B5B] ring-2 ring-[#B06B5B]/20"
                        : "bg-white border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <input
                        type="radio"
                        name="requestType"
                        checked={requestType === "replacement"}
                        onChange={() => setRequestType("replacement")}
                        className="accent-[#B06B5B]"
                      />
                      <span className="font-bold text-xs text-[#2C2623]">
                        Free Replacement
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 font-serif leading-relaxed">
                      For items received damaged in courier transit, torn outer parcel, or manufacturing defect. 100% free fresh replacement.
                    </p>
                  </div>

                  {/* Option 3: Return & Full Refund */}
                  <div
                    onClick={() => setRequestType("refund")}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      requestType === "refund"
                        ? "bg-[#FAF5F2] border-[#B06B5B] ring-2 ring-[#B06B5B]/20"
                        : "bg-white border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <input
                        type="radio"
                        name="requestType"
                        checked={requestType === "refund"}
                        onChange={() => setRequestType("refund")}
                        className="accent-[#B06B5B]"
                      />
                      <span className="font-bold text-xs text-[#2C2623]">
                        Return for Full Refund
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 font-serif leading-relaxed">
                      Defective or damaged items returned for source refund (prepaid) or bank/UPI transfer (COD orders).
                    </p>
                  </div>
                </div>

                {/* Reason Selection */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-bold text-stone-700 block">
                    Reason for Return / Exchange <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#DDD3C4] focus:border-[#B06B5B] text-xs bg-white text-stone-800 focus:outline-none"
                  >
                    <option value="Damaged in courier transit / Outer packaging torn">
                      Damaged in courier transit / Outer packaging torn or soaked
                    </option>
                    <option value="Defective stitch / Loose knotting / Stitch defect">
                      Defective stitch / Loose knotting / Stitch defect
                    </option>
                    <option value="Incorrect item or color delivered">
                      Incorrect item or color delivered
                    </option>
                    <option value="Size / fit issue (Wearables: Belts & Bandanas)">
                      Size / fit issue (Eligible for wearables: Belts &amp; Bandanas)
                    </option>
                    <option value="Item materially divergent from website photos">
                      Item materially divergent from website photos
                    </option>
                    <option value="Other genuine grievance">
                      Other genuine grievance
                    </option>
                  </select>
                </div>

                {/* Description Textarea */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 block">
                    Detailed Notes / Sizing Requirement
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="If requesting a size exchange, please mention your desired waist/length measurements or colorway. For damaged pieces, describe the defect..."
                    className="w-full px-4 py-3 rounded-xl border border-[#DDD3C4] focus:border-[#B06B5B] text-xs bg-white text-stone-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* STEP 3: PHOTO / UNBOXING PROOF UPLOAD */}
              <div className="space-y-4 pt-4 border-t border-[#EFE8DD]">
                <div className="flex items-center gap-2 text-sm font-header font-bold text-[#2C2623]">
                  <span className="w-6 h-6 rounded-full bg-[#B06B5B] text-white text-xs flex items-center justify-center font-sans">
                    3
                  </span>
                  <span>Upload Unboxing Video or Defect Photos</span>
                </div>

                <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-dashed border-[#DDD3C4] text-center space-y-3">
                  <div className="w-10 h-10 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-600">
                    📷
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-stone-800">
                      Upload 360° Unboxing Video Clip or Photos
                    </p>
                    <p className="text-[11px] text-stone-500 font-serif">
                      Continuous unboxing footage of the sealed outer courier parcel expedites immediate approval under Indian Consumer Protection E-Commerce Rules. (Max 25MB each)
                    </p>
                  </div>
                  <label className="inline-block px-5 py-2.5 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-xs font-bold uppercase tracking-wider cursor-pointer shadow-2xs transition">
                    <span>Choose Photos / Videos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Previews Grid */}
                {mediaPreviews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {mediaPreviews.map((m, idx) => (
                      <div key={idx} className="relative rounded-xl overflow-hidden border border-stone-200 bg-black/5 aspect-square flex items-center justify-center">
                        {m.type === "video" ? (
                          <video src={m.url} className="w-full h-full object-cover" />
                        ) : (
                          <img src={m.url} alt="Proof" className="w-full h-full object-cover" />
                        )}
                        <button
                          type="button"
                          onClick={() => removeMedia(idx)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center text-xs hover:bg-rose-600 transition"
                          title="Remove file"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* STEP 4: COD REFUND DETAILS (ONLY IF REFUND REQUESTED) */}
              {requestType === "refund" && (
                <div className="space-y-4 pt-4 border-t border-[#EFE8DD] animate-fadeIn">
                  <div className="flex items-center gap-2 text-sm font-header font-bold text-[#2C2623]">
                    <span className="w-6 h-6 rounded-full bg-[#B06B5B] text-white text-xs flex items-center justify-center font-sans">
                      4
                    </span>
                    <span>Refund Destination (For COD Orders)</span>
                  </div>

                  <p className="text-xs text-stone-600 font-serif leading-relaxed">
                    <em>If you paid online via Razorpay, funds will automatically credit back to your original source account (3–5 business days).</em> For <strong>Cash on Delivery (COD)</strong> orders, please specify your preferred transfer destination:
                  </p>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-xs font-bold text-stone-800 cursor-pointer">
                      <input
                        type="radio"
                        name="refundMethod"
                        checked={refundMethod === "upi"}
                        onChange={() => setRefundMethod("upi")}
                        className="accent-[#B06B5B]"
                      />
                      <span>UPI ID Transfer (Instant)</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold text-stone-800 cursor-pointer">
                      <input
                        type="radio"
                        name="refundMethod"
                        checked={refundMethod === "bank"}
                        onChange={() => setRefundMethod("bank")}
                        className="accent-[#B06B5B]"
                      />
                      <span>Direct Bank Transfer (NEFT/IMPS)</span>
                    </label>
                  </div>

                  {refundMethod === "upi" ? (
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Your UPI ID (VPA) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. 9876543210@paytm or yourname@oksbi"
                        className="w-full px-4 py-3 rounded-xl border border-[#DDD3C4] text-xs focus:outline-none focus:border-[#B06B5B]"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-[#FAF7F2] rounded-2xl border border-[#EDE5DA] text-xs">
                      <div>
                        <label className="font-bold text-stone-700 block mb-1">Account Holder Name *</label>
                        <input
                          type="text"
                          value={bankAccount.accountHolder}
                          onChange={(e) => setBankAccount({ ...bankAccount, accountHolder: e.target.value })}
                          placeholder="As per bank passbook"
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-stone-700 block mb-1">Bank Name</label>
                        <input
                          type="text"
                          value={bankAccount.bankName}
                          onChange={(e) => setBankAccount({ ...bankAccount, bankName: e.target.value })}
                          placeholder="e.g. HDFC Bank, SBI"
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-stone-700 block mb-1">Bank Account Number *</label>
                        <input
                          type="text"
                          value={bankAccount.accountNo}
                          onChange={(e) => setBankAccount({ ...bankAccount, accountNo: e.target.value })}
                          placeholder="Account number"
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-stone-700 block mb-1">Confirm Account Number *</label>
                        <input
                          type="text"
                          value={bankAccount.confirmAccountNo}
                          onChange={(e) => setBankAccount({ ...bankAccount, confirmAccountNo: e.target.value })}
                          placeholder="Re-enter account number"
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="font-bold text-stone-700 block mb-1">Bank IFSC Code *</label>
                        <input
                          type="text"
                          value={bankAccount.ifsc}
                          onChange={(e) => setBankAccount({ ...bankAccount, ifsc: e.target.value })}
                          placeholder="e.g. HDFC0001234"
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white font-mono uppercase"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 5: CONTACT INFORMATION */}
              <div className="space-y-4 pt-4 border-t border-[#EFE8DD]">
                <div className="flex items-center gap-2 text-sm font-header font-bold text-[#2C2623]">
                  <span className="w-6 h-6 rounded-full bg-[#B06B5B] text-white text-xs flex items-center justify-center font-sans">
                    5
                  </span>
                  <span>Contact Information for Reverse Pickup</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-xl border border-[#DDD3C4] text-xs focus:outline-none focus:border-[#B06B5B]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-[#DDD3C4] text-xs focus:outline-none focus:border-[#B06B5B]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      WhatsApp Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full px-4 py-3 rounded-xl border border-[#DDD3C4] text-xs focus:outline-none focus:border-[#B06B5B]"
                    />
                  </div>
                </div>
              </div>

              {/* Statutory Legal Disclaimer */}
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EDE5DA] text-[11px] text-stone-600 font-serif leading-relaxed">
                <strong>Statutory Notice (Consumer Protection E-Commerce Rules 2020):</strong> Under Indian law, made-to-order bespoke commissions crafted to custom sizing or non-standard colorways are non-returnable unless defective upon delivery. Return and size exchange requests must be filed within <strong>7 days of delivery</strong>. In accordance with Rule 5(9), our Grievance Officer acknowledges all requests within 48 hours and provides definitive resolution within 15 days.
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-[#B06B5B] hover:bg-[#975647] text-white text-xs font-bold uppercase tracking-widest transition shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>
                  {isSubmitting
                    ? isUploading
                      ? "Uploading Proof Clips..."
                      : "Registering Request..."
                    : `Submit ${requestType === "exchange" ? "Size Exchange" : requestType === "replacement" ? "Replacement" : "Refund"} Request →`}
                </span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* ================= TAB 2: TRACK EXISTING REQUEST ================= */}
      {activePortalTab === "track" && (
        <div className="p-6 sm:p-10 space-y-6">
          <div className="max-w-xl mx-auto space-y-4 text-center">
            <h3 className="text-xl font-header font-bold text-[#2C2623]">
              Track Return / Exchange Status
            </h3>
            <p className="text-xs text-stone-600 font-serif">
              Enter your Return Ticket ID (e.g. <code>RET-...</code>) or original Order ID to view real-time status.
            </p>
            <form onSubmit={handleTrackRequest} className="flex gap-2">
              <input
                type="text"
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                placeholder="Enter Ticket ID (RET-...) or Order ID"
                className="flex-1 px-4 py-3 rounded-xl border border-[#DDD3C4] text-xs focus:outline-none focus:border-[#B06B5B]"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#2C2623] hover:bg-[#B06B5B] text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>

          {trackedRequest ? (
            <div className="max-w-xl mx-auto p-6 bg-[#FAF7F2] rounded-3xl border border-[#EDE5DA] space-y-4 text-xs font-serif text-stone-700 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#E5DACD] pb-3">
                <div>
                  <span className="text-[10px] font-sans font-bold uppercase text-[#B06B5B]">Ticket ID</span>
                  <p className="font-mono font-bold text-stone-900 text-sm">{trackedRequest.id}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#B06B5B] text-white text-[10px] font-sans font-bold uppercase tracking-wider">
                  {trackedRequest.status || "Under Review"}
                </span>
              </div>

              <div className="space-y-1.5">
                <p><strong>Original Order:</strong> #{trackedRequest.orderId}</p>
                <p><strong>Customer:</strong> {trackedRequest.customerName}</p>
                <p><strong>Type:</strong> {trackedRequest.requestType?.toUpperCase()}</p>
                <p><strong>Items:</strong> {trackedRequest.items?.map((it) => it.name).join(", ")}</p>
                <p><strong>Reason:</strong> {trackedRequest.reason}</p>
                <p><strong>Submitted On:</strong> {new Date(trackedRequest.createdAt).toLocaleString("en-IN")}</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-stone-200 text-stone-600 space-y-1">
                <strong className="block text-stone-900 font-sans">Artisan Review Timeline:</strong>
                <p>
                  All tickets are reviewed by founder &amp; head artisan <strong>Mehak Agarwal</strong> within 48 hours. If reverse pickup is approved, our courier partner (Delhivery / Shiprocket) will reach out to you directly.
                </p>
              </div>

              <div className="text-center pt-2">
                <a
                  href={`https://wa.me/918171902255?text=${encodeURIComponent(
                    `Hi Mehak, I am checking the status of my Return/Exchange Ticket #${trackedRequest.id} for Order #${trackedRequest.orderId}.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#526B57] text-white text-xs font-bold uppercase tracking-wider"
                >
                  <span>Chat with Mehak on WhatsApp</span>
                  <span>&rarr;</span>
                </a>
              </div>
            </div>
          ) : trackAttempted ? (
            <div className="max-w-md mx-auto p-6 bg-stone-50 rounded-2xl border border-stone-200 text-center space-y-2 text-xs">
              <p className="font-bold text-stone-800">No matching ticket found.</p>
              <p className="text-stone-500 font-serif">
                If you recently submitted your request via WhatsApp or email, please allow a few moments or message us directly at <strong>+91 8171902255</strong>.
              </p>
            </div>
          ) : null}
        </div>
      )}

      {/* ================= TAB 3: ELIGIBILITY GUIDE ================= */}
      {activePortalTab === "eligibility" && (
        <div className="p-6 sm:p-10 space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-sans font-black uppercase tracking-[0.25em] text-[#B06B5B] block">
              Clear &amp; Transparent Standards
            </span>
            <h3 className="text-2xl font-header font-bold text-[#2C2623]">
              Return &amp; Exchange Eligibility Matrix
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 font-serif leading-relaxed">
              Because every COCOON treasure is handcrafted knot-by-knot in slow fashion with pure organic milk cotton, here is exactly which products qualify for return or size exchange under Indian law:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1: Eligible */}
            <div className="p-6 rounded-3xl bg-emerald-50/70 border border-emerald-200 space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold uppercase tracking-wider text-[10px]">
                ✓ Eligible for Return / Exchange
              </span>
              <ul className="text-xs font-serif text-emerald-950 space-y-2 leading-relaxed list-disc list-inside">
                <li>
                  <strong>Courier Transit Damage:</strong> Any item arriving with crushed/torn packaging or physical snagging during courier transit (report with unboxing video within <strong>7 days</strong>) → 100% Free Replacement or Full Refund.
                </li>
                <li>
                  <strong>Manufacturing / Stitch Defect:</strong> Any missed loop, structural flaw, or defective clasp → 100% Free Replacement.
                </li>
                <li>
                  <strong>Wrong Item Delivered:</strong> Any mix-up in shade or model → Immediate priority dispatch of correct item.
                </li>
                <li>
                  <strong>Wearable Sizing (Waist Belts, Hip Scarves, Bandanas):</strong> Eligible for <strong>1 Free Size Exchange</strong> within 7 days (item must be unworn, unwashed, with tags intact).
                </li>
              </ul>
            </div>

            {/* Box 2: Ineligible / Exempted */}
            <div className="p-6 rounded-3xl bg-rose-50/70 border border-rose-200 space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-900 font-bold uppercase tracking-wider text-[10px]">
                ✕ Non-Returnable &amp; Exempt Items
              </span>
              <ul className="text-xs font-serif text-rose-950 space-y-2 leading-relaxed list-disc list-inside">
                <li>
                  <strong>Custom &amp; Bespoke Commissions:</strong> Personalized heirlooms custom-knitted to buyer's specific dimensions, initials, or bespoke colorways are non-returnable (as per Indian Consumer Protection E-Commerce Rules 2020), unless delivered damaged.
                </li>
                <li>
                  <strong>Used or Washed Items:</strong> Wearables that show signs of fragrance, makeup, machine-washing, or stretched loops after delivery.
                </li>
                <li>
                  <strong>Intimate Hair Accessories:</strong> Scrunchies and hair ties once unsealed/worn cannot be returned for hygiene and sanitary reasons.
                </li>
                <li>
                  <strong>Expired Window:</strong> Requests submitted after the statutory 7-day post-delivery inspection window.
                </li>
              </ul>
            </div>
          </div>

          {/* Refund Timelines Table */}
          <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#EDE5DA] text-xs space-y-2 font-serif text-stone-700">
            <strong className="block text-stone-900 font-sans text-sm">Statutory Refund Processing Timelines:</strong>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-white rounded-xl border border-stone-200">
                <span className="font-bold text-[#B06B5B] block font-sans">Prepaid Orders (Razorpay):</span>
                <p>Credited back to the original source card, UPI, or net banking account in <strong>3 to 5 business days</strong>.</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-stone-200">
                <span className="font-bold text-[#526B57] block font-sans">Cash on Delivery (COD) Orders:</span>
                <p>Credited directly to customer's verified UPI ID or Bank Account via NEFT/IMPS within <strong>5 to 7 business days</strong> of physical item receipt.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
