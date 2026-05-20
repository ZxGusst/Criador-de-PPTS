// Abre a proposta, faz login, captura o HTML renderizado + screenshot
const puppeteer = require('puppeteer');
const path = require('path');
const fs   = require('fs');

const URL  = 'https://proposta-pista-livre.vercel.app/proposta.html';
const USER = 'pistalivre';
const PASS = 'compistalivre';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page    = await browser.newPage();

  await page.setViewport({ width: 1440, height: 900 });
  await page.authenticate({ username: USER, password: PASS });
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 2000));

  // Login form se existir
  const hasForm = await page.evaluate(() => !!document.querySelector('input[type="password"]'));
  if (hasForm) {
    console.log('Preenchendo form de login...');
    const u = await page.$('input[type="text"], input[name*="user"], input[name*="login"]');
    const p = await page.$('input[type="password"]');
    if (u) { await u.click({clickCount:3}); await u.type(USER); }
    if (p) { await p.click({clickCount:3}); await p.type(PASS); }
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }).catch(() => {}),
      p ? p.press('Enter') : page.$eval('form', f => f.submit()),
    ]);
    await page.evaluate(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('Página carregada. Capturando HTML...');

  // Screenshot para ver o estado visual
  await page.screenshot({ path: path.join(__dirname, 'preview-pagina.png'), fullPage: true });
  console.log('✓ Screenshot: preview-pagina.png');

  // HTML completo após render
  const html = await page.evaluate(() => document.documentElement.outerHTML);
  fs.writeFileSync(path.join(__dirname, 'proposta-original-rendered.html'), html, 'utf-8');
  console.log('✓ HTML salvo: proposta-original-rendered.html (' + Math.round(html.length/1024) + 'KB)');

  // URL atual (para ver se houve redirect)
  console.log('URL final:', page.url());

  // Título da página
  const title = await page.title();
  console.log('Título:', title);

  // Estrutura principal
  const structure = await page.evaluate(() => {
    const body = document.body;
    return {
      childCount: body.children.length,
      firstChildren: Array.from(body.children).slice(0,5).map(el => ({
        tag: el.tagName,
        id: el.id,
        classes: el.className.toString().slice(0,80),
        text: el.textContent.slice(0,100).trim()
      })),
      hasReact: !!document.getElementById('root') || !!document.getElementById('__next'),
      scripts: Array.from(document.scripts).map(s => s.src || 'inline').filter(Boolean).slice(0,5)
    };
  });
  console.log('\nEstrutura:', JSON.stringify(structure, null, 2));

  await browser.close();
})();
