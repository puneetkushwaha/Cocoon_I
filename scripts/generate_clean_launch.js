const path = require('path');
const sharp = require('sharp');

const brainDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\1ce05368-b1da-4ddf-9d15-3c292216c178';
const outDir = path.join(__dirname, '..', 'public', 'social');

async function buildWebsiteLaunchCleanLight() {
  const photoPath = path.join(brainDir, 'boutique_launch_seamless_ivory_1792432281366.jpg');

  // Crop & resize to 1080x1080 focusing on the mockup & bag on the right, keeping left open
  const bg = await sharp(photoPath)
    .resize(1080, 1080, { fit: 'cover', position: 'right' })
    .toBuffer();

  // Overlay design: Clean luxury editorial style
  // Top Left: COCOON Logo & Badge
  // Large editorial Headline: "WE ARE LIVE"
  // Clean description of the boutique
  // Minimal pill button: "EXPLORE COLLECTION"
  // Bottom: www.gococoon.store • Free Shipping Over ₹999
  const svgOverlay = `
  <svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Soft gradient on the left so typography is razor-sharp while background stays ivory -->
      <linearGradient id="leftFade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#F7F2E9" stop-opacity="0.95"/>
        <stop offset="50%" stop-color="#F7F2E9" stop-opacity="0.85"/>
        <stop offset="80%" stop-color="#F7F2E9" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#F7F2E9" stop-opacity="0"/>
      </linearGradient>

      <linearGradient id="terracotta" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#B05442"/>
        <stop offset="100%" stop-color="#913B2A"/>
      </linearGradient>

      <filter id="subtleShadow">
        <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000000" flood-opacity="0.08"/>
      </filter>
    </defs>

    <!-- Left side subtle ivory wash -->
    <rect x="0" y="0" width="680" height="1080" fill="url(#leftFade)"/>

    <!-- Outer Minimal Luxury Border -->
    <rect x="40" y="40" width="1000" height="1000" rx="24" fill="none" stroke="#2C2623" stroke-width="1.2" stroke-opacity="0.2"/>

    <!-- TOP LEFT: BRAND IDENTITY -->
    <g transform="translate(100, 110)">
      <rect x="0" y="0" width="230" height="30" rx="15" fill="#FAF0ED" stroke="#ECCEC7" stroke-width="1"/>
      <text x="115" y="19" font-family="'Arial', sans-serif" font-size="10" font-weight="bold" letter-spacing="2" fill="#B05442" text-anchor="middle">
        OFFICIAL LAUNCH
      </text>

      <text x="0" y="70" font-family="'Georgia', serif" font-size="38" font-weight="bold" letter-spacing="8" fill="#2C2623">
        COCOON
      </text>
      <text x="0" y="94" font-family="'Arial', sans-serif" font-size="11" font-weight="bold" letter-spacing="4" fill="#8B5E3C">
        100% ORGANIC MILK COTTON
      </text>
    </g>

    <!-- CENTER LEFT: ANNOUNCEMENT HEADLINE -->
    <g transform="translate(100, 340)">
      <text x="0" y="0" font-family="'Arial', sans-serif" font-size="14" font-weight="bold" letter-spacing="6" fill="#8B5E3C">
        OUR DIGITAL ATELIER
      </text>
      
      <text x="0" y="75" font-family="'Georgia', serif" font-size="76" font-weight="bold" letter-spacing="2" fill="#2C2623">
        We Are
      </text>
      <text x="0" y="150" font-family="'Georgia', serif" font-size="76" font-style="italic" font-weight="bold" fill="url(#terracotta)">
        Live!
      </text>
    </g>

    <!-- DESCRIPTION BLOCK -->
    <g transform="translate(100, 560)">
      <text x="0" y="0" font-family="'Georgia', serif" font-size="19" fill="#2C2623" font-weight="500">
        Discover slow-crafted crochet treasures,
      </text>
      <text x="0" y="28" font-family="'Georgia', serif" font-size="19" fill="#2C2623" font-weight="500">
        statement handbags &amp; heirloom accessories
      </text>
      <text x="0" y="56" font-family="'Georgia', serif" font-size="19" fill="#2C2623" font-weight="500">
        woven knot-by-knot in India.
      </text>
    </g>

    <!-- DIVIDER -->
    <line x1="100" y1="670" x2="340" y2="670" stroke="#B05442" stroke-width="1.8" stroke-opacity="0.8"/>

    <!-- TRUST BADGES -->
    <g transform="translate(100, 720)">
      <text x="0" y="0" font-family="'Arial', sans-serif" font-size="13" font-weight="bold" fill="#2C2623" letter-spacing="1">
        • All-India Express Delivery
      </text>
      <text x="0" y="28" font-family="'Arial', sans-serif" font-size="13" font-weight="bold" fill="#2C2623" letter-spacing="1">
        • Cash on Delivery Available
      </text>
      <text x="0" y="56" font-family="'Arial', sans-serif" font-size="13" font-weight="bold" fill="#2C2623" letter-spacing="1">
        • Custom Bespoke Commissions
      </text>
    </g>

    <!-- CTA BUTTON -->
    <g transform="translate(100, 840)">
      <rect x="0" y="0" width="320" height="52" rx="26" fill="#2C2623" filter="url(#subtleShadow)"/>
      <text x="160" y="32" font-family="'Arial', sans-serif" font-size="13" font-weight="bold" letter-spacing="2" fill="#FFFFFF" text-anchor="middle">
        SHOP AT GOCOCOON.STORE
      </text>
    </g>

    <!-- FOOTER URL -->
    <text x="100" y="990" font-family="'Arial', sans-serif" font-size="15" font-weight="bold" letter-spacing="2" fill="#B05442">
      www.gococoon.store
    </text>
    <text x="980" y="990" font-family="'Arial', sans-serif" font-size="12" font-weight="bold" letter-spacing="2" fill="#8B5E3C" text-anchor="end">
      @COCOON._.U
    </text>
  </svg>
  `;

  await sharp(bg)
    .composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }])
    .jpeg({ quality: 96 })
    .toFile(path.join(outDir, 'website_launch_post.jpg'));

  console.log('Clean light Website Launch post created!');
}

buildWebsiteLaunchCleanLight().catch(console.error);
