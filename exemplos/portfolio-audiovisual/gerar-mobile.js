'use strict';
const https = require('https');
const path  = require('path');
const fs    = require('fs');

const OUT      = path.join(__dirname, 'portfolio-mobile.html');
const FALLBACK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const LOGO_D = `M31.4209 0.53857C34.3116 2.2404 34.9508 8.4981 33.3344 19.3035L32.8255 22.6217L32.1863 25.9398C31.7588 28.6636 31.4209 30.8336 31.1644 32.45C30.57 37.299 30.4804 40.9591 30.9079 43.4264C31.1644 45.0427 31.3761 46.5328 31.5471 47.8927C31.885 49.851 32.1863 51.7238 32.4387 53.5112C33.2041 58.2787 33.8434 62.6188 34.3523 66.5314C35.7121 77.5933 36.1803 85.3412 35.7569 89.7627C35.4149 92.8284 34.9915 96.5293 34.4785 100.869C33.7131 106.146 32.9476 110.954 32.1782 115.294C29.9633 127.378 27.9236 133.847 26.0507 134.694C23.8359 135.631 21.3687 135.289 18.649 133.672C15.9252 132.056 14.3089 130.098 13.8 127.801C13.458 126.271 13.3725 123.844 13.5435 120.526C13.629 119.333 13.7552 117.717 13.9262 115.677L14.1827 113.124L14.4392 110.445C15.2901 101 15.0784 93.8096 13.8 88.871C13.0346 85.8949 12.0982 83.1711 10.9907 80.7039C10.2253 79.0875 9.15862 77.0885 7.79878 74.7027C5.07504 70.0247 3.3325 65.9411 2.56708 62.4478C1.03625 55.555 0.185322 46.8341 0.0143248 36.2811C-0.156673 23.7698 1.20318 16.1116 4.09792 13.3064C7.58709 9.73172 12.3099 6.45834 18.2663 3.4781C24.6502 0.245432 29.031 -0.735765 31.4127 0.542646L31.4209 0.53857ZM30.6555 152.82C32.0153 157.075 31.5919 161.968 29.377 167.501C27.2477 172.949 24.9108 175.16 22.358 174.138C19.2068 172.859 16.1044 171.076 13.0386 168.776C9.46397 166.052 7.76215 163.796 7.93315 162.009C8.27107 159.456 9.12199 156.692 10.4859 153.712C12.1877 150.222 13.9751 148.268 15.8479 147.841C18.4861 147.161 21.2506 147.161 24.1453 147.841C27.6345 148.606 29.8045 150.267 30.6555 152.82Z`;

const LOGO_FULL = (() => {
  try {
    return fs.readFileSync('C:/Users/GUGUB/Downloads/LOGO COMP.svg', 'utf8')
      .replace(/(<svg[^>]*)\s+width="[^"]*"/, '$1')
      .replace(/(<svg[^>]*)\s+height="[^"]*"/, '$1 style="display:block;width:100%;height:auto"');
  } catch(e) { return ''; }
})();

const IMGS = {
  homeHero:      'https://framerusercontent.com/images/vxais7EAbwqfXMmTinWOUzYDhaA.png',
  aboutTeam:     'https://framerusercontent.com/images/s9YjXnJorVbkyyK5lm5vxUY.png',
  realtimeHero:  'https://framerusercontent.com/images/12CJIPinT7KBKnTU6iJeJXOANWo.webp',
  setWhoMadeWho: 'https://framerusercontent.com/images/feB4wK3NtgnYuehtTmoVaXLs4k.png',
  setTh4ys:      'https://framerusercontent.com/images/J471Z8IPDe7c3cnasR0PkwJrwI.jpg',
  setAdame:      'https://framerusercontent.com/images/wTAnc6yIpoaT6tEwqxORmXV4anc.jpg',
  setAshibah:    'https://framerusercontent.com/images/VavgqdADWx0geFgJWe1cWHOXVQ.jpg',
  setDjMarky:    'https://framerusercontent.com/images/WT2o6qRbqj0uScn9DDzuGZboLko.png',
  setMu540:      'https://framerusercontent.com/images/g5PTjNP1pXPHYbAu3rVI1xmEN4.jpg',
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

function div() {
  return `<div class="divider"><span>— — — — — — — —</span></div>`;
}

function tag(label) {
  return `<span class="tag">${label}</span>`;
}

function stat(label, value) {
  return `<div class="stat"><div class="stat-v">${value}</div><div class="stat-l">${label}</div></div>`;
}

function buildHTML(a) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>StudioComp — Portfólio Audiovisual 2025–2026</title>
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&family=Barlow:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap" rel="stylesheet"/>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{background:#0c0d09}
body{background:#0c0d09;font-family:'Barlow',system-ui,sans-serif;color:#fff;max-width:430px;margin:0 auto;padding:48px 20px 80px}
:root{--lime:#ccdc2d;--lime-dim:rgba(204,220,45,0.1);--b1:rgba(255,255,255,0.08)}
img{display:block;width:100%;height:100%;object-fit:cover}

/* divider */
.divider{margin:56px 0;text-align:center;color:rgba(255,255,255,0.18);font-size:13px;letter-spacing:6px}

/* eyebrow */
.eyebrow{font-size:9px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--lime);margin-bottom:10px}

/* display headline */
.disp{font-family:'Big Shoulders Display',sans-serif;font-weight:900;line-height:.95;letter-spacing:-.01em}
.acc{color:var(--lime);font-style:italic}

/* body text */
.body{font-size:13px;line-height:1.75;color:rgba(255,255,255,0.6)}
.body strong{color:rgba(255,255,255,0.85);font-weight:600}

/* lbar */
.lbar{width:24px;height:2px;background:var(--lime);border-radius:1px;margin:10px 0 14px}

/* tags */
.tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:12px}
.tag{background:var(--lime-dim);color:var(--lime);font-size:9px;font-weight:700;padding:3px 8px;border-radius:4px;letter-spacing:.06em;text-transform:uppercase}

/* pills (about) */
.pills{display:flex;flex-direction:column;border-top:1px solid var(--b1);padding-top:10px;margin-top:18px}
.pill{display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:12px;color:rgba(255,255,255,0.75)}
.pill::before{content:'';width:4px;height:4px;background:var(--lime);border-radius:50%;flex-shrink:0}

/* 2-col photo grid */
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-top:16px}
.grid2 .ph{border-radius:6px;overflow:hidden;aspect-ratio:1/1}

/* 3-col photo grid */
.grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;margin-top:16px}
.grid3 .ph{border-radius:5px;overflow:hidden;aspect-ratio:1/1}

/* full-width photo */
.photo-full{border-radius:10px;overflow:hidden;margin-top:16px;aspect-ratio:16/9}

/* stats row */
.stats{display:flex;gap:0;border-top:1px solid var(--b1);border-bottom:1px solid var(--b1);margin-top:18px}
.stat{flex:1;padding:12px 0;border-right:1px solid var(--b1)}
.stat:last-child{border-right:none}
.stat-v{font-family:'Big Shoulders Display',sans-serif;font-weight:900;font-size:20px;color:#fff;padding-left:12px}
.stat-l{font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,0.38);padding-left:12px;margin-top:2px}

/* story vertical cards */
.vcards{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:16px}
.vcard{border-radius:10px;overflow:hidden;aspect-ratio:9/16;background:#111}

/* client cards */
.ccards{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:16px}
.cc{background:rgba(255,255,255,0.03);border:1px solid var(--b1);border-radius:10px;overflow:hidden}
.cc-img{height:90px;overflow:hidden}
.cc-body{padding:9px 10px}
.cn{font-family:'Big Shoulders Display',sans-serif;font-weight:900;font-size:13px;line-height:1.1;margin-bottom:2px}
.cl{font-size:8px;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:6px}
.ct{background:var(--lime-dim);color:var(--lime);font-size:7px;font-weight:700;padding:2px 5px;border-radius:3px;letter-spacing:.06em;text-transform:uppercase;display:inline-block;margin:1px 1px 0 0}

/* artist list */
.art-list{display:grid;grid-template-columns:1fr 1fr;gap:0;margin-top:12px;border-top:1px solid var(--b1)}
.art-item{font-size:11.5px;color:rgba(255,255,255,0.6);padding:7px 6px;border-bottom:1px solid rgba(255,255,255,0.04);display:flex;align-items:center;gap:7px}
.art-item::before{content:'';width:3px;height:3px;background:var(--lime);border-radius:50%;flex-shrink:0}

/* set cards (sets page) */
.set-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px;margin-top:16px}
.sg{border-radius:6px;overflow:hidden;aspect-ratio:3/4;position:relative}
.sg-over{position:absolute;bottom:0;left:0;right:0;padding:8px;background:linear-gradient(transparent,rgba(0,0,0,0.82))}
.sg-n{font-size:10px;font-weight:700;color:#fff;line-height:1.2}
.sg-s{font-size:8px;color:rgba(255,255,255,0.5);margin-top:1px}

/* deliverables list */
.dlist{display:flex;flex-direction:column;gap:5px;margin-top:14px}
.di{font-size:12px;color:rgba(255,255,255,0.65);display:flex;align-items:center;gap:9px}
.di::before{content:'';width:4px;height:4px;background:var(--lime);border-radius:50%;flex-shrink:0}

/* cta button */
.cta-btn{display:inline-flex;align-items:center;gap:10px;margin-top:24px;padding:13px 28px;background:#fff;border-radius:100px;text-decoration:none;color:#0c0d09;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase}
</style>
</head>
<body>

<!-- ░░ HEADER ░░ -->
<section>
  <div class="eyebrow">Portfólio Audiovisual 2025–2026</div>
  <svg style="width:16px;height:80px;margin-bottom:12px" viewBox="0 0 36 175" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="${LOGO_D}" fill="#ccdc2d"/></svg>
  <div class="disp" style="font-size:52px;line-height:.9">Studio<span class="acc">Comp!</span></div>
  <div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,0.42);margin-top:10px">Brasília, Brasil · Audiovisual</div>
  <div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--b1);display:flex;flex-direction:column;gap:5px">
    <div style="font-size:11px;color:rgba(255,255,255,0.5)">contato@studiocomp.com.br</div>
    <div style="font-size:11px;color:rgba(255,255,255,0.3)">studiocomp.com.br</div>
  </div>
  <div class="photo-full"><img src="${a.homeHero}" alt="StudioComp"/></div>
</section>

${div()}

<!-- ░░ QUEM SOMOS ░░ -->
<section>
  <div class="eyebrow">02 — Quem somos</div>
  <div class="lbar"></div>
  <div class="disp" style="font-size:26px;margin-bottom:14px">Cada entrega responde ao briefing.<br/>Não é sorte. <span class="acc">É técnica.</span></div>
  <p class="body">Nascemos para transformar eventos, experiências e marcas em narrativas audiovisuais de impacto. Acumulamos mais de <strong>7 milhões de visualizações</strong> — atendendo clientes públicos e privados, do entretenimento ao mercado corporativo.</p>
  <p class="body" style="margin-top:8px;font-style:italic;color:rgba(255,255,255,0.38)">Cada projeto recebe o mesmo rigor técnico e olhar criativo — seja um festival de grande porte, uma ativação de marca ou um lançamento institucional.</p>
  <div class="pills">
    <div class="pill">Cobertura de Eventos</div>
    <div class="pill">Branded Content</div>
    <div class="pill">Drops &amp; Conteúdo Digital</div>
    <div class="pill">Direção Criativa</div>
  </div>
  <div class="grid2">
    <div class="ph"><img src="${a.compstu1}" alt=""/></div>
    <div class="ph"><img src="${a.compstu2}" alt=""/></div>
    <div class="ph"><img src="${a.compstu3}" alt=""/></div>
    <div class="ph"><img src="${a.compstu4}" alt=""/></div>
    <div class="ph"><img src="${a.compstu5}" alt=""/></div>
    <div class="ph"><img src="${a.compstu6}" alt=""/></div>
    <div class="ph"><img src="${a.compstu7}" alt=""/></div>
    <div class="ph"><img src="${a.compstu8}" alt=""/></div>
  </div>
</section>

${div()}

<!-- ░░ SETS & MULTICAM ░░ -->
<section>
  <div class="eyebrow">03 — Sets &amp; Multicam</div>
  <div class="lbar"></div>
  <div class="disp" style="font-size:26px;margin-bottom:14px">Do primeiro<br/><span class="acc">ao último beat.</span></div>
  <p class="body">Cobertura multicâmera de sets completos — com operadores dedicados, abertura de plano e closes cinematográficos sincronizados ao BPM.</p>
  <div class="tags">
    <span class="tag">Multicam</span>
    <span class="tag">Full Set</span>
    <span class="tag">Drone</span>
    <span class="tag">Slow Motion</span>
  </div>
  <div class="set-grid">
    <div class="sg"><img src="${a.setWhoMadeWho}" alt=""/><div class="sg-over"><div class="sg-n">WhoMadeWho</div><div class="sg-s">BOMA 2026</div></div></div>
    <div class="sg"><img src="${a.setTh4ys}" alt=""/><div class="sg-over"><div class="sg-n">Th4ys</div><div class="sg-s">Taraka 2024</div></div></div>
    <div class="sg"><img src="${a.setAdame}" alt=""/><div class="sg-over"><div class="sg-n">Adame</div><div class="sg-s">Pista Livre</div></div></div>
    <div class="sg"><img src="${a.setAshibah}" alt=""/><div class="sg-over"><div class="sg-n">Ashibah</div><div class="sg-s">Pista Livre</div></div></div>
    <div class="sg"><img src="${a.setDjMarky}" alt=""/><div class="sg-over"><div class="sg-n">DJ Marky</div><div class="sg-s">2024</div></div></div>
    <div class="sg"><img src="${a.setMu540}" alt=""/><div class="sg-over"><div class="sg-n">DJ MU540</div><div class="sg-s">2024</div></div></div>
  </div>
</section>

${div()}

<!-- ░░ IN REAL TIME ░░ -->
<section>
  <div class="eyebrow">04 — In Real Time</div>
  <div class="lbar"></div>
  <div class="disp" style="font-size:26px;margin-bottom:14px">Conteúdo que nasce<br/><span class="acc">enquanto acontece.</span></div>
  <p class="body">Conteúdo vertical editado e publicado durante o evento — reels, stories e drops que entregam reach orgânico antes do dia acabar.</p>
  <div class="photo-full"><img src="${a.realtimeHero}" alt="In Real Time"/></div>
  <div class="dlist" style="margin-top:18px">
    <div class="di">Reels verticais no dia do evento</div>
    <div class="di">Stories e cobertura ao vivo</div>
    <div class="di">Clipes de set com identidade visual</div>
    <div class="di">Aftermovie entregue em até 7 dias</div>
    <div class="di">Summer All Day</div>
  </div>
</section>

${div()}

<!-- ░░ STORYMAKING ░░ -->
<section>
  <div class="eyebrow">05 — StoryMaking</div>
  <div class="lbar"></div>
  <div class="disp" style="font-size:26px;margin-bottom:14px">A marca que<br/><span class="acc">tem história vende.</span></div>
  <p class="body">Produto audiovisual voltado para marcas e marketing — documentais curtos, mini-docs de bastidores e conteúdos de ativação que geram valor de identidade.</p>
  <div class="tags" style="margin-bottom:14px">
    <span class="tag">Mini-doc</span>
    <span class="tag">Ativação de Marca</span>
    <span class="tag">Branded Content</span>
  </div>
  <div style="border-top:1px solid var(--b1);padding-top:12px;display:flex;flex-direction:column;gap:5px">
    <div class="di">Louzete</div>
    <div class="di">Rá de Mesa</div>
    <div class="di">SETU</div>
    <div class="di">Projeto Audiovisual Corporativo</div>
  </div>
  <div class="vcards">
    <div class="vcard"><img src="${a.storyM1}" alt=""/></div>
    <div class="vcard"><img src="${a.storyM2}" alt=""/></div>
    <div class="vcard"><img src="${a.storyM3}" alt=""/></div>
    <div class="vcard"><img src="${a.storyM4}" alt=""/></div>
  </div>
</section>

${div()}

<!-- ░░ BOMA 2026 ░░ -->
<section>
  <div class="eyebrow">06 — Projeto</div>
  <div class="lbar"></div>
  <div class="disp" style="font-size:32px;margin-bottom:6px">BOMA <span class="acc">2026</span></div>
  <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:14px">Edição BSB · Festival de música eletrônica</div>
  <p class="body">Cobertura completa do maior festival de eletrônica de Brasília — sets multicam dos headliners internacionais, drone aéreo e conteúdo vertical para redes sociais.</p>
  <div class="tags">
    <span class="tag">Multicam</span>
    <span class="tag">Drone</span>
    <span class="tag">Full Sets</span>
    <span class="tag">Social</span>
  </div>
  <div class="stats">
    ${stat('Câmeras', '5+')}
    ${stat('Sets cobertos', '12')}
    ${stat('Dias', '2')}
  </div>
  <div class="grid2">
    <div class="ph"><img src="${a.boma1}" alt=""/></div>
    <div class="ph"><img src="${a.boma2}" alt=""/></div>
    <div class="ph"><img src="${a.boma3}" alt=""/></div>
    <div class="ph"><img src="${a.boma4}" alt=""/></div>
  </div>
</section>

${div()}

<!-- ░░ PISTA LIVRE ░░ -->
<section>
  <div class="eyebrow">07 — Projeto</div>
  <div class="lbar"></div>
  <div class="disp" style="font-size:32px;margin-bottom:6px">Festival <span class="acc">Pista Livre</span></div>
  <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:14px">Museu Nacional · Brasília</div>
  <p class="body">Cobertura de dois palcos simultâneos com equipes independentes — sets completos na Pista Externa e na Pista Coletivos, com lógicas visuais distintas para cada ambiente.</p>
  <div class="tags">
    <span class="tag">2 Palcos</span>
    <span class="tag">Multicam</span>
    <span class="tag">Drone</span>
    <span class="tag">Cena Local</span>
  </div>
  <div class="stats">
    ${stat('Palcos', '2')}
    ${stat('Câmeras', '9')}
    ${stat('Full Sets', '14+')}
  </div>
  <div class="grid3">
    <div class="ph"><img src="${a.pistaFoto1}" alt=""/></div>
    <div class="ph"><img src="${a.pistaFoto2}" alt=""/></div>
    <div class="ph"><img src="${a.pistaFoto3}" alt=""/></div>
    <div class="ph"><img src="${a.pistaFoto4}" alt=""/></div>
    <div class="ph"><img src="${a.pistaFoto5}" alt=""/></div>
    <div class="ph" style="background:#111;border-radius:5px"></div>
  </div>
</section>

${div()}

<!-- ░░ TARAKA ░░ -->
<section>
  <div class="eyebrow">08 — Projeto</div>
  <div class="lbar"></div>
  <div class="disp" style="font-size:32px;margin-bottom:6px">Taraka <span class="acc">Festival</span></div>
  <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:14px">Brasília · 2024</div>
  <p class="body">Festival de múltiplos palcos com headliners nacionais e internacionais — cobertura multicam, aftermovie e conteúdo para redes sociais com identidade visual do evento.</p>
  <div class="tags">
    <span class="tag">Multicam</span>
    <span class="tag">Aftermovie</span>
    <span class="tag">Social Media</span>
  </div>
  <div class="stats">
    ${stat('Headliners', '8+')}
    ${stat('Câmeras', '4')}
    ${stat('Dias', '2')}
  </div>
  <div class="grid2">
    <div class="ph"><img src="${a.taraka1}" alt=""/></div>
    <div class="ph"><img src="${a.taraka2}" alt=""/></div>
    <div class="ph"><img src="${a.taraka3}" alt=""/></div>
    <div class="ph"><img src="${a.taraka4}" alt=""/></div>
  </div>
</section>

${div()}

<!-- ░░ COM QUEM CRIAMOS ░░ -->
<section>
  <div class="eyebrow">09 — Com quem criamos</div>
  <div class="lbar"></div>
  <div class="disp" style="font-size:26px;margin-bottom:14px">Clientes que<br/><span class="acc">confiam no processo.</span></div>
  <div class="ccards">
    <div class="cc">
      <div class="cc-img"><img src="${a.pistaFoto2}" alt="Pista Livre"/></div>
      <div class="cc-body"><div class="cn">Festival Pista Livre</div><div class="cl">Brasília</div><div><span class="ct">Festival</span><span class="ct">Multicam</span></div></div>
    </div>
    <div class="cc">
      <div class="cc-img"><img src="${a.boma1}" alt="BOMA"/></div>
      <div class="cc-body"><div class="cn">BOMA</div><div class="cl">Brasília</div><div><span class="ct">Festival</span><span class="ct">Sets</span></div></div>
    </div>
    <div class="cc">
      <div class="cc-img"><img src="${a.taraka1}" alt="Taraka"/></div>
      <div class="cc-body"><div class="cn">Taraka Festival</div><div class="cl">Brasília</div><div><span class="ct">Festival</span><span class="ct">Aftermovie</span></div></div>
    </div>
    <div class="cc">
      <div class="cc-img"><img src="${a.storyM1}" alt="StoryMaking"/></div>
      <div class="cc-body"><div class="cn">StoryMaking</div><div class="cl">Projetos</div><div><span class="ct">Branded</span><span class="ct">Mini-doc</span></div></div>
    </div>
    <div class="cc">
      <div class="cc-img"><img src="${a.pistaFoto4}" alt="SETUR DF"/></div>
      <div class="cc-body"><div class="cn">SETUR DF</div><div class="cl">Governo do DF</div><div><span class="ct">Turismo</span><span class="ct">Cultura</span></div></div>
    </div>
    <div class="cc">
      <div class="cc-img"><img src="${a.realtimeHero}" alt="XTN prod"/></div>
      <div class="cc-body"><div class="cn">XTN prod</div><div class="cl">Brasília</div><div><span class="ct">Produção</span><span class="ct">Eventos</span></div></div>
    </div>
  </div>
  <div style="margin-top:22px">
    <div style="font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:8px">Artistas cobertos</div>
    <div class="art-list">
      <div class="art-item">Mochakk</div>
      <div class="art-item">Vintage Culture</div>
      <div class="art-item">ANNA</div>
      <div class="art-item">ARTBAT</div>
      <div class="art-item">Massano</div>
      <div class="art-item">Victor Lou</div>
      <div class="art-item">Lee Foss</div>
      <div class="art-item">Volac</div>
      <div class="art-item">Prospa</div>
      <div class="art-item">WhoMadeWho</div>
      <div class="art-item">Ashibah</div>
      <div class="art-item">Adame DJ</div>
      <div class="art-item">DJ Marky</div>
      <div class="art-item">DJ MU540</div>
      <div class="art-item">Th4ys</div>
      <div class="art-item">Classmatic</div>
      <div class="art-item">Sevenn</div>
      <div class="art-item">Gordo</div>
      <div class="art-item">Fernanda Pistelli</div>
      <div class="art-item">Jessika Brankka</div>
    </div>
  </div>
</section>

${div()}

<!-- ░░ CONTATO ░░ -->
<section style="text-align:center;display:flex;flex-direction:column;align-items:center">
  <div class="eyebrow">Vamos trabalhar juntos</div>
  <div style="width:260px;margin:20px 0">${LOGO_FULL}</div>
  <div style="font-size:14px;color:rgba(255,255,255,0.5)">contato@studiocomp.com.br</div>
  <a href="https://studiocomp.com.br" class="cta-btn">
    Portfólio digital
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="#0c0d09" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </a>
</section>

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
  const BOMA_DIR    = 'C:/Users/GUGUB/Downloads/portfolio comp/stills/still boma';
  const TARAKA_DIR  = 'C:/Users/GUGUB/Downloads/portfolio comp/stills/still taraka';
  const STORY_DIR   = 'C:/Users/GUGUB/Downloads/portfolio comp/stills/stills storymaking';
  const COMPSTU_DIR = 'C:/Users/GUGUB/Downloads/portfolio comp/stills/fotos compstu';

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
    assets[key] = readLocalImg(`${BOMA_DIR}/image ${151 + i}.jpg`) || FALLBACK;
    console.log('  ✓', `boma image ${151 + i}.jpg`);
  });

  ['taraka1','taraka2','taraka3','taraka4'].forEach((key, i) => {
    assets[key] = readLocalImg(`${TARAKA_DIR}/image ${146 + i}.jpg`) || FALLBACK;
    console.log('  ✓', `taraka image ${146 + i}.jpg`);
  });

  console.log('\n⬡  Gerando HTML mobile...');
  const html = buildHTML(assets);
  fs.writeFileSync(OUT, html, 'utf8');

  const kb = Math.round(fs.statSync(OUT).size / 1024);
  console.log(`\n✅  portfolio-mobile.html — ${kb > 1024 ? (kb/1024).toFixed(1)+' MB' : kb+' KB'} · abre direto no navegador mobile`);
})();
