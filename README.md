# Cocoon_I - Standalone Handcrafted Shop for Instagram Bio

A high-converting, dedicated single-page storefront crafted exclusively for Instagram Bio traffic (`@cocoon._.u`).

---

## ✨ Features Included:
- **Direct Single-Page Experience (`/`):** Full artisan catalog with category filter tabs (Keychains & Charms, Bags & Totes, Hair Accessories, Belts, Bandanas).
- **Smooth Full-Page Checkout:** Seamless transition from product to delivery form with native scrolling.
- **10% Instant Online Discount:** Flat 10% instant discount auto-calculated on Razorpay online payments (UPI, Cards, NetBanking).
- **Cash on Delivery (COD):** Available across India with flat ₹60 express courier delivery.
- **Auto-GPS Location:** Automatic locality & pincode detection via device geolocation.
- **Dual Email Notification:** Instant automated order confirmation receipts dispatched to both customer and studio desk via Resend.
- **1-Click WhatsApp Tracking:** Pre-filled order confirmation button without publicly exposing personal contact details.
- **Verified Review & Feedback System (`/review`):** 
  - Supports 1-5 star ratings, text feedback, plus **Photo & Video upload support**.
  - Reviewers automatically unlock a **flat 15% OFF coupon (`COCOON15`)** for their next order.
  - Reviews persist in Supabase DB for immediate social proof.

---

## 🚀 Quick Deployment to Vercel:

1. Import this repository into **[Vercel](https://vercel.com/new)**.
2. In **Environment Variables**, add the keys from `.env.example`:
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `RESEND_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Click **Deploy**.
4. Paste the generated Vercel production URL into your Instagram Bio!
