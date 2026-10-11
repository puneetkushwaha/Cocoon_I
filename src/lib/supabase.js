import { createClient } from "@supabase/supabase-js";
import { STORE } from "@/data/store";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://doamshffdcdpwhqcrdvl.supabase.co";
// Safe fallback string prevents Next.js "supabaseKey is required." prerender crash during Vercel build
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "public-anon-key-placeholder";

export const isSupabaseConfigured = () => {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "public-anon-key-placeholder"
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

/**
 * Upload image or video to Supabase Storage bucket ('cocoon-media')
 * Automatically falls back to base64 data URL if bucket is not created or permissions are pending.
 */
export async function uploadMediaToSupabase(file, bucket = "cocoon-media") {
  if (!file) return null;

  if (isSupabaseConfigured()) {
    try {
      const ext = file.name.split(".").pop();
      const cleanName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const filePath = `uploads/${cleanName}`;

      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: "3600",
        upsert: false
      });

      if (!error) {
        const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(filePath);
        if (publicData?.publicUrl) return publicData.publicUrl;
      } else {
        console.warn("Supabase storage upload notice:", error.message);
      }
    } catch (err) {
      console.warn("Storage upload fallback:", err);
    }
  }

  // Fallback: Safe preview URL or compressed Base64 under 1.5MB to protect localStorage quota
  return new Promise((resolve) => {
    try {
      if (file.size > 1.5 * 1024 * 1024) {
        // Files > 1.5MB should use object URL to prevent QuotaExceededError in localStorage
        return resolve(URL.createObjectURL(file));
      }
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve(URL.createObjectURL(file));
      reader.readAsDataURL(file);
    } catch (e) {
      resolve(URL.createObjectURL(file));
    }
  });
}

/**
 * Save an order to Supabase table 'orders'
 */
export async function saveOrderToSupabase(order) {
  if (!isSupabaseConfigured()) {
    return { data: null, error: null };
  }
  try {
    const { data, error } = await supabase.from("orders").insert([
      {
        order_id: order.id,
        customer_name: order.customerName,
        customer_phone: order.customerPhone,
        customer_email: order.customerEmail || null,
        address: order.address,
        items: order.items,
        total_amount: order.totalAmount,
        status: order.status || "Processing",
        payment_method: order.paymentMethod || "UPI",
        utr: order.utr || null,
        notes: order.notes || "",
        created_at: order.date || new Date().toISOString()
      }
    ]);
    if (error) {
      console.warn("Supabase insert order notice:", error.message);
    }
    return { data, error };
  } catch (err) {
    console.warn("Supabase orders error:", err);
    return { error: err };
  }
}

/**
 * Save a custom heirloom inquiry slip to Supabase table 'customizations'
 */
export async function saveCustomizationToSupabase(inquiry) {
  if (!isSupabaseConfigured()) {
    return { data: null, error: null };
  }
  try {
    const { data, error } = await supabase.from("customizations").insert([
      {
        inquiry_id: inquiry.id,
        customer_name: inquiry.name,
        customer_phone: inquiry.phone,
        customer_email: inquiry.email || null,
        product_name: inquiry.productName || inquiry.category,
        category: inquiry.category,
        colorway: inquiry.colorway || null,
        idea: inquiry.idea || null,
        needed_by: inquiry.neededBy || null,
        budget: inquiry.budget || null,
        social_link: inquiry.socialLink || null,
        media_name: inquiry.mediaName || null,
        media_url: inquiry.mediaUrl || null,
        status: inquiry.status || "New",
        created_at: inquiry.date || new Date().toISOString()
      }
    ]);
    if (error) {
      console.warn("Supabase insert customization notice:", error.message);
    }
    return { data, error };
  } catch (err) {
    console.warn("Supabase customization error:", err);
    return { error: err };
  }
}

/**
 * Save a customer review to Supabase table 'reviews'
 */
export async function saveReviewToSupabase(review) {
  if (!isSupabaseConfigured()) {
    return { data: null, error: null };
  }
  try {
    const { data, error } = await supabase.from("reviews").insert([
      {
        review_id: review.id,
        product_id: Number(review.productId) || 0,
        product_name: review.productName || "Handcrafted Crochet",
        customer_name: review.customerName,
        customer_phone: review.customerPhone || null,
        rating: Number(review.rating) || 5,
        title: review.title || "",
        comment: review.comment,
        media_url: review.mediaUrl || null,
        order_id: review.orderId || null,
        status: review.status || "Approved",
        created_at: review.date || new Date().toISOString()
      }
    ]);
    if (error) {
      console.warn("Supabase insert review notice:", error.message);
    }
    return { data, error };
  } catch (err) {
    console.warn("Supabase review error:", err);
    return { error: err };
  }
}

/**
 * Fetch approved customer reviews from Supabase table 'reviews'
 */
export async function fetchReviewsFromSupabase(productId = null) {
  if (!isSupabaseConfigured()) {
    return [];
  }
  try {
    let query = supabase
      .from("reviews")
      .select("*")
      .eq("status", "Approved")
      .order("created_at", { ascending: false });

    if (productId) {
      query = query.eq("product_id", Number(productId));
    }

    const { data, error } = await query;
    if (error) {
      console.warn("Supabase fetch reviews notice:", error.message);
      return [];
    }

    return (data || []).map((r) => ({
      id: r.review_id || `REV-${r.id}`,
      productId: Number(r.product_id),
      productName: r.product_name,
      customerName: r.customer_name,
      customerPhone: r.customer_phone,
      rating: Number(r.rating) || 5,
      title: r.title || "",
      comment: r.comment,
      mediaUrl: r.media_url,
      date: r.created_at,
      orderId: r.order_id,
      verified: true
    }));
  } catch (err) {
    console.warn("Supabase fetch reviews error:", err);
    return [];
  }
}

/**
 * Save a 1-time generated review coupon to Supabase table 'coupons'
 */
export async function saveCouponToSupabase(coupon) {
  try {
    // 1. Always save in local persistent store
    STORE.addCoupon({
      code: coupon.code,
      discountPercent: coupon.discountPercent || 15,
      isUsed: false,
      orderId: coupon.orderId || null,
      reviewId: coupon.reviewId || null,
      customerName: coupon.customerName || "",
      customerPhone: coupon.customerPhone || null,
      status: "active",
      createdAt: coupon.createdAt || new Date().toISOString()
    });

    // 2. Save in Supabase DB 'coupons' table
    const { data, error } = await supabase.from("coupons").insert([
      {
        coupon_code: coupon.code.toUpperCase(),
        discount_percent: Number(coupon.discountPercent) || 15,
        is_used: false,
        order_id: coupon.orderId || null,
        review_id: coupon.reviewId || null,
        customer_name: coupon.customerName || null,
        customer_phone: coupon.customerPhone || null,
        status: "active",
        created_at: coupon.createdAt || new Date().toISOString()
      }
    ]);

    if (error) {
      console.warn("Supabase insert coupon notice (using local store fallback):", error.message);
    }
    return { success: true, data };
  } catch (err) {
    console.warn("Supabase coupon save fallback:", err);
    return { success: true };
  }
}

/**
 * Validate a 1-time coupon against Supabase DB and local STORE
 */
export async function validateCouponFromSupabase(rawCode) {
  if (!rawCode || !rawCode.trim()) {
    return { valid: false, error: "Please enter a coupon code." };
  }
  const cleanCode = rawCode.trim().toUpperCase();

  try {
    // 1. Query Supabase 'coupons' table
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("coupon_code", cleanCode)
      .single();

    if (!error && data) {
      if (data.is_used || data.status === "redeemed") {
        return { valid: false, error: "This 15% OFF coupon has already been redeemed." };
      }
      return {
        valid: true,
        code: data.coupon_code,
        discountPercent: data.discount_percent || 15,
        orderId: data.order_id,
        reviewId: data.review_id
      };
    }
  } catch (err) {
    console.warn("Supabase coupon lookup notice (checking store fallback):", err);
  }

  // 2. Check local store fallback
  const localResult = STORE.validateCoupon(cleanCode);
  if (localResult.valid) {
    return {
      valid: true,
      code: cleanCode,
      discountPercent: localResult.discountPercent || 15
    };
  }

  return {
    valid: false,
    error: localResult.error || "Invalid coupon code. Only verified review coupons are accepted."
  };
}

/**
 * Mark coupon as redeemed in Supabase and local store
 */
export async function markCouponAsUsedInSupabase(rawCode, usedOrderId) {
  if (!rawCode) return;
  const cleanCode = rawCode.trim().toUpperCase();

  // 1. Mark in local store
  STORE.markCouponUsed(cleanCode, usedOrderId);

  // 2. Mark in Supabase DB
  try {
    const { error } = await supabase
      .from("coupons")
      .update({
        is_used: true,
        status: "redeemed",
        used_order_id: usedOrderId || null,
        used_at: new Date().toISOString()
      })
      .eq("coupon_code", cleanCode);

    if (error) {
      console.warn("Supabase mark coupon notice:", error.message);
    }
  } catch (err) {
    console.warn("Supabase mark coupon error:", err);
  }
}

/**
 * Fetch all orders from Supabase table 'orders'
 */
export async function fetchOrdersFromSupabase() {
  if (!isSupabaseConfigured()) {
    return [];
  }
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase fetch orders notice:", error.message);
      return [];
    }
    return (data || []).map((row) => ({
      id: row.order_id,
      date: row.created_at,
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
      customerEmail: row.customer_email || "",
      address: row.address,
      items: Array.isArray(row.items) ? row.items : [],
      totalAmount: Number(row.total_amount) || 0,
      status: row.status || "Processing",
      paymentMethod: row.payment_method || "UPI",
      utr: row.utr || null,
      courierName: row.courier_name || null,
      awbCode: row.awb_code || null,
      shipmentId: row.shipment_id || null,
      trackingUrl: row.tracking_url || null,
      labelUrl: row.label_url || null,
      pickupScheduledAt: row.pickup_scheduled_at || null,
      notes: row.notes || "",
      timestamp: new Date(row.created_at).getTime()
    }));
  } catch (err) {
    console.warn("Supabase fetch orders error:", err);
    return [];
  }
}

/**
 * Update an order in Supabase
 */
export async function updateOrderInSupabase(orderId, updates) {
  if (!isSupabaseConfigured() || !orderId) return false;
  try {
    const dbPayload = {};
    if (updates.status !== undefined) dbPayload.status = updates.status;
    if (updates.notes !== undefined) dbPayload.notes = updates.notes;
    if (updates.paymentMethod !== undefined) dbPayload.payment_method = updates.paymentMethod;
    if (updates.utr !== undefined) dbPayload.utr = updates.utr;
    if (updates.courierName !== undefined) dbPayload.courier_name = updates.courierName;
    if (updates.awbCode !== undefined) dbPayload.awb_code = updates.awbCode;
    if (updates.shipmentId !== undefined) dbPayload.shipment_id = updates.shipmentId;
    if (updates.trackingUrl !== undefined) dbPayload.tracking_url = updates.trackingUrl;
    if (updates.labelUrl !== undefined) dbPayload.label_url = updates.labelUrl;
    if (updates.pickupScheduledAt !== undefined) dbPayload.pickup_scheduled_at = updates.pickupScheduledAt;

    const { error } = await supabase
      .from("orders")
      .update(dbPayload)
      .eq("order_id", orderId);

    if (error) {
      console.warn("Supabase update order notice:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase update order error:", err);
    return false;
  }
}

/**
 * Fetch all custom inquiries from Supabase table 'customizations'
 */
export async function fetchCustomizationsFromSupabase() {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from("customizations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase fetch customizations notice:", error.message);
      return [];
    }

    return (data || []).map((row) => ({
      id: row.inquiry_id,
      name: row.customer_name,
      phone: row.customer_phone,
      email: row.customer_email || "",
      productName: row.product_name,
      category: row.category,
      colorway: row.colorway || "",
      idea: row.idea || "",
      neededBy: row.needed_by || "",
      budget: row.budget || "",
      socialLink: row.social_link || "",
      mediaName: row.media_name || null,
      mediaUrl: row.media_url || null,
      status: row.status || "New",
      date: row.created_at
    }));
  } catch (err) {
    console.warn("Supabase fetch customizations error:", err);
    return [];
  }
}

/**
 * Update customization inquiry in Supabase table 'customizations'
 */
export async function updateCustomizationInSupabase(inquiryId, updates) {
  if (!isSupabaseConfigured() || !inquiryId) return false;
  try {
    const dbPayload = {};
    if (updates.status !== undefined) dbPayload.status = updates.status;
    const { error } = await supabase
      .from("customizations")
      .update(dbPayload)
      .eq("inquiry_id", inquiryId);
    return !error;
  } catch (err) {
    return false;
  }
}


