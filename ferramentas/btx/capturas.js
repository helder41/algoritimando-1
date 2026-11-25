// Capturas de tela do jogo para a BTX (vitrine, cartaz, redes).
// Uso: node capturas.js            (todas)
//      node capturas.js 03 07      (só estas, pelo número)
// Saída: ferramentas/btx/capturas/NN-nome.png
//   PC: 1920x1080; celular: 390x844 com escala 3 (1170x2532).
// Precisa de Playwright com Chromium. Música e efeitos ficam desligados.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SO = process.argv.slice(2);
const URL = 'file://' + path.resolve(__dirname, '../../index.html');
const SAIDA = path.join(__dirname, 'capturas');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const PC = { width: 1920, height: 1080, s: 1 };
const CEL = { width: 390, height: 844, s: 3 };
const TODOS = ['sanduiche', 'robo', 'mochila', 'abelhas', 'maos', 'rua', 'limonada', 'dentes'];

// progresso salvo: "feitos" concluídos com 3 estrelas
async function estado(p, feitos, extra = {}, vistas = true) {
  await p.evaluate(([feitos, extra, vistas]) => {
    localStorage.clear();
    const c = {}; const prog = {};
    SITUACOES.forEach(s => {
      if (feitos.includes(s.id)) { c[s.id] = true; prog[s.id] = { fase: s.fases.length, niveis: s.fases.map(() => 3) }; }
    });
    localStorage.setItem('algoritimando-progresso', JSON.stringify(prog));
    localStorage.setItem('algoritimando-perfil', JSON.stringify(Object.assign(
      { nome: 'Lia', avatar: '2', comecou: true, dicas: 3, concluidos: c, promovido: false, senior: false }, extra)));
    localStorage.setItem('algoritimando-som', 'desligado');
    localStorage.setItem('algoritimando-som-ajustes', JSON.stringify({ musica: false, efeitos: false }));
  }, [feitos, extra, vistas]);
  await p.reload();
  await sleep(700);
}

async function abrirNivel(p, id, n) {
  await p.evaluate(([id, n]) => { const s = SITUACOES.find(x => x.id === id); iniciarSituacao(s, s.id, n); }, [id, n]);
  await sleep(900);
  // no celular em pé, a cena do chamado abre em tela cheia: fecha
  await p.evaluate(() => { const c = document.getElementById('cena-cheia'); if (c && c.classList.contains('on')) c.click(); });
  await sleep(400);
}

// coloca as cartas nos espaços, na ordem dada (ids dos passos)
async function montar(p, ids) {
  await p.evaluate(ids => {
    const esp = [...document.querySelectorAll('.espaco')];
    ids.forEach((id, i) => Arrasto.mover(document.querySelector(`.carta[data-passo="${id}"]`), { tipo: 'espaco', espaco: esp[i] }));
  }, ids);
  await sleep(1400);
}

// a resposta certa da fase n do chamado (a ordem do professor)
const certa = (p, id, n) => p.evaluate(([id, n]) => SITUACOES.find(s => s.id === id).fases[n].passos.map(x => x.id), [id, n]);

async function concluirNivel(p, id, n) {
  await abrirNivel(p, id, n);
  await montar(p, await certa(p, id, n));
  await p.click('#btn-verificar');
  await sleep(2600);
}

// Os 20 quadros. Cada um recebe a página já aberta no tamanho certo.
const CAPTURAS = [
  ['01-menu', PC, async p => { await estado(p, []); await sleep(800); }],
  ['02-mapa', PC, async p => {
    await estado(p, ['sanduiche', 'robo', 'mochila']);
    await p.click('#bPlay'); await sleep(1600);
  }],
  ['03-sanduiche-montagem', PC, async p => {
    await estado(p, []);
    await abrirNivel(p, 'sanduiche', 1);
    await montar(p, ['pao', 'queijo', 'presunto', 'fechar']);
  }],
  ['04-robo-grade', PC, async p => {
    await estado(p, ['sanduiche']);
    await abrirNivel(p, 'robo', 1);
    await montar(p, ['andar', 'abrir-garra', 'fechar-garra']);
    await sleep(1200);
  }],
  ['05-limonada-bancada', PC, async p => {
    await estado(p, ['sanduiche']);
    await abrirNivel(p, 'limonada', 0);
    await montar(p, ['lavar', 'cortar']);
  }],
  ['06-dica-robo-guia', PC, async p => {
    await estado(p, []);
    await abrirNivel(p, 'sanduiche', 0);
    await montar(p, ['fechar', 'pao', 'queijo']);
    await p.click('#btn-verificar'); await sleep(1500);
    await p.click('#btn-dica'); await sleep(2200);
  }],
  ['07-licao-figurinha', PC, async p => {
    await estado(p, ['sanduiche']);
    await concluirNivel(p, 'limonada', 0);
  }],
  ['08-licao-selo', PC, async p => {
    await estado(p, ['sanduiche']);
    await p.evaluate(() => {
      const prog = { sanduiche: { fase: 5, niveis: [3, 3, 3, 3, 3] }, rua: { fase: 2, niveis: [3, 3] } };
      localStorage.setItem('algoritimando-progresso', JSON.stringify(prog));
    });
    await p.reload(); await sleep(700);
    await concluirNivel(p, 'rua', 2);
    await sleep(1200);
  }],
  ['09-album', PC, async p => {
    await estado(p, ['sanduiche', 'robo', 'mochila', 'limonada'], { promovido: true });
    await p.click('#bPlay'); await sleep(1400);
    await p.evaluate(() => Album.abrir()); await sleep(3200);
  }],
  ['10-meus-aprendizados', PC, async p => {
    await estado(p, TODOS, { promovido: true, senior: true });
    await p.click('#bPlay'); await sleep(1500);
    await p.click('#bIdeias'); await sleep(1000);
  }],
  ['11-promocao-senior', PC, async p => { await promoSenior(p); }],
  ['12-animacao-final-album', PC, async p => {
    await promoSenior(p);
    await p.click('#bPromoNext'); await sleep(800);
    await avancarFinal(p, 2); await sleep(4200);
  }],
  ['13-animacao-final-senior', PC, async p => {
    await promoSenior(p);
    await p.click('#bPromoNext'); await sleep(800);
    await avancarFinal(p, 5); await sleep(2600);
  }],
  ['14-missao-cumprida', PC, async p => {
    await promoSenior(p);
    await p.click('#bPromoNext'); await sleep(800);
    await p.click('#bFimPular'); await sleep(1800);
  }],
  ['15-certificado', PC, async p => {
    await estado(p, TODOS, { promovido: true, senior: true });
    await p.click('#bPlay'); await sleep(1400);
    await p.evaluate(() => Final.certificado(Perfil.dados)); await sleep(4500);
  }],
  // celular em pé
  ['16-celular-mapa', CEL, async p => {
    await estado(p, ['sanduiche', 'robo', 'mochila']);
    await p.click('#bPlay'); await sleep(1600);
  }],
  ['17-celular-nivel', CEL, async p => {
    await estado(p, ['sanduiche']);
    await abrirNivel(p, 'dentes', 0);
    const ids = await certa(p, 'dentes', 0);
    await montar(p, ids.slice(0, 2));
  }],
  ['18-celular-album', CEL, async p => {
    await estado(p, TODOS, { promovido: true, senior: true });
    await p.click('#bPlay'); await sleep(1400);
    await p.evaluate(() => Album.abrir()); await sleep(3200);
  }],
  // as montagens do jardim e da rua
  ['19-abelhas-jardim', PC, async p => {
    await estado(p, ['sanduiche']);
    await abrirNivel(p, 'abelhas', 1);
    await montar(p, ['sair', 'voar-flor', 'nectar']);
    await sleep(2500);
  }],
  ['20-rua-faixa', PC, async p => {
    await estado(p, ['sanduiche']);
    await abrirNivel(p, 'rua', 1);
    await montar(p, ['faixa', 'ver-luz', 'esperar']);
    await sleep(2500);
  }],
];

// o último nível do último chamado: a promoção a Agente Sênior
async function promoSenior(p) {
  await estado(p, TODOS.filter(x => x !== 'dentes'), { promovido: true });
  await p.evaluate(() => {
    const prog = JSON.parse(localStorage.getItem('algoritimando-progresso'));
    prog.dentes = { fase: 3, niveis: [3, 3, 3] };
    localStorage.setItem('algoritimando-progresso', JSON.stringify(prog));
  });
  await p.reload(); await sleep(700);
  await concluirNivel(p, 'dentes', 3);
  await p.evaluate(() => document.dispatchEvent(new CustomEvent('conclusao-continuar')));
  await sleep(2400);
}

async function avancarFinal(p, n) {
  for (let i = 0; i < n; i++) { await p.click('#bFimNext'); await sleep(350); }
}

(async () => {
  fs.mkdirSync(SAIDA, { recursive: true });
  const b = await chromium.launch();
  for (const [nome, vp, fn] of CAPTURAS) {
    if (SO.length && !SO.includes(nome.slice(0, 2))) continue;
    const p = await b.newPage({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.s, hasTouch: vp === CEL, isMobile: vp === CEL });
    p.on('pageerror', e => console.log('ERRO na página', nome, e.message));
    await p.goto(URL);
    try {
      await fn(p);
      await p.screenshot({ path: path.join(SAIDA, nome + '.png') });
      console.log('ok', nome, await p.evaluate(() => (document.querySelector('.screen.on') || {}).id));
    } catch (e) { console.log('FALHOU', nome, e.message); }
    await p.close();
  }
  await b.close();
})();
