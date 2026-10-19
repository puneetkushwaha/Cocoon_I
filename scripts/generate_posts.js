const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const brainDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\1ce05368-b1da-4ddf-9d15-3c292216c178';
const outDir = path.join(__dirname, '..', 'public', 'social');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function createDussehraPost() {
  const photoPath = path.join(brainDir, 'cocoon_dussehra_post_1792430696706.jpg');
  
  // Prepare background image (1080x1080 with soft darkened vignette so text pops)
  const bg = await sharp(photoPath)
    .resize(1080, 1080, { fit: 'cover' })
    .modulate({ brightness: 0.95, saturation: 1.05 })
    .toBuffer();

  // Create graphic overlay with luxury branding, festive greetings, discount code & footer
  const svgOverlay = `
  <svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Gradient for top and bottom readability -->
      <linearGradient id="topShadow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FAF6F0" stop-opacity="0.95"/>
        <stop offset="60%" stop-color="#FAF6F0" stop-opacity="0.7"/>
        <stop offset="100%" stop-color="#FAF6F0" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="bottomShadow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FAF6F0" stop-opacity="0"/>
        <stop offset="40%" stop-color="#FAF6F0" stop-opacity="0.85"/>
        <stop offset="100%" stop-color="#FAF6F0" stop-opacity="0.98"/>
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#2C2623" flood-opacity="0.12"/>
      </filter>
    </defs>

    <!-- Top & bottom gradient overlays to ensure text contrast while keeping photo visible -->
    <rect x="0" y="0" width="1080" height="280" fill="url(#topShadow)"/>
    <rect x="0" y="700" width="1080" height="380" fill="url(#bottomShadow)"/>

    <!-- Subtle luxury outer border frame -->
    <rect x="40" y="40" width="1000" height="1000" rx="32" fill="none" stroke="#2C2623" stroke-width="2" stroke-opacity="0.25"/>
    <rect x="52" y="52" width="976" height="976" rx="24" fill="none" stroke="#B06B5B" stroke-width="1" stroke-opacity="0.35"/>

    <!-- TOP SECTION: BRAND & FESTIVE BADGE -->
    <!-- Pill Badge -->
    <g transform="translate(540, 95)">
      <rect x="-140" y="-18" width="280" height="36" rx="18" fill="#FAF0ED" stroke="#ECCEC7" stroke-width="1.5" filter="url(#shadow)"/>
      <text x="0" y="5" font-family="'Georgia', serif" font-size="13" font-weight="bold" letter-spacing="3" fill="#B06B5B" text-anchor="middle">
        VIJAYADASHAMI SPECIAL
      </text>
    </g>

    <!-- Brand Name -->
    <text x="540" y="180" font-family="'Georgia', 'Times New Roman', serif" font-size="44" font-weight="bold" letter-spacing="8" fill="#2C2623" text-anchor="middle">
      C O C O O N
    </text>
    <text x="540" y="212" font-family="'Arial', sans-serif" font-size="12" font-weight="bold" letter-spacing="4" fill="#8B5E3C" text-anchor="middle">
      HANDCRAFTED CROCHET BOUTIQUE
    </text>

    <!-- BOTTOM SECTION: HEADLINE, OFFER & CTA -->
    <!-- Festive Headline -->
    <text x="540" y="775" font-family="'Georgia', serif" font-size="20" font-style="italic" fill="#8B5E3C" text-anchor="middle">
      Celebrate The Triumph Of Pure Craft
    </text>
    <text x="540" y="830" font-family="'Georgia', serif" font-size="52" font-weight="bold" letter-spacing="1" fill="#2C2623" text-anchor="middle">
      HAPPY DUSSEHRA
    </text>
    <text x="540" y="865" font-family="'Arial', sans-serif" font-size="14" font-weight="bold" letter-spacing="1" fill="#2C2623" fill-opacity="0.75" text-anchor="middle">
      100% Pure Organic Milk Cotton • Handcrafted Knot-by-Knot in India
    </text>

    <!-- Festive Discount Tag Box -->
    <g transform="translate(540, 925)">
      <rect x="-240" y="-22" width="480" height="44" rx="22" fill="#2C2623" filter="url(#shadow)"/>
      <text x="0" y="6" font-family="'Arial', sans-serif" font-size="14" font-weight="bold" letter-spacing="2" fill="#FFFFFF" text-anchor="middle">
        USE CODE: FESTIVE10 FOR 10% OFF
      </text>
    </g>

    <!-- Footer Bar -->
    <line x1="120" y1="975" x2="960" y2="975" stroke="#2C2623" stroke-width="1" stroke-opacity="0.15"/>
    <text x="540" y="1005" font-family="'Arial', sans-serif" font-size="13" font-weight="bold" letter-spacing="2" fill="#2C2623" fill-opacity="0.8" text-anchor="middle">
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

async function createDashamiPost() {
  const photoPath = path.join(brainDir, 'cocoon_vijayadashami_post_1792430716725.jpg');

  // Prepare dark luxury mood (1080x1080)
  const bg = await sharp(photoPath)
    .resize(1080, 1080, { fit: 'cover' })
    .modulate({ brightness: 0.88, saturation: 1.1 })
    .toBuffer();

  const svgOverlay = `
  <svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="darkTop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1A1715" stop-opacity="0.92"/>
        <stop offset="60%" stop-color="#1A1715" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="#1A1715" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="darkBottom" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1A1715" stop-opacity="0"/>
        <stop offset="35%" stop-color="#1A1715" stop-opacity="0.75"/>
        <stop offset="100%" stop-color="#1A1715" stop-opacity="0.95"/>
      </linearGradient>
      <filter id="goldShadow">
        <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000000" flood-opacity="0.4"/>
      </filter>
    </defs>

    <rect x="0" y="0" width="1080" height="260" fill="url(#darkTop)"/>
    <rect x="0" y="680" width="1080" height="400" fill="url(#darkBottom)"/>

    <!-- Subtle Gold Foil Border -->
    <rect x="42" y="42" width="996" height="996" rx="28" fill="none" stroke="#D4AF37" stroke-width="1.5" stroke-opacity="0.45"/>
    <rect x="54" y="54" width="972" height="972" rx="20" fill="none" stroke="#FAF6F0" stroke-width="1" stroke-opacity="0.15"/>

    <!-- TOP SECTION -->
    <g transform="translate(540, 95)">
      <rect x="-130" y="-16" width="260" height="32" rx="16" fill="#B06B5B" stroke="#ECCEC7" stroke-width="1" filter="url(#goldShadow)"/>
      <text x="0" y="5" font-family="'Georgia', serif" font-size="12" font-weight="bold" letter-spacing="3" fill="#FAF6F0" text-anchor="middle">
        SHUBH AARAMBH
      </text>
    </g>

    <text x="540" y="175" font-family="'Georgia', serif" font-size="42" font-weight="bold" letter-spacing="8" fill="#FAF6F0" text-anchor="middle">
      C O C O O N
    </text>
    <text x="540" y="205" font-family="'Arial', sans-serif" font-size="12" font-weight="bold" letter-spacing="4" fill="#D4AF37" text-anchor="middle">
      THE HEIRLOOM KNITWEAR ATELIER
    </text>

    <!-- BOTTOM SECTION -->
    <text x="540" y="760" font-family="'Georgia', serif" font-size="20" font-style="italic" fill="#D4AF37" text-anchor="middle">
      An Auspicious Knot. A Sacred Beginning.
    </text>
    <text x="540" y="820" font-family="'Georgia', serif" font-size="52" font-weight="bold" letter-spacing="1" fill="#FAF6F0" text-anchor="middle">
      SHUBH VIJAYADASHAMI
    </text>
    <text x="540" y="855" font-family="'Arial', sans-serif" font-size="14" fill="#FAF6F0" fill-opacity="0.8" text-anchor="middle">
      Bespoke Bridal, Festive Belts &amp; Statement Handbags
    </text>

    <!-- CTA Button -->
    <g transform="translate(540, 915)">
      <rect x="-210" y="-22" width="420" height="44" rx="22" fill="#B06B5B" stroke="#ECCEC7" stroke-width="1" filter="url(#goldShadow)"/>
      <text x="0" y="6" font-family="'Arial', sans-serif" font-size="13" font-weight="bold" letter-spacing="2" fill="#FFFFFF" text-anchor="middle">
        CUSTOM ORDERS OPEN ON WHATSAPP
      </text>
    </g>

    <line x1="120" y1="970" x2="960" y2="970" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.2"/>
    <text x="540" y="1005" font-family="'Arial', sans-serif" font-size="13" font-weight="bold" letter-spacing="2" fill="#FAF6F0" fill-opacity="0.8" text-anchor="middle">
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

async function createWebsiteLaunchPost() {
  const photoPath = path.join(brainDir, 'cocoon_website_launch_post_1792430736406.jpg');

  const bg = await sharp(photoPath)
    .resize(1080, 1080, { fit: 'cover' })
    .modulate({ brightness: 0.94, saturation: 1.05 })
    .toBuffer();

  const svgOverlay = `
  <svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="launchTop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FAF6F0" stop-opacity="0.96"/>
        <stop offset="50%" stop-color="#FAF6F0" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#FAF6F0" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="launchBottom" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FAF6F0" stop-opacity="0"/>
        <stop offset="30%" stop-color="#FAF6F0" stop-opacity="0.88"/>
        <stop offset="100%" stop-color="#FAF6F0" stop-opacity="0.98"/>
      </linearGradient>
      <filter id="softShadow">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#2C2623" flood-opacity="0.14"/>
      </filter>
    </defs>

    <rect x="0" y="0" width="1080" height="290" fill="url(#launchTop)"/>
    <rect x="0" y="680" width="1080" height="400" fill="url(#launchBottom)"/>

    <rect x="40" y="40" width="1000" height="1000" rx="32" fill="none" stroke="#2C2623" stroke-width="2" stroke-opacity="0.25"/>
    <rect x="52" y="52" width="976" height="976" rx="24" fill="none" stroke="#B06B5B" stroke-width="1" stroke-opacity="0.35"/>

    <!-- TOP SECTION -->
    <g transform="translate(540, 95)">
      <rect x="-160" y="-18" width="320" height="36" rx="18" fill="#FAF0ED" stroke="#ECCEC7" stroke-width="1.5" filter="url(#softShadow)"/>
      <text x="0" y="5" font-family="'Georgia', serif" font-size="12" font-weight="bold" letter-spacing="3" fill="#B06B5B" text-anchor="middle">
        OFFICIAL LAUNCH ANNOUNCEMENT
      </text>
    </g>

    <text x="540" y="175" font-family="'Georgia', serif" font-size="44" font-weight="bold" letter-spacing="8" fill="#2C2623" text-anchor="middle">
      C O C O O N
    </text>
    <text x="540" y="208" font-family="'Arial', sans-serif" font-size="12" font-weight="bold" letter-spacing="4" fill="#8B5E3C" text-anchor="middle">
      ORGANIC MILK COTTON CROCHET
    </text>

    <!-- BOTTOM HERO ANNOUNCEMENT -->
    <text x="540" y="755" font-family="'Georgia', serif" font-size="22" font-style="italic" fill="#8B5E3C" text-anchor="middle">
      Our Online Atelier Is Officially Open
    </text>
    <text x="540" y="820" font-family="'Georgia', serif" font-size="58" font-weight="bold" letter-spacing="2" fill="#2C2623" text-anchor="middle">
      WE ARE LIVE!
    </text>
    <text x="540" y="855" font-family="'Arial', sans-serif" font-size="14" font-weight="bold" letter-spacing="1" fill="#2C2623" fill-opacity="0.75" text-anchor="middle">
      Bags • Totes • Bandanas • Waist Belts • Hair Accessories
    </text>

    <!-- BIG CTA BUTTON -->
    <g transform="translate(540, 915)">
      <rect x="-240" y="-24" width="480" height="48" rx="24" fill="#2C2623" filter="url(#softShadow)"/>
      <text x="0" y="6" font-family="'Arial', sans-serif" font-size="15" font-weight="bold" letter-spacing="2" fill="#FFFFFF" text-anchor="middle">
        SHOP AT WWW.GOCOCOON.STORE
      </text>
    </g>

    <line x1="120" y1="975" x2="960" y2="975" stroke="#2C2623" stroke-width="1" stroke-opacity="0.15"/>
    <text x="540" y="1008" font-family="'Arial', sans-serif" font-size="12" font-weight="bold" letter-spacing="2" fill="#2C2623" fill-opacity="0.8" text-anchor="middle">
      PAN-INDIA EXPRESS DELIVERY  •  CASH ON DELIVERY  •  LINK IN BIO
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
  console.log('All 3 graphic posts generated successfully!');
}

main().catch(console.error);
