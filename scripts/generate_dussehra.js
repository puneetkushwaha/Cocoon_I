const path = require('path');
const sharp = require('sharp');

const brainDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\1ce05368-b1da-4ddf-9d15-3c292216c178';
const outDir = path.join(__dirname, '..', 'public', 'social');

async function createGrandDussehraPost() {
  const photoPath = path.join(brainDir, 'dussehra_festival_post_1792431900410.jpg');

  const bg = await sharp(photoPath)
    .resize(1080, 1080, { fit: 'cover' })
    .toBuffer();

  const svgOverlay = `
  <svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#070913" stop-opacity="0.92"/>
        <stop offset="50%" stop-color="#070913" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="#070913" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="bottomDark" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0A0808" stop-opacity="0"/>
        <stop offset="30%" stop-color="#0A0808" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#0A0808" stop-opacity="0.96"/>
      </linearGradient>
      <linearGradient id="goldFlame" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FFF2BF"/>
        <stop offset="40%" stop-color="#F5B041"/>
        <stop offset="80%" stop-color="#D35400"/>
        <stop offset="100%" stop-color="#F39C12"/>
      </linearGradient>
      <filter id="shadow">
        <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000000" flood-opacity="0.8"/>
      </filter>
    </defs>

    <!-- Top & Bottom Gradient Shadows for clear readability -->
    <rect x="0" y="0" width="1080" height="250" fill="url(#skyGrad)"/>
    <rect x="0" y="690" width="1080" height="390" fill="url(#bottomDark)"/>

    <!-- Subtle Golden Border Frame -->
    <rect x="36" y="36" width="1008" height="1008" rx="28" fill="none" stroke="url(#goldFlame)" stroke-width="1.8" stroke-opacity="0.6"/>
    <rect x="48" y="48" width="984" height="984" rx="20" fill="none" stroke="#FFFFFF" stroke-width="0.8" stroke-opacity="0.2"/>

    <!-- TOP: BRAND IDENTITY & BADGE -->
    <g transform="translate(540, 85)">
      <rect x="-140" y="-16" width="280" height="32" rx="16" fill="#B05442" stroke="url(#goldFlame)" stroke-width="1.2" filter="url(#shadow)"/>
      <text x="0" y="5" font-family="'Georgia', serif" font-size="12" font-weight="bold" letter-spacing="3" fill="#FFFFFF" text-anchor="middle">
        VIJAYADASHAMI 2026
      </text>
    </g>

    <text x="540" y="160" font-family="'Georgia', serif" font-size="44" font-weight="bold" letter-spacing="10" fill="#FAF6F0" text-anchor="middle" filter="url(#shadow)">
      C O C O O N
    </text>
    <text x="540" y="190" font-family="'Arial', sans-serif" font-size="12" font-weight="bold" letter-spacing="4" fill="url(#goldFlame)" text-anchor="middle" filter="url(#shadow)">
      HANDCRAFTED CROCHET BOUTIQUE  •  INDIA
    </text>

    <!-- BOTTOM: DUSSEHRA HEADLINE & FESTIVE CELEBRATION -->
    <text x="540" y="760" font-family="'Georgia', serif" font-size="22" font-style="italic" fill="url(#goldFlame)" text-anchor="middle" filter="url(#shadow)">
      Triumph of Light, Righteousness &amp; Purity
    </text>
    <text x="540" y="825" font-family="'Georgia', serif" font-size="62" font-weight="bold" letter-spacing="3" fill="#FFFFFF" text-anchor="middle" filter="url(#shadow)">
      HAPPY DUSSEHRA
    </text>
    <text x="540" y="865" font-family="'Arial', sans-serif" font-size="14" fill="#FAF6F0" fill-opacity="0.9" text-anchor="middle" filter="url(#shadow)">
      May the divine arrow of victory burn down all negativity and bless your path with endless joy.
    </text>

    <!-- PROMO CODE PILL -->
    <g transform="translate(540, 925)">
      <rect x="-240" y="-22" width="480" height="44" rx="22" fill="url(#goldFlame)" filter="url(#shadow)"/>
      <text x="0" y="6" font-family="'Arial', sans-serif" font-size="14" font-weight="bold" letter-spacing="2" fill="#120B08" text-anchor="middle">
        FESTIVE BLESSINGS: FLAT 10% OFF  •  CODE: DUSSEHRA10
      </text>
    </g>

    <!-- FOOTER -->
    <line x1="100" y1="980" x2="980" y2="980" stroke="#F5B041" stroke-width="1" stroke-opacity="0.3"/>
    <text x="540" y="1012" font-family="'Arial', sans-serif" font-size="12" font-weight="bold" letter-spacing="3" fill="#FAF6F0" fill-opacity="0.85" text-anchor="middle">
      WWW.GOCOCOON.STORE  •  @COCOON._.U  •  100% ORGANIC MILK COTTON
    </text>
  </svg>
  `;

  await sharp(bg)
    .composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }])
    .jpeg({ quality: 96 })
    .toFile(path.join(outDir, 'dussehra_post.jpg'));

  console.log('Grand Dussehra campaign post created successfully!');
}

createGrandDussehraPost().catch(console.error);
