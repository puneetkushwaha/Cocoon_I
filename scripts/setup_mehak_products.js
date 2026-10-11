const fs = require('fs');
const path = require('path');

const srcDir = path.join(process.cwd(), 'public', 'products');
const destDir = path.join(process.cwd(), 'public', 'products', 'items');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Read all source image files in order
const rawFiles = fs.readdirSync(srcDir).filter(f => !fs.statSync(path.join(srcDir, f)).isDirectory());

// 29 items indexed exactly from rawFiles:
const catalog = [
  {
    index: 0,
    cleanFile: 'chocolate-bow-handbag.jpg',
    id: 1,
    name: 'Chocolate Bow Knot Handbag',
    category: 'bags',
    subcategory: 'totes-handbags',
    price: 899,
    originalPrice: 1299,
    badge: 'Cute',
    desc: 'Chic structured mini handbag in rich mocha brown with cream accent ribbon bow knot detailing. Sturdy handle with spacious knit volume.',
    reviews: 24,
    colors: ['Mocha Brown', 'Cream Vanilla'],
    sizes: ['Mini Handbag (8" x 7")'],
    materials: '100% Chunky Cotton Cord'
  },
  {
    index: 1,
    cleanFile: 'pink-crochet-waist-scarf.jpg',
    id: 2,
    name: 'Blush Pink Crochet Waist Scarf & Hip Wrap',
    category: 'belts',
    subcategory: 'waist-scarves',
    price: 549,
    originalPrice: 799,
    badge: 'Handmade',
    desc: 'Lightweight lacy wrap belt with intricate granny stitchwork and graceful braided waist tie fringe. Perfect boho cottage festival look.',
    reviews: 19,
    colors: ['Dusty Rose', 'Soft Blush'],
    sizes: ['Free Size (Tie-Up Length 52")'],
    materials: 'Ultra-Soft Milk Cotton'
  },
  {
    index: 2,
    cleanFile: 'lilac-mesh-headband.jpg',
    id: 3,
    name: 'Lilac Cloud Mesh Headband',
    category: 'bandanas',
    subcategory: 'headbands',
    price: 299,
    originalPrice: 449,
    badge: 'Cute',
    desc: 'Soft pastel lilac open-mesh headband with scalloped borders. Gentle on hair with zero pinching or tightness.',
    reviews: 16,
    colors: ['Lilac Pastel', 'Cream Ivory'],
    sizes: ['Comfort Elastic Tie'],
    materials: '100% Breathable Cotton Yarn'
  },
  {
    index: 3,
    cleanFile: 'red-bow-pearl-keychain.jpg',
    id: 4,
    name: 'Ruby Red Bow & Pearl Charm Keychain',
    category: 'keychains',
    subcategory: 'bow-keychains',
    price: 199,
    originalPrice: 299,
    badge: 'Bestseller',
    desc: 'Classic ruby red crochet bow adorned with miniature dangling pearls and metal clip. Adds a touch of whimsy to any tote or keyring.',
    reviews: 38,
    colors: ['Ruby Red', 'Wine Red'],
    sizes: ['Handy Clip (4" drop)'],
    materials: 'Fine Cotton Thread & Faux Pearls'
  },
  {
    index: 4,
    cleanFile: 'pink-cherry-bow-keychain.jpg',
    id: 5,
    name: 'Cherry Blossom Bow & Bead Keychain',
    category: 'keychains',
    subcategory: 'fruit-keychains',
    price: 229,
    originalPrice: 329,
    badge: 'New',
    desc: 'Charming combo of crocheted 3D cherries, pink bow, and pastel beads. Eye-catching accessory for keys, bags, and backpacks.',
    reviews: 27,
    colors: ['Blush Pink & Cherry Red', 'Peach'],
    sizes: ['Handy Clip (4.5" drop)'],
    materials: 'Soft Milk Cotton & Acrylic Beads'
  },
  {
    index: 5,
    cleanFile: 'rose-ponytail-tie-pink.jpg',
    id: 6,
    name: 'Pink Rose & Bell Flower Ponytail Tie',
    category: 'hair-accessories',
    subcategory: 'scrunchies-ties',
    price: 249,
    originalPrice: 349,
    badge: 'Cottagecore',
    desc: 'Exquisite 3D blooming pink rose with dangling micro bell flowers on high-elastic hair bands. A dreamy cottagecore hair ornament.',
    reviews: 31,
    colors: ['English Rose Pink', 'Petal Peach'],
    sizes: ['Stretch Elastic Fit'],
    materials: 'Delicate Fine Cotton'
  },
  {
    index: 6,
    cleanFile: 'floral-vine-waist-belt.jpg',
    id: 7,
    name: 'Floral Bloom Vine Waist Belt for Denim',
    category: 'belts',
    subcategory: 'lace-belts',
    price: 499,
    originalPrice: 749,
    badge: 'Trending',
    desc: 'Delicate floral daisy chain woven belt designed to elevate high-waisted denim jeans, trousers, and summer slip dresses.',
    reviews: 42,
    colors: ['Pastel Multicolor Floral', 'Daisy White & Yellow'],
    sizes: ['Free Size (Tie-Up 48")'],
    materials: 'High-Durability Cotton Thread'
  },
  {
    index: 7,
    cleanFile: 'burgundy-triangle-bandana.jpg',
    id: 8,
    name: 'Burgundy Wine Triangle Hair Bandana',
    category: 'bandanas',
    subcategory: 'bandanas',
    price: 349,
    originalPrice: 499,
    badge: 'Bestseller',
    desc: 'Romantic open-mesh triangle hair scarf in deep burgundy. Easily ties around low ponytails, messy buns, or loose waves.',
    reviews: 45,
    colors: ['Deep Burgundy', 'Earthy Terracotta'],
    sizes: ['Standard Free Size'],
    materials: 'Soft Lightweight Acrylic Yarn'
  },
  {
    index: 8,
    cleanFile: 'brown-flower-claw-clip.jpg',
    id: 9,
    name: 'Mocha Floral Hair Claw Clip',
    category: 'hair-accessories',
    subcategory: 'hair-clips',
    price: 229,
    originalPrice: 349,
    badge: 'Aesthetic',
    desc: 'Earth tone blossom crochet applique on a warm brown claw clip. Elegant minimal cottagecore accessory that secures hair in seconds.',
    reviews: 22,
    colors: ['Mocha Cream', 'Caramel Tan'],
    sizes: ['Medium Claw Clip (3.5")'],
    materials: 'Milk Cotton on Sturdy Acrylic Clip'
  },
  {
    index: 9,
    cleanFile: 'wine-ruffled-scrunchie.jpg',
    id: 10,
    name: 'Wine Red & Cream Fluffy Scrunchie',
    category: 'hair-accessories',
    subcategory: 'scrunchies-ties',
    price: 179,
    originalPrice: 249,
    badge: 'Bestseller',
    desc: 'Dual-toned ruffled scrunchie in rich merlot wine with cream scalloped piping. High stretch elastic core that never snaps hair.',
    reviews: 58,
    colors: ['Wine Red & Cream', 'Forest Green & Cream'],
    sizes: ['Oversized Ruffle'],
    materials: 'Velvety Soft Chenille Yarn'
  },
  {
    index: 10,
    cleanFile: 'striped-gold-chain-crossbody.jpg',
    id: 11,
    name: 'Chunky Striped Crossbody with Gold Chain',
    category: 'bags',
    subcategory: 'crossbody-slings',
    price: 849,
    originalPrice: 1199,
    badge: 'Exclusive',
    desc: 'Textured chunky knit crossbody pouch accented with bold dual stripes and luxury gold metal link chain strap. Magnetic snap closure.',
    reviews: 17,
    colors: ['Navy & Cream', 'Forest & Cream'],
    sizes: ['Crossbody Pouch (8.5" x 6")'],
    materials: 'Chunky Polyester Cord & Gold Alloy Chain'
  },
  {
    index: 11,
    cleanFile: 'sage-granny-phone-case.jpg',
    id: 12,
    name: 'Sage Green Granny Square Phone Cover',
    category: 'phone-cases',
    subcategory: 'phone-sleeves',
    price: 499,
    originalPrice: 699,
    badge: 'Popular',
    desc: 'Cozy shock-absorbent crochet sleeve in soft sage green with vintage granny square design and matching beaded wrist charm.',
    reviews: 33,
    colors: ['Sage Green', 'Dusty Lavender'],
    sizes: ['Universal Fit (Up to 6.7" phones)'],
    materials: 'Cushioned Milk Cotton'
  },
  {
    index: 12,
    cleanFile: 'solo-evil-eye-keychain.jpg',
    id: 13,
    name: 'Solo Nazar Evil Eye Protection Keychain',
    category: 'keychains',
    subcategory: 'evil-eye',
    price: 169,
    originalPrice: 249,
    badge: 'Protection',
    desc: 'Hand-knitted classic blue and white Evil Eye motif keychain with protective Nazar charm and braided tassel loop.',
    reviews: 49,
    colors: ['Cobalt Blue & White', 'Turquoise Blue'],
    sizes: ['Pocket Size (3.5")'],
    materials: 'Fine Mercerized Cotton Thread'
  },
  {
    index: 13,
    cleanFile: 'evil-eye-keychains-bunch.jpg',
    id: 14,
    name: 'Nazar Amulet Evil Eye Keyring Set',
    category: 'keychains',
    subcategory: 'evil-eye',
    price: 189,
    originalPrice: 279,
    badge: 'Popular',
    desc: 'Boho evil eye circular crochet medallions with decorative wood beads and golden split ring. Loved as a thoughtful good luck gift.',
    reviews: 37,
    colors: ['Sapphire Blue', 'Aegean Teal'],
    sizes: ['Handy Keyring (4")'],
    materials: 'Mercerized Cotton & Wood Beads'
  },
  {
    index: 14,
    cleanFile: 'sunflower-baguette-shoulder-bag.jpg',
    id: 15,
    name: 'Sunflower Baguette Shoulder Bag',
    category: 'bags',
    subcategory: 'totes-handbags',
    price: 999,
    originalPrice: 1399,
    badge: 'New Drop',
    desc: 'Y2K inspired baguette silhouette featuring contrasting floral granny squares and reinforced shoulder drop strap.',
    reviews: 29,
    colors: ['Multicolor Bloom', 'Monochrome Earth'],
    sizes: ['Compact Baguette (10" x 6")'],
    materials: '100% Breathable Cotton Blend'
  },
  {
    index: 15,
    cleanFile: 'pastel-cherry-bow-phone-cases.jpg',
    id: 16,
    name: 'Pastel Cherry & Bow Phone Cases Collection',
    category: 'phone-cases',
    subcategory: 'phone-sleeves',
    price: 549,
    originalPrice: 799,
    badge: 'New Drop',
    desc: 'Cozy pastel yarn cases decorated with 3D cherries, sweet mini bows, and daisy appliques. Ultra soft feel with drop cushioning.',
    reviews: 25,
    colors: ['Pastel Mint Cherry', 'Blush Bow', 'Vanilla Buttercup'],
    sizes: ['Universal Fit (Up to 6.7" phones)'],
    materials: 'Plush Baby Cotton Yarn'
  },
  {
    index: 16,
    cleanFile: 'sunflower-granny-backpack.jpg',
    id: 17,
    name: 'Sunflower Granny Square Mini Backpack',
    category: 'bags',
    subcategory: 'backpacks',
    price: 1399,
    originalPrice: 1899,
    badge: 'Bestseller',
    desc: 'Handmade artisanal backpack featuring hand-knitted sunflower granny squares, sturdy drawstrings, and comfortable dual shoulder straps.',
    reviews: 52,
    colors: ['Sunflower Gold & Navy', 'Sunflower & Sage'],
    sizes: ['Mini Backpack (11" x 10" x 4")'],
    materials: 'Heavyweight Durable Cotton Yarn'
  },
  {
    index: 17,
    cleanFile: 'floral-flap-phone-sling.jpg',
    id: 18,
    name: 'Navy Floral Flap Phone Sling Crossbody',
    category: 'phone-cases',
    subcategory: 'phone-slings',
    price: 599,
    originalPrice: 849,
    badge: 'Bestseller',
    desc: 'Hands-free crochet crossbody phone bag featuring blooming floral accents, protective envelope flap, and secure wooden button closure.',
    reviews: 41,
    colors: ['Navy Floral', 'Sage Floral'],
    sizes: ['Universal Smartphone Fit (with 46" sling)'],
    materials: 'Structured Cotton Cord'
  },
  {
    index: 18,
    cleanFile: 'navy-blue-lace-belt.jpg',
    id: 19,
    name: 'Navy Blue Royal Lace Waist Belt',
    category: 'belts',
    subcategory: 'lace-belts',
    price: 449,
    originalPrice: 699,
    badge: 'Classic',
    desc: 'Rich royal navy handcrafted geometric lace belt with dainty drop tassels for an effortless bohemian accent over shirts and dresses.',
    reviews: 20,
    colors: ['Royal Navy', 'Midnight Black'],
    sizes: ['Free Size (Tie-Up 50")'],
    materials: 'Mercerized Cotton Thread'
  },
  {
    index: 19,
    cleanFile: 'chunky-ruffled-scrunchie-yellow-cream.jpg',
    id: 20,
    name: 'Cream & Butter Chunky Ruffled Scrunchie',
    category: 'hair-accessories',
    subcategory: 'scrunchies-ties',
    price: 179,
    originalPrice: 249,
    badge: 'Soft',
    desc: 'Extra plush ruffled crochet scrunchie crafted in chunky yarn. Ultra gentle on hair, prevents kinks and eliminates pulling.',
    reviews: 36,
    colors: ['Butter Yellow & Cream', 'Pure Vanilla'],
    sizes: ['Oversized Ruffle'],
    materials: 'Hypoallergenic Chunky Knit Yarn'
  },
  {
    index: 20,
    cleanFile: 'sunflower-claw-clips.jpg',
    id: 21,
    name: 'Sunflower Crochet Hair Claw Clip',
    category: 'hair-accessories',
    subcategory: 'hair-clips',
    price: 229,
    originalPrice: 349,
    badge: 'Popular',
    desc: 'Cheerful sunflower motif mounted on a strong-grip acetate claw clip. Holds both thick and fine hair securely throughout the day.',
    reviews: 48,
    colors: ['Sunny Yellow', 'Warm Honey'],
    sizes: ['Medium Claw Clip (3.5")'],
    materials: 'Cotton Floral Motif on Resin Clip'
  },
  {
    index: 21,
    cleanFile: 'rose-bell-hair-tie-white.jpg',
    id: 22,
    name: 'White Blossom & Bell Bud Hair Tie',
    category: 'hair-accessories',
    subcategory: 'scrunchies-ties',
    price: 249,
    originalPrice: 349,
    badge: 'Delicate',
    desc: 'Pure ivory blossom hair tie with drooping baby buds and soft leaf fringe. Perfect for ethereal braids, half-up styles, and messy buns.',
    reviews: 28,
    colors: ['Ivory White', 'Powder Blue'],
    sizes: ['Stretch Elastic Fit'],
    materials: 'Fine Mercerized Cotton'
  },
  {
    index: 22,
    cleanFile: 'terracotta-floral-pouch.jpg',
    id: 23,
    name: 'Terracotta Floral Drawstring Pouch',
    category: 'bags',
    subcategory: 'pouches',
    price: 799,
    originalPrice: 1099,
    badge: 'Handcrafted',
    desc: 'Bohemian rustic drawstring pouch with blooming floral surface embroidery and durable braided pull cords. Ideal for makeup or essentials.',
    reviews: 34,
    colors: ['Terracotta Rust', 'Olive Meadow'],
    sizes: ['Compact Pouch (7" x 7")'],
    materials: 'Natural Cotton & Linen Blend'
  },
  {
    index: 23,
    cleanFile: 'lilac-bow-pearl-keychain.jpg',
    id: 24,
    name: 'Lilac Bow & Pearl Charm Keychain',
    category: 'keychains',
    subcategory: 'bow-keychains',
    price: 199,
    originalPrice: 299,
    badge: 'Cute',
    desc: 'Delicate pastel lilac crochet bow charm with shimmering faux pearl droplets and sturdy gold keyring clasp.',
    reviews: 32,
    colors: ['Pastel Lilac', 'Baby Pink'],
    sizes: ['Handy Clip (4" drop)'],
    materials: 'Fine Cotton Thread & Faux Pearls'
  },
  {
    index: 24,
    cleanFile: 'blush-pink-floral-case.jpg',
    id: 25,
    name: 'Blush Pink 3D Floral Phone Sleeve',
    category: 'phone-cases',
    subcategory: 'phone-sleeves',
    price: 529,
    originalPrice: 749,
    badge: 'Cute',
    desc: 'Tender baby pink knitted phone case embellished with three-dimensional crochet flowers and leafy vines. Snug protective fit.',
    reviews: 39,
    colors: ['Blush Pink', 'Cream Ivory'],
    sizes: ['Universal Fit (Up to 6.7" phones)'],
    materials: 'Soft Cushioned Cotton'
  },
  {
    index: 25,
    cleanFile: 'sunflower-crossbody-tote.jpg',
    id: 26,
    name: 'Sun-Kissed Sunflower Crossbody Tote',
    category: 'bags',
    subcategory: 'crossbody-slings',
    price: 1199,
    originalPrice: 1599,
    badge: 'Trending',
    desc: 'Vibrant handcrafted sunflower motif crossbody bag. Features deep storage for daily essentials and a wide comfortable woven strap.',
    reviews: 44,
    colors: ['Golden Ochre', 'Earthy Brown'],
    sizes: ['Medium Tote (11" x 11")'],
    materials: 'Heavy Organic Cotton'
  },
  {
    index: 26,
    cleanFile: 'spiderweb-gothic-bandana.jpg',
    id: 27,
    name: 'Gothic Spiderweb Lace Bandana',
    category: 'bandanas',
    subcategory: 'bandanas',
    price: 399,
    originalPrice: 599,
    badge: 'Statement',
    desc: 'Intricate black spiderweb crochet openwork kerchief with tie ribbons. The ultimate alt cottagecore statement piece.',
    reviews: 23,
    colors: ['Onyx Black', 'Smoky Charcoal'],
    sizes: ['Standard Free Size'],
    materials: 'Fine Mercerized Black Cotton'
  },
  {
    index: 27,
    cleanFile: 'white-lace-waist-belt.jpg',
    id: 28,
    name: 'White Lace Vintage Tie Belt',
    category: 'belts',
    subcategory: 'lace-belts',
    price: 449,
    originalPrice: 699,
    badge: 'Aesthetic',
    desc: 'Intricate scalloped lace belt crafted in soft off-white cotton yarn. Perfect over denim jeans, linen skirts, or breezy dresses.',
    reviews: 30,
    colors: ['Vintage Ivory', 'Chalk White'],
    sizes: ['Free Size (Tie-Up 50")'],
    materials: '100% Fine Organic Cotton'
  },
  {
    index: 28,
    cleanFile: 'candy-festive-crochet-scrunchie.jpg',
    id: 29,
    name: 'Candy Red & Vanilla Swirl Hair Tie',
    category: 'hair-accessories',
    subcategory: 'scrunchies-ties',
    price: 149,
    originalPrice: 199,
    badge: 'Festive',
    desc: 'Vibrant handcrafted candy red and white ruffled scrunchie, designed for messy buns and sleek high ponytails.',
    reviews: 51,
    colors: ['Candy Red & White', 'Pink & White'],
    sizes: ['Everyday Stretch'],
    materials: 'Milk Cotton with Premium Elastic'
  }
];

// Perform copy
console.log('Copying ' + catalog.length + ' files...');
catalog.forEach(item => {
  const rawFileName = rawFiles[item.index];
  if (!rawFileName) {
    console.error('Missing raw file at index:', item.index);
    return;
  }
  const src = path.join(srcDir, rawFileName);
  const dest = path.join(destDir, item.cleanFile);
  fs.copyFileSync(src, dest);
  console.log(`Copied [${item.index}]: "${rawFileName.slice(0, 25)}..." -> "${item.cleanFile}"`);
});

// Format JavaScript products file
const productsJS = `// Handcrafted Products by Mehak exclusively for Cocoon
export const PRODUCTS = [
` + catalog.map(item => `  {
    id: ${item.id},
    name: ${JSON.stringify(item.name)},
    category: ${JSON.stringify(item.category)},
    subcategory: ${JSON.stringify(item.subcategory)},
    price: ${item.price},
    originalPrice: ${item.originalPrice},
    imgUrl: "/products/items/${item.cleanFile}",
    hoverImgUrl: "/products/items/${item.cleanFile}",
    badge: ${item.badge ? JSON.stringify(item.badge) : 'null'},
    desc: ${JSON.stringify(item.desc)},
    reviews: ${item.reviews},
    colors: ${JSON.stringify(item.colors)},
    sizes: ${JSON.stringify(item.sizes)},
    materials: ${JSON.stringify(item.materials)}
  }`).join(',\n') + `
];
`;

const jsDest = path.join(process.cwd(), 'src', 'data', 'products.js');
const jsDestDir = path.dirname(jsDest);
if (!fs.existsSync(jsDestDir)) {
  fs.mkdirSync(jsDestDir, { recursive: true });
}
fs.writeFileSync(jsDest, productsJS, 'utf8');
console.log('Written products database to:', jsDest);

// Verification and category breakdown:
const breakdown = {};
catalog.forEach(item => {
  breakdown[item.category] = (breakdown[item.category] || 0) + 1;
});
console.log('Breakdown by category:', breakdown);
console.log('Total products:', catalog.length);
