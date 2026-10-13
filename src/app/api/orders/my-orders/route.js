import { NextResponse } from "next/server";
import { fetchOrdersFromSupabase } from "@/lib/supabase";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = (searchParams.get("email") || "").trim().toLowerCase();
    const rawPhone = (searchParams.get("phone") || "").replace(/\D/g, "");
    const phone = rawPhone.length >= 10 ? rawPhone.slice(-10) : "";

    if (!email && !phone) {
      return NextResponse.json({ success: true, orders: [] });
    }

    const allOrders = await fetchOrdersFromSupabase();
    const matchingOrders = allOrders.filter((order) => {
      const orderEmail = (order.customerEmail || "").trim().toLowerCase();
      const orderPhoneRaw = (order.customerPhone || "").replace(/\D/g, "");
      const orderPhone = orderPhoneRaw.length >= 10 ? orderPhoneRaw.slice(-10) : "";

      const matchEmail = email && orderEmail === email;
      const matchPhone = phone && orderPhone === phone;
      return Boolean(matchEmail || matchPhone);
    });

    return NextResponse.json({
      success: true,
      orders: matchingOrders
    });
  } catch (error) {
    console.error("Fetch my-orders error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}
