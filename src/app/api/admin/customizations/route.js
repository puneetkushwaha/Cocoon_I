import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { fetchCustomizationsFromSupabase, updateCustomizationInSupabase } from "@/lib/supabase";

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cocoon_session");
  if (!sessionCookie || !sessionCookie.value) return false;
  const session = verifySessionToken(sessionCookie.value);
  return session && session.role === "admin";
}

export async function GET() {
  const isAdmin = await checkAdminAuth();
  if (!isAdmin) {
    return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const customizations = await fetchCustomizationsFromSupabase();
    return NextResponse.json({ success: true, customizations });
  } catch (err) {
    console.error("Admin customizations fetch error:", err);
    return NextResponse.json({ success: false, error: "Error fetching customizations" }, { status: 500 });
  }
}

export async function PATCH(request) {
  const isAdmin = await checkAdminAuth();
  if (!isAdmin) {
    return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { inquiryId, updates } = body;
    if (!inquiryId || !updates) {
      return NextResponse.json({ success: false, error: "inquiryId and updates required" }, { status: 400 });
    }

    const success = await updateCustomizationInSupabase(inquiryId, updates);
    return NextResponse.json({ success });
  } catch (err) {
    console.error("Admin customization update error:", err);
    return NextResponse.json({ success: false, error: "Error updating customization" }, { status: 500 });
  }
}
