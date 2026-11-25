// Gera as legendas como PNG transparente, no tamanho do vídeo.
// Uso: node legendas.js <h|v> <arquivo.json>   (json: [{arq, t, pos}])
const { chromium } = require('playwright');
const path = require('path');
const [ori, json] = process.argv.slice(2);
const itens = require(path.resolve(json));
(async () => {
  const b = await chromium.launch();
  const vp = ori === 'h' ? { width: 1920, height: 1080, s: 1 } : { width: 360, height: 640, s: 3 };
  const p = await b.newPage({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.s });
  for (const it of itens) {
    const q = new URLSearchParams({ t: it.t, pos: it.pos || '' });
    await p.goto('file://' + path.join(__dirname, 'legenda.html') + '?' + q);
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: it.arq, omitBackground: true });
  }
  await b.close();
})();
