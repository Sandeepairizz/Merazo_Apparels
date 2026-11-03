const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 4321;
const DIST = path.join(__dirname, '..', 'dist');
const OUTPUT_DIR = path.join(__dirname, '..', 'reports', 'screenshots');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.xml': 'application/xml',
};

// Simple static server
const server = http.createServer((req, res) => {
  let cleanUrl = req.url.split('?')[0].split('#')[0];
  if (cleanUrl.endsWith('/')) cleanUrl += 'index.html';
  let filePath = path.join(DIST, cleanUrl);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    filePath = path.join(DIST, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  } catch (err) {
    res.writeHead(404);
    res.end('Not found');
  }
});

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const { res, rej } = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) rej(new Error(msg.error.message));
          else res(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((res, rej) => {
      const id = this.id++;
      this.callbacks.set(id, { res, rej });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));
  console.log(`[Static Server] Serving dist on http://127.0.0.1:${PORT}`);

  const chromePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe'),
  ];
  const chromePath = chromePaths.find((p) => fs.existsSync(p));
  if (!chromePath) {
    console.error('Chrome not found on host.');
    process.exit(1);
  }

  const os = require('os');
  const tempProfile = path.join(os.tmpdir(), `merazo-chrome-${Date.now()}`);
  fs.mkdirSync(tempProfile, { recursive: true });

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${tempProfile}`,
    '--no-sandbox',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1440,900',
    'about:blank',
  ]);
  chromeProc.stderr?.on('data', (d) => console.log('[Chrome stderr]', d.toString().trim()));
  chromeProc.on('exit', (code) => console.log('[Chrome exited with code]', code));

  let cdp = null;

  try {
    let versionData = null;
    for (let i = 0; i < 15; i++) {
      try {
        await sleep(600);
        const versionResp = await fetch('http://127.0.0.1:9222/json/version');
        versionData = await versionResp.json();
        if (versionData) break;
      } catch (e) {}
    }
    if (!versionData) throw new Error('Chrome remote debugging did not respond.');
    console.log('[Chrome] Browser:', versionData.Browser);

    const targetsResp = await fetch('http://127.0.0.1:9222/json/list');
    const targets = await targetsResp.json();
    const pageTarget = targets.find((t) => t.type === 'page' && t.url === 'about:blank') || targets.find((t) => t.type === 'page') || targets[0];
    const wsUrl = pageTarget.webSocketDebuggerUrl;
    console.log('[CDP] Connecting to page target:', wsUrl);

    cdp = new CDPClient(wsUrl);
    await cdp.connect();
    console.log('[CDP] Connected successfully');

    await cdp.send('Page.enable');
    await cdp.send('DOM.enable');
    await cdp.send('Runtime.enable');

    async function evaluate(expression) {
      const res = await cdp.send('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true,
      });
      return res.result?.value;
    }

    const ARTIFACT_DIR = 'C:\\Users\\Sandeep Kumar\\.gemini\\antigravity\\brain\\0113612f-5cb3-4af9-9506-adc9e65bdcf0';

    async function takeScreenshot(filename) {
      const { data } = await cdp.send('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: false,
      });
      const buffer = Buffer.from(data, 'base64');
      const filePath = path.join(OUTPUT_DIR, filename);
      fs.writeFileSync(filePath, buffer);
      try {
        fs.writeFileSync(path.join(ARTIFACT_DIR, filename), buffer);
      } catch (e) {}
      console.log(`[Captured] ${filename} (${(data.length / 1024).toFixed(1)} KB)`);
    }

    // ─────────────────────────────────────────────────────────────
    // 1. DESKTOP TESTS (1440 x 900)
    // ─────────────────────────────────────────────────────────────
    console.log('\n=== RUNNING DESKTOP (1440x900) TESTS ===');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    console.log('[Navigate] Loading page with ?skip-preloader=1');
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/?skip-preloader=1` });
    await sleep(2500);

    // 1.1 Hero Section
    await takeScreenshot('desktop-01-hero-slide1.png');

    console.log('[Interaction] Testing Hero Slider Next Slide');
    await evaluate(`document.getElementById('hero-next')?.click();`);
    await sleep(1500);
    await takeScreenshot('desktop-01b-hero-slide2.png');

    // Scrolled Navbar Test
    console.log('[Interaction] Testing Scrolled Navbar State past Hero');
    await evaluate(`window.scrollTo({ top: 400, behavior: 'instant' });`);
    await sleep(800);
    await takeScreenshot('desktop-01c-nav-scrolled.png');

    // 1.2 Shop By Category with Real Models
    await evaluate(`document.querySelector('#shop-by-category')?.scrollIntoView({ behavior: 'instant', block: 'start' });`);
    await sleep(1000);
    await takeScreenshot('desktop-02-shop-by-category.png');

    // 1.3 Trending Section (Priority High-Converting 2-Row Grid)
    console.log('[Interaction] Testing Trending Section & Filter Tabs');
    await evaluate(`document.querySelector('#trending')?.scrollIntoView({ behavior: 'instant', block: 'start' });`);
    await sleep(1000);
    await takeScreenshot('desktop-03-trending-grid.png');

    await evaluate(`
      const shirtTab = document.querySelector('.trending__tab[data-filter="shirts"]');
      if (shirtTab) shirtTab.click();
    `);
    await sleep(600);
    await takeScreenshot('desktop-03b-trending-filtered.png');

    await evaluate(`
      const allTab = document.querySelector('.trending__tab[data-filter="all"]');
      if (allTab) allTab.click();
    `);
    await sleep(400);

    // 1.4 Featured Collection
    await evaluate(`document.querySelector('#collection')?.scrollIntoView({ behavior: 'instant', block: 'start' });`);
    await sleep(1000);
    await takeScreenshot('desktop-04-collection.png');

    console.log('[Interaction] Testing Collection Gender Toggle');
    await evaluate(`
      const womenBtn = document.getElementById('tab-women');
      if (womenBtn) womenBtn.click();
    `);
    await sleep(1000);
    await takeScreenshot('desktop-04b-collection-women-toggle.png');

    // 1.5 Try It On Showroom
    await evaluate(`document.querySelector('#shirt-changer')?.scrollIntoView({ behavior: 'instant', block: 'start' });`);
    await sleep(1200);
    await takeScreenshot('desktop-05-tryon-showroom.png');

    // 1.6 Horizontal Showcase Section (Fixed smooth pinning)
    await evaluate(`document.querySelector('#showcase')?.scrollIntoView({ behavior: 'instant', block: 'start' });`);
    await sleep(1000);
    await takeScreenshot('desktop-06-showcase.png');

    // 1.7 Craft Section
    await evaluate(`document.querySelector('#craft')?.scrollIntoView({ behavior: 'instant', block: 'start' });`);
    await sleep(1000);
    await takeScreenshot('desktop-07-craft.png');

    // 1.8 Fit Proportions
    await evaluate(`document.querySelector('#categories')?.scrollIntoView({ behavior: 'instant', block: 'start' });`);
    await sleep(1000);
    await takeScreenshot('desktop-08-categories.png');

    // 1.9 Press & Reviews
    await evaluate(`document.querySelector('#press')?.scrollIntoView({ behavior: 'instant', block: 'start' });`);
    await sleep(1000);
    await takeScreenshot('desktop-09-testimonial.png');

    // 1.10 Newsletter Dispatches
    await evaluate(`document.querySelector('#newsletter')?.scrollIntoView({ behavior: 'instant', block: 'start' });`);
    await sleep(1000);
    await takeScreenshot('desktop-10-newsletter.png');

    // 1.11 Clean Luxury Footer (No awkward section after footer)
    await evaluate(`document.querySelector('#contact')?.scrollIntoView({ behavior: 'instant', block: 'start' });`);
    await sleep(1000);
    await takeScreenshot('desktop-11-footer.png');

    // ─────────────────────────────────────────────────────────────
    // 2. MOBILE TESTS (390 x 844)
    // ─────────────────────────────────────────────────────────────
    console.log('\n=== RUNNING MOBILE (390x844) TESTS ===');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });

    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/?skip-preloader=1` });
    await sleep(2500);

    await takeScreenshot('mobile-01-hero.png');

    console.log('[Interaction] Testing Mobile Navigation Drawer');
    await evaluate(`document.getElementById('nav-menu-btn')?.click();`);
    await sleep(800);
    await takeScreenshot('mobile-02-nav-menu-open.png');

    await evaluate(`document.getElementById('nav-menu-close-btn')?.click();`);
    await sleep(600);

    await evaluate(`document.querySelector('#shop-by-category')?.scrollIntoView({ behavior: 'instant', block: 'start' });`);
    await sleep(800);
    await takeScreenshot('mobile-03-shop-by-category.png');

    await evaluate(`document.querySelector('#trending')?.scrollIntoView({ behavior: 'instant', block: 'start' });`);
    await sleep(800);
    await takeScreenshot('mobile-04-trending.png');

    await evaluate(`document.querySelector('#contact')?.scrollIntoView({ behavior: 'instant', block: 'start' });`);
    await sleep(800);
    await takeScreenshot('mobile-05-footer.png');

    console.log('\n[SUCCESS] All desktop and mobile verification screenshots captured successfully!');
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    if (cdp) cdp.close();
    chromeProc.kill();
    server.close();
  }
}

run();
