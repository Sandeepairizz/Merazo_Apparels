const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Sandeep Kumar\\.gemini\\antigravity\\brain\\0113612f-5cb3-4af9-9506-adc9e65bdcf0';
const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'images');

const allItems = [
  { src: path.join(ARTIFACT_DIR, 'men_01_1793678926524.jpg'), base: 'men-01' },
  { src: path.join(ARTIFACT_DIR, 'men_02_1793678944745.jpg'), base: 'men-02' },
  { src: path.join(ARTIFACT_DIR, 'men_03_1793679039136.jpg'), base: 'men-03' },
  { src: path.join(ARTIFACT_DIR, 'men_04_1793679058782.jpg'), base: 'men-04' },
  { src: path.join(ARTIFACT_DIR, 'women_01_1793678963448.jpg'), base: 'women-01' },
  { src: path.join(ARTIFACT_DIR, 'women_02_1793678982474.jpg'), base: 'women-02' },
  { src: path.join(ARTIFACT_DIR, 'women_03_1793679079252.jpg'), base: 'women-03' },
  { src: path.join(ARTIFACT_DIR, 'women_04_1793679102077.jpg'), base: 'women-04' },
];

const craftSource = path.join(ARTIFACT_DIR, 'craft_detail_1793679126723.jpg');

async function main() {
  const prodDir = path.join(PUBLIC_DIR, 'products');
  fs.mkdirSync(prodDir, { recursive: true });

  console.log('=== DEPLOYING ALL 8 PRODUCTS (PRIMARY + ALT) ===');
  for (const item of allItems) {
    if (!fs.existsSync(item.src)) {
      console.warn(`File missing: ${item.src}`);
      continue;
    }

    // 1. Primary portrait (1200x1500, 4:5)
    const primary = sharp(item.src).resize(1200, 1500, { fit: 'cover', position: 'top' });
    await primary.clone().webp({ quality: 86 }).toFile(path.join(prodDir, `${item.base}.webp`));
    await primary.clone().avif({ quality: 80 }).toFile(path.join(prodDir, `${item.base}.avif`));

    // 2. Alt detail crop (focus on collar / chest / texture)
    const meta = await sharp(item.src).metadata();
    const w = Math.round(meta.width * 0.65);
    const h = Math.round(w * 1.25);
    const left = Math.round((meta.width - w) / 2);
    const top = Math.round(meta.height * 0.12);

    const alt = sharp(item.src)
      .extract({ left, top, width: w, height: h })
      .resize(1200, 1500, { fit: 'cover' });

    await alt.clone().webp({ quality: 86 }).toFile(path.join(prodDir, `${item.base}-alt.webp`));
    await alt.clone().avif({ quality: 80 }).toFile(path.join(prodDir, `${item.base}-alt.avif`));

    console.log(`✓ Product deployed: ${item.base}`);
  }

  // 3. Categories (3 tall panels)
  console.log('\n=== DEPLOYING CATEGORIES (CLASSIC, RELAXED, TAILORED) ===');
  const catDir = path.join(PUBLIC_DIR, 'categories');
  fs.mkdirSync(catDir, { recursive: true });

  await sharp(allItems[0].src).resize(900, 1600, { fit: 'cover', position: 'top' }).webp({ quality: 86 }).toFile(path.join(catDir, 'classic.webp'));
  await sharp(allItems[0].src).resize(900, 1600, { fit: 'cover', position: 'top' }).avif({ quality: 80 }).toFile(path.join(catDir, 'classic.avif'));

  await sharp(allItems[1].src).resize(900, 1600, { fit: 'cover', position: 'top' }).webp({ quality: 86 }).toFile(path.join(catDir, 'relaxed.webp'));
  await sharp(allItems[1].src).resize(900, 1600, { fit: 'cover', position: 'top' }).avif({ quality: 80 }).toFile(path.join(catDir, 'relaxed.avif'));

  await sharp(allItems[4].src).resize(900, 1600, { fit: 'cover', position: 'top' }).webp({ quality: 86 }).toFile(path.join(catDir, 'tailored.webp'));
  await sharp(allItems[4].src).resize(900, 1600, { fit: 'cover', position: 'top' }).avif({ quality: 80 }).toFile(path.join(catDir, 'tailored.avif'));
  console.log('✓ Categories deployed');

  // 4. Horizontal Showcase (5 panels, 16:9 ratio: 1920x1080)
  console.log('\n=== DEPLOYING SHOWCASE PANELS (OXFORD, LINEN, OVERSHIRT, POPLIN, SATIN) ===');
  const showDir = path.join(PUBLIC_DIR, 'showcase');
  fs.mkdirSync(showDir, { recursive: true });

  const showcaseMap = [
    { src: allItems[0].src, name: 'oxford' },
    { src: allItems[1].src, name: 'linen' },
    { src: allItems[3].src, name: 'overshirt' },
    { src: allItems[2].src, name: 'poplin' },
    { src: allItems[4].src, name: 'satin' },
  ];

  for (const item of showcaseMap) {
    const sc = sharp(item.src).resize(1920, 1080, { fit: 'cover', position: 'top' });
    await sc.clone().webp({ quality: 86 }).toFile(path.join(showDir, `${item.name}.webp`));
    await sc.clone().avif({ quality: 80 }).toFile(path.join(showDir, `${item.name}.avif`));
    console.log(`✓ Showcase panel: ${item.name}`);
  }

  // 5. Craft Section
  console.log('\n=== DEPLOYING CRAFT SECTION IMAGES ===');
  const craftDir = path.join(PUBLIC_DIR, 'craft');
  fs.mkdirSync(craftDir, { recursive: true });

  const craftVariations = [
    { name: 'cotton', crop: { left: 0, top: 0 } },
    { name: 'buttons', crop: { left: 100, top: 50 } },
    { name: 'seams', crop: { left: 50, top: 100 } },
    { name: 'prewash', crop: { left: 80, top: 80 } },
  ];

  for (const c of craftVariations) {
    const pipe = sharp(craftSource).resize(1400, 1050, { fit: 'cover' });
    await pipe.clone().webp({ quality: 86 }).toFile(path.join(craftDir, `${c.name}.webp`));
    await pipe.clone().avif({ quality: 80 }).toFile(path.join(craftDir, `${c.name}.avif`));
    console.log(`✓ Craft visual: ${c.name}`);
  }

  // 6. Press Strip
  console.log('\n=== DEPLOYING PRESS BACKGROUND STRIP ===');
  const pressDir = path.join(PUBLIC_DIR, 'press');
  fs.mkdirSync(pressDir, { recursive: true });
  await sharp(allItems[2].src)
    .resize(2560, 1080, { fit: 'cover', position: 'center' })
    .webp({ quality: 85 })
    .toFile(path.join(pressDir, 'strip.webp'));
  await sharp(allItems[2].src)
    .resize(2560, 1080, { fit: 'cover', position: 'center' })
    .avif({ quality: 80 })
    .toFile(path.join(pressDir, 'strip.avif'));
  console.log('✓ Press strip deployed');

  // 7. Mosaic
  console.log('\n=== DEPLOYING MOSAIC COLUMNS ===');
  const mosaicDir = path.join(PUBLIC_DIR, 'mosaic');
  fs.mkdirSync(mosaicDir, { recursive: true });

  const mosaicSources = [
    allItems[0].src,
    allItems[1].src,
    allItems[2].src,
    allItems[3].src,
    allItems[4].src,
    allItems[5].src,
  ];

  for (let i = 0; i < 6; i++) {
    const idx = String(i + 1).padStart(2, '0');
    const mPipe = sharp(mosaicSources[i]).resize(800, 1200, { fit: 'cover', position: 'top' });
    await mPipe.clone().webp({ quality: 85 }).toFile(path.join(mosaicDir, `${idx}.webp`));
    await mPipe.clone().avif({ quality: 80 }).toFile(path.join(mosaicDir, `${idx}.avif`));
    console.log(`✓ Mosaic: ${idx}`);
  }

  console.log('\n[COMPLETE] All photographic campaign imagery successfully deployed!');
}

main().catch(console.error);
