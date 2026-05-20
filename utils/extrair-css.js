const puppeteer = require('puppeteer');
const path = require('path');
const fs   = require('fs');

const URL  = 'https://proposta-pista-livre.vercel.app/proposta.html';
const USER = 'pistalivre';
const PASS = 'compistalivre';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page    = await browser.newPage();

  await page.authenticate({ username: USER, password: PASS });
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });

  const hasForm = await page.evaluate(() => !!document.querySelector('input[type="password"]'));
  if (hasForm) {
    const u = await page.$('input[type="text"], input[name*="user"], input[name*="login"]');
    const p = await page.$('input[type="password"]');
    if (u) { await u.click({clickCount:3}); await u.type('pistalivre'); }
    if (p) { await p.click({clickCount:3}); await p.type('compistalivre'); }
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }).catch(() => {}),
      p.press('Enter'),
    ]);
    await new Promise(r => setTimeout(r, 2000));
  }

  // Busca os CSS linkados
  const cssLinks = await page.evaluate(() =>
    Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => l.href)
  );
  console.log('CSS links:', cssLinks);

  // Baixa cada CSS
  for (const href of cssLinks) {
    const res  = await page.goto(href, { waitUntil: 'networkidle0' });
    const text = await res.text();
    const name = path.basename(href.split('?')[0]);
    fs.writeFileSync(path.join(__dirname, name), text, 'utf-8');
    console.log(`✓ ${name} (${Math.round(text.length/1024)}KB)`);
  }

  await browser.close();
  console.log('Feito.');
})();
