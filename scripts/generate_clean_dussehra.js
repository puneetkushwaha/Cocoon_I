const path = require('path');
const sharp = require('sharp');

const brainDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\1ce05368-b1da-4ddf-9d15-3c292216c178';
const outDir = path.join(__dirname, '..', 'public', 'social');

async function buildDussehraCleanLight() {
  const photoPath = path.join(brainDir, 'dussehra_golden_bow_white_1792432183805.jpg');

  const bg = await sharp(photoPath)
    .resize(1080, 1080, { fit: 'cover' })
    .toBuffer();

  // SVG overlay in exact Indowings reference style:
  // Top Left: COCOON Logo (clean, minimal, premium)
  // Center Left: "HAPPY" in clean tracked sans-serif, "Dussehra" in bold italic festive gradient font
  // Meaningful Dussehra message in clean modern typography
  // Divider rule
  // Secondary blessings / offer note
  // Bottom Right / Left: www.gococoon.store
  // Mandala decorative corner in the bottom left
  const svgOverlay = `
  <svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="textGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#E65100"/>
        <stop offset="60%" stop-color="#EF6C00"/>
        <stop offset="100%" stop-color="#F57C00"/>
      </linearGradient>
      <linearGradient id="warmTerracotta" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#B05442"/>
        <stop offset="100%" stop-color="#8E3B2C"/>
      </linearGradient>
    </defs>

    <!-- Top Left Corner Mandala / Decorative Accent -->
    <g transform="translate(0, 0)" opacity="0.12">
      <circle cx="0" cy="0" r="160" fill="none" stroke="#E65100" stroke-width="2"/>
      <circle cx="0" cy="0" r="130" fill="none" stroke="#E65100" stroke-width="1.5" stroke-dasharray="6,4"/>
      <circle cx="0" cy="0" r="100" fill="none" stroke="#E65100" stroke-width="2"/>
      <circle cx="0" cy="0" r="70" fill="none" stroke="#E65100" stroke-width="1"/>
      <circle cx="0" cy="0" r="40" fill="none" stroke="#E65100" stroke-width="2"/>
    </g>

    <!-- Bottom Left Corner Mandala Accent (like reference image) -->
    <g transform="translate(0, 1080)" opacity="0.15">
      <circle cx="0" cy="0" r="280" fill="none" stroke="#E65100" stroke-width="3"/>
      <circle cx="0" cy="0" r="240" fill="none" stroke="#E65100" stroke-width="2" stroke-dasharray="8,6"/>
      <circle cx="0" cy="0" r="200" fill="none" stroke="#E65100" stroke-width="2"/>
      <circle cx="0" cy="0" r="160" fill="none" stroke="#E65100" stroke-width="1.5" stroke-dasharray="4,4"/>
      <circle cx="0" cy="0" r="120" fill="none" stroke="#E65100" stroke-width="2"/>
      <circle cx="0" cy="0" r="80" fill="none" stroke="#E65100" stroke-width="1.5"/>
    </g>

    <!-- TOP LEFT: BRAND IDENTITY -->
    <g transform="translate(140, 120)">
      <text x="0" y="0" font-family="'Georgia', serif" font-size="36" font-weight="bold" letter-spacing="8" fill="#1C1917">
        COCOON
      </text>
      <text x="0" y="24" font-family="'Arial', sans-serif" font-size="11" font-weight="bold" letter-spacing="4" fill="#E65100">
        HANDCRAFTED CROCHET
      </text>
    </g>

    <!-- CENTER LEFT: MAIN FESTIVE GREETING (Exactly matching the Indowings layout) -->
    <g transform="translate(140, 310)">
      <!-- HAPPY (spaced out uppercase) -->
      <text x="0" y="0" font-family="'Arial', sans-serif" font-size="26" font-weight="bold" letter-spacing="14" fill="#292524">
        H A P P Y
      </text>
      
      <!-- Dussehra (Graceful script/serif italic in orange gradient) -->
      <text x="0" y="80" font-family="'Georgia', 'Times New Roman', serif" font-size="78" font-style="italic" font-weight="bold" fill="url(#textGrad)">
        Dussehra
      </text>
    </g>

    <!-- MESSAGE BLOCK 1 -->
    <g transform="translate(140, 460)">
      <text x="0" y="0" font-family="'Georgia', serif" font-size="20" fill="#292524" font-weight="500">
        May Lord Rama bless your home
      </text>
      <text x="0" y="30" font-family="'Georgia', serif" font-size="20" fill="#292524" font-weight="500">
        with courage, wisdom, harmony,
      </text>
      <text x="0" y="60" font-family="'Georgia', serif" font-size="20" fill="#292524" font-weight="500">
        and endless prosperity.
      </text>
    </g>

    <!-- DIVIDER LINE -->
    <line x1="140" y1="580" x2="360" y2="580" stroke="#E65100" stroke-width="2" stroke-opacity="0.8"/>

    <!-- MESSAGE BLOCK 2 (Secondary Blessing / Craft Connection) -->
    <g transform="translate(140, 630)">
      <text x="0" y="0" font-family="'Arial', sans-serif" font-size="14" font-weight="bold" fill="#78350F" letter-spacing="1">
        On this auspicious Vijayadashami,
      </text>
      <text x="0" y="26" font-family="'Arial', sans-serif" font-size="14" fill="#57534E" line-height="22">
        may the victory of truth and virtue
      </text>
      <text x="0" y="52" font-family="'Arial', sans-serif" font-size="14" fill="#57534E">
        always illuminate your path with joy!
      </text>
    </g>

    <!-- FESTIVE SPECIAL TAG / BADGE -->
    <g transform="translate(140, 770)">
      <rect x="0" y="0" width="340" height="42" rx="21" fill="#FFF7ED" stroke="#FDBA74" stroke-width="1.5"/>
      <text x="170" y="26" font-family="'Arial', sans-serif" font-size="12" font-weight="bold" fill="#C2410C" letter-spacing="1.5" text-anchor="middle">
        FESTIVE BLESSINGS FROM COCOON
      </text>
    </g>

    <!-- BOTTOM RIGHT: WEBSITE URL -->
    <text x="960" y="1010" font-family="'Arial', sans-serif" font-size="15" font-weight="bold" letter-spacing="1" fill="#E65100" text-anchor="end">
      www.gococoon.store
    </text>
  </svg>
  `;

  await sharp(bg)
    .composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }])
    .jpeg({ quality: 96 })
    .toFile(path.join(outDir, 'dussehra_post.jpg'));

  console.log('Clean light Dussehra post created!');
}

buildDussehraCleanLight().catch(console.error);
