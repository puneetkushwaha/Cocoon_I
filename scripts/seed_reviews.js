const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    value = value.replace(/^['"]|['"]$/g, '').trim();
    env[match[1]] = value;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Connecting to Supabase at:", supabaseUrl);

  const reviewsToInsert = [
    {
      review_id: "REV-201",
      product_id: 6,
      product_name: "Pink Rose & Bell Flower Ponytail Tie",
      customer_name: "Nimisha Agarwal",
      customer_phone: "9634640893",
      rating: 5,
      title: "All these are really very beautiful!",
      comment: "Thank you very much! All these are really very beautiful and this gift was totally unexpected... I'm really happy. Your efforts are visible in each and every stitch, finishing is so neat. Thank you so much for the gift!",
      media_url: "/reviews/nimisha-agarwal-rose-clips-bow.jpg",
      order_id: "COC-7842",
      status: "Approved",
      created_at: "2026-10-21T19:34:00.000Z"
    },
    {
      review_id: "REV-202",
      product_id: 22,
      product_name: "White Blossom & Bell Bud Hair Tie",
      customer_name: "Nimisha Agarwal",
      customer_phone: "9634640893",
      rating: 5,
      title: "Efforts are visible in each and every thing",
      comment: "Ordered these handcrafted rose clips and they are so cute and delicate! Look even prettier in person and the elastic holds hair securely without pulling. The sweet surprise gift made my day. Thank you Mehak!",
      media_url: "/reviews/nimisha-agarwal-rose-clips-bow.jpg",
      order_id: "COC-7842",
      status: "Approved",
      created_at: "2026-10-21T19:34:00.000Z"
    },
    {
      review_id: "REV-203",
      product_id: 4,
      product_name: "Ruby Red Bow & Pearl Charm Keychain",
      customer_name: "Nimisha Agarwal",
      customer_phone: "9634640893",
      rating: 5,
      title: "Totally unexpected gift & gorgeous quality!",
      comment: "Received this beautiful ruby red bow keychain as a surprise gift with my order. All these are really very beautiful, your efforts and dedication are visible in each and every creation. Loved it!",
      media_url: "/reviews/nimisha-agarwal-rose-clips-bow.jpg",
      order_id: "COC-7842",
      status: "Approved",
      created_at: "2026-10-21T19:34:00.000Z"
    },
    {
      review_id: "REV-204",
      product_id: 30,
      product_name: "Snow White Rose & Twin Buds Charm",
      customer_name: "Nimisha Agarwal",
      customer_phone: "9634640893",
      rating: 5,
      title: "Stunning craftsmanship and detailing",
      comment: "The blooming white rose with dangling twin buds is so finely hand-crocheted. Ultra-soft milk cotton and looks gorgeous. So happy with my purchase!",
      media_url: "/reviews/nimisha-agarwal-rose-clips-bow.jpg",
      order_id: "COC-7842",
      status: "Approved",
      created_at: "2026-10-21T19:34:00.000Z"
    }
  ];

  // Also seed verified order for Nimisha Agarwal
  const orderToInsert = {
    order_id: "COC-7842",
    customer_name: "Nimisha Agarwal",
    customer_phone: "9634640893",
    customer_email: "nimisha.agarwal@gmail.com",
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
    total_amount: 498,
    status: "Delivered",
    payment_method: "Cash on Delivery",
    notes: "Complimentary surprise ruby red bow keychain gifted by Mehak.",
    created_at: "2026-10-20T14:30:00.000Z"
  };

  try {
    const { data: revData, error: revError } = await supabase
      .from("reviews")
      .upsert(reviewsToInsert, { onConflict: "review_id" });

    if (revError) {
      console.warn("Reviews upsert notice:", revError.message);
    } else {
      console.log("Successfully inserted/updated 4 customer reviews in Supabase!");
    }

    const { data: ordData, error: ordError } = await supabase
      .from("orders")
      .upsert([orderToInsert], { onConflict: "order_id" });

    if (ordError) {
      console.warn("Order upsert notice:", ordError.message);
    } else {
      console.log("Successfully inserted/updated verified order COC-7842 in Supabase!");
    }
  } catch (err) {
    console.error("Error during Supabase seed:", err);
  }
}

seed();
