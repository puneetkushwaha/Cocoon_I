import { NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { saveOrderToSupabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const razorpay_payment_id = formData.get("razorpay_payment_id")?.toString();
    const razorpay_order_id = formData.get("razorpay_order_id")?.toString();
    const razorpay_signature = formData.get("razorpay_signature")?.toString();

    // Failure / Error payload from Razorpay
    const errorCode = formData.get("error[code]")?.toString();
    const errorDescription = formData.get("error[description]")?.toString();

    const originHeader = request.headers.get("origin") || request.headers.get("referer") || "";
    let baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.gococoon.store";
    if (originHeader) {
      try {
        const u = new URL(originHeader);
        baseUrl = u.origin;
      } catch (e) {}
    } else if (request.nextUrl?.origin) {
      baseUrl = request.nextUrl.origin;
    }

    if (errorCode || !razorpay_payment_id) {
      console.warn("Razorpay callback payment failed:", { errorCode, errorDescription });
      const failUrl = new URL("/cart", baseUrl);
      failUrl.searchParams.set("paymentStatus", "failed");
      failUrl.searchParams.set("reason", errorDescription || "Payment was cancelled or declined by your bank.");
      return NextResponse.redirect(failUrl.toString(), 303);
    }

    const keyId = (process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "").trim();
    const keySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim();

    // 1. Signature Verification
    let isVerified = false;
    if (keySecret && razorpay_order_id && razorpay_signature) {
      const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(payload)
        .digest("hex");
      if (expectedSignature === razorpay_signature) {
        isVerified = true;
      }
    }

    // 2. Official REST API Fallback Verification
    let paymentDetails = null;
    let orderDetails = null;
    if (keyId && keySecret) {
      try {
        const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
        paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
        if (paymentDetails && (paymentDetails.status === "captured" || paymentDetails.status === "authorized")) {
          isVerified = true;
        }
        if (razorpay_order_id) {
          try {
            orderDetails = await razorpay.orders.fetch(razorpay_order_id);
          } catch (_) {}
        }
      } catch (err) {
        console.error("Razorpay API fetch payment in callback error:", err.message);
      }
    }

    if (!isVerified) {
      console.warn("Razorpay callback payment could not be verified:", { razorpay_payment_id, razorpay_order_id });
      const failUrl = new URL("/cart", baseUrl);
      failUrl.searchParams.set("paymentStatus", "failed");
      failUrl.searchParams.set("reason", "Payment verification mismatch.");
      return NextResponse.redirect(failUrl.toString(), 303);
    }

    // 3. Register Order in Database
    const notes = orderDetails?.notes || paymentDetails?.notes || {};
    const amountInRs = paymentDetails?.amount ? paymentDetails.amount / 100 : 1;
    const generatedOrderId = `ORD-RZP-${Date.now().toString().slice(-6)}`;

    const newOrder = {
      order_id: generatedOrderId,
      customer_name: notes.customerName || paymentDetails?.email || "Valued Customer",
      customer_phone: notes.customerPhone || paymentDetails?.contact || "",
      customer_email: notes.customerEmail || paymentDetails?.email || null,
      address: notes.address || "Standard Express Courier, India",
      items: [{
        id: "keychain",
        name: "Handcrafted Crochet Item",
        price: amountInRs,
        quantity: 1,
        color: "Artisanal"
      }],
      total_amount: amountInRs,
      status: "Processing",
      payment_method: "Online Payment (Razorpay)",
      utr: razorpay_payment_id,
      notes: `Paid Online via Razorpay [Payment ID: ${razorpay_payment_id}, Order ID: ${razorpay_order_id}]`,
      created_at: new Date().toISOString()
    };

    try {
      await saveOrderToSupabase({
        id: generatedOrderId,
        customerName: newOrder.customer_name,
        customerPhone: newOrder.customer_phone,
        customerEmail: newOrder.customer_email,
        address: newOrder.address,
        items: newOrder.items,
        totalAmount: newOrder.total_amount,
        status: newOrder.status,
        paymentMethod: newOrder.payment_method,
        utr: newOrder.utr,
        notes: newOrder.notes,
        date: newOrder.created_at
      });
    } catch (dbErr) {
      console.warn("Supabase order save in callback notice:", dbErr);
    }

    // 4. Clean 303 Redirect back to /cart
    const successUrl = new URL("/cart", baseUrl);
    successUrl.searchParams.set("paymentStatus", "success");
    successUrl.searchParams.set("paymentId", razorpay_payment_id);
    successUrl.searchParams.set("orderId", razorpay_order_id || generatedOrderId);
    return NextResponse.redirect(successUrl.toString(), 303);
  } catch (err) {
    console.error("Critical error in payment callback:", err);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.gococoon.store";
    const failUrl = new URL("/cart", baseUrl);
    failUrl.searchParams.set("paymentStatus", "failed");
    failUrl.searchParams.set("reason", "An error occurred during payment processing.");
    return NextResponse.redirect(failUrl.toString(), 303);
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.gococoon.store";
  const target = new URL("/cart", baseUrl);
  searchParams.forEach((val, key) => target.searchParams.set(key, val));
  return NextResponse.redirect(target.toString(), 303);
}
