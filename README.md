# Merazo — Premium Shirt Brand Website

> "Cut with intent. Worn for years."

A luxury, Awwwards-level single-page website for Merazo — premium shirts for men and women.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| **Astro 4** | Static site framework with React islands |
| **TypeScript** | Strict mode throughout |
| **GSAP + ScrollTrigger** | All scroll animations, preloader, pin, marquee |
| **Lenis** | Smooth scroll synced to GSAP ticker |
| **Framer Motion** | Magnetic buttons, 3D card tilt, mobile menu |
| **Tailwind CSS** | Utility classes (CSS vars for design tokens) |

---

## Project Structure

```
merazo/
├── public/
│   ├── images/           ← Replace SVG placeholders with real images
│   │   ├── hero/         ← hero-man.jpg, hero-woman.jpg (3200px+)
│   │   ├── preloader/    ← card-1/2/3.jpg (3:4)
│   │   ├── products/     ← men-*/women-* (4:5, 960×1200)
│   │   ├── showcase/     ← *-campaign.jpg (16:9, 1920×1080)
│   │   ├── categories/   ← classic/relaxed/tailored.jpg (3:4)
│   │   ├── craft/        ← cotton/buttons/seams/fit.jpg (4:5)
│   │   ├── lookbook/     ← model-cutout.png (transparent bg)
│   │   ├── details/      ← collar/cuff/button/weave/seam.jpg (square)
│   │   └── newsletter/   ← mosaic-1..6.jpg
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro          ← HTML shell, meta, JSON-LD
│   ├── pages/
│   │   └── index.astro           ← Single page, all sections
│   ├── components/
│   │   ├── Preloader.astro       ← Animated intro (GSAP)
│   │   ├── Nav.astro             ← Fixed nav, mix-blend-mode:difference
│   │   ├── Hero.astro            ← Split composition, H1 mask reveal
│   │   ├── Marquee.astro         ← Velocity-reactive infinite strip
│   │   ├── Manifesto.astro       ← Scrub word-opacity reveal
│   │   ├── FeaturedCollection.astro ← Men/Women tab + product grid
│   │   ├── HorizontalShowcase.astro ← Pinned horizontal scroll (5 panels)
│   │   ├── ExpandingCategories.astro ← flex-grow hover expansion
│   │   ├── CraftSection.astro    ← Sticky image swap on scroll
│   │   ├── LookbookOrbit.astro   ← Orbit cards on scroll scrub
│   │   ├── Testimonial.astro     ← Char-by-char quote reveal
│   │   ├── NewsletterFooter.astro ← Mosaic + rising wordmark
│   │   └── islands/
│   │       ├── ProductCardIsland.tsx ← Framer 3D tilt (client:visible)
│   │       ├── MagneticButton.tsx   ← Framer magnetic (client:idle)
│   │       └── MobileMenu.tsx       ← Framer full-screen menu (client:visible)
│   ├── scripts/
│   │   └── motion.ts             ← GSAP + Lenis master init
│   └── styles/
│       └── global.css            ← Design tokens, reset, components
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321)

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

---

## Deployment

### Vercel

```bash
npm i -g vercel
vercel
```

Set build command: `npm run build`  
Output directory: `dist`

### Netlify

```bash
npm i -g netlify-cli
netlify deploy --build
```

Or connect your repo in the Netlify dashboard:
- Build command: `npm run build`
- Publish directory: `dist`

---

## Image Requirements

Replace all `/public/images/**/*.jpg` placeholder SVGs with real editorial photography:

| Slot | Dimensions | Aspect | Notes |
|------|-----------|--------|-------|
| `hero/hero-man.jpg` | 3200×4267 | 3:4 | Eager load, `fetchpriority="high"` |
| `hero/hero-woman.jpg` | 3200×4267 | 3:4 | Eager load |
| `products/men-*.jpg` | 960×1200 | 4:5 | Primary + secondary per product |
| `showcase/*-campaign.jpg` | 1920×1080 | 16:9 | Full bleed cinematic |
| `categories/*.jpg` | 800×1067 | 3:4 | Tall editorial |
| `craft/*.jpg` | 720×900 | 4:5 | Close-up texture |
| `lookbook/model-cutout.png` | 600×900 | 2:3 | PNG with transparent bg |
| `details/*.jpg` | 320×320 | 1:1 | Product detail shots |
| `newsletter/mosaic-*.jpg` | 400×480 | 5:6 | Variety of looks |

---

## Design Tokens

Defined in `src/styles/global.css` as CSS custom properties:

```css
--white:     #FFFFFF
--off-white: #F6F5F2
--ink:       #0A0A0A
--accent:    #E10600   /* Signal Red — 10% accent */
--muted:     #6B6B6B
--line:      rgba(10,10,10,.12)

--font-display: 'Unbounded' 800
--font-body:    'Inter'
--font-mono:    'JetBrains Mono'

--text-h1: clamp(3rem, 11vw, 12rem)
--text-h2: clamp(2rem, 6vw, 6rem)
```

---

## Motion Architecture

All heavy animation lives in `src/scripts/motion.ts`:

- `initLenis()` — Smooth scroll with GSAP sync
- `initCursor()` — Custom cursor with quickTo
- `initPreloader()` — Counter + card shuffle + clip-path reveal
- `initManifestoScrub()` — Word opacity scrub
- `initMarquee()` — Velocity-reactive infinite marquee
- `initShowcase()` — Horizontal pin + progress bar
- `initCraftSection()` — Sticky image swap
- `initTestimonial()` — Char-by-char reveal
- `initFooterWordmark()` — Rising wordmark + SVG underline draw

React islands (Framer Motion):
- `ProductCardIsland` — 3D tilt, hover lift (`client:visible`)
- `MagneticButton` — Magnetic pull + fill sweep (`client:idle`)
- `MobileMenu` — Full-screen stagger overlay (`client:visible`)

---

## Accessibility

- Single `<h1>` on page
- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`
- Skip-to-content link
- `aria-label` on all interactive elements
- `role="tablist"` / `role="tab"` on collection toggle
- `prefers-reduced-motion` disables all heavy effects
- Touch targets ≥ 44px
- Color contrast AA compliant
- Focus rings: 2px accent, 3px offset

---

## Lighthouse Targets

| Metric | Target |
|--------|--------|
| Performance | 90+ |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

> Replace placeholder images with real WebP/AVIF optimized images to reach Perf 90+.

---

## Photography Brief

**Style:** Cinematic 35mm / 85mm lens look · soft film grain · directional window/studio light · muted warm-neutral tones · deep blacks · editorial poses · real fabric texture  
**Models:** Mixed ethnicity · natural expressions  
**No:** text in images · logos · stock photography look

---

*© 2024 Merazo Ltd. All rights reserved.*

