const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const brainDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\1ce05368-b1da-4ddf-9d15-3c292216c178';
const outDir = path.join(__dirname, '..', 'public', 'social');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. DUSSEHRA POST (Ivory Crochet Tote + Brass Diyas + Marigold Garlands)
async function createDussehraPost() {
  const photoPath = path.join(brainDir, 'dussehra_crochet_handbag_1792431319804.jpg');
  
  const bg = await sharp(photoPath)
    .resize(1080, 1080, { fit: 'cover' })
    .modulate({ brightness: 0.95, saturation: 1.05 })
    .toBuffer();

  const svgOverlay = `
  <svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="topShadow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#151210" stop-opacity="0.9"/>
        <stop offset="50%" stop-color="#151210" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="#151210" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="bottomShadow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#151210" stop-opacity="0"/>
        <stop offset="40%" stop-color="#151210" stop-opacity="0.75"/>
        <stop offset="100%" stop-color="#151210" stop-opacity="0.95"/>
      </linearGradient>
      <filter id="shadow">
        <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000000" flood-opacity="0.5"/>
      </filter>
    </defs>

    <rect x="0" y="0" width="1080" height="260" fill="url(#topShadow)"/>
    <rect x="0" y="680" width="1080" height="400" fill="url(#bottomShadow)"/>

    <!-- Subtle Gold Foil Frame -->
    <rect x="40" y="40" width="1000" height="1000" rx="28" fill="none" stroke="#D4AF37" stroke-width="1.5" stroke-opacity="0.5"/>
    <rect x="52" y="52" width="976" height="976" rx="20" fill="none" stroke="#FAF6F0" stroke-width="1" stroke-opacity="0.2"/>

    <!-- TOP: BRAND & FESTIVE BADGE -->
    <g transform="translate(540, 95)">
      <rect x="-140" y="-16" width="280" height="32" rx="16" fill="#B06B5B" stroke="#D4AF37" stroke-width="1" filter="url(#shadow)"/>
      <text x="0" y="5" font-family="'Georgia', serif" font-size="12" font-weight="bold" letter-spacing="3" fill="#FFFFFF" text-anchor="middle">
        VIJAYADASHAMI SPECIAL
      </text>
    </g>

    <text x="540" y="170" font-family="'Georgia', serif" font-size="44" font-weight="bold" letter-spacing="8" fill="#FAF6F0" text-anchor="middle" filter="url(#shadow)">
      C O C O O N
    </text>
    <text x="540" y="202" font-family="'Arial', sans-serif" font-size="12" font-weight="bold" letter-spacing="4" fill="#D4AF37" text-anchor="middle">
      100% ORGANIC MILK COTTON CROCHET
    </text>

    <!-- BOTTOM: HEADLINE, OFFER & CTA -->
    <text x="540" y="750" font-family="'Georgia', serif" font-size="20" font-style="italic" fill="#D4AF37" text-anchor="middle" filter="url(#shadow)">
      Celebrate The Triumph Of Mindful Craft
    </text>
    <text x="540" y="810" font-family="'Georgia', serif" font-size="52" font-weight="bold" letter-spacing="1" fill="#FFFFFF" text-anchor="middle" filter="url(#shadow)">
      HAPPY DUSSEHRA
    </text>
    <text x="540" y="845" font-family="'Arial', sans-serif" font-size="14" fill="#FAF6F0" fill-opacity="0.85" text-anchor="middle">
      Handcrafted Knot-by-Knot in India • Pure Heirloom Bags &amp; Totes
    </text>

    <!-- DISCOUNT PILL BUTTON -->
    <g transform="translate(540, 910)">
      <rect x="-240" y="-22" width="480" height="44" rx="22" fill="#FAF6F0" filter="url(#shadow)"/>
      <text x="0" y="6" font-family="'Arial', sans-serif" font-size="14" font-weight="bold" letter-spacing="2" fill="#2C2623" text-anchor="middle">
        USE CODE: FESTIVE10 FOR 10% OFF
      </text>
    </g>

    <line x1="120" y1="965" x2="960" y2="965" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.2"/>
    <text x="540" y="1000" font-family="'Arial', sans-serif" font-size="13" font-weight="bold" letter-spacing="2" fill="#FAF6F0" fill-opacity="0.85" text-anchor="middle">
      WWW.GOCOCOON.STORE  •  @COCOON._.U  •  COD AVAILABLE
    </text>
  </svg>
  `;

  await sharp(bg)
    .composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }])
    .jpeg({ quality: 96 })
    .toFile(path.join(outDir, 'dussehra_post.jpg'));

  console.log('Dussehra post created successfully!');
}

// 2. DASHAMI POST (Crochet Floral Waist Belt & Rose Pin + Brass Diya & Saree)
async function createDashamiPost() {
  const photoPath = path.join(brainDir, 'cocoon_shubh_aarambh_accessories_1792431235623.jpg');

  const bg = await sharp(photoPath)
    .resize(1080, 1080, { fit: 'cover' })
    .modulate({ brightness: 0.95, saturation: 1.05 })
    .toBuffer();

  const svgOverlay = `
  <svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="topGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1A1512" stop-opacity="0.88"/>
        <stop offset="55%" stop-color="#1A1512" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#1A1512" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="bottomGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1A1512" stop-opacity="0"/>
        <stop offset="40%" stop-color="#1A1512" stop-opacity="0.75"/>
        <stop offset="100%" stop-color="#1A1512" stop-opacity="0.95"/>
      </linearGradient>
      <filter id="shadowDark">
        <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000000" flood-opacity="0.5"/>
      </filter>
    </defs>

    <rect x="0" y="0" width="1080" height="250" fill="url(#topGrad)"/>
    <rect x="0" y="680" width="1080" height="400" fill="url(#bottomGrad)"/>

    <rect x="40" y="40" width="1000" height="1000" rx="28" fill="none" stroke="#D4AF37" stroke-width="1.5" stroke-opacity="0.45"/>
    <rect x="52" y="52" width="976" height="976" rx="20" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.15"/>

    <!-- TOP SECTION -->
    <g transform="translate(540, 95)">
      <rect x="-130" y="-16" width="260" height="32" rx="16" fill="#B06B5B" stroke="#D4AF37" stroke-width="1" filter="url(#shadowDark)"/>
      <text x="0" y="5" font-family="'Georgia', serif" font-size="12" font-weight="bold" letter-spacing="3" fill="#FAF6F0" text-anchor="middle">
        SHUBH AARAMBH
      </text>
    </g>

    <text x="540" y="170" font-family="'Georgia', serif" font-size="44" font-weight="bold" letter-spacing="8" fill="#FAF6F0" text-anchor="middle" filter="url(#shadowDark)">
      C O C O O N
    </text>
    <text x="540" y="200" font-family="'Arial', sans-serif" font-size="12" font-weight="bold" letter-spacing="4" fill="#D4AF37" text-anchor="middle">
      FESTIVE BELTS • HAIR ACCENTS • BESPOKE ATELIER
    </text>

    <!-- BOTTOM SECTION -->
    <text x="540" y="750" font-family="'Georgia', serif" font-size="20" font-style="italic" fill="#D4AF37" text-anchor="middle" filter="url(#shadowDark)">
      An Auspicious Knot. A Sacred Beginning.
    </text>
    <text x="540" y="810" font-family="'Georgia', serif" font-size="52" font-weight="bold" letter-spacing="1" fill="#FFFFFF" text-anchor="middle" filter="url(#shadowDark)">
      SHUBH VIJAYADASHAMI
    </text>
    <text x="540" y="845" font-family="'Arial', sans-serif" font-size="14" fill="#FAF6F0" fill-opacity="0.85" text-anchor="middle">
      Handcrafted Floral Waist Wraps &amp; Bridal Crochet Heirlooms
    </text>

    <!-- CTA BUTTON -->
    <g transform="translate(540, 910)">
      <rect x="-220" y="-22" width="440" height="44" rx="22" fill="#B06B5B" stroke="#ECCEC7" stroke-width="1" filter="url(#shadowDark)"/>
      <text x="0" y="6" font-family="'Arial', sans-serif" font-size="13" font-weight="bold" letter-spacing="2" fill="#FFFFFF" text-anchor="middle">
        CUSTOM ORDERS OPEN ON WHATSAPP
      </text>
    </g>

    <line x1="120" y1="965" x2="960" y2="965" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.2"/>
    <text x="540" y="1000" font-family="'Arial', sans-serif" font-size="13" font-weight="bold" letter-spacing="2" fill="#FAF6F0" fill-opacity="0.85" text-anchor="middle">
      WWW.GOCOCOON.STORE  •  +91 8171902255  •  @COCOON._.U
    </text>
  </svg>
  `;

  await sharp(bg)
    .composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }])
    .jpeg({ quality: 96 })
    .toFile(path.join(outDir, 'dashami_post.jpg'));

  console.log('Dashami post created successfully!');
}

// 3. WEBSITE LAUNCH POST (Festive Collection Lineup + Fairy Lights & Marigolds)
async function createWebsiteLaunchPost() {
  const photoPath = path.join(brainDir, 'cocoon_festive_collection_launch_1792431255051.jpg');

  const bg = await sharp(photoPath)
    .resize(1080, 1080, { fit: 'cover' })
    .modulate({ brightness: 0.95, saturation: 1.05 })
    .toBuffer();

  const svgOverlay = `
  <svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="launchTop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#181412" stop-opacity="0.9"/>
        <stop offset="55%" stop-color="#181412" stop-opacity="0.55"/>
        <stop offset="100%" stop-color="#181412" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="launchBottom" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#181412" stop-opacity="0"/>
        <stop offset="35%" stop-color="#181412" stop-opacity="0.75"/>
        <stop offset="100%" stop-color="#181412" stop-opacity="0.95"/>
      </linearGradient>
      <filter id="shadowLaunch">
        <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000000" flood-opacity="0.5"/>
      </filter>
    </defs>

    <rect x="0" y="0" width="1080" height="260" fill="url(#launchTop)"/>
    <rect x="0" y="680" width="1080" height="400" fill="url(#launchBottom)"/>

    <rect x="40" y="40" width="1000" height="1000" rx="28" fill="none" stroke="#D4AF37" stroke-width="1.5" stroke-opacity="0.45"/>
    <rect x="52" y="52" width="976" height="976" rx="20" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.15"/>

    <!-- TOP SECTION -->
    <g transform="translate(540, 95)">
      <rect x="-160" y="-16" width="320" height="32" rx="16" fill="#FAF0ED" stroke="#ECCEC7" stroke-width="1" filter="url(#shadowLaunch)"/>
      <text x="0" y="5" font-family="'Georgia', serif" font-size="12" font-weight="bold" letter-spacing="3" fill="#B06B5B" text-anchor="middle">
        OFFICIAL BOUTIQUE LAUNCH
      </text>
    </g>

    <text x="540" y="170" font-family="'Georgia', serif" font-size="44" font-weight="bold" letter-spacing="8" fill="#FAF6F0" text-anchor="middle" filter="url(#shadowLaunch)">
      C O C O O N
    </text>
    <text x="540" y="200" font-family="'Arial', sans-serif" font-size="12" font-weight="bold" letter-spacing="4" fill="#D4AF37" text-anchor="middle">
      100% ORGANIC MILK COTTON KNITWEAR
    </text>

    <!-- BOTTOM HERO ANNOUNCEMENT -->
    <text x="540" y="745" font-family="'Georgia', serif" font-size="20" font-style="italic" fill="#D4AF37" text-anchor="middle" filter="url(#shadowLaunch)">
      Our Festive Drops Are Now Live Online
    </text>
    <text x="540" y="805" font-family="'Georgia', serif" font-size="56" font-weight="bold" letter-spacing="2" fill="#FFFFFF" text-anchor="middle" filter="url(#shadowLaunch)">
      WE ARE LIVE!
    </text>
    <text x="540" y="842" font-family="'Arial', sans-serif" font-size="14" fill="#FAF6F0" fill-opacity="0.85" text-anchor="middle">
      Handbags • Floral Bandanas • Bow Scrunchies • Waist Belts
    </text>

    <!-- BIG CTA BUTTON -->
    <g transform="translate(540, 908)">
      <rect x="-240" y="-23" width="480" height="46" rx="23" fill="#FAF6F0" filter="url(#shadowLaunch)"/>
      <text x="0" y="6" font-family="'Arial', sans-serif" font-size="15" font-weight="bold" letter-spacing="2" fill="#2C2623" text-anchor="middle">
        SHOP AT WWW.GOCOCOON.STORE
      </text>
    </g>

    <line x1="120" y1="965" x2="960" y2="965" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.2"/>
    <text x="540" y="1000" font-family="'Arial', sans-serif" font-size="12" font-weight="bold" letter-spacing="2" fill="#FAF6F0" fill-opacity="0.85" text-anchor="middle">
      ALL-INDIA EXPRESS DELIVERY  •  CASH ON DELIVERY  •  LINK IN BIO
    </text>
  </svg>
  `;

  await sharp(bg)
    .composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }])
    .jpeg({ quality: 96 })
    .toFile(path.join(outDir, 'website_launch_post.jpg'));

  console.log('Website launch post created successfully!');
}

async function main() {
  await createDussehraPost();
  await createDashamiPost();
  await createWebsiteLaunchPost();
  console.log('All 3 updated festive product posts generated successfully!');
}

main().catch(console.error);
