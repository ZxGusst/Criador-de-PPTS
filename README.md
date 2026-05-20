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
│   ├── portfolio-audiovisual/   ← portfólio A4 landscape, 10 páginas, imagens locais e remotas
│   │   └── gerar.js
│   └── proposta-comercial/      ← proposta com capa navegável e links internos no PDF
│       ├── gerar.js
│       ├── template.html
│       └── capa-navegacao.html
└── utils/
    ├── capturar-html.js         ← captura o HTML completo de qualquer URL
    ├── extrair-css.js           ← extrai o CSS aplicado de uma página
    ├── gerar-pdf-url.js         ← gera PDF direto de uma URL
    └── debug-screenshot.js      ← screenshot para depurar o layout
```

---

## Requisitos

```bash
node -v   # >= 18
npm install
```

---

## Exemplos incluídos

### Portfólio Audiovisual (`exemplos/portfolio-audiovisual/`)

PDF A4 Landscape, 10 páginas, com:
- Imagens remotas (via CDN) e locais (stills de vídeo)
- Design system completo: tipografia, paleta, grid
- Todas as imagens embutidas como base64 (PDF standalone, sem dependências)

**Como rodar:**
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

### Proposta Comercial (`exemplos/proposta-comercial/`)

PDF mobile-first (430×932px), com:
- Capa com cards navegáveis (links internos via GoTo do PDF)
- 3 páginas de proposta em abas (Pista Externa, Pista Coletivos, Pacote Completo)
- Fontes Google e design system dark

**Como rodar:**
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

## Como criar um novo tipo de documento

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
cp -r exemplos/portfolio-audiovisual exemplos/meu-projeto
```

Estrutura mínima de um gerador:

```javascript
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// 1. Monte o HTML com seus dados
const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    /* A4 Landscape */
    .pag { width: 297mm; height: 210mm; overflow: hidden; page-break-after: always; }
    /* A4 Retrato */
    /* .pag { width: 210mm; height: 297mm; } */
    @media print { body { -webkit-print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="pag">Página 1</div>
  <div class="pag">Página 2</div>
</body>
</html>`;

// 2. Salva HTML temporário e gera PDF
(async () => {
  const tmp = path.join(__dirname, '_tmp.html');
  fs.writeFileSync(tmp, html);

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('file:///' + tmp.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });

  await page.pdf({
    path: 'saida.pdf',
    format: 'A4',
    landscape: true,          // false para retrato
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();
  fs.unlinkSync(tmp);
  console.log('PDF gerado: saida.pdf');
})();
```

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

- `portfolio-comp.pdf` — portfólio audiovisual StudioComp, A4 Landscape, 10 páginas
- `proposta-pista-livre.pdf` — proposta Festival Pista Livre, mobile-first, com navegação interna
