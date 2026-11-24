# Algoritimando: contexto para uma nova sessão

Cole este arquivo no começo de uma sessão nova, ou peça para a sessão ler `docs/CONTEXTO-PROJETO.md`, antes de pedir qualquer mudança. Atualizado em 24/11/2026, depois do PR #45 (Cartas no lugar).

## Comece por aqui

- **O que falta fazer:** veja a seção "O que falta", no fim deste arquivo.
- **Regra de ouro do fluxo:** cada mudança vai num PR para o `main`. O dono mergeia rápido, então **confira se o PR já foi mergeado antes de enviar mais commits**. Se já foi, abra um PR novo.
- **A cada mudança publicada:**
  1. atualize o `?v=AAAAMMDDHHMM` no `index.html` e no `editor.html` (e o `const V` em `js/final.js`);
  2. rode `node ferramentas/gerar-sw.js`;
  3. rode `node js/motor.js` (os 9 testes precisam passar).
- **Respostas ao dono:** em português, curtas e fáceis de ler.

## O projeto

- **O que é:** jogo educativo que ensina algoritmos a crianças de 8 a 10 anos (3º ao 5º ano). Moradores de uma cidade pedem ajuda com tarefas do dia a dia. A criança arrasta cartas de passos para espaços numerados, toca em **Verificar** e, se pedir **dica**, o **Robô-guia** explica o primeiro erro.
- **Repositório:** `helder41/algoritimando-1`, branch principal `main`.
- **Site (GitHub Pages):** https://helder41.github.io/algoritimando-1/. Atualiza sozinho 1 a 2 minutos depois de cada merge no `main`. Para ver a versão nova: Ctrl+F5 ou aba anônima. Quem instalou o jogo (PWA) recebe a versão nova na visita seguinte com internet.
- **Tecnologia:** HTML, CSS e JS puros, sem build, servidor nem framework. Abre com dois cliques no `index.html` e funciona sem internet: as fontes estão em `fontes/` e nada é buscado fora do projeto.
- **Testes:**
  - `node js/motor.js` roda os 9 testes do motor;
  - as telas são conferidas com Playwright e Chromium, em scripts temporários que não ficam no repositório;
  - tamanhos usados: PC 1366×768 e 1920×1080, celular 390×844 e celular deitado 844×390;
  - a impressão do certificado é conferida gerando PDF com o Chromium (`page.pdf`), em pé e deitado.

## Decisões de arquitetura (não mudar sem combinar)

1. A resposta certa **não é uma ordem fixa**. Cada passo declara `dependeDe`, e a validação é feita sobre esse grafo, então passos independentes podem vir em qualquer ordem.
2. **Verificação no fim, não erro imediato** (pedido de professor). A criança monta tudo e toca em Verificar. Se estiver errado, o tabuleiro avisa sem dizer qual passo. O Robô-guia só explica quando ela pede dica, e só o **primeiro** erro, terminando na **consequência**, sem entregar a ordem.
3. O jogo **nunca bloqueia** o movimento das cartas.
4. As explicações vêm das regras de dependência (campo `explicacao` por dependência).
5. O arrasto usa **Pointer Events**, nunca drag-and-drop nativo do HTML5.
6. Há **um formato só** de dados para os chamados do jogo e os do professor (`.json`).
7. **Tudo responsivo** (PC e celular) em toda entrega.
8. **Sem emojis** no jogo. Textos em português.
9. **O Robô-guia guia, não é ensinado.** Ele foi feito para ajudar a criança; quem é ajudado são os moradores. Nunca escrever "ensine o robô" ou "ensinando o Robô-guia". A exceção é o nível 4 do sanduíche, em que um *computador* (outro personagem) precisa de instruções claras.
10. **Lições só com cenas positivas.** Nada de "errado x certo" (X vermelho, personagem triste) nas imagens de lição.
11. **A montagem segue a mesma regra do Verificar** (`dependeDe`): ela nunca diz algo diferente do jogo.

## Arquivos principais

| Arquivo | Papel |
|---|---|
| `index.html`, `style.css` | telas: menu, abertura, crachá, mapa, fase, lição, promoção, animação final, tela final e modais |
| `js/motor.js` | formato dos dados (documentado no topo, inclusive os modos de montagem) e validação pelo grafo de dependências |
| `js/situacoes.js` | os 8 chamados do jogo, com a configuração da montagem de cada um |
| `js/jogo.js` | a partida: tabuleiro, Verificar, dica, estrelas e a cena em tela cheia do nível |
| `js/app.js` | menu, abertura, crachá, mapa (`LUGARES`), progresso e promoções, sanduíche obrigatório, agente secreto, atalho de dev, configurações, tela final |
| `js/montagem.js` | a imagem ao lado do tabuleiro: `pilha`, `cena`, `grade`, `estado` (e `tirinha`, sem uso) |
| `js/conclusao.js` | tela de lição (sem imagem, abre direto no texto; mostra "+1 figurinha") |
| `js/album.js` | "Meu álbum": uma figurinha por nível concluído e a página de figurinhas extras |
| `js/final.js` | animação final (7 quadros) e certificado (tela e impressão) |
| `js/pwa.js`, `sw.js`, `manifest.webmanifest`, `img/icones/` | modo instalável e jogo sem internet |
| `ferramentas/gerar-sw.js` | gera o `sw.js` (versão do `?v=` e lista de arquivos) |
| `js/som.js`, `audio/musica-tema.mp3` | música, efeitos sintetizados e painel de configurações |
| `js/perfil.js`, `js/progresso.js` | perfil do agente e progresso por chamado (localStorage) |
| `js/em-progresso.js` | protótipo "Plantar uma semente" (escondido; não vira chamado) |
| `editor.html`, `js/editor.js` | Área do professor: **desativada**, fora do menu |
| `fontes/` | Fredoka e Nunito em WOFF2, com as licenças OFL |
| `IMAGENS.md` | o que existe de imagem e onde aparece |
| `PROMPTS-*.md` | prompts das imagens, todos já gerados, ficam como registro. Os mais recentes: `PROMPTS-REVISAO.md` (lições e semáforo), `PROMPTS-FINAL.md` (animação final) e `PROMPTS-MONTAGEM.md` (peças das bancadas) |
| `docs/revisao-chamados-novos.md` | revisão pedagógica dos chamados novos |
| `docs/referencias/mapa-com-alfinetes.webp` | print do mapa, usado como referência para gerar imagens |

## Os 8 chamados

Todos têm **todas as imagens**: cartas, lições, ilustração do cartão (`picN`), fundo do nível (`levelN`) e fundo da vitória (`winN`).

| Lugar (`area`) | Chamado | Níveis | Ideia | Cliente | Montagem |
|---|---|---|---|---|---|
| Casa (`casa`) | Fazer um sanduíche | 5 | a ordem importa | menino de avental (`who1`, corpo `cliente0`) | `pilha` |
| Casa (`casa`) | Lavar as mãos | 4 | repetição | menino de avental | `estado` |
| Fábrica (`fabrica`) | O robô e o cubo | 5 | passos escondidos | robô laranja (`who2`, `cliente1`) | `grade` |
| Escola (`escola`) | Arrumar a mochila | 4 | instrução | menina de uniforme (`who3`, `cliente2`) | `cena` |
| Jardim (`jardim`) | Ajudar as abelhas | 4 | começo, meio e fim | abelha (`who4`, `cliente3`) | nenhuma |
| Faixa (`faixa`) | Atravessar a rua | 3 | condição | menino de moletom amarelo (`who5`, `cliente4`) | nenhuma |
| Limonada (`limonada`) | Fazer uma limonada | 3 | caminhos paralelos | menino de moletom amarelo | `estado` |
| Casa azul (`casa-azul`) | Escovar os dentes | 4 | o que abre, fecha | menina de pijama coral (`who6`, `cliente5`) | `estado` |

- Os 4 chamados novos dão um **selo** cada um (`img/selos/`): Repetição, Condição, Ao mesmo tempo e Abre e fecha. Os selos aparecem no crachá, em "O que eu aprendi" (botão da central) e na tela final.
- **Semáforo da rua:** de pedestre, com **duas luzes** (vermelha em cima, verde embaixo), sem bonequinho. A criança olha a "cor da luz".

## Como o jogo funciona hoje

**Começo e progresso**
- **Começo obrigatório pelo sanduíche:** até ele ser concluído, o mapa fica na sombra, com um círculo de luz sobre a Casa, e só o sanduíche abre.
- **Promoções:** Estagiário passa a **Agente** com 4 chamados quaisquer e a **Agente Sênior** com os 8.
- **Abertura:** 4 quadros (`story1` a `story4`). Cada quadro passa sozinho em **5 s**, com uma barrinha que enche no tempo; o último espera o botão.
- **Mapa:** alfinetes com o rosto do cliente, posicionados em `LUGARES` (`js/app.js`) em % da imagem `img/story1.webp`. No celular o mapa rola para os lados. No celular deitado, os botões do painel ficam em duas colunas para não cobrir o alfinete do Jardim.

**Durante um nível**
- **Montagem** (ao lado do tabuleiro; no celular, pelo botão "Ver montagem"):
  - `pilha` (sanduíche): as fatias se empilham na ordem dos espaços;
  - `cena` (mochila): as peças entram na cena; fora de ordem, o lápis fica de fora;
  - `grade` (robô, só código): o robô visto de cima anda, vira, abre e fecha a garra. Ele para e marca uma estrela quando bate na parede, empurra o cubo, fecha no vazio ou solta longe; fica cinza com "z z" se estiver desligado;
  - `estado` (limonada, dentes, mãos): uma bancada com objetos que mudam a cada carta. A primeira carta que vem antes da hora para tudo, e uma estrela marca o objeto dela. A configuração fica nos dados do chamado (`montagemObjetos`, `montagemRegras`, `montagemOnde`), e as peças estão em `img/pecas/`.
- **Tela cheia:** o botão "Tela cheia" mostra a cena do chamado inteira.

**Fim de nível e álbum**
- **Lição:** imagem positiva e pergunta. O texto para o professor fica em "Ler a lição". Na primeira vez que o nível é concluído, aparece "+1 figurinha".
- **Meu álbum** (central): uma página por chamado, um espaço por nível. A figurinha nova cola com animação; tocar mostra a figurinha grande.
- **Figurinhas extras:** a última página do álbum guarda as 10 lições antigas "errado x certo" (`img/licoes/comparativas/`) e só abre depois da promoção a Agente.

**Final do jogo**
- **Animação final:** 7 quadros (`fim1` a `fim6` mais o álbum completo, montado pelo jogo), com confete e música na festa e no crachá, e o nome da criança no quadro do crachá. Cada quadro passa em 5 s.
- **Tela final ("Missão cumprida"):** botões "Ver meu álbum", "Meu certificado" e "Rever a animação".
- **Certificado:**
  - **Conteúdo:** nome, as 8 ideias com o chamado de cada uma, estrelas, código do agente e data, com linhas em branco para Professor(a) e Escola. Não tem logo.
  - **Onde abrir:** na tela final e, depois de zerar, no botão **Meu certificado** da central.
  - **Impressão:** uma cópia da folha vai para `#impressao`, direto no `body`, e na impressão só ela aparece. A folha ocupa 80% da largura do papel e sai numa página só, em pé ou deitada. A tela mostra a dica "escolha a folha deitada".

**Outras partes**
- **Configurações:** Música, Efeitos, **Cartas no lugar**, **Tela cheia** (some no iPhone) e **Instalar o jogo** (só pelo site; no iPhone mostra a explicação).
  - **Cartas no lugar** (ideia de uma criança no teste; **ligado de fábrica**): a carta tirada do tabuleiro volta para o mesmo lugar da bandeja, e as outras não se mexem. Desligado, a bandeja se reorganiza como antes. Fica em `algoritimando-ajustes` e é aplicado no `js/arrasto.js`.
- **Modo instalável (PWA):**
  - o ícone é o Robô-guia no roxo do jogo, e o jogo abre em tela cheia;
  - o `sw.js` guarda os 272 arquivos e o jogo funciona sem internet depois da primeira visita;
  - a página tenta a internet primeiro, e a música funciona offline.
- **Crachá** ("Quem é você, agente?"): HTML/CSS, com cargo, estrelas do cargo, selos e código do agente.

## Segredos (só para devs e para quem o dono contar; não divulgar)

- **Agente secreto:**
  - **Como abrir:** 10 toques rápidos (no máximo 0,6 s entre eles) na terceira estrela do crachá.
  - **O que acontece:** libera o 7º agente (avatar `"6"`), com cena dourada e som de mistério.
  - **Onde fica guardado:** na chave `algoritimando-segredo`. Some com "Reiniciar o jogo" (menu) ou "Jogar de novo" (tela final). A central não tem botão de recomeçar, para ninguém zerar tudo sem querer.
- **Atalho de dev:**
  - **Como usar:** no mapa da central, **15 toques na árvore do alto à esquerda** (à esquerda da Fábrica, perto de x 9%, y 38% da `story1`) e, logo depois, **15 toques na casa do canto inferior esquerdo** (perto de x 7%, y 73%).
  - **O que acontece:** conclui os 8 chamados com 3 estrelas e segue as promoções e a animação final.
  - **Regras:** mais de 2,5 s entre toques, toque fora da área ou toque num alfinete zera a contagem.
  - **Onde está:** código em `js/app.js` ("atalho de desenvolvimento no mapa", áreas em `ZONAS`).
  - **Sigilo:** nenhum sinal no jogo, e nada sobre ele em commits ou PRs.

## Padrões técnicos

- **Imagens:** todas em WebP.

  | Tipo | Tamanho |
  |---|---|
  | Cartas | 600×450, transparentes (fundo branco recortado) |
  | Lições | 1200×896 |
  | Fundos (`levelN`, `winN`) | 1600×893 |
  | `picN` | 1240×784 |
  | Quadros da abertura e da animação final | 2000×1116 |
  | Bancadas da montagem (`*-base`) | 1600×1200 |
  | Peças da montagem `estado` | recortadas, até 640 px no lado maior |
  | Retratos `who`/`av` | 300 ou 400 px, quadrados |
  | Corpo inteiro (`cliente`, `agente-*`) | 700 px de altura, transparentes |
  | Selos | 400×400 |

- **Imagens recebidas:** chegam em `.zip` (2K). São convertidas para WebP, recortadas quando são cartas, peças ou personagens, ajustadas ao tamanho e ligadas no código. Os arquivos extraídos ficam numa pasta própria, e o script de conversão roda com `python3 -I`.
- **Nomes:** `img/passos/<chamado>-NN.webp`, `img/licoes/<chamado>-N.webp`, `img/pecas/<chamado>-<objeto>[-estado].webp`.
- **localStorage:**
  - `algoritimando-perfil`, `algoritimando-progresso`, `algoritimando-som`, `algoritimando-som-ajustes`, `algoritimando-montagem`, `algoritimando-segredo`, `algoritimando-album`, `algoritimando-ajustes`;
  - também existem `algoritimando-em-progresso`, `algoritimando-editor-rascunho` e as chaves `algoritimando-previa*`;
  - para limpar tudo, no console: `localStorage.clear(); location.reload();`.
- **Seleção de texto e arrasto de imagens** estão desativados no jogo.
- **Efeitos sonoros:** são gerados por código em `js/som.js` (Web Audio), sem arquivos:
  - `clique`: troca de tela, escolha do rosto e carta no espaço;
  - `acerto`: Verificar certo;
  - `erro`: Verificar errado;
  - `vitoria`: nível concluído, promoções e festa da animação final;
  - `segredo`: agente secreto.

## Fluxo de trabalho

- **PRs:** cada mudança vai num pull request para o `main`, e o dono faz o merge pelo GitHub. Confira se o PR já foi mergeado antes de enviar mais commits; isso já aconteceu várias vezes (#28, #33, #37, #40, #42).
- **Branch:** a sessão só tem permissão de enviar para o próprio branch. Ela não consegue apagar branches no GitHub.
- **Geração de imagens:** o dono usa o **Agent do Google Flow**. Os prompts vão **no formato de lote**:

  ```
  Batch: <nome do lote>. Generate these images, in this order:

  ### <arquivo.webp>
  <prompt inteiro>
  ```

  - Diga também o que anexar como referência.
  - Repita o estilo por extenso em cada imagem: o Flow não entende "(igual ao anterior)".
  - Para mudar só um detalhe, peça uma **edição**, anexando a própria imagem.
  - Não há proporção 3:5 no Flow; use 9:16.
  - Baixe em **2K**.
- **Quando o Flow recusa** ("talvez viole nossas políticas"): é o filtro automático. Gere uma imagem por vez e tire palavras que lembram despedida ou perigo ("goodbye", "ending", "sunset", "children's"). O `fim6` só passou assim.
- **Projeto local:** deve ficar fora do OneDrive, que trava a pasta `.git`. Para ver um branch no PC: `git fetch origin` e depois `git switch <branch>`.

## Preferências do dono

- Não citar a Área do professor (o editor) em textos de divulgação.
- Não inventar oficinas, pilotos, validações ou planos que não existem.
- O jogo passou por **um primeiro teste com uma turma** (nov/2026), e as sugestões da revisão do professor (18/11) vieram dele e da turma. Textos não devem exagerar: foi um teste só, e o impacto ainda é potencial.
- Mudanças visuais grandes no jogo só com pedido explícito.
- **Decisões já tomadas:**
  - Escovar os dentes já foi revisado;
  - **não haverá chamados novos** (o jogo fica com os 8);
  - a Área do professor fica de fora por enquanto;
  - o certificado não tem logo, e a escola fica numa linha em branco.

## Material de apoio (páginas privadas no claude.ai)

O dono recebeu estas páginas. Elas só abrem para quem ele compartilhar:

- **Revisão das imagens novas** (https://claude.ai/artifact/75nFviFh1kc4NCRxgatcb1): lições, semáforo e animação final, com antes e agora, e os códigos L1–L10, S1–S7 e F1–F6 para o professor responder.
- **Sons do jogo** (https://claude.ai/artifact/K1VZ6s6EpzwB5JU3fKxBtJ):
  - cada efeito tocável, separado pelo momento do jogo;
  - os 6 sons que ainda não existem, com nome de arquivo sugerido em `audio/efeitos/`.

## Bahia Tech Experience (BTX 2026)

- **O que é:** exposição na Vitrine Tecnológica da UNEB (Agência de Inovação), de 5 a 7 de dezembro de 2026, no Centro de Convenções de Salvador. O formulário de curadoria já foi respondido.
- **Já entregue ao dono** (fora do repositório):
  - QR code e cartaz A5;
  - vídeo de demonstração de 27 s;
  - 18 capturas de tela.
- **Brilho:** se o vídeo parecer "estourado" num aparelho, é o realce automático de vídeo do aparelho. O arquivo está certo.

## O que falta

**Esperando o dono ou o professor**
1. **Resposta do professor sobre as imagens novas:** os códigos estão na página de revisão. Ajustar o que ele pedir.
2. **Sons:** o dono quer refazer alguns. Quando os arquivos chegarem (MP3 ou OGG, curtos, com os nomes da página de sons), trocar o `js/som.js` para tocar o arquivo, mantendo o som atual como reserva se o arquivo falhar.
   - **Os 6 que ainda não existem:**
     - carta volta para a bandeja (`carta-volta.mp3`);
     - pedir dica (`dica.mp3`);
     - figurinha nova (`figurinha.mp3`);
     - selo conquistado (`selo.mp3`);
     - quadro passando (`quadro.mp3`);
     - certificado (`certificado.mp3`).
   - **Configurações:** o volume e o botão de ligar e desligar valem para todos.
3. **Conferir no iPhone de verdade:**
   - a impressão do certificado na folha deitada, que precisa sair numa página só (se ainda cortar, reduzir a largura de 80% no `style.css`, bloco "na impressão, só o certificado");
   - a instalação pelo botão "Instalar o jogo".
4. **Apagar branches antigos no GitHub** (Code → Branches, lixeira; a sessão não tem permissão): `claude/affectionate-thompson-0v00r7`, `claude/lucid-darwin-3u020f` e `claude/new-session-pxqx2k`.

**Para a BTX (5 a 7/12)**
5. **Refazer o vídeo e as capturas:** foram feitos antes da revisão, então não mostram o álbum, as montagens novas, a animação final, o certificado nem as lições novas.
6. **Ainda possível:** texto para banner, roteiro de apresentação de 1 minuto e vídeo vertical para redes.

**Ideias não feitas**
7. **Montagem para Abelhas e Atravessar a rua:** hoje elas não têm montagem.
8. **Testes automáticos no repositório:** Playwright com GitHub Actions, rodando a cada PR.
9. **Painel de desempenho para o professor:** precisa decidir onde guardar os dados, porque hoje tudo fica só no navegador de cada aluno.
