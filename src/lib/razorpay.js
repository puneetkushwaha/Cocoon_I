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
          customerCity: customer?.city || "Agra",
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
      description: "Handcrafted Crochet Order - Agra",
      image: "https://cocoon-crochet.vercel.app/logo.svg",
      order_id: orderData.orderId,
      prefill: {
        name: customer?.name || "",
        email: customer?.email || "",
        contact: customer?.phone || "",
      },
      notes: {
        address: `${customer?.address || ""}, ${customer?.city || "Agra"} - ${customer?.pincode || "282001"}`,
      },
      theme: {
        color: "#B06B5B", // Artisanal Terracotta
      },
      modal: {
        ondismiss: () => {
          if (onDismiss) onDismiss();
        },
      },
      handler: async function (response) {
        try {
          // 3. Verify payment signature on backend
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            if (onSuccess) {
              onSuccess({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
              });
            }
          } else {
            if (onFailure) onFailure(verifyData.error || "Payment signature verification failed.");
          }
        } catch (verifyErr) {
          console.error("Payment verification network error:", verifyErr);
          if (onFailure) onFailure("Payment verification failed. Please contact studio WhatsApp.");
        }
      },
    };

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
