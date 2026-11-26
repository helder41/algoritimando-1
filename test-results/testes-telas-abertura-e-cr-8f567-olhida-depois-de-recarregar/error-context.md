# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: testes/telas.spec.js >> abertura e crachá >> a agente 10 (cabelo cacheado) continua escolhida depois de recarregar
- Location: testes/telas.spec.js:141:3

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "index.html", waiting until "load"

```

# Test source

```ts
  42  | 
  43  | /* Do menu até a central, pelo caminho de quem joga pela primeira vez. */
  44  | async function primeiraVez(page, nome = 'Teste') {
  45  |   await page.goto('index.html');
  46  |   await expect(tela(page, 'menu')).toHaveClass(/\bon\b/);
  47  |   await page.click('#bPlay');
  48  |   await expect(tela(page, 'story')).toHaveClass(/\bon\b/);
  49  |   await page.click('#bSkip');
  50  |   await expect(tela(page, 'char')).toHaveClass(/\bon\b/);
  51  |   await page.fill('#nameIn', nome);
  52  |   await page.click('#bConfirm');
  53  |   await expect(tela(page, 'hub')).toHaveClass(/\bon\b/);
  54  | }
  55  | 
  56  | /* Abre o sanduíche pelo mapa (a Casa é o único lugar liberado no começo). */
  57  | async function abrirSanduiche(page) {
  58  |   await page.locator('#mapa .lugar:not(.trancado)').first().click();
  59  |   await expect(page.locator('#local')).toHaveClass(/\bon\b/);
  60  |   await page.locator('#local .call').filter({ has: page.locator('.meta b', { hasText: /sanduíche/i }) }).click();
  61  |   await expect(tela(page, 'fase')).toHaveClass(/\bon\b/);
  62  | }
  63  | 
  64  | /* Os ids dos passos do nível que está na tela, na ordem do professor
  65  |    (que é sempre uma ordem certa). */
  66  | async function ordemCerta(page) {
  67  |   return page.evaluate(() => {
  68  |     const titulo = document.querySelector('#fase .fase-titulo').textContent;
  69  |     const nivel = Number(document.querySelector('.progresso-texto').textContent.match(/Nível (\d+)/)[1]) - 1;
  70  |     const s = SITUACOES.find(x => x.fases[nivel] && (x.fases[nivel].titulo || x.titulo) === titulo);
  71  |     return s.fases[nivel].passos.map(p => p.id);
  72  |   });
  73  | }
  74  | 
  75  | /* Coloca as cartas nos espaços, na ordem dada (toque na carta, toque no espaço). */
  76  | async function colocar(page, ids) {
  77  |   const espacos = page.locator('.tabuleiro-grade .espaco');
  78  |   for (let i = 0; i < ids.length; i++) {
  79  |     await page.locator(`.bandeja .carta[data-passo="${ids[i]}"]`).click();
  80  |     await espacos.nth(i).click();
  81  |     await expect(espacos.nth(i).locator(`.carta[data-passo="${ids[i]}"]`)).toHaveCount(1);
  82  |   }
  83  | }
  84  | 
  85  | /* ---------------- menu ---------------- */
  86  | 
  87  | test.describe('menu', () => {
  88  |   test('abre com os botões e a versão do jogo', async ({ page }) => {
  89  |     await page.goto('index.html');
  90  |     await expect(tela(page, 'menu')).toHaveClass(/\bon\b/);
  91  |     await expect(page.locator('.logo')).toHaveText('Algoritimando');
  92  |     await expect(page.locator('#bPlay')).toHaveText('Jogar');
  93  |     await expect(page.locator('#versaoJogo')).toHaveText(/^v\d+\.\d+ · \d{2}\/\d{2}\/\d{4}$/);
  94  |     // sem progresso, não há o que reiniciar
  95  |     await expect(page.locator('#bReiniciar')).toBeHidden();
  96  |   });
  97  | 
  98  |   test('as janelas do menu abrem e fecham com Esc', async ({ page }) => {
  99  |     await page.goto('index.html');
  100 |     for (const [botao, janela] of [['#bHow', '#how'], ['#bSound', '#sons'], ['#bCreditos', '#creditos']]) {
  101 |       await page.click(botao);
  102 |       await expect(page.locator(janela)).toHaveClass(/\bon\b/);
  103 |       await page.keyboard.press('Escape');
  104 |       await expect(page.locator(janela)).not.toHaveClass(/\bon\b/);
  105 |     }
  106 |   });
  107 | 
  108 |   test('nenhuma tela passa da largura da janela', async ({ page }) => {
  109 |     await page.goto('index.html');
  110 |     const sobra = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  111 |     expect(sobra).toBeLessThanOrEqual(0);
  112 |   });
  113 | });
  114 | 
  115 | /* ---------------- abertura e crachá ---------------- */
  116 | 
  117 | test.describe('abertura e crachá', () => {
  118 |   test('a abertura passa pelos 4 quadros e chega ao crachá', async ({ page }) => {
  119 |     await page.goto('index.html');
  120 |     await page.click('#bPlay');
  121 |     await expect(page.locator('#dots i')).toHaveCount(4);
  122 |     for (let i = 0; i < 3; i++) await page.click('#bNext');
  123 |     await expect(page.locator('#bNext')).toHaveText('Começar!');
  124 |     await page.click('#bNext');
  125 |     await expect(tela(page, 'char')).toHaveClass(/\bon\b/);
  126 |   });
  127 | 
  128 |   test('o nome e o agente escolhidos vão para o crachá e para o topo', async ({ page }) => {
  129 |     await page.goto('index.html');
  130 |     await page.click('#bPlay');
  131 |     await page.click('#bSkip');
  132 |     await page.click('.avatar[data-a="3"]');
  133 |     await expect(page.locator('#badgeFace')).toHaveAttribute('src', /av3\.webp/);
  134 |     await page.fill('#nameIn', 'Lia');
  135 |     await expect(page.locator('#badgeName')).toHaveText('Lia');
  136 |     await page.click('#bConfirm');
  137 |     await expect(tela(page, 'hub')).toHaveClass(/\bon\b/);
  138 |     await expect(page.locator('#hub .chip.who')).toContainText('Lia');
  139 |   });
  140 | 
  141 |   test('a agente 10 (cabelo cacheado) continua escolhida depois de recarregar', async ({ page }) => {
> 142 |     await page.goto('index.html');
      |                ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  143 |     await page.click('#bPlay');
  144 |     await page.click('#bSkip');
  145 |     await page.click('.avatar[data-a="10"]');
  146 |     await page.fill('#nameIn', 'Bia');
  147 |     await page.click('#bConfirm');
  148 |     await expect(tela(page, 'hub')).toHaveClass(/\bon\b/);
  149 |     await page.reload();
  150 |     await expect(page.locator('#hub .chip.who img, .chip.who img').first()).toHaveAttribute('src', /av10\.webp/);
  151 |   });
  152 | });
  153 | 
  154 | /* ---------------- central (mapa) ---------------- */
  155 | 
  156 | test.describe('central de chamados', () => {
  157 |   test('no começo só a Casa abre, e só o sanduíche', async ({ page }) => {
  158 |     await primeiraVez(page);
  159 |     await expect(page.locator('#progTxt')).toHaveText('0 de 8');
  160 |     await expect(page.locator('#mapa')).toHaveClass(/trancado/);
  161 |     await expect(page.locator('#mapa .lugar:not(.trancado)')).toHaveCount(1);
  162 |     await expect(page.locator('#mapa .lugar:not(.trancado) .lugar-nome')).toHaveText('Casa');
  163 |     await page.locator('#mapa .lugar:not(.trancado)').click();
  164 |     await expect(page.locator('#local .local-aviso')).toBeVisible();
  165 |   });
  166 | 
  167 |   test('depois do sanduíche, a cidade toda abre', async ({ page }) => {
  168 |     await comMemoria(page,
  169 |       { nome: 'Teste', avatar: '0', comecou: true, dicas: 5, concluidos: { sanduiche: true } },
  170 |       { sanduiche: { fase: 5, niveis: [3, 3, 3, 3, 3] } });
  171 |     await page.goto('index.html');
  172 |     await expect(page.locator('#bPlay')).toHaveText('Continuar');
  173 |     await page.click('#bPlay');
  174 |     await expect(tela(page, 'hub')).toHaveClass(/\bon\b/);
  175 |     await expect(page.locator('#mapa')).not.toHaveClass(/trancado/);
  176 |     await expect(page.locator('#mapa .lugar.trancado')).toHaveCount(0);
  177 |     await expect(page.locator('#progTxt')).toHaveText('1 de 8');
  178 |   });
  179 | 
  180 |   test('o álbum e "Meus aprendizados" abrem', async ({ page }) => {
  181 |     await primeiraVez(page);
  182 |     await page.click('#bAlbum');
  183 |     await expect(page.locator('#album')).toHaveClass(/\bon\b/);
  184 |     await page.keyboard.press('Escape');
  185 |     await expect(page.locator('#album')).not.toHaveClass(/\bon\b/);
  186 |     await page.click('#bIdeias');
  187 |     await expect(page.locator('#ideias')).toHaveClass(/\bon\b/);
  188 |     await page.keyboard.press('Escape');
  189 |     await expect(page.locator('#ideias')).not.toHaveClass(/\bon\b/);
  190 |   });
  191 | 
  192 |   test('"Meus aprendizados" tem um selo para cada chamado', async ({ page }) => {
  193 |     await comMemoria(page,
  194 |       { nome: 'Teste', avatar: '0', comecou: true, dicas: 5, concluidos: { sanduiche: true, abelhas: true } },
  195 |       { sanduiche: { fase: 5, niveis: [3, 3, 3, 3, 3] }, abelhas: { fase: 4, niveis: [3, 3, 3, 3] } });
  196 |     await page.goto('index.html');
  197 |     await page.click('#bPlay');
  198 |     await expect(tela(page, 'hub')).toHaveClass(/\bon\b/);
  199 |     const total = await page.evaluate(() => SITUACOES.length);
  200 |     await expect(page.locator('#badgeSelos .selo')).toHaveCount(total);
  201 |     await page.click('#bIdeias');
  202 |     await expect(page.locator('#ideias .ideia')).toHaveCount(total);
  203 |     await expect(page.locator('#ideias .ideia:not(.apagada)')).toHaveCount(2);
  204 |     await expect(page.locator('#ideias .ideia:not(.apagada) b')).toHaveText(['Ordem', 'Algoritmo']);
  205 |   });
  206 | });
  207 | 
  208 | /* ---------------- nível (tabuleiro) ---------------- */
  209 | 
  210 | test.describe('nível', () => {
  211 |   test('o tabuleiro tem um espaço por carta e o Verificar só libera cheio', async ({ page }) => {
  212 |     await primeiraVez(page);
  213 |     await abrirSanduiche(page);
  214 |     const ids = await ordemCerta(page);
  215 |     await expect(page.locator('.tabuleiro-grade .espaco')).toHaveCount(ids.length);
  216 |     await expect(page.locator('.bandeja .carta')).toHaveCount(ids.length);
  217 |     await expect(page.locator('.progresso-texto')).toHaveText(/^Nível 1 de \d+$/);
  218 |     await expect(page.locator('#btn-verificar')).toBeDisabled();
  219 |     await colocar(page, ids.slice(0, -1));
  220 |     await expect(page.locator('#btn-verificar')).toBeDisabled();
  221 |   });
  222 | 
  223 |   test('ordem certa: "Tudo certo!", lição e próximo nível', async ({ page }) => {
  224 |     await primeiraVez(page);
  225 |     await abrirSanduiche(page);
  226 |     await colocar(page, await ordemCerta(page));
  227 |     await expect(page.locator('#btn-verificar')).toBeEnabled();
  228 |     await page.click('#btn-verificar');
  229 |     await expect(page.locator('.verificacao')).toHaveText('Tudo certo!');
  230 |     await expect(tela(page, 'licao')).toHaveClass(/\bon\b/);
  231 |     await expect(page.locator('.premio-estrelas')).toContainText('3');
  232 |     await expect(page.locator('.premio-figurinha')).toBeVisible();
  233 |     // o texto para o professor fica atrás do botão
  234 |     await expect(page.locator('#licao-professor')).toBeHidden();
  235 |     await page.click('.licao-botao-prof');
  236 |     await expect(page.locator('#licao-professor')).toBeVisible();
  237 |     await page.click('.conclusao-continuar');
  238 |     await expect(tela(page, 'fase')).toHaveClass(/\bon\b/);
  239 |     await expect(page.locator('.progresso-texto')).toHaveText(/^Nível 2 de \d+$/);
  240 |   });
  241 | 
  242 |   test('ordem errada: o tabuleiro avisa e a criança continua no nível', async ({ page }) => {
```