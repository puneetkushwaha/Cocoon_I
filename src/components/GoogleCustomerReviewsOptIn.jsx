"use client";

import { useEffect } from "react";

export default function GoogleCustomerReviewsOptIn({
  orderId,
  email,
  deliveryDate,
  country = "IN"
}) {
  useEffect(() => {
    if (!orderId) return;

    // Calculate estimated delivery date: 5 days from today
    let estimatedDate = deliveryDate;
    if (!estimatedDate) {
      const d = new Date();
      d.setDate(d.getDate() + 5);
      estimatedDate = d.toISOString().split("T")[0]; // YYYY-MM-DD
    }

    const customerEmail = email || "customer@gococoon.store";

    window.renderOptIn = function () {
      if (typeof window !== "undefined" && window.gapi && window.gapi.load) {
        window.gapi.load("surveyoptin", function () {
          window.gapi.surveyoptin.render({
            merchant_id: 5902941398,
            order_id: String(orderId),
            email: customerEmail,
            delivery_country: country || "IN",
            estimated_delivery_date: estimatedDate,
            opt_in_style: "CENTER_DIALOG"
          });
        });
      }
    };

    if (typeof window !== "undefined") {
      if (window.gapi && window.gapi.surveyoptin) {
        window.renderOptIn();
      } else {
        const existingScript = document.getElementById("google-customer-reviews-optin-script");
        if (!existingScript) {
          const script = document.createElement("script");
          script.id = "google-customer-reviews-optin-script";
          script.src = "https://apis.google.com/js/platform.js?onload=renderOptIn";
          script.async = true;
          script.defer = true;
          document.body.appendChild(script);
        } else if (window.renderOptIn) {
          window.renderOptIn();
        }
      }
    }
  }, [orderId, email, deliveryDate, country]);

  return null;
}
