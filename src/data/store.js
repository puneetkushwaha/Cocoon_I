// Central Persistent Store for Cocoon Studio
import { PRODUCTS } from "./products";

export const INITIAL_TICKER = [
  "100% Handcrafted Slow Fashion",
  "Flat ₹60 Standard Express Shipping Across India",
  "30 Exclusive Artisanal Drops Active",
  "Hypoallergenic Premium Milk Cotton",
  "Custom Sizing and Fitting Available",
  "Complimentary Gift Box on Orders Above Rs. 1,499"
];

export const INITIAL_HERO_CARDS = [
  {
    id: "card-1",
    title: "Evil Eye Charm",
    subtitle: "Rs. 199",
    badge: "Protection",
    imgUrl: "/products/items/solo-evil-eye-keychain.jpg",
    className: "w-28 sm:w-32 rotate-[-8deg] -top-5 -left-4 sm:-left-8"
  },
  {
    id: "card-2",
    title: "Sunflower Granny Mini Backpack",
    subtitle: "Artisan Heirloom Piece • Rs. 1,399",
    badge: "Hand-Knit",
    imgUrl: "/products/items/sunflower-granny-backpack.jpg",
    className: "w-full max-w-sm sm:max-w-md shadow-2xl"
  },
  {
    id: "card-3",
    title: "Pink Rose & Bell Bud Tie",
    subtitle: "Hand-Knit • Rs. 249",
    badge: "Bestseller",
    imgUrl: "/products/items/rose-ponytail-tie-pink.jpg",
    className: "w-36 sm:w-44 rotate-[6deg] -bottom-6 -right-4 sm:-right-8"
  }
];

export const INITIAL_CATEGORIES = [
  { id: "bags", name: "Bags & Totes", itemCount: 6, minPrice: 799, imgUrl: "/products/items/sunflower-granny-backpack.jpg" },
  { id: "phone-cases", name: "Phone Sleeves", itemCount: 4, minPrice: 499, imgUrl: "/products/items/pastel-cherry-bow-phone-cases.jpg" },
  { id: "hair-accessories", name: "Hair & Ties", itemCount: 7, minPrice: 149, imgUrl: "/products/items/rose-ponytail-tie-pink.jpg" },
  { id: "belts", name: "Belts & Wraps", itemCount: 4, minPrice: 449, imgUrl: "/products/items/white-lace-waist-belt.jpg" },
  { id: "bandanas", name: "Bandanas", itemCount: 3, minPrice: 299, imgUrl: "/products/items/burgundy-triangle-bandana.jpg" },
  { id: "keychains", name: "Lucky Charms", itemCount: 5, minPrice: 199, imgUrl: "/products/items/solo-evil-eye-keychain.jpg" }
];

export const INITIAL_BESTSELLERS = [
  {
    id: 1,
    rank: "N° 01 • Bestseller",
    tag: "Chic Everyday Tote",
    title: "Chocolate Bow Knot Handbag",
    lookNote: "Look 01 • French Riviera & Coffee Stroll",
    desc: "Structured knit volume with double-thick milk cotton cord and dainty vanilla bow ties. Fits phone, wallet, cosmetics and sunglasses seamlessly.",
    price: 899,
    originalPrice: 1299,
    imgUrl: "/products/items/chocolate-bow-handbag.jpg"
  },
  {
    id: 15,
    rank: "N° 02 • Bestseller",
    tag: "Artisan Heirloom Bag",
    title: "Sunflower Granny Square Mini Backpack",
    lookNote: "Look 02 • Weekend Picnic & Cottage Aesthetic",
    desc: "Heavy duty organic cotton granny squares with reinforced straps. Pairs naturally with relaxed raw denim, linen shirts, and sun hats.",
    price: 1399,
    originalPrice: 1899,
    imgUrl: "/products/items/sunflower-granny-backpack.jpg"
  },
  {
    id: 2,
    rank: "N° 03 • Bestseller",
    tag: "Cottagecore Accent",
    title: "Blush Pink Crochet Waist Scarf",
    lookNote: "Look 03 • Summer Festival & Boho Wrap",
    desc: "Lightweight lacy wrap belt with intricate granny stitchwork and graceful braided waist tie fringe. Elevates basic jeans and vintage slip dresses.",
    price: 549,
    originalPrice: 799,
    imgUrl: "/products/items/pink-crochet-waist-scarf.jpg"
  }
];

export const INITIAL_ORDERS = [
  {
    id: "COC-7842",
    customerName: "Nimisha Agarwal",
    customerPhone: "9634640893",
    customerEmail: "nimisha.agarwal@gmail.com",
    address: "Civil Lines, Agra, Uttar Pradesh",
    items: [
      {
        id: 6,
        name: "Pink Rose & Bell Flower Ponytail Tie",
        price: 249,
        quantity: 1,
        color: "English Rose Pink",
        image: "/products/items/rose-ponytail-tie-pink.jpg"
      },
      {
        id: 22,
        name: "White Blossom & Bell Bud Hair Tie",
        price: 249,
        quantity: 1,
        color: "Ivory White",
        image: "/products/items/rose-bell-hair-tie-white.jpg"
      },
      {
        id: 4,
        name: "Ruby Red Bow & Pearl Charm Keychain",
        price: 0,
        quantity: 1,
        color: "Ruby Red",
        image: "/products/items/red-bow-pearl-keychain.jpg",
        isFreeGift: true
      }
    ],
    totalAmount: 498,
    status: "Delivered",
    paymentMethod: "Cash on Delivery",
    notes: "Complimentary surprise ruby red bow keychain gifted by Mehak.",
    date: "2026-10-20T14:30:00.000Z"
  }
];

export const INITIAL_CUSTOMIZATIONS = [];

export const INITIAL_REVIEWS = [
  {
    id: "REV-201",
    productId: 6,
    productName: "Pink Rose & Bell Flower Ponytail Tie",
    customerName: "Nimisha Agarwal",
    customerPhone: "9634640893",
    rating: 5,
    title: "",
    comment: "Thank you very much ...all these are really very beautiful and this gift was totally unexpected...I'm really happy ...your efforts are visible in each and every thing ...thank you for the gift 😊",
    date: "2026-10-21T19:34:00.000Z",
    verified: true,
    orderId: "COC-7842",
    mediaUrl: "/reviews/nimisha-agarwal-rose-clips-bow.jpg"
  },
  {
    id: "REV-202",
    productId: 22,
    productName: "White Blossom & Bell Bud Hair Tie",
    customerName: "Nimisha Agarwal",
    customerPhone: "9634640893",
    rating: 5,
    title: "",
    comment: "Thank you very much ...all these are really very beautiful and this gift was totally unexpected...I'm really happy ...your efforts are visible in each and every thing ...thank you for the gift 😊",
    date: "2026-10-21T19:34:00.000Z",
    verified: true,
    orderId: "COC-7842",
    mediaUrl: "/reviews/nimisha-agarwal-rose-clips-bow.jpg"
  },
  {
    id: "REV-203",
    productId: 4,
    productName: "Ruby Red Bow & Pearl Charm Keychain",
    customerName: "Nimisha Agarwal",
    customerPhone: "9634640893",
    rating: 5,
    title: "",
    comment: "Thank you very much ...all these are really very beautiful and this gift was totally unexpected...I'm really happy ...your efforts are visible in each and every thing ...thank you for the gift 😊",
    date: "2026-10-21T19:34:00.000Z",
    verified: true,
    orderId: "COC-7842",
    mediaUrl: "/reviews/nimisha-agarwal-rose-clips-bow.jpg"
  },
  {
    id: "REV-204",
    productId: 30,
    productName: "Snow White Rose & Twin Buds Charm",
    customerName: "Nimisha Agarwal",
    customerPhone: "9634640893",
    rating: 5,
    title: "",
    comment: "Thank you very much ...all these are really very beautiful and this gift was totally unexpected...I'm really happy ...your efforts are visible in each and every thing ...thank you for the gift 😊",
    date: "2026-10-21T19:34:00.000Z",
    verified: true,
    orderId: "COC-7842",
    mediaUrl: "/reviews/nimisha-agarwal-rose-clips-bow.jpg"
  },
  {
    id: "REV-101",
    productId: 1,
    productName: "Chocolate Bow Knot Handbag",
    customerName: "Rhea Singhania",
    rating: 5,
    title: "Even more gorgeous in person!",
    comment: "The knit tension is super sturdy and doesn't sag even when I put my phone, perfume and wallet. Dispatched very quickly!",
    date: "2026-09-18T10:30:00.000Z",
    verified: true,
    mediaUrl: "/products/items/chocolate-bow-handbag.jpg"
  },
  {
    id: "REV-102",
    productId: 1,
    productName: "Chocolate Bow Knot Handbag",
    customerName: "Aanya V.",
    rating: 5,
    title: "10/10 cottagecore aesthetic",
    comment: "Soft organic milk cotton, no chemical smell at all. Got so many compliments at college.",
    date: "2026-09-20T14:15:00.000Z",
    verified: true,
    mediaUrl: null
  },
  {
    id: "REV-103",
    productId: 15,
    productName: "Sunflower Granny Square Mini Backpack",
    customerName: "Pooja Malhotra",
    rating: 5,
    title: "True artisan masterpiece",
    comment: "The sunflower granny square details are completely hand-knit. The reinforced straps are so comfortable. Packaged in a lovely plastic-free gift box!",
    date: "2026-09-21T09:45:00.000Z",
    verified: true,
    mediaUrl: "/products/items/sunflower-granny-backpack.jpg"
  },
  {
    id: "REV-104",
    productId: 2,
    productName: "Blush Pink Crochet Waist Scarf",
    customerName: "Sneha Kapoor",
    rating: 5,
    title: "Elevates any simple dress",
    comment: "Looks stunning tied over white linen dresses and jeans. Very delicate and soft cotton.",
    date: "2026-09-22T16:20:00.000Z",
    verified: true,
    mediaUrl: "/products/items/pink-crochet-waist-scarf.jpg"
  }
];

export const INITIAL_COUPONS = [
  {
    id: "CPN-101",
    code: "COCOON10",
    title: "Welcome Special",
    type: "percentage",
    discountPercent: 10,
    minOrderValue: 0,
    maxDiscount: 0,
    isActive: true,
    usedCount: 0,
    createdAt: "2026-10-01T00:00:00.000Z"
  },
  {
    id: "CPN-102",
    code: "FLAT100",
    title: "Flat ₹100 Off Festive Offer",
    type: "flat",
    discountAmount: 100,
    minOrderValue: 499,
    isActive: true,
    usedCount: 0,
    createdAt: "2026-10-01T00:00:00.000Z"
  },
  {
    id: "CPN-103",
    code: "BOGO",
    title: "Buy 1 Get 1 Free (Lowest Price Free)",
    type: "bogo",
    bogoBuyQty: 1,
    bogoFreeQty: 1,
    minOrderValue: 0,
    isActive: true,
    usedCount: 0,
    createdAt: "2026-10-01T00:00:00.000Z"
  },
  {
    id: "CPN-104",
    code: "B2G1",
    title: "Buy 2 Get 1 Free Special",
    type: "bogo",
    bogoBuyQty: 2,
    bogoFreeQty: 1,
    minOrderValue: 0,
    isActive: true,
    usedCount: 0,
    createdAt: "2026-10-01T00:00:00.000Z"
  }
];

const STORAGE_KEYS = {
  PRODUCTS: "cocoon_store_products",
  CATEGORIES: "cocoon_store_categories",
  BESTSELLERS: "cocoon_store_bestsellers",
  HERO_CARDS: "cocoon_store_hero_cards",
  TICKER: "cocoon_store_ticker",
  ORDERS: "cocoon_store_orders",
  CUSTOMIZATIONS: "cocoon_store_customizations",
  REVIEWS: "cocoon_store_reviews",
  COUPONS: "cocoon_store_coupons",
  RECENTLY_VIEWED: "cocoon_store_recently_viewed",
  SUBSCRIBERS: "cocoon_store_subscribers",
  OFFERS: "cocoon_store_offers",
  ADDRESSES: "cocoon_saved_addresses",
  SETTINGS: "cocoon_store_settings"
};

// Safe localStorage access with automatic dummy data purge
export const getStoredData = (key, fallback) => {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);

    // Auto-purge any legacy demo/mock data or deleted items
    if (key === STORAGE_KEYS.ORDERS && Array.isArray(parsed)) {
      const cleanOrders = parsed.filter(
        (o) =>
          !o.id?.startsWith("ORD-94") &&
          o.status !== "Deleted" &&
          o.id !== "ORD-9787" &&
          o.id !== "ORD-1612" &&
          o.id !== "ORD-5214"
      );
      if (cleanOrders.length !== parsed.length) {
        localStorage.setItem(key, JSON.stringify(cleanOrders));
        return cleanOrders;
      }
      return cleanOrders;
    }

    if (key === STORAGE_KEYS.CUSTOMIZATIONS && Array.isArray(parsed)) {
      const cleanCust = parsed.filter(
        (c) => c.id !== "CUST-101" && c.status !== "Deleted" && c.id !== "INQ-TEST"
      );
      if (cleanCust.length !== parsed.length) {
        localStorage.setItem(key, JSON.stringify(cleanCust));
        return cleanCust;
      }
      return cleanCust;
    }

    if (key === STORAGE_KEYS.REVIEWS && Array.isArray(parsed)) {
      const cleanReviews = parsed.filter(
        (r) => r.status !== "Deleted" && r.id !== "REV-TEST"
      );
      if (cleanReviews.length !== parsed.length) {
        localStorage.setItem(key, JSON.stringify(cleanReviews));
        return cleanReviews;
      }
      return cleanReviews;
    }

    return parsed;
  } catch (e) {
    console.error("Error reading localStorage:", e);
    return fallback;
  }
};

export const setStoredData = (key, data) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
    setTimeout(() => {
      window.dispatchEvent(new Event("cocoon_store_update"));
    }, 0);

    // Automatically sync to backend API & Database across devices
    let apiKey = null;
    if (key === STORAGE_KEYS.PRODUCTS) apiKey = "products";
    else if (key === STORAGE_KEYS.CATEGORIES) apiKey = "categories";
    else if (key === STORAGE_KEYS.COUPONS) apiKey = "coupons";
    else if (key === STORAGE_KEYS.HERO_CARDS) apiKey = "heroCards";
    else if (key === STORAGE_KEYS.TICKER) apiKey = "ticker";
    else if (key === STORAGE_KEYS.BESTSELLERS) apiKey = "bestsellers";
    else if (key === STORAGE_KEYS.SETTINGS) apiKey = "settings";

    if (apiKey) {
      fetch("/api/store/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: apiKey, data })
      }).catch(() => {});
    }
  } catch (e) {
    console.error("Error writing localStorage:", e);
  }
};

export const STORE = {
  getKeys: () => STORAGE_KEYS,

  fetchServerStoreData: async () => {
    if (typeof window === "undefined") return null;
    try {
      const res = await fetch("/api/store/data");
      const json = await res.json();
      if (json && json.success) {
        // Only overwrite local state IF the server returned real DB or server cache data!
        // Never overwrite local changes with the static uncustomized initial seed!
        if (json.source !== "initial_seed") {
          if (Array.isArray(json.products) && json.products.length > 0) {
            localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(json.products));
          }
          if (Array.isArray(json.categories) && json.categories.length > 0) {
            localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(json.categories));
          }
          if (Array.isArray(json.coupons) && json.coupons.length > 0) {
            localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(json.coupons));
          }
          if (Array.isArray(json.heroCards) && json.heroCards.length > 0) {
            localStorage.setItem(STORAGE_KEYS.HERO_CARDS, JSON.stringify(json.heroCards));
          }
          if (Array.isArray(json.ticker) && json.ticker.length > 0) {
            localStorage.setItem(STORAGE_KEYS.TICKER, JSON.stringify(json.ticker));
          }
          if (Array.isArray(json.bestsellers) && json.bestsellers.length > 0) {
            localStorage.setItem(STORAGE_KEYS.BESTSELLERS, JSON.stringify(json.bestsellers));
          }
          if (json.settings && typeof json.settings === "object") {
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(json.settings));
          }
          window.dispatchEvent(new Event("cocoon_store_update"));
        } else {
          // If server only has initial_seed, push any customized local data up to the server!
          const currentProds = getStoredData(STORAGE_KEYS.PRODUCTS, null);
          if (currentProds && Array.isArray(currentProds)) {
            fetch("/api/store/data", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ key: "products", data: currentProds })
            }).catch(() => {});
          }
          const currentCoupons = getStoredData(STORAGE_KEYS.COUPONS, null);
          if (currentCoupons && Array.isArray(currentCoupons)) {
            fetch("/api/store/data", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ key: "coupons", data: currentCoupons })
            }).catch(() => {});
          }
        }
        return json;
      }
    } catch (e) {
      // server fetch fallback
    }
    return null;
  },

  getProducts: () => {
    return getStoredData(STORAGE_KEYS.PRODUCTS, PRODUCTS);
  },
  setProducts: (data) => setStoredData(STORAGE_KEYS.PRODUCTS, data),

  getCategories: () => getStoredData(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES),
  setCategories: (data) => setStoredData(STORAGE_KEYS.CATEGORIES, data),

  getBestsellers: () => getStoredData(STORAGE_KEYS.BESTSELLERS, INITIAL_BESTSELLERS),
  setBestsellers: (data) => setStoredData(STORAGE_KEYS.BESTSELLERS, data),

  getHeroCards: () => getStoredData(STORAGE_KEYS.HERO_CARDS, INITIAL_HERO_CARDS),
  setHeroCards: (data) => setStoredData(STORAGE_KEYS.HERO_CARDS, data),

  getTicker: () => getStoredData(STORAGE_KEYS.TICKER, INITIAL_TICKER),
  setTicker: (data) => setStoredData(STORAGE_KEYS.TICKER, data),

  getOrders: () => getStoredData(STORAGE_KEYS.ORDERS, INITIAL_ORDERS),
  setOrders: (data) => setStoredData(STORAGE_KEYS.ORDERS, data),
  updateOrder: (orderId, updates) => {
    const all = STORE.getOrders();
    const updated = all.map((o) => (o.id === orderId ? { ...o, ...updates } : o));
    STORE.setOrders(updated);
    return updated;
  },
  deleteOrder: (orderId) => {
    const all = STORE.getOrders();
    const updated = all.filter((o) => o.id !== orderId);
    STORE.setOrders(updated);
    if (typeof window !== "undefined") {
      fetch("/api/admin/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId })
      }).catch(() => {});
    }
    return updated;
  },
  clearOrders: () => {
    STORE.setOrders([]);
    if (typeof window !== "undefined") {
      fetch("/api/admin/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clearAll: true })
      }).catch(() => {});
    }
    return [];
  },

  getCustomizations: () => getStoredData(STORAGE_KEYS.CUSTOMIZATIONS, INITIAL_CUSTOMIZATIONS),
  setCustomizations: (data) => setStoredData(STORAGE_KEYS.CUSTOMIZATIONS, data),

  getReviews: (productId) => {
    const all = getStoredData(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    if (!productId) return all;
    return all.filter((r) => Number(r.productId) === Number(productId));
  },
  setReviews: (data) => setStoredData(STORAGE_KEYS.REVIEWS, data),
  addReview: (review) => {
    const all = getStoredData(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    const updated = [review, ...all];
    setStoredData(STORAGE_KEYS.REVIEWS, updated);
    return updated;
  },

  getRecentlyViewed: () => getStoredData(STORAGE_KEYS.RECENTLY_VIEWED, [1, 15, 2, 4]),
  addRecentlyViewed: (productId) => {
    const list = getStoredData(STORAGE_KEYS.RECENTLY_VIEWED, [1, 15, 2, 4]).filter(
      (id) => Number(id) !== Number(productId)
    );
    const updated = [Number(productId), ...list].slice(0, 10);
    setStoredData(STORAGE_KEYS.RECENTLY_VIEWED, updated);
  },

  // Newsletter Subscribers
  getSubscribers: () => getStoredData(STORAGE_KEYS.SUBSCRIBERS, []),
  addSubscriber: (email) => {
    if (!email || !email.includes("@")) return;
    const clean = email.trim().toLowerCase();
    const current = getStoredData(STORAGE_KEYS.SUBSCRIBERS, []);
    if (!current.includes(clean)) {
      const updated = [clean, ...current];
      setStoredData(STORAGE_KEYS.SUBSCRIBERS, updated);
    }
  },

  // Offers & Promo Broadcasts
  getOffers: () =>
    getStoredData(STORAGE_KEYS.OFFERS, [
      {
        id: "OFFER-1",
        title: "Welcome to Cocoon Studio",
        badge: "Special Welcome Gift",
        description: "Receive a complimentary handcrafted crochet rose bud with your first order.",
        couponCode: "COCOONFIRST",
        link: "/#shop",
        date: "2026-09-24T12:00:00.000Z"
      }
    ]),
  setOffers: (data) => setStoredData(STORAGE_KEYS.OFFERS, data),
  addOffer: (offer) => {
    const current = getStoredData(STORAGE_KEYS.OFFERS, []);
    const updated = [offer, ...current];
    setStoredData(STORAGE_KEYS.OFFERS, updated);
    return updated;
  },

  // Master Coupon & Promotional Engine (Flat, Percentage, BOGO)
  getCoupons: () => getStoredData(STORAGE_KEYS.COUPONS, INITIAL_COUPONS),
  setCoupons: (data) => setStoredData(STORAGE_KEYS.COUPONS, data),
  addCoupon: (coupon) => {
    const current = getStoredData(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
    const cleanCode = (coupon.code || "").trim().toUpperCase();
    const filtered = current.filter((c) => c.code?.toUpperCase() !== cleanCode && c.id !== coupon.id);
    const newCoupon = {
      id: coupon.id || `CPN-${Date.now()}`,
      code: cleanCode,
      title: coupon.title || `${cleanCode} Special Discount`,
      type: coupon.type || "percentage", // "percentage" | "flat" | "bogo"
      discountPercent: coupon.type === "percentage" ? Number(coupon.discountPercent || 15) : undefined,
      discountAmount: coupon.type === "flat" ? Number(coupon.discountAmount || 100) : undefined,
      bogoBuyQty: coupon.type === "bogo" ? Number(coupon.bogoBuyQty || 1) : undefined,
      bogoFreeQty: coupon.type === "bogo" ? Number(coupon.bogoFreeQty || 1) : undefined,
      minOrderValue: Number(coupon.minOrderValue || 0),
      maxDiscount: Number(coupon.maxDiscount || 0),
      isActive: coupon.isActive !== false,
      usedCount: Number(coupon.usedCount || 0),
      createdAt: coupon.createdAt || new Date().toISOString()
    };
    const updated = [newCoupon, ...filtered];
    setStoredData(STORAGE_KEYS.COUPONS, updated);
    return updated;
  },
  deleteCoupon: (id) => {
    const current = getStoredData(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
    const updated = current.filter((c) => c.id !== id && c.code !== id);
    setStoredData(STORAGE_KEYS.COUPONS, updated);
    return updated;
  },
  toggleCoupon: (id) => {
    const current = getStoredData(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
    const updated = current.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c));
    setStoredData(STORAGE_KEYS.COUPONS, updated);
    return updated;
  },

  // Calculate discount for any coupon type given cart items & subtotal
  calculateCouponDiscount: (coupon, cart = [], subtotal = 0) => {
    if (!coupon) return { valid: false, error: "No coupon provided." };
    if (!coupon.isActive) return { valid: false, error: `Coupon ${coupon.code} is currently inactive.` };
    if (coupon.isUsed) return { valid: false, error: "This single-use coupon has already been redeemed." };

    const minOrder = Number(coupon.minOrderValue || 0);
    if (minOrder > 0 && subtotal < minOrder) {
      return {
        valid: false,
        error: `Minimum order of ₹${minOrder} required for ${coupon.code}. (Your basket is ₹${subtotal})`
      };
    }

    // 1. FLAT ₹ OFF
    if (coupon.type === "flat") {
      const discount = Math.min(Number(coupon.discountAmount || 0), subtotal);
      return {
        valid: true,
        coupon,
        discount,
        type: "flat",
        message: `Flat ₹${discount} OFF applied!`
      };
    }

    // 2. PERCENTAGE % OFF
    if (coupon.type === "percentage" || coupon.discountPercent) {
      const pct = Number(coupon.discountPercent || 15);
      let discount = Math.round(subtotal * (pct / 100));
      const maxDiscount = Number(coupon.maxDiscount || 0);
      if (maxDiscount > 0 && discount > maxDiscount) {
        discount = maxDiscount;
      }
      return {
        valid: true,
        coupon,
        discount,
        type: "percentage",
        message: `${pct}% OFF applied! (-₹${discount})`
      };
    }

    // 3. BOGO (Buy X Get Y Free)
    if (coupon.type === "bogo") {
      const buyQty = Number(coupon.bogoBuyQty || 1);
      const freeQty = Number(coupon.bogoFreeQty || 1);
      const bundleSize = buyQty + freeQty;

      // Expand all cart items into individual unit prices
      const unitPrices = [];
      for (const item of cart) {
        const qty = Number(item.quantity) || 1;
        const price = Number(item.price) || 0;
        for (let i = 0; i < qty; i++) {
          unitPrices.push(price);
        }
      }

      if (unitPrices.length < bundleSize) {
        return {
          valid: false,
          error: `Buy ${buyQty} Get ${freeQty} Free requires at least ${bundleSize} items in your basket. Add ${bundleSize - unitPrices.length} more item(s) to claim your free gift!`
        };
      }

      // Sort prices ascending (lowest priced items are granted 100% free)
      unitPrices.sort((a, b) => a - b);
      const qualifyingSets = Math.floor(unitPrices.length / bundleSize);
      const freeItemCount = qualifyingSets * freeQty;
      const discount = unitPrices.slice(0, freeItemCount).reduce((sum, p) => sum + p, 0);

      return {
        valid: true,
        coupon,
        discount,
        type: "bogo",
        freeItemCount,
        message: `Buy ${buyQty} Get ${freeQty} Free applied! ${freeItemCount} free item(s) (-₹${discount})`
      };
    }

    return { valid: false, error: "Invalid coupon configuration." };
  },

  validateCoupon: (rawCode, cart = [], subtotal = 0) => {
    if (!rawCode || !rawCode.trim()) {
      return { valid: false, error: "Please enter a valid coupon code." };
    }
    const clean = rawCode.trim().toUpperCase();
    const all = getStoredData(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
    const found = all.find((c) => c.code?.toUpperCase() === clean);

    if (!found) {
      if (clean === "COCOON15") {
        return STORE.calculateCouponDiscount(
          { id: "SYS-15", code: "COCOON15", title: "Flat 15% Off", type: "percentage", discountPercent: 15, isActive: true },
          cart,
          subtotal
        );
      }
      if (clean === "COCOONFIRST") {
        return STORE.calculateCouponDiscount(
          { id: "SYS-FIRST", code: "COCOONFIRST", title: "Welcome 10% Off", type: "percentage", discountPercent: 10, isActive: true },
          cart,
          subtotal
        );
      }
      return { valid: false, error: "Invalid coupon code. Please verify the code and try again." };
    }

    return STORE.calculateCouponDiscount(found, cart, subtotal);
  },

  markCouponUsed: (rawCode, usedOrderId) => {
    const clean = (rawCode || "").trim().toUpperCase();
    const all = getStoredData(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
    const updated = all.map((c) => {
      if (c.code?.toUpperCase() === clean) {
        return {
          ...c,
          usedCount: (Number(c.usedCount) || 0) + 1,
          isUsed: c.isOneTime ? true : c.isUsed,
          lastUsedOrderId: usedOrderId || null,
          lastUsedAt: new Date().toISOString()
        };
      }
      return c;
    });
    setStoredData(STORAGE_KEYS.COUPONS, updated);
    return updated;
  },

  // Saved Delivery Addresses (Multiple Addresses Support)
  getAddresses: () => {
    let list = getStoredData(STORAGE_KEYS.ADDRESSES, null);
    if (!list) {
      list = [];
      if (typeof window !== "undefined") {
        try {
          const userStr = localStorage.getItem("cocoon_customer_user");
          if (userStr) {
            const u = JSON.parse(userStr);
            if (u && (u.address || u.name)) {
              const defaultAddr = {
                id: "addr_default",
                tag: "Home",
                name: u.name || "Customer",
                phone: (u.phone && !u.phone.includes("@")) ? u.phone : "",
                email: u.email || (u.phone?.includes("@") ? u.phone : ""),
                address: u.address || "",
                city: u.city || "",
                pincode: u.pincode || "",
                isDefault: true
              };
              list.push(defaultAddr);
              setStoredData(STORAGE_KEYS.ADDRESSES, list);
            }
          }
        } catch (e) {}
      }
    }
    return Array.isArray(list) ? list : [];
  },
  setAddresses: (data) => setStoredData(STORAGE_KEYS.ADDRESSES, data),
  saveAddress: (addr) => {
    const all = STORE.getAddresses();
    const isFirst = all.length === 0;
    const toSave = {
      ...addr,
      id: addr.id || `addr_${Date.now()}`,
      tag: addr.tag || "Home",
      isDefault: isFirst ? true : Boolean(addr.isDefault)
    };

    let updated;
    const existingIndex = all.findIndex((a) => a.id === toSave.id);
    if (existingIndex > -1) {
      if (toSave.isDefault) {
        all.forEach((a) => (a.isDefault = false));
      }
      all[existingIndex] = toSave;
      updated = [...all];
    } else {
      if (toSave.isDefault) {
        all.forEach((a) => (a.isDefault = false));
      }
      updated = [toSave, ...all];
    }

    setStoredData(STORAGE_KEYS.ADDRESSES, updated);
    return updated;
  },
  deleteAddress: (id) => {
    const all = STORE.getAddresses();
    const updated = all.filter((a) => a.id !== id);
    if (updated.length > 0 && !updated.some((a) => a.isDefault)) {
      updated[0].isDefault = true;
    }
    setStoredData(STORAGE_KEYS.ADDRESSES, updated);
    return updated;
  },
  setDefaultAddress: (id) => {
    const all = STORE.getAddresses();
    const updated = all.map((a) => ({
      ...a,
      isDefault: a.id === id
    }));
    setStoredData(STORAGE_KEYS.ADDRESSES, updated);
    return updated;
  },

  // All Customer Emails Aggregator (for launches & promo broadcasts)
  getAllCustomerEmails: () => {
    const emails = new Set();
    
    // 1. From Orders
    const orders = getStoredData(STORAGE_KEYS.ORDERS, []);
    orders.forEach((o) => {
      if (o.customerEmail && o.customerEmail.includes("@")) {
        emails.add(o.customerEmail.trim().toLowerCase());
      }
    });

    // 2. From Custom Inquiries
    const inquiries = getStoredData(STORAGE_KEYS.CUSTOMIZATIONS, []);
    inquiries.forEach((c) => {
      if (c.email && c.email.includes("@")) {
        emails.add(c.email.trim().toLowerCase());
      }
    });

    // 3. From Subscribers
    const subscribers = getStoredData(STORAGE_KEYS.SUBSCRIBERS, []);
    subscribers.forEach((s) => {
      if (typeof s === "string" && s.includes("@")) {
        emails.add(s.trim().toLowerCase());
      }
    });

    // 4. From current customer session
    if (typeof window !== "undefined") {
      try {
        const savedUser = localStorage.getItem("cocoon_customer_user");
        if (savedUser) {
          const user = JSON.parse(savedUser);
          if (user.email && user.email.includes("@")) {
            emails.add(user.email.trim().toLowerCase());
          }
          if (user.identifier && user.identifier.includes("@")) {
            emails.add(user.identifier.trim().toLowerCase());
          }
        }
      } catch (e) {}
    }

    return Array.from(emails);
  },

  // Store Configuration & Settings (COD Toggle, Free Delivery on Online, etc.)
  getSettings: () => {
    return getStoredData(STORAGE_KEYS.SETTINGS, {
      codEnabled: true,
      freeDeliveryOnOnline: true,
      codDeliveryFee: 80
    });
  },

  setSettings: (settings) => {
    setStoredData(STORAGE_KEYS.SETTINGS, settings);
  },

  isCodEnabled: () => {
    const s = STORE.getSettings();
    return s && typeof s.codEnabled === "boolean" ? s.codEnabled : true;
  },

  toggleCod: (explicitState) => {
    const s = STORE.getSettings();
    const newState = explicitState !== undefined ? explicitState : !s.codEnabled;
    const updated = { ...s, codEnabled: newState };
    STORE.setSettings(updated);
    return newState;
  },

  isOnlineFreeDeliveryEnabled: () => {
    const s = STORE.getSettings();
    return s && typeof s.freeDeliveryOnOnline === "boolean" ? s.freeDeliveryOnOnline : true;
  },

  toggleOnlineFreeDelivery: (explicitState) => {
    const s = STORE.getSettings();
    const current = typeof s.freeDeliveryOnOnline === "boolean" ? s.freeDeliveryOnOnline : true;
    const newState = explicitState !== undefined ? explicitState : !current;
    const updated = { ...s, freeDeliveryOnOnline: newState };
    STORE.setSettings(updated);
    return newState;
  },

  // Central Email Dispatcher (Calls /api/email/send)
  dispatchEmailNotification: async (action, payload) => {
    try {
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload }),
      });
      return await res.json();
    } catch (err) {
      console.error("Email notification dispatch error:", err);
      return { success: false, error: err.message };
    }
  },

  // Notification WhatsApp Dispatcher
  sendWhatsAppNotification: (type, payload) => {
    const targetPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
    let message = "";

    if (type === "order") {
      message =
        `*NEW ORDER RECEIVED*\n\n` +
        `*Order ID:* ${payload.id}\n` +
        `*Customer:* ${payload.customerName}\n` +
        `*Phone:* ${payload.customerPhone}\n` +
        `*Address:* ${payload.address}\n\n` +
        `*Items:*\n${payload.items.map((i) => `• ${i.name} (Qty: ${i.quantity}, ${i.color}) - Rs. ${i.price * i.quantity}`).join("\n")}\n\n` +
        `*Total Amount:* Rs. ${payload.totalAmount}\n` +
        `*Payment Mode:* ${payload.paymentMethod}\n` +
        (payload.notes ? `*Notes:* ${payload.notes}\n` : "") +
        `\n_Cocoon Studio Automated Notification_`;
    } else if (type === "customization") {
      message =
        `*NEW CUSTOMIZATION REQUEST*\n\n` +
        `*Product / Item:* ${payload.productName || payload.category}\n` +
        `*Color Preference:* ${payload.colorway || "To be discussed"}\n` +
        `*Idea / Vision:* ${payload.idea || "Standard custom piece"}\n` +
        (payload.mediaName ? `*Attached Reference Media:* [${payload.mediaName}] (Sent in chat)\n` : "") +
        (payload.socialLink ? `*Reel / Pin Link:* ${payload.socialLink}\n` : "") +
        (payload.neededBy ? `*Need-By Date:* ${payload.neededBy}\n` : "") +
        (payload.budget ? `*Budget Range:* ${payload.budget}\n` : "") +
        `\n*Customer Details:*\n` +
        `• Name: ${payload.name}\n` +
        `• Phone: ${payload.phone}\n` +
        (payload.email ? `• Email: ${payload.email}\n` : "") +
        `\n_Cocoon Studio Automated Notification_`;
    }

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/91${targetPhone}?text=${encoded}`, "_blank");
  }
};
