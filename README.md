# algoritimando
Algoritimando é um jogo web educativo, feito com HTML, CSS e JavaScript puros e baseado em um protótipo do Figma. O jogador vira um agente da Central de chamados e ajuda um Robô-guia a atender 4 pedidos (Sanduíche, Robô e o cubo, Mochila e Abelhas), arrastando os passos para a ordem correta. Assim, aprende de forma lúdica a pensar em sequência, como um algoritmo. O jogo tem escolha de agente, sistema de estrelas e dicas, sons e uma tela de promoção ao final.

Para jogar, basta abrir o `index.html` no navegador (sem servidor, sem instalação).

## Como funciona

- Cada chamado tem 4 ou 5 níveis, e cada nível tem de 3 a 8 passos. Os passos ficam mais detalhados a cada nível, para mostrar as etapas que a gente pula quando explica algo para outra pessoa.
- A resposta não é uma ordem fixa: cada passo diz de quais outros ele depende (`dependeDe`). Passos que não dependem um do outro podem vir em qualquer ordem, e cada dependência tem a sua explicação para quando a criança erra.
- Na tela de lição, a criança vê uma imagem; o texto fica no botão "Para o professor".
- Montagem: ao lado do tabuleiro, a imagem se monta na ordem das cartas — em **pilha** (o sanduíche vai sendo empilhado; fora de ordem, o queijo aparece por cima do pão fechado) ou em **tirinha** (um quadrinho por passo; no primeiro erro a história trava). No celular ela é opcional, no botão "Ver a montagem", e ocupa o lugar da cena.
- O erro é explicado na hora, pelo Robô-guia, e só o primeiro problema da sequência. A carta nunca é bloqueada: a criança move de novo.
- Depois de cada nível aparece a lição, que liga a atividade ao conceito de algoritmo.
- Estrelas por nível: 3 sem erro, 2 com um erro, 1 com mais (usar dica conta como erro). Cada nível concluído dá +1 dica, e a dica coloca a carta certa no lugar.
- O arrasto usa Pointer Events (mouse, dedo e teclado).
- Os chamados ficam em dados (`js/situacoes.js`), no mesmo formato do `.json` que a Área do professor gera.

## Área do professor

- Abra o `editor.html` (ou use o botão "Área do professor" no menu do jogo → "Criar ou editar").
- O professor escreve os passos na ordem certa, marca em cada passo quais passos precisam vir antes dele e escreve o que o Robô-guia diz se a criança errar. Escolhe também o cenário, as imagens das cartas, a imagem da lição e o texto para o professor.
- "Testar este nível" abre o nível exatamente como a criança verá, sem mexer no progresso do jogo.
- "Salvar arquivo" baixa um `.json` com tudo dentro, inclusive as imagens. Para jogar: menu do jogo → "Área do professor" → "Abrir chamado (.json)".
- Sem servidor e sem nuvem: o arquivo fica no computador do professor.

## Arquivos

| Arquivo | O que faz |
|---|---|
| `js/motor.js` | formato dos dados e validação pelas dependências (`node js/motor.js` roda os testes) |
| `js/situacoes.js` | os 4 chamados, no mesmo formato do `.json` do professor |
| `js/arrasto.js` | arrastar, tocar e teclado |
| `js/jogo.js` | a partida: tabuleiro, erros, estrelas e dicas |
| `js/montagem.js` | a montagem (pilha ou tirinha) ao lado do tabuleiro |
| `js/conclusao.js` | a tela de lição |
| `js/app.js` | menu, abertura, crachá, central, promoção, final e abrir o chamado do professor |
| `editor.html`, `editor.css`, `js/editor.js` | a Área do professor |
| `js/comum.js`, `js/som.js`, `js/progresso.js`, `js/perfil.js` | cartas, sons e memória do jogo |

## Imagens que ainda faltam

As cartas mostram o quadro "ilustração do passo" enquanto a ilustração não existe. A lista completa do que falta desenhar, com o nome de cada arquivo, está em [IMAGENS.md](IMAGENS.md).
