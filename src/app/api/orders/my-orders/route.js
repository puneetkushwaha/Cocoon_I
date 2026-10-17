import { NextResponse } from "next/server";
import { fetchOrdersFromSupabase } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/rateLimit";

// Short 15s in-memory cache for recent orders to prevent database overload under load
let ordersCache = {
  data: null,
  cachedAt: 0
};

export async function GET(request) {
  try {
    const rateLimit = checkRateLimit(request, {
      limit: 20,
      windowMs: 60 * 1000,
      identifier: "my_orders"
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please wait a moment." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const email = (searchParams.get("email") || "").trim().toLowerCase();
    const rawPhone = (searchParams.get("phone") || "").replace(/\D/g, "");
    const phone = rawPhone.length >= 10 ? rawPhone.slice(-10) : "";

    if (!email && !phone) {
      return NextResponse.json({ success: true, orders: [] });
    }

    const now = Date.now();
    let allOrders = ordersCache.data;

    if (!allOrders || now - ordersCache.cachedAt > 15000) {
      allOrders = await fetchOrdersFromSupabase();
      ordersCache = {
        data: allOrders,
        cachedAt: now
      };
    }

    const matchingOrders = (allOrders || []).filter((order) => {
      const orderEmail = (order.customerEmail || "").trim().toLowerCase();
      const orderPhoneRaw = (order.customerPhone || "").replace(/\D/g, "");
      const orderPhone = orderPhoneRaw.length >= 10 ? orderPhoneRaw.slice(-10) : "";

      const matchEmail = email && orderEmail === email;
      const matchPhone = phone && orderPhone === phone;
      return Boolean(matchEmail || matchPhone);
    });

    return NextResponse.json(
      {
        success: true,
        orders: matchingOrders
      },
      {
        headers: {
          "Cache-Control": "private, no-cache"
        }
      }
    );
  } catch (error) {
    console.error("Fetch my-orders error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}
