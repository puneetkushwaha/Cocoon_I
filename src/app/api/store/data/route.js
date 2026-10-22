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

const DEFAULT_SETTINGS = {
  codEnabled: true,
  freeDeliveryOnOnline: true,
  codDeliveryFee: 80
};

// Concurrency-safe in-memory cache with 5-second TTL to guarantee real-time freshness
const CACHE_TTL_MS = 5 * 1000;

let serverStoreCache = {
  products: null,
  categories: null,
  coupons: null,
  heroCards: null,
  ticker: null,
  bestsellers: null,
  settings: null,
  cachedAt: 0,
  lastUpdated: null
};

// Single-flight in-flight promise to prevent cache stampedes (thundering herd)
let inFlightFetchPromise = null;

async function fetchFreshStoreData() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const queryPromise = supabase.from("store_data").select("*");
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Supabase query timeout")), 3500)
    );

    const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

    if (!error && Array.isArray(data) && data.length > 0) {
      const dbData = {};
      data.forEach((row) => {
        dbData[row.key] = row.data;
      });
      return dbData;
    }
  } catch (e) {
    console.warn("Store data Supabase fetch fallback:", e.message);
  }
  return null;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "products" | "categories" | "coupons" | "settings" | null
    const now = Date.now();

    // 1. Check if in-memory cache is fresh (served in < 1ms, handles 10k+ concurrent requests effortlessly)
    const isCacheFresh = serverStoreCache.products && (now - serverStoreCache.cachedAt < CACHE_TTL_MS);

    if (!isCacheFresh) {
      // 2. Use single-flight promise so 10,000 parallel requests don't choke the database
      if (!inFlightFetchPromise) {
        inFlightFetchPromise = (async () => {
          try {
            const freshData = await fetchFreshStoreData();
            if (freshData) {
              if (freshData.products) serverStoreCache.products = freshData.products;
              if (freshData.categories) serverStoreCache.categories = freshData.categories;
              if (freshData.coupons) serverStoreCache.coupons = freshData.coupons;
              if (freshData.heroCards) serverStoreCache.heroCards = freshData.heroCards;
              if (freshData.ticker) serverStoreCache.ticker = freshData.ticker;
              if (freshData.bestsellers) serverStoreCache.bestsellers = freshData.bestsellers;
              if (freshData.settings) serverStoreCache.settings = freshData.settings;
            }
            serverStoreCache.cachedAt = Date.now();
          } finally {
            inFlightFetchPromise = null;
          }
        })();
      }
      await inFlightFetchPromise;
    }

    const products = serverStoreCache.products || PRODUCTS;
    const categories = serverStoreCache.categories || INITIAL_CATEGORIES;
    const coupons = serverStoreCache.coupons || INITIAL_COUPONS;
    const heroCards = serverStoreCache.heroCards || INITIAL_HERO_CARDS;
    const ticker = serverStoreCache.ticker || INITIAL_TICKER;
    const bestsellers = serverStoreCache.bestsellers || INITIAL_BESTSELLERS;
    const settings = serverStoreCache.settings || DEFAULT_SETTINGS;

    // Dynamic Store Data must never be cached by CDN or browser to guarantee real-time admin sync
    const cacheHeaders = {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
      "X-Cache-Status": isCacheFresh ? "HIT" : "MISS"
    };

    if (type === "products") {
      return NextResponse.json({ success: true, products }, { headers: cacheHeaders });
    }
    if (type === "categories") {
      return NextResponse.json({ success: true, categories }, { headers: cacheHeaders });
    }
    if (type === "coupons") {
      return NextResponse.json({ success: true, coupons }, { headers: cacheHeaders });
    }
    if (type === "settings") {
      return NextResponse.json({ success: true, settings }, { headers: cacheHeaders });
    }

    return NextResponse.json(
      {
        success: true,
        products,
        categories,
        coupons,
        heroCards,
        ticker,
        bestsellers,
        settings,
        source: isCacheFresh ? "memory_cache" : "origin_db"
      },
      { headers: cacheHeaders }
    );
  } catch (err) {
    console.error("Store data GET error:", err);
    return NextResponse.json(
      {
        success: true,
        products: PRODUCTS,
        categories: INITIAL_CATEGORIES,
        coupons: INITIAL_COUPONS,
        settings: DEFAULT_SETTINGS,
        error: err.message
      },
      {
        headers: { "Cache-Control": "no-store" }
      }
    );
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
    if (key === "settings") serverStoreCache.settings = data;
    serverStoreCache.cachedAt = Date.now();
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

        // 3. If coupons, also synchronize each active coupon into Supabase 'coupons' table
        if (key === "coupons" && Array.isArray(data)) {
          for (const c of data) {
            if (c && c.code) {
              await supabase.from("coupons").upsert(
                {
                  coupon_code: c.code.toUpperCase(),
                  discount_percent: Number(c.discountPercent || c.discountAmount || 15),
                  is_used: false,
                  status: c.isActive !== false ? "active" : "inactive"
                },
                { onConflict: "coupon_code" }
              ).catch(() => {});
            }
          }
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
