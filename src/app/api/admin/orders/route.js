import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { fetchOrdersFromSupabase, updateOrderInSupabase, deleteOrderInSupabase, clearAllOrdersInSupabase } from "@/lib/supabase";

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
    const orders = await fetchOrdersFromSupabase();
    return NextResponse.json({ success: true, orders });
  } catch (err) {
    console.error("Admin orders fetch error:", err);
    return NextResponse.json({ success: false, error: "Error fetching orders" }, { status: 500 });
  }
}

export async function PATCH(request) {
  const isAdmin = await checkAdminAuth();
  if (!isAdmin) {
    return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { orderId, updates } = body;
    if (!orderId || !updates) {
      return NextResponse.json({ success: false, error: "orderId and updates required" }, { status: 400 });
    }

    const success = await updateOrderInSupabase(orderId, updates);
    return NextResponse.json({ success });
  } catch (err) {
    console.error("Admin order update error:", err);
    return NextResponse.json({ success: false, error: "Error updating order" }, { status: 500 });
  }
}

export async function DELETE(request) {
  const isAdmin = await checkAdminAuth();
  if (!isAdmin) {
    return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { orderId, clearAll } = body;

    if (clearAll) {
      const success = await clearAllOrdersInSupabase();
      return NextResponse.json({ success, message: "All orders cleared" });
    }

    if (!orderId) {
      return NextResponse.json({ success: false, error: "orderId is required" }, { status: 400 });
    }

    const success = await deleteOrderInSupabase(orderId);
    return NextResponse.json({ success, message: `Order ${orderId} deleted` });
  } catch (err) {
    console.error("Admin order delete error:", err);
    return NextResponse.json({ success: false, error: "Error deleting order" }, { status: 500 });
  }
}

