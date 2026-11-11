# Algoritimando — contexto para uma nova sessão

Cole este arquivo (ou peça para a sessão nova lê-lo em `docs/CONTEXTO-PROJETO.md`) antes de pedir qualquer mudança.

## O projeto

- **O que é:** jogo educativo que ensina algoritmos a crianças de 8 a 10 anos. A criança arrasta cartas de passos para espaços numerados, toca em **Verificar**, e o **Robô-guia** explica o erro quando ela pede **dica**.
- **Repositório:** `helder41/algoritimando-1`; branch principal `main`.
- **Site publicado (GitHub Pages):** https://helder41.github.io/algoritimando-1/ (atualiza sozinho 1–2 min depois de cada merge no `main`).
- **Tecnologia:** HTML/CSS/JS puro, sem build, sem servidor, sem framework. Abre com dois cliques no `index.html`.
- **Testes usados nas sessões:** `node js/motor.js` (9 testes do motor) e Playwright com Chromium (scripts temporários, não ficam no repositório).

## Decisões de arquitetura (não mudar sem combinar)

1. A resposta certa **não é uma ordem fixa**: cada passo declara `dependeDe` (de quais passos depende). A validação é sobre esse grafo; passos independentes podem vir em qualquer ordem.
2. **Verificação, não erro imediato** (pedido do professor): a criança monta tudo, toca em **Verificar**; se estiver errado, o tabuleiro avisa sem dizer qual passo. **O Robô-guia só explica o erro quando a criança pede dica**, e só o **primeiro** erro.
3. O jogo **nunca bloqueia** o movimento das cartas.
4. Explicações vêm das regras de dependência (campo `explicacao` por dependência), nunca de permutações.
5. Arrasto com **Pointer Events** (nunca drag-and-drop nativo do HTML5).
6. **Um formato só** de dados para os chamados do jogo e os do professor (`.json`), salvo/aberto no computador, sem servidor.
7. **Tudo responsivo** (PC e celular) em toda entrega.
8. **Sem emojis** no jogo. Textos em português.

## Arquivos principais

| Arquivo | Papel |
|---|---|
| `index.html`, `style.css` | telas do jogo (menu, abertura, crachá, mapa, fase, lição, promoção, final) |
| `js/motor.js` | formato dos dados (documentado no topo) e validação pelo grafo de dependências |
| `js/situacoes.js` | os 7 chamados do jogo |
| `js/em-progresso.js` | protótipos antigos (seção "Em progresso", senha 6234; botão **escondido** no `index.html`) |
| `js/jogo.js` | a partida: tabuleiro, Verificar, dica, estrelas |
| `js/app.js` | menu, abertura, crachá, **mapa da cidade** (lista `LUGARES` com x/y de cada marcador), promoção, final |
| `js/montagem.js` | imagem que se monta ao lado do tabuleiro: `pilha`, `cena` ou `tirinha` |
| `js/conclusao.js` | tela de lição (imagem + botão "Ler a lição") |
| `js/som.js`, `audio/musica-tema.mp3` | música "Agentes de Algoritimando" e efeitos; painel de sons |
| `editor.html`, `js/editor.js` | Área do professor (fora do menu por enquanto, mas funcionando) |
| `IMAGENS.md` | o que já existe e o que falta de imagem |
| `PROMPTS-CARTAS.md`, `PROMPTS-LICOES.md`, `PROMPTS-PECAS.md` | prompts prontos para gerar as imagens |
| `docs/` | relatórios em PDF e revisão dos chamados novos |

## Chamados e lugares do mapa

| Lugar (campo `area`) | Chamado | Montagem | Imagens |
|---|---|---|---|
| Casa (`casa`) | Fazer um sanduíche (5 níveis) | pilha | completas |
| Fábrica (`fabrica`) | O robô e o cubo (5) | tirinha | completas |
| Escola (`escola`) | Arrumar a mochila (4) | cena | completas |
| Jardim (`jardim`) | Ajudar as abelhas (4) | tirinha | completas |
| Casa azul (`casa-azul`) | Lavar as mãos (4) | tirinha | completas (+ fundos `level5`/`win5`) |
| Faixa (`faixa`) | Atravessar a rua (3) | tirinha | só o fundo da fase (`level6`); prompts adaptados ao menino de moletom amarelo |
| Limonada (`limonada`) | Fazer uma limonada (3) | tirinha | cartas e lições prontas pelo Fable; conferir `IMAGENS.md` |

Mapa: `img/story1.webp` (2000×1116, mapa novo com os 7 lugares). Marcadores são alfinetes pequenos posicionados em `LUGARES` (`js/app.js`), em % da imagem.

## Padrões técnicos

- **Imagens:** todas em **WebP**. Cartas: 600×450, fundo transparente (recorte do fundo branco). Lições: 1200×896. Fundos de fase/vitória: até 1600 px. Nomes: `img/passos/<chamado>-NN.webp`, `img/licoes/<chamado>-N.webp`, `img/levelN.webp`, `img/winN.webp`.
- **Cache:** os `.js`/`.css` e o mapa são carregados com `?v=AAAAMMDDHHMM`. **A cada mudança publicada, atualize esse número** no `index.html`, no `editor.html` (e no `style.css`/`app.js` para `story1.webp` se o mapa mudar), senão o navegador mostra a versão antiga.
- **localStorage:** `algoritimando-perfil`, `algoritimando-progresso`, `algoritimando-som`, `algoritimando-som-ajustes`, `algoritimando-montagem`. Limpar no console: `localStorage.clear(); location.reload();`
- **Menu:** Jogar/Continuar, Sons (painel com música e efeitos, cada um com volume), Como jogar, Ver a história, Reiniciar o jogo (com confirmação). Atalho de som em todas as telas.
- **Seleção de texto e arrasto de imagens** desativados no jogo.

## Fluxo de trabalho

- Cada mudança vai num **pull request** para o `main`; o merge é feito quando o dono pede ("pode fazer o merge") ou pelo próprio GitHub (botão "Merge pull request").
- Imagens novas chegam em `.zip` ou anexadas; são convertidas para WebP, recortadas quando são cartas e aplicadas.
- O dono testa pelo GitHub Pages (inclusive no celular). Depois de um merge: Ctrl+F5 ou aba anônima.
- Projeto local deve ficar **fora do OneDrive** (ele trava a pasta `.git`).
- Respostas em português, curtas e fáceis de ler.

## Pendências

- **PR #20** (marcadores pequenos do mapa + imagem do chamado sem esticar no painel do lugar): aguardando merge.
- **Atravessar a rua:** gerar 6 cartas e 3 lições com os prompts adaptados; fundo da tela de vitória.
- **Retratos** próprios para Casa azul, Faixa e Limonada (hoje repetem o menino da Casa e a menina da Escola).
- Abertura: o quadro 1 usa o mapa novo; os outros quadros são os antigos (alguns sanduíches ainda têm alface, como o balão do nível do sanduíche).
- Ideias levantadas e não feitas: testes automáticos no repositório (Playwright + GitHub Actions), modo offline/instalável, painel de desempenho para o professor.
