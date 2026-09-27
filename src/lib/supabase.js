import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://doamshffdcdpwhqcrdvl.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload image or video to Supabase Storage bucket ('cocoon-media')
 * Automatically falls back to base64 data URL if bucket is not created or permissions are pending.
 */
export async function uploadMediaToSupabase(file, bucket = "cocoon-media") {
  if (!file) return null;

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

  // Fallback: convert file to Base64 data URL so it persists in the database even without cloud storage!
  return new Promise((resolve) => {
    try {
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
