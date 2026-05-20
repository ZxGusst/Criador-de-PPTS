'use strict';
const puppeteer = require('puppeteer');
const https = require('https');
const path = require('path');
const fs = require('fs');

const OUT = path.join(__dirname, 'portfolio-comp.pdf');
const TMP = path.join(__dirname, '_portfolio_tmp.html');
const FALLBACK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const LOGO_D = `M31.4209 0.53857C34.3116 2.2404 34.9508 8.4981 33.3344 19.3035L32.8255 22.6217L32.1863 25.9398C31.7588 28.6636 31.4209 30.8336 31.1644 32.45C30.57 37.299 30.4804 40.9591 30.9079 43.4264C31.1644 45.0427 31.3761 46.5328 31.5471 47.8927C31.885 49.851 32.1863 51.7238 32.4387 53.5112C33.2041 58.2787 33.8434 62.6188 34.3523 66.5314C35.7121 77.5933 36.1803 85.3412 35.7569 89.7627C35.4149 92.8284 34.9915 96.5293 34.4785 100.869C33.7131 106.146 32.9476 110.954 32.1782 115.294C29.9633 127.378 27.9236 133.847 26.0507 134.694C23.8359 135.631 21.3687 135.289 18.649 133.672C15.9252 132.056 14.3089 130.098 13.8 127.801C13.458 126.271 13.3725 123.844 13.5435 120.526C13.629 119.333 13.7552 117.717 13.9262 115.677L14.1827 113.124L14.4392 110.445C15.2901 101 15.0784 93.8096 13.8 88.871C13.0346 85.8949 12.0982 83.1711 10.9907 80.7039C10.2253 79.0875 9.15862 77.0885 7.79878 74.7027C5.07504 70.0247 3.3325 65.9411 2.56708 62.4478C1.03625 55.555 0.185322 46.8341 0.0143248 36.2811C-0.156673 23.7698 1.20318 16.1116 4.09792 13.3064C7.58709 9.73172 12.3099 6.45834 18.2663 3.4781C24.6502 0.245432 29.031 -0.735765 31.4127 0.542646L31.4209 0.53857ZM30.6555 152.82C32.0153 157.075 31.5919 161.968 29.377 167.501C27.2477 172.949 24.9108 175.16 22.358 174.138C19.2068 172.859 16.1044 171.076 13.0386 168.776C9.46397 166.052 7.76215 163.796 7.93315 162.009C8.27107 159.456 9.12199 156.692 10.4859 153.712C12.1877 150.222 13.9751 148.268 15.8479 147.841C18.4861 147.161 21.2506 147.161 24.1453 147.841C27.6345 148.606 29.8045 150.267 30.6555 152.82Z`;

const logo = (w, h, color = '#ccdc2d') =>
  `<svg style="width:${w}px;height:${h}px;flex-shrink:0" viewBox="0 0 36 175" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="${LOGO_D}" fill="${color}"/></svg>`;

const LOGO_FULL = (() => {
  try {
    return fs.readFileSync('C:/Users/GUGUB/Downloads/LOGO COMP.svg', 'utf8')
      .replace(/(<svg[^>]*)\s+width="[^"]*"/, '$1')
      .replace(/(<svg[^>]*)\s+height="[^"]*"/, '$1 style="display:block;width:100%;height:auto"');
  } catch(e) { return ''; }
})();

const IMGS = {
  homeHero:     'https://framerusercontent.com/images/vxais7EAbwqfXMmTinWOUzYDhaA.png',
  aboutTeam:    'https://framerusercontent.com/images/s9YjXnJorVbkyyK5lm5vxUY.png',
  realtimeHero: 'https://framerusercontent.com/images/12CJIPinT7KBKnTU6iJeJXOANWo.webp',
  storyHero:    'https://framerusercontent.com/images/Ukk6TJPQKMwv7HU9QEGHnUFfZyg.png',
  setWhoMadeWho: 'https://framerusercontent.com/images/feB4wK3NtgnYuehtTmoVaXLs4k.png',
  setTh4ys:      'https://framerusercontent.com/images/J471Z8IPDe7c3cnasR0PkwJrwI.jpg',
  setAdame:      'https://framerusercontent.com/images/wTAnc6yIpoaT6tEwqxORmXV4anc.jpg',
  setAshibah:    'https://framerusercontent.com/images/VavgqdADWx0geFgJWe1cWHOXVQ.jpg',
  setDjMarky:    'https://framerusercontent.com/images/WT2o6qRbqj0uScn9DDzuGZboLko.png',
  setMu540:      'https://framerusercontent.com/images/g5PTjNP1pXPHYbAu3rVI1xmEN4.jpg',
  storyV1:       'https://framerusercontent.com/images/xsb6jWvD3jSAvIIhJowuDJ7AQ.png',
  storyV2:       'https://framerusercontent.com/images/dsnI02a4wZd6gz1gBppxwGhI.png',
  storyV3:       'https://framerusercontent.com/images/wNVqNzJrLZ6N4qpNxG8cOSQuesE.png',
  storyV4:       'https://framerusercontent.com/images/gK49VY1jSHdT6ddrCBDEnxz3cY.png',
  pistaFoto1:    'https://framerusercontent.com/images/DLIgmcEfCopthYOwab66GN6EPs.webp',
  pistaFoto2:    'https://framerusercontent.com/images/DDuXbyDnvIUkpoDNwVBMQTNjc.webp',
  pistaFoto3:    'https://framerusercontent.com/images/MR3DgMC8tIiZmpe33izZR6Yaw8.webp',
  pistaFoto4:    'https://framerusercontent.com/images/mtN71oKhEhQbz3XKpendP4vpj8.webp',
  pistaFoto5:    'https://framerusercontent.com/images/ldm74V0Aom1p7ixIRAKRvZn0Mzk.webp',
};

function fetchImg(url) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://studiocomp.com.br/',
      },
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        fetchImg(res.headers.location).then(resolve); return;
      }
      if (res.statusCode !== 200) { res.resume(); resolve(null); return; }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        const ct = res.headers['content-type'] || 'image/jpeg';
        resolve(`data:${ct};base64,${buf.toString('base64')}`);
      });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(20000, () => { req.destroy(); resolve(null); });
  });
}

function readLocalImg(filePath) {
  try {
    const buf = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const mime = (ext === '.jpg' || ext === '.jpeg') ? 'image/jpeg' : 'image/png';
    return `data:${mime};base64,${buf.toString('base64')}`;
  } catch (e) {
    console.warn('  ⚠  Not found:', filePath);
    return null;
  }
}

function buildHTML(a) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&family=Barlow:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap" rel="stylesheet"/>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{background:#0c0d09;font-family:'Barlow',system-ui,sans-serif;color:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pag{width:297mm;height:210mm;overflow:hidden;position:relative;background:#0c0d09;page-break-after:always;break-after:page;display:flex}
:root{--lime:#ccdc2d;--lime-dim:rgba(204,220,45,0.1);--lime-b:rgba(204,220,45,0.22);--b1:rgba(255,255,255,0.07)}
.nav{position:absolute;bottom:0;left:0;right:0;height:28px;border-top:1px solid var(--b1);display:flex;align-items:center;justify-content:space-between;padding:0 40px;z-index:30}
.nav span{font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,0.52)}
.eyebrow{font-size:10px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--lime);margin-bottom:10px}
.lbar{width:32px;height:3px;background:var(--lime);border-radius:2px;margin-bottom:14px}
.disp{font-family:'Big Shoulders Display',sans-serif;font-weight:900;line-height:1;letter-spacing:-.01em}
.acc{color:var(--lime)}
.badge{display:inline-flex;align-items:center;width:fit-content;align-self:flex-start;padding:3px 10px;background:var(--lime-dim);border:1px solid var(--lime-b);border-radius:100px;font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--lime)}
/* full bleed bg */
.fbg{position:absolute;inset:0;z-index:0}
.fbg img{width:100%;height:100%;object-fit:cover}
.fbg-l{position:absolute;inset:0;background:linear-gradient(100deg,rgba(12,13,9,0.97) 44%,rgba(12,13,9,0.22) 100%)}
.fbg-b{position:absolute;inset:0;background:linear-gradient(180deg,transparent 18%,rgba(12,13,9,0.98) 82%)}

/* ── P01 CAPA ── */
.p01-bg{position:absolute;inset:0;z-index:0}
.p01-bg img{width:100%;height:100%;object-fit:cover;object-position:center 30%}
.p01-bg::after{content:'';position:absolute;inset:0;background:linear-gradient(100deg,rgba(12,13,9,0.97) 42%,rgba(12,13,9,0.28) 100%)}
.p01-body{position:relative;z-index:2;width:50%;height:100%;padding:44px 32px 44px 52px;display:flex;flex-direction:column;justify-content:space-between}
.p01-ml{font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,0.38);margin-bottom:2px}
.p01-mv{font-size:11px;font-weight:500;color:rgba(255,255,255,0.72)}

/* ── P02 QUEM SOMOS ── */
.p02-bg{position:absolute;inset:0;z-index:0}
.p02-bg img{width:100%;height:100%;object-fit:cover;object-position:center top;filter:blur(3px);opacity:0.15;transform:scale(1.05)}
.p02-left{position:relative;z-index:2;width:48%;padding:50px 26px 54px 52px;display:flex;flex-direction:column;justify-content:center;gap:20px;border-right:1px solid var(--b1)}
.p02-right{position:relative;z-index:2;flex:1;padding:22px 28px 52px 18px;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:repeat(4,1fr);gap:5px}
.p02-ph{border-radius:5px;overflow:hidden;min-height:0}
.p02-ph img{width:100%;height:100%;object-fit:cover;display:block}
.pills{display:flex;flex-direction:column;border-top:1px solid var(--b1);padding-top:10px}
.pill{display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.04)}
.pill::before{content:'';width:4px;height:4px;background:var(--lime);border-radius:50%;flex-shrink:0}
.pill span{font-size:11px;font-weight:500;color:#ccc}

/* ── P03 SETS & MULTICAM ── */
.p03-left{position:relative;z-index:2;width:44%;padding:48px 24px 52px 52px;display:flex;flex-direction:column;justify-content:center}
.p03-grid{position:relative;z-index:2;flex:1;padding:18px 14px 48px 0;display:grid;grid-template-columns:1fr 1fr 1fr;grid-template-rows:1fr 1fr;gap:5px}
.sg{border-radius:6px;overflow:hidden;position:relative;min-height:0}
.sg img{width:100%;height:100%;object-fit:cover;display:block}
.sg-over{position:absolute;bottom:0;left:0;right:0;padding:6px 8px;background:linear-gradient(transparent,rgba(0,0,0,0.85))}
.sg-n{font-size:9px;font-weight:700;letter-spacing:.04em;text-transform:uppercase}
.sg-s{font-size:7.5px;color:rgba(255,255,255,0.72);margin-top:1px}
.dl-list{display:flex;flex-direction:column;gap:5px;margin-top:14px}
.dl{display:flex;align-items:center;gap:8px;font-size:11px;color:rgba(255,255,255,0.7)}
.dl::before{content:'';width:3px;height:3px;background:var(--lime);border-radius:50%;flex-shrink:0}

/* ── P04 IN REAL TIME ── */
.p04-ov{position:absolute;bottom:46px;left:52px;right:52px;z-index:2;display:flex;gap:50px;align-items:flex-end}
.p04-text{flex:1}
.p04-ds{display:flex;flex-direction:column;gap:6px;min-width:210px}
.p04-d{display:flex;align-items:center;gap:8px;font-size:11px;color:rgba(255,255,255,0.72)}
.p04-d::before{content:'';width:4px;height:4px;background:var(--lime);border-radius:50%;flex-shrink:0}

/* ── P05 STORYMAKING ── */
.p05-left{position:relative;z-index:2;width:46%;padding:50px 24px 54px 52px;display:flex;flex-direction:column;justify-content:center}
.p05-clients{margin-top:16px;border-top:1px solid var(--b1);padding-top:12px;display:flex;flex-direction:column;gap:5px}
.p05-c{font-size:11px;font-weight:500;color:rgba(255,255,255,0.72);display:flex;align-items:center;gap:8px}
.p05-c::before{content:'';width:3px;height:3px;background:var(--lime);border-radius:50%;flex-shrink:0}
.p05-vgrid{position:relative;z-index:2;flex:1;display:flex;align-items:center;justify-content:center;gap:10px;padding:20px 20px 48px 10px}
.vcard{flex:1;max-width:118px;aspect-ratio:9/16;border-radius:10px;overflow:hidden;background:#111;box-shadow:0 8px 28px rgba(0,0,0,0.75)}
.vcard img{width:100%;height:100%;object-fit:cover;display:block}

/* ── P06-08 PROJETOS ── */
.proj-left{width:40%;padding:46px 22px 50px 52px;display:flex;flex-direction:column;justify-content:center;gap:22px;border-right:1px solid var(--b1)}
.proj-label{font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,0.52);margin-bottom:14px}
.proj-stats{display:flex;flex-direction:column;gap:7px;border-top:1px solid var(--b1);padding-top:12px}
.ps{font-size:11px;color:rgba(255,255,255,0.68);display:flex;align-items:center;gap:8px}
.ps::before{content:'';width:3px;height:3px;background:var(--lime);border-radius:50%;flex-shrink:0}
.proj-tags{display:flex;flex-wrap:wrap;gap:4px;margin-top:10px}
.pt{background:var(--lime-dim);color:var(--lime);font-size:8px;font-weight:700;padding:2px 7px;border-radius:4px;letter-spacing:.06em;text-transform:uppercase}
.proj-right{flex:1;padding:12px 12px 48px 0;display:grid;gap:5px;min-width:0}
.mosaic-boma{grid-template-columns:1fr 1fr 1fr;grid-template-rows:1fr 1fr}
.mosaic-boma .ph:nth-child(1){grid-column:span 2}
.mosaic-boma .ph:nth-child(2){grid-row:span 2}
.mosaic-pista{grid-template-columns:1fr 1fr 1fr;grid-template-rows:1fr 1fr}
.mosaic-pista .ph:nth-child(1){grid-row:span 2}
.mosaic-taraka{grid-template-columns:1fr 1fr 1fr;grid-template-rows:1fr 1fr}
.mosaic-taraka .ph:nth-child(5){grid-column:span 2}
.ph{border-radius:5px;overflow:hidden;min-height:0}
.ph img{width:100%;height:100%;object-fit:cover;display:block}

/* ── P09 CLIENTES ── */
.p09{flex-direction:column;padding:34px 52px 36px}
.p09-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:7px;margin-top:12px}
.cc{background:rgba(255,255,255,0.03);border:1px solid var(--b1);border-radius:10px;overflow:hidden;display:flex;flex-direction:column}
.cc-img{height:140px;overflow:hidden;flex-shrink:0}
.cc-img img{width:100%;height:100%;object-fit:cover;display:block}
.cc-body{padding:11px 12px}
.cn{font-family:'Big Shoulders Display',sans-serif;font-weight:900;font-size:15px;line-height:1.05;margin-bottom:3px}
.cl{font-size:8.5px;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,0.38);margin-bottom:8px}
.ctags{display:flex;flex-wrap:wrap;gap:3px}
.ct{background:var(--lime-dim);color:var(--lime);font-size:7.5px;font-weight:700;padding:2px 5px;border-radius:4px;letter-spacing:.06em;text-transform:uppercase}
.p09-artists{border-top:1px solid var(--b1);margin-top:14px;padding-top:11px;flex:1;display:flex;flex-direction:column}
.art-label{font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,0.38);margin-bottom:8px}
.art-grid{display:grid;grid-template-rows:repeat(10,1fr);grid-auto-flow:column;gap:0;flex:1}
.art-item{font-size:12.5px;color:rgba(255,255,255,0.62);padding:0 10px;border-bottom:1px solid rgba(255,255,255,0.05);display:flex;align-items:center;gap:8px}
.art-item:last-child{border-bottom:none}
.art-item::before{content:'';width:3px;height:3px;background:var(--lime);border-radius:50%;flex-shrink:0}

/* ── P10 CONTATO ── */
.p10-body{position:relative;z-index:2;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 80px 28px}
.p10-t{font-family:'Big Shoulders Display',sans-serif;font-weight:900;font-size:72px;line-height:.95;margin:18px 0}

@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style>
</head>
<body>

<!-- ░░ 01 CAPA ░░ -->
<div class="pag">
  <div class="p01-bg"><img src="${a.capa}" alt=""/></div>
  <div class="p01-body">
    <div style="display:flex;flex-direction:column;gap:14px">
      <div style="font-size:10px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:var(--lime)">Portfólio</div>
      ${logo(20, 97)}
    </div>
    <div>
      <div class="disp" style="font-size:78px;line-height:.9;letter-spacing:-.02em">Studio<span class="acc">Comp!</span></div>
      <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,0.5);margin-top:10px">Audiovisual &middot; 2025&ndash;2026</div>
    </div>
    <div style="padding-top:18px;border-top:1px solid var(--b1);display:flex;gap:28px">
      <div><div class="p01-ml">Estúdio</div><div class="p01-mv">Brasília, Brasil</div></div>
      <div><div class="p01-ml">Especialidade</div><div class="p01-mv">Audiovisual</div></div>
      <div><div class="p01-ml">Contato</div><div class="p01-mv">contato@studiocomp.com.br</div></div>
    </div>
  </div>
  <div class="nav"><span>STUDIOCOMP! — PORTFÓLIO AUDIOVISUAL 2025–2026</span><span>01 / 10</span></div>
</div>

<!-- ░░ 02 QUEM SOMOS ░░ -->
<div class="pag">
  <div class="p02-left">
    <div>
      <div class="eyebrow">02 — Quem somos</div>
      <div class="lbar"></div>
      <div class="disp" style="font-size:25px;margin-bottom:12px">Cada entrega responde ao briefing.<br/>Não é sorte. <span class="acc">É técnica.</span></div>
      <div style="font-size:11px;line-height:1.82;color:#8a8a8a;margin-bottom:10px">Nascemos para transformar eventos, experiências e marcas em narrativas audiovisuais de impacto. Hoje acumulamos mais de <strong style="color:#bbb">7 milhões de visualizações</strong> — atendendo clientes públicos e privados, do entretenimento ao mercado corporativo.</div>
      <div style="font-size:10.5px;line-height:1.7;color:#686868;font-style:italic">Cada projeto recebe o mesmo rigor técnico e olhar criativo — seja um festival de grande porte, uma ativação de marca ou um lançamento institucional.</div>
    </div>
    <div class="pills">
      <div class="pill"><span>Cobertura de Eventos</span></div>
      <div class="pill"><span>Branded Content</span></div>
      <div class="pill"><span>Drops &amp; Conteúdo Digital</span></div>
      <div class="pill"><span>Direção Criativa</span></div>
    </div>
  </div>
  <div class="p02-bg"><img src="${a.aboutTeam}" alt=""/></div>
  <div class="p02-right">
    <div class="p02-ph"><img src="${a.compstu1}" alt=""/></div>
    <div class="p02-ph"><img src="${a.compstu2}" alt=""/></div>
    <div class="p02-ph"><img src="${a.compstu3}" alt=""/></div>
    <div class="p02-ph"><img src="${a.compstu4}" alt=""/></div>
    <div class="p02-ph"><img src="${a.compstu5}" alt=""/></div>
    <div class="p02-ph"><img src="${a.compstu6}" alt=""/></div>
    <div class="p02-ph"><img src="${a.compstu7}" alt=""/></div>
    <div class="p02-ph"><img src="${a.compstu8}" alt=""/></div>
  </div>
  <div class="nav"><span>STUDIOCOMP! — PORTFÓLIO AUDIOVISUAL 2025–2026</span><span>02 / 10</span></div>
</div>

<!-- ░░ 03 SETS & MULTICAM ░░ -->
<div class="pag">
  <div class="fbg"><img src="${a.setWhoMadeWho}" alt=""/><div class="fbg-l"></div></div>
  <div class="p03-left">
    <div class="eyebrow">03 — Serviço 01</div>
    <div class="lbar"></div>
    <div class="disp" style="font-size:42px;margin-bottom:12px">Sets &amp;<br/><span class="acc">Multicam</span></div>
    <div style="font-size:11.5px;line-height:1.8;color:rgba(255,255,255,0.66);margin-bottom:4px">Cobertura completa com múltiplas câmeras — de shows e festivais a lançamentos, conferências e ativações. Do primeiro ao último momento, documentado em todos os ângulos.</div>
    <div class="dl-list">
      <div class="dl">Full sets multicam</div>
      <div class="dl">Aftermovies e teasers</div>
      <div class="dl">Drone + FPV</div>
      <div class="dl">Color grading exclusivo</div>
      <div class="dl">Áudio tratado profissionalmente</div>
    </div>
    <div class="badge" style="margin-top:16px">+7M views acumulados</div>
  </div>
  <div class="p03-grid">
    <div class="sg"><img src="${a.setWhoMadeWho}" alt="WhoMadeWho"/><div class="sg-over"><div class="sg-n">WhoMadeWho</div><div class="sg-s">BOMA · 2025</div></div></div>
    <div class="sg"><img src="${a.setTh4ys}" alt="TH4YS"/><div class="sg-over"><div class="sg-n">TH4YS</div><div class="sg-s">Submundo 808 · 2025</div></div></div>
    <div class="sg"><img src="${a.setAdame}" alt="Adame"/><div class="sg-over"><div class="sg-n">Adame</div><div class="sg-s">Submundo 808 · 2025</div></div></div>
    <div class="sg"><img src="${a.setAshibah}" alt="Ashibah"/><div class="sg-over"><div class="sg-n">Ashibah</div><div class="sg-s">BOMA · 2025</div></div></div>
    <div class="sg"><img src="${a.setDjMarky}" alt="DJ Marky"/><div class="sg-over"><div class="sg-n">DJ Marky</div><div class="sg-s">MarkyAndFriends · 2024</div></div></div>
    <div class="sg"><img src="${a.setMu540}" alt="DJ MU540"/><div class="sg-over"><div class="sg-n">DJ MU540</div><div class="sg-s">2024</div></div></div>
  </div>
  <div class="nav"><span>STUDIOCOMP! — PORTFÓLIO AUDIOVISUAL 2025–2026</span><span>03 / 10</span></div>
</div>

<!-- ░░ 04 IN REAL TIME ░░ -->
<div class="pag">
  <div class="fbg"><img src="${a.realtimeHero}" alt="In Real Time" style="object-position:center 20%"/><div class="fbg-b"></div></div>
  <div class="p04-ov">
    <div class="p04-text">
      <div class="eyebrow">04 — Serviço 02</div>
      <div class="disp" style="font-size:54px;margin:8px 0 12px">In <span class="acc">Real Time</span></div>
      <div style="font-size:12px;line-height:1.75;color:rgba(255,255,255,0.68);max-width:400px">Produção no calor do evento. Conteúdo publicado em tempo real — de palcos a ativações de marca, dos bastidores aos melhores momentos, entregues antes do público sair.</div>
      <div class="badge" style="margin-top:12px">+1M de views no Instagram acumulados</div>
    </div>
    <div class="p04-ds">
      <div class="p04-d">Drops verticais publicados ao vivo</div>
      <div class="p04-d">Teasers e cortes rápidos</div>
      <div class="p04-d">Ativações de marca com artistas</div>
      <div class="p04-d">Conteúdo reutilizável pós-evento</div>
      <div class="p04-d">Best moments na mesma noite</div>
      <div style="height:1px;background:rgba(255,255,255,0.07);margin:6px 0"></div>
      <div style="font-size:8.5px;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,0.38);margin-bottom:2px">Projetos que participamos</div>
      <div class="p04-d">Baile Lotadão</div>
      <div class="p04-d">Summer All Day</div>
    </div>
  </div>
  <div class="nav"><span>STUDIOCOMP! — PORTFÓLIO AUDIOVISUAL 2025–2026</span><span>04 / 10</span></div>
</div>

<!-- ░░ 05 STORYMAKING ░░ -->
<div class="pag">
  <div class="fbg"><img src="${a.storyHero}" alt="StoryMaking"/><div class="fbg-l"></div></div>
  <div class="p05-left">
    <div class="eyebrow">05 — Serviço 03</div>
    <div class="lbar"></div>
    <div class="disp" style="font-size:42px;margin-bottom:12px">Story<span class="acc">Making</span></div>
    <div style="font-size:11.5px;line-height:1.8;color:rgba(255,255,255,0.66)">Conteúdo estratégico para marcas e eventos que querem gerar valor real. Vídeos, ads, motion design e ativações que traduzem a identidade do cliente em narrativa visual — gerando presença, engajamento e conversão.</div>
    <div class="p05-clients">
      <div style="font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,0.34);margin-bottom:4px">Clientes que trabalhamos no último ano</div>
      <div class="p05-c">TeraScience</div>
      <div class="p05-c">BOMA</div>
      <div class="p05-c">Baile Trama</div>
      <div class="p05-c">5uinto</div>
    </div>
  </div>
  <div class="p05-vgrid">
    <div class="vcard"><img src="${a.storyM1}" alt=""/></div>
    <div class="vcard"><img src="${a.storyM2}" alt=""/></div>
    <div class="vcard"><img src="${a.storyM3}" alt=""/></div>
    <div class="vcard"><img src="${a.storyM4}" alt=""/></div>
  </div>
  <div class="nav"><span>STUDIOCOMP! — PORTFÓLIO AUDIOVISUAL 2025–2026</span><span>05 / 10</span></div>
</div>

<!-- ░░ 06 WE ARE BOMA 2026 ░░ -->
<div class="pag">
  <div class="proj-left">
    <div>
      <div class="proj-label">ÚLTIMOS PROJETOS · 01 / 03</div>
      <div class="eyebrow">BOMA</div>
      <div class="disp" style="font-size:38px;margin-bottom:10px">BOMA <span class="acc">2026</span></div>
      <div style="font-size:11px;line-height:1.78;color:rgba(255,255,255,0.62)">BOMA é um movimento que celebra e promove a música eletrônica, conectando pessoas e comunidades em torno dessa paixão. Uma comunidade diversificada — do underground às referências internacionais.</div>
    </div>
    <div>
      <div class="proj-stats">
        <div class="ps">6 câmeras simultâneas</div>
        <div class="ps">Entrega drops em 48h</div>
        <div class="ps">Full sets de todos os artistas</div>
        <div class="ps">Drone + FPV inclusos</div>
      </div>
      <div class="proj-tags">
        <span class="pt">Full Sets</span><span class="pt">Drops</span><span class="pt">Multicam</span><span class="pt">Drone</span>
      </div>
    </div>
  </div>
  <div class="proj-right mosaic-boma">
    <div class="ph"><img src="${a.boma1}" alt=""/></div>
    <div class="ph"><img src="${a.boma2}" alt=""/></div>
    <div class="ph"><img src="${a.boma3}" alt=""/></div>
    <div class="ph"><img src="${a.boma4}" alt=""/></div>
  </div>
  <div class="nav"><span>STUDIOCOMP! — PORTFÓLIO AUDIOVISUAL 2025–2026</span><span>06 / 10</span></div>
</div>

<!-- ░░ 07 FESTIVAL PISTA LIVRE ░░ -->
<div class="pag">
  <div class="proj-left">
    <div>
      <div class="proj-label">ÚLTIMOS PROJETOS · 02 / 03</div>
      <div class="eyebrow">Festival Pista Livre</div>
      <div class="disp" style="font-size:34px;margin-bottom:10px">Pista Livre <span class="acc">BSB</span></div>
      <div style="font-size:11px;line-height:1.78;color:rgba(255,255,255,0.62)">32 apresentações, 2 dias, 2 pistas. Full sets e drops de todos os artistas — da cena local aos headliners internacionais.</div>
    </div>
    <div>
      <div class="proj-stats">
        <div class="ps">32 apresentações cobertas</div>
        <div class="ps">2 pistas simultâneas</div>
        <div class="ps">Fullsets + drops de todos</div>
        <div class="ps">Museu Nacional, Brasília</div>
      </div>
      <div class="proj-tags">
        <span class="pt">Full Sets</span><span class="pt">Drops</span><span class="pt">Foto</span><span class="pt">Vídeo</span>
      </div>
    </div>
  </div>
  <div class="proj-right mosaic-pista">
    <div class="ph"><img src="${a.pistaFoto1}" alt=""/></div>
    <div class="ph"><img src="${a.pistaFoto2}" alt=""/></div>
    <div class="ph"><img src="${a.pistaFoto3}" alt=""/></div>
    <div class="ph"><img src="${a.pistaFoto4}" alt=""/></div>
    <div class="ph"><img src="${a.pistaFoto5}" alt=""/></div>
  </div>
  <div class="nav"><span>STUDIOCOMP! — PORTFÓLIO AUDIOVISUAL 2025–2026</span><span>07 / 10</span></div>
</div>

<!-- ░░ 08 TARAKA RIO ░░ -->
<div class="pag">
  <div class="proj-left">
    <div>
      <div class="proj-label">ÚLTIMOS PROJETOS · 03 / 03</div>
      <div class="eyebrow">Taraka</div>
      <div class="disp" style="font-size:38px;margin-bottom:10px">Taraka <span class="acc">Rio</span></div>
      <div style="font-size:11px;line-height:1.78;color:rgba(255,255,255,0.62)">Drops de todos os artistas e fullset do Gordo — uma das noites mais marcantes da cena eletrônica carioca, capturada no Rio de Janeiro.</div>
    </div>
    <div>
      <div class="proj-stats">
        <div class="ps">Drops de todos os artistas</div>
        <div class="ps">Fullset Gordo</div>
        <div class="ps">Rio de Janeiro</div>
        <div class="ps">Drone aéreo</div>
      </div>
      <div class="proj-tags">
        <span class="pt">Full Sets</span><span class="pt">Drops</span><span class="pt">Drone</span><span class="pt">Rio de Janeiro</span>
      </div>
    </div>
  </div>
  <div class="proj-right mosaic-taraka">
    <div class="ph"><img src="${a.taraka1}" alt=""/></div>
    <div class="ph"><img src="${a.taraka2}" alt=""/></div>
    <div class="ph"><img src="${a.taraka3}" alt=""/></div>
    <div class="ph"><img src="${a.taraka4}" alt=""/></div>
    <div class="ph"><img src="${a.taraka5}" alt=""/></div>
  </div>
  <div class="nav"><span>STUDIOCOMP! — PORTFÓLIO AUDIOVISUAL 2025–2026</span><span>08 / 10</span></div>
</div>

<!-- ░░ 09 CLIENTES ░░ -->
<div class="pag p09">
  <div>
    <div class="eyebrow">09 — Clientes &amp; Parceiros</div>
    <div class="disp" style="font-size:28px;margin-top:2px">Com quem <span class="acc">criamos</span></div>
  </div>
  <div class="p09-grid">
    <div class="cc">
      <div class="cc-img"><img src="${a.boma2}" alt="BOMA"/></div>
      <div class="cc-body">
        <div class="cn">BOMA</div>
        <div class="cl">Edição BSB</div>
        <div class="ctags"><span class="ct">Full Sets</span><span class="ct">+1M Views</span><span class="ct">Internacional</span></div>
      </div>
    </div>
    <div class="cc">
      <div class="cc-img"><img src="${a.pistaFoto2}" alt="Festival Pista Livre"/></div>
      <div class="cc-body">
        <div class="cn">Festival Pista Livre</div>
        <div class="cl">Brasília · BSB</div>
        <div class="ctags"><span class="ct">Cobertura</span><span class="ct">Full Sets</span><span class="ct">Foto &amp; Vídeo</span></div>
      </div>
    </div>
    <div class="cc">
      <div class="cc-img"><img src="${a.setWhoMadeWho}" alt="WhoMadeWho"/></div>
      <div class="cc-body">
        <div class="cn">WhoMadeWho</div>
        <div class="cl">Dinamarca · Internacional</div>
        <div class="ctags"><span class="ct">+1M Views</span><span class="ct">Live Set</span><span class="ct">2025</span></div>
      </div>
    </div>
    <div class="cc">
      <div class="cc-img"><img src="${a.setDjMarky}" alt="XTN prod"/></div>
      <div class="cc-body">
        <div class="cn">XTN prod</div>
        <div class="cl">Brasília</div>
        <div class="ctags"><span class="ct">Produção</span><span class="ct">Eventos</span><span class="ct">Audiovisual</span></div>
      </div>
    </div>
    <div class="cc">
      <div class="cc-img"><img src="${a.pistaFoto4}" alt="SETUR DF"/></div>
      <div class="cc-body">
        <div class="cn">SETUR DF</div>
        <div class="cl">Governo do DF</div>
        <div class="ctags"><span class="ct">Turismo</span><span class="ct">Cultura</span><span class="ct">Eventos</span></div>
      </div>
    </div>
  </div>
  <div class="p09-artists">
    <div class="art-label">Artistas cobertos</div>
    <div class="art-grid">
      <div class="art-item">Mochakk</div>
      <div class="art-item">Vintage Culture</div>
      <div class="art-item">ANNA</div>
      <div class="art-item">ARTBAT</div>
      <div class="art-item">Massano</div>
      <div class="art-item">Victor Lou</div>
      <div class="art-item">Lee Foss</div>
      <div class="art-item">Volac</div>
      <div class="art-item">Prospa</div>
      <div class="art-item">Meca</div>
      <div class="art-item">Fernanda Pistelli</div>
      <div class="art-item">Jessika Brankka</div>
      <div class="art-item">Rooftime</div>
      <div class="art-item">Halfcab</div>
      <div class="art-item">Solarce Brothers</div>
      <div class="art-item">Breaking Beatz</div>
      <div class="art-item">Ashibah</div>
      <div class="art-item">Acid Asian</div>
      <div class="art-item">Deekapz</div>
      <div class="art-item">Mu540</div>
      <div class="art-item">KLjay</div>
      <div class="art-item">Kenan &amp; Kel</div>
      <div class="art-item">Adame DJ</div>
      <div class="art-item">Classmatic</div>
      <div class="art-item">Sevenn</div>
      <div class="art-item">OsGemeos</div>
      <div class="art-item">Gordo</div>
      <div class="art-item">MauP</div>
    </div>
  </div>
  <div class="nav"><span>STUDIOCOMP! — PORTFÓLIO AUDIOVISUAL 2025–2026</span><span>09 / 10</span></div>
</div>

<!-- ░░ 10 CONTATO ░░ -->
<div class="pag">
  <div class="fbg"><img src="${a.pistaFoto1}" alt=""/><div style="position:absolute;inset:0;background:rgba(12,13,9,0.88)"></div></div>
  <div class="p10-body">
    <div class="eyebrow">Vamos trabalhar juntos</div>
    <div style="width:360px;margin:24px 0 0">${LOGO_FULL}</div>
    <div style="font-size:14px;color:rgba(255,255,255,0.52);margin-top:30px">contato@studiocomp.com.br</div>
    <a href="https://studiocomp.com.br" style="display:inline-flex;align-items:center;gap:10px;margin-top:24px;padding:12px 28px;background:#fff;border-radius:100px;text-decoration:none;color:#0c0d09;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase">
      Navegar pelo portfólio digital
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="#0c0d09" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </a>
  </div>
  <div class="nav"><span>BRASÍLIA, BRASIL</span><span>10 / 10</span></div>
</div>

</body>
</html>`;
}

(async () => {
  console.log('⬡  Baixando imagens remotas...');
  const keys = Object.keys(IMGS);
  const results = await Promise.all(keys.map(k => {
    process.stdout.write('  ↓ ' + k + '\n');
    return fetchImg(IMGS[k]);
  }));
  const assets = {};
  keys.forEach((k, i) => { assets[k] = results[i] || FALLBACK; });

  const failed = keys.filter((k, i) => !results[i]);
  if (failed.length) console.warn('  ⚠  Falhas remotas:', failed.join(', '));

  console.log('\n⬡  Lendo stills locais...');
  const BOMA_DIR      = 'C:/Users/GUGUB/Downloads/portfolio comp/stills/still boma';
  const TARAKA_DIR    = 'C:/Users/GUGUB/Downloads/portfolio comp/stills/still taraka';
  const STORY_DIR     = 'C:/Users/GUGUB/Downloads/portfolio comp/stills/stills storymaking';
  const COMPSTU_DIR   = 'C:/Users/GUGUB/Downloads/portfolio comp/stills/fotos compstu';

  const compstuFiles = [
    '@pedrotrvs-@comp.stu-156.jpg',
    '@pedrotrvs-@comp.stu-199.jpg',
    '@pedrotrvs-@comp.stu-33.jpg',
    '@pedrotrvs-@comp.stu-50.jpg',
    '@pedrotrvs-@comp.stu-51.jpg',
    '@pedrotrvs-@comp.stu-60.jpg',
    '@pedrotrvs-@comp.stu-73.jpg',
    '@pedrotrvs-@comp.stu-75.jpg',
  ];
  compstuFiles.forEach((name, i) => {
    assets[`compstu${i + 1}`] = readLocalImg(`${COMPSTU_DIR}/${name}`) || FALLBACK;
    console.log('  ✓', name);
  });

  const storyFiles = [
    'Captura de tela 2025-08-13 113619.png',
    'Captura de tela 2026-05-20 164003.png',
    'louzete.png',
    'ramemes.png',
  ];
  storyFiles.forEach((name, i) => {
    assets[`storyM${i + 1}`] = readLocalImg(`${STORY_DIR}/${name}`) || FALLBACK;
    console.log('  ✓', name);
  });

  ['boma1','boma2','boma3','boma4'].forEach((key, i) => {
    const f = `${BOMA_DIR}/image ${151 + i}.jpg`;
    assets[key] = readLocalImg(f) || FALLBACK;
    console.log('  ✓', `image ${151 + i}.jpg`);
  });
  assets['capa'] = readLocalImg(`${BOMA_DIR}/image 155.jpg`) || FALLBACK;
  console.log('  ✓ image 155.jpg (capa)');
  ['taraka1','taraka2','taraka3','taraka4','taraka5'].forEach((key, i) => {
    const f = `${TARAKA_DIR}/image ${146 + i}.jpg`;
    assets[key] = readLocalImg(f) || FALLBACK;
    console.log('  ✓', `image ${146 + i}.jpg`);
  });

  console.log('\n⬡  Gerando HTML...');
  const html = buildHTML(assets);
  fs.writeFileSync(TMP, html, 'utf8');

  console.log('⬡  Exportando PDF (A4 Horizontal)...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page    = await browser.newPage();

  await page.goto('file:///' + TMP.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 1500));

  await page.pdf({
    path: OUT,
    landscape: true,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();
  try { fs.unlinkSync(TMP); } catch (e) {}

  const { size } = fs.statSync(OUT);
  console.log(`\n✅  portfolio-comp.pdf — ${(size / 1024 / 1024).toFixed(1)} MB · 10 páginas · A4 Landscape`);
})();
