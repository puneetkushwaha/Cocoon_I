import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { bookCourierPickup } from "@/lib/shiprocket";
import { updateOrderInSupabase, fetchOrdersFromSupabase } from "@/lib/supabase";
import { sendOrderStatusEmail } from "@/lib/email";

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cocoon_session");
  if (!sessionCookie || !sessionCookie.value) return false;
  const session = verifySessionToken(sessionCookie.value);
  return session && session.role === "admin";
}

export async function GET(request) {
  const isAdmin = await checkAdminAuth();
  if (!isAdmin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const pincode = searchParams.get("pincode") || "721302";
    const weight = Number(searchParams.get("weight")) || 0.25;
    const isCod = searchParams.get("cod") === "1" ? 1 : 0;

    const { fetchAvailableCouriers } = await import("@/lib/shiprocket");
    const couriers = await fetchAvailableCouriers({
      deliveryPincode: pincode,
      weight,
      isCod
    });

    return NextResponse.json({
      success: true,
      couriers,
      cheapest: couriers[0] || null
    });
  } catch (err) {
    console.error("API /api/shipping/shiprocket GET error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  const isAdmin = await checkAdminAuth();
  if (!isAdmin) {
    return NextResponse.json({ success: false, error: "Unauthorized: Admin privileges required" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { orderId, order: clientOrder, parcelDimensions, pickupDate, courierPreference } = body;

    if (!orderId && !clientOrder?.id) {
      return NextResponse.json({ success: false, error: "Order ID or order details required" }, { status: 400 });
    }

    const targetOrderId = orderId || clientOrder.id;

    // Retrieve order details: from Supabase or fallback to clientOrder
    let orderToShip = clientOrder;
    try {
      const dbOrders = await fetchOrdersFromSupabase();
      const found = dbOrders.find((o) => o.id === targetOrderId);
      if (found) {
        orderToShip = { ...found, ...clientOrder };
      }
    } catch (e) {
      console.warn("Notice fetching order from Supabase:", e.message);
    }

    if (!orderToShip) {
      return NextResponse.json({ success: false, error: `Order ${targetOrderId} not found` }, { status: 404 });
    }

    // Book courier pickup via Shiprocket (Live API or graceful intelligent simulator)
    const bookingResult = await bookCourierPickup({
      order: orderToShip,
      parcelDimensions: parcelDimensions || { weight: 0.25, length: 20, breadth: 15, height: 8 },
      pickupDate: pickupDate || null,
      courierPreference: courierPreference || "auto"
    });

    if (!bookingResult || !bookingResult.success) {
      return NextResponse.json({
        success: false,
        error: bookingResult?.message || "Courier booking failed"
      }, { status: 500 });
    }

    // Updates to save
    const updates = {
      status: "Shipped",
      courierName: bookingResult.courierName,
      awbCode: bookingResult.awbCode,
      shipmentId: bookingResult.shipmentId,
      trackingUrl: bookingResult.trackingUrl,
      labelUrl: bookingResult.labelUrl,
      pickupScheduledAt: bookingResult.pickupDate,
      notes: (orderToShip.notes ? orderToShip.notes + " • " : "") +
        `Shipped via ${bookingResult.courierName} (AWB: ${bookingResult.awbCode})`
    };

    // Update in Supabase
    await updateOrderInSupabase(targetOrderId, updates);

    const updatedOrder = {
      ...orderToShip,
      ...updates
    };

    // Trigger customer shipping notification email via Resend
    if (updatedOrder.customerEmail && updatedOrder.customerEmail.includes("@")) {
      try {
        await sendOrderStatusEmail(updatedOrder, "Shipped");
      } catch (mailErr) {
        console.warn("Shipping email notice:", mailErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      booking: bookingResult,
      updatedOrder: updatedOrder,
      message: bookingResult.message
    });
  } catch (err) {
    console.error("API /api/shipping/shiprocket error:", err);
    return NextResponse.json({
      success: false,
      error: err.message || "Failed to book courier pickup"
    }, { status: 500 });
  }
}
