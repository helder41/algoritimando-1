/* ============================================================
   testes/telas.spec.js — as telas principais do jogo, no navegador

   Cada teste começa com o aparelho "limpo" (localStorage vazio, como
   uma criança abrindo o jogo pela primeira vez) e falha se a página
   der algum erro de JavaScript. Os mesmos testes rodam no PC e no
   celular (ver playwright.config.js).

   Para mover uma carta, os testes usam o "toque simples" do
   arrasto.js: tocar na carta e depois no espaço.
   ============================================================ */

'use strict';

const { test, expect } = require('@playwright/test');

/* ---------------- ajudantes ---------------- */

// guarda os erros de JavaScript da página; cada teste confere no fim
test.beforeEach(async ({ page }, info) => {
  const erros = [];
  page.on('pageerror', e => erros.push(e.message));
  info.erros = erros;
});

test.afterEach(async ({}, info) => {
  expect(info.erros, 'erros de JavaScript na página').toEqual([]);
});

/* Começa o jogo com um perfil e um progresso já gravados, como se a
   criança já tivesse jogado antes. */
async function comMemoria(page, perfil, progresso = {}) {
  await page.addInitScript(([pf, pg]) => {
    if (sessionStorage.getItem('teste-memoria')) return; // só na primeira carga
    sessionStorage.setItem('teste-memoria', '1');
    localStorage.setItem('algoritimando-perfil', JSON.stringify(pf));
    localStorage.setItem('algoritimando-progresso', JSON.stringify(pg));
  }, [perfil, progresso]);
}

const tela = (page, id) => page.locator(`#${id}`);

/* Do menu até a central, pelo caminho de quem joga pela primeira vez. */
async function primeiraVez(page, nome = 'Teste') {
  await page.goto('index.html');
  await expect(tela(page, 'menu')).toHaveClass(/\bon\b/);
  await page.click('#bPlay');
  await expect(tela(page, 'story')).toHaveClass(/\bon\b/);
  await page.click('#bSkip');
  await expect(tela(page, 'char')).toHaveClass(/\bon\b/);
  await page.fill('#nameIn', nome);
  await page.click('#bConfirm');
  await expect(tela(page, 'hub')).toHaveClass(/\bon\b/);
}

/* Abre o sanduíche pelo mapa (a Casa é o único lugar liberado no começo). */
async function abrirSanduiche(page) {
  await page.locator('#mapa .lugar:not(.trancado)').first().click();
  await expect(page.locator('#local')).toHaveClass(/\bon\b/);
  await page.locator('#local .call').filter({ has: page.locator('.meta b', { hasText: /sanduíche/i }) }).click();
  await expect(tela(page, 'fase')).toHaveClass(/\bon\b/);
}

/* Os ids dos passos do nível que está na tela, na ordem do professor
   (que é sempre uma ordem certa). */
async function ordemCerta(page) {
  return page.evaluate(() => {
    const titulo = document.querySelector('#fase .fase-titulo').textContent;
    const nivel = Number(document.querySelector('.progresso-texto').textContent.match(/Nível (\d+)/)[1]) - 1;
    const s = SITUACOES.find(x => x.fases[nivel] && (x.fases[nivel].titulo || x.titulo) === titulo);
    return s.fases[nivel].passos.map(p => p.id);
  });
}

/* Coloca as cartas nos espaços, na ordem dada (toque na carta, toque no espaço). */
async function colocar(page, ids) {
  const espacos = page.locator('.tabuleiro-grade .espaco');
  for (let i = 0; i < ids.length; i++) {
    await page.locator(`.bandeja .carta[data-passo="${ids[i]}"]`).click();
    await espacos.nth(i).click();
    await expect(espacos.nth(i).locator(`.carta[data-passo="${ids[i]}"]`)).toHaveCount(1);
  }
}

/* ---------------- menu ---------------- */

test.describe('menu', () => {
  test('abre com os botões e a versão do jogo', async ({ page }) => {
    await page.goto('index.html');
    await expect(tela(page, 'menu')).toHaveClass(/\bon\b/);
    await expect(page.locator('.logo')).toHaveText('Algoritimando');
    await expect(page.locator('#bPlay')).toHaveText('Jogar');
    await expect(page.locator('#versaoJogo')).toHaveText(/^v\d+\.\d+ · \d{2}\/\d{2}\/\d{4}$/);
    // sem progresso, não há o que reiniciar
    await expect(page.locator('#bReiniciar')).toBeHidden();
  });

  test('as janelas do menu abrem e fecham com Esc', async ({ page }) => {
    await page.goto('index.html');
    for (const [botao, janela] of [['#bHow', '#how'], ['#bSound', '#sons'], ['#bCreditos', '#creditos']]) {
      await page.click(botao);
      await expect(page.locator(janela)).toHaveClass(/\bon\b/);
      await page.keyboard.press('Escape');
      await expect(page.locator(janela)).not.toHaveClass(/\bon\b/);
    }
  });

  test('nenhuma tela passa da largura da janela', async ({ page }) => {
    await page.goto('index.html');
    const sobra = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(sobra).toBeLessThanOrEqual(0);
  });
});

/* ---------------- abertura e crachá ---------------- */

test.describe('abertura e crachá', () => {
  test('a abertura passa pelos 4 quadros e chega ao crachá', async ({ page }) => {
    await page.goto('index.html');
    await page.click('#bPlay');
    await expect(page.locator('#dots i')).toHaveCount(4);
    for (let i = 0; i < 3; i++) await page.click('#bNext');
    await expect(page.locator('#bNext')).toHaveText('Começar!');
    await page.click('#bNext');
    await expect(tela(page, 'char')).toHaveClass(/\bon\b/);
  });

  test('o nome e o agente escolhidos vão para o crachá e para o topo', async ({ page }) => {
    await page.goto('index.html');
    await page.click('#bPlay');
    await page.click('#bSkip');
    await page.click('.avatar[data-a="3"]');
    await expect(page.locator('#badgeFace')).toHaveAttribute('src', /av3\.webp/);
    await page.fill('#nameIn', 'Lia');
    await expect(page.locator('#badgeName')).toHaveText('Lia');
    await page.click('#bConfirm');
    await expect(tela(page, 'hub')).toHaveClass(/\bon\b/);
    await expect(page.locator('#hub .chip.who')).toContainText('Lia');
  });
});

/* ---------------- central (mapa) ---------------- */

test.describe('central de chamados', () => {
  test('no começo só a Casa abre, e só o sanduíche', async ({ page }) => {
    await primeiraVez(page);
    await expect(page.locator('#progTxt')).toHaveText('0 de 8');
    await expect(page.locator('#mapa')).toHaveClass(/trancado/);
    await expect(page.locator('#mapa .lugar:not(.trancado)')).toHaveCount(1);
    await expect(page.locator('#mapa .lugar:not(.trancado) .lugar-nome')).toHaveText('Casa');
    await page.locator('#mapa .lugar:not(.trancado)').click();
    await expect(page.locator('#local .local-aviso')).toBeVisible();
  });

  test('depois do sanduíche, a cidade toda abre', async ({ page }) => {
    await comMemoria(page,
      { nome: 'Teste', avatar: '0', comecou: true, dicas: 5, concluidos: { sanduiche: true } },
      { sanduiche: { fase: 5, niveis: [3, 3, 3, 3, 3] } });
    await page.goto('index.html');
    await expect(page.locator('#bPlay')).toHaveText('Continuar');
    await page.click('#bPlay');
    await expect(tela(page, 'hub')).toHaveClass(/\bon\b/);
    await expect(page.locator('#mapa')).not.toHaveClass(/trancado/);
    await expect(page.locator('#mapa .lugar.trancado')).toHaveCount(0);
    await expect(page.locator('#progTxt')).toHaveText('1 de 8');
  });

  test('o álbum e "Meus aprendizados" abrem', async ({ page }) => {
    await primeiraVez(page);
    await page.click('#bAlbum');
    await expect(page.locator('#album')).toHaveClass(/\bon\b/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#album')).not.toHaveClass(/\bon\b/);
    await page.click('#bIdeias');
    await expect(page.locator('#ideias')).toHaveClass(/\bon\b/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#ideias')).not.toHaveClass(/\bon\b/);
  });

  test('"Meus aprendizados" tem um selo para cada chamado', async ({ page }) => {
    await comMemoria(page,
      { nome: 'Teste', avatar: '0', comecou: true, dicas: 5, concluidos: { sanduiche: true, abelhas: true } },
      { sanduiche: { fase: 5, niveis: [3, 3, 3, 3, 3] }, abelhas: { fase: 4, niveis: [3, 3, 3, 3] } });
    await page.goto('index.html');
    await page.click('#bPlay');
    await expect(tela(page, 'hub')).toHaveClass(/\bon\b/);
    const total = await page.evaluate(() => SITUACOES.length);
    await expect(page.locator('#badgeSelos .selo')).toHaveCount(total);
    await page.click('#bIdeias');
    await expect(page.locator('#ideias .ideia')).toHaveCount(total);
    await expect(page.locator('#ideias .ideia:not(.apagada)')).toHaveCount(2);
    await expect(page.locator('#ideias .ideia:not(.apagada) b')).toHaveText(['Ordem', 'Algoritmo']);
  });
});

/* ---------------- nível (tabuleiro) ---------------- */

test.describe('nível', () => {
  test('o tabuleiro tem um espaço por carta e o Verificar só libera cheio', async ({ page }) => {
    await primeiraVez(page);
    await abrirSanduiche(page);
    const ids = await ordemCerta(page);
    await expect(page.locator('.tabuleiro-grade .espaco')).toHaveCount(ids.length);
    await expect(page.locator('.bandeja .carta')).toHaveCount(ids.length);
    await expect(page.locator('.progresso-texto')).toHaveText(/^Nível 1 de \d+$/);
    await expect(page.locator('#btn-verificar')).toBeDisabled();
    await colocar(page, ids.slice(0, -1));
    await expect(page.locator('#btn-verificar')).toBeDisabled();
  });

  test('ordem certa: "Tudo certo!", lição e próximo nível', async ({ page }) => {
    await primeiraVez(page);
    await abrirSanduiche(page);
    await colocar(page, await ordemCerta(page));
    await expect(page.locator('#btn-verificar')).toBeEnabled();
    await page.click('#btn-verificar');
    await expect(page.locator('.verificacao')).toHaveText('Tudo certo!');
    await expect(tela(page, 'licao')).toHaveClass(/\bon\b/);
    await expect(page.locator('.premio-estrelas')).toContainText('3');
    await expect(page.locator('.premio-figurinha')).toBeVisible();
    // o texto para o professor fica atrás do botão
    await expect(page.locator('#licao-professor')).toBeHidden();
    await page.click('.licao-botao-prof');
    await expect(page.locator('#licao-professor')).toBeVisible();
    await page.click('.conclusao-continuar');
    await expect(tela(page, 'fase')).toHaveClass(/\bon\b/);
    await expect(page.locator('.progresso-texto')).toHaveText(/^Nível 2 de \d+$/);
  });

  test('ordem errada: o tabuleiro avisa e a criança continua no nível', async ({ page }) => {
    await primeiraVez(page);
    await abrirSanduiche(page);
    const ids = await ordemCerta(page);
    // o último passo do sanduíche (fechar) no primeiro espaço sempre é erro
    await colocar(page, [ids[ids.length - 1], ...ids.slice(0, -1)]);
    await page.click('#btn-verificar');
    await expect(page.locator('.verificacao')).toHaveText(/Ainda não está na ordem certa/);
    await expect(page.locator('.tabuleiro')).toHaveClass(/errado/);
    await expect(tela(page, 'fase')).toHaveClass(/\bon\b/);
    // a carta nunca fica presa: dá para tirar e pôr de volta
    await page.locator('.tabuleiro-grade .espaco').first().locator('.carta').click();
    await page.locator('.bandeja').click();
    await expect(page.locator('.bandeja .carta')).toHaveCount(1);
  });

  test('a dica coloca uma carta certa e gasta a dica', async ({ page }) => {
    await primeiraVez(page);
    await abrirSanduiche(page);
    await expect(page.locator('.dica-restantes')).toHaveText('1');
    await page.click('#btn-dica');
    await expect(page.locator('.tabuleiro-grade .carta')).toHaveCount(1);
    await expect(page.locator('.mascote-balao')).toContainText('Passo');
    await expect(page.locator('.dica-restantes')).toHaveText('0');
  });

  test('a lista de níveis mostra o 1 liberado e os outros bloqueados', async ({ page }) => {
    await primeiraVez(page);
    await abrirSanduiche(page);
    await page.click('#btn-niveis');
    await expect(page.locator('#niveis')).toHaveClass(/\bon\b/);
    await expect(page.locator('#niveis .nivel-btn').first()).toBeEnabled();
    await expect(page.locator('#niveis .nivel-btn').nth(1)).toBeDisabled();
  });

  test('o progresso fica guardado ao recarregar a página', async ({ page }) => {
    await primeiraVez(page);
    await abrirSanduiche(page);
    await colocar(page, await ordemCerta(page));
    await page.click('#btn-verificar');
    await expect(tela(page, 'licao')).toHaveClass(/\bon\b/);
    await page.reload();
    await expect(page.locator('#bPlay')).toHaveText('Continuar');
    await page.click('#bPlay');
    await expect(tela(page, 'hub')).toHaveClass(/\bon\b/);
    await expect(page.locator('#hub .gStars')).toHaveText('3');
  });
});

/* ---------------- promoções e fim ---------------- */

test.describe('promoções e fim do jogo', () => {
  test('com metade dos chamados, aparece a promoção a Agente', async ({ page }) => {
    await page.goto('index.html');
    const ids = await page.evaluate(() => SITUACOES.map(s => s.id));
    const metade = Object.fromEntries(ids.slice(0, Math.ceil(ids.length / 2)).map(id => [id, true]));
    await page.evaluate(m => {
      localStorage.setItem('algoritimando-perfil', JSON.stringify(
        { nome: 'Teste', avatar: '0', comecou: true, dicas: 5, concluidos: m }));
    }, metade);
    await page.reload();
    await page.click('#bPlay');
    await expect(tela(page, 'promo')).toHaveClass(/\bon\b/);
    await expect(page.locator('#promoPara')).toHaveText('Agente');
    await page.click('#bPromoNext');
    await expect(tela(page, 'hub')).toHaveClass(/\bon\b/);
  });

  test('com os 8 chamados, a central mostra o certificado', async ({ page }) => {
    await page.goto('index.html');
    const ids = await page.evaluate(() => SITUACOES.map(s => ({ id: s.id, n: s.fases.length })));
    await page.evaluate(lista => {
      localStorage.setItem('algoritimando-perfil', JSON.stringify({
        nome: 'Teste', avatar: '0', comecou: true, dicas: 5, promovido: true, senior: true,
        concluidos: Object.fromEntries(lista.map(s => [s.id, true])),
      }));
      localStorage.setItem('algoritimando-progresso', JSON.stringify(
        Object.fromEntries(lista.map(s => [s.id, { fase: s.n, niveis: Array(s.n).fill(3) }]))));
    }, ids);
    await page.reload();
    await page.click('#bPlay');
    await expect(tela(page, 'hub')).toHaveClass(/\bon\b/);
    await expect(page.locator('#progTxt')).toHaveText(`${ids.length} de ${ids.length}`);
    await expect(page.locator('#bCertificado')).toBeVisible();
    await page.click('#bCertificado');
    await expect(page.locator('#certificado')).toHaveClass(/\bon\b/);
    await expect(page.locator('#certificado')).toContainText('Teste');
  });
});

/* ---------------- agentes da equipe (segredo) ---------------- */

test.describe('agentes da equipe', () => {
  test('o segredo libera o botão dourado, que abre o menu dos 4 agentes', async ({ page }) => {
    await page.goto('index.html');
    await page.click('#bPlay');
    await page.click('#bSkip');
    await expect(tela(page, 'char')).toHaveClass(/\bon\b/);
    await expect(page.locator('.avatar-secreto')).toBeHidden();
    const estrela = page.locator('#badgeEstrelas img').nth(2);
    for (let i = 0; i < 10; i++) await estrela.click({ force: true });
    await expect(page.locator('#segredo')).toHaveClass(/\bon\b/);
    await page.click('#bSegredoOk');
    await expect(page.locator('#equipe')).toHaveClass(/\bon\b/);
    await expect(page.locator('.equipe-card')).toHaveCount(4);
    await page.locator('.equipe-card[data-a="9"]').click();
    await expect(page.locator('#equipe')).not.toHaveClass(/\bon\b/);
    await expect(page.locator('#badgeFace')).toHaveAttribute('src', 'img/av9.webp');
    await expect(page.locator('#cracha')).toHaveClass(/\bsecreto\b/);
    await expect(page.locator('.avatar-secreto')).toHaveClass(/\bsel\b/);
    // o botão dourado reabre o menu, e Esc fecha
    await page.click('.avatar-secreto');
    await expect(page.locator('#equipe')).toHaveClass(/\bon\b/);
    await expect(page.locator('.equipe-card[data-a="9"]')).toHaveClass(/\bsel\b/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#equipe')).not.toHaveClass(/\bon\b/);
  });

  test('os créditos mostram a foto do agente de cada pessoa', async ({ page }) => {
    await page.goto('index.html');
    await page.click('#bCreditos');
    const fotos = page.locator('#creditos .cred-foto img');
    await expect(fotos).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      expect(await fotos.nth(i).evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
    }
  });
});
