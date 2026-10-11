import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { PRODUCTS } from "@/data/products";
import {
  INITIAL_CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_HERO_CARDS,
  INITIAL_TICKER,
  INITIAL_BESTSELLERS
} from "@/data/store";

// Global in-memory cache on the Node.js server to ensure instant sync
let serverStoreCache = {
  products: null,
  categories: null,
  coupons: null,
  heroCards: null,
  ticker: null,
  bestsellers: null,
  lastUpdated: null
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "products" | "categories" | "coupons" | null (all)

    let dbData = null;

    // 1. Try to read from Supabase if active (with strict timeout)
    if (isSupabaseConfigured()) {
      try {
        const queryPromise = supabase
          .from("store_data")
          .select("*");

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Supabase query timeout")), 3000)
        );

        const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

        if (!error && Array.isArray(data) && data.length > 0) {
          dbData = {};
          data.forEach((row) => {
            dbData[row.key] = row.data;
          });
          // Update in-memory server cache
          if (dbData.products) serverStoreCache.products = dbData.products;
          if (dbData.categories) serverStoreCache.categories = dbData.categories;
          if (dbData.coupons) serverStoreCache.coupons = dbData.coupons;
          if (dbData.heroCards) serverStoreCache.heroCards = dbData.heroCards;
          if (dbData.ticker) serverStoreCache.ticker = dbData.ticker;
          if (dbData.bestsellers) serverStoreCache.bestsellers = dbData.bestsellers;
        }
      } catch (e) {
        // Supabase query fallback (e.g. if project is paused)
      }
    }

    const products = serverStoreCache.products || dbData?.products || PRODUCTS;
    const categories = serverStoreCache.categories || dbData?.categories || INITIAL_CATEGORIES;
    const coupons = serverStoreCache.coupons || dbData?.coupons || INITIAL_COUPONS;
    const heroCards = serverStoreCache.heroCards || dbData?.heroCards || INITIAL_HERO_CARDS;
    const ticker = serverStoreCache.ticker || dbData?.ticker || INITIAL_TICKER;
    const bestsellers = serverStoreCache.bestsellers || dbData?.bestsellers || INITIAL_BESTSELLERS;

    if (type === "products") {
      return NextResponse.json({ success: true, products });
    }
    if (type === "categories") {
      return NextResponse.json({ success: true, categories });
    }
    if (type === "coupons") {
      return NextResponse.json({ success: true, coupons });
    }

    return NextResponse.json({
      success: true,
      products,
      categories,
      coupons,
      heroCards,
      ticker,
      bestsellers,
      source: dbData ? "supabase" : (serverStoreCache.products ? "server_cache" : "initial_seed")
    });
  } catch (err) {
    console.error("Store data GET error:", err);
    return NextResponse.json({
      success: true,
      products: PRODUCTS,
      categories: INITIAL_CATEGORIES,
      coupons: INITIAL_COUPONS,
      error: err.message
    });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { key, data } = body;

    if (!key || data === undefined) {
      return NextResponse.json(
        { success: false, error: "Both 'key' and 'data' are required." },
        { status: 400 }
      );
    }

    // 1. Update in-memory server cache immediately so all clients get it instantly
    if (key === "products") serverStoreCache.products = data;
    if (key === "categories") serverStoreCache.categories = data;
    if (key === "coupons") serverStoreCache.coupons = data;
    if (key === "heroCards") serverStoreCache.heroCards = data;
    if (key === "ticker") serverStoreCache.ticker = data;
    if (key === "bestsellers") serverStoreCache.bestsellers = data;
    serverStoreCache.lastUpdated = new Date().toISOString();

    // 2. Persist to Supabase if available
    let dbSaved = false;
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from("store_data")
          .upsert(
            { key, data, updated_at: new Date().toISOString() },
            { onConflict: "key" }
          );

        if (!error) {
          dbSaved = true;
        } else {
          console.warn("Supabase store_data upsert notice:", error.message);
        }
      } catch (err) {
        console.warn("Supabase store_data save error:", err);
      }
    }

    return NextResponse.json({
      success: true,
      key,
      dbSaved,
      message: `Updated ${key} successfully.`
    });
  } catch (err) {
    console.error("Store data POST error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to save store data." },
      { status: 500 }
    );
  }
}
