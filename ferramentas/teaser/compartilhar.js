// Gera o cartão para compartilhar (site e QR code) em três formatos.
// Uso: node compartilhar.js   → saida-compartilhar/*.png
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const OUT = path.join(__dirname, 'saida-compartilhar');
const FORMATOS = [
  // nome, classe, largura e altura em px (a página é desenhada na metade, escala 2)
  ['algoritimando-qr-horizontal', '', 1920, 1080],
  ['algoritimando-qr-quadrado', 'quadrado', 1080, 1080],
  ['algoritimando-qr-stories', 'empe', 1080, 1920],
];
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  for (const [nome, classe, w, h] of FORMATOS) {
    const p = await b.newPage({ viewport: { width: w / 2, height: h / 2 }, deviceScaleFactor: 2 });
    await p.goto('file://' + path.join(__dirname, 'compartilhar.html') + '?f=' + classe);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(OUT, nome + '.png') });
    console.log(nome);
    await p.close();
  }
  await b.close();
})();
