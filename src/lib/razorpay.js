/**
 * Razorpay Payment Gateway Helper for COCOON
 * Provides seamless UPI, Cards, NetBanking payment flow
 */

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay SDK");
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const initiateRazorpayPayment = async ({
  amount,
  customer,
  notes = {},
  onSuccess,
  onFailure,
  onDismiss,
}) => {
  try {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      if (onFailure) onFailure("Unable to load secure Razorpay payment gateway. Please check your internet connection.");
      return;
    }

    // 1. Create order on server
    const orderRes = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Math.round(Number(amount)),
        receipt: `cocoon_${Date.now()}`,
        notes: {
          customerName: customer?.name || "",
          customerPhone: customer?.phone || "",
          customerCity: customer?.city || "",
          ...notes,
        },
      }),
    });

    const orderData = await orderRes.json();
    if (!orderData.success) {
      if (onFailure) onFailure(orderData.error || "Failed to initialize payment gateway order.");
      return;
    }

    // 2. Configure Razorpay modal
    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency || "INR",
      name: "COCOON",
      description: "Handcrafted Crochet Studio India",
      image: "https://www.gococoon.store/icon.svg",
      order_id: orderData.orderId,
      callback_url: `${typeof window !== "undefined" ? window.location.origin : "https://www.gococoon.store"}/api/payment/callback`,
      redirect: true,
      prefill: {
        name: customer?.name || "",
        email: customer?.email || "",
        contact: customer?.phone || "",
      },
      notes: {
        address: `${customer?.address || ""}${customer?.city ? `, ${customer.city}` : ""}${customer?.pincode ? ` - ${customer.pincode}` : ""}`.trim(),
      },
      theme: {
        color: "#B06B5B", // Artisanal Terracotta
      },
      modal: {
        ondismiss: async () => {
          if (hasCompleted) return;
          clearInterval(pollTimer);
          try {
            // Check if payment was actually successful before dismissing
            const checkRes = await fetch(`/api/payment/check-order?orderId=${encodeURIComponent(orderData.orderId)}`);
            const checkData = await checkRes.json();
            if (checkData.success && checkData.paid) {
              hasCompleted = true;
              if (onSuccess) {
                onSuccess({
                  paymentId: checkData.paymentId,
                  orderId: orderData.orderId,
                  signature: "verified_via_server",
                });
              }
              return;
            }
          } catch (e) {
            console.warn("Order check on dismiss failed:", e);
          }
          if (onDismiss) onDismiss();
        },
      },
      handler: async function (response) {
        if (hasCompleted) return;
        clearInterval(pollTimer);
        try {
          // 3. Verify payment signature on backend
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id || orderData.orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature || "",
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            hasCompleted = true;
            if (onSuccess) {
              onSuccess({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id || orderData.orderId,
                signature: response.razorpay_signature,
              });
            }
            return;
          }

          // Fallback check
          const fallbackRes = await fetch(`/api/payment/check-order?orderId=${encodeURIComponent(orderData.orderId)}`);
          const fallbackData = await fallbackRes.json();
          if (fallbackData.success && fallbackData.paid) {
            hasCompleted = true;
            if (onSuccess) {
              onSuccess({
                paymentId: fallbackData.paymentId || response.razorpay_payment_id,
                orderId: orderData.orderId,
                signature: "fallback_verified",
              });
            }
            return;
          }

          if (onFailure) onFailure(verifyData.error || "Payment signature verification failed.");
        } catch (verifyErr) {
          console.error("Payment verification network error:", verifyErr);
          // Check server status as last resort
          try {
            const lastCheck = await fetch(`/api/payment/check-order?orderId=${encodeURIComponent(orderData.orderId)}`);
            const lastData = await lastCheck.json();
            if (lastData.success && lastData.paid) {
              hasCompleted = true;
              if (onSuccess) {
                onSuccess({
                  paymentId: lastData.paymentId || response?.razorpay_payment_id,
                  orderId: orderData.orderId,
                  signature: "fallback_verified",
                });
              }
              return;
            }
          } catch (_) {}

          if (onFailure) onFailure("Payment verification failed. Please contact studio WhatsApp.");
        }
      },
    };

    let hasCompleted = false;
    let pollTimer = null;

    // Background polling for mobile app switches (Google Pay, PhonePe, Paytm)
    pollTimer = setInterval(async () => {
      if (hasCompleted) {
        clearInterval(pollTimer);
        return;
      }
      try {
        const pollRes = await fetch(`/api/payment/check-order?orderId=${encodeURIComponent(orderData.orderId)}`);
        const pollData = await pollRes.json();
        if (pollData.success && pollData.paid) {
          hasCompleted = true;
          clearInterval(pollTimer);
          if (onSuccess) {
            onSuccess({
              paymentId: pollData.paymentId,
              orderId: orderData.orderId,
              signature: "polled_success",
            });
          }
        }
      } catch (pollErr) {
        // silent fail on poll
      }
    }, 3500);

    // Stop polling after 30 seconds
    setTimeout(() => {
      if (pollTimer) clearInterval(pollTimer);
    }, 30000);

    const rzpInstance = new window.Razorpay(options);
    rzpInstance.on("payment.failed", function (response) {
      console.error("Razorpay payment failure:", response.error);
      if (onFailure) {
        onFailure(response.error.description || "Payment failed or was declined by bank/UPI app.");
      }
    });

    rzpInstance.open();
  } catch (err) {
    console.error("Razorpay initiation error:", err);
    if (onFailure) onFailure(err.message || "An unexpected error occurred during payment initiation.");
  }
};
