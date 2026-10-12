import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createSessionToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const identifier = (body.identifier || "").trim().toLowerCase();
    const password = (body.password || "").trim();
    const name = (body.name || "").trim();
    const phoneInput = (body.phone || "").trim();
    const emailInput = (body.email || "").trim().toLowerCase();

    if (!identifier && !phoneInput && !emailInput) {
      return NextResponse.json({ success: false, error: "Please enter your email or phone number." }, { status: 400 });
    }

    const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const adminPassword = (process.env.ADMIN_PASSWORD || "").trim();

    const cookieStore = await cookies();

    // Check if this is Admin
    if (identifier === adminEmail || emailInput === adminEmail) {
      if (password !== adminPassword) {
        return NextResponse.json(
          { success: false, error: "Incorrect credentials. Please verify your details." },
          { status: 401 }
        );
      }

      // Valid Admin - create signed admin session cookie
      const sessionToken = createSessionToken(
        { role: "admin", email: adminEmail },
        60 * 60 * 24 * 7
      );

      cookieStore.set({
        name: "cocoon_session",
        value: sessionToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });

      return NextResponse.json({
        success: true,
        role: "admin",
        redirect: "/admin",
        message: "Welcome back, Mehak!"
      });
    }

    // Otherwise, Normal Customer Sign-In
    const isEmail = identifier.includes("@") || emailInput.includes("@");
    const cleanEmail = emailInput || (isEmail ? identifier : "");
    let cleanPhone = phoneInput || (!isEmail ? identifier : "");
    if (cleanPhone.includes("@")) {
      cleanPhone = "";
    }

    const customerUser = {
      name: name || (cleanEmail ? cleanEmail.split("@")[0] : "Customer"),
      email: cleanEmail,
      phone: cleanPhone,
      identifier: cleanEmail || cleanPhone || identifier,
      role: "customer"
    };

    const sessionToken = createSessionToken(
      { role: "customer", user: customerUser },
      60 * 60 * 24 * 30
    );

    cookieStore.set({
      name: "cocoon_session",
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return NextResponse.json({
      success: true,
      role: "customer",
      user: customerUser,
      redirect: "/",
      message: `Signed in successfully!`
    });
  } catch (error) {
    console.error("Auth login error:", error);
    return NextResponse.json({ success: false, error: "Internal authentication error." }, { status: 500 });
  }
}
