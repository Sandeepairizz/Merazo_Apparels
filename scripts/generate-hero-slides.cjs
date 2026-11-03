const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const HERO_DIR = path.join(__dirname, '..', 'public', 'images', 'hero');
const ARTIFACT_DIR = 'C:\\Users\\Sandeep Kumar\\.gemini\\antigravity\\brain\\0113612f-5cb3-4af9-9506-adc9e65bdcf0';
fs.mkdirSync(HERO_DIR, { recursive: true });

// Input sources:
// Slide 1: hero.png / hero-main.webp
const src1 = path.join(HERO_DIR, 'hero.png');
// Slide 2: hero_2.png
const src2 = path.join(HERO_DIR, 'hero_2.png');
// Slide 3: men_02 (sand linen)
const src3 = path.join(ARTIFACT_DIR, 'men_02_1793678944745.jpg');
// Slide 4: women_03 (sky poplin)
const src4 = path.join(ARTIFACT_DIR, 'women_03_1793679079252.jpg');
// Slide 5: women_01 (satin black)
const src5 = path.join(ARTIFACT_DIR, 'women_01_1793678963448.jpg');
// Slide 6: women_02 (white linen)
const src6 = path.join(ARTIFACT_DIR, 'women_02_1793678982474.jpg');

const slides = [
  { id: 1, src: src1, pos: 'center' },
  { id: 2, src: src2, pos: 'center' },
  { id: 3, src: src3, pos: 'top' },
  { id: 4, src: src4, pos: 'top' },
  { id: 5, src: src5, pos: 'top' },
  { id: 6, src: src6, pos: 'top' },
];

async function generateHeroSlides() {
  console.log('=== GENERATING 6 ART-DIRECTED HERO SLIDES (DESKTOP 16:9 + MOBILE 9:16) ===');

  for (const s of slides) {
    if (!fs.existsSync(s.src)) {
      console.error(`Source not found for slide ${s.id}: ${s.src}`);
      continue;
    }

    console.log(`Processing Slide ${s.id}...`);

    // 1. Desktop 16:9 (3200x1800)
    const deskPipe = sharp(s.src).resize(3200, 1800, { fit: 'cover', position: s.pos });
    await deskPipe.clone().webp({ quality: 86 }).toFile(path.join(HERO_DIR, `slide-${s.id}.webp`));
    await deskPipe.clone().avif({ quality: 80 }).toFile(path.join(HERO_DIR, `slide-${s.id}.avif`));

    // 2. Mobile 9:16 (1080x1920) art-directed
    const mobPipe = sharp(s.src).resize(1080, 1920, { fit: 'cover', position: s.pos });
    await mobPipe.clone().webp({ quality: 86 }).toFile(path.join(HERO_DIR, `slide-${s.id}-mobile.webp`));
    await mobPipe.clone().avif({ quality: 80 }).toFile(path.join(HERO_DIR, `slide-${s.id}-mobile.avif`));

    console.log(`  ✓ Generated slide-${s.id} (desktop + mobile, WebP + AVIF)`);
  }

  console.log('\n[SUCCESS] All hero slide assets generated!');
}

generateHeroSlides().catch(console.error);

