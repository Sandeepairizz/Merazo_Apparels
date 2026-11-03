const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Sandeep Kumar\\.gemini\\antigravity\\brain\\0113612f-5cb3-4af9-9506-adc9e65bdcf0';
const CHANGER_DIR = path.join(__dirname, '..', 'public', 'images', 'shirt-changer');
fs.mkdirSync(CHANGER_DIR, { recursive: true });

const men01 = path.join(ARTIFACT_DIR, 'men_01_1793678926524.jpg'); // Ivory
const men02 = path.join(ARTIFACT_DIR, 'men_02_1793678944745.jpg'); // Linen Sand
const men03 = path.join(ARTIFACT_DIR, 'men_03_1793679039136.jpg'); // Black Poplin
const men04 = path.join(ARTIFACT_DIR, 'men_04_1793679058782.jpg'); // Sage/Olive Twill

const women01 = path.join(ARTIFACT_DIR, 'women_01_1793678963448.jpg'); // Satin Black
const women02 = path.join(ARTIFACT_DIR, 'women_02_1793678982474.jpg'); // White Linen
const women03 = path.join(ARTIFACT_DIR, 'women_03_1793679079252.jpg'); // Sky Poplin
const women04 = path.join(ARTIFACT_DIR, 'women_04_1793679102077.jpg'); // Ivory Boyfriend

async function processChanger() {
  console.log('=== CREATING PHOTOGRAPHIC SHIRT CHANGER MODEL LAYERS ===');

  // Men variations (900x1200)
  // 1. Ivory -> men01
  await sharp(men01).resize(900, 1200, { fit: 'cover', position: 'top' }).png().toFile(path.join(CHANGER_DIR, 'men-ivory.png'));
  // 2. Black -> men03
  await sharp(men03).resize(900, 1200, { fit: 'cover', position: 'top' }).png().toFile(path.join(CHANGER_DIR, 'men-black.png'));
  // 3. Navy -> men03 with slight deep cool tint
  await sharp(men03).resize(900, 1200, { fit: 'cover', position: 'top' }).tint({ r: 24, g: 36, b: 54 }).png().toFile(path.join(CHANGER_DIR, 'men-navy.png'));
  // 4. Sage -> men04
  await sharp(men04).resize(900, 1200, { fit: 'cover', position: 'top' }).png().toFile(path.join(CHANGER_DIR, 'men-sage.png'));
  // 5. Burgundy -> men02 with deep burgundy tone
  await sharp(men02).resize(900, 1200, { fit: 'cover', position: 'top' }).tint({ r: 75, g: 25, b: 35 }).png().toFile(path.join(CHANGER_DIR, 'men-burgundy.png'));
  // 6. Sky -> men01 with sky blue tone
  await sharp(men01).resize(900, 1200, { fit: 'cover', position: 'top' }).tint({ r: 160, g: 190, b: 220 }).png().toFile(path.join(CHANGER_DIR, 'men-sky.png'));

  console.log('✓ Created 6 photographic Men layers');

  // Women variations (900x1200)
  // 1. Ivory -> women04
  await sharp(women04).resize(900, 1200, { fit: 'cover', position: 'top' }).png().toFile(path.join(CHANGER_DIR, 'women-ivory.png'));
  // 2. Black -> women01
  await sharp(women01).resize(900, 1200, { fit: 'cover', position: 'top' }).png().toFile(path.join(CHANGER_DIR, 'women-black.png'));
  // 3. Navy -> women01 with deep navy tint
  await sharp(women01).resize(900, 1200, { fit: 'cover', position: 'top' }).tint({ r: 20, g: 30, b: 50 }).png().toFile(path.join(CHANGER_DIR, 'women-navy.png'));
  // 4. Sage -> women02 with subtle sage olive tint
  await sharp(women02).resize(900, 1200, { fit: 'cover', position: 'top' }).tint({ r: 110, g: 125, b: 105 }).png().toFile(path.join(CHANGER_DIR, 'women-sage.png'));
  // 5. Burgundy -> women01 with burgundy tint
  await sharp(women01).resize(900, 1200, { fit: 'cover', position: 'top' }).tint({ r: 80, g: 25, b: 35 }).png().toFile(path.join(CHANGER_DIR, 'women-burgundy.png'));
  // 6. Sky -> women03
  await sharp(women03).resize(900, 1200, { fit: 'cover', position: 'top' }).png().toFile(path.join(CHANGER_DIR, 'women-sky.png'));

  console.log('✓ Created 6 photographic Women layers');

  // Orbit mini cards (120x120 square crop around chest/collar)
  const variants = ['ivory', 'black', 'navy', 'sage', 'burgundy', 'sky'];
  for (const v of variants) {
    const menFile = path.join(CHANGER_DIR, `men-${v}.png`);
    const womenFile = path.join(CHANGER_DIR, `women-${v}.png`);

    await sharp(menFile)
      .extract({ left: 300, top: 200, width: 320, height: 320 })
      .resize(120, 120)
      .png()
      .toFile(path.join(CHANGER_DIR, `card-men-${v}.png`));

    await sharp(womenFile)
      .extract({ left: 300, top: 200, width: 320, height: 320 })
      .resize(120, 120)
      .png()
      .toFile(path.join(CHANGER_DIR, `card-women-${v}.png`));
  }

  console.log('✓ Created 12 photographic orbit card miniatures');

  // Also fix Craft Section exact filenames
  const CRAFT_DIR = path.join(__dirname, '..', 'public', 'images', 'craft');
  const craftSource = path.join(ARTIFACT_DIR, 'craft_detail_1793679126723.jpg');

  // 1. linen-weave -> long-staple cotton texture
  const wPipe = sharp(craftSource).resize(1200, 1500, { fit: 'cover' });
  await wPipe.clone().webp({ quality: 86 }).toFile(path.join(CRAFT_DIR, 'linen-weave.webp'));
  await wPipe.clone().avif({ quality: 80 }).toFile(path.join(CRAFT_DIR, 'linen-weave.avif'));

  // 2. buttons -> mother of pearl macro
  const bPipe = sharp(craftSource).extract({ left: 300, top: 200, width: 500, height: 500 }).resize(1200, 1500, { fit: 'cover' });
  await bPipe.clone().webp({ quality: 86 }).toFile(path.join(CRAFT_DIR, 'buttons.webp'));
  await bPipe.clone().avif({ quality: 80 }).toFile(path.join(CRAFT_DIR, 'buttons.avif'));

  // 3. french-seam -> close up of lockstitching
  const sPipe = sharp(craftSource).extract({ left: 100, top: 100, width: 600, height: 600 }).resize(1200, 1500, { fit: 'cover' });
  await sPipe.clone().webp({ quality: 86 }).toFile(path.join(CRAFT_DIR, 'french-seam.webp'));
  await sPipe.clone().avif({ quality: 80 }).toFile(path.join(CRAFT_DIR, 'french-seam.avif'));

  // 4. cotton-fold -> drape from men_01
  const fPipe = sharp(men01).extract({ left: 200, top: 300, width: 500, height: 625 }).resize(1200, 1500, { fit: 'cover' });
  await fPipe.clone().webp({ quality: 86 }).toFile(path.join(CRAFT_DIR, 'cotton-fold.webp'));
  await fPipe.clone().avif({ quality: 80 }).toFile(path.join(CRAFT_DIR, 'cotton-fold.avif'));

  console.log('✓ Updated Craft Section exact image files (linen-weave, buttons, french-seam, cotton-fold)');
}

processChanger().catch(console.error);

