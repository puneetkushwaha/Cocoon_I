const fs = require('fs');
const path = require('path');

const srcDir = path.join(process.cwd(), 'public', 'products');
const destDir = path.join(process.cwd(), 'public', 'products', 'items');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// 29 files mapping
const items = [
  // BAGS (6)
  {
    prefix: 'Handmade Crochet Sunflower Bag with Granny Squares',
    cleanFile: 'sunflower-granny-backpack.jpg',
    name: 'Sunflower Granny Square Mini Backpack',
    category: 'bags',
    price: 1399,
    originalPrice: 1899,
    badge: 'Bestseller'
  },
  {
    prefix: 'Stunning Crochet Sunflower Bag',
    cleanFile: 'sunflower-crossbody-tote.jpg',
    name: 'Sun-Kissed Sunflower Crossbody Tote',
    category: 'bags',
    price: 1199,
    originalPrice: 1599,
    badge: 'Trending'
  },
  {
    prefix: 'Get yours now!',
    cleanFile: 'sunflower-baguette-shoulder-bag.jpg',
    name: 'Sunflower Baguette Shoulder Bag',
    category: 'bags',
    price: 999,
    originalPrice: 1399,
    badge: 'New Drop'
  },
  {
    prefix: '15 Fun Crochet Bags for Kids',
    cleanFile: 'chocolate-bow-handbag.jpg',
    name: 'Chocolate Bow Knot Handbag',
    category: 'bags',
    price: 899,
    originalPrice: 1299,
    badge: 'Cute'
  },
  {
    prefix: 'IMG-20260923-WA0005',
    cleanFile: 'terracotta-floral-pouch.jpg',
    name: 'Terracotta Floral Drawstring Pouch',
    category: 'bags',
    price: 799,
    originalPrice: 1099,
    badge: 'Handcrafted'
  },
  {
    prefix: 'download (6)',
    cleanFile: 'striped-gold-chain-crossbody.jpg',
    name: 'Chunky Striped Crossbody with Gold Chain',
    category: 'bags',
    price: 849,
    originalPrice: 1199,
    badge: 'Exclusive'
  },

  // PHONE CASES & SLINGS (4)
  {
    prefix: 'Handmade crocheted phone bag',
    cleanFile: 'floral-flap-phone-sling.jpg',
    name: 'Navy Floral Flap Phone Sling Crossbody',
    category: 'phone-cases',
    price: 599,
    originalPrice: 849,
    badge: 'Bestseller'
  },
  {
    prefix: 'download (7)',
    cleanFile: 'sage-granny-phone-case.jpg',
    name: 'Sage Green Granny Square Phone Cover',
    category: 'phone-cases',
    price: 499,
    originalPrice: 699,
    badge: 'Popular'
  },
  {
    prefix: 'phone cover',
    cleanFile: 'blush-pink-floral-case.jpg',
    name: 'Blush Pink 3D Floral Phone Sleeve',
    category: 'phone-cases',
    price: 529,
    originalPrice: 749,
    badge: 'Cute'
  },
  {
    prefix: 'Handmade crochet phone cases in soft pastel shades',
    cleanFile: 'pastel-cherry-bow-phone-cases.jpg',
    name: 'Pastel Cherry & Bow Phone Cases Collection',
    category: 'phone-cases',
    price: 549,
    originalPrice: 799,
    badge: 'New Drop'
  },

  // BELTS & WAIST TIES (4)
  {
    prefix: '✨',
    cleanFile: 'white-lace-waist-belt.jpg',
    name: 'White Lace Vintage Tie Belt',
    category: 'belts',
    price: 449,
    originalPrice: 699,
    badge: 'Aesthetic'
  },
  {
    prefix: 'How to Crochet a Lace Belt',
    cleanFile: 'navy-blue-lace-belt.jpg',
    name: 'Navy Blue Royal Lace Waist Belt',
    category: 'belts',
    price: 449,
    originalPrice: 699,
    badge: 'Classic'
  },
  {
    prefix: 'Cute Crochet Flower Belt for Jeans',
    cleanFile: 'floral-vine-waist-belt.jpg',
    name: 'Floral Bloom Vine Waist Belt for Denim',
    category: 'belts',
    price: 499,
    originalPrice: 749,
    badge: 'Trending'
  },
  {
    prefix: '18 Crochet Baby Booties Ideas',
    cleanFile: 'pink-crochet-waist-scarf.jpg',
    name: 'Blush Pink Crochet Waist Scarf & Hip Wrap',
    category: 'belts',
    price: 549,
    originalPrice: 799,
    badge: 'Handmade'
  },

  // BANDANAS & HEADWEAR (3)
  {
    prefix: 'download (3)',
    cleanFile: 'burgundy-triangle-bandana.jpg',
    name: 'Burgundy Wine Triangle Hair Bandana',
    category: 'bandanas',
    price: 349,
    originalPrice: 499,
    badge: 'Bestseller'
  },
  {
    prefix: 'Whimsical Spider Amigurumi',
    cleanFile: 'spiderweb-gothic-bandana.jpg',
    name: 'Gothic Spiderweb Lace Bandana',
    category: 'bandanas',
    price: 399,
    originalPrice: 599,
    badge: 'Statement'
  },
  {
    prefix: 'Aesthetic Crochet Mesh Headband',
    cleanFile: 'lilac-mesh-headband.jpg',
    name: 'Lilac Cloud Mesh Headband',
    category: 'bandanas',
    price: 299,
    originalPrice: 449,
    badge: 'Cute'
  },

  // HAIR ACCESSORIES & SCRUNCHIES (7)
  {
    prefix: 'Crochet Pink Rose Ponytail Tie',
    cleanFile: 'rose-ponytail-tie-pink.jpg',
    name: 'Pink Rose & Bell Flower Ponytail Tie',
    category: 'hair-accessories',
    price: 249,
    originalPrice: 349,
    badge: 'Cottagecore'
  },
  {
    prefix: 'IMG-20260919-WA0001',
    cleanFile: 'rose-bell-hair-tie-white.jpg',
    name: 'White Blossom & Bell Bud Hair Tie',
    category: 'hair-accessories',
    price: 249,
    originalPrice: 349,
    badge: 'Delicate'
  },
  {
    prefix: 'I neeeeeeeeed these',
    cleanFile: 'sunflower-claw-clips.jpg',
    name: 'Sunflower Crochet Hair Claw Clip',
    category: 'hair-accessories',
    price: 229,
    originalPrice: 349,
    badge: 'Popular'
  },
  {
    prefix: 'download (4)',
    cleanFile: 'brown-flower-claw-clip.jpg',
    name: 'Mocha Floral Hair Claw Clip',
    category: 'hair-accessories',
    price: 229,
    originalPrice: 349,
    badge: 'Aesthetic'
  },
  {
    prefix: 'I had the perfect chunky scrunchie yarn',
    cleanFile: 'chunky-ruffled-scrunchie-yellow-cream.jpg',
    name: 'Cream & Butter Chunky Ruffled Scrunchie',
    category: 'hair-accessories',
    price: 179,
    originalPrice: 249,
    badge: 'Soft'
  },
  {
    prefix: 'download (5)',
    cleanFile: 'wine-ruffled-scrunchie.jpg',
    name: 'Wine Red & Cream Fluffy Scrunchie',
    category: 'hair-accessories',
    price: 179,
    originalPrice: 249,
    badge: 'Bestseller'
  },
  {
    prefix: 'From messy buns to sleek ponies',
    cleanFile: 'candy-festive-crochet-scrunchie.jpg',
    name: 'Candy Red & Vanilla Swirl Hair Tie',
    category: 'hair-accessories',
    price: 149,
    originalPrice: 199,
    badge: 'Festive'
  },

  // KEYCHAINS & CHARMS (5)
  {
    prefix: 'keychain.jpg',
    cleanFile: 'lilac-bow-pearl-keychain.jpg',
    name: 'Lilac Bow & Pearl Charm Keychain',
    category: 'keychains',
    price: 199,
    originalPrice: 299,
    badge: 'Cute'
  },
  {
    prefix: 'crochet bow keychain',
    cleanFile: 'red-bow-pearl-keychain.jpg',
    name: 'Ruby Red Bow & Pearl Charm Keychain',
    category: 'keychains',
    price: 199,
    originalPrice: 299,
    badge: 'Bestseller'
  },
  {
    prefix: 'crochet keychain',
    cleanFile: 'pink-cherry-bow-keychain.jpg',
    name: 'Cherry Blossom Bow & Bead Keychain',
    category: 'keychains',
    price: 229,
    originalPrice: 329,
    badge: 'New'
  },
  {
    prefix: 'Evil Eye Bead Crochet Keychain',
    cleanFile: 'solo-evil-eye-keychain.jpg',
    name: 'Solo Nazar Evil Eye Protection Keychain',
    category: 'keychains',
    price: 169,
    originalPrice: 249,
    badge: 'Protection'
  },
  {
    prefix: 'evil eye keychains',
    cleanFile: 'evil-eye-keychains-bunch.jpg',
    name: 'Nazar Amulet Evil Eye Keyring Set',
    category: 'keychains',
    price: 189,
    originalPrice: 279,
    badge: 'Popular'
  }
];

const existingFiles = fs.readdirSync(srcDir).filter(f => !fs.statSync(path.join(srcDir, f)).isDirectory());
console.log('Total files in source:', existingFiles.length);

let matchedCount = 0;
const usedSourceFiles = new Set();

items.forEach((item, index) => {
  let matched = null;
  for (const f of existingFiles) {
    if (usedSourceFiles.has(f)) continue;
    if (f.toLowerCase().includes(item.prefix.toLowerCase()) || 
        (item.prefix.endsWith('.jpg') && f.toLowerCase() === item.prefix.toLowerCase())) {
      matched = f;
      break;
    }
  }

  if (matched) {
    usedSourceFiles.add(matched);
    const src = path.join(srcDir, matched);
    const dest = path.join(destDir, item.cleanFile);
    fs.copyFileSync(src, dest);
    matchedCount++;
    console.log(`[${matchedCount}/29] Matched: "${matched.slice(0, 30)}..." -> "${item.cleanFile}"`);
  } else {
    console.error(`FAILED to match: prefix="${item.prefix}"`);
  }
});

console.log(`Successfully mapped and copied: ${matchedCount} / ${items.length} items`);
