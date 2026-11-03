# MERAZO — Asset Manifest & Art Direction

> Brand Style: 85mm f/1.8, cinematic classic fashion advertisement, soft directional light, subtle 35mm film grain, muted neutral palette with deep blacks, hyper-detailed fabric texture, 8K, editorial campaign look, no text, no logos, no watermark.

---

## 1. Hero Campaign Carousel (6 Full-Bleed Slides)
Auto-playing full-screen horizontal slider (100vw × 100svh), flat push right→left, inner parallax lag, art-directed desktop (16:9 3200×1800) and mobile (9:16 1080×1920) in AVIF and WebP, derived from the core Merazo campaign imagery:

- **Slide 1 — WEAR IT OPEN. (`data-nav="dark"`):**
  - Desktop: `public/images/hero/slide-1.webp` & `slide-1.avif` (16:9, 3200×1800)
  - Mobile: `public/images/hero/slide-1-mobile.webp` & `slide-1-mobile.avif` (9:16, 1080×1920)
  - Layout: Left-aligned, bottom-third, drawn red underline on "OPEN.", mono sub "01 / FALL-WINTER 2026", CTA "EXPLORE COLLECTION".
- **Slide 2 — WHITE shirt (`data-nav="light"`):**
  - Desktop: `public/images/hero/slide-2.webp` & `slide-2.avif` (16:9, 3200×1800)
  - Mobile: `public/images/hero/slide-2-mobile.webp` & `slide-2-mobile.avif` (9:16, 1080×1920)
  - Layout: Centered middle, mixed weights (heavy display + italic), pulsing red accent dot + "NEW IN", mono sub "02 / POPLIN & TWILL", CTA "DISCOVER WHITE".
- **Slide 3 — RESORT ’26 (`data-nav="dark"`):**
  - Desktop: `public/images/hero/slide-3.webp` & `slide-3.avif` (16:9, 3200×1800)
  - Mobile: `public/images/hero/slide-3-mobile.webp` & `slide-3-mobile.avif` (9:16, 1080×1920)
  - Layout: Ultra-spaced serif caps (letter-spacing .2em), superscript ’26 in Signal Red, mono sub "03 / RELAXED LINEN", CTA "VIEW CAMPAIGN".
- **Slide 4 — SIGNATURE / SHIRTS (`data-nav="light"`):**
  - Desktop: `public/images/hero/slide-4.webp` & `slide-4.avif` (16:9, 3200×1800)
  - Mobile: `public/images/hero/slide-4-mobile.webp` & `slide-4-mobile.avif` (9:16, 1080×1920)
  - Layout: Stacked right-aligned, mono sub "04 / PERMANENT LINE" with list "01 OXFORD · 02 POPLIN · 03 LINEN", CTA "SHOP SIGNATURES".
- **Slide 5 — THE SATIN / HOUR. (`data-nav="dark"`):**
  - Desktop: `public/images/hero/slide-5.webp` & `slide-5.avif` (16:9, 3200×1800)
  - Mobile: `public/images/hero/slide-5-mobile.webp` & `slide-5-mobile.avif` (9:16, 1080×1920)
  - Layout: Massive center-aligned, accent period ".", mono sub "05 / EVENING WEAR", CTA "SHOP EVENING".
- **Slide 6 — LINEN SEASON (`data-nav="dark"`):**
  - Desktop: `public/images/hero/slide-6.webp` & `slide-6.avif` (16:9, 3200×1800)
  - Mobile: `public/images/hero/slide-6-mobile.webp` & `slide-6-mobile.avif` (9:16, 1080×1920)
  - Layout: Bottom-left, floating accent outline pill "MEMBERS ENJOY 15% OFF AT CHECKOUT", mono sub "06 / ARCHIVE RE-ISSUE", CTA "CLAIM ACCESS".

---

## 2. Try It On (Signature Interactive Virtual Showroom)
Pure white studio stage, automatic V-track flow (right→left) passing behind central model cutout, 12 cards total (6 shirts × 2 loops), active slot 5 crossfades model shirt within 0.35s:

- **Women Models (1200×1600 Transparent WebP):**
  - `tryon/women/model-oxford.webp` (Ivory Oxford)
  - `tryon/women/model-poplin.webp` (Ink Black Poplin)
  - `tryon/women/model-linen.webp` (Sage Linen)
  - `tryon/women/model-twill.webp` (Deep Navy Twill)
  - `tryon/women/model-satin.webp` (Burgundy Satin)
  - `tryon/women/model-chambray.webp` (Sky Blue Chambray)
- **Men Models (1200×1600 Transparent WebP):**
  - `tryon/men/model-oxford.webp` (Ivory Oxford)
  - `tryon/men/model-poplin.webp` (Ink Black Poplin)
  - `tryon/men/model-linen.webp` (Sage Linen)
  - `tryon/men/model-twill.webp` (Deep Navy Twill)
  - `tryon/men/model-satin.webp` (Burgundy Satin)
  - `tryon/men/model-chambray.webp` (Sky Blue Chambray)
- **Product Card Shirts (800×800 Transparent WebP):**
  - `tryon/women/shirt-*.webp` (Oxford, Poplin, Linen, Twill, Satin, Chambray)
  - `tryon/men/shirt-*.webp` (Oxford, Poplin, Linen, Twill, Satin, Chambray)
- **Alignment QA:** Verified 0.33%–0.63% difference across all variants on non-shirt regions (Target: < 3.0%).

---

## 3. Products Grid (4:5)
Light grey-warm seamless studio backdrop, consistent distance and framing:

- **Men:**
  - `products/men-01.webp` & `men-01.avif`: Oxford Ivory
  - `products/men-01-alt.webp` & `men-01-alt.avif`: Oxford Ivory (Collar & Yoke angle)
  - `products/men-02.webp` & `men-02.avif`: Linen Sand
  - `products/men-02-alt.webp` & `men-02-alt.avif`: Linen Sand (Weave texture)
  - `products/men-03.webp` & `men-03.avif`: Poplin Black
  - `products/men-03-alt.webp` & `men-03-alt.avif`: Poplin Black (Placket & Cuff)
  - `products/men-04.webp` & `men-04.avif`: Overshirt Olive
  - `products/men-04-alt.webp` & `men-04-alt.avif`: Overshirt Olive (Double-stitch pocket)
- **Women:**
  - `products/women-01.webp` & `women-01.avif`: Satin Black
  - `products/women-01-alt.webp` & `women-01-alt.avif`: Satin Black (Drape & Sheen)
  - `products/women-02.webp` & `women-02.avif`: Linen White
  - `products/women-02-alt.webp` & `women-02-alt.avif`: Linen White (Hemline & Slub)
  - `products/women-03.webp` & `women-03.avif`: Tailored Sky
  - `products/women-03-alt.webp` & `women-03-alt.avif`: Tailored Sky (Button row)
  - `products/women-04.webp` & `women-04.avif`: Relaxed Stone
  - `products/women-04-alt.webp` & `women-04-alt.avif`: Relaxed Stone (Vent & Seam)

---

## 4. Showcase (16:9 Cinematic Vintage-Ad)
- `showcase/oxford.webp` & `.avif`: Vintage architectural setting, structured Oxford cloth, signal-red prop.
- `showcase/linen.webp` & `.avif`: High summer atelier setting, breeze and airy linen drape.
- `showcase/overshirt.webp` & `.avif`: Heavyweight layering, tactile olive cotton overshirt.
- `showcase/poplin.webp` & `.avif`: Crisp high-contrast black poplin shirt in motion.
- `showcase/satin.webp` & `.avif`: Fluid evening light, subtle sheen and mother-of-pearl buttons.

---

## 5. Categories (3:4)
- `categories/classic.webp` & `.avif`: Crisp collar close-up and torso.
- `categories/relaxed.webp` & `.avif`: Oversized fit in walking motion.
- `categories/tailored.webp` & `.avif`: Fitted tailored silhouette, studio spotlight.

---

## 6. Craft (4:5 Macro)
- `craft/linen-weave.webp` & `.avif`: Long-staple cotton & linen macro on stone.
- `craft/buttons.webp` & `.avif`: Mother-of-pearl iridescent shell buttons.
- `craft/french-seam.webp` & `.avif`: French seams, double-folded edge.
- `craft/cotton-fold.webp` & `.avif`: Garment-washed pre-shrunk cotton folds.

---

## 7. Press & Editorial Strip (21:9)
- `press/strip.webp` & `.avif`: Moody tailor atelier with shirts lined along a brass rail.

---

## 8. Mosaic (Mixed Ratios)
- `mosaic/01.webp` ... `06.webp` & `.avif`: Rolled sleeves, cuff detail, atelier window, collar roll, street silhouette, folded stack.

---

## 9. Shop By Category (Isolated Apparel Cutouts)
Floating isolated product cutouts on transparent / white ground with subtle natural shadow:
- `shop-category/tshirt.webp`: Luxury heavyweight boxy cotton t-shirt.
- `shop-category/jeans.webp`: Vintage washed straight-leg selvedge denim jeans.
- `shop-category/sweater.webp`: Fine merino wool knit quarter-zip sweater.
- `shop-category/jacket.webp`: Structured double pocket zip-up overshirt jacket.
- `shop-category/polo.webp`: Tailored knit silk-cotton polo shirt.
- `shop-category/trouser.webp`: Pleated tailored wide-leg black wool trouser.
- `shop-category/shirt.webp`: Crisp structured luxury white poplin dress shirt.


