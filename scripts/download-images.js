import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const imageMap = {
  // Hero (High-res split composition)
  'public/images/hero/hero-man.jpg': 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1600&q=85',
  'public/images/hero/hero-woman.jpg': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=85',

  // Preloader cards
  'public/images/preloader/card-1.jpg': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
  'public/images/preloader/card-2.jpg': 'https://images.unsplash.com/photo-1620012253295-c15c429fcc36?auto=format&fit=crop&w=600&q=80',
  'public/images/preloader/card-3.jpg': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',

  // Men Products (4:5)
  'public/images/products/men-oxford-1.jpg': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=85',
  'public/images/products/men-oxford-2.jpg': 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=85',
  'public/images/products/men-linen-1.jpg': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85',
  'public/images/products/men-linen-2.jpg': 'https://images.unsplash.com/photo-1620012253295-c15c429fcc36?auto=format&fit=crop&w=800&q=85',
  'public/images/products/men-poplin-1.jpg': 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=85',
  'public/images/products/men-poplin-2.jpg': 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=800&q=85',
  'public/images/products/men-twill-1.jpg': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=85',
  'public/images/products/men-twill-2.jpg': 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=85',

  // Women Products (4:5)
  'public/images/products/women-linen-1.jpg': 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=85',
  'public/images/products/women-linen-2.jpg': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=85',
  'public/images/products/women-poplin-1.jpg': 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=85',
  'public/images/products/women-poplin-2.jpg': 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=85',
  'public/images/products/women-oxford-1.jpg': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=85',
  'public/images/products/women-oxford-2.jpg': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85',
  'public/images/products/women-satin-1.jpg': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=85',
  'public/images/products/women-satin-2.jpg': 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=85',

  // Showcase Campaign (16:9)
  'public/images/showcase/oxford-campaign.jpg': 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=1600&q=85',
  'public/images/showcase/linen-campaign.jpg': 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=85',
  'public/images/showcase/overshirt-campaign.jpg': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=85',
  'public/images/showcase/poplin-campaign.jpg': 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=85',
  'public/images/showcase/satin-campaign.jpg': 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1600&q=85',

  // Categories (3:4)
  'public/images/categories/classic.jpg': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=85',
  'public/images/categories/relaxed.jpg': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85',
  'public/images/categories/tailored.jpg': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=85',

  // Craft details (macro / close up)
  'public/images/craft/cotton.jpg': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85',
  'public/images/craft/buttons.jpg': 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=85',
  'public/images/craft/seams.jpg': 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=800&q=85',
  'public/images/craft/fit.jpg': 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=85',

  // Lookbook model cutout & detail cards
  'public/images/lookbook/model-cutout.png': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85',
  'public/images/details/collar.jpg': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80',
  'public/images/details/cuff.jpg': 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80',
  'public/images/details/button.jpg': 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=400&q=80',
  'public/images/details/weave.jpg': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80',
  'public/images/details/seam.jpg': 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=400&q=80',

  // Newsletter mosaic
  'public/images/newsletter/mosaic-1.jpg': 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=500&q=80',
  'public/images/newsletter/mosaic-2.jpg': 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=500&q=80',
  'public/images/newsletter/mosaic-3.jpg': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80',
  'public/images/newsletter/mosaic-4.jpg': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=500&q=80',
  'public/images/newsletter/mosaic-5.jpg': 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=500&q=80',
  'public/images/newsletter/mosaic-6.jpg': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

async function main() {
  console.log('Downloading high-res editorial fashion images...');
  const entries = Object.entries(imageMap);
  let count = 0;
  for (const [dest, url] of entries) {
    try {
      await download(url, dest);
      count++;
      process.stdout.write(`[${count}/${entries.length}] Downloaded ${path.basename(dest)}\n`);
    } catch (err) {
      console.error(`Failed ${dest}:`, err.message);
    }
  }
  console.log(`\nSuccessfully downloaded ${count} images!`);
}

main();

