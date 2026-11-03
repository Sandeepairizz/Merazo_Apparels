import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

// Color palette
const BG_COLOR = '#E9E7E2';
const TEXT_COLOR = '#0A0A0A';
const ACCENT_COLOR = '#E10600';
const MUTED_COLOR = '#6B6B6B';

const manifest = [
  // Showcase (16:9)
  { category: 'showcase', name: 'oxford', w: 1920, h: 1080, title: 'OXFORD CAMPAIGN', desc: 'Vintage-ad scene, structured Oxford weave, model in motion, signal-red prop' },
  { category: 'showcase', name: 'linen', w: 1920, h: 1080, title: 'LINEN CAMPAIGN', desc: 'Summer atelier, breezy drape, relaxed tailored silhouette' },
  { category: 'showcase', name: 'overshirt', w: 1920, h: 1080, title: 'OVERSHIRT CAMPAIGN', desc: 'Heavyweight architectural drape, raw textures, muted olive tone' },
  { category: 'showcase', name: 'poplin', w: 1920, h: 1080, title: 'POPLIN CAMPAIGN', desc: 'High-contrast studio, crisp paper-light cotton, pure obsidian shadow' },
  { category: 'showcase', name: 'satin', w: 1920, h: 1080, title: 'SATIN CAMPAIGN', desc: 'Evening chiaroscuro, silk-cotton lustre, refined button detail' },

  // Categories (3:4)
  { category: 'categories', name: 'classic', w: 1200, h: 1600, title: 'CLASSIC FIT', desc: 'Crisp collar close-up and torso, timeless proportions' },
  { category: 'categories', name: 'relaxed', w: 1200, h: 1600, title: 'RELAXED FIT', desc: 'Oversized drape in walking motion, unbuttoned collar' },
  { category: 'categories', name: 'tailored', w: 1200, h: 1600, title: 'TAILORED FIT', desc: 'Clean tapered shoulder and chest, studio spotlight' },

  // Craft (4:5)
  { category: 'craft', name: 'linen-weave', w: 1200, h: 1500, title: 'LONG-STAPLE COTTON &amp; LINEN', desc: 'Macro slub yarn texture on neutral stone' },
  { category: 'craft', name: 'buttons', w: 1200, h: 1500, title: 'MOTHER-OF-PEARL BUTTONS', desc: 'Hand-carved iridescent shell buttons on stitched placket' },
  { category: 'craft', name: 'french-seam', w: 1200, h: 1500, title: 'FRENCH SEAMS', desc: 'Clean double-folded enclosed seam precision macro' },
  { category: 'craft', name: 'cotton-fold', w: 1200, h: 1500, title: 'PRE-WASHED FIT &amp; DRAPE', desc: 'Soft structured roll and garment-washed cotton fold' },

  // Press (21:9)
  { category: 'press', name: 'strip', w: 2560, h: 1097, title: 'PRESS ATELIER', desc: 'Moody atelier, row of tailored shirts on a brass rail, shallow depth of field' },

  // Mosaic (mixed ratios)
  { category: 'mosaic', name: '01', w: 800, h: 1000, title: 'ROLLED SLEEVES', desc: 'Hand rolling a crisp poplin sleeve, studio light' },
  { category: 'mosaic', name: '02', w: 800, h: 1200, title: 'CUFF DETAIL', desc: 'Fine stitching and pearl button on tailored cuff' },
  { category: 'mosaic', name: '03', w: 800, h: 800, title: 'SUNLIT ATELIER', desc: 'Clean white shirt hanging in warm directional window light' },
  { category: 'mosaic', name: '04', w: 800, h: 1100, title: 'COLLAR ROLL', desc: 'Architectural collar spread, soft 35mm grain' },
  { category: 'mosaic', name: '05', w: 800, h: 900, title: 'STREET AT DUSK', desc: 'Evening campaign silhouette, deep blacks' },
  { category: 'mosaic', name: '06', w: 800, h: 1050, title: 'STACKED SHIRTS', desc: 'Precision-folded shirts on minimal concrete shelf' },

  // Products Men (4:5)
  { category: 'products', name: 'men-01', w: 1200, h: 1500, title: 'OXFORD IVORY', desc: 'Front view, tailored Oxford in ivory' },
  { category: 'products', name: 'men-01-alt', w: 1200, h: 1500, title: 'OXFORD IVORY / DETAIL', desc: 'Back yoke &amp; collar roll detail' },
  { category: 'products', name: 'men-02', w: 1200, h: 1500, title: 'LINEN SAND', desc: 'Front view, relaxed linen shirt in sand' },
  { category: 'products', name: 'men-02-alt', w: 1200, h: 1500, title: 'LINEN SAND / DETAIL', desc: 'Fabric texture close-up' },
  { category: 'products', name: 'men-03', w: 1200, h: 1500, title: 'POPLIN BLACK', desc: 'Front view, classic poplin in ink black' },
  { category: 'products', name: 'men-03-alt', w: 1200, h: 1500, title: 'POPLIN BLACK / DETAIL', desc: 'Cuff &amp; button placket angle' },
  { category: 'products', name: 'men-04', w: 1200, h: 1500, title: 'OVERSHIRT OLIVE', desc: 'Front view, structured overshirt in sage olive' },
  { category: 'products', name: 'men-04-alt', w: 1200, h: 1500, title: 'OVERSHIRT OLIVE / DETAIL', desc: 'Chest pocket &amp; double stitch detail' },

  // Products Women (4:5)
  { category: 'products', name: 'women-01', w: 1200, h: 1500, title: 'SATIN BLACK', desc: 'Front view, fluid silk-cotton satin shirt in black' },
  { category: 'products', name: 'women-01-alt', w: 1200, h: 1500, title: 'SATIN BLACK / DETAIL', desc: 'Draped sleeve and collar close-up' },
  { category: 'products', name: 'women-02', w: 1200, h: 1500, title: 'LINEN WHITE', desc: 'Front view, relaxed lightweight linen in optical white' },
  { category: 'products', name: 'women-02-alt', w: 1200, h: 1500, title: 'LINEN WHITE / DETAIL', desc: 'Texture &amp; hem drape detail' },
  { category: 'products', name: 'women-03', w: 1200, h: 1500, title: 'TAILORED SKY', desc: 'Front view, crisp poplin tailored shirt in sky blue' },
  { category: 'products', name: 'women-03-alt', w: 1200, h: 1500, title: 'TAILORED SKY / DETAIL', desc: 'Mother-of-pearl button row' },
  { category: 'products', name: 'women-04', w: 1200, h: 1500, title: 'RELAXED STONE', desc: 'Front view, boxy casual overshirt in warm stone' },
  { category: 'products', name: 'women-04-alt', w: 1200, h: 1500, title: 'RELAXED STONE / DETAIL', desc: 'French seam side vent angle' },
];

function createPlaceholderSvg(item) {
  return `
    <svg width="${item.w}" height="${item.h}" viewBox="0 0 ${item.w} ${item.h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#EDECE8" />
          <stop offset="50%" stop-color="#E4E1DB" />
          <stop offset="100%" stop-color="#DBD7D0" />
        </linearGradient>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="40" y2="0" stroke="rgba(10,10,10,0.03)" stroke-width="1" />
          <line x1="0" y1="0" x2="0" y2="40" stroke="rgba(10,10,10,0.03)" stroke-width="1" />
        </pattern>
      </defs>
      <rect width="${item.w}" height="${item.h}" fill="url(#g)" />
      <rect width="${item.w}" height="${item.h}" fill="url(#grid)" />
      <!-- Editorial hairline frame -->
      <rect x="24" y="24" width="${item.w - 48}" height="${item.h - 48}" fill="none" stroke="rgba(10,10,10,0.12)" stroke-width="1" />
      <!-- Editorial Typography -->
      <g transform="translate(${item.w / 2}, ${item.h / 2})">
        <text text-anchor="middle" y="-28" font-family="'JetBrains Mono', monospace" font-size="14" fill="${MUTED_COLOR}" letter-spacing="4">MERAZO CAMPAIGN · 85MM</text>
        <text text-anchor="middle" y="10" font-family="'Unbounded', sans-serif" font-weight="800" font-size="28" fill="${TEXT_COLOR}" letter-spacing="-1">${item.title}</text>
        <circle cx="0" cy="38" r="4" fill="${ACCENT_COLOR}" />
        <text text-anchor="middle" y="68" font-family="'Inter', sans-serif" font-size="13" fill="${MUTED_COLOR}" letter-spacing="0.5">${item.desc}</text>
        <text text-anchor="middle" y="96" font-family="'JetBrains Mono', monospace" font-size="11" fill="rgba(10,10,10,0.35)" letter-spacing="2">${item.w} × ${item.h} · EDITORIAL SPEC</text>
      </g>
    </svg>
  `;
}

// Shirt Changer transparent cutouts
const shirtChangerVariants = [
  { gender: 'men', color: 'ivory', hex: '#FAF9F5', name: 'IVORY OXFORD', fabric: 'Egyptian Cotton' },
  { gender: 'men', color: 'black', hex: '#141414', name: 'INK BLACK POPLIN', fabric: 'High-Density Poplin' },
  { gender: 'men', color: 'navy', hex: '#1C2638', name: 'DEEP NAVY TWILL', fabric: 'Combed Twill' },
  { gender: 'men', color: 'sage', hex: '#637060', name: 'SAGE LINEN', fabric: 'Washed Pure Linen' },
  { gender: 'men', color: 'burgundy', hex: '#4A1D24', name: 'BURGUNDY SATIN', fabric: 'Silk-Cotton Satin' },
  { gender: 'men', color: 'sky', hex: '#8BA5BF', name: 'SKY BLUE POPLIN', fabric: 'Crisp Poplin' },

  { gender: 'women', color: 'ivory', hex: '#FAF9F5', name: 'IVORY OXFORD', fabric: 'Egyptian Cotton' },
  { gender: 'women', color: 'black', hex: '#141414', name: 'INK BLACK POPLIN', fabric: 'High-Density Poplin' },
  { gender: 'women', color: 'navy', hex: '#1C2638', name: 'DEEP NAVY TWILL', fabric: 'Combed Twill' },
  { gender: 'women', color: 'sage', hex: '#637060', name: 'SAGE LINEN', fabric: 'Washed Pure Linen' },
  { gender: 'women', color: 'burgundy', hex: '#4A1D24', name: 'BURGUNDY SATIN', fabric: 'Silk-Cotton Satin' },
  { gender: 'women', color: 'sky', hex: '#8BA5BF', name: 'SKY BLUE POPLIN', fabric: 'Crisp Poplin' },
];

function createModelCutoutSvg(v) {
  // Model silhouette with shirt color filled precisely
  const isMen = v.gender === 'men';
  return `
    <svg width="900" height="1200" viewBox="0 0 900 1200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="rgba(10,10,10,0.18)" />
        </filter>
        <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${v.hex}" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="${v.hex}" stop-opacity="1"/>
        </linearGradient>
      </defs>
      <g filter="url(#shadow)">
        <!-- Head / Neck -->
        <circle cx="450" cy="180" r="70" fill="#D3BEA8" />
        <rect x="420" y="230" width="60" height="60" fill="#C4AF98" />
        
        <!-- Shirt Silhouette -->
        <path d="M 330 280 L 410 270 L 450 310 L 490 270 L 570 280 L 630 480 L 570 500 L 540 370 L 540 760 L 360 760 L 360 370 L 330 500 L 270 480 Z" 
              fill="url(#shirtGrad)" stroke="rgba(10,10,10,0.25)" stroke-width="2" />
        
        <!-- Collar Placket and Buttons -->
        <path d="M 410 270 L 450 320 L 490 270 L 470 260 L 450 285 L 430 260 Z" fill="#FFFFFF" opacity="0.15" />
        <line x1="450" y1="320" x2="450" y2="760" stroke="rgba(10,10,10,0.3)" stroke-width="2" />
        <!-- Buttons -->
        <circle cx="450" cy="360" r="4" fill="#FFFFFF" stroke="#6B6B6B" stroke-width="1" />
        <circle cx="450" cy="430" r="4" fill="#FFFFFF" stroke="#6B6B6B" stroke-width="1" />
        <circle cx="450" cy="500" r="4" fill="#FFFFFF" stroke="#6B6B6B" stroke-width="1" />
        <circle cx="450" cy="570" r="4" fill="#FFFFFF" stroke="#6B6B6B" stroke-width="1" />
        <circle cx="450" cy="640" r="4" fill="#FFFFFF" stroke="#6B6B6B" stroke-width="1" />

        <!-- Trousers / Legs -->
        <path d="M 360 760 L 540 760 L 530 1140 L 465 1140 L 450 840 L 435 1140 L 370 1140 Z" fill="#141414" />
      </g>
    </svg>
  `;
}

function createCardCutoutSvg(v) {
  // Small ghost mannequin shirt card
  return `
    <svg width="240" height="240" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="cshadow">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(10,10,10,0.15)" />
        </filter>
      </defs>
      <g filter="url(#cshadow)" transform="translate(15, 20) scale(0.85)">
        <path d="M 30 50 L 80 40 L 110 70 L 140 40 L 190 50 L 220 120 L 190 130 L 175 80 L 175 200 L 45 200 L 45 80 L 30 130 L 0 120 Z" 
              fill="${v.hex}" stroke="rgba(10,10,10,0.2)" stroke-width="1.5" />
        <path d="M 80 40 L 110 75 L 140 40 L 130 35 L 110 50 L 90 35 Z" fill="#FFFFFF" opacity="0.2" />
        <line x1="110" y1="75" x2="110" y2="200" stroke="rgba(10,10,10,0.3)" stroke-width="1.5" />
        <circle cx="110" cy="100" r="2.5" fill="#FFFFFF" stroke="#6B6B6B" stroke-width="0.5" />
        <circle cx="110" cy="135" r="2.5" fill="#FFFFFF" stroke="#6B6B6B" stroke-width="0.5" />
        <circle cx="110" cy="170" r="2.5" fill="#FFFFFF" stroke="#6B6B6B" stroke-width="0.5" />
      </g>
    </svg>
  `;
}

async function run() {
  console.log('Generating high-end asset manifest files (WebP + AVIF + PNG)...');

  // Ensure directories
  const dirs = [
    'public/images/hero',
    'public/images/showcase',
    'public/images/categories',
    'public/images/craft',
    'public/images/press',
    'public/images/mosaic',
    'public/images/products',
    'public/images/shirt-changer',
  ];
  dirs.forEach(d => fs.mkdirSync(d, { recursive: true }));

  // Generate manifest assets (WebP and AVIF)
  for (const item of manifest) {
    const svg = createPlaceholderSvg(item);
    const svgBuf = Buffer.from(svg);
    const webpPath = `public/images/${item.category}/${item.name}.webp`;
    const avifPath = `public/images/${item.category}/${item.name}.avif`;

    await sharp(svgBuf).webp({ quality: 90 }).toFile(webpPath);
    await sharp(svgBuf).avif({ quality: 85 }).toFile(avifPath);
    console.log(`[OK] Generated ${webpPath} & ${avifPath}`);
  }

  // Generate shirt-changer model cutouts & card cutouts (PNG)
  for (const v of shirtChangerVariants) {
    const modelSvg = createModelCutoutSvg(v);
    const cardSvg = createCardCutoutSvg(v);

    const modelPath = `public/images/shirt-changer/${v.gender}-${v.color}.png`;
    const cardPath = `public/images/shirt-changer/card-${v.gender}-${v.color}.png`;

    await sharp(Buffer.from(modelSvg)).png().toFile(modelPath);
    await sharp(Buffer.from(cardSvg)).png().toFile(cardPath);
    console.log(`[OK] Generated ${modelPath} & ${cardPath}`);
  }

  console.log('\nAll asset manifest files ready!');
}

run();
