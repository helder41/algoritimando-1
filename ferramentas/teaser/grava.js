// Grava as cenas do jogo quadro a quadro para o teaser.
// Uso: node grava.js h   (horizontal 1920x1080)
//      node grava.js v   (vertical 1080x1920: tela de celular 360x640, escala 3)
// Cada cena vira uma pasta em cenas-<h|v>/<nome>/ com JPGs e um "lista.txt"
// (formato concat do ffmpeg, com a duração de cada quadro).
//
// As animações CSS rodam a RITMO da velocidade normal (0.5 = metade) e as
// esperas do roteiro são divididas pelo mesmo RITMO: na montagem, a duração
// real de cada quadro é multiplicada pelo RITMO. Assim a captura (~18 qps)
// vira ~36 qps no vídeo.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ORI = process.argv[2] || 'h';
const SO = process.argv.slice(3);          // gravar só estas cenas (opcional)
const URL = 'file://' + path.resolve(__dirname, '../../index.html');
const SAIDA = path.join(__dirname, 'cenas-' + ORI);
let RITMO = 0.5;
const VIEW = ORI === 'h' ? { width: 1920, height: 1080, s: 1 } : { width: 360, height: 640, s: 3 };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const w = ms => sleep(ms / RITMO);          // espera em "tempo de vídeo"

// um círculo que mostra o toque (o cursor não aparece na captura)
const DEDO = `
  #dedo-teaser{position:fixed;left:0;top:0;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;
    background:rgba(255,255,255,.55);border:4px solid rgba(43,34,49,.75);box-shadow:0 4px 14px rgba(0,0,0,.35);
    z-index:99999;pointer-events:none;transition:transform .12s, opacity .2s;opacity:0}
  #dedo-teaser.on{opacity:1} #dedo-teaser.baixo{transform:scale(.72);background:rgba(255,211,77,.8)}`;

async function prepararPagina(b) {
  const p = await b.newPage({ viewport: { width: VIEW.width, height: VIEW.height }, deviceScaleFactor: VIEW.s });
  p.on('pageerror', e => console.log('ERRO na página:', e.message));
  await p.goto(URL);
  return p;
}

async function injetarDedo(p) {
  await p.addStyleTag({ content: DEDO + (ORI === 'v' ? '#dedo-teaser{width:30px;height:30px;margin:-15px 0 0 -15px;border-width:3px}' : '') });
  await p.evaluate(() => {
    const d = document.createElement('div'); d.id = 'dedo-teaser'; document.body.append(d);
    addEventListener('pointermove', e => { d.style.left = e.clientX + 'px'; d.style.top = e.clientY + 'px'; d.classList.add('on'); }, true);
    addEventListener('pointerdown', () => d.classList.add('baixo'), true);
    addEventListener('pointerup', () => d.classList.remove('baixo'), true);
  });
}

async function estado(p, feitos, extra = {}) {
  await p.evaluate(([feitos, extra]) => {
    localStorage.clear();
    const c = {}; const prog = {};
    SITUACOES.forEach(s => {
      if (feitos.includes(s.id)) { c[s.id] = true; prog[s.id] = { fase: s.fases.length, niveis: s.fases.map(() => 3) }; }
    });
    localStorage.setItem('algoritimando-progresso', JSON.stringify(prog));
    localStorage.setItem('algoritimando-perfil', JSON.stringify(Object.assign(
      { nome: 'Lia', avatar: '2', comecou: true, dicas: 3, concluidos: c, promovido: false, senior: false }, extra)));
    localStorage.setItem('algoritimando-som-ajustes', JSON.stringify({ musica: false }));
  }, [feitos, extra]);
  await p.reload();
  await sleep(600);
}

// grava enquanto "acao" roda; devolve a duração em segundos de vídeo
async function gravar(p, nome, acao, ritmo = ORI === 'v' ? 0.2 : 0.5) {
  RITMO = ritmo;
  const pasta = path.join(SAIDA, nome);
  fs.rmSync(pasta, { recursive: true, force: true });
  fs.mkdirSync(pasta, { recursive: true });
  const cdp = await p.context().newCDPSession(p);
  await cdp.send('Animation.enable');
  await cdp.send('Animation.setPlaybackRate', { playbackRate: RITMO });
  const quadros = [];
  let fim = false;
  const laco = (async () => {
    while (!fim) {
      const t = Date.now();
      const r = await cdp.send('Page.captureScreenshot', VIEW.s > 1
        ? { format: 'jpeg', quality: 92, clip: { x: 0, y: 0, width: VIEW.width, height: VIEW.height, scale: VIEW.s } }
        : { format: 'jpeg', quality: 92 });
      quadros.push({ t, d: r.data });
    }
  })();
  await acao();
  fim = true;
  await laco;
  await cdp.send('Animation.setPlaybackRate', { playbackRate: 1 });
  const R = RITMO; RITMO = 0.5;
  let lista = '';
  quadros.forEach((q, i) => {
    const arq = String(i).padStart(5, '0') + '.jpg';
    fs.writeFileSync(path.join(pasta, arq), Buffer.from(q.d, 'base64'));
    const prox = quadros[i + 1] ? quadros[i + 1].t : q.t + 50;
    lista += `file '${arq}'\nduration ${((prox - q.t) * R / 1000).toFixed(4)}\n`;
  });
  lista += `file '${String(quadros.length - 1).padStart(5, '0')}.jpg'\n`;
  fs.writeFileSync(path.join(pasta, 'lista.txt'), lista);
  const dur = (quadros[quadros.length - 1].t - quadros[0].t) * R / 1000;
  console.log(`${nome}: ${quadros.length} quadros, ${dur.toFixed(2)} s de vídeo`);
  return dur;
}

// arrasta uma carta até o espaço n (0 = primeiro), num movimento suave
async function arrastar(p, passo, n, ms = 700) {
  const carta = await p.$(`.bandeja .carta[data-passo="${passo}"]`);
  await carta.scrollIntoViewIfNeeded();
  const a = await carta.boundingBox();
  const e = await (await p.$$('.espaco'))[n].boundingBox();
  const x0 = a.x + a.width / 2, y0 = a.y + a.height / 2;
  const x1 = e.x + e.width / 2, y1 = e.y + e.height / 2;
  await p.mouse.move(x0 - 40, y0 + 30);
  await w(120);
  await p.mouse.move(x0, y0, { steps: 4 });
  await w(120);
  await p.mouse.down();
  await w(120);
  const passos = 16;
  for (let i = 1; i <= passos; i++) {
    const k = i / passos, s = k * k * (3 - 2 * k);
    await p.mouse.move(x0 + (x1 - x0) * s, y0 + (y1 - y0) * s);
    await w(ms / passos);
  }
  await w(100);
  await p.mouse.up();
  await w(250);
}

// celular em pé: rola a tela do nível devagar até o elemento ficar à vista
async function rolarAte(p, seletor, idx = 0) {
  const [de, alvo] = await p.evaluate(([sel, i]) => {
    const tela = document.querySelector('#fase');
    const el = document.querySelectorAll(sel)[i];
    const r = el.getBoundingClientRect();
    const t = tela.getBoundingClientRect();
    // o elemento um pouco acima do meio (o rodapé do celular é fixo)
    const desejado = tela.scrollTop + r.top - t.top - (t.height * 0.42 - r.height / 2);
    return [tela.scrollTop, Math.max(0, Math.min(desejado, tela.scrollHeight - tela.clientHeight))];
  }, [seletor, idx]);
  if (Math.abs(alvo - de) < 4) return;
  const n = 14;
  for (let i = 1; i <= n; i++) {
    const k = i / n, s = k * k * (3 - 2 * k);
    await p.evaluate(y => { document.querySelector('#fase').scrollTop = y; }, de + (alvo - de) * s);
    await w(320 / n);
  }
  await w(120);
}

async function tocarEl(p, el) {
  const r = await el.boundingBox();
  await p.mouse.move(r.x + r.width / 2, r.y + r.height / 2, { steps: 6 });
  await w(120);
  await p.mouse.down(); await w(90); await p.mouse.up();
}

// coloca a carta no espaço n: arrastando (horizontal) ou, no celular em pé,
// tocando na carta e depois no espaço, rolando a tela entre os toques; no fim
// volta para a montagem, que fica no alto
async function colocar(p, passo, n, ms) {
  if (ORI === 'h') return arrastar(p, passo, n, ms);
  await rolarAte(p, `.bandeja .carta[data-passo="${passo}"]`);
  await tocarEl(p, await p.$(`.bandeja .carta[data-passo="${passo}"]`));
  await w(250);
  await rolarAte(p, '.espaco', n);
  await tocarEl(p, (await p.$$('.espaco'))[n]);
  await w(250);
  await rolarAte(p, '.montagem');
  await w(500);
}

async function tocar(p, seletor) {
  if (ORI === 'v') await rolarAte(p, seletor);
  const el = await p.$(seletor);
  await el.scrollIntoViewIfNeeded();
  const r = await el.boundingBox();
  await p.mouse.move(r.x + r.width / 2, r.y + r.height / 2, { steps: 8 });
  await w(150);
  await p.mouse.down(); await w(90); await p.mouse.up();
}
const esconderDedo = p => p.evaluate(() => { const d = document.getElementById('dedo-teaser'); if (d) d.style.display = 'none'; });

async function abrirNivel(p, id, n) {
  await p.evaluate(([id, n]) => { const s = SITUACOES.find(x => x.id === id); iniciarSituacao(s, s.id, n); }, [id, n]);
  await sleep(900);
  // a abertura da cena (celular em pé) fecha antes de gravar
  await p.evaluate(() => { const c = document.getElementById('cena-cheia'); if (c.classList.contains('on')) c.click(); });
  await sleep(300);
  await injetarDedo(p);
}

async function cartao(p, c, ms) {
  await p.goto('file://' + path.join(__dirname, 'cartoes.html') + '?c=' + c + '&pausa=1');
  // espera as fontes e imagens e recomeça as animações do zero
  await p.evaluate(() => document.fonts.ready);
  await sleep(500);
  await gravar(p, c, async () => {
    await p.evaluate(() => { const s = document.querySelector('.cena.on'); s.classList.remove('on'); void s.offsetWidth; s.classList.add('on'); });
    await w(ms);
  }, 0.25);
}

const TODOS = ['sanduiche', 'robo', 'mochila', 'abelhas', 'maos', 'rua', 'limonada', 'dentes'];

const CENAS = {
  // o mapa da central, no meio do jogo
  async mapa(p) {
    await estado(p, ['sanduiche', 'robo', 'mochila']);
    await p.click('#bPlay'); await sleep(1500);
    await gravar(p, 'mapa', () => w(400));
  },

  // sanduíche nível 2: as fatias empilham na montagem
  async sanduiche(p) {
    await estado(p, []);
    await abrirNivel(p, 'sanduiche', 1);
    await gravar(p, 'sanduiche', async () => {
      await w(500);
      await colocar(p, 'pao', 0);
      await colocar(p, 'queijo', 1);
      await colocar(p, 'presunto', 2);
      await colocar(p, 'fechar', 3);
      await w(900);
    });
  },

  // robô nível 2: o robô anda, abre e fecha a garra
  async robo(p) {
    await estado(p, ['sanduiche']);
    await abrirNivel(p, 'robo', 1);
    await gravar(p, 'robo', async () => {
      await w(300);
      await colocar(p, 'andar', 0, 500);
      await colocar(p, 'abrir-garra', 1, 500);
      await colocar(p, 'fechar-garra', 2, 500);
      await colocar(p, 'colocar', 3, 500);
      await w(700);
    });
  },

  // limonada nível 1: a bancada muda a cada carta
  async limonada(p) {
    await estado(p, ['sanduiche']);
    await abrirNivel(p, 'limonada', 0);
    await gravar(p, 'limonada', async () => {
      await w(300);
      await colocar(p, 'lavar', 0, 500);
      await colocar(p, 'cortar', 1, 500);
      await colocar(p, 'espremer', 2, 500);
      await w(800);
    });
  },

  // mochila nível 1 (vai dentro do tablet da agente)
  async mochila(p) {
    await estado(p, ['sanduiche']);
    await abrirNivel(p, 'mochila', 0);
    await gravar(p, 'mochila', async () => {
      await w(300);
      await colocar(p, 'guardar-lapis', 0, 600);
      await colocar(p, 'fechar-estojo', 1, 600);
      await colocar(p, 'estojo-mochila', 2, 600);
      await w(600);
    });
  },

  // erro e dica: o Verificar avisa; a dica explica a consequência
  async dica(p) {
    await estado(p, []);
    await abrirNivel(p, 'sanduiche', 0);
    // a ordem errada já está montada quando a cena começa
    await p.evaluate(() => {
      const esp = [...document.querySelectorAll('.espaco')];
      ['fechar', 'pao'].forEach((id, i) => Arrasto.mover(document.querySelector(`.carta[data-passo="${id}"]`), { tipo: 'espaco', espaco: esp[i] }));
    });
    await sleep(400);
    await gravar(p, 'dica', async () => {
      await w(200);
      await colocar(p, 'queijo', 2, 500);
      await w(300);
      await tocar(p, '#btn-verificar');
      await w(1700);
      await tocar(p, '#btn-dica');
      await w(2400);
    });
  },

  // nível concluído: lição com "+1 figurinha" e a figurinha colando no álbum
  async album(p) {
    await estado(p, []);
    await abrirNivel(p, 'sanduiche', 0);
    await p.evaluate(() => {
      const esp = [...document.querySelectorAll('.espaco')];
      SITUACOES[0].fases[0].passos.forEach((ps, i) => Arrasto.mover(document.querySelector(`.carta[data-passo="${ps.id}"]`), { tipo: 'espaco', espaco: esp[i] }));
    });
    await sleep(300);
    await gravar(p, 'album', async () => {
      await w(150);
      await tocar(p, '#btn-verificar');
      await esconderDedo(p);
      await w(2300);
      await p.evaluate(() => Album.abrir());
      await w(2200);
    });
  },

  // os selos: "Meus aprendizados"
  async ideias(p) {
    await estado(p, TODOS, { promovido: true, senior: true });
    await p.click('#bPlay'); await sleep(1500);
    await p.click('#bIdeias'); await sleep(900);
    await gravar(p, 'ideias', () => w(400));
  },

  // promoção a Agente Sênior: concluir o último nível do último chamado
  async promo(p) {
    await estado(p, TODOS.filter(x => x !== 'dentes'), { promovido: true });
    await p.evaluate(() => { const prog = JSON.parse(localStorage.getItem('algoritimando-progresso')); prog.dentes = { fase: 3, niveis: [3, 3, 3] }; localStorage.setItem('algoritimando-progresso', JSON.stringify(prog)); });
    await p.reload(); await sleep(600);
    await abrirNivel(p, 'dentes', 3);
    await p.evaluate(() => {
      const esp = [...document.querySelectorAll('.espaco')];
      SITUACOES.find(s => s.id === 'dentes').fases[3].passos.forEach((ps, i) => Arrasto.mover(document.querySelector(`.carta[data-passo="${ps.id}"]`), { tipo: 'espaco', espaco: esp[i] }));
    });
    await p.click('#btn-verificar'); await sleep(1600);
    await esconderDedo(p);
    await p.evaluate(() => document.dispatchEvent(new CustomEvent('conclusao-continuar')));
    await sleep(200);
    await gravar(p, 'promo', () => w(2600));
    console.log('tela da promoção:', await p.evaluate(() => document.querySelector('.screen.on').id));
  },

  // o certificado (Agente Sênior)
  async certificado(p) {
    await estado(p, TODOS, { promovido: true, senior: true });
    await p.evaluate(() => Final.certificado(Perfil.dados));
    await sleep(900);
    await gravar(p, 'certificado', () => w(300));
  },

  // cartões próprios do teaser (cartoes.html)
  async intro(p) { await cartao(p, 'intro', 5000); },
  async titulo(p) { await cartao(p, 'titulo', 4000); },
  async fim(p) { await cartao(p, 'fim', 5600); },

  // créditos: os crachás caem e balançam
  async creditos(p) {
    await estado(p, []);
    await p.addStyleTag({ content: '#bCreditosFechar{visibility:hidden}' });
    await gravar(p, 'creditos', async () => {
      await p.evaluate(() => document.getElementById('bCreditos').click());
      await w(5400);
    }, 0.12);
  },
};

(async () => {
  fs.mkdirSync(SAIDA, { recursive: true });
  const b = await chromium.launch();
  for (const [nome, fn] of Object.entries(CENAS)) {
    if (SO.length && !SO.includes(nome)) continue;
    const p = await prepararPagina(b);
    try { await fn(p); } catch (e) { console.log('FALHOU', nome, e.message); }
    await p.close();
  }
  await b.close();
})();
