import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request) {
  try {
    const body = await request.json();
    const { amount, receipt, notes } = body;

    const keyId = (process.env.RAZORPAY_KEY_ID || "").trim();
    const keySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim();

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { success: false, error: "Razorpay credentials not configured on server." },
        { status: 500 }
      );
    }

    const numericAmount = Math.round(Number(amount));
    if (!numericAmount || numericAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid payment amount." },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: numericAmount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || keyId,
    });
  } catch (error) {
    console.error("Razorpay create-order error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create Razorpay order." },
      { status: 500 }
    );
  }
}
