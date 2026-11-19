const puppeteer = require('puppeteer-core');
const http = require('http');
const fs = require('fs');
const path = require('path');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon'
};

const distDir = path.join(__dirname, 'dist');

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';
  let filePath = path.join(distDir, reqPath);
  
  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, reqPath);
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(8092, async () => {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    await page.goto('http://localhost:8092', { waitUntil: 'networkidle2', timeout: 30000 });

    // Scroll to customer-videos
    await page.evaluate(() => {
      document.getElementById('customer-videos').scrollIntoView();
    });

    // Wait 3 seconds and sample card video currentTime
    await new Promise(r => setTimeout(r, 3000));
    const cardVideoTime1 = await page.evaluate(() => {
      const v = document.querySelector('#customer-videos .promec-reel-card__video');
      return v ? v.currentTime : null;
    });
    console.log('Card video currentTime at 3s:', cardVideoTime1);

    // Wait another 3 seconds (total 6s)
    await new Promise(r => setTimeout(r, 3000));
    const cardVideoTime2 = await page.evaluate(() => {
      const v = document.querySelector('#customer-videos .promec-reel-card__video');
      return v ? v.currentTime : null;
    });
    console.log('Card video currentTime at 6s (should have looped back < 5s):', cardVideoTime2);

    // Now click the card to test modal full video
    const card = await page.$('#customer-videos .promec-reel-card');
    if (card) {
      await card.click();
      await new Promise(r => setTimeout(r, 1500));

      const modalInfo = await page.evaluate(() => {
        const modal = document.getElementById('promec-reel-modal');
        const vid = document.getElementById('promec-modal-video');
        return {
          isOpen: modal.classList.contains('is-open'),
          src: vid.src,
          currentTime: vid.currentTime,
          paused: vid.paused
        };
      });
      console.log('Modal opened info:', modalInfo);

      await page.screenshot({ path: 'modal_full_video_test.png' });
      console.log('Captured modal_full_video_test.png');
    }

    await browser.close();
  } catch (err) {
    console.error(err);
  } finally {
    server.close();
  }
});
