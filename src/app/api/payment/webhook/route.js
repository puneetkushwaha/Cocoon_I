import { NextResponse } from "next/server";
import crypto from "crypto";
import { saveOrderToSupabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;

    // Signature verification (if secret configured)
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      if (expectedSignature !== signature) {
        console.warn("Razorpay webhook signature mismatch");
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    const eventData = JSON.parse(rawBody);
    const event = eventData.event;
    console.log(`Razorpay webhook received event: ${event}`);

    if (event === "payment.captured" || event === "order.paid") {
      const payment = eventData.payload?.payment?.entity;
      const order = eventData.payload?.order?.entity;

      const paymentId = payment?.id;
      const orderId = order?.id || payment?.order_id;
      const notes = order?.notes || payment?.notes || {};
      const amountInRs = payment?.amount ? payment.amount / 100 : (order?.amount ? order.amount / 100 : 1);

      if (paymentId) {
        const generatedId = `ORD-RZP-${Date.now().toString().slice(-6)}`;
        const customerName = notes.customerName || payment?.email?.split("@")[0] || "Valued Customer";
        const customerPhone = notes.customerPhone || payment?.contact || "";
        const customerEmail = notes.customerEmail || payment?.email || null;
        const address = notes.address || "Studio Courier Delivery, India";

        await saveOrderToSupabase({
          id: generatedId,
          customerName,
          customerPhone,
          customerEmail,
          address,
          items: [{
            id: "crochet-item",
            name: "Handcrafted Crochet Item",
            price: amountInRs,
            quantity: 1,
            color: "Standard"
          }],
          totalAmount: amountInRs,
          status: "Processing",
          paymentMethod: "Online Payment (Razorpay)",
          utr: paymentId,
          notes: `Paid Online via Razorpay Webhook [Payment ID: ${paymentId}, Order ID: ${orderId || ""}]`,
          date: new Date().toISOString()
        });

        console.log(`Order ${generatedId} saved via webhook for payment ${paymentId}`);
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
