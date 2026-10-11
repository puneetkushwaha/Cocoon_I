import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const keySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim();

    if (!keySecret) {
      return NextResponse.json(
        { success: false, error: "Razorpay key secret not configured on server." },
        { status: 500 }
      );
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing required Razorpay payment verification fields." },
        { status: 400 }
      );
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(payload)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return NextResponse.json({
        success: true,
        message: "Payment signature verified successfully.",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    } else {
      console.warn("Razorpay signature mismatch:", { expected: expectedSignature, received: razorpay_signature });
      return NextResponse.json(
        { success: false, error: "Invalid payment verification signature." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Razorpay verification error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Payment verification failed." },
      { status: 500 }
    );
  }
}
