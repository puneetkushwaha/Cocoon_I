import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendCodVerificationOtpEmail } from "@/lib/email";

const SECRET = process.env.AUTH_SECRET || "cocoon_production_secret_key_8171902255";

function signOtpToken(payload) {
  const jsonStr = JSON.stringify(payload);
  const base64Data = Buffer.from(jsonStr).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(base64Data)
    .digest("base64url");
  return `${base64Data}.${signature}`;
}

function verifyOtpToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [base64Data, signature] = parts;
  const expectedSignature = crypto
    .createHmac("sha256", SECRET)
    .update(base64Data)
    .digest("base64url");

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSignature);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const jsonStr = Buffer.from(base64Data, "base64url").toString("utf-8");
    return JSON.parse(jsonStr);
  } catch (e) {
    return null;
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, email, otp, otpToken, customerName, totalAmount } = body;

    const cleanEmail = (email || "").trim().toLowerCase();

    // 1. ACTION: SEND OTP
    if (action === "send") {
      if (!cleanEmail || !cleanEmail.includes("@")) {
        return NextResponse.json(
          { success: false, error: "A valid email address is required to receive the verification code." },
          { status: 400 }
        );
      }

      // Generate 6-digit numeric OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const exp = Date.now() + 10 * 60 * 1000; // 10 minutes

      const token = signOtpToken({
        email: cleanEmail,
        otp: generatedOtp,
        exp
      });

      const emailResult = await sendCodVerificationOtpEmail({
        email: cleanEmail,
        otp: generatedOtp,
        customerName: customerName || "Customer",
        totalAmount
      });

      return NextResponse.json({
        success: true,
        otpToken: token,
        emailSent: emailResult?.success ?? true,
        message: `A 6-digit verification code has been dispatched to ${cleanEmail}`
      });
    }

    // 2. ACTION: VERIFY OTP
    if (action === "verify") {
      if (!cleanEmail || !otp || !otpToken) {
        return NextResponse.json(
          { success: false, error: "Email, OTP, and token are required" },
          { status: 400 }
        );
      }

      const decoded = verifyOtpToken(otpToken);
      if (!decoded) {
        return NextResponse.json(
          { success: false, error: "Verification session has expired or is invalid. Please request a new code." },
          { status: 400 }
        );
      }

      if (Date.now() > decoded.exp) {
        return NextResponse.json(
          { success: false, error: "Verification code has expired. Please request a fresh code." },
          { status: 400 }
        );
      }

      if (decoded.email !== cleanEmail) {
        return NextResponse.json(
          { success: false, error: "Email mismatch with verification token." },
          { status: 400 }
        );
      }

      if (decoded.otp !== otp.trim()) {
        return NextResponse.json(
          { success: false, error: "Incorrect verification code. Please check your email and try again." },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        verified: true,
        message: "Email verified successfully!"
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("OTP API error:", error);
    return NextResponse.json({ success: false, error: "Error processing verification request." }, { status: 500 });
  }
}
