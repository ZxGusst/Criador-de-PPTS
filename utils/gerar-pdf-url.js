// Abre proposta-pista-livre.vercel.app, faz login e exporta PDF horizontal
const puppeteer = require('puppeteer');
const path = require('path');

const URL    = 'https://proposta-pista-livre.vercel.app/proposta.html';
const USER   = 'pistalivre';
const PASS   = 'compistalivre';
const OUT    = path.join(__dirname, 'proposta-pista-livre-HORIZONTAL.pdf');

(async () => {
  console.log('Abrindo proposta...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page    = await browser.newPage();

  // Tenta HTTP Basic Auth primeiro
  await page.authenticate({ username: USER, password: PASS });

  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 2000));

  // Verifica se caiu num form de login HTML (alguns sites usam isso)
  const hasLoginForm = await page.evaluate(() => {
    return !!document.querySelector('input[type="password"]');
  });

  if (hasLoginForm) {
    console.log('Form de login detectado — preenchendo...');
    // Tenta preencher pelo tipo
    const userField = await page.$('input[type="text"], input[name*="user"], input[name*="login"], input[id*="user"]');
    const passField = await page.$('input[type="password"]');
    if (userField) await userField.type(USER);
    if (passField) await passField.type(PASS);
    // Submete
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {}),
      passField.press('Enter'),
    ]);
    await page.evaluate(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('Página carregada. Aplicando ajustes...');

  await page.evaluate(() => {
    // Expande todos os tab-panels para o PDF capturar tudo
    document.querySelectorAll('.tab-panel, [role="tabpanel"]').forEach(p => {
      p.style.display = 'block';
      p.style.opacity = '1';
      p.style.visibility = 'visible';
    });

    // Remove "Proposta válida por X dias" — busca em todos os nós de texto
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const toFix = [];
    let node;
    while ((node = walker.nextNode())) {
      if (/proposta v[áa]lida por/i.test(node.textContent)) {
        toFix.push(node);
      }
    }
    toFix.forEach(node => {
      node.textContent = node.textContent
        .replace(/\.?\s*Proposta v[áa]lida por\s+\d+\s+dias\.?/gi, '')
        .trim();
    });
  });

  await new Promise(r => setTimeout(r, 500));
  console.log('Gerando PDF horizontal...');

  await page.pdf({
    path: OUT,
    format: 'A4',
    landscape: true,
    printBackground: true,
    margin: { top: '16px', right: '16px', bottom: '16px', left: '16px' },
  });

  await browser.close();
  console.log('✅ PDF gerado:', OUT);
})();
