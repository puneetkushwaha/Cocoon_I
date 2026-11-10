# Cocoon Handcrafted Crochet Boutique — Comprehensive SEO Audit Report
**Target Domain**: [https://www.gococoon.store](https://www.gococoon.store)  
**Codebase Architecture**: Next.js 16 (App Router, Turbopack, React 19, Tailwind CSS)  
**Investigation Scope**: Local Codebase Implementation vs. Live Production Deployment  
**Audit Date**: November 10, 2026  
**Auditors & Forensics**: Teamwork SEO Engineering & Forensic Audit Group  
**Document Classification**: Publication-Grade Master SEO Audit & Technical Remediation Plan  

---

## 1. Executive Summary & SEO Health Scorecard

### 1.1 Brand Overview & Organic Search Positioning
Cocoon is an artisanal, direct-to-consumer (D2C) slow-fashion crochet boutique based in India, founded by lead artisan Mehak Agarwal. The brand crafts heirloom-quality, knot-by-knot crochet essentials—including statement handbags, macrame totes, floral bandanas, waist wraps, bow keychains, and hair accessories—crafted exclusively from 100% premium organic milk cotton yarn. The digital storefront is powered by Next.js 16 App Router on Vercel at `https://www.gococoon.store`.

The brand operates in a high-intent, rapidly growing e-commerce vertical: artisanal slow fashion, cottagecore knitwear, and ethical handcrafted accessories. While the storefront demonstrates exquisite visual aesthetics, rich storytelling, clean static site generation (SSG) across 50 priority routes, and valid JSON-LD parsing, an exhaustive dual-scope forensic investigation reveals **critical architectural, technical, metadata, and structured data vulnerabilities** that actively suppress organic search visibility, waste crawl budget, and expose the domain to algorithmic or manual search penalties.

### 1.2 SEO Health Scorecard

| Category | Health Score (0-100) | Status | Critical Issues | Primary Diagnostic Summary |
|---|:---:|:---:|:---:|---|
| **Technical SEO & Crawlability** | **42 / 100** | 🔴 Critical Risk | 3 | Accidental deindexing of `/shop` via `noindex, nofollow`, public indexation of `/admin`, canonical inheritance collapse on utility routes, and trailing-slash crawler bypasses. |
| **Structured Data & Rich Results** | **48 / 100** | 🔴 Critical Risk | 4 | Severe Google Spam Policy violation (fake review fallback: `4.9` rating / `14` reviews on zero-review products), dual competing `Product` schemas (`COCOON-1` vs `GC-1`), global FAQ schema leakage on all routes, and invalid `ListItem.offers` syntax. |
| **On-Page SEO & Metadata** | **58 / 100** | 🟡 Needs Attention | 2 | Universal SERP title truncation (76–114 characters) driven by `%s \| Cocoon Crochet Boutique` template duplication, meta description truncation (exceeding 200+ chars), and missing OG images on key hubs. |
| **Performance & Core Web Vitals** | **55 / 100** | 🟡 Needs Attention | 2 | Total absence of Next.js Image Optimization (51 raw unoptimized `<img>` tags, zero `next/image` adoption), external render-blocking Google Fonts inducing CLS/FOUT, and mobile zoom restriction (`maximumScale: 1`). |
| **Content & Keyword Strategy** | **64 / 100** | 🟡 Moderate Health | 1 | 7 of 42 slow-fashion crochet target keywords have 0 occurrences in actual copy; extreme keyword cramming in Blog Post 1 (25+ keywords in 3 short paragraphs); 404 error on `/journal`. |
| **OVERALL COMPOSITE SEO HEALTH** | **53.4 / 100** | 🔴 **HIGH VULNERABILITY** | **12** | **Immediate P0 / Tier-1 technical intervention required to restore catalog indexability, eliminate policy violation risks, and recapture organic impressions.** |

---

### 1.3 Top 5 Critical Vulnerabilities Requiring Immediate Intervention

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 TOP 5 CRITICAL SEO VULNERABILITIES                                      │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. Catalog Hub De-indexation (/shop)          → robots: { index: false, follow: false } in layout.js   │
│ 2. Admin Portal Public Indexation Leak (/admin) → Disallow: /admin/ allows /admin (HTTP 200, indexable)│
│ 3. Canonical Inheritance Collapse             → Policy & custom pages point canonical to homepage      │
│ 4. Google Review Policy Violation             → Fabricated 4.9 rating & 14 reviews on zero-review items│
│ 5. Domain-Wide FAQ Schema Leakage             → RootLayout injects hidden FAQPage schema onto all URLs │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

1. **Catastrophic Catalog Lockout via `noindex, nofollow` on `/shop`**:  
   - **File**: `src/app/shop/layout.js:1-6`  
   - **Impact**: The central store vault and multi-product directory (`https://www.gococoon.store/shop`) serves `<meta name="robots" content="noindex, nofollow"/>`. Simultaneously, `src/app/sitemap.js:17` submits `/shop` to Google at `priority: 0.95`. This creates a severe Google Search Console coverage error (*"Submitted URL marked 'noindex'"*) and completely eradicates the main shopping portal from Google's index.
2. **Administrative Management Portal Indexation Leak (`/admin`)**:  
   - **File**: `src/app/robots.js:7` and `src/app/admin/page.js:1`  
   - **Impact**: `robots.js` only disallows `/admin/` (with trailing slash). Under RFC 9309, a crawler requesting `/admin` matches no disallow rule. Because `src/app/admin/page.js` is a client component without metadata, it inherits the root layout's `index: true, follow: true`. Production serves HTTP 200 with `<meta name="robots" content="index, follow"/>`, exposing the store management interface to public search engine indexes.
3. **Canonical Self-Cannibalization on Policy & Custom Pages**:  
   - **Files**: `src/app/layout.js:59-61`, `src/app/custom-order/page.js`, `src/app/privacy/page.js`, `src/app/terms/page.js`, `src/app/refund/page.js`, `src/app/cookies/page.js`  
   - **Impact**: The root layout explicitly defines `alternates: { canonical: "https://www.gococoon.store" }`. Subpages omitting an explicit self-referencing canonical inherit the homepage canonical URL. Google is instructed that `/custom-order`, `/privacy`, `/terms`, `/refund`, and 404 pages are duplicate representations of the homepage, collapsing their rank and crawl equity.
4. **Severe Google Structured Data Policy Violation (Fabricated Review Data)**:  
   - **File**: `src/app/product/[id]/page.js:779-780`  
   - **Impact**: When a product has zero verified customer reviews, client-side schema generation executes: `ratingValue: reviewStats.count > 0 ? reviewStats.avg : "4.9"` and `reviewCount: reviewStats.count > 0 ? String(reviewStats.count) : "14"`. Injecting fabricated customer review metrics on unreviewed products directly violates Google Search Central's Spam Policies regarding structured data and risks domain-level manual actions.
5. **Site-Wide FAQ Schema Leakage & Duplicate Home Schemas**:  
   - **Files**: `src/app/layout.js:192-238`, `src/app/page.js:72-127`, `src/components/FaqSection.jsx`  
   - **Impact**: RootLayout injects a 5-question `FAQPage` schema into `<head>` across every single page on the website (including product details, cart, checkout, and privacy pages) where no FAQ content is visible. Google mandates that all schema FAQ questions must be visually displayed on the specific URL. Furthermore, the homepage injects two conflicting FAQPage schemas, neither of which matches the visible text in `FaqSection.jsx`.

---

## 2. On-Page SEO Analysis

### 2.1 Title Tags & Double-Branding SERP Truncation

Next.js 16 provides an App Router metadata title template in `src/app/layout.js`:
```javascript
// src/app/layout.js:6-9
title: {
  default: "Cocoon | Handcrafted Crochet Bags, Belts & Accessories India",
  template: "%s | Cocoon Crochet Boutique",
}
```

#### The Double-Branding Defect Mechanism:
When a child page defines a complete, branded title string (such as `title: "Handbags & Totes | Cocoon Handcrafted Crochet India"`), Next.js passes that entire string into the template placeholder `%s`. The resulting rendered `<title>` tag contains two or three redundant brand suffixes, ballooning character counts to between 76 and 114 characters. Google's desktop and mobile SERP title snippet container truncates pixel widths exceeding ~600px (roughly 55–60 characters).

#### Live Audit & SERP Truncation Evidence:

| Route Endpoint | Source Code Location | Raw Defined Child Title | Live Production `<title>` in SERP | Length | SERP Status |
|---|---|---|---|:---:|:---:|
| `/` | `src/app/page.js:4` | `Cocoon \| Handcrafted Crochet Bags, Belts & Accessories India` | `<title>Cocoon \| Handcrafted Crochet Bags, Belts & Accessories India</title>` | 60 | ✅ Optimal |
| `/collections/bags` | `src/app/collections/[slug]/page.js:31` | `Handbags & Totes \| Cocoon Handcrafted Crochet India` | `<title>Handbags &amp; Totes \| Cocoon Handcrafted Crochet India \| Cocoon Crochet Boutique</title>` | **77** | 🔴 Truncated |
| `/collections/belts` | `src/app/collections/[slug]/page.js:31` | `Belts & Waist Wraps \| Cocoon Handcrafted Crochet India` | `<title>Belts &amp; Waist Wraps \| Cocoon Handcrafted Crochet India \| Cocoon Crochet Boutique</title>` | **80** | 🔴 Truncated |
| `/collections/bandanas` | `src/app/collections/[slug]/page.js:31` | `Bandanas & Headscarves \| Cocoon Handcrafted Crochet India` | `<title>Bandanas &amp; Headscarves \| Cocoon Handcrafted Crochet India \| Cocoon Crochet Boutique</title>` | **83** | 🔴 Truncated |
| `/collections` | `src/app/collections/page.js:8` | `All Handcrafted Crochet Collections \| Cocoon India` | `<title>All Handcrafted Crochet Collections \| Cocoon India \| Cocoon Crochet Boutique</title>` | **76** | 🔴 Truncated |
| `/product/1` | `src/app/product/[id]/layout.js:23` | `Chocolate Bow Knot Handbag \| Handcrafted Bags \| Cocoon` | `<title>Chocolate Bow Knot Handbag \| Handcrafted Bags \| Cocoon \| Cocoon Crochet Boutique</title>` | **80** | 🔴 Truncated |
| `/product/5` | `src/app/product/[id]/layout.js:23` | `Sunflower Field Crochet Tote Bag \| Handcrafted Bags \| Cocoon` | `<title>Sunflower Field Crochet Tote Bag \| Handcrafted Bags \| Cocoon \| Cocoon Crochet Boutique</title>` | **87** | 🔴 Truncated |
| `/blog` | `src/app/blog/page.js:7` | `Artisan Crochet Journal, Care Guides & Styling Tips \| Cocoon India` | `<title>Artisan Crochet Journal, Care Guides &amp; Styling Tips \| Cocoon India \| Cocoon Crochet Boutique</title>` | **92** | 🔴 Truncated |
| `/blog/crochet-bags...` | `src/app/blog/[slug]/page.js:31` | `The Ultimate Guide to Handcrafted Crochet Bags... \| Cocoon Artisan Journal` | `<title>The Ultimate Guide to Handcrafted Crochet Bags, Granny Squares &amp; Organic Milk Cotton Yarn \| Cocoon Artisan Journal</title>` | **114** | 🔴 Severely Truncated |
| `/shop` | `src/app/shop/page.js:8` | `All Drops & Handcrafted Vault \| Cocoon India` | `<title>All Drops &amp; Handcrafted Vault \| Cocoon India \| Cocoon Crochet Boutique</title>` | **70** | 🔴 Truncated |
| `/story` | `src/app/story/page.js:6` | `Our Story & Letter from Mehak \| Cocoon Handcrafted Crochet` | `<title>Our Story &amp; Letter from Mehak \| Cocoon Handcrafted Crochet \| Cocoon Crochet Boutique</title>` | **84** | 🔴 Truncated |
| `/privacy` | `src/app/privacy/page.js:6` | `Privacy Policy \| COCOON Handcrafted Crochet` | `<title>Privacy Policy \| COCOON Handcrafted Crochet \| Cocoon Crochet Boutique</title>` | **69** | 🔴 Truncated |

---

### 2.2 Meta Descriptions Audit

Meta descriptions should ideally span **120 to 155 characters**, incorporate the page's primary commercial keyword, and offer a clear value proposition with a call to action (CTA).

| Page Route | Source Location | Live Character Count | Snippet Text Preview | Deficit & SERP Assessment |
|---|---|:---:|---|---|
| **Root Layout** | `src/app/layout.js:10` | **230 chars** | *"Discover authentic handcrafted crochet bags, statement totes, hair accessories, waist wraps, bandanas & heirloom gifts at Cocoon. Artisanal slow-fashion hand-crocheted knot-by-knot in India by Mehak Agarwal. All-India express delivery."* | **Severely Truncated**. Google truncates at ~155-160 characters. The CTA and delivery promise are completely cut off in SERPs. |
| **Home Page** | `src/app/page.js:5` | **188 chars** | *"Shop authentic artisanal crochet bags, floral bandanas, waist wraps, bow keychains & hair accessories. Slow-crafted knot-by-knot in India by Mehak Agarwal. Free all-India express delivery."* | **Truncated**. Exceeds 160 characters by 28 characters. |
| **Category `/collections/bags`** | `src/data/categories.js:9` | **204 chars** | *"Discover authentic artisanal crochet handbags, macrame totes, bow knot shoulder bags & backpacks. Handcrafted with premium organic milk cotton cords in India by Mehak Agarwal. Free shipping above Rs. 999."* | **Truncated**. Strong commercial intent, but shipping incentive is cut off in mobile SERPs. |
| **Product `/product/1`** | `src/app/product/[id]/layout.js:24` | **259 chars** | *`${product.desc} Artisanal slow-fashion handcrafted knot-by-knot in India (${materialLabel}). Price: ₹${product.price}. Express pan-India dispatch.`* | **Severely Truncated**. Dynamic string concatenation results in 250+ characters. Pricing and dispatch information are discarded by crawlers. |
| **Blog Index `/blog`** | `src/app/blog/page.js:8` | **158 chars** | *"Read artisan guides on washing handcrafted crochet bags, styling bandanas & waist wraps, and the tactile beauty of milk cotton yarn. Written by Mehak Agarwal."* | ✅ **Optimal**. Concise, descriptive, under 160 characters. |
| **Blog Post 1** | `src/data/blogPosts.js:7` | **94 chars** | *"A master guide to crochet tote bags, purses, and slow-fashion needle and thread craftsmanship."* | 🟡 **Suboptimal (Too Short)**. Leaves 60+ characters of search snippet real estate unused. |
| **Policy `/privacy`** | `src/app/privacy/page.js:7` | **72 chars** | *"Privacy Policy and DPDP Act 2023 compliance for COCOON Artisanal Studio."* | 🟡 **Suboptimal (Too Short)**. Missing brand and user protection context. |

---

### 2.3 Headings Hierarchy (H1–H6) Architecture

An optimal HTML document structure requires exactly one semantic `<h1>` tag containing the primary topic keyword, followed by an unbroken, descending hierarchy (`<h2>` -> `<h3>` -> `<h4>`) without skipped levels or empty heading nodes.

#### Page-by-Page Heading Breakdown:

1. **Homepage (`src/components/presets/Preset4.jsx` via `src/app/page.js`)**:
   - `<h1>` Status: Single `<h1>` at line 352:
     `<h1 className="...">Handcrafted Crochet where art meets needle and thread.</h1>`
     *Strengths*: High brand resonance, captures "Handcrafted Crochet", "needle and thread".
     *Weakness*: Omits top transactional queries ("Bags", "Handbags", "India").
   - Heading Skips & Semantic Inversions:
     - Line 518: `<h2>Shop Our Categories</h2>` is immediately followed at line 539 by `<h4>{category.name}</h4>`. **Skipped level: H2 -> H4 (missing H3)**.
     - Line 659: `<h2>Curated Drops / Editorial</h2>` is followed at line 721 by `<h4>{product.name}</h4>`. **Skipped level: H2 -> H4 (missing H3)**.
     - Line 1232: `<h3>Chat with Mehak</h3>` is followed at line 1245 by `<h4>Skip the form...</h4>`.
     - Lines 1538, 1557, 1597, 1986, 2033: Hidden modals (Quick View, Order Status, Commission inquiry) render un-hydrated `<h3>` headings directly in the DOM.
2. **Collection Landing Pages (`src/app/collections/[slug]/page.js`)**:
   - `<h1>` Status: Single `<h1>` at line 174: `<h1 className="...">{catData.name}</h1>` (e.g., `Handbags & Totes`).
   - Heading Skips & Semantic Inversions:
     - Line 174 renders `<h1>{catData.name}</h1>`.
     - The product catalog grid `<CollectionFilterSort />` (`src/components/CollectionFilterSort.jsx:185`) renders `<h3>{product.name}</h3>` for every product card. **Skipped level: H1 -> H3 without an intervening H2**.
     - Line 198: `<h2 className="...">{catData.h1}</h2>` — The primary keyword-rich heading (`Handcrafted Crochet Bags, Macrame Totes & Slings in India`) is rendered as an `<h2>` *below* the product grid rather than at the top.
     - Line 230: `<CategoryReviewsSection />` renders `<h2>Customer Reviews</h2>` (`line 29`), followed by `<h4>{review.title}</h4>` (`line 96`). **Skipped level: H2 -> H4**.
     - Line 266: `<h2>Explore Other Handcrafted Collections</h2>` is followed at line 281 by `<h4 className="...">{c.name}</h4>`. **Skipped level: H2 -> H4**.
3. **Product Detail Pages (`src/app/product/[id]/page.js`)**:
   - `<h1>` Status: Single `<h1>` at line 893: `<h1 className="...">{product.name}</h1>` (e.g., `Chocolate Bow Knot Handbag`).
   - Heading Skips:
     - Line 1216: `<h2>Customer Reviews</h2>` is followed at line 1298 by `<h4>{rev.title}</h4>`. **Skipped level: H2 -> H4**.
     - Line 1336: `<h2>You May Also Adore</h2>` is followed at line 1366 by `<h4>{relatedProduct.name}</h4>`. **Skipped level: H2 -> H4**.
4. **Collections Directory (`src/app/collections/page.js`) & Shop Catalog (`src/app/shop/page.js`)**:
   - Both pages define clean single `<h1>` tags (`Explore Handcrafted Collections` and `All Handcrafted Drops`), but jump directly to `<h3>` product and category tags with zero `<h2>` structural section delimiters.

---

### 2.4 OpenGraph & Twitter Cards Audit

| Route URL | OpenGraph Implemented | `og:image` Status & Dimensions | Twitter Card Implemented | Evaluation & Deficit |
|---|:---:|---|:---:|---|
| `/` | ✅ Yes | Present: `/instagram-post.jpg` (1200x1600, **3:4 Portrait**) | ✅ `summary_large_image` | ⚠️ **Non-Standard Aspect Ratio**: Standard OG requirement is 1.91:1 landscape (1200x630). 1200x1600 suffers severe vertical cropping or black letterboxing on WhatsApp/Twitter. |
| `/collections/bags` | ✅ Yes | Present: Category hero image | ✅ `summary_large_image` | ✅ Fully compliant. |
| `/product/1` | ✅ Yes | Present: `${product.imgUrl}` (1200x1200, 1:1 Square) | ✅ `summary_large_image` | ✅ Good social display for e-commerce. |
| `/blog/[slug]` | ✅ Yes | Present: `${post.imageUrl}` | ✅ `summary_large_image` | ✅ Compliant. |
| `/collections` | 🟡 Partial | ❌ **MISSING `images` array** (`src/app/collections/page.js:13-18`) | ❌ **MISSING twitter object** | 🔴 When shared on Facebook or LinkedIn, preview defaults to blank. |
| `/shop` | 🟡 Partial | ❌ **MISSING `images` array** (`src/app/shop/page.js:13-18`) | ✅ Present | 🔴 Missing preview graphic. |
| `/story` | 🟡 Partial | ❌ **MISSING `images` array** (`src/app/story/page.js:11-15`) | ✅ Present | 🔴 Missing preview graphic. |

---

### 2.5 Image Alt Attributes & Media Accessibility

A comprehensive forensic audit of all JSX/TSX templates across `src/` revealed:
- **Standard HTML `<img>` tag occurrences**: **51**
- **Next.js `<Image>` (`next/image`) tag occurrences**: **0** (Zero adoption!)

#### Critical Findings:
1. **Empty `alt=""` on Product Detail Thumbnail Gallery**:
   - **Location**: `src/app/product/[id]/page.js:863`
   ```jsx
   <img src={img} alt="" className="w-full h-full object-cover" />
   ```
   *Impact*: Accessibility screen readers cannot announce product thumbnails, and Googlebot-Image cannot extract contextual metadata from secondary product gallery angles.
2. **Generic Alt Attributes across Product Grids**:
   - In `src/components/CollectionFilterSort.jsx`, `src/app/collections/page.js`, and `Preset4.jsx`, all product images default to:
   ```jsx
   alt={product.name}
   ```
   While syntactically valid, it fails to capitalize on image search queries (e.g., `"Chocolate Bow Knot Handbag handcrafted with organic milk cotton in India"`).
3. **No Dedicated Alt Field in Product Data**:
   - In `src/data/products.js`, the schema defines `name`, `desc`, `price`, `materials`, `colors`, but **omits an `alt` or `imageAlt` field**. Every component falls back to `{product.name}`.

---

## 3. Technical SEO & Crawlability Analysis

### 3.1 Next.js 16 App Router Configuration

The store is powered by Next.js version `16.3.3` with React `19.2.8` and Turbopack.

#### Inspection of `next.config.mjs`:
```javascript
// next.config.mjs (lines 1-25)
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400, // 24 hours
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.fbcdn.net" },
      { protocol: "https", hostname: "**.cdninstagram.com" },
    ],
  },
  // ...
```

#### Architectural Strengths & Deficits:
- **Strengths**:
  - `compress: true`: Enables Brotli (`br`) and Gzip compression at the edge.
  - `poweredByHeader: false`: Removes `X-Powered-By: Next.js` fingerprinting.
  - Cache-Control headers configured for `/products/:path*` (30 days with SWR) and `/reels/:path*` (1 year immutable).
  - Clean static site generation (`generateStaticParams`) across `/collections/[slug]` (6 categories), `/product/[id]` (30 products), and `/blog/[slug]` (4 guides).
- **Critical Deficits**:
  - `redirects()` hook returns an empty array `[]` (line 80). No permanent redirects are defined in `next.config.mjs`.
  - `images.remotePatterns` is properly declared, but **Next.js `<Image>` is completely absent** from the UI codebase.
  - Render-blocking Google Fonts `<link>` tags in root layout.

---

### 3.2 Canonical URL Architecture & Inheritance Collapse

Next.js App Router automatically cascades metadata fields from parent layouts to child pages unless explicitly overridden.

In `src/app/layout.js:58-61`:
```javascript
metadataBase: new URL("https://www.gococoon.store"),
alternates: {
  canonical: "https://www.gococoon.store",
},
```

#### The Inheritance Collapse Bug:
Because the root layout specifies a static canonical URL (`https://www.gococoon.store`) rather than relying on relative path resolution via `metadataBase`, **every child route that omits an explicit `alternates.canonical` inherits the homepage canonical URL**.

#### Production HTTP Verification:

```powershell
# Command:
curl.exe -sL https://www.gococoon.store/custom-order | Select-String -Pattern "canonical"
# Production Output:
<link rel="canonical" href="https://www.gococoon.store"/>

# Command:
curl.exe -sL https://www.gococoon.store/privacy | Select-String -Pattern "canonical"
# Production Output:
<link rel="canonical" href="https://www.gococoon.store"/>
```

#### Impacted Routes Verified in Production:
1. `https://www.gococoon.store/custom-order` (Bespoke commissions hub — `src/app/custom-order/page.js` is `"use client"` and exports no metadata).
2. `https://www.gococoon.store/terms` (`src/app/terms/page.js:5-8` defines title/desc, omits canonical).
3. `https://www.gococoon.store/privacy` (`src/app/privacy/page.js:5-8` omits canonical).
4. `https://www.gococoon.store/refund` (`src/app/refund/page.js:5-8` omits canonical).
5. `https://www.gococoon.store/cookies` (`src/app/cookies/page.js:5-8` omits canonical).
6. `https://www.gococoon.store/non-existent-page` (Default 404 page inherits homepage canonical).

**SEO Consequence**: Google treats these 6 distinct URLs as duplicate copies of the homepage, consolidates link equity to the root domain, and drops them from search results.

---

### 3.3 Robots.txt Directives Audit

#### Codebase (`src/app/robots.js`) vs Live Production (`https://www.gococoon.store/robots.txt`):
Live `curl -s https://www.gococoon.store/robots.txt` returns:
```http
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8

User-Agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /cart
Disallow: /wishlist
Disallow: /profile
Disallow: /login
Disallow: /review

User-Agent: Googlebot-Image
Allow: /
Allow: /products/
Allow: /instagram-post.jpg
Allow: /*.jpg
Allow: /*.png
Allow: /*.webp
Allow: /*.svg

User-Agent: Pinterestbot
Allow: /
Allow: /products/
Allow: /collections/
Allow: /product/
Allow: /blog/
Allow: /shop
Allow: /story
Allow: /custom-order

User-Agent: Bingbot
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /cart
Disallow: /wishlist
Disallow: /profile
Disallow: /login
Disallow: /review

Host: https://www.gococoon.store
Sitemap: https://www.gococoon.store/sitemap.xml
```

#### Vulnerabilities:
1. **The `/admin` Indexing Leak (Trailing Slash Trap)**:  
   - `Disallow: /admin/` only matches URLs with a trailing slash. Crawlers hitting `/admin` (without trailing slash) are permitted to crawl.
   - Live probe: `curl.exe -sI https://www.gococoon.store/admin` returns `HTTP 200 OK`.
   - Live HTML contains: `<meta name="robots" content="index, follow"/>` (inherited from root layout). Search engines are actively invited to index the administrative dashboard.
2. **The `/shop` Contradiction**:  
   - `robots.txt` explicitly allows Pinterestbot to crawl `/shop` (`Allow: /shop`), while `src/app/shop/layout.js:1-6` injects `noindex, nofollow`, causing crawler confusion.
3. **Invalid Protocol Prefix in Host Directive**:  
   - `Host: https://www.gococoon.store` violates RFC 9309 standards. The directive must contain only the hostname: `Host: www.gococoon.store`.
4. **Missing Query String Disallow Directives**:  
   - Faceted collection URLs (e.g. `?sort=price_asc`, `?sub=evil-eye`) are not handled, wasting crawl budget.

---

### 3.4 Sitemap.xml Architecture Audit

#### Production Verification:
Live probe `curl -i -s https://www.gococoon.store/sitemap.xml` returns:
- Status: `HTTP/1.1 200 OK`
- `Content-Type`: `application/xml`
- `Content-Length`: `13572`
- Root XML: `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`

#### URL Breakdown (50 Total URLs):
- 1 Homepage (`priority: 1.0`, `daily`)
- 2 Catalog Root URLs (`/shop`, `/collections`, `priority: 0.95`, `daily`)
- 1 Custom Order URL (`/custom-order`, `priority: 0.9`, `weekly`)
- 6 Category Hubs (`/collections/*`, `priority: 0.9`, `daily`)
- 2 Authority Content URLs (`/story`, `/blog`, `priority: 0.85`, `monthly`/`daily`)
- 4 Journal Guides (`/blog/*`, `priority: 0.8`, `weekly`)
- 30 Product Detail URLs (`/product/1` to `/product/30`, `priority: 0.8`, `weekly`)
- 4 Policy URLs (`/terms`, `/privacy`, `/refund`, `/cookies`, `priority: 0.4`-`0.3`, `monthly`)

#### Sitemap Weaknesses:
1. **Dynamic Timestamp Anti-Pattern (`lastModified: new Date()`)**:  
   In `src/app/sitemap.js`, lines 11, 18, 24, 30, 36, 42, 48, 54, 60, 66, 79, and 100 hardcode `lastModified: new Date()`. Every single request to `/sitemap.xml` generates a fresh timestamp. Google Search Central explicitly penalizes false `lastmod` spoofing; Googlebot stops trusting the `lastmod` signal when static and unmodified pages claim to change every second.
2. **Submitting a Noindexed URL**:  
   `/shop` is submitted at `priority: 0.95`, but serves `noindex, nofollow`, triggering Google Search Console coverage errors.
3. **Missing Image Captions/Titles**:  
   The image sitemap provides `<image:loc>`, but omits `<image:title>` and `<image:caption>`, missing out on Google Image Search ranking opportunities.

---

### 3.5 Crawlability, Redirects & HTTP Network

#### Redirect Chain Probes:

```powershell
# Probe 1: Apex HTTP
curl.exe -I -s http://gococoon.store
# Result: HTTP/1.0 308 Permanent Redirect -> Location: https://gococoon.store/

# Probe 2: Apex HTTPS
curl.exe -I -s https://gococoon.store
# Result: HTTP/1.1 308 Permanent Redirect -> Location: https://www.gococoon.store/

# Probe 3: Destination
curl.exe -I -s https://www.gococoon.store/
# Result: HTTP/1.1 200 OK
```
- **Assessment**: A **2-hop redirect chain** exists for `http://gococoon.store` (Apex HTTP -> Apex HTTPS -> WWW HTTPS). While minor, Vercel edge routing should redirect `http://gococoon.store` directly to `https://www.gococoon.store` in a single 308 hop to conserve bot crawl budget.
- **Trailing Slash Normalization**: `curl -I https://www.gococoon.store/shop/` returns `308 Permanent Redirect` to `/shop`. Next.js handles trailing slash deduplication correctly.
- **Legacy Category Route**: `curl -I https://www.gococoon.store/category/bags` returns `308 Permanent Redirect` to `/collections/bags`. Clean 1-hop migration.
- **Missing `/journal` Route**: `curl -I https://www.gococoon.store/journal` returns **HTTP 404 Not Found**. Site navigation references "Artisan Journal", leading users and bots to broken routes.

#### HTTP Response Headers:
- `Strict-Transport-Security`: `max-age=63072000; includeSubDomains; preload` (2-year HSTS + preload list compliant).
- `X-Content-Type-Options`: `nosniff` (Active).
- `X-Frame-Options`: `SAMEORIGIN` (Active).
- `Content-Encoding`: `br` (Brotli compression active on dynamic responses).
- `Content-Security-Policy`: ❌ **Missing**.
- `X-Robots-Tag`: ❌ **Missing** on API routes (`/api/*`) and private endpoints.

---

### 3.6 Core Web Vitals & Page Experience Considerations

1. **Cumulative Layout Shift (CLS)**:
   - **Absence of `next/image`**: 51 native `<img>` tags lack explicit `width` and `height` integer attributes. Browsers cannot allocate aspect-ratio bounding boxes before CSS loads, causing reflows.
   - **Render-Blocking Google Fonts**: External stylesheet `<link>` tags in `src/app/layout.js:247-252` load Cormorant Garamond and Nunito Sans with `display=swap`. The delayed swap from system fonts induces FOIT/FOUT and layout shifts.
2. **Largest Contentful Paint (LCP)**:
   - The desktop homepage hero image (`storeHeroCards[1].imgUrl`) and product gallery hero image are loaded via standard `<img>` tags inside deeply nested client-side React state without `<link rel="preload">` or `fetchpriority="high"`.
3. **Accessibility & Interaction to Next Paint (INP)**:
   - **Viewport Pinch-to-Zoom Block**: `src/app/layout.js:111` enforces `maximumScale: 1`. This violates **WCAG 2.1 SC 1.4.4 (Resize text - Level AA)** and triggers automated accessibility flags in search quality audits.
   - **Focus Outline Suppression**: `src/app/globals.css:198-201` contains:
     ```css
     a:focus, button:focus, [tabindex]:focus, a:focus-visible, button:focus-visible {
       outline: none !important;
       box-shadow: none !important;
     }
     ```
     This destroys keyboard navigation accessibility (violating WCAG 2.4.7 Focus Visible).
   - **Lenis Smooth Scroll Overhead**: Wrapping the root layout in `<ReactLenis>` intercepts native touch/wheel events on mobile, degrading scroll responsiveness and inflating INP on low-end devices.

---

## 4. Structured Data & Schema.org JSON-LD Audit

### 4.1 Syntax & Implementation Inventory

Structured data is injected via `<script type="application/ld+json">` tags across 8 source files. Across all 14 probed live endpoints, **zero JSON syntax errors** were detected.

| Source File Location | Schema.org Entities Injected | Render Scope | Verification Status |
|---|---|---|:---:|
| `src/app/layout.js:118-258` | `WebSite`, `ClothingStore`, `FAQPage` (#faq) | Global (All routes) | 🔴 Site-wide FAQ leak |
| `src/app/page.js:72-126` | `FAQPage` (homeFaqSchema) | Homepage (`/`) | 🔴 Conflicts with Root FAQ |
| `src/app/collections/[slug]/page.js:88-155` | `BreadcrumbList`, `CollectionPage` (`ItemList`) | Collections (`/collections/[slug]`) | 🔴 Invalid `ListItem.offers` syntax |
| `src/app/category/[slug]/layout.js:52-128` | `CollectionPage`, `BreadcrumbList`, `FAQPage` | `/category/[slug]` | 🟡 Dead code (308 redirect) |
| `src/app/product/[id]/layout.js:80-208` | `Product`, `BreadcrumbList` | Product Detail (`/product/[id]`) | ✅ Merchant compliant |
| `src/app/product/[id]/page.js:749-789` | `Product` (Duplicate) | Product Detail (`/product/[id]`) | 🔴 Fake review violation |
| `src/app/blog/[slug]/layout.js:63-100` | `BlogPosting` | Journal Guides (`/blog/[slug]`) | 🔴 Dual conflicting article |
| `src/app/blog/[slug]/page.js:85-118` | `Article` (Duplicate) | Journal Guides (`/blog/[slug]`) | 🔴 Dual conflicting article |

---

### 4.2 Product Schema Conflict & Severe Review Policy Violation

Every product page (`/product/[id]`) injects **two separate, competing `Product` entities** into the same HTML document:
- **Schema A (from `product/[id]/layout.js`)**: Server-rendered. Declares `sku: "COCOON-" + id`, `mpn: "GC-PRD-" + id`, `hasMerchantReturnPolicy` (7-day window, FreeReturn), and `shippingDetails` (0 INR rate). Only outputs `aggregateRating` if real database reviews exist.
- **Schema B (from `product/[id]/page.js`)**: Client-rendered. Declares `sku: "GC-" + id`, omits MPN, omits merchant return policy, omits shipping details, and fabricates fake customer review data.

#### The Policy Violation:
In `src/app/product/[id]/page.js:779-780`:
```javascript
aggregateRating: {
  "@type": "AggregateRating",
  ratingValue: reviewStats.count > 0 ? reviewStats.avg : "4.9",
  reviewCount: reviewStats.count > 0 ? String(reviewStats.count) : "14"
}
```

#### Live Verification on Product 5 (`https://www.gococoon.store/product/5`):
- Script 2 (`layout.js`): `sku: "COCOON-5"`, `reviewCount: 27` (genuine database value).
- Script 4 (`page.js`): `sku: "GC-5"`, `ratingValue: "4.9"`, `reviewCount: "14"` (fabricated fallback).
- **Google Search Central Violation**: Google's Structured Data Spam Policies state: *"Review and rating structured data must accurately represent the actual user reviews collected on the page. Fabricating reviews or assigning ratings to products without customer reviews is considered structured data spam."* This creates immediate risk of a manual action or revocation of all rich snippet eligibility.

---

### 4.3 FAQPage Schema Architecture & Domain Leakage

1. **Domain-Wide RootLayout Injection**:  
   `src/app/layout.js:192-238` injects a 5-question FAQPage schema (`@id: "https://www.gococoon.store/#faq"`) into `<head>` across the entire website. As a result, product detail pages, policy pages, blog posts, and cart pages all output FAQ structured data for questions that do not appear anywhere in their visible DOM.
   *Google Guideline*: *"All FAQ content must be visible to the user on the source page. Marking up FAQ content that is not visible violates Google guidelines."*
2. **Triple Divergence on Homepage (`/`)**:  
   - RootLayout outputs FAQ Set A (handmade authentic, COD across India, milk cotton yarn, care instructions, custom commission).
   - HomePage (`page.js`) outputs FAQ Set B (handmade in India, available items, shipping duration, payment methods, custom colors).
   - Visible UI (`FaqSection.jsx`) outputs FAQ Set C (creations authentic handmade, milk cotton vs acrylic, delivery & COD, wash & care, custom bespoke commission).
   Search engines see two competing FAQPage schemas, neither of which matches the on-page text verbatim.
3. **Missing Category FAQ Schema**:  
   `src/data/categories.js` contains 16 rich, category-specific FAQs. These are rendered visibly in the accordion on `/collections/[slug]`, but **zero JSON-LD markup is output for them**. The schema generator was left in `src/app/category/[slug]/layout.js`, which is dead code bypassed by the 308 redirect.

---

### 4.4 Collection & Article Schema Defects

1. **Semantic Syntax Error on `ListItem`**:  
   In `src/app/collections/[slug]/page.js:129-141`, the `ItemList` places `offers` and `image` directly on `ListItem`:
   ```javascript
   itemListElement: categoryProducts.map((p, index) => ({
     "@type": "ListItem",
     position: index + 1,
     url: `https://www.gococoon.store/product/${p.id}`,
     name: p.name,
     image: p.imgUrl,
     offers: { "@type": "Offer", price: p.price, ... } // INVALID ON LISTITEM
   }))
   ```
   Under Schema.org specifications, `ListItem` only accepts `position`, `item`, `name`, and `url`. `offers` belongs to a `Product` entity wrapped inside `item: { "@type": "Product", ... }`. Schema linters drop the `offers` object.
2. **Dual Conflicting Article Schemas**:  
   Every blog post renders both `BlogPosting` (from `layout.js`) and `Article` (from `page.js`) with divergent descriptions and image formats.
3. **Google Vector Logo Violation**:  
   `src/app/layout.js:144` and `src/app/blog/[slug]/layout.js:83` supply `logo: "https://www.gococoon.store/icon.svg"`. Google Organization and Article rich results guidelines state: *"The logo must be a bitmap (such as .jpg, .png, or .webp) rather than a vector (.svg) file."*
4. **Deprecated Sitelinks Searchbox**:  
   `src/app/layout.js:127-134` defines a `SearchAction` with `urlTemplate: "https://www.gococoon.store/#shop"` (lacking query parameter placeholders). Google officially deprecated the Sitelinks Searchbox feature in November 2024.

---

## 5. Content & 42-Keyword Density / Coverage Analysis

### 5.1 Master Keyword Inventory Table

All 42 target slow-fashion crochet keywords from `src/data/seoKeywords.js` and `src/app/layout.js:11-54` were audited across actual editorial body copy, headings, and descriptions (excluding meta keywords tags):

| # | Target Keyword | Blog Posts | Categories | Products | Home Copy | Total Content | Coverage Status | Placement & Optimization Assessment |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|---|
| 1 | `crochet bags` | 6 | 5 | 0 | 3 | 14 | Healthy | Primary pillar keyword; strong in category intros and blog |
| 2 | `crochet handbags` | 0 | 1 | 0 | 2 | 3 | Moderate | Used in bags category H1 and home copy; absent from products |
| 3 | `crochet purse` | 1 | 0 | 0 | 0 | 1 | Low Coverage | Only in blog post 1; absent from bags category copy & products |
| 4 | `crochet tote` | 2 | 0 | 0 | 0 | 2 | Low Coverage | Absent from bags category body copy |
| 5 | `crochet tote bag` | 1 | 0 | 0 | 0 | 1 | Low Coverage | Only in blog post 1 |
| 6 | `crochet sleeves` | 1 | 1 | 0 | 0 | 2 | Low Coverage | Present in phone-cases category and blog post 1 |
| 7 | `crochet accessories` | 1 | 0 | 0 | 0 | 1 | Low Coverage | Only in blog post 1 |
| 8 | `crochet cotton` | 0 | 0 | 0 | 0 | **0** | 🔴 **CRITICAL GAP** | Zero occurrences in any content or description |
| 9 | `cotton thread` | 1 | 0 | 5 | 0 | 6 | Healthy | Appears in product materials and blog post 1 |
| 10 | `organic cotton` | 2 | 3 | 2 | 0 | 7 | Healthy | Good distribution across categories and products |
| 11 | `crochet yarn` | 0 | 0 | 0 | 0 | **0** | 🔴 **CRITICAL GAP** | Zero occurrences in any content or description |
| 12 | `crochet crossbody bag` | 1 | 0 | 0 | 0 | 1 | Low Coverage | Only in blog post 1; absent from bags category copy |
| 13 | `needle and thread` | 2 | 0 | 0 | 1 | 3 | Healthy | Appears in homepage H1 and blog post 1 |
| 14 | `cotton yarn for crochet`| 2 | 0 | 0 | 0 | 2 | Low Coverage | Only in blog post 1 |
| 15 | `milk cotton yarn` | 4 | 1 | 2 | 2 | 9 | Healthy | Core brand material; good distribution |
| 16 | `crochet belt` | 1 | 0 | 0 | 0 | 1 | Low Coverage | Absent from belts category body copy (only in meta) |
| 17 | `crochet shoulder bag` | 1 | 0 | 0 | 0 | 1 | Low Coverage | Only in blog post 1 |
| 18 | `cotton yarn` | 8 | 2 | 6 | 2 | 18 | Healthy | Strong natural distribution across products & stories |
| 19 | `organic cotton yarn` | 0 | 1 | 0 | 0 | 1 | Low Coverage | Present in belts FAQ only |
| 20 | `granny square` | 4 | 1 | 3 | 0 | 8 | Healthy | Prominent in sunflower bags & phone sleeves |
| 21 | `crochet needle` | 0 | 0 | 0 | 0 | **0** | 🔴 **CRITICAL GAP** | Zero occurrences in any content or description |
| 22 | `handmade crochet bags` | 0 | 0 | 0 | 0 | **0** | 🔴 **CRITICAL GAP** | Zero occurrences in content body (only in meta arrays) |
| 23 | `cotton cord` | 4 | 0 | 2 | 0 | 6 | Healthy | Used in bags material descriptions and care guide |
| 24 | `crochet thread` | 2 | 0 | 0 | 0 | 2 | Low Coverage | Only in blog post 1 |
| 25 | `milk cotton` | 24 | 11 | 7 | 10 | 52 | High Frequency | Primary material keyword, healthy natural density |
| 26 | `crochet pouch` | 1 | 1 | 0 | 0 | 2 | Low Coverage | Used in blog post 1 and phone-cases intro |
| 27 | `crochet sling bag` | 1 | 0 | 0 | 0 | 1 | Low Coverage | Only in blog post 1 |
| 28 | `crochet hooks` | 1 | 0 | 0 | 1 | 2 | Low Coverage | Used in blog post 1 and blog post 4 |
| 29 | `crochet hand bag` | 1 | 0 | 0 | 0 | 1 | Low Coverage | Spelled with space; only in blog post 1 |
| 30 | `crochet shop` | 1 | 0 | 0 | 0 | 1 | Low Coverage | Only in blog post 1 |
| 31 | `pink crochet bag` | 1 | 0 | 0 | 0 | 1 | Low Coverage | Only in blog post 1 |
| 32 | `crochet scarf` | 1 | 0 | 0 | 0 | 1 | Low Coverage | Used for waist scarf in blog |
| 33 | `crochet cotton thread` | 0 | 0 | 0 | 0 | **0** | 🔴 **CRITICAL GAP** | Zero occurrences in any content |
| 34 | `mercerized cotton yarn`| 1 | 0 | 0 | 0 | 1 | Low Coverage | Only in blog post 1 |
| 35 | `granny crochet` | 1 | 0 | 0 | 0 | 1 | Low Coverage | Only in blog post 1 |
| 36 | `crochet headband` | 1 | 0 | 0 | 0 | 1 | Low Coverage | Absent from bandanas category body text |
| 37 | `granny square crochet` | 1 | 0 | 0 | 0 | 1 | Low Coverage | Only in blog post 1 |
| 38 | `crochet granny square` | 0 | 0 | 0 | 0 | **0** | 🔴 **CRITICAL GAP** | Zero occurrences in content |
| 39 | `Cocoon` | 15 | 23 | 1 | 17 | 56 | High Frequency | Primary brand name |
| 40 | `Cocoon store` | 0 | 0 | 0 | 0 | **0** | 🔴 **CRITICAL GAP** | Zero occurrences in body text |
| 41 | `gococoon.store` | 0 | 0 | 0 | 5 | 5 | Healthy | Domain anchor / copyright |
| 42 | `COCOON crochet` | 1 | 5 | 0 | 0 | 6 | Healthy | Used in category headings |

---

### 5.2 Content Deficiencies & Quality Analysis

1. **The 7 Zero-Occurrence Keywords**:  
   `crochet cotton`, `crochet yarn`, `crochet needle`, `handmade crochet bags`, `crochet cotton thread`, `crochet granny square`, and `Cocoon store` do not appear anywhere in editorial body copy or product descriptions. Major high-converting transactional terms like `handmade crochet bags` are completely absent from product copy.
2. **Severe Keyword Cramming in Blog Post 1**:  
   In `src/data/blogPosts.js:18-25` (`crochet-bags-totes-and-yarn-guide`), **over 25 distinct target keywords are stuffed in bold tags across just 3 short paragraphs**:
   > `crochet tote bag`, `crochet handbag`, `cotton cord`, `crochet crossbody bag`, `needle and thread`, `crochet purse`, `granny square pouch`, `crochet thread`, `organic milk cotton yarn`, `mercerized cotton yarn`, `cotton yarn for crochet`, `milk cotton`, `organic cotton`, `granny square crochet`, `granny crochet`, `crochet shoulder bag`, `pink crochet bag`, `crochet hand bag`, `crochet headband`, `crochet belt`, `crochet scarf`, `cotton yarn`, `crochet hooks`, `crochet shop`, `crochet sleeves`, `crochet pouch`, `crochet sling bag`.
   
   *Risk*: This aggressive keyword stuffing violates Google's **Helpful Content System** and **Spam Policies** on unnatural keyword repetition, risking an algorithmic penalty.
3. **Product Copy Under-utilization**:  
   In `src/data/products.js`, product descriptions utilize only **8 of the 42 target keywords**. Product descriptions average only 25–40 words, missing out on rich long-tail queries regarding dimensions, styling ideas, and artisanal crafting techniques.

---

## 6. Local Codebase vs Live Production Parity Matrix

The following matrix compares the local Next.js 16 source code definitions against live HTTP network responses captured from `https://www.gococoon.store`:

| Key URL Endpoint | Local Codebase Definition | Live Production HTTP Response | Status & Divergence Finding |
|---|---|---|:---:|
| **`/` (Homepage)** | Root `layout.js` + `Preset4.jsx` + `page.js:72` | HTTP 200 OK; Title: 60 chars; 2 JSON-LD scripts (4 entities: `WebSite`, `ClothingStore`, 2x `FAQPage`) | 🔴 **Duplicate conflicting FAQPage schemas confirmed live.** |
| **`/shop`** | `src/app/shop/layout.js:1-6` (`robots: { index: false, follow: false }`) | HTTP 200 OK; `<meta name="robots" content="noindex, nofollow"/>` | 🔴 **CRITICAL: Catalog portal deindexed in production.** |
| **`/admin`** | `src/app/admin/page.js` (`"use client"`, no metadata); `robots.js` disallows `/admin/` | HTTP 200 OK; `<meta name="robots" content="index, follow"/>` | 🔴 **CRITICAL: Admin management portal publicly indexable.** |
| **`/collections/bags`** | `src/app/collections/[slug]/page.js:31` | HTTP 200 OK; Title: 77 chars (Truncated); 3 JSON-LD scripts; BreadcrumbList + CollectionPage | 🔴 **Double branding truncation; category FAQ schema missing live.** |
| **`/product/1`** | `product/[id]/layout.js` + `product/[id]/page.js` | HTTP 200 OK; Title: 80 chars; 4 JSON-LD scripts; 2 separate `Product` schemas (`COCOON-1` & `GC-1`) | 🔴 **Dual conflicting Product entities confirmed live.** |
| **`/product/5`** | `product/[id]/layout.js` (27 reviews) vs `page.js` (fallback 4.9 / 14 reviews) | HTTP 200 OK; Script 2 has 27 reviews; Script 4 injects fake 4.9 rating and 14 reviews | 🔴 **Google Review Policy Violation confirmed live.** |
| **`/blog/crochet-bags...`**| `blog/[slug]/layout.js` (`BlogPosting`) vs `page.js` (`Article`) | HTTP 200 OK; Title: 114 chars; 3 JSON-LD scripts; both `BlogPosting` and `Article` present | 🔴 **Dual conflicting Article entities confirmed live.** |
| **`/privacy`** | `src/app/privacy/page.js:5-8` (omits canonical) | HTTP 200 OK; `<link rel="canonical" href="https://www.gococoon.store"/>` | 🔴 **Canonical inheritance bug confirmed live (points to home).** |
| **`/custom-order`** | `src/app/custom-order/page.js` (`"use client"`, no metadata) | HTTP 200 OK; `<link rel="canonical" href="https://www.gococoon.store"/>` | 🔴 **Canonical inheritance bug confirmed live (points to home).** |
| **`/sitemap.xml`** | `src/app/sitemap.js` (50 URLs, `lastModified: new Date()`) | HTTP 200 OK; Content-Type: `application/xml`; 50 URLs; `<lastmod>` set to dynamic crawl time | 🟡 **Dynamic timestamp antipattern confirmed live.** |
| **`/robots.txt`** | `src/app/robots.js` (`Disallow: /admin/`, `Host: https://...`) | HTTP 200 OK; Content-Type: `text/plain`; `Disallow: /admin/` present | 🟡 **Trailing slash loophole and invalid Host protocol confirmed.** |
| **`/journal`** | No route or redirect defined | **HTTP 404 Not Found** | 🔴 **Broken route; navigation links lead to dead end.** |
| **`/category/bags`** | `src/app/category/[slug]/page.js` (`permanentRedirect`) | **HTTP 308 Permanent Redirect** to `/collections/bags` | ✅ **Healthy 1-hop 308 redirect confirmed live.** |
| **`http://gococoon.store`**| Vercel Edge Routing | **HTTP 308** -> `https://gococoon.store/` -> **HTTP 308** -> `https://www.gococoon.store/` | 🟡 **2-hop redirect chain confirmed live.** |

---

## 7. Prioritized Actionable Recommendations & Remediation Roadmap

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     REMEDIATION ROADMAP PHASING                                        │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ TIER 1: HIGH PRIORITY (P0) → De-indexing, Security Leaks, Canonical Collapses, Policy Violations       │
│ TIER 2: MEDIUM PRIORITY (P1) → Schema Deduplication, Title Cleanup, Next.js Fonts & Images, Sitemap   │
│ TIER 3: LOW PRIORITY (P2) → Content Keyword Expansion, Blog Post 1 Refactoring, Story Schema, CSP     │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### Tier 1: High Priority (Critical Blockers & Policy Fixes — P0)

#### 1. Restore Catalog Indexability on `/shop`
- **File**: `src/app/shop/layout.js`
- **Action**: Delete `src/app/shop/layout.js` or replace lines 1–6 with an explicit indexation directive and self-referencing canonical.

**Target Code Replacement (`src/app/shop/layout.js:1-6`)**:
```javascript
export const metadata = {
  title: "All Drops & Handcrafted Vault",
  description: "Browse the complete Cocoon vault of slow-crafted crochet bags, totes, bandanas, waist wraps, and hair accessories handmade in India.",
  alternates: {
    canonical: "https://www.gococoon.store/shop",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
```

---

#### 2. Close Admin Indexation Security & SEO Leak
- **Files**: `src/app/robots.js:7` and create `src/app/admin/layout.js`
- **Action**:
  1. In `src/app/robots.js:7`, update the disallow rule to catch `/admin` both with and without trailing slash.
  2. Create `src/app/admin/layout.js` exporting explicit `noindex, nofollow` metadata.

**Code Replacement 1 (`src/app/robots.js:7`)**:
```javascript
// Replace:
disallow: ["/admin/", "/api/", "/cart", "/wishlist", "/profile", "/login", "/review"],
// With:
disallow: ["/admin", "/admin/", "/api", "/api/", "/cart", "/wishlist", "/profile", "/login", "/review"],
```

**Code Creation (`src/app/admin/layout.js`)**:
```javascript
export const metadata = {
  title: "Admin Dashboard | Cocoon",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({ children }) {
  return children;
}
```

---

#### 3. Eliminate Fake Review Fallback Violation in Product Schema
- **File**: `src/app/product/[id]/page.js:777-782`
- **Action**: Remove the fabricated fallback `ratingValue: "4.9"` and `reviewCount: "14"`. Only output `aggregateRating` when real, verified customer reviews exist in the database.

**Target Code Replacement (`src/app/product/[id]/page.js:777-782`)**:
```javascript
// Replace:
aggregateRating: {
  "@type": "AggregateRating",
  ratingValue: reviewStats.count > 0 ? reviewStats.avg : "4.9",
  reviewCount: reviewStats.count > 0 ? String(reviewStats.count) : "14"
}

// With:
...(reviewStats.count > 0 ? {
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: reviewStats.avg.toString(),
    reviewCount: reviewStats.count.toString(),
    bestRating: "5",
    worstRating: "1"
  }
} : {})
```

---

#### 4. Fix Canonical Inheritance Collapse on Policy & Custom Pages
- **Files**:
  - `src/app/layout.js:59-61`
  - `src/app/privacy/page.js:5-8`
  - `src/app/terms/page.js:5-8`
  - `src/app/refund/page.js:5-8`
  - `src/app/cookies/page.js:5-8`
  - Create `src/app/custom-order/layout.js`
- **Action**: Remove static `alternates.canonical` from root `layout.js` so it does not falsely cascade. Add explicit self-referencing canonicals to all utility and custom pages.

**Code Modification in `src/app/layout.js:58-61`**:
```javascript
// Replace:
metadataBase: new URL("https://www.gococoon.store"),
alternates: {
  canonical: "https://www.gococoon.store",
},

// With:
metadataBase: new URL("https://www.gococoon.store"),
// (Omit global alternates.canonical so child routes resolve relative to their own path)
```

**Code Replacement for Policy Pages (e.g. `src/app/privacy/page.js:5-8`)**:
```javascript
export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy and DPDP Act 2023 compliance for COCOON Artisanal Studio.",
  alternates: {
    canonical: "https://www.gococoon.store/privacy",
  },
};
```
*(Apply identical pattern with appropriate canonicals to `terms/page.js`, `refund/page.js`, and `cookies/page.js`)*.

**Code Creation (`src/app/custom-order/layout.js`)**:
```javascript
export const metadata = {
  title: "Bespoke Custom Crochet Commissions",
  description: "Commission bespoke handcrafted crochet bags, personalized shade palettes, and heirloom knitwear directly with artisan Mehak Agarwal.",
  alternates: {
    canonical: "https://www.gococoon.store/custom-order",
  },
};

export default function CustomOrderLayout({ children }) {
  return children;
}
```

---

#### 5. Remove Site-Wide FAQ Schema Leakage from RootLayout
- **File**: `src/app/layout.js:192-238, 253-258`
- **Action**: Remove the `FAQPage` object from the `structuredData` array in `RootLayout`. Keep `FAQPage` markup exclusively on pages that visibly render FAQ accordions (`src/app/page.js` and `src/app/collections/[slug]/page.js`).

**Target Code Modification (`src/app/layout.js:118-240`)**:
```javascript
// Keep only WebSite and Organization / OnlineStore in RootLayout:
const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.gococoon.store/#website",
    name: "Cocoon",
    alternateName: ["COCOON", "Cocoon Crochet", "Cocoon Store", "COCOON Handcrafted Crochet"],
    url: "https://www.gococoon.store",
    inLanguage: "en-IN"
  },
  {
    "@context": "https://schema.org",
    "@type": ["OnlineStore", "Organization"],
    "@id": "https://www.gococoon.store/#store",
    name: "Cocoon",
    alternateName: "COCOON Handcrafted Crochet Boutique",
    url: "https://www.gococoon.store",
    logo: "https://www.gococoon.store/logo-512.png", // Use bitmap PNG
    image: "https://www.gococoon.store/instagram-post.jpg",
    description: "Slow-crafted organic milk cotton crochet essentials, handbags, hair accessories, waist belts, bandanas, and bespoke heirloom gifts handmade knot-by-knot in India by Mehak Agarwal.",
    founder: {
      "@type": "Person",
      name: "Mehak Agarwal",
      jobTitle: "Lead Artisan & Founder",
      url: "https://www.gococoon.store/story"
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Artisan Studio",
      addressLocality: "Agra",
      addressRegion: "Uttar Pradesh",
      postalCode: "282001",
      addressCountry: "IN"
    },
    email: "support@gococoon.store",
    telephone: "+91-8171902255",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash on Delivery, UPI, Credit Card, Debit Card, Net Banking"
  }
];
```

---

### Tier 2: Medium Priority (Architecture, CWV & Standards — P1)

#### 1. Consolidate Dual `Product` Schemas & Deduplicate Articles
- **Product Detail**: Remove `<script type="application/ld+json">` from `src/app/product/[id]/page.js:786-789`. Retain the comprehensive, merchant-policy-compliant `Product` and `BreadcrumbList` schemas in `src/app/product/[id]/layout.js`.
- **Blog Posts**: Remove the duplicate `Article` schema from `src/app/blog/[slug]/page.js:85-118`. Retain the `BlogPosting` schema in `src/app/blog/[slug]/layout.js` and add a `BreadcrumbList` schema.

---

#### 2. Fix Invalid `ListItem` Syntax & Restore Category FAQ Schema
- **File**: `src/app/collections/[slug]/page.js:129-141` & `page.js:148-155`
- **Action**: Wrap products inside `item: { "@type": "Product", ... }` and inject `FAQPage` schema for `catData.faqs`.

**Target Code Replacement (`src/app/collections/[slug]/page.js:126-143`)**:
```javascript
mainEntity: {
  "@type": "ItemList",
  numberOfItems: categoryProducts.length,
  itemListElement: categoryProducts.map((p, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Product",
      name: p.name,
      url: `https://www.gococoon.store/product/${p.id}`,
      image: p.imgUrl?.startsWith("http") ? p.imgUrl : `https://www.gococoon.store${p.imgUrl}`,
      offers: {
        "@type": "Offer",
        price: p.price,
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
      },
    },
  })),
},
```

**Add Category FAQ Schema (`src/app/collections/[slug]/page.js`)**:
```javascript
const categoryFaqSchema = catData.faqs?.length
  ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: catData.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.a,
        },
      })),
    }
  : null;

// Inject inside JSX return alongside breadcrumbSchema:
{categoryFaqSchema && (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryFaqSchema) }}
  />
)}
```

---

#### 3. Title Tag Double-Branding & SERP Truncation Cleanup
- **Action**: Strip redundant brand suffixes from child page titles so that the root template (`%s | Cocoon Crochet Boutique`) produces titles under 60 characters.

**Title Adjustments**:
- `src/app/collections/[slug]/page.js:31`:  
  Change `title: "${catData.name} | Cocoon Handcrafted Crochet India"` -> `title: catData.name`  
  *Result*: `"Handbags & Totes | Cocoon Crochet Boutique"` (42 chars — ✅ Optimal).
- `src/app/product/[id]/layout.js:23`:  
  Change `title: "${product.name} | Handcrafted Bags | Cocoon"` -> `title: product.name`  
  *Result*: `"Chocolate Bow Knot Handbag | Cocoon Crochet Boutique"` (53 chars — ✅ Optimal).
- `src/app/collections/page.js:8`:  
  Change `title: "All Handcrafted Crochet Collections | Cocoon India"` -> `title: "All Collections"`  
  *Result*: `"All Collections | Cocoon Crochet Boutique"` (40 chars — ✅ Optimal).
- `src/app/blog/page.js:7`:  
  Change to `title: "Artisan Journal & Crochet Guides"`  
  *Result*: `"Artisan Journal & Crochet Guides | Cocoon Crochet Boutique"` (55 chars — ✅ Optimal).

---

#### 4. Migrate Fonts to `next/font/google` to Eliminate FOUT/CLS
- **File**: `src/app/layout.js:247-252`
- **Action**: Remove external Google Fonts `<link>` tags. Use `next/font/google` to self-host font files with automatic size-adjust zero-CLS fallbacks.

**Implementation (`src/app/layout.js`)**:
```javascript
import { Cormorant_Garamond, Nunito_Sans } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-header",
  display: "swap",
});

const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${nunito.variable} max-w-full overflow-x-hidden`}>
      {/* ... */}
    </html>
  );
}
```

---

#### 5. Adopt `next/image` for LCP and Image Optimization
- **Files**: `src/components/presets/Preset4.jsx`, `src/app/product/[id]/page.js`, `src/components/CollectionFilterSort.jsx`
- **Action**: Replace raw HTML `<img>` with `import Image from "next/image"`.
  - Add `priority` to the desktop hero image and product main gallery image.
  - Set explicit `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`.
  - Add descriptive thumbnail `alt={`${product.name} view ${idx + 1}`}` at `src/app/product/[id]/page.js:863`.

---

#### 6. Fix Dynamic `new Date()` Timestamp in Sitemap
- **File**: `src/app/sitemap.js`
- **Action**: Replace `lastModified: new Date()` with static ISO timestamps for fixed policy pages and actual database update dates for products and collections.

---

#### 7. Add 301 Permanent Redirect for `/journal`
- **File**: `next.config.mjs:79`
- **Action**: Map `/journal` routes to `/blog`.

```javascript
async redirects() {
  return [
    {
      source: '/journal',
      destination: '/blog',
      permanent: true,
    },
    {
      source: '/journal/:slug*',
      destination: '/blog/:slug*',
      permanent: true,
    },
  ];
}
```

---

### Tier 3: Low Priority (Content & Long-Term Polish — P2)

#### 1. Content Expansion for 7 Zero-Occurrence Keywords
Naturally weave the 7 absent keywords into product descriptions and category intros:
- Add `handmade crochet bags`, `crochet cotton thread`, `crochet cotton`, and `crochet granny square` to product descriptions in `src/data/products.js` (e.g. Products 1, 5, 8, 12).
- Integrate `crochet yarn` and `crochet needle` into "Why Milk Cotton" brand guides and care pages.
- Add `Cocoon store` to footer company details and copyright anchors.

---

#### 2. Refactor Keyword Cramming in Blog Post 1
- **File**: `src/data/blogPosts.js:18-25`
- **Action**: Rewrite the 3 stuffed paragraphs in `crochet-bags-totes-and-yarn-guide`. Disperse the 25 keywords naturally across structured `<h2>` and `<h3>` subheadings (e.g. "Selecting the Right Cotton Cord for Totes", "Why Granny Squares Stand the Test of Time", "Styling Crossbody Bags"). Remove excessive bolded keyword lists.

---

#### 3. Add `AboutPage` & `Person` Schema to `/story`
- **File**: `src/app/story/page.js`
- **Action**: Add structured data linking Mehak Agarwal as founder and master artisan, establishing Google E-E-A-T entity authority.

---

#### 4. Security & Network Polish
- **File**: `next.config.mjs`
- **Action**: Configure a strict Content Security Policy (CSP) header and add `X-Robots-Tag: noindex, nofollow` headers for `/api/:path*`.
- **Vercel Routing**: Route `http://gococoon.store` directly to `https://www.gococoon.store` in a single 308 hop.
- **Accessibility**: Remove `maximumScale: 1` from `viewport` in `src/app/layout.js:111` to allow pinch-to-zoom. Remove `outline: none !important` from `:focus-visible` in `src/app/globals.css:198-201`.

---

## 8. Conclusion & Implementation Sign-off

The Cocoon handcrafted crochet boutique e-commerce application (`https://www.gococoon.store`) exhibits outstanding brand integrity, artisanal craftsmanship storytelling, and a modern Next.js 16 App Router architecture. However, technical debt and configuration oversights—most notably the **`/shop` catalog deindexation**, **`/admin` portal indexing leak**, **canonical inheritance collapse**, and **fabricated review schema fallback**—currently create severe vulnerabilities.

Executing the phased remediation roadmap outlined in this master audit report will:
1. **Immediately restore indexability** to the central product catalog (`/shop`).
2. **Eliminate Google Spam Policy violation risks** by removing fake review structured data.
3. **Consolidate crawl equity and ranking power** by fixing canonical inheritance on bespoke commissions and policy pages.
4. **Prevent SERP truncation** by streamlining title templates to 40–55 characters.
5. **Elevate Core Web Vitals and user experience** by migrating to `next/font/google` and `next/image`.
6. **Capture high-intent slow-fashion search traffic** across India by eliminating keyword gaps and expanding product copy.

*Report compiled and certified by Worker 1 (Master SEO Audit Report Compiler).*  
*Distribution: Teamwork Engineering Orchestrator, Reviewers, Challengers, and Forensic Auditors.*
