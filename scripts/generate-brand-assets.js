import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const svgBuffer = fs.readFileSync('public/favicon.svg');

async function generateBrandAssets() {
  console.log('Generating brand icons and manifest...');

  // Apple touch icon (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile('public/apple-touch-icon.png');

  // PWA Icon 192 (192x192)
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile('public/icon-192.png');

  // PWA Icon 512 (512x512)
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile('public/icon-512.png');

  // Favicon 48x48 as favicon.ico
  await sharp(svgBuffer)
    .resize(48, 48)
    .png()
    .toFile('public/favicon.ico');

  // Web manifest
  const manifest = {
    name: "Merazo — Luxury Shirt House",
    short_name: "Merazo",
    description: "Cut with intent. Worn for years. Premium shirts for men and women.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#0A0A0A",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ]
  };
  fs.writeFileSync('public/site.webmanifest', JSON.stringify(manifest, null, 2));

  // OG Image 1200x630 using sharp composite with hero image if available
  const heroPath = 'public/images/hero/hero-main.webp';
  if (fs.existsSync(heroPath)) {
    const resizedHero = await sharp(heroPath)
      .resize(1200, 630, { fit: 'cover' })
      .modulate({ brightness: 0.65 })
      .toBuffer();

    const ogOverlaySvg = `
      <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="580" width="1200" height="4" fill="#E10600" />
        <text x="80" y="320" font-family="'Unbounded', sans-serif" font-weight="800" font-size="96" fill="#FFFFFF" letter-spacing="-3">MERAZO</text>
        <text x="80" y="375" font-family="'JetBrains Mono', monospace" font-size="18" fill="#E10600" letter-spacing="3">THE SHIRT, REDEFINED.</text>
        <text x="80" y="420" font-family="'Inter', sans-serif" font-size="18" fill="rgba(255,255,255,0.7)" letter-spacing="1">Cut with intent. Worn for years.</text>
      </svg>
    `;

    await sharp(resizedHero)
      .composite([{ input: Buffer.from(ogOverlaySvg) }])
      .jpeg({ quality: 90 })
      .toFile('public/og-image.jpg');
  }

  console.log('Brand assets generated successfully!');
}

generateBrandAssets();

