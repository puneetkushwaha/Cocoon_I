import { NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { checkRateLimit } from "@/lib/rateLimit";

function timingSafeMatch(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a, "hex");
  const bufB = Buffer.from(b, "hex");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(request) {
  try {
    const rateLimit = checkRateLimit(request, {
      limit: 30,
      windowMs: 60 * 1000,
      identifier: "verify_payment"
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many verification requests. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const keyId = (process.env.RAZORPAY_KEY_ID || "").trim();
    const keySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim();

    if (!keySecret) {
      return NextResponse.json(
        { success: false, error: "Razorpay key secret not configured on server." },
        { status: 500 }
      );
    }

    if (!razorpay_payment_id || typeof razorpay_payment_id !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing required razorpay_payment_id field." },
        { status: 400 }
      );
    }

    // 1. Primary Check: Cryptographic Timing-Safe HMAC Signature Verification
    if (razorpay_order_id && razorpay_signature) {
      const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(payload)
        .digest("hex");

      if (timingSafeMatch(expectedSignature, razorpay_signature)) {
        return NextResponse.json({
          success: true,
          verified: true,
          message: "Payment signature verified successfully via timing-safe HMAC.",
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
        });
      } else {
        console.warn("Razorpay HMAC signature mismatch, checking official API fallback...", {
          expectedLen: expectedSignature.length,
          receivedLen: (razorpay_signature || "").length,
        });
      }
    }

    // 2. Secondary Bulletproof Check: Direct Verification via Razorpay REST API
    if (keyId) {
      try {
        const razorpay = new Razorpay({
          key_id: keyId,
          key_secret: keySecret,
        });

        const payment = await razorpay.payments.fetch(razorpay_payment_id);
        if (payment && (payment.status === "captured" || payment.status === "authorized")) {
          return NextResponse.json({
            success: true,
            verified: true,
            message: "Payment verified successfully directly via Razorpay API.",
            paymentId: payment.id,
            orderId: payment.order_id || razorpay_order_id,
            amount: payment.amount / 100,
            status: payment.status,
            method: payment.method,
          });
        }
      } catch (apiErr) {
        console.error("Razorpay API fetch payment check failed:", apiErr.message);
      }
    }

    return NextResponse.json(
      { success: false, error: "Payment verification failed. No confirmed payment found." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Razorpay verification error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Payment verification failed." },
      { status: 500 }
    );
  }
}
