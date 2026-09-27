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

export const INITIAL_ORDERS = [];

export const INITIAL_CUSTOMIZATIONS = [];

export const INITIAL_REVIEWS = [
  {
    id: "REV-101",
    productId: 1,
    productName: "Chocolate Bow Knot Handbag",
    customerName: "Rhea Singhania",
    rating: 5,
    title: "Even more gorgeous in person!",
    comment: "The knit tension is super sturdy and doesn't sag even when I put my phone, perfume and wallet. Dispatched very quickly from Agra!",
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

const STORAGE_KEYS = {
  PRODUCTS: "cocoon_store_products",
  CATEGORIES: "cocoon_store_categories",
  BESTSELLERS: "cocoon_store_bestsellers",
  HERO_CARDS: "cocoon_store_hero_cards",
  TICKER: "cocoon_store_ticker",
  ORDERS: "cocoon_store_orders",
  CUSTOMIZATIONS: "cocoon_store_customizations",
  REVIEWS: "cocoon_store_reviews",
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

    // Auto-purge any legacy demo/mock data
    if (key === STORAGE_KEYS.ORDERS && Array.isArray(parsed)) {
      const cleanOrders = parsed.filter((o) => !o.id?.startsWith("ORD-94"));
      if (cleanOrders.length !== parsed.length) {
        localStorage.setItem(key, JSON.stringify(cleanOrders));
        return cleanOrders;
      }
      return cleanOrders;
    }

    if (key === STORAGE_KEYS.CUSTOMIZATIONS && Array.isArray(parsed)) {
      const cleanCust = parsed.filter((c) => c.id !== "CUST-101");
      if (cleanCust.length !== parsed.length) {
        localStorage.setItem(key, JSON.stringify(cleanCust));
        return cleanCust;
      }
      return cleanCust;
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
    window.dispatchEvent(new Event("cocoon_store_update"));
  } catch (e) {
    console.error("Error writing localStorage:", e);
  }
};

export const STORE = {
  getKeys: () => STORAGE_KEYS,
  getProducts: () => {
    const stored = getStoredData(STORAGE_KEYS.PRODUCTS, PRODUCTS);
    if (Array.isArray(stored) && stored.length < PRODUCTS.length) {
      const storedIds = new Set(stored.map((p) => p.id));
      const missing = PRODUCTS.filter((p) => !storedIds.has(p.id));
      const merged = [...stored, ...missing];
      setStoredData(STORAGE_KEYS.PRODUCTS, merged);
      return merged;
    }
    return stored;
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
        link: "/#p4-treasures",
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
                city: u.city || "Agra",
                pincode: u.pincode || "282001",
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

  // Store Configuration & Settings (COD Toggle, etc.)
  getSettings: () => {
    return getStoredData(STORAGE_KEYS.SETTINGS, {
      codEnabled: true, // Default to true per user request
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
