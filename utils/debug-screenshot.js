const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox'],
    protocolTimeout: 60000
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaType('screen');

  const htmlFile = path.join(__dirname, 'proposta-pista-livre-PDF.html');
  const fileUrl = 'file:///' + htmlFile.split('\\').join('/');
  await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise(r => setTimeout(r, 3000));

  // Info sobre o portfolio
  const info = await page.evaluate(() => {
    const sec = document.getElementById('portfolio');
    const r = sec.getBoundingClientRect();
    const featured = document.querySelector('.portfolio-featured');
    const fr = featured ? featured.getBoundingClientRect() : null;
    const img = document.querySelector('.yt-facade__thumb');
    return {
      sectionTop: r.top,
      sectionHeight: r.height,
      featuredRect: fr ? { top: fr.top, h: fr.height, w: fr.width } : null,
      imgSrc: img ? img.src : 'NO IMG',
      imgComplete: img ? img.complete : false,
      imgNaturalH: img ? img.naturalHeight : 0,
    };
  });
  console.log('Portfolio info:', JSON.stringify(info, null, 2));

  // Screenshot da area do portfolio
  await page.screenshot({
    path: path.join(__dirname, 'debug-portfolio.png'),
    fullPage: false,
    clip: { x: 0, y: Math.max(0, info.sectionTop - 20), width: 1440, height: Math.min(1400, info.sectionHeight + 40) }
  });
  console.log('Screenshot salvo: debug-portfolio.png');

  await browser.close();
})();
