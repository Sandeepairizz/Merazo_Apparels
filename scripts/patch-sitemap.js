import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('node_modules/@astrojs/sitemap/dist/index.js');
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('let _routes;')) {
    fs.writeFileSync(file, content.replace('let _routes;', 'let _routes = [];'));
  }
}

