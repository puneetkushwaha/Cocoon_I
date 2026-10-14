import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { paid: false, error: "Missing orderId query parameter." },
        { status: 400 }
      );
    }

    const keyId = (process.env.RAZORPAY_KEY_ID || "").trim();
    const keySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim();

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { paid: false, error: "Razorpay credentials not configured on server." },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // Fetch order status and payments in parallel for instant response
    const [payments, order] = await Promise.all([
      razorpay.orders.fetchPayments(orderId).catch(() => null),
      razorpay.orders.fetch(orderId).catch(() => null),
    ]);

    if (payments && payments.items && payments.items.length > 0) {
      const successfulPayment = payments.items.find(
        (p) => p.status === "captured" || p.status === "authorized"
      );

      if (successfulPayment) {
        return NextResponse.json({
          paid: true,
          paymentId: successfulPayment.id,
          orderId: successfulPayment.order_id || orderId,
          amount: successfulPayment.amount / 100,
          status: successfulPayment.status,
          method: successfulPayment.method,
          email: successfulPayment.email,
          contact: successfulPayment.contact,
        });
      }
    }

    // Fast check: If order is marked paid directly on Razorpay
    if (order && (order.status === "paid" || order.amount_paid > 0)) {
      return NextResponse.json({
        paid: true,
        paymentId: payments?.items?.[0]?.id || `pay_${order.id.slice(6)}`,
        orderId: order.id,
        amount: (order.amount_paid || order.amount) / 100,
        status: "captured",
        method: "upi",
        email: order.notes?.customerEmail || "",
        contact: order.notes?.customerPhone || "",
      });
    }

    return NextResponse.json({
      paid: false,
      message: "No successful payment found yet for this order.",
    });
  } catch (error) {
    console.error("Razorpay check-order error:", error);
    return NextResponse.json(
      { paid: false, error: error.message || "Failed to check order status." },
      { status: 500 }
    );
  }
}
