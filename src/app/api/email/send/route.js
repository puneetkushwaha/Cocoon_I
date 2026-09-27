import { NextResponse } from "next/server";
import {
  sendOrderEmails,
  sendOrderStatusEmail,
  sendCustomInquiryEmails,
  sendProductLaunchBroadcast,
  sendOfferBroadcast,
  sendNewsletterWelcome,
} from "@/lib/email";

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, payload } = body;

    if (!action) {
      return NextResponse.json({ success: false, error: "Action is required" }, { status: 400 });
    }

    const origin = request.nextUrl.origin || "https://cocoon-crochet.vercel.app";

    switch (action) {
      case "order_confirmation":
      case "order_placed": {
        if (!payload?.order) {
          return NextResponse.json({ success: false, error: "Order details required" }, { status: 400 });
        }
        const result = await sendOrderEmails(payload.order);
        return NextResponse.json({ success: true, result });
      }

      case "order_status_update": {
        if (!payload?.order || !payload?.newStatus) {
          return NextResponse.json({ success: false, error: "Order and newStatus required" }, { status: 400 });
        }
        const result = await sendOrderStatusEmail(payload.order, payload.newStatus);
        return NextResponse.json({ success: true, result });
      }

      case "custom_inquiry": {
        if (!payload?.inquiry) {
          return NextResponse.json({ success: false, error: "Inquiry details required" }, { status: 400 });
        }
        const result = await sendCustomInquiryEmails(payload.inquiry);
        return NextResponse.json({ success: true, result });
      }

      case "newsletter_signup": {
        if (!payload?.email) {
          return NextResponse.json({ success: false, error: "Email required" }, { status: 400 });
        }
        await sendNewsletterWelcome(payload.email);
        return NextResponse.json({ success: true });
      }

      case "product_launch": {
        if (!payload?.product) {
          return NextResponse.json({ success: false, error: "Product details required" }, { status: 400 });
        }
        const recipients = payload.recipients || [];
        const result = await sendProductLaunchBroadcast({
          product: payload.product,
          recipients: recipients,
          siteUrl: origin,
        });
        return NextResponse.json({ success: true, result });
      }

      case "offer_broadcast": {
        if (!payload?.offer) {
          return NextResponse.json({ success: false, error: "Offer details required" }, { status: 400 });
        }
        const recipients = payload.recipients || [];
        const result = await sendOfferBroadcast({
          offer: payload.offer,
          recipients: recipients,
          siteUrl: origin,
        });
        return NextResponse.json({ success: true, result });
      }

      default:
        return NextResponse.json({ success: false, error: `Unknown email action: ${action}` }, { status: 400 });
    }
  } catch (error) {
    console.error("API /api/email/send error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to process email dispatch" }, { status: 500 });
  }
}
