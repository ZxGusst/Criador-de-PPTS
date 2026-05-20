# Criador de PDFs — Propostas, Portfólios e Apresentações

Toolkit para gerar PDFs de alto padrão visual a partir de qualquer fonte de conteúdo — sites, docs, PDFs, Notion, Google Drive ou do zero.

O processo usa **Puppeteer** (headless Chrome) para renderizar HTML/CSS com qualidade de impressão e exportar como PDF. O resultado tem a mesma fidelidade visual que um navegador — fontes web, gradientes, sombras, imagens remotas ou locais, tudo preservado.

---

## Como funciona

```
Fonte de conteúdo          Template HTML/CSS         PDF final
(site, doc, dados)   →     (design + dados)    →    (puppeteer)
```

1. **Conteúdo** — vem de qualquer lugar: URL, arquivo local, API, planilha
2. **Template** — HTML + CSS inline com o design desejado
3. **Gerador** — script Node.js que monta o HTML, abre no Puppeteer e exporta PDF

---

## Estrutura

```
criador-de-ppts/
├── exemplos/
│   ├── portfolio-audiovisual/
│   │   ├── gerar.js          ← A4 Landscape (297×210mm) — para impressão, apresentação, e-mail
│   │   └── gerar-mobile.js   ← Mobile (430×760px) — para WhatsApp, DMs, links diretos
│   └── proposta-comercial/
│       ├── gerar.js
│       ├── template.html
│       └── capa-navegacao.html
└── utils/
    ├── capturar-html.js      ← captura o HTML completo de qualquer URL
    ├── extrair-css.js        ← extrai o CSS aplicado de uma página
    ├── gerar-pdf-url.js      ← gera PDF direto de uma URL
    └── debug-screenshot.js   ← screenshot para depurar o layout
```

---

## Requisitos

```bash
node -v   # >= 18
npm install
```

---

## Exemplos incluídos

### Portfólio Audiovisual — duas versões de canal

O mesmo conteúdo, dois formatos — cada um otimizado para o canal onde o cliente vai receber:

| Versão | Formato | Canal | Script |
|---|---|---|---|
| Horizontal | A4 Landscape (297×210mm) | E-mail, reunião, impressão | `gerar.js` |
| Mobile | 430×760px por página | WhatsApp, DMs, links diretos | `gerar-mobile.js` |

Ambas carregam os mesmos assets (imagens remotas via CDN + stills locais), aplicam o mesmo design system e geram um PDF standalone — sem dependências externas.

#### Versão Horizontal — A4 Landscape

PDF A4 Landscape, 10 páginas, com:
- Imagens remotas (via CDN) e locais (stills de vídeo)
- Design system completo: tipografia, paleta, grid
- Todas as imagens embutidas como base64 (PDF standalone, sem dependências)

```bash
node exemplos/portfolio-audiovisual/gerar.js
# Saída: portfolio-comp.pdf
```

**Como adaptar:**
1. Edite o dicionário `IMGS` no topo do arquivo com suas URLs
2. Ajuste os caminhos locais (`BOMA_DIR`, `TARAKA_DIR`, etc.) para suas pastas
3. Modifique a função `buildHTML(assets)` com seu conteúdo e design
4. Rode o script

---

#### Versão Mobile — 430×760px

PDF mobile-first, 10 páginas, com:
- Layout em coluna única, tipografia ampliada, grids 3-4 colunas adaptados
- Imagens com `aspect-ratio` fixo (4:5, 3:4) para nunca distorcer
- Backgrounds full-bleed com gradiente direcional (conteúdo visível no topo, texto no rodapé)
- Links internos funcionais em cada card — sets individuais, reels e highlights
- CTAs por página com links reais de demonstração
- Design system idêntico ao horizontal: mesma paleta, mesma tipografia

```bash
node exemplos/portfolio-audiovisual/gerar-mobile.js
# Saída: portfolio-mobile.pdf
```

**Como adaptar:**
1. Edite `IMGS` com suas URLs remotas
2. Ajuste os caminhos de stills locais no início do bloco `async`
3. Atualize os `href` dos CTAs e cards com seus links reais
4. Modifique `buildHTML(assets)` — cada `<!-- ░░ P0X ░░ -->` é uma página independente

---

### Proposta Comercial (`exemplos/proposta-comercial/`)

PDF mobile-first (430×932px), com:
- Capa com cards navegáveis (links internos via GoTo do PDF)
- 3 páginas de proposta em abas (Pista Externa, Pista Coletivos, Pacote Completo)
- Fontes Google e design system dark

```bash
node exemplos/proposta-comercial/gerar.js
# Saída: proposta-pista-livre.pdf
```

---

## Utils

### `capturar-html.js` — Capturar site como base

Captura o HTML de qualquer URL com o CSS e recursos resolvidos — útil para usar como ponto de partida do template.

```bash
node utils/capturar-html.js https://seusite.com.br
# Salva: captura.html
```

### `extrair-css.js` — Extrair design de um site

Extrai todos os estilos aplicados de uma página — útil para replicar a identidade visual de um site existente.

```bash
node utils/extrair-css.js https://seusite.com.br
# Salva: estilos.css
```

### `gerar-pdf-url.js` — PDF direto de URL

Gera um PDF de uma URL sem precisar montar template. Ideal para propostas ou docs já publicados online.

```bash
node utils/gerar-pdf-url.js https://seusite.com.br/proposta
# Salva: output.pdf
```

### `debug-screenshot.js` — Depurar layout

Tira um screenshot da página antes de gerar o PDF — para ajustar o layout sem esperar o processo completo.

```bash
node utils/debug-screenshot.js
```

---

## Como criar um novo documento

### 1. De um site existente

```bash
# 1. Captura o HTML
node utils/capturar-html.js https://seusite.com.br/pagina

# 2. Edita captura.html com seus dados
# 3. Gera PDF a partir do HTML local
node utils/gerar-pdf-url.js ./captura.html
```

### 2. De um PDF ou Doc existente

1. Converta o arquivo para HTML com ferramentas como Pandoc ou LibreOffice:
   ```bash
   pandoc documento.docx -o documento.html
   # ou
   libreoffice --convert-to html documento.pdf
   ```
2. Abra o HTML resultante no navegador e use `utils/extrair-css.js` para inspecionar estilos
3. Limpe e adapte o HTML no padrão dos templates deste repo

### 3. Do zero (recomendado para novos projetos)

Copie um dos exemplos como base:

```bash
# Para um documento horizontal (A4, relatório, portfólio):
cp -r exemplos/portfolio-audiovisual exemplos/meu-projeto
# Use gerar.js como ponto de partida

# Para um documento mobile (WhatsApp, DM, link):
cp -r exemplos/portfolio-audiovisual exemplos/meu-projeto
# Use gerar-mobile.js como ponto de partida
```

Estrutura mínima de um gerador:

```javascript
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    /* A4 Landscape */
    .pag { width: 297mm; height: 210mm; overflow: hidden; page-break-after: always; }

    /* Mobile (430×760px) */
    /* .pag { width: 430px; height: 760px; overflow: hidden; page-break-after: always; } */

    @media print { body { -webkit-print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="pag">Página 1</div>
  <div class="pag">Página 2</div>
</body>
</html>`;

(async () => {
  const tmp = path.join(__dirname, '_tmp.html');
  fs.writeFileSync(tmp, html);

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('file:///' + tmp.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });

  // A4 Landscape
  await page.pdf({
    path: 'saida.pdf',
    format: 'A4',
    landscape: true,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  // Mobile (430×760px) — use este em vez do anterior
  // await page.pdf({
  //   path: 'saida-mobile.pdf',
  //   width: '430px',
  //   height: '760px',
  //   printBackground: true,
  //   margin: { top: 0, right: 0, bottom: 0, left: 0 },
  // });

  await browser.close();
  fs.unlinkSync(tmp);
  console.log('PDF gerado: saida.pdf');
})();
```

---

## Estratégia multi-canal

O mesmo documento pode — e deve — ter versões para cada canal:

| Canal | Formato recomendado | Como gerar |
|---|---|---|
| E-mail / reunião | A4 Landscape | `page.pdf({ format: 'A4', landscape: true })` |
| WhatsApp / DMs | 430×760px | `page.pdf({ width: '430px', height: '760px' })` |
| Apresentação (tela 16:9) | 1280×720px | `page.pdf({ width: '1280px', height: '720px' })` |
| Impressão A4 retrato | A4 | `page.pdf({ format: 'A4', landscape: false })` |
| Stories (9:16) | 1080×1920px | `page.pdf({ width: '1080px', height: '1920px' })` |

O design system (cores, tipografia, lógica de conteúdo) permanece o mesmo — só o layout e o `width/height` do PDF mudam.

---

## Fontes de conteúdo suportadas

| Fonte | Estratégia |
|---|---|
| Site / URL | `gerar-pdf-url.js` ou `capturar-html.js` + editar |
| HTML local | Abrir diretamente com Puppeteer |
| PDF existente | Converter para HTML → adaptar template |
| DOCX / Google Doc | Pandoc para HTML → adaptar template |
| Notion | Exportar como HTML → adaptar template |
| Figma | Exportar frames como imagens → montar no template |
| Dados / API | Buscar dados em JS → montar HTML dinamicamente |
| Imagens locais | `fs.readFileSync` + base64 → embutir no HTML |
| Imagens remotas | `https.get` com headers de referer → base64 |

---

## Stack

- **Node.js** — runtime
- **Puppeteer** — headless Chrome, renderização e export PDF
- **pdf-lib** — pós-processamento do PDF (links internos, anotações)
- **HTML/CSS** — template e design (sem frameworks, zero dependências no front)

---

## Exemplos de resultado

- `portfolio-comp.pdf` — portfólio StudioComp, A4 Landscape, 10 páginas
- `portfolio-mobile.pdf` — portfólio StudioComp, Mobile 430×760px, 10 páginas
- `proposta-pista-livre.pdf` — proposta Festival Pista Livre, mobile-first, com navegação interna
