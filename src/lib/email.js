import { Resend } from "resend";

const getResendClient = () => {
  const apiKey = (process.env.RESEND_API_KEY || "").trim();
  if (!apiKey) {
    return null;
  }
  return new Resend(apiKey);
};

export const FROM_SENDER = process.env.RESEND_FROM_EMAIL || "COCOON <onboarding@dev2dev.online>";
export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "cocoon.crafts.official@gmail.com").trim().toLowerCase();

/**
 * Standard Email Shell with COCOON Luxury Artisanal Branding
 */
const renderEmailShell = ({ title, preheader, contentHtml }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #FAF5EE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2C2623; -webkit-font-smoothing: antialiased; }
    table { border-collapse: collapse; }
    a { color: #B06B5B; text-decoration: none; }
  </style>
</head>
<body style="margin: 0; padding: 30px 10px; background-color: #FAF5EE;">
  <span style="display: none; font-size: 1px; color: #FAF5EE; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${preheader || title}
  </span>
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 24px; overflow: hidden; border: 1px solid #EAE0D2; box-shadow: 0 10px 30px rgba(44, 38, 35, 0.05);">
          
          <!-- Brand Header -->
          <tr>
            <td align="center" style="padding: 36px 30px 24px 30px; background: #FAF7F2; border-bottom: 1px solid #EFE8DD;">
              <h1 style="margin: 0; font-size: 32px; letter-spacing: 0.28em; text-transform: uppercase; font-weight: 300; color: #2C2623;">
                COCOON
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #B06B5B; font-weight: 600;">
                Handcrafted Crochet • Agra
              </p>
            </td>
          </tr>

          <!-- Dynamic Body Content -->
          <tr>
            <td style="padding: 36px 32px; font-size: 14px; line-height: 1.6; color: #2C2623;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 28px 30px; background-color: #FAF6F0; border-top: 1px solid #EFE8DD; text-align: center; font-size: 12px; color: #736B63;">
              <p style="margin: 0 0 8px 0; font-weight: 600; color: #2C2623;">
                COCOON Artisanal Studio
              </p>
              <p style="margin: 0 0 12px 0;">
                Knot-by-knot slow crafted with care • 100% Organic Milk Cotton
              </p>
              <p style="margin: 0 0 16px 0;">
                WhatsApp Support: <a href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918171902255'}" style="color: #526B57; font-weight: bold;">Studio WhatsApp</a> &nbsp;•&nbsp; 
                Instagram: <a href="https://www.instagram.com/cocoon._.u/" style="color: #B06B5B; font-weight: bold;">@cocoon._.u</a>
              </p>
              <p style="margin: 0; font-size: 10px; color: #A8A199;">
                © 2026 COCOON. All rights reserved. You are receiving this because of your relationship with COCOON.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

/**
 * Universal Sender helper
 */
export async function sendEmail({ to, subject, html, replyTo }) {
  try {
    const resend = getResendClient();
    const recipients = Array.isArray(to) ? to.filter(Boolean) : [to].filter(Boolean);
    
    if (recipients.length === 0) {
      console.warn("sendEmail: No valid recipients provided.");
      return { success: false, error: "No recipients" };
    }

    const payload = {
      from: FROM_SENDER,
      to: recipients,
      subject: subject,
      html: html,
      reply_to: replyTo || ADMIN_EMAIL,
    };

    const data = await resend.emails.send(payload);
    return { success: true, data };
  } catch (error) {
    console.error("Resend sendEmail error:", error);
    return { success: false, error: error.message || error };
  }
}

/**
 * 1. ORDER CONFIRMATION EMAIL (Customer & Admin)
 */
export async function sendOrderEmails(order) {
  const itemsHtml = (order.items || [])
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #F2ECE1;">
          <strong style="color: #2C2623; font-size: 14px;">${item.name}</strong>
          <br>
          <span style="font-size: 12px; color: #8A8179;">Colorway: ${item.color || "Standard"} &nbsp;•&nbsp; Qty: ${item.quantity || 1}</span>
        </td>
        <td align="right" style="padding: 10px 0; border-bottom: 1px solid #F2ECE1; font-weight: 600; color: #2C2623;">
          ₹${(Number(item.price) || 0) * (Number(item.quantity) || 1)}
        </td>
      </tr>
    `
    )
    .join("");

  // Customer Email HTML
  const customerContent = `
    <div style="text-align: center; margin-bottom: 24px;">
      
      <h2 style="font-size: 22px; font-weight: 600; color: #2C2623; margin: 12px 0 6px 0;">Order Confirmed!</h2>
      <p style="margin: 0; color: #665E57; font-size: 13px;">Thank you for embracing slow handcrafted fashion, ${order.customerName || "Patron"}.</p>
    </div>

    <div style="background-color: #FAF7F2; border-radius: 16px; padding: 18px; margin-bottom: 24px; border: 1px solid #EFE8DD;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td style="font-size: 12px; color: #7A726A;">Order ID:</td>
          <td align="right" style="font-size: 13px; font-weight: bold; color: #B06B5B;">${order.id}</td>
        </tr>
        <tr>
          <td style="font-size: 12px; color: #7A726A; padding-top: 6px;">Order Date:</td>
          <td align="right" style="font-size: 12px; color: #2C2623; padding-top: 6px;">${new Date(order.date || Date.now()).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</td>
        </tr>
        <tr>
          <td style="font-size: 12px; color: #7A726A; padding-top: 6px;">Payment Mode:</td>
          <td align="right" style="font-size: 12px; color: ${order.paymentMethod === 'COD' ? '#B06B5B' : '#2B7A4B'}; font-weight: bold; padding-top: 6px;">
            ${order.paymentMethod === 'COD' ? 'Cash on Delivery (Pay ₹' + order.totalAmount + ' upon Arrival)' : '✓ Paid Online via Razorpay'}
          </td>
        </tr>
        ${order.razorpayPaymentId ? `
        <tr>
          <td style="font-size: 11px; color: #7A726A; padding-top: 6px;">Razorpay Txn:</td>
          <td align="right" style="font-size: 11px; font-family: monospace; color: #526B57; padding-top: 6px;">${order.razorpayPaymentId}</td>
        </tr>` : ""}
      </table>
    </div>

    <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #7A726A; margin: 0 0 12px 0; border-bottom: 2px solid #FAF0ED; padding-bottom: 6px;">
      Your Handcrafted Pieces
    </h3>

    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
      ${itemsHtml}
      <tr>
        <td style="padding: 14px 0 6px 0; font-size: 13px; color: #7A726A;">Complimentary Packaging</td>
        <td align="right" style="padding: 14px 0 6px 0; font-size: 13px; color: #2B7A4B; font-weight: 600;">FREE</td>
      </tr>
      <tr>
        <td style="padding: 4px 0 12px 0; font-size: 13px; color: #7A726A;">Express Transit from Agra</td>
        <td align="right" style="padding: 4px 0 12px 0; font-size: 13px; color: #2B7A4B; font-weight: 600;">Included</td>
      </tr>
      <tr style="border-top: 2px solid #2C2623;">
        <td style="padding: 12px 0; font-size: 16px; font-weight: bold; color: #2C2623;">${order.paymentMethod === 'COD' ? 'Total Payable on Delivery:' : 'Total Paid:'}</td>
        <td align="right" style="padding: 12px 0; font-size: 18px; font-weight: bold; color: #B06B5B;">₹${order.totalAmount}</td>
      </tr>
    </table>

    <div style="background-color: #FDFBF7; border-left: 4px solid #B06B5B; border-radius: 8px; padding: 14px 16px; margin-bottom: 24px;">
      <strong style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #B06B5B; display: block; margin-bottom: 4px;">
        Delivery Destination
      </strong>
      <p style="margin: 0; font-size: 13px; color: #3A332E; line-height: 1.5;">
        ${order.address}<br>
        Contact: <strong>${order.customerPhone}</strong>
      </p>
    </div>

    <div style="text-align: center; margin-top: 30px;">
      <a href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918171902255'}?text=Hi%20COCOON!%20Checking%20in%20on%20my%20order%20${order.id}" 
         style="display: inline-block; background-color: #526B57; color: #FFFFFF; padding: 14px 28px; border-radius: 50px; font-size: 13px; font-weight: bold; letter-spacing: 0.05em; text-transform: uppercase;">
        Track Order on WhatsApp
      </a>
    </div>
  `;

  // Admin Alert Email HTML
  const adminContent = `
    <div style="background-color: #FAF4ED; border: 1px solid #ECCEC7; border-radius: 12px; padding: 14px 18px; margin-bottom: 24px;">
      <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em; color: #B06B5B; display: block;">
        NEW STORE ORDER RECEIVED
      </span>
      <h2 style="font-size: 20px; font-weight: bold; color: #2C2623; margin: 4px 0 0 0;">
        Order #${order.id} • ₹${order.totalAmount}
      </h2>
    </div>

    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px; font-size: 13px;">
      <tr>
        <td style="padding: 6px 0; color: #736B63;">Customer Name:</td>
        <td style="padding: 6px 0; font-weight: bold; color: #2C2623;">${order.customerName}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #736B63;">Phone / WhatsApp:</td>
        <td style="padding: 6px 0; font-weight: bold;"><a href="tel:${order.customerPhone}">${order.customerPhone}</a></td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #736B63;">Email Address:</td>
        <td style="padding: 6px 0; font-weight: bold;">${order.customerEmail || "Not provided"}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #736B63;">Delivery Address:</td>
        <td style="padding: 6px 0; color: #2C2623;">${order.address}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #736B63;">Payment:</td>
        <td style="padding: 6px 0; color: ${order.paymentMethod === 'COD' ? '#B06B5B' : '#2B7A4B'}; font-weight: bold;">
          ${order.paymentMethod === 'COD' ? 'Cash on Delivery (Collect ₹' + order.totalAmount + ' on Delivery)' : 'Razorpay Prepaid (' + (order.razorpayPaymentId || 'Verified') + ')'}
        </td>
      </tr>
      ${order.notes ? `
      <tr>
        <td style="padding: 6px 0; color: #B06B5B; font-weight: bold;">Custom Note:</td>
        <td style="padding: 6px 0; color: #B06B5B;">${order.notes}</td>
      </tr>` : ""}
    </table>

    <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: #7A726A; margin: 18px 0 8px 0; border-bottom: 1px solid #EFE8DD; padding-bottom: 4px;">
      Ordered Items to Knit:
    </h3>
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      ${itemsHtml}
    </table>

    <div style="text-align: center; margin-top: 28px;">
      <a href="https://wa.me/91${(order.customerPhone || "").replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(order.customerName || "")}!%20Thank%20you%20for%20ordering%20from%20COCOON.%20Your%20order%20${order.id}%20is%20now%20prepped%20for%20crafting%20in%20Agra" 
         style="display: inline-block; background-color: #2C2623; color: #FFFFFF; padding: 12px 24px; border-radius: 50px; font-size: 12px; font-weight: bold; text-transform: uppercase;">
        Message Customer on WhatsApp &rarr;
      </a>
    </div>
  `;

  // 1. Send Customer Confirmation Email (if valid email provided)
  const results = { customerSent: false, adminSent: false };
  if (order.customerEmail && order.customerEmail.includes("@")) {
    const custHtml = renderEmailShell({
      title: `Order Confirmed: #${order.id} • COCOON`,
      preheader: `Thank you for your order! Your handcrafted piece is prepped for slow-crafting in Agra.`,
      contentHtml: customerContent,
    });
    const custRes = await sendEmail({
      to: order.customerEmail,
      subject: `Order Confirmed: #${order.id} | Handcrafted in Agra • COCOON`,
      html: custHtml,
    });
    results.customerSent = custRes.success;
  }

  // 2. Send Admin Notification Email
  const admHtml = renderEmailShell({
    title: `New Order #${order.id} from ${order.customerName} (₹${order.totalAmount})`,
    preheader: `New order paid via Razorpay! Full details and customer contact info inside.`,
    contentHtml: adminContent,
  });
  const admRes = await sendEmail({
    to: ADMIN_EMAIL,
    subject: `New Order #${order.id} received: ₹${order.totalAmount} from ${order.customerName}`,
    html: admHtml,
  });
  results.adminSent = admRes.success;

  return results;
}

/**
 * 2. ORDER STATUS UPDATE EMAIL (Customer & Admin)
 */
export async function sendOrderStatusEmail(order, newStatus) {
  const statusDescriptions = {
    "Processing": "Your order has been verified and yarn is being prepped in our Agra studio.",
    "Processing (Paid)": "Payment verified! Our artisan has started hand-knitting your piece knot-by-knot.",
    "Hand-Knitted": "Crafting is complete! Your piece has been inspected, carefully steamed, and placed in our gift box.",
    "Shipped": "Your parcel is on its way! Dispatched from Agra with express tracking.",
    "Delivered": "Your package has arrived! We hope it brings warmth and joy to your days.",
    "Cancelled": "Your order has been cancelled. If any refund is due, it will reflect within 3–5 working days."
  };

  const statusNote = statusDescriptions[newStatus] || `Your order status has been updated to "${newStatus}".`;

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      
      <h2 style="font-size: 22px; font-weight: 600; color: #2C2623; margin: 12px 0 6px 0;">Order Status Update</h2>
      <p style="margin: 0; color: #7A726A; font-size: 13px;">Update for Order <strong>#${order.id}</strong></p>
    </div>

    <div style="background-color: #FAF7F2; border-radius: 16px; padding: 20px; margin-bottom: 24px; border: 1px solid #EFE8DD; text-align: center;">
      <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #8C827A; display: block; margin-bottom: 6px;">
        Current Stage
      </span>
      <span style="font-size: 18px; font-weight: bold; color: #B06B5B; background: #FFFFFF; padding: 6px 18px; border-radius: 50px; border: 1px solid #ECCEC7; display: inline-block;">
        ${newStatus}
      </span>
      <p style="margin: 14px 0 0 0; font-size: 13px; color: #4A423D; line-height: 1.5;">
        ${statusNote}
      </p>
    </div>

    ${newStatus === "Delivered" ? `
    <div style="background: linear-gradient(135deg, #FFF8F5 0%, #FDF3E7 100%); border: 2px dashed #E8B4A8; border-radius: 18px; padding: 22px; margin-bottom: 24px; text-align: center;">
      <span style="font-size: 22px; display: block; margin-bottom: 4px;">⭐⭐⭐⭐⭐</span>
      <h3 style="font-size: 17px; font-weight: bold; color: #2C2623; margin: 0 0 6px 0;">
        Rate Your Handcrafted Piece & Get 15% OFF!
      </h3>
      <p style="font-size: 13px; color: #5C524B; line-height: 1.5; margin: 0 0 16px 0;">
        We hope you adore your handcrafted heirloom. Share your feedback with a quick photo or video review, and receive an instant <strong>flat 15% OFF discount voucher</strong> on your next purchase!
      </p>
      <a href="https://cocoon-psi.vercel.app/review?orderId=${encodeURIComponent(order.id)}&productId=${encodeURIComponent(order.items?.[0]?.id || '')}&productName=${encodeURIComponent(order.items?.[0]?.name || '')}&name=${encodeURIComponent(order.customerName || '')}&phone=${encodeURIComponent(order.customerPhone || '')}" 
         style="display: inline-block; background-color: #B06B5B; color: #FFFFFF; padding: 13px 26px; border-radius: 50px; font-size: 13px; font-weight: bold; letter-spacing: 0.05em; text-transform: uppercase; text-decoration: none; box-shadow: 0 4px 12px rgba(176,107,91,0.25);">
        ★ Rate & Claim 15% OFF Voucher
      </a>
    </div>
    ` : ""}

    <div style="background-color: #FFFFFF; border: 1px solid #EFE8DD; border-radius: 14px; padding: 16px; font-size: 13px; margin-bottom: 24px;">
      <p style="margin: 0 0 6px 0;"><strong>Recipient:</strong> ${order.customerName}</p>
      <p style="margin: 0 0 6px 0;"><strong>Delivery Address:</strong> ${order.address}</p>
      <p style="margin: 0;"><strong>Contact:</strong> ${order.customerPhone}</p>
    </div>

    <div style="text-align: center;">
      <a href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918171902255'}?text=Hi%20COCOON!%20Inquiring%20about%20my%20order%20${order.id}%20status%20(${encodeURIComponent(newStatus)})" 
         style="display: inline-block; background-color: #526B57; color: #FFFFFF; padding: 13px 26px; border-radius: 50px; font-size: 12px; font-weight: bold; text-transform: uppercase;">
        Contact Studio on WhatsApp
      </a>
    </div>
  `;

  const results = { customerSent: false, adminSent: false };

  if (order.customerEmail && order.customerEmail.includes("@")) {
    const isDelivered = newStatus === "Delivered";
    const emailHtml = renderEmailShell({
      title: isDelivered 
        ? `Delivered! Rate Your Handcrafted Piece & Claim 15% OFF • COCOON`
        : `Update on Order #${order.id}: ${newStatus} • COCOON`,
      preheader: isDelivered 
        ? `Your package has arrived! Leave a rating & review to get 15% OFF on your next order.`
        : `Your COCOON handcrafted order status is now: ${newStatus}.`,
      contentHtml: content,
    });
    const custRes = await sendEmail({
      to: order.customerEmail,
      subject: isDelivered
        ? `Delivered! Rate Your Handcrafted Piece & Claim 15% OFF • COCOON`
        : `Order #${order.id} Update: ${newStatus} | COCOON Agra`,
      html: emailHtml,
    });
    results.customerSent = custRes.success;
  }

  // Admin Notification
  const admHtml = renderEmailShell({
    title: `Order #${order.id} status changed to ${newStatus}`,
    preheader: `Status updated in store manager.`,
    contentHtml: `
      <p>Status of Order <strong>#${order.id}</strong> (${order.customerName}) has been updated to:</p>
      <h3 style="color: #B06B5B;">${newStatus}</h3>
      <p>Customer notified: <strong>${results.customerSent ? "Yes (Email sent)" : "No email available"}</strong></p>
    `,
  });
  const admRes = await sendEmail({
    to: ADMIN_EMAIL,
    subject: `Status Update: Order #${order.id} &rarr; ${newStatus}`,
    html: admHtml,
  });
  results.adminSent = admRes.success;

  return results;
}

/**
 * 3. CUSTOM INQUIRY / COMMISSION SLIP EMAIL (Customer & Admin)
 */
export async function sendCustomInquiryEmails(inquiry) {
  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      
      <h2 style="font-size: 22px; font-weight: 600; color: #2C2623; margin: 12px 0 6px 0;">Bespoke Commission Received!</h2>
      <p style="margin: 0; color: #7A726A; font-size: 13px;">Thank you for sharing your creative vision with COCOON, ${inquiry.name}.</p>
    </div>

    <div style="background-color: #FAF7F2; border-radius: 16px; padding: 20px; margin-bottom: 24px; border: 1px solid #EFE8DD;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13px;">
        <tr>
          <td style="padding: 6px 0; color: #7A726A;">Inquiry ID:</td>
          <td style="padding: 6px 0; font-weight: bold; color: #B06B5B;">${inquiry.id || "CUST-INQ"}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #7A726A;">Custom Piece:</td>
          <td style="padding: 6px 0; font-weight: bold; color: #2C2623;">${inquiry.productName || inquiry.category}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #7A726A;">Color Preference:</td>
          <td style="padding: 6px 0; color: #2C2623;">${inquiry.colorway || "To be discussed"}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #7A726A;">Budget Range:</td>
          <td style="padding: 6px 0; color: #526B57; font-weight: 600;">${inquiry.budget || "Standard"}</td>
        </tr>
        ${inquiry.neededBy ? `
        <tr>
          <td style="padding: 6px 0; color: #7A726A;">Needed By:</td>
          <td style="padding: 6px 0; color: #2C2623;">${inquiry.neededBy}</td>
        </tr>` : ""}
      </table>

      ${inquiry.idea ? `
      <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid #EAE0D2;">
        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #8A8179; display: block; margin-bottom: 4px;">Design Notes:</span>
        <p style="margin: 0; font-size: 13px; color: #3A332E; line-height: 1.5; font-style: italic;">"${inquiry.idea}"</p>
      </div>` : ""}

      ${inquiry.mediaUrl ? `
      <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid #EAE0D2;">
        <a href="${inquiry.mediaUrl}" target="_blank" style="display: inline-block; font-size: 12px; color: #B06B5B; font-weight: bold;">
          View Attached Visual Reference &rarr;
        </a>
      </div>` : ""}
    </div>

    <p style="font-size: 13px; color: #574F49; line-height: 1.6; text-align: center;">
      Our studio artisan will review your inquiry and reach out to you on <strong>${inquiry.phone}</strong> with authentic yarn shade swatches and custom pricing.
    </p>

    <div style="text-align: center; margin-top: 24px;">
      <a href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918171902255'}?text=Hi%20COCOON!%20I%20just%20submitted%20my%20custom%20commission%20slip%20for%20${encodeURIComponent(inquiry.productName || "")}" 
         style="display: inline-block; background-color: #526B57; color: #FFFFFF; padding: 13px 26px; border-radius: 50px; font-size: 12px; font-weight: bold; text-transform: uppercase;">
        Chat Directly with Studio
      </a>
    </div>
  `;

  const results = { customerSent: false, adminSent: false };

  if (inquiry.email && inquiry.email.includes("@")) {
    const custHtml = renderEmailShell({
      title: `Bespoke Commission Received • COCOON`,
      preheader: `Thank you for reaching out! Our artisan team will connect with you on WhatsApp shortly.`,
      contentHtml: content,
    });
    const custRes = await sendEmail({
      to: inquiry.email,
      subject: `Bespoke Commission Received: ${inquiry.productName || "Custom Crochet"} | COCOON`,
      html: custHtml,
    });
    results.customerSent = custRes.success;
  }

  // Admin Copy
  const admHtml = renderEmailShell({
    title: `New Custom Order Inquiry from ${inquiry.name}`,
    preheader: `Customer submitted a bespoke commission slip.`,
    contentHtml: `
      <div style="background-color: #FAF4ED; border: 1px solid #ECCEC7; border-radius: 12px; padding: 14px 18px; margin-bottom: 20px;">
        <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #B06B5B;">New Custom Commission</span>
        <h3 style="margin: 4px 0 0 0; color: #2C2623;">${inquiry.productName || inquiry.category}</h3>
      </div>
      <p><strong>Customer:</strong> ${inquiry.name}</p>
      <p><strong>WhatsApp / Phone:</strong> <a href="tel:${inquiry.phone}">${inquiry.phone}</a></p>
      <p><strong>Email:</strong> ${inquiry.email || "N/A"}</p>
      <p><strong>Budget:</strong> ${inquiry.budget || "Flexible"}</p>
      <p><strong>Colorway:</strong> ${inquiry.colorway || "N/A"}</p>
      <p><strong>Needed By:</strong> ${inquiry.neededBy || "N/A"}</p>
      <p><strong>Idea:</strong> ${inquiry.idea || "N/A"}</p>
      ${inquiry.mediaUrl ? `<p><strong>Media Link:</strong> <a href="${inquiry.mediaUrl}">View Uploaded Media</a></p>` : ""}
      <div style="text-align: center; margin-top: 20px;">
        <a href="https://wa.me/91${(inquiry.phone || "").replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(inquiry.name)}!%20I%20received%20your%20custom%20crochet%20request%20at%20COCOON"
           style="background-color: #526B57; color: #FFFFFF; padding: 12px 24px; border-radius: 50px; display: inline-block; font-weight: bold; font-size: 12px; text-transform: uppercase;">
          Open WhatsApp Chat with Customer &rarr;
        </a>
      </div>
    `,
  });
  const admRes = await sendEmail({
    to: ADMIN_EMAIL,
    subject: `New Custom Inquiry: ${inquiry.name} (${inquiry.productName || inquiry.category})`,
    html: admHtml,
  });
  results.adminSent = admRes.success;

  return results;
}

/**
 * 4. NEW PRODUCT LAUNCH BROADCAST EMAIL
 */
export async function sendProductLaunchBroadcast({ product, recipients, siteUrl = "https://cocoon-psi.vercel.app" }) {
  const productUrl = `${siteUrl}/product/${product.id}`;
  const imgUrl = product.imgUrl && product.imgUrl.startsWith("http")
    ? product.imgUrl
    : `${siteUrl}${product.imgUrl || "/products/items/sunflower-granny-backpack.jpg"}`;

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.25em; color: #B06B5B; display: inline-block; background-color: #F8E5E1; padding: 4px 14px; border-radius: 50px; border: 1px solid #ECCEC7; margin-bottom: 8px;">
        New Drop Alert
      </span>
      <h2 style="font-size: 26px; font-weight: 300; font-family: Georgia, serif; color: #2C2623; margin: 8px 0 6px 0;">
        Introducing ${product.name}
      </h2>
      <p style="margin: 0; color: #7A726A; font-size: 13px;">Freshly handcrafted in our Agra studio with 100% organic milk cotton.</p>
    </div>

    <!-- Product Showcase Card -->
    <div style="background-color: #FFFFFF; border-radius: 20px; overflow: hidden; border: 1px solid #EAE0D2; box-shadow: 0 4px 20px rgba(0,0,0,0.04); margin-bottom: 24px; text-align: center;">
      ${imgUrl ? `
      <div style="width: 100%; max-height: 380px; overflow: hidden; background-color: #FAF6F0;">
        <img src="${imgUrl}" alt="${product.name}" style="width: 100%; max-width: 500px; height: auto; display: block; margin: 0 auto;">
      </div>` : ""}
      
      <div style="padding: 24px 20px; text-align: left;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px;">
          <div>
            <h3 style="margin: 0; font-size: 18px; color: #2C2623;">${product.name}</h3>
            ${product.badge ? `<span style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #B06B5B; letter-spacing: 0.1em;">${product.badge}</span>` : ""}
          </div>
          <div style="text-align: right;">
            <span style="font-size: 20px; font-weight: bold; color: #B06B5B;">₹${product.price}</span>
            ${product.originalPrice ? `<br><span style="font-size: 12px; color: #9E958C; text-decoration: line-through;">₹${product.originalPrice}</span>` : ""}
          </div>
        </div>

        <p style="font-size: 13px; color: #574F49; line-height: 1.6; margin: 0 0 20px 0;">
          ${product.desc || "A gentle, tactile treasure woven knot-by-knot. Hypoallergenic, skin-friendly, and packaged with complimentary organic cotton packaging."}
        </p>

        <div style="text-align: center;">
          <a href="${productUrl}" 
             style="display: inline-block; background-color: #B06B5B; color: #FFFFFF; padding: 14px 32px; border-radius: 50px; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; box-shadow: 0 4px 14px rgba(176, 107, 91, 0.3);">
            Explore & Shop Piece &rarr;
          </a>
        </div>
      </div>
    </div>

    <div style="text-align: center; font-size: 12px; color: #7A726A;">
      <p style="margin: 0;">Limited slots available per drop. Handcrafted to order in Agra.</p>
    </div>
  `;

  const html = renderEmailShell({
    title: `New Drop: ${product.name} • COCOON`,
    preheader: `Discover our newest handcrafted treasure: ${product.name}. Handcrafted knot-by-knot in Agra.`,
    contentHtml: content,
  });

  const uniqueRecipients = Array.from(new Set(recipients.filter((e) => e && e.includes("@"))));
  const results = { count: 0, errors: [] };

  // Send to customers
  for (const email of uniqueRecipients) {
    const res = await sendEmail({
      to: email,
      subject: `New Drop: ${product.name} | Handcrafted in Agra • COCOON`,
      html: html,
    });
    if (res.success) results.count++;
    else results.errors.push({ email, error: res.error });
  }

  // Send admin copy
  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `[Broadcast Sent] New Product Launch: ${product.name} (Sent to ${results.count} patrons)`,
    html: html,
  });

  return results;
}

/**
 * 5. NEW OFFER & PROMO BROADCAST EMAIL
 */
export async function sendOfferBroadcast({ offer, recipients, siteUrl = "https://cocoon-psi.vercel.app" }) {
  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      
      <h2 style="font-size: 26px; font-weight: 300; font-family: Georgia, serif; color: #2C2623; margin: 8px 0 6px 0;">
        ${offer.title || "Special Studio Celebration"}
      </h2>
      <p style="margin: 0; color: #7A726A; font-size: 13px;">A gentle gift from our Agra needlework desk to you.</p>
    </div>

    <!-- Offer Highlight Card -->
    <div style="background: linear-gradient(135deg, #FAF4ED 0%, #F5ECE1 100%); border-radius: 20px; padding: 28px 24px; border: 1px solid #ECCEC7; margin-bottom: 24px; text-align: center;">
      ${offer.badge ? `
      <span style="display: inline-block; background-color: #B06B5B; color: #FFFFFF; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em; padding: 4px 14px; rounded-full; border-radius: 50px; margin-bottom: 12px;">
        ${offer.badge}
      </span>` : ""}

      <p style="font-size: 14px; color: #3A332E; line-height: 1.6; margin: 0 0 18px 0;">
        ${offer.description || "Enjoy complimentary gifts and special savings on slow-crafted heirloom crochet treasures."}
      </p>

      ${offer.couponCode ? `
      <div style="display: inline-block; background-color: #FFFFFF; border: 2px dashed #B06B5B; padding: 12px 24px; border-radius: 12px; margin-bottom: 18px;">
        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #7A726A; display: block;">Use Code at Checkout</span>
        <span style="font-size: 20px; font-weight: bold; font-family: monospace; color: #B06B5B; letter-spacing: 0.1em;">${offer.couponCode}</span>
      </div>` : ""}

      <div>
        <a href="${offer.link || siteUrl}" 
           style="display: inline-block; background-color: #2C2623; color: #FFFFFF; padding: 14px 32px; border-radius: 50px; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; text-decoration: none;">
          Claim Offer on Store &rarr;
        </a>
      </div>
    </div>

    <div style="text-align: center; font-size: 12px; color: #7A726A;">
      <p style="margin: 0;">100% Handcrafted with pure organic milk cotton in Agra • Prepaid online delivery across India.</p>
    </div>
  `;

  const html = renderEmailShell({
    title: `${offer.title || "Special Offer"} • COCOON`,
    preheader: offer.description || "A special gift from COCOON's Agra studio.",
    contentHtml: content,
  });

  const uniqueRecipients = Array.from(new Set(recipients.filter((e) => e && e.includes("@"))));
  const results = { count: 0, errors: [] };

  for (const email of uniqueRecipients) {
    const res = await sendEmail({
      to: email,
      subject: `${offer.title || "Special Offer from COCOON"} | Handcrafted in Agra`,
      html: html,
    });
    if (res.success) results.count++;
    else results.errors.push({ email, error: res.error });
  }

  // Admin Copy
  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `[Broadcast Sent] Offer: ${offer.title} (Sent to ${results.count} patrons)`,
    html: html,
  });

  return results;
}

/**
 * 6. NEWSLETTER / POSTCARD SUBSCRIPTION EMAIL
 */
export async function sendNewsletterWelcome(email) {
  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      
      <h2 style="font-size: 22px; font-weight: 600; color: #2C2623; margin: 12px 0 6px 0;">Welcome to Our Needlework Circle!</h2>
      <p style="margin: 0; color: #7A726A; font-size: 13px;">Postcard from Agra • COCOON</p>
    </div>

    <p style="font-size: 14px; color: #3A332E; line-height: 1.6; margin-bottom: 20px;">
      Thank you for welcoming COCOON into your inbox. You are now part of our quiet needlework circle. 
      You will receive first notice of our small-batch drops, private bespoke slots, and gentle stories behind our yarn craft in Agra.
    </p>

    <div style="background-color: #FAF7F2; border-radius: 16px; padding: 18px; margin-bottom: 24px; border: 1px solid #EFE8DD; text-align: center;">
      <p style="margin: 0 0 10px 0; font-size: 13px; font-weight: 600; color: #2C2623;">
        Every piece is made with 100% pure organic milk cotton.
      </p>
      <a href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918171902255'}" style="color: #526B57; font-weight: bold; font-size: 12px;">
        Connect with COCOON on WhatsApp &rarr;
      </a>
    </div>

    <div style="text-align: center;">
      <a href="https://cocoon-psi.vercel.app" 
         style="display: inline-block; background-color: #B06B5B; color: #FFFFFF; padding: 13px 28px; border-radius: 50px; font-size: 12px; font-weight: bold; text-transform: uppercase;">
        Explore Current Drops &rarr;
      </a>
    </div>
  `;

  const custHtml = renderEmailShell({
    title: "Welcome to COCOON's Needlework Circle",
    preheader: "Gentle stories, bespoke slots, and secret drops from our Agra studio.",
    contentHtml: content,
  });

  await sendEmail({
    to: email,
    subject: "Welcome to COCOON's Needlework Circle | Agra",
    html: custHtml,
  });

  // Admin Notification
  const admHtml = renderEmailShell({
    title: "New Needlework Circle Subscriber",
    preheader: `${email} joined the newsletter list.`,
    contentHtml: `<p>New subscriber joined from website footer:</p><h3>${email}</h3>`,
  });
  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `New Subscriber: ${email}`,
    html: admHtml,
  });
}
