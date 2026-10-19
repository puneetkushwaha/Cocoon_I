const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outDir = path.join(__dirname, '..', 'public', 'social');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. ICONIC DUSSEHRA CREATIVE: The Golden Bow & Arrow made of Yarn / Stitches with festive greeting & products
async function renderIconicDussehraPost() {
  const width = 1080;
  const height = 1080;

  // Let's create an iconic, minimal brand advertisement:
  // Deep regal background (#1E1714 / warm dark espresso with warm gold glow)
  // An elegant, minimalist golden Lord Rama Bow & Arrow silhouette composed with golden crochet loops & spark
  // In the center lower half, a floating luxury cut-out of Cocoon's iconic crochet bag (from public/products/items/chocolate-bow-handbag.jpg or sunflower bag)
  
  // Let's process the bag product image so it sits with a soft circular luxury spotlight
  const bagImgPath = path.join(__dirname, '..', 'public', 'products', 'items', 'chocolate-bow-handbag.jpg');
  const bagBuffer = await sharp(bagImgPath)
    .resize(440, 440, { fit: 'cover' })
    .composite([
      // circular mask
      {
        input: Buffer.from(`<svg width="440" height="440"><circle cx="220" cy="220" r="210" fill="#000"/></svg>`),
        blend: 'dest-in'
      }
    ])
    .png()
    .toBuffer();

  const svgBase = `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Deep Rich Regal Indian Festive Background -->
      <radialGradient id="bgGrad" cx="50%" cy="40%" r="65%">
        <stop offset="0%" stop-color="#3D291F"/>
        <stop offset="50%" stop-color="#231712"/>
        <stop offset="100%" stop-color="#120C09"/>
      </radialGradient>

      <!-- Golden Shimmer Gradients -->
      <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FFF3C4"/>
        <stop offset="35%" stop-color="#E5B869"/>
        <stop offset="70%" stop-color="#C28A36"/>
        <stop offset="100%" stop-color="#FCE19B"/>
      </linearGradient>

      <linearGradient id="terracottaGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#D97A66"/>
        <stop offset="100%" stop-color="#B05442"/>
      </linearGradient>

      <radialGradient id="glowGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#F5B041" stop-opacity="0.35"/>
        <stop offset="60%" stop-color="#F5B041" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="#F5B041" stop-opacity="0"/>
      </radialGradient>

      <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>

      <filter id="shadow">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.7"/>
      </filter>
    </defs>

    <!-- Background -->
    <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>

    <!-- Subtle Golden Light Aura behind Bow & Arrow -->
    <circle cx="540" cy="380" r="320" fill="url(#glowGlow)"/>

    <!-- Arch Border / Regal Framing -->
    <rect x="44" y="44" width="992" height="992" rx="36" fill="none" stroke="url(#goldGrad)" stroke-width="1.8" stroke-opacity="0.4"/>
    <rect x="58" y="58" width="964" height="964" rx="28" fill="none" stroke="#FAF6F0" stroke-width="0.8" stroke-opacity="0.15"/>

    <!-- TOP: BRAND IDENTITY -->
    <text x="540" y="115" font-family="'Georgia', serif" font-size="34" font-weight="bold" letter-spacing="12" fill="#FAF6F0" text-anchor="middle" filter="url(#shadow)">
      C O C O O N
    </text>
    <text x="540" y="142" font-family="'Arial', sans-serif" font-size="11" font-weight="bold" letter-spacing="5" fill="url(#goldGrad)" text-anchor="middle">
      HANDCRAFTED CROCHET BOUTIQUE
    </text>

    <!-- ICONIC DUSSEHRA SYMBOL: MINIMALIST GOLDEN BOW & ARROW -->
    <!-- Bow drawn pointing upwards -->
    <g transform="translate(540, 310)" filter="url(#glowFilter)">
      <!-- The Golden Bow Arc -->
      <path d="M -160,50 Q 0,-60 160,50" fill="none" stroke="url(#goldGrad)" stroke-width="4.5" stroke-linecap="round"/>
      <!-- The Bow String -->
      <line x1="-160" y1="50" x2="160" y2="50" stroke="#FAF6F0" stroke-width="1.5" stroke-dasharray="4,4" stroke-opacity="0.8"/>
      
      <!-- The Golden Arrow aiming upwards into the light -->
      <line x1="0" y1="90" x2="0" y2="-100" stroke="url(#goldGrad)" stroke-width="3" stroke-linecap="round"/>
      <!-- Arrow Head -->
      <polygon points="0,-120 -15,-90 0,-98 15,-90" fill="url(#goldGrad)"/>
      <!-- Arrow Feathers / Nock -->
      <line x1="-12" y1="85" x2="0" y2="70" stroke="url(#goldGrad)" stroke-width="2"/>
      <line x1="12" y1="85" x2="0" y2="70" stroke="url(#goldGrad)" stroke-width="2"/>

      <!-- Festive Spark / Triumph Sun at the Arrow Tip -->
      <circle cx="0" cy="-120" r="5" fill="#FFFFFF"/>
      <circle cx="0" cy="-120" r="14" fill="url(#goldGrad)" fill-opacity="0.5"/>
    </g>

    <!-- Product Circular Spotlight Ring (Product inserted at cx=540, cy=580) -->
    <circle cx="540" cy="580" r="226" fill="none" stroke="url(#goldGrad)" stroke-width="2" stroke-opacity="0.6"/>
    <circle cx="540" cy="580" r="220" fill="#2A1B14" filter="url(#shadow)"/>

    <!-- Festive Label Tag overlapping the product circle -->
    <g transform="translate(540, 785)">
      <rect x="-140" y="-18" width="280" height="36" rx="18" fill="url(#terracottaGrad)" stroke="url(#goldGrad)" stroke-width="1.5" filter="url(#shadow)"/>
      <text x="0" y="5" font-family="'Arial', sans-serif" font-size="11" font-weight="bold" letter-spacing="3" fill="#FFFFFF" text-anchor="middle">
        100% ORGANIC MILK COTTON
      </text>
    </g>

    <!-- MAIN TYPOGRAPHY: DUSSEHRA GREETING -->
    <text x="540" y="855" font-family="'Georgia', serif" font-size="22" font-style="italic" fill="url(#goldGrad)" text-anchor="middle">
      Triumph of Grace, Purity &amp; Mindful Craft
    </text>
    <text x="540" y="915" font-family="'Georgia', serif" font-size="54" font-weight="bold" letter-spacing="4" fill="#FAF6F0" text-anchor="middle" filter="url(#shadow)">
      HAPPY DUSSEHRA
    </text>

    <!-- OFFER PILL / PROMO -->
    <g transform="translate(540, 965)">
      <rect x="-230" y="-20" width="460" height="40" rx="20" fill="#FAF6F0" filter="url(#shadow)"/>
      <text x="0" y="6" font-family="'Arial', sans-serif" font-size="13" font-weight="bold" letter-spacing="2" fill="#1E1714" text-anchor="middle">
        FESTIVE OFFER: FLAT 10% OFF  •  CODE: DUSSEHRA10
      </text>
    </g>

    <!-- FOOTER BAR -->
    <line x1="120" y1="1005" x2="960" y2="1005" stroke="#D4AF37" stroke-width="1" stroke-opacity="0.25"/>
    <text x="540" y="1030" font-family="'Arial', sans-serif" font-size="12" font-weight="bold" letter-spacing="3" fill="#FAF6F0" fill-opacity="0.8" text-anchor="middle">
      WWW.GOCOCOON.STORE  •  @COCOON._.U  •  COD ALL-INDIA
    </text>
  </svg>
  `;

  await sharp(Buffer.from(svgBase))
    .composite([
      {
        input: bagBuffer,
        top: 580 - 220,
        left: 540 - 220,
      }
    ])
    .jpeg({ quality: 96 })
    .toFile(path.join(outDir, 'dussehra_post.jpg'));

  console.log('Iconic Dussehra post created!');
}

// 2. ICONIC VIJAYADASHAMI / DASHAMI POST: Sacred Bow, Ravan Dahan / Triumph & Handcrafted Waist Wrap & Belts
async function renderIconicDashamiPost() {
  const width = 1080;
  const height = 1080;

  // Let's feature the floral vine waist belt (real bestseller product)
  const beltImgPath = path.join(__dirname, '..', 'public', 'products', 'items', 'floral-vine-waist-belt.jpg');
  const beltBuffer = await sharp(beltImgPath)
    .resize(440, 440, { fit: 'cover' })
    .composite([
      {
        input: Buffer.from(`<svg width="440" height="440"><circle cx="220" cy="220" r="210" fill="#000"/></svg>`),
        blend: 'dest-in'
      }
    ])
    .png()
    .toBuffer();

  const svgBase = `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="dashamiBg" cx="50%" cy="42%" r="65%">
        <stop offset="0%" stop-color="#2D1914"/>
        <stop offset="60%" stop-color="#1B0F0C"/>
        <stop offset="100%" stop-color="#0E0705"/>
      </radialGradient>

      <linearGradient id="royalGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FFEAA7"/>
        <stop offset="40%" stop-color="#DFB15B"/>
        <stop offset="80%" stop-color="#B8860B"/>
        <stop offset="100%" stop-color="#F9E79F"/>
      </linearGradient>

      <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#E67E22" stop-opacity="0.38"/>
        <stop offset="65%" stop-color="#D35400" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>

      <filter id="shadow">
        <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000000" flood-opacity="0.6"/>
      </filter>
    </defs>

    <rect width="${width}" height="${height}" fill="url(#dashamiBg)"/>
    <circle cx="540" cy="380" r="330" fill="url(#sunGlow)"/>

    <!-- Royal Border Frame -->
    <rect x="44" y="44" width="992" height="992" rx="36" fill="none" stroke="url(#royalGold)" stroke-width="1.8" stroke-opacity="0.45"/>
    <rect x="58" y="58" width="964" height="964" rx="28" fill="none" stroke="#FAF6F0" stroke-width="0.8" stroke-opacity="0.15"/>

    <!-- TOP SECTION -->
    <text x="540" y="115" font-family="'Georgia', serif" font-size="34" font-weight="bold" letter-spacing="12" fill="#FAF6F0" text-anchor="middle" filter="url(#shadow)">
      C O C O O N
    </text>
    <text x="540" y="142" font-family="'Arial', sans-serif" font-size="11" font-weight="bold" letter-spacing="5" fill="url(#royalGold)" text-anchor="middle">
      BESPOKE HEIRLOOM ATELIER
    </text>

    <!-- AURA & AUSPICIOUS SYMBOLS -->
    <!-- Elegant Stylized Glowing Bow-Arrow Vector Motif -->
    <g transform="translate(540, 275)" filter="url(#shadow)">
      <!-- Golden Bow -->
      <path d="M -150,40 Q 0,-50 150,40" fill="none" stroke="url(#royalGold)" stroke-width="4" stroke-linecap="round"/>
      <line x1="-150" y1="40" x2="150" y2="40" stroke="#FAF6F0" stroke-width="1.5" stroke-dasharray="4,4" stroke-opacity="0.75"/>
      <!-- Glowing Sacred Arrow -->
      <line x1="0" y1="75" x2="0" y2="-90" stroke="url(#royalGold)" stroke-width="3" stroke-linecap="round"/>
      <polygon points="0,-110 -14,-85 0,-92 14,-85" fill="url(#royalGold)"/>
      <circle cx="0" cy="-110" r="4" fill="#FFFFFF"/>
    </g>

    <!-- Product Circular Spotlight Ring (Waist Belt) -->
    <circle cx="540" cy="565" r="226" fill="none" stroke="url(#royalGold)" stroke-width="2" stroke-opacity="0.6"/>
    <circle cx="540" cy="565" r="220" fill="#241410" filter="url(#shadow)"/>

    <!-- Pill Tag -->
    <g transform="translate(540, 770)">
      <rect x="-150" y="-18" width="300" height="36" rx="18" fill="#B05442" stroke="url(#royalGold)" stroke-width="1.5" filter="url(#shadow)"/>
      <text x="0" y="5" font-family="'Arial', sans-serif" font-size="11" font-weight="bold" letter-spacing="3" fill="#FFFFFF" text-anchor="middle">
        SHUBH AARAMBH • BESPOKE EDITS
      </text>
    </g>

    <!-- TYPOGRAPHY -->
    <text x="540" y="840" font-family="'Georgia', serif" font-size="20" font-style="italic" fill="url(#royalGold)" text-anchor="middle">
      An Auspicious Knot. A Sacred Beginning.
    </text>
    <text x="540" y="900" font-family="'Georgia', serif" font-size="52" font-weight="bold" letter-spacing="3" fill="#FAF6F0" text-anchor="middle" filter="url(#shadow)">
      SHUBH VIJAYADASHAMI
    </text>

    <!-- CTA BUTTON -->
    <g transform="translate(540, 955)">
      <rect x="-240" y="-22" width="480" height="44" rx="22" fill="url(#royalGold)" filter="url(#shadow)"/>
      <text x="0" y="6" font-family="'Arial', sans-serif" font-size="13" font-weight="bold" letter-spacing="2" fill="#1B0F0C" text-anchor="middle">
        CUSTOM COMMISSIONS OPEN ON WHATSAPP
      </text>
    </g>

    <!-- FOOTER -->
    <line x1="120" y1="1000" x2="960" y2="1000" stroke="#DFB15B" stroke-width="1" stroke-opacity="0.25"/>
    <text x="540" y="1028" font-family="'Arial', sans-serif" font-size="12" font-weight="bold" letter-spacing="3" fill="#FAF6F0" fill-opacity="0.8" text-anchor="middle">
      WWW.GOCOCOON.STORE  •  +91 8171902255  •  @COCOON._.U
    </text>
  </svg>
  `;

  await sharp(Buffer.from(svgBase))
    .composite([
      {
        input: beltBuffer,
        top: 565 - 220,
        left: 540 - 220,
      }
    ])
    .jpeg({ quality: 96 })
    .toFile(path.join(outDir, 'dashami_post.jpg'));

  console.log('Iconic Dashami post created!');
}

// 3. ICONIC WEBSITE LAUNCH POST: Multiple Hero Products (Bag + Bandana + Scrunchie) + Festive Launch
async function renderIconicLaunchPost() {
  const width = 1080;
  const height = 1080;

  // Let's create an editorial multi-product showcase card
  // Product 1: sunflower bag / chocolate bag
  const bagImgPath = path.join(__dirname, '..', 'public', 'products', 'items', 'sunflower-baguette-shoulder-bag.jpg');
  const bagBuf = await sharp(bagImgPath)
    .resize(320, 320, { fit: 'cover' })
    .composite([{ input: Buffer.from(`<svg width="320" height="320"><rect width="320" height="320" rx="28" fill="#000"/></svg>`), blend: 'dest-in' }])
    .png().toBuffer();

  // Product 2: bandana
  const bandanaPath = path.join(__dirname, '..', 'public', 'products', 'items', 'burgundy-triangle-bandana.jpg');
  const bandanaBuf = await sharp(bandanaPath)
    .resize(240, 240, { fit: 'cover' })
    .composite([{ input: Buffer.from(`<svg width="240" height="240"><rect width="240" height="240" rx="24" fill="#000"/></svg>`), blend: 'dest-in' }])
    .png().toBuffer();

  // Product 3: Rose scrunchie / bow
  const bowPath = path.join(__dirname, '..', 'public', 'products', 'items', 'candy-festive-crochet-scrunchie.jpg');
  const bowBuf = await sharp(bowPath)
    .resize(240, 240, { fit: 'cover' })
    .composite([{ input: Buffer.from(`<svg width="240" height="240"><rect width="240" height="240" rx="24" fill="#000"/></svg>`), blend: 'dest-in' }])
    .png().toBuffer();

  const svgBase = `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="launchBg" cx="50%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#261A15"/>
        <stop offset="60%" stop-color="#18100D"/>
        <stop offset="100%" stop-color="#0E0806"/>
      </radialGradient>

      <linearGradient id="warmGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FFF0D0"/>
        <stop offset="50%" stop-color="#E2B767"/>
        <stop offset="100%" stop-color="#C58C34"/>
      </linearGradient>

      <filter id="shadow">
        <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000000" flood-opacity="0.6"/>
      </filter>
    </defs>

    <rect width="${width}" height="${height}" fill="url(#launchBg)"/>

    <rect x="44" y="44" width="992" height="992" rx="36" fill="none" stroke="url(#warmGold)" stroke-width="1.8" stroke-opacity="0.45"/>
    <rect x="58" y="58" width="964" height="964" rx="28" fill="none" stroke="#FAF6F0" stroke-width="0.8" stroke-opacity="0.15"/>

    <!-- TOP SECTION -->
    <g transform="translate(540, 100)">
      <rect x="-160" y="-16" width="320" height="32" rx="16" fill="#B05442" stroke="url(#warmGold)" stroke-width="1.2" filter="url(#shadow)"/>
      <text x="0" y="5" font-family="'Georgia', serif" font-size="12" font-weight="bold" letter-spacing="3" fill="#FFFFFF" text-anchor="middle">
        OFFICIAL DIGITAL BOUTIQUE
      </text>
    </g>

    <text x="540" y="180" font-family="'Georgia', serif" font-size="46" font-weight="bold" letter-spacing="10" fill="#FAF6F0" text-anchor="middle" filter="url(#shadow)">
      C O C O O N
    </text>
    <text x="540" y="210" font-family="'Arial', sans-serif" font-size="12" font-weight="bold" letter-spacing="4" fill="url(#warmGold)" text-anchor="middle">
      100% PURE ORGANIC MILK COTTON
    </text>

    <!-- PRODUCT SHOWCASE FRAMES -->
    <!-- Large Center Frame (Bag) -->
    <rect x="370" y="260" width="340" height="340" rx="34" fill="none" stroke="url(#warmGold)" stroke-width="2" filter="url(#shadow)"/>
    
    <!-- Left Frame (Bandana) -->
    <rect x="100" y="320" width="256" height="256" rx="28" fill="none" stroke="url(#warmGold)" stroke-width="1.5" stroke-opacity="0.7" filter="url(#shadow)"/>

    <!-- Right Frame (Hair Bow) -->
    <rect x="724" y="320" width="256" height="256" rx="28" fill="none" stroke="url(#warmGold)" stroke-width="1.5" stroke-opacity="0.7" filter="url(#shadow)"/>

    <!-- Product Subtitles -->
    <text x="228" y="605" font-family="'Arial', sans-serif" font-size="11" font-weight="bold" letter-spacing="2" fill="url(#warmGold)" text-anchor="middle">FLORAL BANDANAS</text>
    <text x="540" y="630" font-family="'Arial', sans-serif" font-size="13" font-weight="bold" letter-spacing="3" fill="#FFFFFF" text-anchor="middle">SIGNATURE HANDBAGS</text>
    <text x="852" y="605" font-family="'Arial', sans-serif" font-size="11" font-weight="bold" letter-spacing="2" fill="url(#warmGold)" text-anchor="middle">HAIR ACCESSORIES</text>

    <!-- BIG HEADLINE: WE ARE LIVE -->
    <text x="540" y="730" font-family="'Georgia', serif" font-size="22" font-style="italic" fill="url(#warmGold)" text-anchor="middle">
      Step Into Our World of Handcrafted Treasures
    </text>
    <text x="540" y="805" font-family="'Georgia', serif" font-size="64" font-weight="bold" letter-spacing="3" fill="#FAF6F0" text-anchor="middle" filter="url(#shadow)">
      WE ARE LIVE!
    </text>
    <text x="540" y="845" font-family="'Arial', sans-serif" font-size="14" fill="#FAF6F0" fill-opacity="0.8" text-anchor="middle">
      Pan-India Express Delivery • Verified Cash on Delivery (COD)
    </text>

    <!-- CTA BUTTON -->
    <g transform="translate(540, 915)">
      <rect x="-240" y="-24" width="480" height="48" rx="24" fill="url(#warmGold)" filter="url(#shadow)"/>
      <text x="0" y="7" font-family="'Arial', sans-serif" font-size="15" font-weight="bold" letter-spacing="2" fill="#18100D" text-anchor="middle">
        SHOP NOW AT WWW.GOCOCOON.STORE
      </text>
    </g>

    <!-- FOOTER -->
    <line x1="120" y1="980" x2="960" y2="980" stroke="#E2B767" stroke-width="1" stroke-opacity="0.25"/>
    <text x="540" y="1012" font-family="'Arial', sans-serif" font-size="12" font-weight="bold" letter-spacing="3" fill="#FAF6F0" fill-opacity="0.8" text-anchor="middle">
      DISPATCHING ACROSS INDIA  •  @COCOON._.U  •  LINK IN BIO
    </text>
  </svg>
  `;

  await sharp(Buffer.from(svgBase))
    .composite([
      // Center Bag
      { input: bagBuf, top: 270, left: 380 },
      // Left Bandana
      { input: bandanaBuf, top: 328, left: 108 },
      // Right Bow
      { input: bowBuf, top: 328, left: 732 },
    ])
    .jpeg({ quality: 96 })
    .toFile(path.join(outDir, 'website_launch_post.jpg'));

  console.log('Iconic Launch post created!');
}

async function main() {
  await renderIconicDussehraPost();
  await renderIconicDashamiPost();
  await renderIconicLaunchPost();
  console.log('All 3 iconic social posts rendered successfully!');
}

main().catch(console.error);
